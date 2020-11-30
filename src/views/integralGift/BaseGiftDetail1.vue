<template>
   <div class="app-container">
        <div class="filter-container" v-loading="loading">
            <el-tabs type="border-card" v-model="activeTab">
                <el-tab-pane>
                    <span slot="label">详细信息<i class="el-icon-arrow-down"></i></span>
                    <div class="todoWarpTop">
                        <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="routerLinkPage('/integralGift/BaseGiftEdit?id='+giftDetailData.id+'')" v-if="isEditPermission">编辑</el-button>
                    </div>
                    
                    <el-form ref="" label-width="100px" class="datailForm baseDatail" size="small">
                        <!-- 基础 -->
                        <el-form-item label="礼品编号：">{{giftDetailData.giftCode}}</el-form-item>
                        <el-form-item label="礼品类型：">{{giftDetailData.giftTypeName}}</el-form-item>

                        <!-- 药品/实物礼品详情 -->
                        <div class="drugDatail" v-if="isDrug">
                            <el-form-item label="ERP 商品编号：">{{giftDetailData.drug.productCode}}</el-form-item>
                            <el-form-item label="商品名称：">{{giftDetailData.drug.productName}}</el-form-item>
                            <el-form-item label="厂家：">{{giftDetailData.drug.ean}}</el-form-item>
                            <el-form-item label="规格：">{{giftDetailData.drug.specifications}}</el-form-item>
                        </div>

                        <!-- 优惠券详情 -->
                        <div class="vouchersDatail" v-if="isVouchers">
                            <el-form-item label="礼品名称：">{{giftDetailData.giftName}}</el-form-item>
                            <el-form-item label="可用站点：">{{giftDetailData.vouchers.companyName}}</el-form-item>
                            <el-form-item label="状态：">{{giftDetailData.vouchers.enable ? '已启用' : '已停用'}}</el-form-item>
                            <el-form-item label="使用描述：">{{giftDetailData.vouchers.couponTypeName}}</el-form-item>
                            <el-form-item label="优惠金额：">{{giftDetailData.vouchers.deduction}} 元</el-form-item>
                            <el-form-item label="起用金额：">{{giftDetailData.vouchers.premisPrice}} 元</el-form-item>
                            <el-form-item label="有效时间：">
                                {{giftDetailData.vouchers.effectiveFlag ? '从客户获取起 '+giftDetailData.vouchers.effectiveDays+' 天内' : '指定日期 '+formatterEffectiveDays(giftDetailData.vouchers)}}</el-form-item> 
                            <el-form-item label="获取渠道：">{{giftDetailData.vouchers.gainWayName}}</el-form-item>
                            <el-form-item label="适用平台：">{{giftDetailData.vouchers.application}}</el-form-item>
                            <el-form-item label="适用商品：">{{ giftDetailData.vouchers.applyProductTypesName }} {{ giftDetailData.vouchers.applyProductCodes }} <span class="mianColor" v-if="giftDetailData.vouchers.applyProductTypes == '4'" @click="goodsDialogShow">查看详情</span></el-form-item>
                            <el-form-item label="可用客户：">{{ giftDetailData.vouchers.applyUserTypesName }} {{ giftDetailData.vouchers.applyUserIds }} <span class="mianColor" v-if="giftDetailData.vouchers.applyUserTypes == '4'" @click="customersDialogShow">查看详情</span></el-form-item>         
                            <el-form-item label="已发放数量：">
                                <router-link class="mianColor" :to="{path: '/coupons/couponstocustomers', query: {couponCode: giftDetailData.couponCodeValue}}">
                                    {{ giftDetailData.vouchers.issuedQuantity }}
                                </router-link>张
                            </el-form-item>

                            <el-form-item label="未使用数量：">
                                <router-link class="mianColor" :to="{path: '/coupons/couponstocustomers', query: {couponCode: giftDetailData.couponCodeValue}}">
                                    {{ giftDetailData.vouchers.unusedQuantity }}
                                </router-link>张
                            </el-form-item>
                            <el-form-item label="已使用数量：">
                                <router-link class="mianColor" :to="{path: '/coupons/couponstocustomers', query: {couponCode: giftDetailData.couponCodeValue}}">
                                    {{ giftDetailData.vouchers.usedQuantity }}
                                </router-link>张
                            </el-form-item>
                            <el-form-item label="已过期数量：">
                                <router-link class="mianColor" :to="{path: '/coupons/couponstocustomers', query: {couponCode: giftDetailData.couponCodeValue}}">
                                    {{ giftDetailData.vouchers.expiredQuantity }}
                                </router-link>张
                            </el-form-item> 
                        </div>

                        <el-form-item label="礼品简介：" v-show="isVouchers"><div v-html="giftDetailData.introduction"></div></el-form-item>
                    </el-form> 


                </el-tab-pane>
                <el-tab-pane name="HistoryList" v-if="isOperationHistoryPermission">
                    <span slot="label">修改记录<i class="el-icon-arrow-down"></i></span>
                    <keep-alive>
                        <HistoryList v-if="activeTab=='HistoryList'" :entity="history.entity" :targetId="history.targetId" ></HistoryList>
                    </keep-alive>                    
                </el-tab-pane>

                <div class="todoWarpBottom">
                    <!-- <el-button size="small" @click="back">返回</el-button> -->
                </div>
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
                <p class="dialogNote">以下客户可获取此优惠券抵扣订单金额  已上传 <b class="errorColor">{{dialog.viewUserSize}}</b> 种商品</p>
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
    import HistoryList from 'base/HistoryList';
    import { formatDateTimes } from 'common/js/dom';
    import { getBaseGiftDetail, getApplyProductTypesView, getApplyUserTypesView } from 'api/interface';

    export default {
        components: {
            'dialogModel': Dialog,
            'HistoryList': HistoryList,
        },     
        name: "BaseGiftDetail",    
        data() {
            return {
                loading: true,
                isDrug: false,
                isVouchers: true,
                giftDetailData: {
                    id: '',
                    giftTypeName: '礼品类型',   // 礼品类型
                    giftName: '礼品名称',       // 礼品名称
                    giftCode: '礼品编号',       // 礼品名称
                    introduction: '礼品简介',   // 礼品简介

                    // 礼品类型为：药品/实物
                    drug: {},   
                    // 礼品类型为：券
                    vouchers: {},
                    
                    // 礼品类型为：卡
                    card: {
                        denomination: '面值',
                        brand: '品牌',
                        apply: '适用范围',
                        unit: '单位',
                        validity: [ '2018-09-01', '2018-11-01' ],
                    },
                    effectiveStartTime: '',
                    effectiveEndTime: '',
                },
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
                },
                activeTab: '',
                history: {
                    entity: '',
                    property: '',
                    targetId: '',
                    operator: '',
                },
                isAddPermission: false,  // 新增按钮权限
                isEditPermission: false,  // 编辑按钮权限
                isDeletePermission: false,  // 删除按钮权限     
                isOperationHistoryPermission: false,  // 操作历史tab权限                                            

            }
        },
        created() {
            this.getPermissions()
            this._getBaseGiftDetail(this.$route.query.id)
        },        
        methods: {
            // 页面权限
            getPermissions: function() {
                var permissionsBtnArr = localStorage.getItem("permissionsBtn"); 
                var permissionsMenuArr = localStorage.getItem("permissionsMenu");
                if(permissionsBtnArr.includes("gift:gifts:create")) {  
                    this.isAddPermission = true
                }else {
                    this.isAddPermission = false
                }
                if(permissionsBtnArr.includes("gift:gifts:update")) {  
                    this.isEditPermission = true
                }else {
                    this.isEditPermission = false
                }
                if(permissionsBtnArr.includes("gift:gifts:delete")) {  
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
            // 获取数据
            _getBaseGiftDetail: function(id) {
                var params = {
                    id: id
                }
                this.loading = true
                getBaseGiftDetail(params).then( res => {
                    this.loading = false
                    console.log(res)
                    if(res.status == 200){
                        this.giftDetailData.id = res.data.id
                        this.giftDetailData.giftTypeName = res.data.giftTypeName
                        this.giftDetailData.giftName = res.data.giftName
                        this.giftDetailData.giftCode = res.data.giftCode
                        this.giftDetailData.introduction = res.data.introduction
                        if(res.data.giftTypeName == '药品' || res.data.giftTypeName == '实物' || res.data.giftTypeName == '实体卡') {
                            this.giftDetailData.drug = res.data.product
                            this.isDrug = true
                            this.isVouchers = false                         
                        }else if(res.data.giftTypeName == '优惠券') {
                            this.giftDetailData.vouchers = res.data.couponType
                            this.isDrug = false
                            this.isVouchers = true                          
                        }

                        this.history.entity = 'Gift'
                        this.history.targetId = String(res.data.id)                        
                    }
                })
            },
            // 商品列表弹窗显示
            goodsDialogShow: function() {
                this.$refs['goodsDialog-model'].showModel();
                var params = {
                    id: this.giftDetailData.vouchers.id,
                    applyProductTypes: this.giftDetailData.vouchers.applyProductTypes,
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
                    id: this.giftDetailData.vouchers.id,
                    applyUserTypes: this.giftDetailData.vouchers.applyUserTypes,
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
            // 返回上一层             
            back(){
                this.$router.go(-1); 
            }, 
            // 跳转页面(编辑)
            routerLinkPage: function(index) {
                this.$router.push(index)
            }, 
            // 格式化日期--有效时间
            formatterEffectiveDays: function(row) {
                var effectiveDays = formatDateTimes(row.effectiveStartTime) +' -- '+ formatDateTimes(row.effectiveEndTime)
                return effectiveDays
            },                                              
        } 
    }   
</script>

<style lang="scss" scoped>
 
</style>
