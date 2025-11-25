<template>
  <div class="y-table" :class="tableClass" ref="tableRef">
    <!-- 表格容器 -->
    <div class="y-table__container">
      <!-- 表头 -->
      <div class="y-table__header-wrapper" ref="headerWrapper">
        <div class="y-table__header-inner">
          <table class="y-table__header-table" :style="headerTableStyle">
            <colgroup>
              <col
                v-for="column in leafColumns"
                :key="getColumnId(column)"
                :style="{ width: column.width }"
              />
            </colgroup>
            <thead>
              <tr
                v-for="(row, rowIndex) in headerRows"
                :key="rowIndex"
                class="y-table__header-tr"
              >
                <th
                  v-for="(column, colIndex) in row"
                  :key="getColumnId(column)"
                  class="y-table__header-th"
                  :class="getHeaderClass(column)"
                  :style="getHeaderStyle(column, colIndex)"
                  :colspan="column.colspan"
                  :rowspan="column.rowspan"
                  @click="handleSort(column)"
                >
                  <div class="y-table__header-th-content">
                    <span class="y-table__header-th-text">
                      <!-- 复选框列 -->
                      <template v-if="column.type === 'checkbox'">
                        <input
                          type="checkbox"
                          :checked="isAllSelected"
                          @change="handleSelectAll"
                          class="y-table__checkbox"
                          @click.stop
                        />
                      </template>
                      
                      <!-- 其他列统一使用 column.label -->
                      <template v-else>
                        {{ column.label }}
                      </template>
                    </span>
                    <span v-if="column.sortable" class="y-table__sort">
                      <span
                        class="y-table__sort-icon y-table__sort-icon--asc"
                        :class="{ active: sortProp === column.prop && sortOrder === 'asc' }"
                      >↑</span>
                      <span
                        class="y-table__sort-icon y-table__sort-icon--desc"
                        :class="{ active: sortProp === column.prop && sortOrder === 'desc' }"
                      >↓</span>
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      
      <!-- 表体 -->
      <div
        class="y-table__body-wrapper"
        :style="bodyWrapperStyle"
        @scroll="handleBodyScroll"
        ref="bodyWrapper"
      >
        <table class="y-table__body-table" :style="bodyTableStyle">
          <colgroup>
            <col
              v-for="column in leafColumns"
              :key="getColumnId(column)"
              :style="{ width: column.width }"
            />
          </colgroup>
          <tbody>
            <!-- 空状态 -->
            <tr v-if="showEmpty" class="y-table__body-tr y-table__body-tr--empty">
              <td :colspan="leafColumns.length" class="y-table__body-td y-table__body-td--empty">
                <div class="y-table__empty">
                  <slot name="empty">
                    <span class="y-table__empty-text">{{ emptyText }}</span>
                  </slot>
                </div>
              </td>
            </tr>
            
            <!-- 数据行 -->
            <tr
              v-for="(row, index) in currentData"
              :key="getRowKey(row, index)"
              class="y-table__body-tr"
              :class="getRowClass(row, index)"
              @mouseenter="handleRowHover(row, index, true)"
              @mouseleave="handleRowHover(row, index, false)"
              @click="handleRowClick(row, index)"
            >
              <td
                v-for="(column, colIndex) in leafColumns"
                :key="getColumnId(column)"
                class="y-table__body-td"
                :class="getCellClass(column, colIndex)"
                :style="getCellStyle(column, colIndex)"
              >
                <!-- 复选框列 -->
                <template v-if="column.type === 'checkbox'">
                  <input
                    type="checkbox"
                    :checked="row.YOCHECKED"
                    :disabled="row.YODISABLED"
                    @change="(e) => handleCheckboxChange(e.target.checked, row)"
                    class="y-table__checkbox"
                    @click.stop
                  />
                </template>
                
                <!-- 单选框列 -->
                <template v-else-if="column.type === 'radio'">
                  <input
                    type="radio"
                    :name="`table-radio-${column.prop}`"
                    :checked="row.YOCHECKED"
                    :disabled="row.YODISABLED"
                    @change="(e) => handleRadioChange(e.target.checked, row)"
                    class="y-table__radio"
                    @click.stop
                  />
                </template>
                
                <!-- 序号列 -->
                <template v-else-if="column.type === 'numbers'">
                  {{ getIndex(index) }}
                </template>
                
                <!-- 空列 -->
                <template v-else-if="column.type === 'space'">
                  &nbsp;
                </template>
                
                <!-- 插槽列 -->
                <template v-else-if="hasSlot(column.prop)">
                  <slot
                    :name="column.prop"
                    :row="row"
                    :column="column"
                    :index="index"
                    :value="getCellValue(row, column)"
                  ></slot>
                </template>
                
                <!-- 常规列内容 -->
                <template v-else>
                  {{ getCellValue(row, column) }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, useSlots, onMounted, onUpdated, useTemplateRef } from 'vue'

defineOptions({ name: 'y-table' })

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  stripe: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  },
  height: [String, Number],
  maxHeight: [String, Number],
  highlightCurrentRow: {
    type: Boolean,
    default: false
  },
  selectionMode: {
    type: String,
    default: 'multiple',
    validator: val => ['single', 'multiple'].includes(val)
  },
  indexOffset: {
    type: Number,
    default: 1
  },
  // 新增 hover 高亮配置
  enableHover: {
    type: Boolean,
    default: true
  },
  hoverColor: {
    type: String,
    default: '#f5f5f5'
  },
  selectedColor: {
    type: String,
    default: '#e6f7ff'
  }
})

const emit = defineEmits([
  'update:selectedRows',
  'select',
  'select-all',
  'row-click',
  'row-hover',
  'sort-change',
  'scroll'
])

// 使用 useTemplateRef
const tableRef = useTemplateRef('tableRef')
const headerWrapper = useTemplateRef('headerWrapper')
const bodyWrapper = useTemplateRef('bodyWrapper')

// 获取插槽
const slots = useSlots()

// 响应式数据
const sortProp = ref('')
const sortOrder = ref('')
const bodyScrollLeft = ref(0)
const selectedRows = ref([])
const rowKeyMap = ref(new Map())
const columnIdMap = ref(new WeakMap())
// 新增：hover 状态
const hoveredRow = ref(null)
const hoveredRowIndex = ref(-1)

// 计算属性
const tableClass = computed(() => [
  'y-table',
  {
    'y-table--stripe': props.stripe,
    'y-table--border': props.border,
    'y-table--has-hover': props.enableHover && isHovered.value
  }
])

const showEmpty = computed(() => props.data.length === 0)
const isHovered = computed(() => hoveredRow.value !== null)

// 表格总宽度计算
const tableTotalWidth = computed(() => {
  let totalWidth = 0
  leafColumns.value.forEach(column => {
    const width = parseFloat(column.width) || 0
    totalWidth += width
  })
  return totalWidth
})

const headerTableStyle = computed(() => ({
  width: `${tableTotalWidth.value}px`,
  minWidth: '100%'
}))

const bodyTableStyle = computed(() => ({
  width: `${tableTotalWidth.value}px`,
  minWidth: '100%'
}))

const bodyWrapperStyle = computed(() => {
  const style = {}
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.maxHeight) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }
  return style
})

// 获取所有叶子节点列
const leafColumns = computed(() => {
  const leaves = []
  
  const collectLeaves = (columns) => {
    columns.forEach(col => {
      if (col.children && col.children.length > 0) {
        collectLeaves(col.children)
      } else {
        const leaf = {
          type: 'normal',
          ...col
        }
        leaves.push(leaf)
      }
    })
  }
  
  collectLeaves(props.columns)
  return leaves
})

// 生成表头行数据（多级表头）
const headerRows = computed(() => {
  const rows = []
  
  // 计算最大深度
  const getMaxDepth = (columns) => {
    let maxDepth = 1
    columns.forEach(col => {
      if (col.children) {
        const depth = 1 + getMaxDepth(col.children)
        maxDepth = Math.max(maxDepth, depth)
      }
    })
    return maxDepth
  }
  
  const maxDepth = getMaxDepth(props.columns)
  
  // 初始化所有行
  for (let i = 0; i < maxDepth; i++) {
    rows[i] = []
  }
  
  // 生成表头行
  const buildRows = (columns, currentRow = 0, startCol = 0) => {
    let colIndex = startCol
    
    columns.forEach(column => {
      if (column.children && column.children.length > 0) {
        // 父节点
        const leafCount = getLeafCount(column.children)
        rows[currentRow].push({
          ...column,
          colspan: leafCount,
          rowspan: 1
        })
        
        // 递归处理子节点
        buildRows(column.children, currentRow + 1, colIndex)
        colIndex += leafCount
      } else {
        // 叶子节点
        rows[currentRow].push(column)
        
        // 填充占位符
        for (let row = currentRow + 1; row < maxDepth; row++) {
          if (!rows[row][colIndex]) {
            rows[row][colIndex] = {
              label: '',
              colspan: 1,
              rowspan: 1,
              isPlaceholder: true
            }
          }
        }
        colIndex++
      }
    })
  }
  
  // 计算叶子节点数量
  const getLeafCount = (columns) => {
    let count = 0
    columns.forEach(col => {
      if (col.children) {
        count += getLeafCount(col.children)
      } else {
        count++
      }
    })
    return count
  }
  
  buildRows(props.columns)
  return rows
})

const currentData = computed(() => {
  let data = [...props.data]
  
  // 排序
  if (sortProp.value && sortOrder.value) {
    data.sort((a, b) => {
      const aVal = getCellValue(a, { prop: sortProp.value })
      const bVal = getCellValue(b, { prop: sortProp.value })
      
      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  
  return data
})

const isAllSelected = computed(() => {
  return props.data.length > 0 && props.data.every(row => row.YOCHECKED)
})

// 方法
const getColumnId = (column) => {
  if (!columnIdMap.value.has(column)) {
    columnIdMap.value.set(column, crypto.randomUUID())
  }
  return columnIdMap.value.get(column)
}

const hasSlot = (slotName) => {
  return !!slots[slotName]
}

// 为数据行添加属性
const ensureRowProperties = (row, index) => {
  if (!row.YOUUID) {
    row.YOUUID = crypto.randomUUID()
  }
  
  if (row.YOCHECKED === undefined) {
    row.YOCHECKED = false
  }
  
  if (row.YODISABLED === undefined) {
    row.YODISABLED = false
  }
  
  return row.YOUUID
}

const getRowKey = (row, index) => {
  return ensureRowProperties(row, index)
}

const getCellValue = (row, column) => {
  return row[column.prop] || ''
}

const getIndex = (index) => {
  return index + props.indexOffset
}

const isSelected = (row) => {
  return row.YOCHECKED
}

const isHoveredRow = (row) => {
  return hoveredRow.value === row
}

// 表头样式
const getHeaderClass = (column) => {
  return [
    `y-table__header-th--${column.align || 'center'}`,
    {
      'y-table__header-th--sortable': column.sortable && !column.children && !column.isPlaceholder,
      'y-table__header-th--group': column.children,
      'y-table__header-th--placeholder': column.isPlaceholder
    }
  ]
}

const getHeaderStyle = (column, colIndex) => {
  const style = {}
  if (column.width) style.width = column.width
  return style
}

// 行样式 - 新增 hover 和 selected 状态
const getRowClass = (row, index) => [
  {
    'y-table__body-tr--striped': props.stripe && index % 2 === 1,
    'y-table__body-tr--selected': isSelected(row),
    'y-table__body-tr--hover': isHoveredRow(row) && props.enableHover,
    'y-table__body-tr--clickable': props.highlightCurrentRow
  }
]

// 单元格样式
const getCellClass = (column, colIndex) => [
  `y-table__body-td--${column.align || 'left'}`
]

const getCellStyle = (column, colIndex) => {
  const style = {}
  if (column.width) style.width = column.width
  return style
}

// 事件处理
const handleCheckboxChange = (checked, row) => {
  if (row.YODISABLED) return
  
  row.YOCHECKED = checked
  
  if (checked) {
    selectedRows.value.push(row)
  } else {
    const index = selectedRows.value.findIndex(
      selectedRow => selectedRow.YOUUID === row.YOUUID
    )
    if (index > -1) {
      selectedRows.value.splice(index, 1)
    }
  }
  
  emit('update:selectedRows', selectedRows.value)
  emit('select', selectedRows.value, row)
}

const handleRadioChange = (checked, row) => {
  if (row.YODISABLED) return
  
  if (checked) {
    // 取消其他行的选中
    props.data.forEach(dataRow => {
      if (dataRow.YOUUID !== row.YOUUID) {
        dataRow.YOCHECKED = false
      }
    })
    
    row.YOCHECKED = true
    selectedRows.value = [row]
  } else {
    row.YOCHECKED = false
    selectedRows.value = []
  }
  
  emit('update:selectedRows', selectedRows.value)
  emit('select', selectedRows.value, row)
}

const handleSelectAll = (e) => {
  const checked = e.target.checked
  
  props.data.forEach(row => {
    if (!row.YODISABLED) {
      row.YOCHECKED = checked
    }
  })
  
  if (checked) {
    selectedRows.value = props.data.filter(row => !row.YODISABLED)
  } else {
    selectedRows.value = []
  }
  
  emit('update:selectedRows', selectedRows.value)
  emit('select-all', selectedRows.value)
}

// 新增：行 hover 事件
const handleRowHover = (row, index, isHover) => {
  if (!props.enableHover) return
  
  if (isHover) {
    hoveredRow.value = row
    hoveredRowIndex.value = index
  } else {
    hoveredRow.value = null
    hoveredRowIndex.value = -1
  }
  
  emit('row-hover', {
    row: row,
    index: index,
    isHover: isHover
  })
}

const handleSort = (column) => {
  if (!column.sortable || column.children || column.isPlaceholder) return
  
  if (sortProp.value === column.prop) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortProp.value = column.prop
    sortOrder.value = 'asc'
  }
  
  emit('sort-change', { prop: sortProp.value, order: sortOrder.value })
}

const handleRowClick = (row, index) => {
  event?.stopPropagation()
  
  if (props.highlightCurrentRow) {
    if (props.selectionMode === 'single') {
      handleRadioChange(!row.YOCHECKED, row)
    } else {
      handleCheckboxChange(!row.YOCHECKED, row)
    }
  }
  
  emit('row-click', row, index)
  
  // 同步表头和表体
  nextTick(() => {
    syncHeaderAndBody()
  })
}

const handleBodyScroll = (event) => {
  bodyScrollLeft.value = event.target.scrollLeft
  emit('scroll', { scrollLeft: bodyScrollLeft.value, scrollTop: event.target.scrollTop })
  
  // 同步表头滚动
  nextTick(() => {
    if (headerWrapper.value) {
      const headerInner = headerWrapper.value.querySelector('.y-table__header-inner')
      if (headerInner) {
        headerInner.scrollLeft = bodyScrollLeft.value
      }
    }
  })
}

// 同步表头和表体
const syncHeaderAndBody = () => {
  nextTick(() => {
    if (bodyWrapper.value && headerWrapper.value) {
      const bodyTable = bodyWrapper.value.querySelector('.y-table__body-table')
      const headerTable = headerWrapper.value.querySelector('.y-table__header-table')
      
      if (bodyTable && headerTable) {
        const tableWidth = `${tableTotalWidth.value}px`
        bodyTable.style.width = tableWidth
        headerTable.style.width = tableWidth
      }
    }
  })
}

// 监听数据变化
watch(() => props.data, (newData) => {
  newData.forEach((row, index) => {
    ensureRowProperties(row, index)
  })
}, { deep: true, immediate: true })

// 组件挂载和更新
onMounted(() => {
  nextTick(() => {
    syncHeaderAndBody()
  })
})

onUpdated(() => {
  nextTick(() => {
    syncHeaderAndBody()
  })
})

// 暴露方法
defineExpose({
  clearSelection: () => {
    props.data.forEach(row => {
      row.YOCHECKED = false
    })
    selectedRows.value = []
    emit('update:selectedRows', [])
  },
  getSelectedRows: () => selectedRows.value,
  setRowChecked: (row, checked) => {
    if (row.YODISABLED) return
    
    if (props.selectionMode === 'single') {
      if (checked) {
        props.data.forEach(dataRow => {
          if (dataRow.YOUUID !== row.YOUUID) {
            dataRow.YOCHECKED = false
          }
        })
        row.YOCHECKED = true
        selectedRows.value = [row]
      } else {
        row.YOCHECKED = false
        selectedRows.value = []
      }
    } else {
      row.YOCHECKED = checked
      if (checked) {
        selectedRows.value.push(row)
      } else {
        const index = selectedRows.value.findIndex(
          selectedRow => selectedRow.YOUUID === row.YOUUID
        )
        if (index > -1) {
          selectedRows.value.splice(index, 1)
        }
      }
    }
    
    emit('update:selectedRows', selectedRows.value)
  },
  setRowDisabled: (row, disabled) => {
    row.YODISABLED = disabled
    if (disabled && row.YOCHECKED) {
      row.YOCHECKED = false
      const index = selectedRows.value.findIndex(
        selectedRow => selectedRow.YOUUID === row.YOUUID
      )
      if (index > -1) {
        selectedRows.value.splice(index, 1)
        emit('update:selectedRows', selectedRows.value)
      }
    }
  },
  getRowUUID: (row) => row.YOUUID
})
</script>

<style scoped>
.y-table {
  width: 100%;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.y-table--border {
  border: 1px solid #e0e0e0;
}

.y-table--stripe .y-table__body-tr:nth-child(even) {
  background: #fafafa;
}

.y-table--stripe .y-table__body-tr:nth-child(even) .y-table__body-td {
  background: #fafafa;
}

.y-table__container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 表头样式 */
.y-table__header-wrapper {
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  overflow: hidden;
  position: relative;
  z-index: 20;
}

.y-table__header-inner {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.y-table__header-inner::-webkit-scrollbar {
  display: none;
}

.y-table__header-table {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.y-table__header-tr {
  height: 40px;
}

.y-table__header-th {
  padding: 12px 8px;
  font-weight: 600;
  text-align: center;
  color: #333;
  border: 1px solid #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #fafafa;
}

.y-table--border .y-table__header-th {
  border: 1px solid #e0e0e0;
}

.y-table__header-th--left {
  text-align: left;
}

.y-table__header-th--center {
  text-align: center;
}

.y-table__header-th--right {
  text-align: right;
}

.y-table__header-th--sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.y-table__header-th--sortable:hover {
  background: #f0f0f0;
}

.y-table__header-th--group {
  background: #f5f5f5;
  font-weight: bold;
}

.y-table__header-th--placeholder {
  background: #fafafa;
  border-color: #f0f0f0;
}

.y-table__header-th-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.y-table__header-th-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.y-table__sort {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
  flex-shrink: 0;
}

.y-table__sort-icon {
  font-size: 12px;
  color: #999;
  line-height: 1;
  transition: color 0.2s;
}

.y-table__sort-icon.active {
  color: #1890ff;
  font-weight: bold;
}

/* 表体样式 */
.y-table__body-wrapper {
  width: 100%;
  overflow: auto;
  position: relative;
  flex: 1;
}

.y-table__body-table {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.y-table__body-tr {
  height: 40px;
  transition: background-color 0.3s ease;
  cursor: default;
}

/* 关键修复：hover 高亮效果 */
.y-table__body-tr:hover {
  background: v-bind('props.hoverColor') !important;
}

.y-table__body-tr:hover .y-table__body-td {
  background: v-bind('props.hoverColor') !important;
}

/* 关键修复：选中行高亮效果 */
.y-table__body-tr--selected {
  background: v-bind('props.selectedColor') !important;
}

.y-table__body-tr--selected .y-table__body-td {
  background: v-bind('props.selectedColor') !important;
}

/* 关键修复：hover 状态高亮 */
.y-table__body-tr--hover {
  background: v-bind('props.hoverColor') !important;
}

.y-table__body-tr--hover .y-table__body-td {
  background: v-bind('props.hoverColor') !important;
}

/* 关键修复：选中状态的 hover 效果 */
.y-table__body-tr--selected:hover {
  background: #d4edff !important;
}

.y-table__body-tr--selected:hover .y-table__body-td {
  background: #d4edff !important;
}

.y-table__body-tr--striped {
  background: #fafafa;
}

.y-table__body-tr--striped .y-table__body-td {
  background: #fafafa;
}

.y-table__body-tr--striped:hover {
  background: v-bind('props.hoverColor') !important;
}

.y-table__body-tr--striped:hover .y-table__body-td {
  background: v-bind('props.hoverColor') !important;
}

.y-table__body-tr--striped.y-table__body-tr--selected {
  background: v-bind('props.selectedColor') !important;
}

.y-table__body-tr--striped.y-table__body-tr--selected .y-table__body-td {
  background: v-bind('props.selectedColor') !important;
}

.y-table__body-tr--clickable {
  cursor: pointer;
}

.y-table__body-td {
  padding: 12px 8px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  border-right: 1px solid #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: white;
  text-align: left;
  transition: background-color 0.3s ease;
}

.y-table--border .y-table__body-td {
  border: 1px solid #f0f0f0;
}

.y-table__body-td:last-child {
  border-right: none;
}

.y-table__body-td--left {
  text-align: left;
}

.y-table__body-td--center {
  text-align: center;
}

.y-table__body-td--right {
  text-align: right;
}

/* 复选框和单选框 */
.y-table__checkbox,
.y-table__radio {
  cursor: pointer;
}

.y-table__checkbox:disabled,
.y-table__radio:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 空状态 */
.y-table__body-tr--empty .y-table__body-td--empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

.y-table__empty-text {
  font-size: 14px;
}
</style>