<template>
    <el-row :gutter="20" class="">
        <el-col :span="24">
            <div class="cmyyTable">
                <el-table
                    :data="table.tableData"
                    stripe
                    highlight-current-row
                    v-loading="table.tableLoading">
                    <el-table-column
                        type="index"
                        :index="getIndex"
                        width="50"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        property="drawTime"
                        label="时间"
                        align="center">                 
                    </el-table-column>
                    <el-table-column
                        property="winGift"
                        label="获得奖品"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        property="activityName"
                        label="渠道"
                        align="center">
                    </el-table-column>  
                    <!-- <el-table-column
                        property=""
                        label="状态"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        property="remark"
                        label="备注"
                        align="center">
                    </el-table-column> -->
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="table.pageNum"
                    :page-sizes="[20, 50, 100]"
                    :page-size="table.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.totalPage">
                </el-pagination>
            </div>
        </el-col>
    </el-row>      
</template>

<script type="text/ecmascript-6">
    import { formatDateTimes, dateToStamp, deleteBlankSpace, onlineDateTime, todayEndTime } from 'common/js/dom';
    import { getPrizeRecord } from 'api/interface';
    export default {   
        name: "",    
        data() {
            return {
                table: {
                    tableData: [],
                    totalPage: 20,
                    pageSize: 20,
                    pageNum: 1,
                    tableLoading: false,                    
                }, 
            }
        },
        created() {
            this._getPrizeRecord(this.table.pageNum, this.table.pageSize);
        },        
        methods: {
            // 获取数据
            _getPrizeRecord: function(pageNum, pageSize) {
                var params = {
                    uid: this.$route.query.uid,
                    pageNum: pageNum,
                    pageSize: pageSize,
                    export: false,
                    nameStr: '',
                    fieldStr: '',
                }

                this.table.tableLoading = true
                getPrizeRecord(params).then(res=> {
                    this.table.tableLoading = false
                    if(res.status == 200) {
                        this.table.tableData = res.data.data
                        this.table.totalPage = res.pageVO.total
                    }
                })
            }, 
            // 每页显示条数
            handleSizeChange: function(val) {
                this.table.pageSize = val
                this._getPrizeRecord(this.table.pageNum, this.table.pageSize);                
            },
            // 翻页
            handleCurrentChange: function(val) {
                this.table.pageNum = val
                this._getPrizeRecord(this.table.pageNum, this.table.pageSize);                 
            },
            //分页序号
            getIndex: function(index) {      
                return (this.table.pageNum - 1) * this.table.pageSize + index + 1
            },             
            // 格式化日期
            formatterDate: function(row, column) {
                console.log(row)
                return formatDateTimes(row.drawTime)
            },                         

        } 
    }   
</script>

<style lang="scss" scoped>

</style>
