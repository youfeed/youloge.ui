<template>
    <div class="y-table">
        <!-- <div class="table-head">
            <table>
                <thead>
                    <tr>
                        <th v-for="column in props.columns" :key="column.key">{{column.title}}</th>
                    </tr>
                </thead>
            </table>
        </div> -->
        <div class="table-body">
            <table>
                <thead style="position: sticky;top: 0;" class="bg-light-50 pt-[-4px]">
                    <tr>
                        <th v-for="column in props.columns" :key="column.key">{{column.title}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in props.data" :key="item" class="hover:bg-light-50">
                        <td v-for="column in props.columns" :key="column.key">{{ item[column.key] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-foot">
            <div class="pagination"></div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, reactive, ref, toRefs } from 'vue'
const props = defineProps({
    // label,props,emits
    columns:{
        type:Array,
        default:()=>[]
    },
    data:{
        type:Array,
        default:()=>[]
    },
    stripe:Boolean,
    border:Boolean,
    size:{
        type:String,
        default:'md'
    },
    height:{}
}),emits = defineEmits([

]),{ } = toRefs(props);
// 表单数据
const tableTitle = computed(()=>{
    const arr = props.data.map((item) => Object.keys(item))
    
});
console.log(props.data)


</script>

<style lang="less">
.y-table {
    width: 100%;
    overflow: auto;
    padding: 4px;
    color: #222;
    border: 1px solid #eee;
    border-radius: 5px;
    table{
        width: 100%;
    }
    tr:nth-child(even){
        background-color: #eee;
    }
    thead th,tbody td{
        text-align: center;
    }
    thead th:first-child,tbody td:first-child{
        text-align: left;
        padding-left: 2%;
    }
    thead th:last-child,tbody td:last-child{
        text-align: right;
        padding-right: 2%;
    }
}
</style>