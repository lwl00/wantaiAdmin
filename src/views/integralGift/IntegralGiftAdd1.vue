<template>
   <div class="app-container">
        <div class="filter-container">
            <el-form :model="addForm" ref="addForm" label-width="170px" class="" size="small" :rules="rules">
                <el-form-item label="请选择礼品ID：" size="small" class="text-left" prop="state4">
                    <el-autocomplete
                        v-model="addForm.state4"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                        @keyup.native="timeoutGetUserGiftCode"
                    ></el-autocomplete>
                    <!-- @keyup.enter.native="_getTimeoutGetUserGiftCode" 回车方法-->
                </el-form-item>
                <div class="giftTitle pull-left"><span></span>礼品配置信息</div>
                <el-form-item label="礼品站点：" class="text-left" prop="siteName"  style="margin-top: 70px;">
                    <el-select v-model="addForm.siteName" class="w180" @change="siteNameChange" :disabled="disabledSite">
                        <el-option
                            v-for="(item, index) in addForm.siteData"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="errorColor text-left"  style="display: inline-block;" v-if="companyNameLock">（该礼品暂无站点）</span>
                </el-form-item>
                <el-form-item label="所属分类："  class="text-left" prop="category">
                    <el-select v-model="addForm.category" class="w180" @change="classChange">
                        <el-option
                            v-for="item in addForm.categoryData"
                            :key="item.value"
                            :label="item.categoryName"
                            :value="item.categoryName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端礼品描述：" class="text-left">
                    <el-input v-model="addForm.remark" placeholder="请填写" class="w400 pull-left" maxlength="60"></el-input> <span>（限60个字符）</span>
                </el-form-item>
                <el-form-item label="礼品库存："  class="text-left" prop="realStock">
                    <el-input v-model.number="addForm.realStock" placeholder="请填写" class="w100" :disabled="disabledRealStock"></el-input>
                </el-form-item>
                <el-form-item label="兑换积分：" class="text-left" prop="point" required>
                    <el-input v-model="addForm.point" placeholder="请填写" class="w100 pull-left" @keyup.native="number"></el-input><span>(需要花费积分)</span>
                </el-form-item>
                <el-form-item label="礼品价值：" class="text-left" prop="price" @keyup.native="lastNumber">
                    ¥<el-input v-model="addForm.price" placeholder="请填写" class="w100"></el-input><span>(仅做展示)</span>
                </el-form-item>
                <el-form-item label="礼品状态：" class="text-left" prop="status">
                    <el-radio-group v-model="addForm.status" :disabled="addForm.disabledStatue">
                        <el-radio 
                            v-for="item in addForm.statusData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            {{item.name}}
                            <span v-if="addForm.isShowLimitTypeNums&&item.value =='0'">(所属礼品分类已下架)</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="有效期：" class="text-left" prop="">
                    <el-date-picker
                      v-model="addForm.enableDate"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item> -->
                <el-form-item label="礼品缩略图：" class="text-left" prop="imageSmall">
                    <el-checkbox-group v-model="addForm.imageSmall"></el-checkbox-group>
                    <el-upload
                        class="upload-demo"
                        :action="GiftAction"
                        :on-preview="handlePreview"
                        :on-remove="handleSmallRemove"
                        :file-list="addForm.fileList1"
                        :on-success="handleSuccessPreviary"
                        list-type="picture"
                        :limit="limitNum"
                        :on-exceed="handleExceed"
                        @change="handleList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span>(列表页,至少上传一张,最多上传一张)</span>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="礼品图片：" class="text-left" prop="giftImage">
                    <el-checkbox-group v-model="addForm.giftImage"></el-checkbox-group>
                    <el-upload
                        v-model="addForm.giftImage"
                        class="upload-demo"
                        :action="GiftAction"
                        :on-preview="handlePreview"
                        :on-remove="handleGiftRemove"
                        :file-list="addForm.fileList2"
                        :on-success="handleSuccessGift"
                        :limit="limitGiftNum"
                        :on-exceed="handleGiftExceed"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span>(详情页,至少上传一张,最多上传五张)</span>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="giftTitle pull-left" v-if="addForm.giftCode"><span></span>礼品基础信息</div>

            <!-- 优惠券信息 -->
            <el-form ref="" label-width="100px" class="datailForm" size="small" style="margin-top: 80px; margin-left: 36px;" v-if="basicLock == 'coupon'&&addForm.state4 != ''">
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
                    <span class="mianColor reader" v-if="giftData.applyProductTypes == '4'" @click="goodsDialogShow">查看详情</span>
                </el-form-item>
                <el-form-item label="可用客户：">
                    {{giftData.applyUserTypesName}} {{giftData.applyUserIds}}
                    <span class="mianColor reader" v-if="giftData.applyUserTypes == '4'" @click="customersDialogShow">查看详情</span>
                </el-form-item>
                <el-form-item label="已发放数量：">{{giftData.issuedQuantity}}张</el-form-item>
                <el-form-item label="未使用数量：">{{giftData.unusedQuantity}}张</el-form-item>
                <el-form-item label="已使用数量：">{{giftData.usedQuantity}}张</el-form-item>
                <el-form-item label="已过期数量：">{{giftData.expiredQuantity}}张</el-form-item>
                <el-form-item label="礼品简介："><div v-html="public.introduction"></div></el-form-item>
            </el-form>

            <!-- 实体卷和药物 -->
            <el-form ref="" label-width="100px" class="datailForm" size="small" style="margin-top: 80px; margin-left: 36px;" v-if="basicLock == 'drugEntity'&&addForm.state4 != ''">
                <el-form-item label="礼品编号：">{{integral.giftCode}}</el-form-item>
                <el-form-item label="礼品类型：">{{integral.giftTypeName}}</el-form-item>
                <el-form-item label="ERP 商品编号：">{{productData.productCode}}</el-form-item>
                <el-form-item label="商品名称：">{{productData.productName}}</el-form-item>
                <el-form-item label="生产厂家：">{{productData.ean}}</el-form-item>
                <el-form-item label="规       格：">{{productData.specifications}}</el-form-item>
            </el-form>

            <div class="todoWarpBottom">
                <el-button
                    type="primary"
                    size="small"
                    @click="_addIntegralGift('addForm')"
                    :loading="saveLoading">确认新增</el-button>
                <!-- <el-button size="small" @click="back">返回</el-button> -->
                <el-button type="info" size="small" @click="handleReset('addForm')">重置</el-button>
            </div>
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
                        height="400"
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
    import dialog from 'base/Dialog'
    import { dateTimeToStamp, deleteBlankSpace, positiveInteger, formatDateTimes } from 'common/js/dom'
    import { getDictsData, addIntegralGift, getGiftId, getGiftMessage, getGiftCode, getGiftType, getGiftCategoryList, getApplyProductTypesView, getApplyUserTypesView } from 'api/interface';

    import { GiftAction } from 'api/interface';
    export default {
        components: {
            'dialogModel': dialog,
        },     
        name: "IntegralGiftAdd",    
        data() {
            var validatePoint = (rule, value, callback) => {
                setTimeout(() => {
                    if (value === '') {
                        callback(new Error('请输入兑换积分'));
                    }else if (value == 0) {
                        callback(new Error('兑换积分不能为0'))
                    }else {
                        callback();
                    }
                }, 500)
            }
            return {
                saveLoading: false, // 新增保存
                GiftAction: GiftAction(),   //上传礼品当前action
                limitNum: 1,    //缩略图最多一张
                limitGiftNum: 5,    //礼品图最多5张
                imageSmall: '', //缩略图
                image1: '',     //礼品图1-5张
                image2: '',
                image3: '',
                image4: '',
                image5: '',

                addLoading: false,

                table: {
                    tableData: []
                },

                basicLock: '',
                giftData: {},   //通用优惠券
                productData: [],    //通用药品或者实体
                integral: {
                    productCode: '',
                    giftTypeName: '',
                    channel: [],
                    channelRealStockArr: [],
                    giftCode: '',

                    realStock: [],
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
                addForm: {

                    giftTypeCode: '',
                    giftCode: '',
                    code: '',       //编号
                    siteName: '',   //站点
                    category: '',   //分类
                    realStock: '',      //库存
                    point: '',   //积分
                    price: '',      //价值(价格)
                    status: '0',      //状态
                    enableDate: [],
                    remark: '',
                    giftName: '',   //礼品名称
                    fileLists1: null,    //上传缩略图片
                    fileLists2: null,    //上传礼品图片
                    siteData: [],
                    giftIdData: [{
                        name: '102407',
                        value: '102407',
                    }, {
                        name: '1000',
                        value: '1000',
                    }, {
                        name: '1001',
                        value: '1001',
                    }],
                    categoryData: [],

                    giftTypeData: [],   //礼品类型
                    statusData: [],
                    fileList1: [],
                    fileList2: [],
                    options4: [],   
                    value9: [], //礼品数组
                    list: [],   //礼品list
                    states: [],     //礼品id列表

                    state4: '',

                    disabledStatue: false,     //礼品状态的禁用
                    isShowLimitTypeNums: false,

                    imageSmall: '',     //缩略图(用于验证)
                    giftImage: ''       //礼品图(用于验证)
                },

                disabledSite: false,    //站点禁用状态
                disabledRealStock: false,   //库存
                loading: false, //加载
                baseForm: {     //基础信息内容

                },
                rules: {
                    state4: [{
                         required: true, 
                         message: '请输入礼品ID',
                         trigger: 'change' 
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
                    giftTypeCode: [{
                         required: true, 
                         message: '请选择名称', 
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
                         message: '请输入库存' 
                    }, { 
                        type: 'number', 
                        message: '库存必须为数字',
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
                         message: '请选择有效日期', 
                         trigger: 'change' 
                    }],
                    status: [{
                         required: true, 
                         message: '请选择礼品状态', 
                         trigger: 'change' 
                    }],
                    imageSmall: [{
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
                inputName: '',
                repeat: false,

                restaurants: [],    //input远程关键字
                state4: '',
                timeout:  null,

                public: {
                    giftCode: '',
                    giftName: '',
                    giftTypeName: '',
                    introduction: '',
                    effectiveStartTime: '',
                    effectiveStartTime: '',
                    effectiveTime: ''
                },

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
                data: {},
                channelSiteData: null,
                stocks: null, //礼品库(有站点和库存)

                companyNameLock: false,
                approval: null,
            }
        },
        created() {
            this._getDictsData()
            this._getGiftClass()
        },
        methods: {
            //加载礼品ID
            _getGiftId: function() {
                var params = {}
                getGiftId(params).then( res => {
                    this.addForm.states = res.data
                    this.addLoading = true
                })
            },

            // 加载数据字典
            _getDictsData: function() {
                //站点
                if(this.addForm.siteName == ''){
                    var data = {
                        isAll: false,
                        code: 'CompanyCode'
                    }
                    getDictsData(data).then(res=> {
                        if (res.status == 200) {
                            this.channelSiteData = res.data
                        }
                    })
                }
                // 状态
                var statusData = {
                    isAll: false,
                    code: 'GiftStatus'
                }
                getDictsData(statusData).then(res=> {
                    if (res.status == 200) {
                        this.addForm.statusData = res.data
                    }
                })
                // 获取礼品类型select
                var paramsGiftType = {
                    isAll: false,
                    code: 'GiftType'
                }
                getDictsData(paramsGiftType).then(res=> {
                    if(res.status == 200) {
                        this.addForm.giftTypeData = res.data
                    }
                })
            },
            //获取礼品分类
            _getGiftClass: function() {
                var params = {
                    status: '',
                    category: '',
                    pageNum: '',
                    pageSize: ''
                }
                getGiftCategoryList(params).then( res => {
                    this.addForm.categoryData = res.data
                })

            },

            // 返回上一层             
            back(){
                this.$message('新增取消')
                this.$router.go(-1); 
            },
            //删除缩略图片
            handleSmallRemove(file, fileList) {
                this.imageSmall = ''
                this.addForm.imageSmall = ''
            },
            //删除礼品图片
            handleGiftRemove(file, fileList) {
                this.image1 = ''
                this.image2 = ''
                this.image3 = ''
                this.image4 = ''
                this.image5 = ''
                if (fileList.length == 0) {
                    this.addForm.giftImage = ''
                }
                for (var i = 0; i < fileList.length; i++) {
                    if (i == 0) {
                        this.image1 = fileList[0].response.data
                    }else if (i == 1) {
                        this.image2 = fileList[1].response.data
                    }else if (i == 2) {
                        this.image3 = fileList[2].response.data
                    }else if (i == 3) {
                        this.image4 = fileList[3].response.data
                    }else if (i == 4) {
                        this.image5 = fileList[4].response.data
                    }
                }
            },
            //点击图片上传
            handlePreview(file) {
            },
            //缩略图片上传成功
            handleSuccessPreviary: function(response, file, fileList) {
                this.imageSmall = fileList[0].response.data
                this.addForm.imageSmall = '1'
            },
            //礼品图片上传成功
            handleSuccessGift: function(response, file, fileList) {
                this.addForm.giftImage = '1'
                for (var i = 0; i < fileList.length; i++) {
                    if (i == 0) {
                        this.image1 = fileList[0].response.data
                    }else if (i == 1) {
                        this.image2 = fileList[1].response.data
                    }else if (i == 2) {
                        this.image3 = fileList[2].response.data
                    }else if (i == 3) {
                        this.image4 = fileList[3].response.data
                    }else if (i == 4) {
                        this.image5 = fileList[4].response.data
                    }
                }
            },
            //缩略图超出限制回调
            handleExceed: function(files, fileList) {
                this.$message({
                    type: 'error',
                    message: '礼品缩略图最多只能上传一张'
                })
            },
            //礼品图超出限制回调
            handleGiftExceed: function(files, fileList) {
                this.$message({
                    type: 'error',
                    message: '礼品图片最多只能上传五张'
                })
            },
            handleList: function(value) {
            },
            //点击新增
            _addIntegralGift: function(formName) {
                this.saveLoading = true
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var params = {
                            giftCode: this.addForm.giftCode,     //编号
                            companyCode: this.addForm.siteName,    //站点
                            category: this.addForm.category,    //所属分类
                            giftName: this.addForm.giftName,    //礼品名称
                            giftTypeCode: this.addForm.giftTypeCode,     //礼品类型
                            //giftTypeName: this.addForm.giftTypeName,    //礼品类型
                            remark: this.addForm.remark,        //描述
                            realStock: '',      //库存
                            point: this.addForm.point,       //积分
                            price: this.addForm.price,          //价值
                            status: this.addForm.status,        //状态
                            //effectiveStartTime: dateTimeToStamp(this.addForm.enableDate[0]),   //开始时间
                            //effectiveEndTime: dateTimeToStamp(this.addForm.enableDate[1]),     //结束时间
                            imageSmall: this.imageSmall,
                            image1: this.image1,
                            image2: this.image2,
                            image3: this.image3,
                            image4: this.image4,
                            image5: this.image5,
                        }
                        if (this.addForm.realStock!== '') {
                            params.realStock= this.addForm.realStock
                        }
                        addIntegralGift(params).then( res => {
                            if(res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '新增成功'
                                })
                                this.$router.push('/integralGift/IntegralGift')
                            }else if(res.status == 500) {
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
                        return false;
                    }
                })
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true
                    setTimeout(() => {
                        this.loading = false
                        this.addForm.options4 = this.addForm.list.filter(item => {
                            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                        })
                    }, 200)
                } else {
                    this.addForm.options4 = []
                }
            },
            //加载通用信息列表
            _getGiftMessage: function() {
                var params = {
                    giftCode: ''
                }
                if (this.addForm.giftCode!=='') {
                    params.giftCode = this.addForm.giftCode
                }
                
                this.addForm.siteData = []
                this.companyNameLock = false
                getGiftMessage(params).then( res => {
                    if (res.status == 200) {
                        if (res.data.giftTypeCode == 'coupon') {
                            this.basicLock = 'coupon'

                            this.addForm.siteData = this.channelSiteData
                            this.giftData = res.data.couponType
                            if (!this.giftData.effectiveFlag) {
                                this.public.effectiveStartTime = formatDateTimes(this.giftData.effectiveStartTime)
                                this.public.effectiveEndTime = formatDateTimes(this.giftData.effectiveEndTime)
                                this.public.effectiveTime = this.public.effectiveStartTime + "~" + this.public.effectiveEndTime
                            }
                            this.public.giftCode = res.data.giftCode
                            this.public.giftName = res.data.giftName
                            this.public.giftTypeName = res.data.giftTypeName
                            this.public.introduction = res.data.introduction

                            if (res.data.couponType.enable == false) {
                                this.addForm.status = '0'
                                this.addForm.disabledStatue = true
                            }else {
                                this.addForm.status = '1'
                                this.addForm.disabledStatue = false
                                this.addForm.isShowLimitTypeNums = false
                            }

                            this.addForm.siteName = res.data.couponType.companyCode

                            this.addForm.giftTypeCode = res.data.giftTypeCode
                            this.disabledSite = true
                            this.disabledRealStock = false

                            console.log('我是优惠券')
                        }else {
                            console.log('我是药品或者实体')
                            this.basicLock = 'drugEntity'

                            this.productData = res.data.product
                            this.integral.giftCode = res.data.giftCode
                            this.integral.productCode = res.data.productCode
                            this.integral.giftTypeName = res.data.giftTypeName

                            this.stocks = res.data.product.stocks
                            this.approval = res.data.product.approval
                            if (this.approval == true) {
                                this.addForm.disabledStatue = false
                            }else if (this.approval == false) {
                                this.addForm.disabledStatue = true
                                this.addForm.status = '0'
                            }
                             //siteData realStock
                             // if (res.data.product.stocks.length == 0) {
                             //    this.companyNameLock = true
                             // }else {
                             //    this.companyNameLock = false
                             // }

                            //  res.data.product.stocks.forEach( (item, index)=> {
                            //     this.integral.channel.push(item.stockCode)
                            //     this.integral.realStock.push(item.realStock)
                            //  })

                            //  if (this.integral.channel.length!=0) {
                            //     this.integral.channel.forEach((item,index) => {
                            //         try{
                            //             for(var key in this.channelSiteData) {
                            //                 if (this.channelSiteData[key].value == item) {
                            //                     this.addForm.siteData.push(this.channelSiteData[key])
                            //                     this.integral.channelRealStockArr.push(this.integral.realStock[index])
                            //                 }
                            //             }
                            //         }catch(err){

                            //         }
                            //     })
                            // }
                            //console.log(!res.data.product.channel)
                            if(!res.data.product.channel) {
                               this.companyNameLock = true
                            }else {
                                this.companyNameLock = false
                                if (res.data.product.channel.indexOf(",") > -1) {
                                    this.integral.channel = res.data.product.channel.split(",")
                                    console.log(this.integral.channel)
                                    this.integral.channel.forEach((item,index) => {
                                        try{
                                            for(var key in this.channelSiteData) {
                                                if (this.channelSiteData[key].value == item) {
                                                    this.addForm.siteData.push(this.channelSiteData[key])
                                                }
                                            }
                                            console.log(this.addForm.siteData)
                                        }catch(err){

                                        }
                                    })
                                }else {
                                    this.channelSiteData.forEach((item,index) => {
                                        if (item.value == res.data.product.channel) {
                                            this.addForm.siteData.push(item)
                                        }
                                    })
                                    // this.integral.channel.forEach( (item,index) => {
                                    //     try{
                                    //         for(var key in this.channelSiteData) {
                                    //             if (this.channelSiteData[key].value == this.integral.channel[0]) {
                                    //                 this.addForm.siteData.push(this.channelSiteData[key])
                                    //             }
                                    //         }
                                    //     }catch(err) {
                                    //     }
                                    // })
                                }
                            }
                        }
                        this.addForm.giftName = res.data.giftName
                    }else if (res.status == 500) {
                        this.$message({
                            type: 'error',
                            message: res.message
                        })
                    }
                })
            },
            //正整数
            number: function(){　　
        　　　   this.addForm.point=this.addForm.point.replace(/[^\.\d]/g,'')
                this.addForm.point=this.addForm.point.replace('.','')
        　　},
            //后两位小数
            lastNumber: function() {
                this.addForm.price=this.addForm.price.replace(/\.\d{2,}$/,this.addForm.price.substr(this.addForm.price.indexOf('.'),3))
            },
            //重置
            handleReset: function(formName) {
                this.$refs[formName].resetFields();
                this.$message('重置成功')
            },
            //查询code是否重复
            _codeChange: function(val) {
            },
            //获取远程礼品id数据
            querySearchAsync(queryString, cb) {
                var params = {
                    giftCode: queryString,
                }
                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    getGiftId(params).then( res => {
                        if (res.status == 200) {
                            res.data.forEach(function(el,index) {
                                el.value = el.value
                            })
                        }
                        this.restaurants = res.data
                        cb(this.restaurants)
                    })
                }, 1500 * Math.random())
            },
            //获取当前input远程关键字
            handleSelect(item) {
                this.addForm.siteData = []
                this.addForm.giftCode = item.value
                this._getGiftMessage()
            },
            //新增当前站点
            siteNameChange: function(val) {
                var that = this
                console.log(val)
                console.log(this.stocks)
                this.stocks.forEach((item, index)=> {
                    if (item.stockCode == val) {
                        that.addForm.realStock = Number(item.realStock)
                        that.disabledRealStock = true
                    }
                })
                // this.addForm.siteData.forEach(function(item, index) {
                //     if(item.value == event) {
                //         that.addForm.realStock = Number(that.integral.channelRealStockArr[index])
                //         that.disabledRealStock = true
                //     }
                // })
            },
            //礼品分类改变
            classChange: function(val) {
                 var params = {
                    status: '',
                    category: val,
                    pageNum: '',
                    pageSize: ''
                }
                getGiftCategoryList(params).then( res => {
                    if (this.giftData.enable == false) {
                        this.addForm.status = '0'
                        this.addForm.disabledStatue = true
                    }else {
                        // this.addForm.status = '1'
                        this.addForm.disabledStatue = false
                        // this.addForm.isShowLimitTypeNums = false
                    }
                    if (res.data[0].statusName == '已下架') {
                        this.addForm.isShowLimitTypeNums = true
                        this.addForm.disabledStatue = true
                        this.addForm.status = '0'
                    }else {
                        this.addForm.isShowLimitTypeNums = false
                        this.addForm.disabledStatue = false
                        this.addForm.status = '1'
                    }
                    if (this.basicLock == 'drugEntity') {
                        if (!this.approval) {
                            console.log('我在这里')
                            this.addForm.disabledStatue = true
                            this.addForm.status = '0'
                        }
                    }
                })
            },
            //商品列表弹窗显示
            goodsDialogShow: function() {
                this.$refs['goodsDialog-model'].showModel()

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
            //客户列表弹窗显示
            customersDialogShow: function() {
                this.$refs['customersDialog-model'].showModel()

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
                this.$refs[type].hideModel()
            },
            //当礼品输完6位时候自己去获取
            timeoutGetUserGiftCode: function() {
                if(this.addForm.state4.length == 6) {
                    this.addForm.giftCode = this.addForm.state4
                    this._getGiftMessage()
                }
            },
            //当礼品id写完6位数时候回车去请求
            _getTimeoutGetUserGiftCode: function() {
                if(this.addForm.state4.length == 6) {
                    this.addForm.giftCode = this.addForm.state4
                    this._getGiftMessage()
                }
            },  
        },
        mounted() {

        },
        watch: {
            inputName: {
                handler: function(curVal, oldVal) {
                    if (curVal !== oldVal) {
                        var params = {
                            giftCode: curVal
                        }
                        getGiftCode(params).then( res => {
                            if(res.data==null) {
                                this.inputName = this.inputName
                                this.repeat = false 
                            }else {
                                this.inputName = this.inputName
                                this.$message({
                                    type: 'error',
                                    message: '编号已重复,请重新输入'
                                })
                                this.repeat = true
                            }
                        })
                    }
                }
            },
            'addForm.state4': {     //监听state4为空的时候给this.addForm.giftCode = ''
                handler(curVal, oldVal) {
                    if (curVal.length<6) {
                        this.addForm.giftCode = ''
                        this.disabledRealStock = false
                        this.addForm.realStock = ''
                        this.disabledSite = false
                        this.addForm.siteName = ''
                        this.addForm.status = '0'
                        this.addForm.disabledStatue = false
                        this.addForm.isShowLimitTypeNums = false
                        this.addForm.siteData = []
                        this.integral.channel = []
                        this.addForm.giftCode = ''
                        this.integral.realStock = []
                        this.integral.channelRealStockArr = []
                        this.companyNameLock = false
                    }
                }
            },
            'addForm.status': {
                handler(curVal, oldVal) {
                }
            }   
        },
    }   
</script>

<style lang="scss" scoped>
    .giftTitle {
        margin-left: 50px;
        font-weight: bold;
        font-size: 18px;
        position: relative;
        span {
            display: inline-block;
            width: 4px;
            height: 20px;
            background-color: #666;
            position: absolute;
            top: 2px;
            left: -10px;
        }
    }
    .reader {
        cursor: pointer;
    }
</style>
