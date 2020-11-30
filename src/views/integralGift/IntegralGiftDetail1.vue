<template>
   <div class="app-container">
        <div class="filter-container">
            <el-tabs type="border-card" v-model="activeTab">
                <el-tab-pane>
                    <span slot="label">详细信息<i class="el-icon-arrow-down"></i></span>
                    <div class="todoWarpTop">
                        <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="handleEdit('/integralGift/IntegralGiftEdit')" v-if="isEditPermission">编辑</el-button>
                    </div>
                    <div class="giftTitle text-left"><span></span>礼品配置信息</div>
                    <el-form :model="editForm" ref="editForm" label-width="170px" class="" size="small" style="margin-top: 30px;" v-loading="loading">
                        <el-form-item label="礼品编号：" size="small"  class="text-left">
                            {{editForm.giftCode}}
                        </el-form-item>
                        <el-form-item label="礼品站点：" class="text-left">
                            <div class="text-left" style="display: inline-block;">{{editForm.companyName}}</div>
                            <span class="errorColor text-left"  style="display: inline-block;" v-if="companyNameLock">（商品无此渠道，积分商城会展示为“暂无权限”，客户不可兑换。建议完善ERP商品的渠道）</span>
                        </el-form-item>
                        <el-form-item label="所属分类："  class="text-left" prop="category">
                            {{editForm.category}}
                        </el-form-item>
                        <el-form-item label="礼品类型："  class="text-left" prop="giftTypeName">
                            {{editForm.giftTypeName}}
                        </el-form-item>
                        <el-form-item label="客户端礼品描述：" class="text-left" prop="remark">
                            {{editForm.remark}}
                        </el-form-item>
                        <!-- 优惠券直接显示data里面的库存  而实物直接去product里面的stork里的realStock库存 -->
                        <el-form-item label="礼品库存："  class="text-left" prop="realStock">
                            {{basicLock == 'coupon'?editForm.realStock:editForm.drugRealStock}}
                            <!-- {{editForm.realStock}} -->
                        </el-form-item>
                        <!-- <el-form-item label="礼品库存："  class="text-left" prop="realStock" v-else>
                            {{editForm.drugRealStock}}
                        </el-form-item> -->
                        <el-form-item label="兑换积分：" class="text-left" prop="point">
                            {{editForm.point}}
                        </el-form-item>
                        <el-form-item label="礼品价值：" class="text-left" prop="price">
                            {{editForm.price}}
                        </el-form-item>
                        <el-form-item label="礼品状态：" class="text-left">
                            {{editForm.statusName}}
                        </el-form-item>
                        <!-- <el-form-item label="有效期：" class="text-left" prop="enableDate">
                            {{giftData.effectiveFlag ? '从客户获取起 '+giftData.effectiveDays+' 天内' : '指定日期 ' + public.effectiveTime}}
                            {{editForm.enableDate}}
                        </el-form-item> -->
                        <el-form-item label="礼品缩略图：" class="text-left">
                            <div class="giftImageSmall" v-if="imageSmall != ''"><img class="imageSmall" :src="imageSmall" /><span>{{editForm.imageSmall}}</span></div>
                        </el-form-item>
                        <el-form-item label="礼品图片：" class="text-left">
                            <div class="giftImage" v-if="image1 != ''"><img class="images" :src="image1" /><span>{{editForm.image1}}</span></div>
                            <div class="giftImage" v-if="image2 != ''"><img class="images" :src="image2" /><span>{{editForm.image2}}</span></div>
                            <div class="giftImage" v-if="image3 != ''"><img class="images" :src="image3" /><span>{{editForm.image3}}</span></div>
                            <div class="giftImage" v-if="image4 != ''"><img class="images" :src="image4" /><span>{{editForm.image4}}</span></div>
                            <div class="giftImage" v-if="image5 != ''"><img class="images" :src="image5" /><span>{{editForm.image5}}</span></div>
                        </el-form-item>
                    </el-form>
                    <!--礼品基础信息  -->
                    <div class="giftTitle pull-left"><span></span>积分礼品通用信息</div>
                    <!-- 优惠券信息 -->
                    <el-form ref="" label-width="100px" class="datailForm" size="small" style="margin-top: 80px; margin-left: 36px;" v-if="basicLock == 'coupon'">
                        <el-form-item label="礼品编号：">{{public.giftCode}}</el-form-item>
                        <el-form-item label="礼品类型：">{{public.giftTypeName}}</el-form-item>
                        <el-form-item label="礼品名称：">{{public.giftName}}</el-form-item>
                        <el-form-item label="可用站点：">{{giftData.companyName}}</el-form-item>
                        <el-form-item label="状态：">{{giftData.enable ? '已启用' : '已停用'}}</el-form-item>
                        <el-form-item label="使用描述：">{{giftData.couponTypeName}}</el-form-item>
                        <el-form-item label="优惠金额：">{{giftData.deduction}}元</el-form-item>
                        <el-form-item label="起用金额：">{{giftData.premisPrice}}元</el-form-item>
                        <el-form-item label="有效时间：">
                            {{giftData.effectiveFlag ? '从客户获取起 '+giftData.effectiveDays+' 天内' : '指定日期 ' + public.effectiveTime}}</el-form-item>
                        <el-form-item label="获取渠道：">{{giftData.gainWayName}}</el-form-item>
                        <el-form-item label="适用平台：">{{giftData.application}}</el-form-item>
                        <el-form-item label="适用商品：">
                            {{giftData.applyProductTypesName}} {{giftData.applyProductCodes}}
                            <span class="mianColor" v-if="giftData.applyProductTypes == '4'" @click="goodsDialogShow">查看详情</span>
                        </el-form-item>
                        <el-form-item label="可用客户：">
                            {{giftData.applyUserTypesName}} {{giftData.applyUserIds}}
                            <span class="mianColor" v-if="giftData.applyUserTypes == '4'" @click="customersDialogShow">查看详情</span>
                        </el-form-item>
                        <el-form-item label="已发放数量：">{{giftData.issuedQuantity}}张</el-form-item>
                        <el-form-item label="未使用数量：">{{giftData.unusedQuantity}}张</el-form-item>
                        <el-form-item label="已使用数量：">{{giftData.usedQuantity}}张</el-form-item>
                        <el-form-item label="已过期数量：">{{giftData.expiredQuantity}}张</el-form-item>
                        <el-form-item label="礼品简介："><div v-html="public.introduction"></div></el-form-item>
                    </el-form>

                    <!-- 实体卷和药物 -->
                    <el-form ref="" label-width="100px" class="datailForm" size="small" style="margin-top: 80px; margin-left: 36px;" v-if="basicLock == 'drugEntity'">
                        <el-form-item label="礼品编号：">{{productData.giftCode}}</el-form-item>
                        <el-form-item label="礼品类型：">{{productData.giftTypeName}}</el-form-item>
                        <el-form-item label="ERP 商品编号：">{{productData.productCode}}</el-form-item>
                        <el-form-item label="商品名称：">{{productData.productName}}</el-form-item>
                        <el-form-item label="生产厂家：">{{productData.ean}}</el-form-item>
                        <el-form-item label="规       格：">{{productData.specifications}}</el-form-item>
                    </el-form>
                </el-tab-pane>

                 <!-- 浏览记录 -->
                <el-tab-pane name="BrowsingHistory">
                    <span slot="label">浏览记录<i class="el-icon-arrow-down"></i></span>
                     <!-- :model="recordForm" ref="recordForm" -->
                     <keep-alive>
                         <browsing-history v-if="activeTab == 'BrowsingHistory'"></browsing-history>
                     </keep-alive>
                </el-tab-pane>

                <!-- 兑换记录 -->
                <el-tab-pane  name="ForRecord">
                    <span slot="label">兑换记录<i class="el-icon-arrow-down"></i></span>
                    <keep-alive>
                         <for-record v-if="activeTab == 'ForRecord'"></for-record>
                     </keep-alive>
                </el-tab-pane>

                 <!-- 修改历史 -->
                <el-tab-pane name="ModifyHistory" v-if="isOperationHistoryPermission">
                    <span slot="label">修改历史<i class="el-icon-arrow-down"></i></span>
                    <keep-alive>
                        <modify-history v-if="activeTab == 'ModifyHistory'"></modify-history>
                        <!-- <HistoryList v-if="activeTab=='ModifyHistory'" :entity="history.entity" :targetId="history.targetId" ></HistoryList> -->
                    </keep-alive>
                </el-tab-pane>

                <!-- <div class="todoWarpBottom">
                    <el-button size="small" @click="back">返回</el-button>
                </div> -->
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
                <p class="dialogNote">以下客户可获取此优惠券抵扣订单金额  已上传 <b class="errorColor">{{dialog.viewUserSize}}</b> 个客户</p>
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
    import { formatDateTimes, deleteBlankSpace } from 'common/js/dom';
    import Dialog from 'base/Dialog';

    import BrowsingHistory from '@/views/integralGift/BrowsingHistory';
    import ForRecord from '@/views/integralGift/ForRecord';
    import ModifyHistory from '@/views/integralGift/ModifyHistory';
    import HistoryList from 'base/HistoryList';

    import { getGiftCode, getApplyProductTypesView, getApplyUserTypesView } from 'api/interface';
    export default {
        components: {
            'browsing-history': BrowsingHistory,
            'for-record': ForRecord,
            'dialogModel': Dialog,
            'HistoryList': HistoryList,
            'ModifyHistory': ModifyHistory,
        },     
        name: "IntegralGiftDetail",    
        data() {
            return {
                loading: false,
                activeTab: '',
                editForm: {
                    giftCode: '',
                    code: '',       //编号
                    siteName: '',   //站点
                    category: '',   //分类
                    realStock: '',      //库存
                    point: '',   //积分
                    price: '',      //价值(价格)
                    status: '',      //状态
                    statusName: '',
                    //enableDate: '', //时间
                    enableDate: null,
                    remark: '',
                    giftName: '',   //礼品名称
                    fileLists1: null,    //上传缩略图片
                    fileLists2: null,    //上传礼品图片
                    siteData: null,
                    statusData: [],
                    fileList1: [],
                    fileList2: [],
                },

                companyNameLock: false, //商品无渠道提示

                browseRecords: [],  //修改历史

                basicLock: '',  //基础信息判断(是优惠券还是实体和药品)
                giftData: {},
                productData: {
                    channel: [],
                },
                public: {
                    giftCode: '',
                    giftName: '',
                    giftTypeName: '',
                    introduction: '',
                    effectiveStartTime: '',
                    effectiveEndTime: '',
                    effectiveTime: '',
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

                giftApi: 'http://10.16.17.229/',    //缩略图礼品图接收的前缀  
                imageSmall: '',
                image1: '',
                image2: '',
                image3: '',
                image4: '',
                image5: '',

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
            this.history.entity = 'PointGift'
            this.history.targetId = String(this.$route.query.id)

            this.getPermissions()
            this._getGiftCode(this.$route.query.id)
        },
        methods: {
            // 页面权限
            getPermissions: function() {
                var permissionsBtnArr = localStorage.getItem("permissionsBtn"); 
                var permissionsMenuArr = localStorage.getItem("permissionsMenu");
                if(permissionsBtnArr.includes("gift:pointGift:create")) {  
                    this.isAddPermission = true
                }else {
                    this.isAddPermission = false
                }
                if(permissionsBtnArr.includes("gift:pointGift:update")) {  
                    this.isEditPermission = true
                }else {
                    this.isEditPermission = false
                }
                if(permissionsBtnArr.includes("gift:pointGift:delete")) {  
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
            //加载列表
            _getGiftCode: function(id) {
                var params = {
                    id: id
                }
                this.loading = true
                getGiftCode(params).then( res => {
                    this.loading = false
                    if (res.status == 200) {
                        this.editForm = res.data
                        if (!this.editForm.effectiveStartTime) {
                            this.editForm.effectiveStartTime = ''
                        }else {
                            this.editForm.effectiveStartTime = formatDateTimes(this.editForm.effectiveStartTime)
                        }
                        if (!this.editForm.effectiveEndTime) {
                            this.editForm.effectiveEndTime = ''
                        }else {
                            this.editForm.effectiveEndTime = formatDateTimes(this.editForm.effectiveEndTime)
                        }
                        if (!this.editForm.effectiveStartTime&&!this.editForm.effectiveStartTime) {
                            this.editForm.enableDate = ''
                        }else {
                            this.editForm.enableDate = this.editForm.effectiveStartTime+"  ~  "+this.editForm.effectiveEndTime
                        }

                        if (!res.data.imageSmall) {
                            this.imageSmall = ''
                        }else {
                            this.imageSmall = this.giftApi+res.data.imageSmall
                        }

                        if (!res.data.image1) {
                            this.image1 = ''
                        }else {
                            this.image1 = this.giftApi+res.data.image1
                        }

                        if (!res.data.image2) {
                            this.image2 = ''
                        }else {
                            this.image2 = this.giftApi+res.data.image2
                        }

                        if (!res.data.image3) {
                            this.image3 = ''
                        }else {
                            this.image3 = this.giftApi+res.data.image3
                        }

                        if (!res.data.image4) {
                            this.image4 = ''
                        }else {
                            this.image4 = this.giftApi+res.data.image4
                        }

                        if (!res.data.image5) {
                            this.image5 = ''
                        }else {
                            this.image5 = this.giftApi+res.data.image5
                        }


                        if (res.data.giftTypeCode == 'coupon') {
                            this.basicLock = 'coupon'
                            console.log(this.basicLock)
                            this.giftData = res.data.gift.couponType

                            if (!this.giftData.effectiveFlag) {
                                this.public.effectiveStartTime = formatDateTimes(this.giftData.effectiveStartTime)
                                this.public.effectiveEndTime = formatDateTimes(this.giftData.effectiveEndTime)
                                this.public.effectiveTime = this.public.effectiveStartTime + "~" + this.public.effectiveEndTime
                            }
                            this.public.giftCode = res.data.giftCode
                            this.public.giftName = res.data.gift.giftName
                            this.public.giftTypeName = res.data.giftTypeName
                            this.public.introduction = res.data.gift.introduction
                            console.log('我是优惠券')
                        }else {
                            console.log('我是药品或者实体')
                            this.basicLock = 'drugEntity'
                            if (res.data.gift.product.stocks.length != 0) {
                                res.data.gift.product.stocks.forEach((item, index)=> {
                                    if (item.stockCode == this.editForm.companyCode) {
                                        this.editForm.drugRealStock = item.realStock
                                    }
                                })
                            }
                            console.log(this.editForm.drugRealStock)
                            this.productData.giftCode = res.data.gift.giftCode
                            this.productData.giftTypeName = res.data.gift.giftTypeName
                            this.productData.productCode = res.data.gift.product.productCode
                            this.productData.productName = res.data.gift.product.productName
                            this.productData.ean = res.data.gift.product.ean
                            this.productData.specifications = res.data.gift.product.specifications

                            if (res.data.gift.product.channel) {
                                this.productData.channel = res.data.gift.product.channel.split(",")
                            }
                            if (!res.data.gift.product.channel) {
                                this.companyNameLock = true
                            }else {
                                for(var key in this.productData.channel) {
                                    if (this.productData.channel[key] == this.editForm.companyCode) {
                                        this.companyNameLock = false
                                        return false
                                    }else {
                                        this.companyNameLock = true
                                    }
                                }
                            }
                        }
                    }
                })
            },
            // 返回上一层             
            back(){
                this.$router.go(-1); 
            }, 
            //跳到编辑
            handleEdit: function(index) {
                this.$router.push({  
                    path: index,     
                    query: {   
                        giftCode: this.$route.query.giftCode,
                        id: this.$route.query.id
                    }
                })
            },
            //适用商品
            goodsDialogShow: function() {
                this.$refs['goodsDialog-model'].showModel();
                var params = {
                    id: this.giftData.id,
                    applyProductTypes: this.giftData.applyProductTypes,
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
            //可用用户
            customersDialogShow: function(){
                this.$refs['customersDialog-model'].showModel();
                var params = {
                    id: this.giftData.id,
                    applyUserTypes: this.giftData.applyUserTypes,
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
                var effectiveDays = formatDateTimes(row.effectiveStartTime) +' -- '+ formatDateTimes(row.effectiveEndTime)
                return effectiveDays
            }, 

        } 
    }   
</script>

<style lang="scss" scoped>
    .giftTitle {
        margin-left: 50px;
        margin-top: 20px;
        font-weight: bold;
        font-size: 18px;
        position: relative;
        span {
            display: inline-block;
            width: 4px;
            height: 20px;
            background-color: #666;
            position: absolute;
            top: 0;
            left: -10px;
        }
    }
    .giftImageSmall {
        margin-left: 18px;
        .imageSmall {
            width: 120px;
            height: 120px;
        }
        span {
            display: inline-block;
            margin-top: 98px;
            margin-left: 10px;
            font-size: 12px;
            color: #606266;
            vertical-align: bottom;
        }
    }
    .giftImage {
        float: left;
        width: 220px;
        text-align: center;
        margin-bottom: 10px;
        .images {
            width: 180px;
            height: 180px;
        }
        span {
            font-size: 12px;
            color: #606266;
        }
    }
</style>
