<template>
    <div class="app-container" id="giftContent">
        <div class="filter-container" v-loading="addLoadFlag">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="24">
                    <div class="message">礼品ID信息</div>
                    <span class="borderBottm"></span>
                    <el-form
                        :model="addForm"
                        ref="addForm"
                        label-width="120px"
                        size="small"
                        :rules="rules"
                    >
                        <el-form-item label="请选择礼品ID：" size="small" class="text-left" prop="state4">
                            <el-autocomplete
                                :fetch-suggestions="querySearchAsync"
                                v-model="addForm.state4"
                                placeholder="请输入内容"
                                @select="handleSelect"
                                @keyup.enter.native="_getTimeoutGetUserGiftCode"
                            ></el-autocomplete>
                            <span v-if="noGiftIdFlag" style="color:red;">此礼品id已无站点新增</span>
                            <!-- @keyup.native="timeoutGetUserGiftCode" -->
                            <!-- @keyup.enter.native="_getTimeoutGetUserGiftCode" 回车方法-->
                        </el-form-item>
                        <el-form-item
                            label="礼品站点："
                            class="text-left"
                            prop="siteName"
                            v-if="addForm.siteData.length>0"
                        >
                            <!-- <el-select
                                v-model="addForm.siteName"
                                class="w180"
                                @change="siteNameChange"
                                :disabled="disabledSite"
                            >
                                <el-option
                                    v-for="(item, index) in addForm.siteData"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>-->
                            <el-radio-group
                                v-model="addForm.siteName"
                                @change="siteNameChange"
                                :disabled="addForm.disabledStatue"
                            >
                                <el-radio
                                    v-for="item in addForm.siteData"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value"
                                >{{item.name}}</el-radio>
                            </el-radio-group>
                            <span
                                class="errorColor text-left"
                                style="display: inline-block;"
                                v-if="companyNameLock"
                            >（该礼品暂无站点）</span>
                        </el-form-item>
                    </el-form>

                    <!-- 重构 通用信息 -->
                    <div class="giftBasics" v-if="addForm.siteName">
                        <div class="message">礼品基础信息</div>
                        <span class="borderBottm"></span>
                        <el-form ref label-width="100px" class="datailForm" size="small">
                            <el-form-item label="商品名称：">{{commonData.productName}}</el-form-item>
                            <el-form-item label="生产厂家：">{{commonData.ean}}</el-form-item>
                            <el-form-item label="小类：">{{commonData.superCategories}}</el-form-item>
                            <el-form-item label="经营范围：">{{commonData.saleScope}}</el-form-item>
                            <el-form-item label="库存：">
                                {{commonData.realStock}}
                                <span
                                    class="routerLink mianColor"
                                    v-if="commonData.realStock"
                                    @click="_getStocks"
                                    style="margin-left:10px;"
                                >刷新库存</span>
                            </el-form-item>
                            <el-form-item
                                label="电商线上标识："
                                :class="commonData.realOnlineFlag=='0'?'errorColor':''"
                            >{{commonData.realOnlineFlagName}}</el-form-item>
                        </el-form>
                    </div>

                    <!-- 礼品积分信息 -->
                    <div
                        class="giftInfo"
                        v-if="commonData.realStock&&commonData.realOnlineFlag!='0'&&addForm.state4.length>0"
                    >
                        <div class="message" style="margin-top:20px;">礼品积分信息</div>
                        <span class="borderBottm"></span>
                        <el-form
                            :model="addGiftForm"
                            ref="addGiftForm"
                            label-width="150px"
                            size="small"
                            :rules="addGiftFormRules"
                        >
                            <el-form-item label="积分商城礼品描述：" class="text-left">
                                <el-input
                                    v-model="addGiftForm.remark"
                                    placeholder="请填写积分商城礼品描述"
                                    class="w400 pull-left"
                                    maxlength="60"
                                ></el-input>
                                <span class="defaultColor">（此描述为客户端展示的礼品标题）</span>
                            </el-form-item>
                            <el-form-item label="所需积分：" class="text-left" prop="point">
                                <el-input
                                    v-model="addGiftForm.point"
                                    @keyup.native="formatPoint(addGiftForm.point)"
                                    placeholder="请填写所需积分"
                                    class="w150 pull-left"
                                ></el-input>
                                <span class="defaultColor" style="margin-left:6px;">积分/盒</span>
                            </el-form-item>
                            <el-form-item label="上架状态：" class="text-left" prop="status">
                                <!-- :disabled="addGiftForm.disabledStatue" -->
                                <el-radio-group v-model="addGiftForm.status">
                                    <el-radio
                                        v-for="item in addGiftForm.statusData"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value"
                                    >{{item.name}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="礼品缩略图：" class="text-left" prop="imageSmall">
                                <el-checkbox-group v-model="addGiftForm.imageSmall"></el-checkbox-group>
                                <el-upload
                                    class="upload-demo"
                                    :action="GiftAction"
                                    :on-preview="handlePreview"
                                    :on-remove="handleSmallRemove"
                                    :on-success="handleSuccessPreviary"
                                    list-type="picture"
                                    :limit="limitNum"
                                    :file-list="addForm.fileLists1"
                                    :on-exceed="handleExceed"
                                >
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <span class="defaultColor">(列表页图,至少上传一张,最多上传一张)</span>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="礼品大图：" class="text-left" prop="image">
                                <el-checkbox-group v-model="addGiftForm.image"></el-checkbox-group>
                                <el-upload
                                    class="upload-demo"
                                    :action="GiftAction"
                                    :on-preview="handlePreview"
                                    :on-remove="handleGiftRemove"
                                    :on-success="handleSuccessGift"
                                    :limit="limitNum"
                                    :file-list="addForm.fileLists2"
                                    :on-exceed="handleGiftExceed"
                                    list-type="picture"
                                >
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <span class="defaultColor">(详情页图,至少上传一张,最多上传一张)</span>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                        <div class="todoWarpBottom">
                            <el-button
                                type="primary"
                                size="small"
                                @click="_addIntegralGift('addGiftForm')"
                            >确认新增</el-button>
                            <el-button type="info" size="small" @click="handleReset">取消</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import dialog from 'base/Dialog'
import { dateTimeToStamp, deleteBlankSpace, positiveInteger, formatDateTimes, routerLinkPage } from 'common/js/dom'
import { getDictsData, addIntegralGift, getGiftId, getGiftMessage, getGiftCode, getGiftType, getGiftCategoryList, getApplyProductTypesView, getApplyUserTypesView, getGiftSite, getBaseGiftInfo, getStocks, GiftAction } from 'api/interface';
export default {
    components: {
        'dialogModel': dialog,
    },
    name: "IntegralGiftAdd",
    data() {
        return {
            // 新逻辑
            commonData: {},
            noGiftIdFlag: false,    //礼品id无站点提示
            addGiftForm: {
                status: '1',
                statusData: [],
                imageSmall: '',
                image: '',
            },
            addGiftFormRules: {
                remark: [{
                    required: true,
                    message: '请输入积分商城礼品描述',
                    trigger: 'blur'
                }],
                point: [{
                    required: true,
                    message: '请输入所需积分',
                    trigger: 'blur'
                }],
                status: [{
                    required: true,
                    message: '请选择分类',
                    trigger: 'change'
                }],
                imageSmall: [{
                    required: true,
                    message: '请添加礼品缩略图',
                    trigger: 'change'
                }],
                image: [{
                    required: true,
                    message: '请添加礼品图片',
                    trigger: 'change'
                }],

            },
            addLoadFlag: false,
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
            },
            restaurants: [],    //input远程关键字
            GiftAction: GiftAction(),   //上传礼品当前action
            limitNum: 1,    //缩略图最多一张
            addForm: {
                fileLists1: [],    //上传缩略图片
                fileLists2: [],    //上传礼品图片
                state4: '',
                siteData: [],
                siteName: ''
            },

            disabledSite: false,    //站点禁用状态
            companyNameLock: false, //暂无站点标识
            timeout: null,
        }
    },
    created() {
        this._getDictsData()
    },
    methods: {
        // 加载数据字典
        _getDictsData: function () {
            //站点
            let siteData = {
                isAll: false,
                code: 'CompanyCode'
            }
            getDictsData(siteData).then(res => {
                if (res.status == 200) {
                    this.channelSiteData = res.data
                }
            })
            // 礼品状态
            let statusData = {
                isAll: false,
                code: 'PointProductStatus'
            }
            getDictsData(statusData).then(res => {
                if (res.status == 200) {
                    this.addGiftForm.statusData = res.data
                }
            })
        },
        //删除缩略图片
        handleSmallRemove(file, fileList) {
            this.addGiftForm.imageSmall = ''
        },
        //删除礼品图片
        handleGiftRemove(file, fileList) {
            this.addGiftForm.image = ''
        },
        //点击图片上传
        handlePreview(file) {
        },
        //缩略图片上传成功
        handleSuccessPreviary: function (response, file, fileList) {
            this.addGiftForm.imageSmall = response.data
        },
        //礼品图片上传成功
        handleSuccessGift: function (response, file, fileList) {
            this.addGiftForm.image = response.data
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
                message: '礼品图片最多只能上传一张'
            })
        },
        //点击新增
        _addIntegralGift: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('通过')
                    let params = this.addGiftForm
                    if (!params.remark) {
                        params.remark = this.commonData.productName
                    }
                    params.productCode = this.addForm.state4
                    params.realStock = this.commonData.realStock
                    params.onlineFlag = this.commonData.realOnlineFlag

                    delete params.statusData
                    console.log(params)
                    this.addLoadFlag = true
                    addIntegralGift(params).then(res => {
                        this.addLoadFlag = false
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            let query = {
                                id: res.data.id
                            }
                            this.resetFn()
                            routerLinkPage(this, 'IntegralGiftDetail', query)
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请完善信息'
                    })
                    return false;
                }
            })
        },
        //加载站点
        _getGiftSite: function () {
            let params = {}
            params.productCode = this.addForm.state4
            this.addForm.siteData = []
            this.noGiftIdFlag = false
            this.addLoadFlag = true
            getGiftSite(params).then(res => {
                this.addLoadFlag = false
                this.companyNameLock = false
                if (res.data) {
                    if (res.data.indexOf(",") > -1) {
                        const siteArr = res.data.split(",")
                        console.log(siteArr)
                        siteArr.forEach((item, index) => {
                            try {
                                for (var key in this.channelSiteData) {
                                    if (this.channelSiteData[key].value == item) {
                                        this.addForm.siteData.push(this.channelSiteData[key])
                                    }
                                }
                                console.log(this.addForm.siteData)
                            } catch (err) {

                            }
                        })
                    } else {
                        this.channelSiteData.forEach((item, index) => {
                            if (item.value == res.data) {
                                this.addForm.siteData.push(item)
                            }
                        })
                    }
                } else {
                    this.noGiftIdFlag = true
                }
            })

        },
        //重置
        handleReset: function () {
            this.resetFn()
            this.$message('已取消新增礼品')
            routerLinkPage(this, 'IntegralGift', {})

        },
        resetFn: function () {
            this.addForm.state4 = ''
            this.addGiftForm.remark = ''
            this.addGiftForm.status = '1'
            this.addForm.fileLists1 = []
            this.addForm.fileLists2 = []
        },
        //获取远程礼品id数据
        querySearchAsync(queryString, cb) {
            if (queryString) {
                var params = {
                    giftCode: queryString,
                }
                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    getGiftId(params).then(res => {
                        if (res.status == 200) {
                            res.data.forEach(function (el, index) {
                                el.value = el.value
                            })
                        }
                        this.restaurants = res.data
                        cb(this.restaurants)
                    })
                }, 1500 * Math.random())
            } else {
                this.restaurants = []
                cb(this.restaurants)
            }
        },
        //获取当前input远程关键字
        handleSelect(item) {
            this.addGiftForm.companyCode = ''
            this.addForm.siteData = []
            this.addForm.state4 = item.value
            if (this.addForm.state4 > 20) {
                this._getGiftSite()
            }
            // this._getGiftSite()
        },
        //新增当前站点
        siteNameChange: function (val) {
            this.addGiftForm.companyCode = val
            if (val && this.addForm.state4) {
                let params = {
                    productCode: this.addForm.state4,
                    companyCode: val
                }
                getBaseGiftInfo(params).then(res => {
                    console.log(res)
                    if (res.status == 200) {
                        //新字段    线上标识  realOnlineFlag    库存 realStock 
                        if (res.data.onlineFlag == '1') {
                            res.data.product.realOnlineFlagName = '线上可销售'
                        } else if (res.data.onlineFlag == '2') {
                            res.data.product.realOnlineFlagName = '线上可销售'
                        } else if (res.data.onlineFlag == '0') {
                            res.data.product.realOnlineFlagName = '禁止线上销售'
                        }
                        res.data.product.realOnlineFlag = res.data.onlineFlag
                        res.data.product.realStock = res.data.realStock
                        this.commonData = res.data.product
                    }
                })
            }
        },
        //当礼品输完且有值自己去获取
        timeoutGetUserGiftCode: function () {
            if (this.addForm.state4) {
                setTimeout(() => {
                    this._getGiftSite()
                }, 1000);
            }
        },
        //当礼品id有值时候回车去请求
        _getTimeoutGetUserGiftCode: function () {
            if (this.addForm.state4) {
                this._getGiftSite()
            }
        },

        //刷新库存
        _getStocks: function () {
            let params = {
                productCode: this.addForm.state4,
                companyCode: this.addForm.siteName
            }
            console.log(params)
            getStocks(params).then(res => {
                if (res.status == 200) {
                    this.$message('刷新库存成功')
                    this.commonData.realStock = res.data.realStock
                }
            })
        },
        // 所需积分取正整数
        formatPoint: function (val) {
            this.addGiftForm.point = positiveInteger(val)
        },
    },
    mounted() {

    },
    watch: {
        'addForm.state4': {     //监听state4为空的时候给this.addForm.giftCode = ''
            handler(curVal, oldVal) {
                if (curVal.length < 6) {
                    this.addForm.siteName = ''
                    this.addForm.status = '0'
                    this.addForm.siteData = []
                    this.commonData = {}
                }
            }
        },
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
.message {
    width: 96px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #909399;
}
.borderBottm {
    display: block;
    height: 1px;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
}
</style>
<style>
#giftContent .upload-demo .el-upload-list {
    width: 300px !important;
}
</style>
