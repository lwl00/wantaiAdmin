    <template>
    <div class="app-container">
        <div class="filter-container" v-loading="loading">
            <!-- 礼品基础信息 -->
            <div class="giftCommonInfo">
                <div class="message">礼品配置信息</div>
                <span class="borderBottm"></span>
                <el-form
                    label-width="120px"
                    class="datailForm"
                    size="small"
                    style="margin-top: 20px;"
                >
                    <el-form-item
                        label="商品编号："
                        size="small"
                        class="text-left"
                    >{{giftDetailData.productCode}}</el-form-item>
                    <el-form-item label="站点：" class="text-left">
                        <div
                            class="text-left"
                            style="display: inline-block;"
                        >{{giftDetailData.companyName}}</div>
                    </el-form-item>
                    <el-form-item label="商品名称：" class="text-left">{{giftDetailData.productName}}</el-form-item>
                    <el-form-item label="规格：" class="text-left">{{giftDetailData.specifications}}</el-form-item>
                    <el-form-item label="生产厂家：" class="text-left">{{giftDetailData.ean}}</el-form-item>
                    <el-form-item
                        label="小类："
                        class="text-left"
                        prop="realStock"
                    >{{giftDetailData.superCategories}}</el-form-item>
                    <el-form-item label="经营范围：" class="text-left">{{giftDetailData.saleScope}}</el-form-item>
                    <el-form-item label="库存：" class="text-left" prop="price">
                        {{giftDetailData.realStock}}
                        <span
                            class="routerLink mianColor"
                            v-if="giftDetailData.realStock"
                            @click="_getStocks"
                            style="margin-left:10px;"
                        >刷新库存</span>
                    </el-form-item>
                    <el-form-item
                        label="电商线上标识："
                        class="text-left"
                        :class="giftDetailData.onlineFlag=='0'?'errorColor':''"
                    >{{giftDetailData.onlineFlagName}}</el-form-item>
                </el-form>
            </div>
            <!-- 礼品配置信息 -->
            <div class="giftInfo">
                <div class="message">礼品配置信息</div>
                <span class="borderBottm"></span>
                <el-form
                    :model="giftDetailData"
                    ref="giftDetailData"
                    label-width="130px"
                    size="small"
                    style="margin-top: 20px;"
                    :rules="giftDetailDataRules"
                >
                    <el-form-item label="商城礼品描述：" prop="remark">
                        <el-input
                            v-model="giftDetailData.remark"
                            placeholder="请填写积分商城礼品描述"
                            class="w400 pull-left"
                            maxlength="60"
                        ></el-input>
                        <span class="defaultColor">（此描述为客户端展示的礼品标题）</span>
                    </el-form-item>
                    <el-form-item label="所需积分：" prop="point">
                        <el-input
                            v-model="giftDetailData.point"
                            @keyup.native="formatPoint(giftDetailData.point)"
                            placeholder="请填写所需积分"
                            class="w150 pull-left"
                        ></el-input>
                        <span class="defaultColor" style="margin-left:6px;">
                            积分
                            <i
                                v-if="giftDetailData.minUnit"
                                style="font-style:normal;"
                            >/&nbsp;{{giftDetailData.minUnit}}</i>
                        </span>
                    </el-form-item>
                    <el-form-item label="商家状态：" prop="status">
                        <el-radio-group v-model="giftDetailData.status">
                            <el-radio
                                v-for="item in statusData"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value"
                                :disabled="item.disabled"
                            >{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="礼品缩略图：" prop="imageSmall">
                        <el-checkbox-group v-model="giftDetailData.imageSmall"></el-checkbox-group>
                        <el-upload
                            class="upload-demo"
                            :action="GiftAction"
                            :on-preview="handlePreview"
                            :on-remove="handleSmallRemove"
                            :file-list="giftDetailData.fileList1"
                            :on-success="handleSuccessPreviary"
                            list-type="picture"
                            :limit="limitNum"
                            :on-exceed="handleExceed"
                            width="200px"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <span class="defaultColor">(列表页,至少上传一张,最多上传一张)</span>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="礼品大图：" prop="image">
                        <el-checkbox-group v-model="giftDetailData.image"></el-checkbox-group>
                        <el-upload
                            class="upload-demo"
                            :action="GiftAction"
                            :on-preview="handlePreview"
                            :on-remove="handleGiftRemove"
                            :file-list="giftDetailData.fileList2"
                            :on-success="handleSuccessGift"
                            :limit="limitNum"
                            :on-exceed="handleGiftExceed"
                            list-type="picture"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <span class="defaultColor">(详情页,至少上传一张,最多上传一张)</span>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div class="todoWarpBottom">
                <el-button
                    type="primary"
                    size="small"
                    @click="_editIntegralGift('giftDetailData')"
                    :loading="saveLoading"
                >保存</el-button>
                <el-button type="info" size="small" @click="handleReset('giftDetailData')">重置</el-button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Dialog from 'base/Dialog';

import { dateTimeToStamp, deleteBlankSpace, positiveInteger, formatDateTimes } from 'common/js/dom'
import { getDictsData, getIntegralGift, getGiftCode, editIntegralGift, getGiftMessage, getGiftType, getGiftCategoryList, getApplyProductTypesView, getApplyUserTypesView, getStocks } from 'api/interface';
import { GiftAction } from 'api/interface';
export default {
    components: {
        'dialogModel': Dialog,
    },
    name: "IntegralGiftEdit",
    data() {
        return {
            giftDetailData: {}, //编辑礼品所有数据信息
            siteData: [],       //站点信息
            onlineData: [],     //线上标识信息
            statusData: [],     //上架状态信息

            giftDetailDataRules: {      //验证编辑规则
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
            loading: false,     //保存loading
            saveLoading: false,  // 编辑保存

            GiftAction: GiftAction(),   //上传礼品当前action
            limitNum: 1,    //缩略图最多一张
            fileList1: []
        }
    },
    created() {
        this._getDictsData()
        this._getGiftCode(this.$route.query.id)
    },
    methods: {
        // 查询数据字典
        _getDictsData: function () {
            //站点
            let siteData = {
                isAll: false,
                code: 'CompanyCode'
            }
            getDictsData(siteData).then(res => {
                if (res.status == 200) {
                    this.siteData = res.data
                }
            })
            //线上标识
            let onFlagData = {
                isAll: false,
                code: 'OnlineFlag'
            }
            getDictsData(onFlagData).then(res => {
                if (res.status == 200) {
                    this.onlineData = res.data
                }
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
                    if (res.data.pointProduct.status == '1') {
                        res.data.pointProduct.statusName = '已上架'
                    } else {
                        res.data.pointProduct.statusName = '已下架'
                    }
                    this.siteData.forEach(item => {
                        if (item.value == res.data.pointProduct.companyCode) {
                            res.data.pointProduct.companyName = item.name
                        }
                    })
                    this.onlineData.forEach(item => {
                        if (item.value == res.data.pointProduct.onlineFlag) {
                            res.data.pointProduct.onlineFlagName = item.name
                        }
                    })
                    res.data.pointProduct.specifications = res.data.product.specifications
                    res.data.pointProduct.saleScope = res.data.product.saleScope
                    res.data.pointProduct.superCategories = res.data.product.superCategories
                    res.data.pointProduct.minUnit = res.data.product.minUnit
                    res.data.pointProduct.fileList1 = [{ url: res.data.pointProduct.imageSmall }]
                    res.data.pointProduct.fileList2 = [{ url: res.data.pointProduct.image }]
                    this.giftDetailData = res.data.pointProduct
                    this.getSite()
                }
            })


        },
        //站点独立请求 并控制商家状态
        getSite: function () {
            // 礼品状态
            let statusData = {
                isAll: false,
                code: 'PointProductStatus'
            }
            getDictsData(statusData).then(res => {
                if (res.status == 200) {
                    res.data.forEach(item => {
                        if (this.giftDetailData.onlineFlag == '0' && item.name == '已上架') {
                            item.disabled = true
                        } else {
                            item.disabled = false
                        }
                    })
                    this.statusData = res.data
                }
            })
        },
        //刷新库存
        _getStocks: function () {
            let params = {
                productCode: this.giftDetailData.productCode,
                companyCode: this.giftDetailData.companyCode
            }
            getStocks(params).then(res => {
                if (res.status == 200) {
                    this.$message('刷新库存成功')
                    this.giftDetailData.realStock = res.data.realStock
                }
            })
        },
        // 所需积分取正整数
        formatPoint: function (val) {
            this.giftDetailData.point = positiveInteger(val)
        },
        // 返回上一层             
        back() {
            this.$router.push('/IntegralGift');
        },
        //删除缩略图片
        handleSmallRemove(file, fileList) {
            this.giftDetailData.imageSmall = ''
        },
        //删除礼品图片
        handleGiftRemove(file, fileList) {
            this.giftDetailData.image = ''
        },
        //点击图片上传
        handlePreview(file) {

        },
        //缩略图片上传成功
        handleSuccessPreviary: function (response, file, fileList) {
            this.giftDetailData.imageSmall = response.data
        },
        //礼品图片上传成功
        handleSuccessGift: function (response, file, fileList) {
            this.giftDetailData.image = response.data
        },
        //保存编辑
        _editIntegralGift: function (formName) {
            this.saveLoading = true
            this.loading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = this.giftDetailData
                    console.log('通过')
                    editIntegralGift(params).then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            })
                            // this.$router.push('/integralGift/IntegralGift')
                        } else if (res.status == 500) {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                        this.saveLoading = false
                        this.loading = false
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
            // this.editForm.fileList2 = []
            this._getGiftCode(this.$route.query.id)
            this.$message('重置成功')
        },
        //转换时间
        formatterDate: function (row, column) {      //转换时间值
            return formatDateTimes(row)
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
.giftInfo {
    margin-top: 20px;
}
</style>
<style>
.upload-demo .el-upload-list {
    width: 300px !important;
}
</style>
