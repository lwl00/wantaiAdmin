<template>
    <div class="app-container"> 
        <div class="filter-container" v-loading="loading">  
            <el-tabs type="border-card" v-model="activeTab">
                <el-tab-pane>
                    <span slot="label">详细信息<i class="el-icon-arrow-down"></i></span>
                    <div class="todoWarpTop">
                        <el-button 
                            type="primary" 
                            size="small" 
                            icon="el-icon-edit-outline" 
                            @click="routerLinkPage('/integralRules/IntegralRulesEdit?id='+table.tableData.id+'')" 
                            v-if="isEditPermission">编辑规则</el-button>
                    </div>
                    <el-form ref="" label-width="170px" class="datailForm" size="small">
                        <el-form-item label="规则编号：" required>{{table.tableData.id}}</el-form-item>
                        <el-form-item label="规则说明：" required>{{table.tableData.ruleDesc}}</el-form-item>
                        <el-form-item label="规则类型：" required>{{table.tableData.ruleTypeName}}</el-form-item>
                        <el-form-item label="所属站点：" required>{{table.tableData.companyName}}</el-form-item>
                        <el-form-item label="规则性质：" required>{{table.tableData.ruleNatureName}}</el-form-item>
                        <el-form-item label="当次获取/消耗积分：" required>{{table.tableData.fixed ? '固定值：'+table.tableData.fixedPoint+'分'+(table.tableData.fixedMoney?' / '+table.tableData.fixedMoney+'元':'') : '非固定值'}}</el-form-item>
                        <el-form-item label="下单返积分商品：" required v-if="isShowUploadApplyProductType">{{table.tableData.applyProductTypeName}} {{table.formatApplyProductCodes}}</el-form-item>
                        <el-form-item label="周期范围：" required v-if="isShowCycle">{{table.tableData.cycleName}}</el-form-item>
                        <el-form-item label="周期内获取/消耗上限：" required v-if="isShowLimitType">{{table.tableData.limitTypeName}}{{table.tableData.limitValue ? '：'+table.tableData.limitValue : ''}}</el-form-item>
                        <el-form-item label="规则状态：" required>{{table.tableData.enable ? '启用中' : '禁用中'}}</el-form-item>
                        <el-form-item label="生效时间段：" required>{{table.enableStartDate}} - {{table.enableEndDate}}</el-form-item>
                    </el-form> 
                </el-tab-pane>
                <el-tab-pane name="HistoryList" v-if="isOperationHistoryPermission">
                    <span slot="label">修改记录<i class="el-icon-arrow-down"></i></span>
                    <keep-alive>
                        <HistoryList v-if="activeTab=='HistoryList'" :entity="history.entity" :targetId="history.targetId" ></HistoryList>
                    </keep-alive>                    
                </el-tab-pane>
            </el-tabs>               
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    import HistoryList from 'base/HistoryList';
    import { formatDateTimes } from 'common/js/dom';
    import { getPointRuleDatail } from 'api/interface';

    export default {
        components: {
            'HistoryList': HistoryList,
        },        
        name: "IntegralRulesDetail",
        data() {
            return {
                loading: false,
                table: {
                    tableData: [],
                    formatApplyProductCodes: '',
                    enableStartDate: '',
                    enableEndDate: ''
                },
                isShowUploadApplyProductType: false,  // 是否展示'下单返积分商品'
                isShowLimitType: false,  // 规则类型为下单返积分时，不展示'周期内获取/消耗上限'
                isShowCycle: false,  // 规则类型为下单返积分时，不展示'周期范围'
                activeTab: '',
                history: {
                    entity: '',
                    property: '',
                    targetId: '',
                    operator: '',
                },
                isEditPermission: false,  // 编辑按钮权限
                isOperationHistoryPermission: false,  // 操作历史tab权限
            }
        },
        created(){
            this._getPointRuleDatail()
            this.getPermissions()
        },
        methods: {
            // 页面权限
            getPermissions: function() {
                var permissionsBtnArr = localStorage.getItem("permissionsBtn");
                var permissionsMenuArr = localStorage.getItem("permissionsMenu");
                if(permissionsBtnArr.includes("point:pointRule:update")) {  
                    this.isEditPermission = true
                }else {
                    this.isEditPermission = false
                }

                if(permissionsMenuArr.includes("system:operationRecords:read")) {  
                    this.isOperationHistoryPermission = true
                }else {
                    this.isOperationHistoryPermission = false
                }
            },              
            // 获取数据
            _getPointRuleDatail: function() {
                var params = {
                    id: this.$route.query.id
                }
                this.loading = true
                getPointRuleDatail(params).then(res=> {
                    // console.log(res)
                    this.loading = false
                    if(res.status == 200) {
                        this.table.tableData = res.data

                        if(res.data.applyProductCodes) {
                            var applyProductCodes = res.data.applyProductCodes
                            applyProductCodes = applyProductCodes.substring(0, applyProductCodes.lastIndexOf(','));
                            this.table.formatApplyProductCodes = applyProductCodes.substr(1)
                        }
                        
                        
                        if(res.data.ruleType == 'ORDER') { // 下单返积分
                            this.isShowUploadApplyProductType = true
                            this.isShowLimitType = false
                            this.isShowCycle = false
                        }else if(res.data.ruleType == 'INFO') { // 完善信息得积分
                            this.isShowUploadApplyProductType = false
                            this.isShowLimitType = true
                            this.isShowCycle = true
                        }else if(res.data.ruleType == 'EXCHANGE') { // 积分兑换礼品
                            this.isShowUploadApplyProductType = false
                            this.isShowLimitType = true
                            this.isShowCycle = true
                        } 

                        if(res.data.enableStartDate) {
                            this.table.enableStartDate = formatDateTimes(res.data.enableStartDate)
                        }

                        if(res.data.enableEndDate) {
                            this.table.enableEndDate = formatDateTimes(res.data.enableEndDate)
                        }

                        this.history.entity = 'PointRule'
                        this.history.targetId = String(res.data.id)
                    }
                })                      
            },
            // 跳转编辑
            routerLinkPage: function(index) {
                this.$router.push(index)
            },
                        
        }
    }
</script>


<style lang="scss" scoped>

    
</style>
