<template>
   <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="21">
                    <el-form :inline="true" :model="search" ref="search" class="searchWarp" size="small">
                        <el-form-item label="站点：" prop="siteValue">
                            <el-select v-model="search.siteValue" class="w100">
                                <el-option
                                    v-for="item in search.siteData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发送计划：" prop="sendNowValue">
                            <el-select v-model="search.sendNowValue" class="w100">
                                <el-option
                                    v-for="item in search.sendNowData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发送状态：" prop="sendStatusValue">
                            <el-select v-model="search.sendStatusValue" class="w100">
                                <el-option
                                    v-for="item in search.sendStatusData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发送时间：" prop="sendTime">
                            <el-date-picker
                              v-model="search.sendTime"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>     
                        <el-form-item label="操作人员：" prop="creatorName">
                            <el-select v-model="search.creatorName" class="w100">
                                <el-option
                                    v-for="item in search.creatorData"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="券类型编号：" prop="couponTypeCode">
                            <el-input
                                v-model="search.couponTypeCode"
                                placeholder="请输入券类型编号"
                                class="w150"
                                @keyup.enter.native="_getSearch"></el-input>
                        </el-form-item>
                        <el-form-item label="备注：" prop="remark">
                            <el-input
                                v-model="search.remark"
                                placeholder="请输入备注"
                                class="w150"
                                @keyup.enter.native="_getSearch"></el-input>
                        </el-form-item>
                        <el-form-item label="适用平台：" prop="applicationValue">
                            <el-select v-model="search.applicationValue" class="w100">
                                <el-option
                                    v-for="item in search.applicationData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="适用商品：" prop="applyProductTypesValue">
                            <el-select v-model="search.applyProductTypesValue" class="w100">
                                <el-option
                                    v-for="item in search.applyProductTypesData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>                                                

                        <el-form-item>
                            <el-button type="primary" @click="_getSearch">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="info" @click="resetSearchForm('search')">重置</el-button>
                        </el-form-item>                        
                        
                    </el-form>            
                </el-col>
                <el-col :span="3" class="todoWarp">
                    <el-button type="primary" icon="el-icon-download" size="small" @click="_getExport">导出excel</el-button>
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
                                width="50"
                                :index="getIndex"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="券类型编号"
                                align="center"
                                width="150">  
                                <template slot-scope="{row}">
                                    <span class="mianColor routerLink" @click="routerLinkPage('/coupons/CouponsDetail?couponTypeCode='+row.couponTypeCode+'')">{{row.couponTypeCode}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="companyName"
                                label="站点"
                                align="center"
                                width="100">                 
                            </el-table-column>
                            <el-table-column
                                property="remark"
                                label="备注"
                                align="center"
                                width="100">                 
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="发送计划"
                                align="center"
                                width="100"> 
                                <template slot-scope="{row}">
                                    {{row.sendNow ? '即时发送': '定时发送'}}
                                </template>        
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="发送时间"
                                align="center"
                                width="150"
                                :formatter="formatterDateSendTime">                 
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="发送状态"
                                align="center"
                                width="150">
                                <template slot-scope="{row}">
                                    {{row.sendStatus ? '已发送': '待发送'}}
                                </template>                  
                            </el-table-column>
                            <el-table-column
                                property="creator"
                                label="操作人"
                                align="center"
                                width="150">                  
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="赠送客户"
                                align="center"
                                width="150">
                                <template slot-scope="{row}">
                                    {{row.applyUserTypesName}}
                                    <span class="mianColor routerLink" @click="customersDialogShow(row)" v-if="row.applyUserTypes == '4'">{{row.viewUserSize}}</span>
                                    <span v-if="row.applyUserTypes == '0'">{{row.issuedQuantity}}</span>

                                </template>                                                  
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="已使用"
                                align="center"
                                width="150">
                                <template slot-scope="{row}">
                                    <span class="mianColor routerLink" @click="">{{row.usedQuantity}}</span>
                                </template>                                                  
                            </el-table-column>
                            <el-table-column
                                property="deduction"
                                label="优惠金额"
                                align="center"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                property="premisPrice"
                                label="起用金额"
                                align="center"
                                width="100">                 
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="适用商品"
                                align="center"
                                width="150">
                                <template slot-scope="{row}">
                                    {{ row.applyProductTypesName || '--'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="application"
                                label="适用平台"
                                align="center"
                                width="100">
                            </el-table-column> 
                            <el-table-column
                                property=""
                                label="有效时间"
                                align="center"
                                width="150"
                                :formatter="formatterEffectiveDays">            
                            </el-table-column> 
                            <el-table-column
                                property="couponTypeName"
                                label="使用描述"
                                align="center"
                                width="200">
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="操作"
                                align="center"
                                width="200">
                                <template slot-scope="{row}">
                                    <el-button 
                                        type="primary" 
                                        size="mini" 
                                        @click="routerLinkPage('/coupons/CouponsDetail?couponTypeCode='+row.couponTypeCode+'')">查看</el-button>
                                    <el-button 
                                        size="mini"
                                        v-if="!row.sendStatus"
                                        @click="routerLinkPage('/coupons/CouponsEdit?couponTypeCode='+row.couponTypeCode+'')">修改发送时间</el-button>
                                </template>                                                
                            </el-table-column>
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
        </div>

        <!-- 客户列表弹窗 -->
        <dialogModel class="customersDialog-model" ref="customersDialog-model" :title="dialog.customersDialogTitle" :width="dialog.customersDialogWidth">
            <div class="dialog-model-content">
                <p class="dialogNote">以下客户可获取此优惠券抵扣订单金额  已上传 <b class="errorColor">{{dialog.viewUserSize}}</b> 位客户</p>
                <div class="cmyyTable">
                    <el-table
                        :data="dialog.customersDialogData"
                        stripe
                        height="350"
                        highlight-current-row
                        v-loading="dialog.customersDialogLoading">
                        <el-table-column
                            property="uid"
                            label="客户编号"
                            align="center">                 
                        </el-table-column>
                        <el-table-column
                            property="customerName"
                            label="客户名称"
                            align="center">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('customersDialog-model')">关闭</el-button>
            </div>
        </dialogModel>         
    </div>
</template>

<script type="text/ecmascript-6">
    import Dialog from 'base/Dialog';
    import { formatDateSearch, formatDateTimes, dateToStamp, deleteBlankSpace, onlineDateTime, todayEndTime } from 'common/js/dom';
    import { getDictsData, getCouponsGiving, getCouponCreator, getApplyUserTypesView } from 'api/interface';

    export default {
        components: {
            'dialogModel': Dialog,
        },     
        name: "CouponsGiving",    
        data() {
            return {
                table: {
                    tableData: [],
                    totalPage: 20,
                    pageSize: 20,
                    pageNum: 1,
                    tableLoading: false,                    
                },
                search: {
                    siteData: [],  // 站点数组
                    siteName: '',  // 选中站点中文名
                    siteValue: '', // 选中站点code

                    sendNowData: [],
                    sendNowName: '',
                    sendNowValue: '',

                    sendStatusData: [],
                    sendStatusName: '',
                    sendStatusValue: '',

                    sendTime: [onlineDateTime(), todayEndTime()],
                    sendStartTime: onlineDateTime(),
                    sendEndTime: todayEndTime(),

                    creatorData: [],
                    creatorName: '全部',
                    creatorValue: '',

                    couponTypeCode: '',

                    remark: '',

                    applicationData: [],
                    applicationName: '',
                    applicationValue: '',                    

                    applyProductTypesData: [],
                    applyProductTypesName: '',
                    applyProductTypesValue: '',
                },
                dialog: {
                    customersDialogTitle: '客户列表',
                    customersDialogWidth: '500px',
                    customersDialogLoading: false,
                    customersDialogData: [],
                    viewUserSize: 0,
                },                                  
            }
        },
        created() {            
            this._getDictsData()
            this._getCouponCreator()
            this._getCouponsGiving(this.table.pageNum, this.table.pageSize);
        },        
        methods: {
            // 查询数据字典
            _getDictsData: function() {
                // 站点
                var paramsSite = {
                    isAll: true,
                    code: 'CompanyCode'
                }                
                getDictsData(paramsSite).then(res=> {
                    this.search.siteData = res.data
                })

                // 发送计划
                var paramsCouponSendFlag = {
                    isAll: true,
                    code: 'CouponSendFlag'
                }
                getDictsData(paramsCouponSendFlag).then(res=> {
                    this.search.sendNowData = res.data
                    this.loading = false
                })

                // 发送状态
                var paramsCouponSendStatus = {
                    isAll: true,
                    code: 'CouponSendStatus'
                }
                getDictsData(paramsCouponSendStatus).then(res=> {
                    this.search.sendStatusData = res.data
                    this.loading = false
                })

                

                // 优惠券适用商品类型
                var paramsCouponProductTypes = {
                    isAll: true,
                    code: 'CouponProductTypes'
                }
                getDictsData(paramsCouponProductTypes).then(res=> {
                    if (res.status == 200) {
                        this.search.applyProductTypesData = res.data
                        this.loading = false
                    }
                }) 

                // 适用平台
                var paramsApplication = {
                    isAll: true,
                    code: 'Application'
                }
                getDictsData(paramsApplication).then(res=> {
                    if (res.status == 200) {
                        this.search.applicationData = res.data
                        this.loading = false
                    }
                })
            },
            // 操作人员select数据
            _getCouponCreator: function() {
                var params = {}
                getCouponCreator(params).then(res=> {
                    if(res.status == 200) {
                        var allCreator = {name: '全部'}
                        this.search.creatorData = res.data
                        this.search.creatorData.unshift(allCreator)
                        this.loading = false
                    }
                }) 
            },           
            // 获取表格数据
            _getCouponsGiving: function(pageNum, pageSize) { 
                var params = {
                    companyCode: this.search.siteValue,
                    sendFlag: this.search.sendNowValue,
                    sendStatus: this.search.sendStatusValue,
                    sendStartTime: this.search.sendStartTime,
                    sendEndTime: this.search.sendEndTime,
                    couponTypeCode: deleteBlankSpace(this.search.couponTypeCode),
                    remark: deleteBlankSpace(this.search.remark),
                    applyProductTypes: this.search.applyProductTypesValue,
                    application: this.search.applicationValue,
                    pageNum: pageNum,
                    pageSize: pageSize,
                    export: false,
                    nameStr: '',
                    fieldStr: '',
                }
                if(this.search.creatorName == '全部') {
                    params.creator = ''
                }else {
                    params.creator = this.search.creatorName
                }

                this.table.tableLoading = true
                getCouponsGiving(params).then(res=> {
                    this.table.tableLoading = false
                    if(res.status == 200) {
                        res.data.forEach((item, index) => {
                            if(item.applyUserIds) {
                                if(item.applyUserIds.indexOf(",") > -1) {  // 指定商品字符串包含','
                                    item.viewUserSize = item.applyUserIds.split(",").length - 2
                                }else {    // 不包含
                                    item.viewUserSize = 1;
                                }
                            }
                        }) 
                        this.table.tableData = res.data
                        this.table.totalPage = res.pageVO.total                                               
                    }
                })
            },
            // 导出
            _getExport: function() {
                var params = {
                    companyCode: this.search.siteValue,
                    sendFlag: this.search.sendNowValue,
                    sendStatus: this.search.sendStatusValue,
                    sendStartTime: this.search.sendStartTime,
                    sendEndTime: this.search.sendEndTime,
                    couponTypeCode: deleteBlankSpace(this.search.couponTypeCode),
                    remark: deleteBlankSpace(this.search.remark),
                    applyProductTypes: this.search.applyProductTypesValue,
                    application: this.search.applicationValue,
                    creator: '',
                    pageNum: '',
                    pageSize: '',
                    export: true,
                    nameStr: '券类型编号,站点,备注,发送计划,发送时间,发送状态,操作人,赠送客户,已使用,优惠金额,起用金额,适用商品,适用平台,有效时间,使用描述',
                    fieldStr: 'couponTypeCode,companyName,remark,sendNow,sendTime,sendStatus,creator,applyUserTypesName,usedQuantity,deduction,premisPrice,applyProductTypesName,application,effectiveDays,couponTypeName',
                }

                //站点(companyName)  赠送客户(applyUserTypesName) 适用商品(applyProductTypesName) 
        
                window.location.href = getCouponsGiving(params)
            },
            // 查询条件重置
            resetSearchForm: function(formName) {
                this.$refs[formName].resetFields();
                this.search.sendStartTime = this.search.sendTime[0]
                this.search.sendEndTime = this.search.sendTime[1]                
                this._getCouponsGiving(1, this.table.pageSize)
                this.$message('重置成功');
            },
            // 查询
            _getSearch: function() {
                this._getCouponsGiving(1, this.table.pageSize)
            },
            // 每页显示条数
            handleSizeChange: function(val) {
                this.table.pageSize = val
                this._getCouponsGiving(this.table.pageNum, this.table.pageSize);                
            },
            // 翻页
            handleCurrentChange: function(val) {
                this.table.pageNum = val
                this._getCouponsGiving(this.table.pageNum, this.table.pageSize);                 
            },
            //分页序号
            getIndex: function(index) {      
                return (this.table.pageNum - 1) * this.table.pageSize + index + 1
            },            
            // 格式化日期--发送时间
            formatterDateSendTime: function(row, column) {
                return formatDateTimes(row.sendTime)
            },                                    
            // 格式化日期--兑换时间
            formatterDateHybrisOrderTime: function(row, column) {
                return formatDateTimes(row.hybrisOrderTime)
            },                                    
            // 格式化日期--订单时间
            formatterDateOrder: function(row, column) {
                if(row.orderTim) {
                    return formatDateTimes(row.orderTime)
                }else {
                    return '--'
                }
            },                                    
            // 格式化日期--有效时间
            formatterEffectiveDays: function(row) {
                var effectiveDays = ''
                if(row.effectiveFlag) {
                    effectiveDays = "从客户获取起 "+row.effectiveDays+" 天内"
                }else {
                    effectiveDays = formatDateTimes(row.effectiveStartTime) +' -- '+ formatDateTimes(row.effectiveEndTime)
                }
                return effectiveDays
            }, 
            // 跳转页面(新增、查看、编辑)
            routerLinkPage: function(index) {
                this.$router.push(index)  
            },
            // 客户列表弹窗显示
            customersDialogShow: function(row) {
                this.$refs['customersDialog-model'].showModel();
                var params = {
                    id: row.id,
                    applyUserTypes: row.applyUserTypes,
                }

                this.dialog.customersDialogLoading = true
                getApplyUserTypesView(params).then(res=> {
                    this.dialog.customersDialogLoading = false
                    if(res.status == 200) {                       
                        this.dialog.customersDialogData = res.data
                        this.dialog.viewUserSize = res.data.length
                    }
                }) 
            },
            // 弹窗关闭
            dialogHide: function(type) {
                this.$refs[type].hideModel();
            },              
        },
        watch: {
            'search.sendTime': {
                handler(curVal, oldVal){
                    this.search.sendStartTime = formatDateSearch(new Date(curVal[0]), 'yyyy-MM-dd hh:mm:ss')
                    this.search.sendEndTime = formatDateSearch(new Date(curVal[1]), 'yyyy-MM-dd hh:mm:ss')                    
                },
            }
        }       
    }   
</script>

<style lang="scss" scoped>

</style>
