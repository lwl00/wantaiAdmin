    <template>
    <div class="app-container">
        <div class="filter-container">
            <div class="giftTitle text-left">
                <span></span>礼品配置信息
            </div>
            <el-form
                :model="editForm"
                ref="editForm"
                label-width="170px"
                size="small"
                style="margin-top: 30px;"
                :rules="rules"
                v-loading="loading"
            >
                <el-form-item
                    label="礼品编号："
                    size="small"
                    class="text-left"
                >{{this.$route.query.giftCode}}</el-form-item>
                <el-form-item label="礼品站点：" class="text-left">
                    <el-select v-model="editForm.companyName" class="w180" disabled>
                        <el-option
                            v-for="item in editForm.siteData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <span
                        class="errorColor text-left"
                        style="display: inline-block;"
                        v-if="companyNameLock"
                    >（商品无此渠道，积分商城会展示为“暂无权限”，客户不可兑换。建议完善ERP商品的渠道）</span>
                </el-form-item>
                <el-form-item label="所属分类：" class="text-left" prop="category">
                    <el-select v-model="editForm.category" class="w180">
                        <el-option
                            v-for="item in categoryData"
                            :key="item.value"
                            :label="item.categoryName"
                            :value="item.categoryName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端礼品描述：" class="text-left">
                    <el-input
                        v-model="editForm.remark"
                        placeholder="请填写"
                        class="w400 pull-left"
                        maxlength="60"
                    ></el-input>
                    <span>（限60个字符）</span>
                </el-form-item>
                <el-form-item label="礼品库存：" class="text-left" prop="realStock">
                    <el-input
                        v-model.number="editForm.realStock"
                        placeholder="请填写"
                        class="w100"
                        :disabled="disabledRealStock"
                    ></el-input>
                </el-form-item>
                <!-- prop="point" -->
                <el-form-item label="兑换积分：" class="text-left" prop="point" required>
                    <el-input
                        v-model="editForm.point"
                        placeholder="请填写"
                        class="w100 pull-left"
                        @keyup.native="number"
                    ></el-input>
                    <span>(需要花费积分)</span>
                </el-form-item>
                <el-form-item
                    label="礼品价值："
                    class="text-left"
                    prop="price"
                    @keyup.native="lastNumber"
                >
                    ¥
                    <el-input v-model="editForm.price" placeholder="请填写" class="w100"></el-input>
                    <span>(仅做展示)</span>
                </el-form-item>
                <el-form-item label="礼品状态：" class="text-left">
                    <!-- :disabled="editForm.disabledStatue" -->
                    <el-radio-group v-model="editForm.status" :disabled="editForm.disabledStatue">
                        <el-radio
                            v-for="item in editForm.statusData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                        >
                            {{item.name}}
                            <span
                                v-if="editForm.isShowLimitTypeNums&&item.value =='0'"
                            >(所属礼品分类已下架)</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="礼品缩略图：" class="text-left" prop="giftSmall">
                    <el-checkbox-group v-model="editForm.giftSmall"></el-checkbox-group>
                    <el-upload
                        class="upload-demo"
                        :action="GiftAction"
                        :on-preview="handlePreview"
                        :on-remove="handleSmallRemove"
                        :file-list="editForm.fileList1"
                        :on-success="handleSuccessPreviary"
                        list-type="picture"
                        :limit="limitNum"
                        :on-exceed="handleExceed"
                        width="200px"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span>(列表页,至少上传一张,最多上传一张)</span>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="礼品图片：" class="text-left" prop="giftImage">
                    <el-checkbox-group v-model="editForm.giftImage"></el-checkbox-group>
                    <el-upload
                        class="upload-demo"
                        :action="GiftAction"
                        :on-preview="handlePreview"
                        :on-remove="handleGiftRemove"
                        :file-list="editForm.fileList2"
                        :on-success="handleSuccessGift"
                        :limit="limitGiftNum"
                        :on-exceed="handleGiftExceed"
                        list-type="picture"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span>(详情页,至少上传一张,最多上传五张)</span>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>

            <!--礼品基础信息  -->
            <div class="giftTitle pull-left">
                <span></span>礼品基础信息
            </div>
            <!-- 优惠券信息 -->
            <el-form
                ref
                label-width="100px"
                class="datailForm"
                size="small"
                style="margin-top: 80px; margin-left: 36px;"
                v-if="basicLock == 'coupon'&&editForm.state4 != ''"
            >
                <el-form-item label="礼品编号：">{{public.giftCode}}</el-form-item>
                <el-form-item label="礼品类型：">{{public.giftTypeName}}</el-form-item>
                <el-form-item label="礼品名称：">{{public.giftName}}</el-form-item>
                <el-form-item label="可用站点：">{{giftData.companyName}}</el-form-item>
                <el-form-item label="状态：">{{giftData.enable ? '已启用' : '已停用'}}</el-form-item>
                <el-form-item label="使用描述：">{{giftData.couponTypeName}}</el-form-item>
                <el-form-item label="优惠金额：">{{giftData.deduction}}元</el-form-item>
                <el-form-item label="起用金额：">{{giftData.premisPrice}}元</el-form-item>
                <el-form-item
                    label="有效时间："
                >{{giftData.effectiveFlag ? '从客户获取起 '+giftData.effectiveDays+' 天内' : '指定日期 ' + public.effectiveTime}}</el-form-item>
                <el-form-item label="获取渠道：">{{giftData.gainWayName}}</el-form-item>
                <el-form-item label="适用平台：">{{giftData.application}}</el-form-item>
                <el-form-item label="适用商品：">
                    {{giftData.applyProductTypesName}} {{giftData.applyProductCodes}}
                    <span
                        class="mianColor"
                        v-if="giftData.applyProductTypes == '4'"
                        @click="goodsDialogShow"
                    >查看详情</span>
                </el-form-item>
                <el-form-item label="可用客户：">
                    {{giftData.applyUserTypesName}} {{giftData.applyUserIds}}
                    <span
                        class="mianColor"
                        v-if="giftData.applyUserTypes == '4'"
                        @click="customersDialogShow"
                    >查看详情</span>
                </el-form-item>
                <el-form-item label="已发放数量：">{{giftData.issuedQuantity}}张</el-form-item>
                <el-form-item label="未使用数量：">{{giftData.unusedQuantity}}张</el-form-item>
                <el-form-item label="已使用数量：">{{giftData.usedQuantity}}张</el-form-item>
                <el-form-item label="已过期数量：">{{giftData.expiredQuantity}}张</el-form-item>
                <el-form-item label="礼品简介：">
                    <div v-html="public.introduction"></div>
                </el-form-item>
            </el-form>

            <!-- 实体卷和药物 -->
            <el-form
                ref
                label-width="100px"
                class="datailForm"
                size="small"
                style="margin-top: 80px; margin-left: 36px;"
                v-if="basicLock == 'drugEntity'"
            >
                <el-form-item label="礼品编号：">{{productData.giftCode}}</el-form-item>
                <el-form-item label="礼品类型：">{{productData.giftTypeName}}</el-form-item>
                <el-form-item label="ERP 商品编号：">{{productData.productCode}}</el-form-item>
                <el-form-item label="商品名称：">{{productData.productName}}</el-form-item>
                <el-form-item label="生产厂家：">{{productData.ean}}</el-form-item>
                <el-form-item label="规       格：">{{productData.specifications}}</el-form-item>
            </el-form>

            <div class="todoWarpBottom">
                <el-button
                    type="primary"
                    size="small"
                    @click="_editIntegralGift('editForm')"
                    :loading="saveLoading"
                >保存</el-button>
                <!-- <el-button size="small" @click="back">取消编辑</el-button> -->
                <el-button type="info" size="small" @click="handleReset('editForm')">重置</el-button>
            </div>
        </div>
        <!--======== 以下是弹出层 ========-->
        <!-- 商品列表弹窗 -->
        <dialogModel
            class="goodsDialog-model"
            ref="goodsDialog-model"
            :title="dialog.goodsDialogTitle"
            :width="dialog.goodsDialogWidth"
        >
            <div class="dialog-model-content">
                <p class="dialogNote">
                    购买以下商品可使用优惠券抵扣金额 已上传
                    <b class="errorColor">{{dialog.viewProductSize}}</b> 种商品
                </p>
                <div class="cmyyTable">
                    <el-table
                        :data="dialog.goodsDialogData"
                        stripe
                        height="400"
                        highlight-current-row
                        v-loading="dialog.goodsDialogLoading"
                    >
                        <el-table-column property="productCode" label="商品编号" align="center"></el-table-column>
                        <el-table-column property="productName" label="商品名称" align="center"></el-table-column>
                        <el-table-column property="specifications" label="规格" align="center"></el-table-column>
                        <el-table-column property="ean" label="厂家" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button type="primary" size="small">确定</el-button>
                <el-button size="small" @click="dialogHide('goodsDialog-model')">取消</el-button>
            </div>
        </dialogModel>

        <!-- 客户列表弹窗 -->
        <dialogModel
            class="customersDialog-model"
            ref="customersDialog-model"
            :title="dialog.customersDialogTitle"
            :width="dialog.customersDialogWidth"
        >
            <div class="dialog-model-content">
                <p class="dialogNote">
                    以下客户可获取此优惠券抵扣订单金额 已上传
                    <b class="errorColor">{{dialog.viewUserSize}}</b> 个客户
                </p>
                <div class="cmyyTable">
                    <el-table
                        :data="dialog.customersDialogData"
                        stripe
                        height="350"
                        highlight-current-row
                        v-loading="dialog.customersDialogLoading"
                    >
                        <el-table-column property="uid" label="客户编号" align="center"></el-table-column>
                        <el-table-column property="customerName" label="客户名称" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button type="primary" size="small">确定</el-button>
                <el-button size="small" @click="dialogHide('customersDialog-model')">取消</el-button>
            </div>
        </dialogModel>
    </div>
</template>

<script type="text/ecmascript-6">
import Dialog from 'base/Dialog';

import { dateTimeToStamp, deleteBlankSpace, positiveInteger, formatDateTimes } from 'common/js/dom'
import { getDictsData, getIntegralGift, getGiftCode, editIntegralGift, getGiftMessage, getGiftType, getGiftCategoryList, getApplyProductTypesView, getApplyUserTypesView } from 'api/interface';
import { GiftAction } from 'api/interface';
export default {
    components: {
        'dialogModel': Dialog,
    },
    name: "IntegralGiftEdit",
    data() {
        var validatePoint = (rule, value, callback) => {
            setTimeout(() => {
                if (value === '') {
                    callback(new Error('请输入兑换积分'));
                } else if (value == 0) {
                    callback(new Error('兑换积分不能为0'))
                } else {
                    callback();
                }
            }, 500)
        }
        return {
            saveLoading: false,  // 编辑保存
            GiftAction: GiftAction(),   //上传礼品当前action
            limitNum: 1,    //缩略图最多一张
            limitGiftNum: 5,    //礼品图最多5张
            imageSmall: '', //缩略图
            image1: '',     //礼品图1-5张
            image2: '',
            image3: '',
            image4: '',
            image5: '',

            activeTab: '',
            basicLock: '',      //基础信息判断(是优惠券还是实体和药品)
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
                effectiveTime: ''
            },

            list: {
                giftTypeName: '',
                giftName: '',
                ean: '',
                specifications: '',
                minUnit: '',
                zhongPackage: '',
                bigPackage: '',
                licenseNumber: '',
                form: '',
                saleScope: '',
                goodsCategory: '',
                otc: '',
                barcode: '',
                introduction: ''
            },
            editForm: {
                id: '',
                giftTypeCode: '',
                giftTypeName: '', //类型
                giftCode: '',
                code: '',       //编号
                siteName: '',   //站点
                category: '',   //分类
                realStock: '',      //库存
                point: '',   //积分
                price: '',      //价值(价格)
                status: 1,      //状态
                statusOld: null,
                enableDate: [],
                remark: '',
                giftName: '',   //礼品名称
                fileLists1: null,    //上传缩略图片
                fileLists2: null,    //上传礼品图片
                siteData: null,
                statusData: [],
                fileList1: [],
                fileList2: [],
                StartTime: '2018-10-23 00:00:00',
                EndTime: '2018-10-24 00:00:00',
                effectiveStartTime: '',
                effectiveEndTime: '',
                giftTypeData: [],

                disabledStatue: false,      //当前礼品状态disabled
                isShowLimitTypeNums: false,  //已下架提示

                imageSmall: '',
                image1: '',
                image2: '',
                image3: '',
                image4: '',
                image5: '',

                giftSmall: '',
                giftImage: ''
            },

            companyNameLock: false,

            giftApi: 'http://10.16.17.229/',    //缩略图礼品图接收的前缀

            baseForm: {     //基础信息内容

            },
            categoryData: [],   //礼品分类
            disabledRealStock: false,   //库存

            rules: {
                code: [{
                    required: true,
                    message: '请输入编号',
                    trigger: 'blur'
                }],
                siteName: [{
                    required: true,
                    message: '请选择站点',
                    trigger: 'change'
                }],
                category: [{
                    required: true,
                    message: '请选择分类',
                    trigger: 'change'
                }],
                giftTypeName: [{
                    required: true,
                    message: '请选择类型',
                    trigger: 'change'
                }],
                giftName: [{
                    required: true,
                    message: '请输入登录账号',
                    trigger: 'blur'
                }],
                remark: [{
                    required: true,
                    message: '请输入描述',
                    trigger: 'blur'
                }],
                realStock: [{
                    required: true,
                    message: '请输入库存',
                    trigger: 'blur'
                }],
                point: [{
                    validator: validatePoint,
                    trigger: 'blur'
                }],
                price: [{
                    required: true,
                    message: '请输入礼品价值',
                    trigger: 'blur'
                }],
                enableDate: [{
                    required: true,
                    message: '请选择生效时间',
                    trigger: 'change'
                }],
                giftSmall: [{
                    required: true,
                    message: '请添加礼品缩略图',
                    trigger: 'change'
                }],
                giftImage: [{
                    required: true,
                    message: '请添加礼品图片',
                    trigger: 'change'
                }],

            },
            loading: false,
            /*id*/
            browseRecords: [],      //历史修改
            recordForm: {
                enableDate: '',
                name: '',
                ID: '',
            },     //浏览记录
            dialog: {
                goodsDialogTitle: '商品列表',
                goodsDialogWidth: '1000px',
                goodsDialogData: [],
                goodsDialogLoading: false,
                viewProductSize: 0,

                customersDialogTitle: '客户列表',
                customersDialogWidth: '500px',
                customersDialogData: [],
                customersDialogLoading: false,
                viewUserSize: 0,
            },
            approval: null,
            baseGiftCode: '',
        }
    },
    created() {
        this._getGiftClass()
        this._getDictsData()
        this._getGiftCode(this.$route.query.id)
    },
    methods: {
        // 查询数据字典
        _getDictsData: function () {
            //状态
            var paramsEnableDisable = {
                code: 'GiftStatus'
            }
            getDictsData(paramsEnableDisable).then(res => {
                if (res.status == 200) {
                    this.editForm.statusData = res.data
                    //this.loading = false
                }
            })
            //礼品类型
            var paramsGiftType = {
                isAll: false,
                code: 'GiftType'
            }
            getDictsData(paramsGiftType).then(res => {
                this.editForm.giftTypeData = res.data
            })
        },
        //获取礼品分类
        _getGiftClass: function () {
            var params = {
                status: '',
                category: '',
                pageNum: '',
                pageSize: ''
            }
            getGiftCategoryList(params).then(res => {
                this.categoryData = res.data
            })
        },
        // 获取数据
        _getGiftCode: function (id) {
            var params = {
                id: id
            }
            this.loading = true
            getGiftCode(params).then(res => {
                this.loading = false
                if (res.status == 200) {
                    this.editForm.id = res.data.id
                    this.editForm.giftCode = res.data.giftCode     //编号
                    this.editForm.companyName = res.data.companyName    //站点
                    this.editForm.companyCode = res.data.companyCode    //站点
                    this.editForm.category = res.data.category    //所属分类
                    this.editForm.giftName = res.data.giftName    //礼品名称
                    this.editForm.giftTypeCode = res.data.giftTypeCode
                    this.editForm.giftTypeName = res.data.giftTypeName    //礼品类型
                    this.editForm.remark = res.data.remark        //描述
                    this.editForm.point = res.data.point       //积分
                    this.editForm.price = res.data.price          //价值
                    this.editForm.status = res.data.status
                    this.editForm.statusOld = res.data.status
                    this.editForm.imageSmall = res.data.imageSmall
                    this.editForm.image1 = res.data.image1
                    this.editForm.image2 = res.data.image2
                    this.editForm.image3 = res.data.image3
                    this.editForm.image4 = res.data.image4
                    this.editForm.image5 = res.data.image5

                    if (!res.data.imageSmall) {
                        this.editForm.giftSmall = '0'
                    } else {
                        this.editForm.giftSmall = '1'
                    }
                    if (!res.data.image1) {
                        this.editForm.giftImage = ''
                    } else {
                        this.editForm.giftImage = '1'
                    }

                    this.editForm.gift = res.data.gift

                    //获取缩略图
                    this.editForm.fileList1 = [{ url: this.giftApi + res.data.imageSmall }]
                    //获取礼品图
                    if (res.data.image1 != '') {
                        this.editForm.fileList2.push({ url: this.giftApi + res.data.image1 })
                    }
                    if (res.data.image2 != '') {
                        this.editForm.fileList2.push({ url: this.giftApi + res.data.image2 })
                    }
                    if (res.data.image3 != '') {
                        this.editForm.fileList2.push({ url: this.giftApi + res.data.image3 })
                    }
                    if (res.data.image4 != '') {
                        this.editForm.fileList2.push({ url: this.giftApi + res.data.image4 })
                    }
                    if (res.data.image5 != '') {
                        this.editForm.fileList2.push({ url: this.giftApi + res.data.image5 })
                    }

                    if (res.data.giftTypeCode == 'coupon') {
                        this.basicLock = 'coupon'
                        this.editForm.realStock = res.data.realStock      //优惠券库存
                        this.disabledRealStock = false
                        this.giftData = res.data.gift.couponType
                        if (!this.giftData.effectiveFlag) {
                            this.public.effectiveStartTime = formatDateTimes(this.giftData.effectiveStartTime)
                            this.public.effectiveEndTime = formatDateTimes(this.giftData.effectiveEndTime)
                            this.public.effectiveTime = this.public.effectiveStartTime + "~" + this.public.effectiveEndTime
                        }

                        this.baseGiftCode = this.public.giftCode = res.data.giftCode
                        this.public.giftName = res.data.giftName
                        this.public.giftTypeName = res.data.giftTypeName
                        this.public.introduction = res.data.gift.introduction

                        if (res.data.gift.couponType.enable == false) {
                            this.editForm.status = '0'
                            this.editForm.disabledStatue = true
                            this.editForm.isShowLimitTypeNums = false
                        } else {
                            this.editForm.status = '1'
                            this.editForm.disabledStatue = false
                            this.editForm.isShowLimitTypeNums = false
                        }

                        console.log('我是优惠券')
                    } else {
                        console.log('我是药品或者实体')
                        this.basicLock = 'drugEntity'
                        this.disabledRealStock = true
                        this.baseGiftCode = this.productData.giftCode = res.data.gift.giftCode
                        this.productData.giftTypeName = res.data.gift.giftTypeName
                        this.productData.productCode = res.data.gift.product.productCode
                        this.productData.productName = res.data.gift.product.productName
                        this.productData.ean = res.data.gift.product.ean
                        this.productData.specifications = res.data.gift.product.specifications

                        this.approval = res.data.gift.product.approval
                        if (res.data.gift.product.approval) {
                            this.editForm.disabledStatue = false
                        } else {
                            this.editForm.disabledStatue = true
                        }

                        if (res.data.gift.product.stocks.length != 0) {
                            res.data.gift.product.stocks.forEach((item, index) => {
                                if (item.stockCode == res.data.companyCode) {
                                    this.editForm.realStock = item.realStock
                                }
                            })
                        }
                        if (!res.data.gift.product.channel) {

                        } else {
                            this.productData.channel = res.data.gift.product.channel.split(",")
                        }

                        if (!res.data.gift.product.channel) {
                            this.companyNameLock = true
                        } else {
                            for (var key in this.productData.channel) {
                                if (this.productData.channel[key] == this.editForm.companyCode) {
                                    this.companyNameLock = false
                                    return false
                                } else {
                                    this.companyNameLock = true
                                }
                            }
                        }

                        // if (this.productData.channel.length != 0) {
                        //     for (var i = 0; i < this.productData.channel.length; i++) {
                        //         if (this.productData.channel[i] == this.editForm.companyCode) {
                        //             this.companyNameLock = false
                        //             return false;
                        //         }else {
                        //             this.companyNameLock = true
                        //         }
                        //     }
                        // }else {
                        //     this.companyNameLock = true
                        // }
                    }
                }
            })


        },
        // 返回上一层             
        back() {
            this.$router.push('/IntegralGift');
        },
        //删除缩略图片
        handleSmallRemove(file, fileList) {
            this.editForm.giftSmall = ''
        },
        //删除礼品图片
        handleGiftRemove(file, fileList) {
            this.editForm.image1 = ''
            this.editForm.image2 = ''
            this.editForm.image3 = ''
            this.editForm.image4 = ''
            this.editForm.image5 = ''
            this.image1 = ''
            this.image2 = ''
            this.image3 = ''
            this.image4 = ''
            this.image5 = ''
            if (fileList.length == 0) {
                this.editForm.giftImage = ''
            }
            console.log(fileList)
            for (var i = 0; i < fileList.length; i++) {
                if (i == 0) {
                    this.image1 = fileList[0].url.slice(20)
                    this.editForm.image1 = this.image1
                } else if (i == 1) {
                    this.image2 = fileList[1].url.slice(20)
                    this.editForm.image2 = this.image2
                } else if (i == 2) {
                    this.image3 = fileList[2].url.slice(20)
                    this.editForm.image3 = this.image3
                } else if (i == 3) {
                    this.image4 = fileList[3].url.slice(20)
                    this.editForm.image4 = this.image4
                } else if (i == 4) {
                    this.image5 = fileList[4].url.slice(20)
                    this.editForm.image5 = this.image5
                }
            }
            console.log(this.image1)
            console.log(this.image2)
            console.log(this.image3)
            console.log(this.image4)
            console.log(this.image5)
            // if (fileList.length == 0) {
            //     this.editForm.giftImage = ''
            // }
        },
        //点击图片上传
        handlePreview(file) {

        },
        //缩略图片上传成功
        handleSuccessPreviary: function (response, file, fileList) {
            this.editForm.giftSmall = '1'
            this.imageSmall = fileList[0].response.data
        },
        //礼品图片上传成功
        handleSuccessGift: function (response, file, fileList) {
            this.editForm.giftImage = '1'
            console.log(fileList)
            for (var i = 0; i < fileList.length; i++) {
                if (i == 0) {
                    if (fileList[0].response == null) {
                        //截取后20位
                        this.image1 = fileList[0].url.slice(20)
                    } else {
                        this.image1 = fileList[0].response.data
                    }
                } else if (i == 1) {
                    if (fileList[1].response == null) {
                        this.image2 = fileList[1].url.slice(20)
                    } else {
                        this.image2 = fileList[1].response.data
                    }
                } else if (i == 2) {
                    if (fileList[2].response == null) {
                        this.image3 = fileList[2].url.slice(20)
                    } else {
                        this.image3 = fileList[2].response.data
                    }
                } else if (i == 3) {
                    if (fileList[3].response == null) {
                        this.image4 = fileList[3].url.slice(20)
                    } else {
                        this.image4 = fileList[3].response.data
                    }
                } else if (i == 4) {
                    if (fileList[4].response == null) {
                        this.image5 = fileList[4].url.slice(20)
                    } else {
                        this.image5 = fileList[4].response.data
                    }
                }
            }
            console.log(this.image2)
        },
        //正整数
        number: function () {
            this.editForm.point = this.editForm.point.replace(/[^\.\d]/g, '')
            this.editForm.point = this.editForm.point.replace('.', '')
        },
        //后两位小数
        lastNumber: function () {
            this.editForm.price = this.editForm.price.replace(/\.\d{2,}$/, this.editForm.price.substr(this.editForm.price.indexOf('.'), 3))
        },
        //保存编辑
        _editIntegralGift: function (formName) {
            this.saveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        id: this.editForm.id,
                        giftCode: this.editForm.giftCode,     //编号
                        companyCode: this.editForm.companyCode,    //站点
                        category: this.editForm.category,    //所属分类
                        giftName: this.editForm.giftName,    //礼品名称
                        giftTypeCode: this.editForm.giftTypeCode,   //礼品类型
                        remark: this.editForm.remark,        //描述
                        realStock: this.editForm.realStock,      //库存
                        point: this.editForm.point,       //积分
                        price: this.editForm.price,          //价值
                        status: this.editForm.status,        //状态
                        imageSmall: this.imageSmall,
                        image1: '',
                        image2: '',
                        image3: '',
                        image4: '',
                        image5: '',

                        //gift: this.editForm.gift
                    }
                    //iamgeSmall没修改返回原来的数据回去,修改则上传修改后的
                    if (this.imageSmall == '') {
                        params.imageSmall = this.editForm.imageSmall
                    } else {
                        params.imageSmall = this.imageSmall
                    }
                    //image1
                    if (this.image1) {
                        params.image1 = this.image1
                    } else {
                        params.image1 = this.editForm.image1
                    }
                    //image2
                    if (this.image2) {
                        params.image2 = this.image2
                    } else {
                        params.image2 = this.editForm.image2
                    }
                    //image3
                    if (this.image3) {
                        params.image3 = this.image3
                    } else {
                        params.image3 = this.editForm.image3
                    }
                    //image4
                    if (this.image4) {
                        params.image4 = this.image4
                    } else {
                        params.image4 = this.editForm.image4
                    }
                    //image5
                    if (this.image5) {
                        params.image5 = this.image5
                    } else {
                        params.image5 = this.editForm.image5
                    }

                    console.log(params)
                    editIntegralGift(params).then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            })
                            this.$router.push('/integralGift/IntegralGift')
                        } else if (res.status == 500) {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                        this.saveLoading = false
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请完善信息'
                    })
                    this.saveLoading = false
                    return false
                }
            })
        },
        //重置
        handleReset: function (formName) {
            this.loading = false
            this.editForm.fileList2 = []
            this._getGiftCode(this.$route.query.id)
            this.$message('重置成功')
        },
        //转换时间
        formatterDate: function (row, column) {      //转换时间值
            return formatDateTimes(row)
        },
        // 商品列表弹窗显示
        goodsDialogShow: function () {
            this.$refs['goodsDialog-model'].showModel()

            var params = {
                id: this.giftData.id,
                applyProductTypes: this.giftData.applyProductTypes,
            }
            this.dialog.goodsDialogLoading = true
            getApplyProductTypesView(params).then(res => {
                this.dialog.goodsDialogLoading = false
                if (res.status == 200) {
                    this.dialog.goodsDialogData = res.data
                    this.dialog.viewProductSize = res.data.length
                }
            })

        },
        // 客户列表弹窗显示
        customersDialogShow: function () {
            this.$refs['customersDialog-model'].showModel()

            var params = {
                id: this.giftData.id,
                applyUserTypes: this.giftData.applyUserTypes,
            }

            this.dialog.customersDialogLoading = true
            getApplyUserTypesView(params).then(res => {
                this.dialog.customersDialogLoading = false
                if (res.status == 200) {
                    this.dialog.customersDialogData = res.data
                    this.dialog.viewUserSize = res.data.length
                }
            })

        },
        // 弹窗关闭
        dialogHide: function (type) {
            this.$refs[type].hideModel()
        },
        //监听
        giftTypeCodeChange: function (val) {

        },
        //缩略图超出限制回调
        handleExceed: function (files, fileList) {
            this.$message({
                type: 'error',
                message: '礼品缩略图最多只能上传一张'
            })
        },
        //礼品图超出限制回调
        handleGiftExceed: function (files, fileList) {
            this.$message({
                type: 'error',
                message: '礼品图片最多只能上传五张'
            })
        },
    },
    watch: {
        'editForm.category': {
            handler: function (curVal, oldVal) {
                var params = {
                    status: '',
                    category: curVal,
                    pageNum: '',
                    pageSize: ''
                }
                getGiftCategoryList(params).then(res => {
                    console.log(res.data[0].statusName == '已下架')
                    if (res.data[0].statusName == '已下架') {
                        console.log('已下架')
                        this.editForm.isShowLimitTypeNums = true
                        this.editForm.disabledStatue = true
                        this.editForm.status = '0'
                    } else {
                        if (this.editForm.statusOld == '0') {
                            this.editForm.isShowLimitTypeNums = false
                            this.editForm.disabledStatue = false
                            this.editForm.status = '0'
                        } else {
                            this.editForm.isShowLimitTypeNums = false
                            this.editForm.disabledStatue = false
                            this.editForm.status = '1'
                        }
                    }
                    if (this.approval == true) {
                        //this.editForm.disabledStatue = false
                    } else if (this.approval == false) {
                        this.editForm.disabledStatue = true
                        this.editForm.status = '0'
                    }
                    if (this.giftData.enable == false) {
                        this.editForm.status = '0'
                        this.editForm.disabledStatue = true
                    }
                    //console.log(this.editForm.disabledStatue)
                })
            }
        }
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
.el-form-item.is-required .el-form-item__label:before {
    content: "" !important;
    color: #fff;
    margin-right: 4px;
}
</style>
