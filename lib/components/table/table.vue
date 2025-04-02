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

<style lang="scss">
.y-table {
    width: 100%;
    overflow: auto;
    box-shadow: 1px 1px 10px 1px #ccc;
    padding: 4px;
    border-radius: 5px;
    height: 120px;
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
        color: #f00;
        text-align: left;
    }
    thead th:last-child,tbody td:last-child{
        color: rgba(0, 0, 0, .5);
        text-align: right;
    }
}
</style>