<template>
   <div class="app-container">
        <div class="filter-container" v-loading="loading">
            <el-tabs type="border-card" v-model="activeTab">
                <el-tab-pane>
                    <span slot="label">详细信息<i class="el-icon-arrow-down"></i></span>
                    <div class="todoWarpTop">
                        <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="edit" v-if="couponsDetailData.issuedQuantity == 0 && isEditPermission">编辑</el-button>
                        <el-button type="danger" size="small" @click="dialogShow('disableDialog-model')" v-if="couponsDetailData.issuedQuantity > 0 && couponsDetailData.enable && isDeletePermission">禁用</el-button>
                    </div> 
                    <el-form ref="" label-width="100px" class="datailForm" size="small">
                        <el-form-item label="优惠券类型编号：">{{couponsDetailData.couponTypeCode}}</el-form-item>
                        <el-form-item label="可用站点：">{{couponsDetailData.companyName}}</el-form-item>
                        <el-form-item label="状态：">{{couponsDetailData.enable ? '已启用': '已停用'}}</el-form-item>
                        <el-form-item label="使用描述：">{{couponsDetailData.couponTypeName}}</el-form-item>
                        <el-form-item label="优惠金额：">{{couponsDetailData.deduction}} 元</el-form-item>
                        <el-form-item label="起用金额：">{{couponsDetailData.premisPrice}} 元</el-form-item>
                        <el-form-item label="获取渠道：">{{couponsDetailData.gainWayName}}</el-form-item>
                        <el-form-item label="获取时间：" v-if="isShowgainDateTime">{{formatterGainDateTime(couponsDetailData)}}</el-form-item>
                        <el-form-item label="有效时间：">
                            {{couponsDetailData.effectiveFlag ? '从客户获取起 '+couponsDetailData.effectiveDays+' 天内' : '指定日期 '+formatterEffectiveDays(couponsDetailData)}} 
                        </el-form-item>
                        <el-form-item label="每人限量：" v-if="isShowMaxOwnCount">{{couponsDetailData.maxOwnCount}} 张</el-form-item>
                        <el-form-item label="总发行量：" v-if="isShowStock">{{couponsDetailData.stock}} 张</el-form-item>
                        <el-form-item label="适用平台：">{{couponsDetailData.application}}</el-form-item>
                        <el-form-item label="适用商品：">{{couponsDetailData.applyProductTypesName}} {{couponsDetailData.formatApplyProductCodes}} <span class="mianColor" v-if="couponsDetailData.applyProductTypes == '4'" @click="goodsDialogShow">查看详情</span></el-form-item>
                        <el-form-item label="可用客户：">{{couponsDetailData.applyUserTypesName}}  {{couponsDetailData.formatApplyUserIds}} <span class="mianColor" v-if="couponsDetailData.applyUserTypes == '4'" @click="customersDialogShow">查看详情</span></el-form-item>
                        <el-form-item label="备注：">{{couponsDetailData.remark}}</el-form-item>
                        <el-form-item label="计划发送时间：" v-if="couponsDetailData.gainWay == '02'">{{couponsDetailData.sendNow ? '即时发送': '定时发送'}} {{sendTime}}</el-form-item>
                        <el-form-item label="发送状态：" v-if="couponsDetailData.gainWayName == '系统赠送'">{{couponsDetailData.sendStatus ? '已发送': '待发送'}}</el-form-item>
                        <el-form-item label="领取链接：" v-if="isShowGainUrl">
                            <a target="_blank" :href="couponsDetailData.gainUrl" class="errorColor">{{couponsDetailData.gainUrl}}</a> 
                            <span 
                                class="mianColor routerLink copys"
                                v-clipboard:copy="couponsDetailData.gainUrl"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError">复制</span>    
                        </el-form-item>
                        <el-form-item label="已发放数量：">{{couponsDetailData.issuedQuantity}}张</el-form-item>
                        <el-form-item label="待发放数量：" v-if="isShowUnissuedQuantity">{{couponsDetailData.unissuedQuantity}}张</el-form-item>
                        <el-form-item label="未使用数量：">{{couponsDetailData.unusedQuantity}}张</el-form-item>
                        <el-form-item label="已使用数量：">{{couponsDetailData.usedQuantity}}张</el-form-item>
                        <el-form-item label="已过期数量：">{{couponsDetailData.expiredQuantity}}张</el-form-item>
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

        <!--======== 以下是弹出层 ========-->
        <!-- 商品列表弹窗 -->
        <dialogModel class="goodsDialog-model" ref="goodsDialog-model" :title="dialog.goodsDialogTitle" :width="dialog.goodsDialogWidth">
            <div class="dialog-model-content">
                <p class="dialogNote">购买以下商品可使用优惠券抵扣金额  已上传 <b class="errorColor">{{dialog.viewProductSize}}</b> 种商品</p>
                <div class="cmyyTable">
                    <el-table
                        :data="dialog.goodsDialogData"
                        stripe
                        height="350"
                        highlight-current-row
                        v-loading="dialog.goodsDialogLoading">
                        <el-table-column
                            property="productCode"
                            label="商品编号"
                            align="center">                 
                        </el-table-column>
                        <el-table-column
                            property="productName"
                            label="商品名称"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            property="specifications"
                            label="规格"
                            align="center">                 
                        </el-table-column>
                        <el-table-column
                            property="ean"
                            label="厂家"
                            align="center">                 
                        </el-table-column>
                    </el-table>
                </div>                 
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('goodsDialog-model')">关闭</el-button>
            </div>
        </dialogModel> 

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

        <!-- 禁用弹窗 -->
        <dialogModel class="disableDialog-model" ref="disableDialog-model" :title="dialog.disableDialogTitle" :width="dialog.disableDialogWidth">
            <div class="dialog-model-content">
                <p class="dialogNote">禁用后，已发放至客户账号的<b class="errorColor"> {{couponsDetailData.issuedQuantity}} </b>张未使用张优惠券将变为已失效，请谨慎修改。</p>
                <el-form :model="reasonData" ref="reasonData" :rules="rules" class="" size="small">
                    <el-form-item label="" prop="disableReason" >                
                        <el-input 
                            type="textarea"
                            rows="3"
                            v-model="reasonData.disableReason" 
                            class=""
                            placeholder="请填写禁用原因（向客户展示）"></el-input> 
                    </el-form-item>
                </el-form>               
            </div>
            <div class="dialog-model-footer">
                <el-button size="mini" type="danger" @click="changeStatus('reasonData')" :loading="saveLoading">禁用</el-button>
                <el-button size="mini" @click="cancelChangeStatus('disableDialog-model')">取消</el-button>
            </div>
        </dialogModel> 


    </div>

</template>

<script type="text/ecmascript-6">
    import Dialog from 'base/Dialog';
    import HistoryList from 'base/HistoryList';
    import { formatDateTimes } from 'common/js/dom';
    import { getCouponsDetailData, getApplyProductTypesView, getApplyUserTypesView, editCouponsType } from 'api/interface';
    
    export default {
        components: {
            'dialogModel': Dialog,
            'HistoryList': HistoryList,
        },     
        name: "CouponsDetail",    
        data() {
            return {
                loading: true,
                saveLoading: false,  // 禁用保存
                couponsDetailData: {},
                sendTime: '', 
                isShowgainDateTime: false,
                isShowMaxOwnCount: false,
                isShowStock: false,
                isShowGainUrl: false,
                isShowUnissuedQuantity: false,
                dialog: {
                    goodsDialogTitle: '商品列表',
                    goodsDialogWidth: '1000px',
                    goodsDialogLoading: false,
                    goodsDialogData: [],
                    viewProductSize: 0,

                    customersDialogTitle: '客户列表',
                    customersDialogWidth: '500px',
                    customersDialogLoading: false,
                    customersDialogData: [],
                    viewUserSize: 0, 

                    disableDialogTitle: '禁用优惠券提醒 ',
                    disableDialogWidth: '400px',
                },
                reasonData: {
                    disableReason: '',     // 禁用原因
                },                
                activeTab: '',
                history: {
                    entity: '',
                    property: '',
                    targetId: '',
                    operator: '',
                },
                rules: {
                    disableReason: [
                        { required: true, message: '请完善原因', trigger: 'blur' }
                    ],                
                },
                isAddPermission: false,  // 新增按钮权限
                isEditPermission: false,  // 编辑按钮权限
                isDeletePermission: false,  // 删除按钮权限
                isOperationHistoryPermission: false,  // 操作历史tab权限
            }
        },
        created() {
            this._getCouponsDetailData()
            this.getPermissions()
        },         
        methods: {
            // 页面权限
            getPermissions: function() {
                var permissionsBtnArr = localStorage.getItem("permissionsBtn"); 
                var permissionsMenuArr = localStorage.getItem("permissionsMenu");
                if(permissionsBtnArr.includes("operation:couponType:create")) {  
                    this.isAddPermission = true
                }else {
                    this.isAddPermission = false
                }
                if(permissionsBtnArr.includes("operation:couponType:update")) {  
                    this.isEditPermission = true
                }else {
                    this.isEditPermission = false
                }
                if(permissionsBtnArr.includes("operation:couponType:delete")) {  
                    this.isDeletePermission = true
                }else {
                    this.isDeletePermission = false
                }

                if(permissionsMenuArr.includes("system:operationRecords:read")) {  
                    this.isOperationHistoryPermission = true
                }else {
                    this.isOperationHistoryPermission = false
                }                
            },                
            // 获取详情数据
            _getCouponsDetailData: function() {
                var params = {
                    couponTypeCode: this.$route.query.couponTypeCode
                }

                this.loading = true
                getCouponsDetailData(params).then(res=> {
                    this.loading = false
                    if(res.status == 200) {
                        this.couponsDetailData = res.data

                        if(res.data.applyProductCodes) {
                            var applyProductCodes = res.data.applyProductCodes
                            applyProductCodes = applyProductCodes.substring(0, applyProductCodes.lastIndexOf(','));
                            this.couponsDetailData.formatApplyProductCodes = applyProductCodes.substr(1)
                        }
                        
                        if(res.data.applyUserIds) {
                            var applyUserIds = res.data.applyUserIds
                            applyUserIds = applyUserIds.substring(0, applyUserIds.lastIndexOf(','));
                            this.couponsDetailData.formatApplyUserIds = applyUserIds.substr(1)
                        }

                        if(res.data.sendTime) {
                            this.sendTime = formatDateTimes(res.data.sendTime)
                        }

                        if(res.data.gainWay == '01') {
                            this.isShowgainDateTime = false
                            this.isShowMaxOwnCount = false
                            this.isShowStock = false
                            this.isShowGainUrl = false
                            this.isShowUnissuedQuantity = false
                        }else if(res.data.gainWay == '02') {
                            this.isShowgainDateTime = false
                            this.isShowMaxOwnCount = true
                            this.isShowStock = true
                            this.isShowGainUrl = false
                            this.isShowUnissuedQuantity = true
                        }else if(res.data.gainWay == '03') {
                            this.isShowgainDateTime = true
                            this.isShowMaxOwnCount = true
                            this.isShowStock = true
                            this.isShowGainUrl = true
                            this.isShowUnissuedQuantity = true
                        }

                        this.history.entity = 'CouponType'
                        this.history.targetId = String(res.data.id)
                    }
                })
            },
            // 编辑(已发送数量等于0时，进入编辑页，可以编辑)
            edit: function() {
                this.$router.push('/coupons/CouponsEdit?couponTypeCode='+this.$route.query.couponTypeCode+'')
            },
            // 已发送数量大于0时，显示禁用按钮，改变状态为false
            changeStatus: function(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {            
                        var params = this.couponsDetailData
                        params.enable = false
                        params.reason = this.reasonData.disableReason
                        
                        if(params.applyProductTypes == '4') {
                            params.applyProductCodes = params.applyProductCodes.substr(0, params.applyProductCodes.length - 1)
                            params.applyProductCodes = params.applyProductCodes.substr(1)
                        }

                        if(params.applyUserTypes == '4') {
                            params.applyUserIds = params.applyUserIds.substr(0, params.applyUserIds.length - 1)
                            params.applyUserIds = params.applyUserIds.substr(1)
                        }                        

                        this.saveLoading = true
                        editCouponsType(params).then( res => {
                            if(res.status = 200) {
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功'
                                })
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.message
                                })
                            }
                            this.$refs['disableDialog-model'].hideModel();
                            this.saveLoading = false
                        })                        
                    }else {
                        this.$message({
                            message: '请完善信息',
                            type: 'warning'
                        })
                        return false;                        
                    }
                })
            },
            // 禁用弹窗取消
            cancelChangeStatus: function(model) {
                this.$refs['reasonData'].resetFields();
                this.dialogHide(model)
            },
            // 商品列表弹窗显示
            goodsDialogShow: function() {
                this.$refs['goodsDialog-model'].showModel();
                var params = {
                    id: this.couponsDetailData.id,
                    applyProductTypes: this.couponsDetailData.applyProductTypes,
                }
                this.dialog.goodsDialogLoading = true
                getApplyProductTypesView(params).then(res=> {
                    this.dialog.goodsDialogLoading = false
                    if(res.status == 200) {                       
                        this.dialog.goodsDialogData = res.data
                        this.dialog.viewProductSize = res.data.length
                    }
                })                

            },
            // 客户列表弹窗显示
            customersDialogShow: function() {
                this.$refs['customersDialog-model'].showModel();
                var params = {
                    id: this.couponsDetailData.id,
                    applyUserTypes: this.couponsDetailData.applyUserTypes,
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
            // 弹窗展示
            dialogShow: function(type) {
                this.$refs[type].showModel();
            },       
            // 弹窗关闭
            dialogHide: function(type) {
                this.$refs[type].hideModel();
            }, 
            // 跳转页面(新增、查看、编辑)
            routerLinkPage: function(index) {
                this.$router.push(index)  
                this.dialogHide('disableDialog-model')
            },
            // 复制成功
            onCopy: function (e) {
                this.$message({
                    type:"success",
                    message: '复制成功 '+e.text
                })
            },
            // 复制失败
            onError: function (e) {
                this.$message({
                    type:"error",
                    message: '复制失败'
                })                
            }, 
            // 格式化日期--有效时间
            formatterEffectiveDays: function(row) {
                var effectiveDays = formatDateTimes(row.effectiveStartTime) +' -- '+ formatDateTimes(row.effectiveEndTime)
                return effectiveDays
            }, 
            // 格式化日期--获取时间
            formatterGainDateTime: function(row) {
                if(row.gainStartTime&&row.gainStartTime) {
                    var gainDateTime = formatDateTimes(row.gainStartTime) +' -- '+ formatDateTimes(row.gainEndTime)
                    return gainDateTime
                }else {
                    return '--'
                }
            }
        }        
    }   
</script>

<style lang="scss" scoped>

</style>
