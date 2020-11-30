<template>
	<div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="16">
                    <el-form :inline="true" :model="search" ref="search" class="searchWarp" size="small">
                        <el-form-item label="站点：" prop="siteName">
                            <el-select v-model="search.siteName" @change="siteOnchange($event)" class="w100">
                                <el-option
                                    v-for="item in search.siteData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>                                              
                        <el-form-item label="类型：" prop="typeDescName">
                            <el-select v-model="search.typeDescName" @change="typeDescOnchange($event)" class="w150">
                                <el-option
                                    v-for="item in search.typeDescData"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>                        
                        <el-form-item label="时间：" prop="date">
                            <el-date-picker
                              v-model="search.date"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="客户ID：" prop="uid">
                            <el-input v-model="search.uid" placeholder="请输入内容" class="w120"></el-input>
                        </el-form-item>
                        <el-form-item label="客户名称：" prop="customerName">
                            <el-input v-model="search.customerName" placeholder="请输入内容" class="w150"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话：" prop="cellphone">
                            <el-input v-model="search.cellphone" placeholder="请输入内容" maxlength="11" class="w120"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="_getSearch">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="info" @click="resetSearchForm('search')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="3">
                    <div class="showPoint">
                        <h2>100000</h2>
                        <p><img class="pointsImg" src="~common/images/points.png">获取积分</p>
                    </div>
                </el-col>
                <el-col :span="5" class="todoWarp">
                    <el-button type="primary" icon="el-icon-download" @click="_getExport" size="small">导出excel</el-button>
                </el-col>
            </el-row>
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
                                width="50">
                            </el-table-column>
                            <el-table-column
                                property="createdTime"
                                label="时间"
                                align="center"
                                width="150"
                                :formatter="formatterDate">                 
                            </el-table-column>
                            <el-table-column
                                property="uid"
                                label="客户ID"
                                align="center"
                                width="120">
                                <template slot-scope="{row}">
                                    {{ row.uid || '--' }}
                                </template>                                
                            </el-table-column>
                            <el-table-column
                                property="customerName"
                                label="客户名称"
                                align="center">
                                <template slot-scope="{row}">
                                    {{ row.customerName || '--' }}
                                </template>                                
                            </el-table-column>
                            <el-table-column
                                property="cellphone"
                                label="联系电话"
                                align="center">
                                <template slot-scope="{row}">
                                    {{ row.cellphone || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="companyCode"
                                label="所属站点"
                                align="center">
                                <template slot-scope="{row}">
                                    {{ row.companyCode || '--' }}
                                </template>                                
                            </el-table-column>
                            <el-table-column
                                property="type"
                                label="类型"
                                align="center"
                                width="150">
                                <template slot-scope="{row}">
                                    {{ row.type || '--' }}
                                </template>                                
                            </el-table-column>
                            <el-table-column
                                property="amount"
                                label="获取积分"
                                align="center">
                                <template slot-scope="{row}">
                                    {{ row.amount || '--' }}
                                </template>                                
                            </el-table-column>
                            <el-table-column
                                property="availableAmount"
                                label="可用积分"
                                align="center">
                                <template slot-scope="{row}">
                                    {{ row.availableAmount || '--' }}
                                </template>                                
                            </el-table-column>
                            <el-table-column
                                property="disabledAmount"
                                label="未入积分"
                                align="center">
                                <template slot-scope="{row}">
                                    {{ row.disabledAmount || '--' }}
                                </template>                                
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="table.pageNum"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="table.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="table.totalPage">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>                              
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { formatDateTimes, today, dateToStamp, deleteBlankSpace } from 'common/js/dom';
    import { getPointRecord, getExport, getDictsData } from 'api/interface';
    export default {
        components: {    //注册组件

        },         
        name: "",
        data() {
            return {
                table: {
                    tableData: [],
                    totalPage: 100,
                    pageSize: 10,
                    pageNum: 1,
                    tableLoading: false,                    
                },
                search: {
                    siteData: [],  // 站点数组
                    siteName: '',  // 选中站点中文名
                    siteValue: '', // 选中站点code
                    typeDescData: [
                        {code: '1',value: '签到抽签赠送',},
                        {code: '2',value: '商品购买赠送',},
                        {code: '3',value: '生日赠送',},
                        {code: '4',value: '商品购买双倍赠送',},
                        {code: '5',value: '完善资料赠送',},
                    ],
                    typeDescName: '',
                    date: ['2018-09-01', today()],
                    uid: '',
                    customerName: '',
                    cellphone: '',
                }                
            }
        },
        created() {
            this._getPointRecord(this.table.pageNum, this.table.pageSize);
        },
        mounted() {

        },
        methods: {
            // 获取表格数据
            _getPointRecord: function(pageNum, pageSize) {
                // 下拉站点
                if(this.search.siteName == ''){
                    var params = {
                        isAll: true,
                        code: 'CompanyCode'
                    }
                    getDictsData(params).then(res=> {
                        this.search.siteData = res.data
                    })
                }

                var params = {
                    uid: deleteBlankSpace(this.search.uid),
                    type: 'ab',
                    companyCode: '',
                    typeDesc: '',
                    startDate: '',
                    endDate: '',
                    customerName: deleteBlankSpace(this.search.customerName),
                    cellphone: deleteBlankSpace(this.search.cellphone),
                    pageNum: pageNum,
                    pageSize: pageSize,
                    export: 'false',
                    nameStr: '',
                    fieldStr: '',
                }
                this.table.tableLoading = true
                getPointRecord(params).then(res => {
                    this.table.tableLoading = false
                    if(res.status == 200) {
                        this.table.tableData = res.data
                        this.table.totalPage = res.pageVO.total
                    }
                })
            },
            // 选择站点
            siteOnchange: function(event) {
                console.log(event)
                this.search.siteValue = event
            },
            // 选择类型
            typeDescOnchange: function(event) {
                console.log(event)
            },
            // 查询条件重置
            resetSearchForm: function(formName) {
                this.$refs[formName].resetFields();
            },
            // 查询
            _getSearch: function() {
                var params = {
                    uid: deleteBlankSpace(this.search.uid),
                    type: 'ab',
                    companyCode: this.search.siteValue,
                    typeDesc: '',
                    startDate: dateToStamp(this.search.date[0]),
                    endDate: dateToStamp(this.search.date[1]),
                    customerName: deleteBlankSpace(this.search.customerName),
                    cellphone: deleteBlankSpace(this.search.cellphone),
                    pageNum: 1,
                    pageSize: this.table.pageSize,
                    export: 'false',
                    nameStr: '',
                    fieldStr: '',
                }
                console.log(params.startDate)
                this.table.tableLoading = true
                getPointRecord(params).then(res => {
                    this.table.tableLoading = false
                    if(res.status == 200) {
                        this.table.tableData = res.data
                        this.table.totalPage = res.pageVO.total
                    }
                })
            },
            // 导出
            _getExport: function() {
                var params = {
                    uid: deleteBlankSpace(this.search.uid),
                    type: 'ab',
                    companyCode: '',
                    typeDesc: '',
                    startDate: '',
                    endDate: '',
                    customerName: deleteBlankSpace(this.search.customerName),
                    cellphone: deleteBlankSpace(this.search.cellphone),
                    pageNum: this.table.pageNum,
                    pageSize: this.table.pageSize,
                    export: 'true',
                    nameStr: '时间,客户ID,客户名称,联系电话,所属站点,类型,获取积分,可用积分,未入积分',
                    fieldStr: 'createdTime,uid,customerName,cellphone,companyCode,type,amount,availableAmount,disabledAmount',
                }
                var exportUrl = '/api/point/pointRecord?export=true&nameStr='+params.nameStr+'&fieldStr='+params.fieldStr+''
                window.location.href = exportUrl            
            },
            // 每页显示条数
            handleSizeChange: function(val) {
                this.pageSize = val
                this._getPointRecord(this.table.pageNum, this.table.pageSize);                
            },
            // 翻页
            handleCurrentChange: function() {
                this.pageNum = val
                this._getPointRecord(this.table.pageNum, this.table.pageSize);                 
            },
            // 格式化日期
            formatterDate: function(row, column) {
                return formatDateTimes(row.createdTime)
            }                     
        }
    }
</script>

<style lang="scss" scoped>
    .searchToolbar {
        .searchWarp {

        }
        .showPoint {
            border-left: 1px solid #ddd;
            margin-top: 15px;
            h2 {
                font-size: 28px;
                color: #0068cf;
            }
            p {
                font-size: 12px;
                color: #999;
                img {
                    display: inline-block;
                    margin-right: 2px;
                    position: relative;
                    top: 3px;
                }
            }
        }
        .todoWarp {

        }
    }
</style>