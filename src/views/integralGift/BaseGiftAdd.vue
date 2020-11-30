<template>
   <div class="app-container">
        <div class="filter-container" v-loading="loading">
            <el-form :model="addGiftForm" ref="addGiftForm" :rules="rules" label-width="170px" class="" size="small">

                <el-form-item label="礼品类型：" required>
                    <el-select v-model="giftTypeValue" class="w180" @change="changeGiftTypeName">
                        <el-option
                            v-for="item in giftTypeData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="礼品名称：" prop="giftName" v-if="isVouchers">
                    <el-input v-model="addGiftForm.giftName" placeholder="请填写" class="w400" maxlength="60"></el-input> <span>（限60个字符）</span>
                </el-form-item>    

                <!-- 新增药品/实物礼品字段 -->
                <div class="" v-if="isDrug">
                    <el-form-item label="ERP商品编号：" prop="productCodeValue">
                        <el-select v-model="addGiftForm.productCodeValue" class="w180" @change="changeProductCode">
                            <el-option
                                v-for="item in addGiftForm.productCodeData"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>                    
                    <el-form-item label="商品名称：" prop="">
                        {{addGiftForm.drug.productName}}
                    </el-form-item>
                    <el-form-item label="生成厂家：" prop="">
                        {{addGiftForm.drug.ean}}
                    </el-form-item>
                    <el-form-item label="规格：" prop="">
                        {{addGiftForm.drug.specifications}}
                    </el-form-item>
                </div>

                <!-- 新增优惠券礼品字段 -->
                <div class="" v-if="isVouchers">
                    <el-form-item label="优惠券编号：" prop="couponCodeValue">
                        <el-select v-model="addGiftForm.couponCodeValue" class="w400" @change="changeCouponCode">
                            <el-option
                                v-for="item in addGiftForm.couponCodeData"
                                :key="item.couponCode"
                                :label="item.couponName"
                                :value="item.couponCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="可用站点：">{{ addGiftForm.vouchers.companyName }}</el-form-item>
                    <el-form-item label="状态：">{{ addGiftForm.vouchers.enable ? '已启用' : '已禁用' }}</el-form-item>
                    <el-form-item label="使用描述：">{{ addGiftForm.vouchers.couponTypeName }}</el-form-item>
                    <el-form-item label="优惠金额：">{{ addGiftForm.vouchers.deduction }} 元</el-form-item>
                    <el-form-item label="起用金额：">{{ addGiftForm.vouchers.premisPrice }} 元</el-form-item>
                    <el-form-item label="有效时间：">
                    {{addGiftForm.vouchers.effectiveFlag ? '从客户获取起 '+addGiftForm.vouchers.effectiveDays+' 天内' : '指定日期 '+formatterEffectiveDays(addGiftForm.vouchers)}}</el-form-item>
                    <el-form-item label="获取渠道：">{{ addGiftForm.vouchers.gainWayName }}</el-form-item>
                    <el-form-item label="适用平台：">{{ addGiftForm.vouchers.application }}</el-form-item>
                    <el-form-item label="适用商品：">{{ addGiftForm.vouchers.applyProductTypesName }} {{ addGiftForm.vouchers.applyProductCodes }} <span class="mianColor" v-if="addGiftForm.vouchers.applyProductTypes == '4'" @click="goodsDialogShow">查看详情</span></el-form-item>
                    <el-form-item label="可用客户：">{{ addGiftForm.vouchers.applyUserTypesName }} {{ addGiftForm.vouchers.applyUserIds }} <span class="mianColor" v-if="addGiftForm.vouchers.applyUserTypes == '4'" @click="customersDialogShow">查看详情</span></el-form-item>
                    <el-form-item label="已发放数量：">
                        <router-link class="mianColor" :to="{path: '/coupons/couponstocustomers', query: {couponCode: addGiftForm.couponCodeValue}}">
                            {{ addGiftForm.vouchers.issuedQuantity }}
                        </router-link>张
                    </el-form-item>

                    <el-form-item label="未使用数量：">
                        <router-link class="mianColor" :to="{path: '/coupons/couponstocustomers', query: {couponCode: addGiftForm.couponCodeValue}}">
                            {{ addGiftForm.vouchers.unusedQuantity }}
                        </router-link>张
                    </el-form-item>
                    <el-form-item label="已使用数量：">
                        <router-link class="mianColor" :to="{path: '/coupons/couponstocustomers', query: {couponCode: addGiftForm.couponCodeValue}}">
                            {{ addGiftForm.vouchers.usedQuantity }}
                        </router-link>张
                    </el-form-item>
                    <el-form-item label="已过期数量：">
                        <router-link class="mianColor" :to="{path: '/coupons/couponstocustomers', query: {couponCode: addGiftForm.couponCodeValue}}">
                            {{ addGiftForm.vouchers.expiredQuantity }}
                        </router-link>张
                    </el-form-item>
                </div>

                <el-form-item label="礼品简介：" prop="" v-show="isVouchers">
                    <div id="editorElem" style="text-align:left"></div>
                </el-form-item>                
                <el-form-item>
                    <el-button
                        type="primary"
                        size="mini"
                        @click="save('addGiftForm')"
                        :loading="saveLoading">确定</el-button>
                    <el-button type="info" size="mini" @click="handleReset('addGiftForm')">重置</el-button>
                </el-form-item>
            </el-form>
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
    import Wangeditor from 'wangeditor';
    import Dialog from 'base/Dialog';
    import { formatDate, today, dateToStamp, deleteBlankSpace, onlineDateTime, todayEndTime, positiveInteger } from 'common/js/dom';
    import { getDictsData, getAllProductCodeList, getProductCodeDetail, getCouponCodeAndNameList, getCouponCodeDeail, addGifts, getApplyProductTypesView, getApplyUserTypesView  } from 'api/interface';

    export default {
        components: {
            'dialogModel': Dialog,
        },     
        name: "BaseGiftAdd",    
        data() {
            return {
                loading: true,
                saveLoading: false, // 新增保存
                isDrug: null,
                isVouchers: null,
                currentGiftTypeValue: '',
                giftTypeData: [],
                giftTypeName: '',
                giftTypeValue: 'drug',

                addGiftForm: {
                    giftName: '',  // 礼品名称
                    
                    // 礼品类型为：药品/实物
                    productCodeData: [],//商品编号
                    productCodeValue: '',
                    drug: {
                        productName: '',//商品名称
                        ean: '',//厂家
                        specifications: '',//规格
                    },
                    
                    // 礼品类型为：券
                    couponCodeData: [],
                    couponCodeName: '',
                    couponCodeValue: '',
                    vouchers: {},
                    
                    // validity: ['2018-10-10 00:00:00', today()], // 有效期
                    validity: [onlineDateTime(), todayEndTime()], // 有效期

                    // 礼品简介富文本框内容
                    introduction: ''
                },
                rules: {
                    giftName: [
                        { required: true, message: '请输入礼品名称', trigger: 'blur' }
                    ],
                    productCodeValue: [
                        { required: true, message: '请选择商品编号', trigger: 'change' }
                    ],  
                    couponCodeValue: [
                        { required: true, message: '请选择商品编号', trigger: 'blur' }
                    ], 
                    validity: [
                        { required: true, message: '请选择有效期', trigger: 'change' }
                    ],
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

                }
            }
        },
        mounted() {
            var editor = new Wangeditor('#editorElem')
            editor.customConfig.onchange = (html) => {
                this.addGiftForm.introduction = html
            }
            editor.customConfig.uploadImgShowBase64 = true
            editor.create() 

            this._getDictsData()

            
        },
        methods: {
            // 查询数据字典
            _getDictsData: function() { 
                // 类型
                var paramsGiftType = {
                    isAll: false,
                    code: 'GiftType'
                }   
                this.loading = true;
                getDictsData(paramsGiftType).then(res=> {
                    this.giftTypeData = res.data
                    this.giftTypeValue = res.data[2].value
                    if(res.data[2].value == 'drug' || res.data[2].value == 'entity' || res.data[2].value == 'entity_card') {
                        this.isDrug = true
                        this._getAllProductCodeList()

                    }else if(res.data[2].value == 'coupon') {
                        this.isVouchers = true
                        this._getCouponCodeAndNameList()

                    }
                    this.loading = false;
                })
            },
            // 查询ERP商品编号
            _getAllProductCodeList: function() {
                var params = {}
                getAllProductCodeList(params).then(res=> {
                    if(res.status == 200) {
                        this.addGiftForm.productCodeData = res.data              
                    }
                })
            },
            // 改变ERP商品编号
            changeProductCode: function(val) {
                var params = {
                    productCode: val 
                }
                this.loading = true
                getProductCodeDetail(params).then(res=> {
                    this.loading = false
                    if(res.status == 200) {
                        this.addGiftForm.drug.productName = res.data.productName
                        this.addGiftForm.drug.ean = res.data.ean
                        this.addGiftForm.drug.specifications = res.data.specifications
                    }
                })
            },
            // 券类型编号
            _getCouponCodeAndNameList: function() {
                var params = {}
                this.loading = true
                getCouponCodeAndNameList(params).then(res=> {
                    if(res.status == 200) {
                        this.addGiftForm.couponCodeData = res.data
                        this.addGiftForm.couponCodeValue = res.data[0].couponCode
                        this.changeCouponCode(this.addGiftForm.couponCodeValue)
                    }
                })
            },
            // 改变券类型编号
            changeCouponCode: function(val) {
                var params = {
                    couponTypeCode: val,
                }
                this.loading = true
                getCouponCodeDeail(params).then(res=> {
                    this.loading = false
                    if(res.status == 200) {
                        this.addGiftForm.vouchers = res.data
                    }
                })
            },

            // 改变礼品类型
            changeGiftTypeName: function(val) {
                this.currentGiftTypeValue = this.giftTypeValue

                if(val == 'drug' || val == 'entity' || val == 'entity_card') { // 1=药品  2=实物  4=实体卡
                    this.isDrug = true
                    this.isVouchers = false
                    this._getAllProductCodeList()                   
                }else if(val == 'coupon') { // 3=优惠券
                    this.isDrug = false
                    this.isVouchers = true  
                    this._getCouponCodeAndNameList()              
                }

                this.$refs['addGiftForm'].resetFields();
                this.giftTypeValue = this.currentGiftTypeValue
            },
            // 面值取正整数
            formatDenomination: function(val) {
                this.addGiftForm.card.denomination = positiveInteger(val)
            },            
            // 保存
            save: function (formName) {

                this.saveLoading = true
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        var params = {}
                        if(this.isDrug) {
                            params.productCode = this.addGiftForm.productCodeValue

                        }else if(this.isVouchers) {
                            params.giftName = deleteBlankSpace(this.addGiftForm.giftName)
                            params.couponTypeCode = this.addGiftForm.couponCodeValue
                            params.introduction = this.addGiftForm.introduction
                        }
                        params.giftTypeCode = this.giftTypeValue // 礼品类型名称 药品 实物 优惠券 实体卡

                        addGifts(params).then(res=> {
                            if(res.status == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                })  
                                this.$router.push('/integralGift/BaseGift')             
                            }else {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })                                 
                            }
                            this.saveLoading = false
                        })

                    }else {
                        this.$message({
                            message: '请完善信息',
                            type: 'warning'
                        })
                        this.saveLoading = false
                        return false;
                    }
                });                
            },
            // 重置
            handleReset(formName) {     
                this.$refs[formName].resetFields();
                this.addGiftForm.drug = {}
                this.addGiftForm.vouchers = {}
                document.getElementsByClassName('w-e-text')[0].innerHTML = "<p></p>"
                this.$message('重置成功');
            },            
            // 商品列表弹窗显示
            goodsDialogShow: function() {
                this.$refs['goodsDialog-model'].showModel();
                var params = {
                    id: this.addGiftForm.vouchers.id,
                    applyProductTypes: this.addGiftForm.vouchers.applyProductTypes,
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
                    id: this.addGiftForm.vouchers.id,
                    applyUserTypes: this.addGiftForm.vouchers.applyUserTypes,
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
            // 格式化日期--有效时间
            formatterEffectiveDays: function(row) {
                var effectiveDays = formatDate(new Date(row.effectiveStartTime), 'yyyy-MM-dd hh:mm:ss') +' -- '+ formatDate(new Date(row.effectiveEndTime), 'yyyy-MM-dd hh:mm:ss')
                return effectiveDays
            },                       
        },
    }   
</script>

<style type="text/css" media="screen">
    .el-form-item__content {
        text-align: left;
    }
    .w-e-menu {
        z-index: 1000 !important;
    }   
    .w-e-text-container {
        z-index: 500 !important;
    } 
</style>

<style lang="scss" scoped>

</style>
