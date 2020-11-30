<template>
    <el-table
        :data="tableData"
        height="250"
        border
        style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="地址">
        </el-table-column>
    </el-table>

    <!-- <div class="" v-if="isShowPagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[3, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div> -->
    

</template>

<script type="text/ecmascript-6">

export default {
    name: "Table-list",
    props: {      
        isShowPagination: {
            type: Boolean,
            default: true,
        },
        total: {
            type: Number,
            default: 50,
        },
        current: {
            type: Number,
            default: 3,
        },
        pageSize: {
            type: Number,
            default: 10,
        },      
    },    
    data() {
        return {
            tableData: [{
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }]
        }
    },
    methods: {
        // 每页显示条数
        handleSizeChange: function() {
            console.log('每页显示条数')
        },
        // 翻页
        handleCurrentChange: function() {
            console.log('翻页')
        }
    } 
}   
</script>

<style lang="scss" scoped>
.buttonGroup {
    background-color: #e1e1e1;
    .button {
        display: inline-block;
        width: 100px;
        height: 100px;
    }
}
</style>
