<template>
    <div class="app-container">
        <div class="filter-container" v-loading="loading">
            <el-form
                :model="addRulesForm"
                ref="addRulesForm"
                :rules="rules"
                label-width="170px"
                class="addRulesForm"
                size="small"
            >
                <el-form-item label="规则说明：" prop="ruleDesc">
                    <el-input v-model="addRulesForm.ruleDesc" placeholder="请填写规则说明" class="w400"></el-input>
                    <span>（限60个字符）</span>
                </el-form-item>

                <el-form-item label="规则类型：" prop="ruleTypeValue">
                    <el-select v-model="addRulesForm.ruleTypeValue" class="w150">
                        <el-option
                            v-for="(item, index) in addRulesForm.ruleTypeData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所属站点：" prop="siteValue">
                    <el-radio-group v-model="addRulesForm.siteValue">
                        <el-radio
                            v-for="item in addRulesForm.siteData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                        >{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="规则性质：">{{addRulesForm.ruleNatureName}}</el-form-item>

                <el-form-item label="temp">
                    <span slot="label" class="labelSlot">单次获取/消耗积分：</span>
                    <el-radio-group v-model="addRulesForm.setPiontsValue">
                        <el-radio
                            v-for="item in addRulesForm.setPiontsData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                            :disabled="item.disabled"
                        >{{item.name}}</el-radio>
                    </el-radio-group>
                    <span v-if="addRulesForm.fixed">
                        <el-form-item prop="fixedPoint" class="inputInline">
                            <el-input
                                v-model="addRulesForm.fixedPoint"
                                @keyup.native="formatFixedPoint(addRulesForm.fixedPoint)"
                                class="w100"
                            ></el-input>分
                        </el-form-item>
                        <el-form-item
                            class="inputInline"
                            v-if="addRulesForm.isShowFixedMoney"
                        >/ {{addRulesForm.fixedMoney}} 元</el-form-item>
                    </span>
                </el-form-item>

                <el-form-item label="temp" v-if="addRulesForm.isShowUploadApplyProductType">
                    <span slot="label" class="labelSlot">下单返积分商品：</span>
                    <el-radio-group v-model="addRulesForm.applyProductTypeValue">
                        <el-radio
                            v-for="item in addRulesForm.applyProductTypeData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                        >{{item.name}}</el-radio>
                    </el-radio-group>
                    <div class v-if="addRulesForm.isShowUpload">
                        <el-form-item
                            prop="applyProductCodes"
                            class="inputInline"
                            style="margin-bottom: 15px;"
                        >
                            <el-input
                                type="textarea"
                                rows="4"
                                v-model="addRulesForm.applyProductCodes"
                                placeholder="商品ID,用(英文),隔开（如： 102401,102402,102401）"
                                class="w400"
                                :disabled="true"
                            ></el-input>
                            <span style="color: #999">请勿与同站点其他相同时间段、已启用的规则的商品重复</span>
                        </el-form-item>
                        <el-form-item class="inputInline" style="display: block;">
                            <el-upload
                                name="file"
                                class="upload-demo"
                                :action="addRulesAPPOINTAction"
                                :before-upload="beforeAvatarUpload"
                                :on-remove="handleRemove"
                                :file-list="addRulesForm.fileList1"
                                :on-success="handleSuccessPreviary"
                                :on-error="handleErrorPreviary"
                                :on-change="handleChange"
                                width="200px"
                                :multiple="false"
                            >
                                <el-button size="small" type="primary">点击上传</el-button>
                                <span slot="tip" class="el-upload__tip">
                                    <span>已上传 {{uploadCodesLength}} 种商品</span>
                                    <span
                                        class="mianColor applyProductView"
                                        @click="_applyProductView"
                                    >查看商品</span>
                                </span>
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-form-item>

                <el-form-item label="周期范围：" prop="cycleValue" v-if="addRulesForm.isShowCycle">
                    <el-radio-group v-model="addRulesForm.cycleValue">
                        <el-radio
                            v-for="item in addRulesForm.cycleData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                        >{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="temp" v-if="addRulesForm.isShowLimitType">
                    <span slot="label" class="labelSlot">周期内获取/消耗上限：</span>
                    <el-radio-group v-model="addRulesForm.limitTypeValue">
                        <el-radio
                            v-for="item in addRulesForm.limitTypeData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                        >
                            {{item.name}}
                            <el-form-item
                                prop="limitTypeNums"
                                class="inputInline"
                                v-if="addRulesForm.isShowLimitTypeNums && item.value == 'FIXEDTIME'"
                            >
                                <el-input
                                    v-model="addRulesForm.limitTypeNums"
                                    class="w100"
                                    @keyup.native="formatLimitTypeNums(addRulesForm.limitTypeNums)"
                                ></el-input>次
                            </el-form-item>
                            <el-form-item
                                prop="limitTypePoints"
                                class="inputInline"
                                v-if="addRulesForm.isShowLimitTypePoints && item.value == 'FIXEDPOINT'"
                            >
                                <el-input
                                    v-model="addRulesForm.limitTypePoints"
                                    class="w100"
                                    @keyup.native="formatLimitTypePoints(addRulesForm.limitTypePoints)"
                                ></el-input>积分
                            </el-form-item>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="规则状态：" prop="enableValue">
                    <el-radio-group v-model="addRulesForm.enableValue">
                        <el-radio
                            v-for="item in addRulesForm.enableData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                        >{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="规则生效时间：" prop="enableDate">
                    <!-- <span slot="label" class="labelSlot">规则生效时间：</span>   -->
                    <el-date-picker
                        v-model="addRulesForm.enableDate"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        @click="_addPointRule('addRulesForm')"
                        :loading="saveLoading"
                    >确认</el-button>
                    <el-button type="info" @click="resetForm('addRulesForm')">重置</el-button>
                    <!-- <el-button @click="back">取消</el-button> -->
                </el-form-item>
            </el-form>
        </div>

        <!-- 添加后，出现重复code商品 -->
        <dialogModel
            class="repeatCodesDialog-model successDialog"
            ref="repeatCodesDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    以下返积分商品与已有规则【编号{{dialog.rulesID}}】重复，请删除新规则或原规则的重复商品
                    <p class="errorColor">{{dialog.repeatCodes}}</p>
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('repeatCodesDialog-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 查看，出现重复code商品 -->
        <dialogModel
            class="applyProductView-model successDialog"
            ref="applyProductView-model"
            :title="dialog.dialogViewTitle"
            :width="dialog.dialogViewWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    已上传
                    <b class="errorColor">{{dialog.viewProductSize}}</b> 种商品
                </div>
                <div class="cmyyTable">
                    <el-table
                        :data="dialog.viewTableData"
                        stripe
                        highlight-current-row
                        height="350"
                        v-loading="dialog.viewTableLoading"
                    >
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column property label="商品ID" align="center">
                            <template slot-scope="scope">
                                <!-- :class="scope.row.productName ? '' : 'errorColor' -->
                                <span
                                    :class="scope.row.productName ? '' : '' "
                                >{{scope.row.productCode}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                            property=""
                            label="商品名称"
                            align="center">
                            <template slot-scope="scope">
                                <span :class="scope.row.productName ? '' : 'errorColor' ">
                                    {{scope.row.productName ? scope.row.productName : '暂无该商品信息'}}
                                </span>
                            </template>                            
                        </el-table-column>
                        <el-table-column
                            property="specifications"
                            label="规格"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            property="placeOfOrigin"
                            label="厂家"
                            align="center">
                        </el-table-column>-->
                        <el-table-column property label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="danger"
                                    size="mini"
                                    @click="delViewCode(scope.row)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('applyProductView-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 保存时验证指定商品编号是否正确 -->
        <dialogModel
            class="check-model successDialog"
            ref="check-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    <b class="errorColor">{{dialog.productNotListData}}</b> 商品不合法，请点击【查看商品】并删除不存在的商品后，再确认保存
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('check-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 添加后，站点存在完善资料送积分/积分兑换礼品 -->
        <dialogModel
            class="repeatRuleTypeDialog-model successDialog"
            ref="repeatRuleTypeDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div
                    class="successNoteWarp"
                >该站点已存在相同类型的规则，不可继续添加，请直接修改已有规则【编号{{dialog.rulesID}}】 （{{dialog.rulesID}}是已有规则编号）</div>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="mini"
                    @click="routerLinkPage('/integralRules/IntegralRulesEdit?id='+dialog.rulesID+'')"
                >去修改</el-button>
                <el-button size="small" @click="dialogHide('repeatRuleTypeDialog-model')">知道了</el-button>
            </div>
        </dialogModel>
    </div>
</template>

<script type="text/ecmascript-6">
import Dialog from 'base/Dialog';
import { today, dateTimeToStamp, deleteBlankSpace, positiveInteger, onlineDateTime, todayEndTime } from 'common/js/dom'
import { getDictsData, addPointRule, addRulesAPPOINTAction, applyProductView } from 'api/interface';

export default {
    components: {
        'dialogModel': Dialog,
    },
    name: "IntegralRulesAdd",
    data() {
        return {
            loading: true,
            saveLoading: false,
            addRulesAPPOINTAction: addRulesAPPOINTAction(), // 下单返积分商品-指定商品上传excel action
            addRulesForm: {
                ruleDesc: '测试规则说明',

                ruleTypeData: [],
                ruleTypeName: '',
                ruleTypeValue: 'ORDER',

                siteData: [],
                siteValue: '1000',

                ruleNatureData: [
                    { name: '赠送', value: 'GET' },
                    { name: '消耗', value: 'USE' },
                ],
                ruleNatureName: '',
                ruleNatureValue: '',

                setPiontsData: [
                    { name: '非固定值', value: '1', disabled: true },
                    { name: '固定值', value: '2', disabled: false },
                ],
                setPiontsValue: '2',

                fixed: true,
                fixedPoint: 1,
                fixedMoney: 100,
                isShowFixedMoney: true,

                applyProductTypeData: [],
                applyProductTypeValue: 'ALL',
                applyProductCodes: '',
                fileList1: [],
                isShowUploadApplyProductType: false,
                isShowUpload: false,

                cycleData: [],
                cycleValue: 'DAY',
                isShowCycle: false,

                isShowLimitType: false,
                limitTypeData: [],
                limitTypeValue: 'UNLIMITED',
                limitTypeNums: 5,
                isShowLimitTypeNums: false,
                limitTypePoints: 20,
                isShowLimitTypePoints: false,

                enableData: [],
                enableValue: '1',
                isEnable: true,

                enableDate: [onlineDateTime(), todayEndTime()],
            },
            rules: {
                ruleDesc: [
                    { required: true, message: '请输入规则说明', trigger: 'blur' },
                    { min: 1, max: 60, message: '限60个字符', trigger: 'blur' }
                ],
                ruleTypeName: [
                    { required: true, message: '请选择规则类型', trigger: 'change' }
                ],
                siteValue: [
                    { required: true, message: '请选择所属站点', trigger: 'change' }
                ],
                setPiontsValue: [
                    { required: true, message: '请选择单次获取/消耗积分', trigger: 'change' }
                ],
                fixedPoint: [
                    { required: true, message: '请输入积分值', trigger: 'blur' },
                ],
                applyProductTypeValue: [
                    { required: true, message: '请选择下单返积分商品', trigger: 'change' }
                ],
                applyProductCodes: [
                    { required: true, message: '请上传商品ID', trigger: 'blur' },
                ],
                cycleValue: [
                    { required: true, message: '请选择周期范围', trigger: 'change' }
                ],
                limitTypeValue: [
                    { required: true, message: '请选择周期内获取/消耗上限', trigger: 'change' }
                ],
                limitTypeNums: [
                    { required: true, message: '请输入次数', trigger: 'blur' },
                    // { type: 'number', message: '必须为数字值'}
                ],
                limitTypePoints: [
                    { required: true, message: '请输入积分', trigger: 'blur' },
                    // { type: 'number', message: '必须为数字值'}
                ],
                enableValue: [
                    { required: true, message: '请选择规则状态', trigger: 'change' }
                ],
                enableDate: [
                    { required: true, message: '请选择指定日期', trigger: 'change' },
                ],
            },
            isExcel: false,
            uploadCodesLength: 0,
            dialog: {
                dialogTitle: '提示',
                dialogWidth: '400px',
                rulesID: '',
                repeatCodes: '',

                dialogViewTitle: '提示',
                dialogViewWidth: '800px',
                viewTableData: [],
                viewTableLoading: false,
                viewProductSize: 0,

                productNotListData: '',  // 保存时验证指定商品，错误商品编号字符串集合
            }
        }
    },
    created() {
        this._getDictsData()
    },
    mounted() {

    },
    methods: {
        // 查询数据字典
        _getDictsData: function () {
            // 规则类型
            var paramsRuleType = {
                code: 'RuleType'
            }
            getDictsData(paramsRuleType).then(res => {
                res.data.forEach(function (item, index) {
                    if (item.value == 'SYSTEM') {
                        res.data.splice(index, 1);
                    }
                })
                res.data.forEach(function (item, index) {
                    if (item.value == 'EXPIRE') {
                        res.data.splice(index, 1);
                    }
                })
                this.addRulesForm.ruleTypeData = res.data
            })

            // 站点
            var paramsSite = {
                isAll: false,
                code: 'CompanyCode'
            }
            getDictsData(paramsSite).then(res => {
                this.addRulesForm.siteData = res.data
            })
            // 规则性质
            var paramsRuleNature = {
                code: 'RuleNature'
            }
            getDictsData(paramsRuleNature).then(res => {
                this.addRulesForm.ruleNatureData = res.data
            })

            // 下单返积分商品
            var paramsApplyProductType = {
                code: 'ApplyProductType'
            }
            getDictsData(paramsApplyProductType).then(res => {
                this.addRulesForm.applyProductTypeData = res.data
            })

            // 周期范围
            var paramsCycle = {
                code: 'Cycle'
            }
            getDictsData(paramsCycle).then(res => {
                this.addRulesForm.cycleData = res.data
            })

            // 周期内获取/消耗上限
            var paramsLimitType = {
                isAll: false,
                code: 'LimitType'
            }
            getDictsData(paramsLimitType).then(res => {
                this.addRulesForm.limitTypeData = res.data
            })

            // 规则状态
            var paramsEnableDisable = {
                code: 'EnableDisable'
            }
            getDictsData(paramsEnableDisable).then(res => {
                this.addRulesForm.enableData = res.data
                this.loading = false
            })
        },
        // 确定新增
        _addPointRule: function (formName) {
            this.saveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.checkProduct()
                    this.save()
                } else {
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    })
                    this.saveLoading = false
                    return false;
                }
            });
        },
        // check product
        checkProduct: function () {
            if (this.addRulesForm.isShowUpload) {  // 指定商品，验证商品code是否正确
                var params = {
                    applyProductCodes: this.addRulesForm.applyProductCodes,
                    companyCode: this.addRulesForm.siteValue
                }
                applyProductView(params).then(res => {
                    if (res.status == 200) {
                        if (res.data.productNotList.length == 0) {
                            this.save()
                        } else {
                            this.$refs['check-model'].showModel();
                            this.dialog.productNotListData = '';
                            res.data.productNotList.forEach((item) => {
                                this.dialog.productNotListData = this.dialog.productNotListData + item.productCode + ','
                            })
                            this.saveLoading = false
                        }
                    }
                })
            } else {
                this.save()
            }
        },
        // 保存
        save: function () {
            var params = {
                ruleDesc: deleteBlankSpace(this.addRulesForm.ruleDesc),
                ruleType: this.addRulesForm.ruleTypeValue,
                companyCode: this.addRulesForm.siteValue,
                ruleNature: this.addRulesForm.ruleNatureValue,
                fixed: this.addRulesForm.fixed,

                enable: this.addRulesForm.isEnable,
                enableStartDate: dateTimeToStamp(this.addRulesForm.enableDate[0]),
                enableEndDate: dateTimeToStamp(this.addRulesForm.enableDate[1]),
            }

            if (this.addRulesForm.fixed && this.addRulesForm.ruleTypeValue == 'ORDER') {
                params.fixedPoint = Number(this.addRulesForm.fixedPoint)
            } else if (this.addRulesForm.fixed && this.addRulesForm.ruleTypeValue == 'INFO') {
                params.fixedPoint = Number(this.addRulesForm.fixedPoint)
            }

            if (this.addRulesForm.isShowLimitType) {
                params.limitType = this.addRulesForm.limitTypeValue
                if (this.addRulesForm.isShowLimitTypeNums) {
                    params.limitValue = Number(this.addRulesForm.limitTypeNums)
                } else if (this.addRulesForm.isShowLimitTypePoints) {
                    params.limitValue = Number(this.addRulesForm.limitTypePoints)
                } else {
                    params.limitValue = ''
                }
            }

            if (this.addRulesForm.isShowUploadApplyProductType) {
                params.applyProductType = this.addRulesForm.applyProductTypeValue
                if (this.addRulesForm.applyProductTypeValue == 'ALL') {
                    params.applyProductCodes = ''  // 全场商品时，必传
                } else {
                    params.applyProductCodes = deleteBlankSpace(this.addRulesForm.applyProductCodes)
                }
            }

            if (this.addRulesForm.isShowCycle) {
                params.cycle = this.addRulesForm.cycleValue
            }
            // console.log(params)
            addPointRule(params).then(res => {
                if (res.status == 200) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.$router.push('/integralRules/IntegralRules') // 添加成功后，没有对应规则ID，不能调转值详情
                } else if (res.status == 500) {
                    if (res.data.codes != '') { // 下单反积分，存在codes
                        this.$refs['repeatCodesDialog-model'].showModel();
                        this.dialog.repeatCodes = res.data.codes
                    } else { // 完善资料送积分/积分兑换礼品，不存在codes
                        this.$refs['repeatRuleTypeDialog-model'].showModel();
                    }
                    this.dialog.rulesID = res.data.id
                }
                this.saveLoading = false
            })
        },
        // 跳转页面(新增、查看、编辑)
        routerLinkPage: function (index) {
            this.dialogHide('repeatRuleTypeDialog-model')
            this.$router.push(index)
        },
        // 重置
        resetForm: function (formName) {
            this.$refs[formName].resetFields();
            this.$message('重置成功');
        },
        // 返回上一层
        back() {
            this.$message('已取消新增')
            this.$router.push('/integralRules/IntegralRules')
        },
        // 固定值积分取正整数
        formatFixedPoint: function (val) {
            this.addRulesForm.fixedPoint = positiveInteger(val)
        },
        // 周期内获取/消耗上限-固定次数取正整数
        formatLimitTypeNums: function (val) {
            this.addRulesForm.limitTypeNums = positiveInteger(val)
        },
        // 周期内获取/消耗上限-固定积分取正整数
        formatLimitTypePoints: function (val) {
            this.addRulesForm.limitTypePoints = positiveInteger(val)
        },
        // 上传之前
        beforeAvatarUpload: function (file) {
            if (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                this.isExcel = true
            } else {
                this.isExcel = false
            }

            if (!this.isExcel) {
                this.$message({
                    message: '上传文件只能是 xls或xlsx 格式',
                    type: 'error'
                })
            }

            return this.isExcel;
        },
        // 上传成功
        handleSuccessPreviary: function (response, file, fileList) {
            var uploadCodes = fileList[0].response.data
            if (uploadCodes != null) {
                uploadCodes = uploadCodes.split(",")
                var newCodes = ''

                // 删除重复ID
                for (var i = uploadCodes.length - 1; i >= 0; i--) {
                    var targetNode = uploadCodes[i];
                    for (var j = 0; j < i; j++) {
                        if (targetNode == uploadCodes[j]) {
                            uploadCodes.splice(i, 1);
                            break;
                        }
                    }
                }
                // 组成新的code字符串，填入文本框中
                uploadCodes.forEach((item) => {
                    newCodes = newCodes + item + ','
                })

                this.uploadCodesLength = uploadCodes.length
                this.addRulesForm.applyProductCodes = newCodes.substr(0, newCodes.length - 1);
                this.addRulesForm.fileList1 = fileList
            } else {
                this.$message({
                    message: '商品编号格式错误，请检查修正后重新上传',
                    type: 'error'
                })
            }
        },
        // 上传失败
        handleErrorPreviary: function (err, file, fileList) {
            this.$message({
                message: file.name + '上传失败',
                type: 'error'
            })
        },
        // 删除已上传文件
        handleRemove(file, fileList) {
            this.uploadCodesLength = 0
        },
        // 多次上传，只保留最后一次文件
        handleChange(file, fileList) {
            this.addRulesForm.fileList1 = fileList.slice(-1);
        },
        // 查看商品关闭弹窗（知道了按钮）
        dialogHide: function (type) {
            this.$refs[type].hideModel();
        },
        // 查看商品
        _applyProductView: function () {
            if (this.addRulesForm.applyProductCodes == '') {
                this.$message({
                    message: '请上传商品ID',
                    type: 'warning'
                })
            } else {
                var params = {
                    applyProductCodes: this.addRulesForm.applyProductCodes,
                    companyCode: this.addRulesForm.siteValue
                }
                this.$refs['applyProductView-model'].showModel();
                this.dialog.viewTableLoading = true
                applyProductView(params).then(res => {
                    this.dialog.viewTableLoading = false
                    if (res.status == 200) {
                        // 添加有效效商品
                        this.dialog.viewTableData = res.data.data

                        // 添加无效商品
                        res.data.productNotList.forEach((item) => {
                            this.dialog.viewTableData.push(item)
                        })

                        this.dialog.viewProductSize = res.data.length
                    }
                })

            }
        },
        // 删除
        delViewCode: function (row) {
            this.$confirm('确定删除该商品信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除弹出层表格数据
                this.dialog.viewTableData.forEach((item, index) => {
                    if (item.productCode == row.productCode) {
                        this.dialog.viewTableData.splice(index, 1);
                    }
                })
                this.uploadCodesLength = this.dialog.viewProductSize = this.dialog.viewTableData.length

                // 删除输入框商品编码字符串
                var newCodes = ''
                var uploadCodes = this.addRulesForm.applyProductCodes
                uploadCodes = uploadCodes.split(",")

                uploadCodes.forEach((item, index) => {
                    if (item == row.productCode) {
                        uploadCodes.splice(index, 1)
                    }
                })

                // 组成新的code字符串，填入文本框中
                uploadCodes.forEach((item) => {
                    newCodes = newCodes + item + ','
                })
                this.addRulesForm.applyProductCodes = newCodes.substr(0, newCodes.length - 1);

                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    watch: {
        addRulesForm: {  // 监听对象值的改变
            handler(curVal, oldVal) {
                this.addRulesForm.siteValue = curVal.siteValue

                // 规则类型
                if (curVal.ruleTypeValue == 'ORDER') { // 1=下单返积分  
                    this.addRulesForm.ruleNatureName = curVal.ruleNatureData[0].name
                    this.addRulesForm.ruleNatureValue = curVal.ruleNatureData[0].value
                    this.addRulesForm.setPiontsData[0].disabled = true
                    this.addRulesForm.setPiontsData[1].disabled = false
                    this.addRulesForm.setPiontsValue = '2'
                    this.addRulesForm.fixed = true
                    this.addRulesForm.isShowFixedMoney = true
                    this.addRulesForm.isShowUploadApplyProductType = true
                    this.addRulesForm.isShowLimitType = false
                    this.addRulesForm.isShowCycle = false

                    // this.addRulesForm.fixedPoint = 1
                    // this.addRulesForm.cycleValue = 'DAY'
                    // this.addRulesForm.limitTypeValue = 'UNLIMITED'
                } else if (curVal.ruleTypeValue == 'INFO') { // 2=完善信息得积分
                    this.addRulesForm.ruleNatureName = curVal.ruleNatureData[0].name
                    this.addRulesForm.ruleNatureValue = curVal.ruleNatureData[0].value
                    this.addRulesForm.setPiontsData[0].disabled = true
                    this.addRulesForm.setPiontsData[1].disabled = false
                    this.addRulesForm.setPiontsValue = '2'
                    this.addRulesForm.fixed = true
                    this.addRulesForm.isShowFixedMoney = false
                    this.addRulesForm.isShowUploadApplyProductType = false
                    this.addRulesForm.isShowLimitType = true
                    this.addRulesForm.isShowCycle = true
                    // this.addRulesForm.fixedPoint = 5
                    // this.addRulesForm.cycleValue = 'LIFT'
                    // this.addRulesForm.limitTypeValue = 'FIXEDTIME'
                    // this.addRulesForm.limitTypeNums = '1'
                } else if (curVal.ruleTypeValue == 'EXCHANGE') { // 3=积分兑换礼品
                    this.addRulesForm.ruleNatureName = curVal.ruleNatureData[1].name
                    this.addRulesForm.ruleNatureValue = curVal.ruleNatureData[1].value
                    this.addRulesForm.setPiontsData[0].disabled = false
                    this.addRulesForm.setPiontsData[1].disabled = true
                    this.addRulesForm.setPiontsValue = '1'
                    this.addRulesForm.fixed = false
                    this.addRulesForm.isShowFixedMoney = false
                    this.addRulesForm.isShowUploadApplyProductType = false
                    this.addRulesForm.isShowLimitType = true
                    this.addRulesForm.isShowCycle = true
                    // this.addRulesForm.cycleValue = 'DAY'
                    // this.addRulesForm.limitTypeValue = 'UNLIMITED'
                }

                // 下单返积分商品
                if (curVal.applyProductTypeValue == 'ALL') {
                    this.addRulesForm.isShowUpload = false
                } else {
                    this.addRulesForm.isShowUpload = true
                }

                // 周期内获取/消耗上限
                if (curVal.limitTypeValue == 'UNLIMITED') {
                    this.addRulesForm.isShowLimitTypeNums = false
                    this.addRulesForm.isShowLimitTypePoints = false
                } else if (curVal.limitTypeValue == 'FIXEDTIME') {
                    this.addRulesForm.isShowLimitTypeNums = true
                    this.addRulesForm.isShowLimitTypePoints = false
                } else if (curVal.limitTypeValue == 'FIXEDPOINT') {
                    this.addRulesForm.isShowLimitTypeNums = false
                    this.addRulesForm.isShowLimitTypePoints = true
                }

                // 规则状态
                if (curVal.enableValue == '1') {
                    this.addRulesForm.isEnable = true
                } else if (curVal.enableValue == '0') {
                    this.addRulesForm.isEnable = false
                }
            },
            deep: true,
        },
    }
}

</script>

<style type="text/css" media="screen">
.el-form-item__content {
    text-align: left;
    font-size: 12px;
}
</style>

<style lang="scss" scoped>
.addRulesForm {
    .inputInline {
        display: inline-block;
        margin-bottom: 0;
        color: #606266;
        .applyProductView {
            cursor: pointer;
        }
        .applyProductView:hover {
            text-decoration: underline;
        }
    }
}

.successDialog {
    .successNoteWarp {
        font-size: 14px;
        line-height: 20px;
    }
}
</style>