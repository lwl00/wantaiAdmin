<template>
    <el-row :gutter="20" class="">
        <el-col :span="24">    
            <div class="cmyyTable">
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%"
                    v-loading="loading">
                    <el-table-column
                        type="index"
                        :index="getIndex"
                        width="50"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        label="修改时间"
                        align="center"
                        :formatter="formatterOperationDate">
                    </el-table-column>
                    <el-table-column
                        prop="modifier"
                        label="修改人"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="propertyName"
                        label="修改字段"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="operationDesc"
                        label="修改内容"
                        align="center">
                    </el-table-column>
                </el-table>
            </div>

            <div class="">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-col>
    </el-row>
</template>

<script type="text/ecmascript-6">
    import { formatDateTimes } from 'common/js/dom';
    import { getHishory } from 'api/interface';
    export default {
        name: "Table-list",
        props: {
            entity: {
                type: String,
                default: '',
            },
            property: {
                type: String,
                default: '',
            },
            targetId: {
                type: String,
                default: '',
            },
            operator: {
                type: String,
                default: '',
            }
        },    
        data() {
            return {
                loading: true,
                tableData: [],
                total: 20,
                pageNum: 1,
                pageSize: 20,
            }
        },
        created() {
            // 积分规则 
            // 通用礼品 
            // 积分礼品 PointGift    18
            // 优惠券 CouponType    48
            // 角色管理 Role    191
            // 用户管理 User    4
            this._getHishory(this.pageNum, this.pageSize)            
        },        
        methods: {  
            // 获取操作历史数据
            _getHishory: function(pageNum, pageSize) {
                var params = {
                    entity: this.entity,
                    property: '',
                    targetId: this.targetId,
                    operator: '',
                    pageNum: pageNum,
                    pageSize: pageSize,
                }

                this.loading = true;
                getHishory(params).then( res => {
                    this.loading = false;
                    if(res.status == 200) {
                        this.tableData = res.data
                        this.total = res.pageVO.total
                    }else {
                        this.$message({
                            message: '请求数据错误',
                            type: 'error'
                        })
                    }
                })            
            },
            // 每页显示条数
            handleSizeChange: function(val) {
                this.pageSize = val
                this._getHishory(this.pageNum, this.pageSize)                
            },
            // 翻页
            handleCurrentChange: function(page) {
                this.pageNum = page
                this._getHishory(this.pageNum, this.pageSize)
            },
            // 格式化日期--修改时间
            formatterOperationDate: function(row, column) {
                return formatDateTimes(row.operationDate)
            },
            //分页序号
            getIndex: function(index) {      
                return (this.pageNum - 1) * this.pageSize + index + 1
            },                          
        } 
    }   
</script>

<style lang="scss" scoped>
    
</style>
