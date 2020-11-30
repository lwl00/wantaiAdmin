<template>
   <div class="app-container">
        <div class="filter-container" v-loading="loading">
            <el-form :model="addForm" ref="addForm" label-width="170px" class="addForm" size="small" :rules="rules">
                <el-form-item label="所属站点：" prop="siteValue">
                    <el-radio-group v-model="addForm.siteValue">
                        <el-radio 
                            v-for="item in addForm.siteData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态：" prop="enableValue">
                    <el-radio-group v-model="addForm.enableValue">
                        <el-radio 
                            v-for="item in addForm.enableData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item> 
                <el-form-item label="使用描述：" prop="couponTypeName">
                    <el-input 
                        v-model="addForm.couponTypeName" 
                        class="w400"
                        placeholder="请输入使用描述（供将展示在客户端优惠券详情，如：[双十一] 限三九部分药品可用）"></el-input>
                </el-form-item>                               
                <el-form-item label="优惠金额：" prop="deduction">
                    <el-input 
                        v-model="addForm.deduction" 
                        class="w100"
                        placeholder="请输入金额"
                        @keyup.native="formatDeduction(addForm.deduction)"></el-input> 元
                    <span class="grayColor">1/2/3/5或5的整数倍，<100</span>
                </el-form-item>                               
                <el-form-item label="起用金额：" prop="premisPrice">
                    <el-input 
                        v-model="addForm.premisPrice" 
                        class="w100"
                        placeholder="请输入金额"
                        @keyup.native="formatPremisPrice(addForm.premisPrice)"></el-input> 元
                </el-form-item>  
                <el-form-item label="获取渠道：" prop="gainWayValue">
                    <el-radio-group v-model="addForm.gainWayValue">
                        <el-radio 
                            v-for="item in addForm.gainWayData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="获取时间：" class="text-left" v-if="addForm.isShowgainDateTime" required>
                    <el-form-item label="" prop="gainDateTime">
                        <el-date-picker
                            v-model="addForm.gainDateTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                        <span class="grayColor">超时间客户无法领取此券</span>
                    </el-form-item>
                </el-form-item>
                <!-- <el-form-item label="有效时间：" class="text-left" prop=""> -->
                <el-form-item label="temp">
                    <span slot="label" class="labelSlot">有效时间：</span>
                    <el-radio-group v-model="addForm.effective" class="text-left">
                        <el-radio 
                            v-for="item in addForm.effectiveData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                            :disabled="item.disabled">
                            {{item.name}}
                            <el-form-item class="inputInline text-left" v-if="addForm.isShowFixedDays&&item.value =='1'" prop="fasten">
                                <el-input 
                                    v-model="addForm.fasten" 
                                    class="w100"
                                    placeholder="请输入固定天数"
                                    @keyup.native="formatFasten(addForm.fasten)"></el-input>天
                            </el-form-item>
                            <el-form-item  class="inputInline text-left" v-if="addForm.isShowSpecifyDate&&item.value =='2'" prop="enableDate">
                                <el-date-picker
                                    v-model="addForm.enableDate"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </el-form-item>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="个人限量：" prop="maxOwnCount" v-if="addForm.isShowMaxOwnCount">
                    <el-input 
                        v-model="addForm.maxOwnCount" 
                        class="w100"
                        placeholder="请输入个人限量"
                        @keyup.native="formatMaxOwnCount(addForm.maxOwnCount)"
                        :disabled="addForm.isDisabledMaxOwnCount"
                        key="maxOwnCount"></el-input> 张
                </el-form-item>                         
                <el-form-item label="总发行量：" prop="stock" v-if="addForm.isShowStock">
                    <el-input 
                        v-model="addForm.stock" 
                        class="w100"
                        placeholder="请输入总发行量"
                        @keyup.native="formatStock(addForm.stock)"
                        key="stock"></el-input> 张
                </el-form-item>  
                <el-form-item label="适用平台：" class="text-left" prop="applicationValue">
                    <el-checkbox-group v-model="addForm.applicationValue">
                        <el-checkbox
                            v-for="item in addForm.applicationData"
                            :label="item.value" 
                            :key="item.value"
                            name="type">
                            {{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>   
                <el-form-item label="适用商品：" prop="applyProductTypeValue">
                    <el-radio-group v-model="addForm.applyProductTypeValue">
                        <el-radio 
                            v-for="item in addForm.applyProductTypeData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>                    
                    <div class="" v-if="addForm.isShowUpload">
                        <el-form-item prop="applyProductCodes" class="inputInline" style="margin-bottom: 15px;">
                            <el-input 
                                type="textarea" 
                                rows="4" 
                                v-model="addForm.applyProductCodes" 
                                placeholder="商品ID,用(英文),隔开（如： 102401,102402,102401）" 
                                class="w400"
                                :disabled="true"></el-input>  
                            <span class="grayColor">请勿与同站点其他相同时间段、已启用的规则的商品重复</span>
                        </el-form-item>                        
                        <el-form-item class="inputInline" style="display: block;"> 
                            <el-upload
                                name="file"
                                class="upload-demo"
                                :action="addApplyProductAPPOINTAction"
                                :before-upload="beforeAvatarUpload"
                                :on-remove="handleRemove"
                                :file-list="addForm.fileListProduct"
                                :on-success="handleSuccessPreviary"
                                :on-error="handleErrorPreviary"
                                :on-change="handleChange"
                                width="200px"
                                :multiple="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <span slot="tip" class="el-upload__tip">
                                    <span> 已上传 {{uploadCodesLength}} 种商品</span>
                                    <span class="mianColor applyProductView" @click="_applyProductView">查看商品</span> 
                                </span>
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-form-item>

                <el-form-item label="可用客户：" required>
                    <el-radio-group v-model="addForm.couponUserTypesValue">
                        <el-radio 
                            v-for="item in addForm.couponUserTypesData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>                    
                    <div class="" v-if="addForm.isShowUserUpload">
                        <el-form-item prop="couponUserString" class="inputInline" style="margin-bottom: 15px;">
                            <el-input 
                                type="textarea" 
                                rows="4" 
                                v-model="addForm.couponUserString" 
                                placeholder="客户名,用(英文),隔开（如： 1054151***,1090361***,1090371***）" 
                                class="w400"
                                :disabled="true"></el-input>
                        </el-form-item>                        
                        <el-form-item class="inputInline" style="display: block;"> 
                            <el-upload
                                name="file"
                                class="upload-demo"
                                :action="addApplyProductAPPOINTAction"
                                :before-upload="beforeAvatarUpload"
                                :on-remove="handleRemoveUsers"
                                :file-list="addForm.fileListUsers"
                                :on-success="handleSuccessPreviaryUsers"
                                :on-error="handleErrorPreviary"
                                :on-change="handleChangeUsers"
                                width="200px"
                                :multiple="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <span slot="tip" class="el-upload__tip">
                                    <span> 已上传 {{uploadUsersLength}} 人</span>
                                    <span class="mianColor applyProductView" @click="viewApplyUsers">查看客户</span> 
                                </span>
                            </el-upload>
                        </el-form-item>
                    </div>
                </el-form-item> 
                <el-form-item label="备注：" prop="">
                    <el-input 
                        type="textarea"
                        rows="3"
                        v-model="addForm.remark" 
                        class="w400"
                        placeholder="备注仅管理后台可见，供运营自己记录（如：半年未下单客户召回）"></el-input>
                </el-form-item>
                <el-form-item label="计划发送时间：" class="text-left" prop="" v-if="addForm.isShowSendTime">
                    <el-radio-group v-model="addForm.sendTimeValue">
                        <el-radio 
                            v-for="item in addForm.sendTimeData"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                            {{item.name}}
                        </el-radio> 
                        <el-form-item class="text-left unit" v-if="addForm.isShowTransmissionLock" prop="transmission" style="display: inline-block;">
                            <el-date-picker
                                v-model="addForm.transmission"
                                type="datetime"
                                placeholder="选择日期时间"
                                :picker-options="pickerBeginDateAfter">
                            </el-date-picker>
                        </el-form-item>
                    </el-radio-group>
                </el-form-item>                  
                
                <el-form-item >
                    <el-button
                        type="primary"
                        size="small"
                        @click="_addCouponsType('addForm')"
                        :loading="saveLoading">确定</el-button>
                    <el-button type="info" size="small" @click="handleReset('addForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>


        <!-- 查看，出现重复code商品 -->
        <dialogModel class="applyProductView-model successDialog" ref="applyProductView-model" :title="dialog.dialogViewTitle" :width="dialog.dialogViewWidth">
            <div class="dialog-model-content">
                <div class="successNoteWarp">已上传 <b class="errorColor">{{uploadCodesLength}}</b> 种商品</div>
                <div class="cmyyTable">
                    <el-table
                        :data="dialog.viewTableData"
                        stripe
                        highlight-current-row
                        height="350"
                        v-loading="dialog.viewTableLoading">
                        <el-table-column
                            type="index"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            property=""
                            label="商品ID"
                            align="center">  
                            <template slot-scope="scope">
                                <span :class="scope.row.productName ? '' : 'errorColor' ">
                                    {{scope.row.productCode}}
                                </span>
                            </template> 
                        </el-table-column>
                        <el-table-column
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
                            property="ean"
                            label="厂家"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            property=""
                            label="操作"
                            align="center">
                            <template slot-scope="scope">
                                <el-button type="danger" size="mini" @click="delViewCode(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>                
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('applyProductView-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 查看适用客户详情 -->   
        <dialogModel class="applyUserView-model successDialog" ref="applyUserView-model" :title="dialog.dialogViewTitle" :width="dialog.dialogViewWidth">
            <div class="dialog-model-content">
                <div class="successNoteWarp">已上传 <b class="errorColor">{{uploadUsersLength}}</b> 位客户</div>
                <div class="cmyyTable">
                    <el-table
                        :data="dialog.viewTableDataUser"
                        stripe
                        highlight-current-row
                        height="350"
                        v-loading="dialog.viewTableLoadingUser">
                        <el-table-column
                            type="index"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            property=""
                            label="客户账号"
                            align="center">  
                            <template slot-scope="scope">
                                <span :class="scope.row.noCustomer ? 'errorColor' : '' ">
                                    {{scope.row.uid}}
                                </span>
                            </template> 
                        </el-table-column>
                        <el-table-column
                            property=""
                            label="客户名称"
                            align="center">
                            <template slot-scope="scope">
                                <span :class="scope.row.noCustomer ? 'errorColor' : '' ">
                                    {{scope.row.noCustomer ? '暂无该客户信息' : scope.row.customerName}}
                                </span>
                            </template>                            
                        </el-table-column>
                        
                        <el-table-column
                            property=""
                            label="操作"
                            align="center">
                            <template slot-scope="scope">
                                <el-button type="danger" size="mini" @click="delApplyUsers(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>                
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('applyUserView-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 保存时验证指定商品编号是否正确 -->
        <dialogModel class="check-model successDialog" ref="check-model" :title="dialog.dialogTitle" :width="dialog.dialogWidth">
            <div class="dialog-model-content">
                <div class="successNoteWarp" v-if="dialog.isProductNotListData"><b class="errorColor">{{dialog.productNotListData}}</b> 商品不合法，请点击【查看商品】并删除不存在的商品后，再确认保存</div>

                <div class="successNoteWarp" v-if="dialog.isUserNotListData"><b class="errorColor">{{dialog.userNotListData}}</b> 客户不合法，请点击【查看客户】并删除不存在的客户后，再确认保存。</div>

            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('check-model')">知道了</el-button>
            </div>
        </dialogModel>

    </div>

</template>

<script type="text/ecmascript-6">
    import Dialog from 'base/Dialog';
    import { dateTimeToStamp, deleteBlankSpace, todayTime, todayCurrentTime, dataToString, dateToStamp, positiveInteger, onlineDateTime, todayEndTime } from 'common/js/dom'
    import { getDictsData, addCouponsType, addRulesAPPOINTAction, applyProductView, applyUserView } from 'api/interface';
    export default {
        components: {
            'dialogModel': Dialog,
        },     
        name: "CouponsAdd",    
        data() {
            return {
                loading: true,
                saveLoading: false, // 新增保存
                addApplyProductAPPOINTAction: addRulesAPPOINTAction(), // 适用商品-指定商品上传excel action

                pickerBeginDateAfter: {
                    disabledDate: time => {
                        // let _now = Date.now();
                        // return _now > time.getTime();
                        let beginDateVal = dateTimeToStamp(todayTime())  // 目前只能大于当天。不能大于当前时分秒
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },                
                addForm: {
                    siteData: [], 
                    siteValue: '1000',

                    enableData: [],
                    enableValue: '1',  
                    isEnable: true,  

                    couponTypeName: '', //优惠券描述
                    deduction: '',      //优惠金额
                    timeoutDeduction: null, //优惠金额校验定时器
                    premisPrice: '',    //启用金额
                    timeoutPremisPrice: null,//启用金额校验定时器
                    isDeductionLock: false,

                    gainDateTime: [onlineDateTime(), todayEndTime()],   //获取时间
                    isShowgainDateTime: false,

                    effective: '1',      //有效时间
                    effectiveData: [
                        {name: '从客户获取起', value: '1', disabled: false},
                        {name: '指定日期', value: '2', disabled: false},
                    ], 
                    fasten: '',  
                    enableDate: [onlineDateTime(), todayEndTime()], 
                    isShowFixedDays : true,
                    isShowSpecifyDate: false,

                    gainWayData: [],    // 获取渠道
                    gainWayValue: '01',

                    maxOwnCount: '',    //个人限量
                    isShowMaxOwnCount: false,
                    isDisabledMaxOwnCount: false,  
                    timeoutMaxOwnCount: null, //个人限量校验定时器
                    stock: '',           //总发行量
                    isShowStock: false, 
                    timeoutStock: null, //总发行量校验定时器                    
                    

                    applicationData: [],    // 适用平台
                    applicationValue: ["PC", "WAP", "APP"],

                    applyProductTypeData: [],// 适用商品
                    applyProductTypeValue: '0',
                    applyProductCodes: '',
                    fileListProduct: [],
                    isShowUpload: false,

                    couponUserTypesData: [], // 可用客户
                    couponUserTypesValue: '0',
                    couponUserString: '',
                    fileListUsers: [],
                    isShowUserUpload: false,

                    remark: '', // 备注
                    
                    isShowSendTime: null,  // 获取渠道为'系统赠送'时展示计划发送时间项，其他不展示
                    sendTimeData: [],  // 计划发送时间
                    sendTimeValue: '1',
                    isShowTransmissionLock: false,
                    transmission: todayCurrentTime()

                },
                uploadCodesLength: 0,
                uploadUsersLength: 0,
                dialog: {
                    dialogViewTitle: '提示',
                    dialogViewWidth: '800px',
                    viewTableData: [],
                    viewTableLoading: false,
                    viewProductSize: 0,
                    productNotListData: '', // 保存时验证指定商品，错误商品编号字符串集合
                    isProductNotListData: false,

                    viewTableDataUser: [],
                    viewTableLoadingUser: false,
                    viewUserSize: 0,  
                    userNotListData: '', // 保存时验证指定客户，错误客户uid字符串集合
                    isUserNotListData: false,

                    dialogTitle: '提示',
                    dialogWidth: '400px',
                },                
                rules: {
                    siteValue: [
                        { required: true, message: '请选择所属站点', trigger: 'change' }
                    ],
                    enableValue: [ 
                        { required: true, message: '请选择规则状态', trigger: 'change' } 
                    ],
                    couponTypeName: [
                        { required: true, message: '请输入使用描述', trigger: 'blur' },
                    ],
                    deduction: [
                        { required: true, message: '请输入优惠金额', trigger: 'blur' },
                    ],
                    premisPrice: [
                        { required: true, message: '请输入起用金额', trigger: 'blur' },
                    ],
                    effective: [
                        { required: true, message: '请选择有效时间', trigger: 'change' },
                    ],
                    fasten: [
                        { required: true, message: '请输入固定天数', trigger: 'blur' },
                    ], 
                    gainDateTime: [
                        { required: true, message: '请选择获取时间', trigger: 'change' },
                    ],
                    enableDate: [
                        { required: true, message: '请选择指定日期', trigger: 'change' },
                    ], 
                    gainWayValue: [
                        { required: true, message: '请选择获取渠道', trigger: 'change' },
                    ],
                    maxOwnCount: [
                        { required: true, message: '请输入个人限量', trigger: 'blur' },
                    ],
                    stock: [
                        { required: true, message: '请输入总限量', trigger: 'blur' },
                    ],
                    applicationValue: [
                        { required: true, message: '请选择适用平台', trigger: 'change' },
                    ],
                    applyProductTypeValue: [
                        { required: true, message: '请选择适用商品', trigger: 'change' },
                    ],
                    applyProductCodes: [
                        { required: true, message: '请上传商品ID', trigger: 'blur' },
                    ],
                    couponUserString: [
                        { required: true, message: '请上传适用客户uid', trigger: 'blur' },
                    ],
                    sendTimeValue: [
                        { required: true, message: '请选择发送时间', trigger: 'change' },
                    ],
                    transmission: [
                        { required: true, message: '请选择定时发送时间', trigger: 'change' },
                    ],

                }
                
            }
        },
        created() {
            this._getDictsData()
        },
        mounted() {

        },
        methods: {
            _getDictsData: function() {
                // 站点
                var paramsSite = {
                    isAll: false,
                    code: 'CompanyCode'
                }
                getDictsData(paramsSite).then(res=> {
                    this.addForm.siteData = res.data
                })

                // 状态
                var paramsEnableDisable = {
                    isAll: false,
                    code: 'EnableDisable'
                }
                getDictsData(paramsEnableDisable).then(res=> {
                    this.addForm.enableData = res.data
                })                

                // 获取渠道
                var paramsCouponGainWay = {
                    isAll: false,
                    code: 'CouponGainWay'
                }
                getDictsData(paramsCouponGainWay).then(res=> {
                    this.addForm.gainWayData = res.data
                })                

                // 适用平台
                var paramsApplication = {
                    isAll: false,
                    code: 'Application'
                }
                getDictsData(paramsApplication).then(res=> {
                    this.addForm.applicationData = res.data
                }) 

                // 适用商品
                var paramsApplyProductType = {
                    code: 'CouponProductTypes'
                }
                getDictsData(paramsApplyProductType).then(res=> {
                    this.addForm.applyProductTypeData = res.data
                })                               

                // 适用客户
                var paramsCouponUserTypes = {
                    code: 'CouponUserTypes'
                }
                getDictsData(paramsCouponUserTypes).then(res=> {
                    this.addForm.couponUserTypesData = res.data
                })                               
                // 计划发送时间
                var paramsCouponSendFlag = {
                    code: 'CouponSendFlag'
                }
                getDictsData(paramsCouponSendFlag).then(res=> {
                    this.addForm.sendTimeData = res.data
                    this.loading = false;
                }) 
            },
            // 确定新增
            _addCouponsType: function(formName) {
                this.dialog.productNotListData = '';
                this.dialog.userNotListData = '';
                this.saveLoading = true;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(Number(this.addForm.premisPrice) < Number(this.addForm.deduction)) {
                            this.$message({
                                type: 'warning',
                                message: '起用金额必须大于优惠金额'
                            })
                            this.saveLoading = false
                        }else {                        
                            this.checkProduct()
                        }
                    }else {
                        this.$message({
                            message: '请完善信息',
                            type: 'warning'
                        })
                        this.saveLoading = false
                        return false;
                    }
                })
            },
            // check product
            checkProduct: function() {
                if(this.addForm.isShowUpload) {
                    var params = {
                        applyProductCodes: this.addForm.applyProductCodes,
                        companyCode: this.addForm.siteValue
                    }
                    this.dialog.isUserNotListData = false
                    applyProductView(params).then(res=> {
                        if(res.status == 200) {
                            if(res.data.productNotList.length == 0) {
                                this.dialog.isProductNotListData = false
                                this.checkUser()
                            }else {
                                this.$refs['check-model'].showModel();
                                this.dialog.isProductNotListData = true
                                res.data.productNotList.forEach((item) => {
                                    this.dialog.productNotListData = this.dialog.productNotListData + item.productCode + ','
                                })
                                this.saveLoading = false
                            }
                        }
                    })
                }else {
                    this.dialog.isProductNotListData = false 
                    this.checkUser()           
                }
            },
            // check user
            checkUser: function() {
                if(this.addForm.isShowUserUpload) {
                    var params = {
                        applyUserIds: this.addForm.couponUserString
                    }
                    applyUserView(params).then(res=> {
                        if(res.status == 200) {
                            if(res.data.customerNotList.length == 0) {
                                this.dialog.isUserNotListData = false
                                this.save()
                            }else {
                                this.$refs['check-model'].showModel();
                                this.dialog.isUserNotListData = true
                                res.data.customerNotList.forEach((item) => {
                                    this.dialog.userNotListData = this.dialog.userNotListData + item.uid + ','
                                })
                                this.saveLoading = false
                            }
                        }
                    })
                }else {
                    this.dialog.isUserNotListData = false
                    this.save()
                }                 
            },            
            // 保存方法
            save: function() {
                var params = {
                    companyCode: this.addForm.siteValue,
                    enable: this.addForm.isEnable,
                    couponTypeName: deleteBlankSpace(this.addForm.couponTypeName),
                    deduction: Number(this.addForm.deduction),
                    premisPrice: Number(this.addForm.premisPrice),
                    gainWay: this.addForm.gainWayValue,
                    applyProductTypes: this.addForm.applyProductTypeValue,
                    applyUserTypes: this.addForm.couponUserTypesValue,
                    remark: this.addForm.remark,
                }

                // 获取时间
                if(this.addForm.isShowgainDateTime) {
                    params.gainStartTime = dateToStamp(this.addForm.gainDateTime[0])
                    params.gainEndTime = dateToStamp(this.addForm.gainDateTime[1])
                }

                // 有效时间
                if(this.addForm.isShowFixedDays) {
                    params.effectiveFlag = true
                    params.effectiveDays = Number(this.addForm.fasten)
                }else if(this.addForm.isShowSpecifyDate) {
                    params.effectiveFlag = false
                    params.effectiveStartTime = dateToStamp(this.addForm.enableDate[0])
                    params.effectiveEndTime = dateToStamp(this.addForm.enableDate[1])
                }

                // 适用平台
                var applicationValueString = ''
                this.addForm.applicationValue.forEach((item) => {
                    applicationValueString = applicationValueString + item + ','
                }) 
                params.application = deleteBlankSpace(applicationValueString.substr(0, applicationValueString.length - 1));

                // 适用商品(指定商品)
                if(this.addForm.isShowUpload) {
                    params.applyProductCodes = this.addForm.applyProductCodes
                }

                // 适用客户(指定客户)
                if(this.addForm.isShowUserUpload) {
                    params.applyUserIds = this.addForm.couponUserString
                }

                // 计划发送时间
                if(this.addForm.isShowSendTime) {
                    params.sendNow = !this.addForm.isShowTransmissionLock
                    if(this.addForm.isShowTransmissionLock) {
                        params.sendTime = dateToStamp(this.addForm.transmission)
                    }                    
                }else {
                    params.sendNow = false
                }

                // 个人限量
                if(this.addForm.isShowMaxOwnCount) {
                    params.maxOwnCount = Number(this.addForm.maxOwnCount)               
                } 

                // 总发行量
                if(this.addForm.isShowStock) {
                    params.stock = Number(this.addForm.stock)               
                }

                // console.log(params)
                addCouponsType(params).then( res => {
                    if(res.status = 200) {
                        this.$message({
                            type: 'success',
                            message: '新增成功'
                        })
                        this.$router.push('/coupons/CouponsDetail?couponTypeCode='+res.data.couponTypeCode) // 跳转至详情
                    }else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        })
                    }
                    this.saveLoading = false
                })
            },
            // 重置
            handleReset: function(formName) {
                this.$refs[formName].resetFields()
                this.$message('重置成功');
            },            
            // 优惠金额取正整数
            formatDeduction: function(val) {
                var value = this.addForm.deduction = positiveInteger(val)

                clearTimeout(this.addForm.timeoutDeduction);
                this.addForm.timeoutDeduction = setTimeout(()=>{
                    if(value > 100) {
                        this.$message({
                            type: 'warning',
                            message: '优惠金额不能大于100'
                        })
                        this.addForm.deduction = 100
                    }else {
                        if(value == 1 || value == 2 || value == 3 || value%5 == 0) {
                            this.addForm.deduction = value
                        }else {
                            if(value > 5) {
                                this.$message({
                                    type: 'warning',
                                    message: '优惠金额必须为5的倍数，已修改为'+(value - value%5)
                                })                                    
                                this.addForm.deduction = value - value%5
                            }else {
                                this.$message({
                                    type: 'warning',
                                    message: '优惠金额最小为5，已修改为5'
                                })                                    
                                this.addForm.deduction = 5  
                            }
                        }
                    }
                }, 1500)
            },                        
            // 起用金额取正整数
            formatPremisPrice: function(val) {
                var value = this.addForm.premisPrice = positiveInteger(val)

                clearTimeout(this.addForm.timeoutPremisPrice);
                this.addForm.timeoutPremisPrice = setTimeout(()=>{
                    if(this.addForm.deduction == '') {
                        this.$message({
                            type: 'warning',
                            message: '请先输入优惠金额'
                        })                         
                    }else if(Number(this.addForm.premisPrice) < Number(this.addForm.deduction)) {
                        this.$message({
                            type: 'warning',
                            message: '启用金额必须大于优惠金额'
                        })
                    }
                }, 1500)
            },
            // 固定天数取正整数
            formatFasten: function(val) {
                this.addForm.fasten = positiveInteger(val)
            },                        
            // 个人限量取正整数
            formatMaxOwnCount: function(val) {
                var value = this.addForm.maxOwnCount = positiveInteger(val)

                clearTimeout(this.addForm.timeoutMaxOwnCount);
                this.addForm.timeoutMaxOwnCount = setTimeout(()=>{
                    if(value > 100) {
                        this.$message({
                            type: 'warning',
                            message: '个人限量不能大于100'
                        })
                        this.addForm.maxOwnCount = 100
                    }
                }, 1500)
            },                        
            // 总发行量取正整数
            formatStock: function(val) {
                var value = this.addForm.stock = positiveInteger(val)
                clearTimeout(this.addForm.timeoutStock);
                this.addForm.timeoutStock = setTimeout(()=>{
                    if(value > 10000) {
                        this.$message({
                            type: 'warning',
                            message: '总发行量不能大于10000'
                        })
                        this.addForm.stock = 10000
                    }
                }, 1500)                
            },
            // 查看商品/客户关闭弹窗（知道了按钮）
            dialogHide: function(type) {
                this.$refs[type].hideModel();
            },
            // 上传之前(适用商品)(可用客户)
            beforeAvatarUpload: function(file) {
                if(file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    this.isExcel = true
                }else {
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
            // 上传失败(适用商品)(可用客户)
            handleErrorPreviary: function(err, file, fileList) {
                this.$message({
                    message: file.name+'上传失败',
                    type: 'error'
                })
            }, 

            // 上传成功(适用商品)
            handleSuccessPreviary: function(response, file, fileList) {
                var uploadCodes = fileList[0].response.data
                if(uploadCodes != null) {
                    uploadCodes = uploadCodes.split(",")
                    var newCodes = ''

                    // 删除重复ID
                    for (var i=uploadCodes.length-1; i>=0; i--) {
                        var targetNode = uploadCodes[i];
                        for (var j=0; j<i; j++) {
                            if(targetNode == uploadCodes[j]) {
                                uploadCodes.splice(i,1);
                                break;
                            }
                        }
                    }
                    // 组成新的code字符串，填入文本框中
                    uploadCodes.forEach((item) => {
                        newCodes = newCodes +item+ ','
                    })

                    this.uploadCodesLength = uploadCodes.length
                    this.addForm.applyProductCodes = newCodes.substr(0, newCodes.length - 1);
                    this.addForm.fileListProduct = fileList
                }else {
                    this.$message({
                        message: '商品编号格式错误，请检查修正后重新上传',
                        type: 'error'
                    })
                }
            },
            // 删除已上传文件(适用商品)
            handleRemove(file, fileList) {
                this.uploadCodesLength = 0
            },
            // 多次上传，只保留最后一次文件(适用商品)
            handleChange(file, fileList) {
                this.addForm.fileListProduct = fileList.slice(-1);
            },  
            // 查看商品(适用商品)
            _applyProductView: function() {
                if(this.addForm.applyProductCodes == '') {
                    this.$message({
                        message: '请上传商品ID',
                        type: 'warning'
                    })                    
                }else {
                    var params = {
                        applyProductCodes: this.addForm.applyProductCodes,
                        companyCode: this.addForm.siteValue
                    }
                    this.$refs['applyProductView-model'].showModel();
                    this.dialog.viewTableLoading = true
                    applyProductView(params).then(res=> {

                        this.dialog.viewTableLoading = false
                        if(res.status == 200) {
                            // 添加有效商品
                            this.dialog.viewTableData = res.data.data

                            // 添加无效商品
                            res.data.productNotList.forEach((item) => {
                                this.dialog.viewTableData.push(item)
                            })

                        }
                    }) 
                }
            },
            // 删除商品(适用商品)
            delViewCode: function(row) {            
                this.$confirm('确定删除该商品信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除弹出层表格数据
                    this.dialog.viewTableData.forEach((item, index) => {
                        if(item.productCode == row.productCode) {
                            this.dialog.viewTableData.splice(index, 1);                
                        }
                    })
                    this.uploadCodesLength = this.dialog.viewTableData.length
                    
                    // 删除输入框商品编码字符串
                    var newCodes = ''
                    var uploadCodes = this.addForm.applyProductCodes
                    uploadCodes = uploadCodes.split(",")

                    uploadCodes.forEach((item, index) => {
                        if(item == row.productCode) {
                            uploadCodes.splice(index,1) 
                        }
                    })

                    // 组成新的code字符串，填入文本框中
                    uploadCodes.forEach((item) => {
                        newCodes = newCodes +item+ ','
                    })                    
                    this.addForm.applyProductCodes = newCodes.substr(0, newCodes.length - 1);

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
            },

            // 上传成功(可用客户)
            handleSuccessPreviaryUsers: function(response, file, fileList) {
                var uploadCodes = fileList[0].response.data
                if(uploadCodes != null) {
                    uploadCodes = uploadCodes.split(",")
                    var newCodes = ''

                    // 删除重复ID
                    for (var i=uploadCodes.length-1; i>=0; i--) {
                        var targetNode = uploadCodes[i];
                        for (var j=0; j<i; j++) {
                            if(targetNode == uploadCodes[j]) {
                                uploadCodes.splice(i,1);
                                break;
                            }
                        }
                    }
                    // 组成新的code字符串，填入文本框中
                    uploadCodes.forEach((item) => {
                        newCodes = newCodes +item+ ','
                    })

                    this.uploadUsersLength = uploadCodes.length
                    this.addForm.couponUserString = newCodes.substr(0, newCodes.length - 1);
                    this.addForm.fileListUsers = fileList
                }else {
                    this.$message({
                        message: '商品编号格式错误，请检查修正后重新上传',
                        type: 'error'
                    })
                }
            },
            // 删除已上传文件(可用客户)
            handleRemoveUsers(file, fileList) {
                this.uploadUsersLength = 0
            },
            // 多次上传，只保留最后一次文件(可用客户)
            handleChangeUsers(file, fileList) {
                this.addForm.fileListUsers = fileList.slice(-1);
            },            
            // 查看客户(可用客户)
            viewApplyUsers: function() {
                if(this.addForm.couponUserString == '') {
                    this.$message({
                        message: '请上传适用客户',
                        type: 'warning'
                    })                    
                }else {
                    var params = {
                        applyUserIds: this.addForm.couponUserString
                    }
                    this.$refs['applyUserView-model'].showModel();
                    this.dialog.viewTableLoadingUser = true
                    applyUserView(params).then(res=> {
                        this.dialog.viewTableLoadingUser = false
                        if(res.status == 200) {
                            // 添加有效效客户
                            this.dialog.viewTableDataUser = res.data.data

                            // 添加无效客户
                            if(res.data.customerNotList.length != 0) {
                                res.data.customerNotList.forEach((item) => {
                                    item.noCustomer = true
                                    this.dialog.viewTableDataUser.push(item)
                                })
                            }
                           
                        }
                    }) 
                }                
            },
            // 删除客户(可用客户)
            delApplyUsers: function(row) {
                this.$confirm('确定删除该客户信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除弹出层表格数据
                    this.dialog.viewTableDataUser.forEach((item, index) => {
                        if(item.uid == row.uid) {
                            this.dialog.viewTableDataUser.splice(index, 1);                
                        }
                    })
                    this.uploadUsersLength = this.dialog.viewTableDataUser.length

                    // 删除输入框商品编码字符串
                    var newCodes = ''
                    var uploadCodes = this.addForm.couponUserString
                    uploadCodes = uploadCodes.split(",")

                    uploadCodes.forEach((item, index) => {
                        if(item == row.uid) {
                            uploadCodes.splice(index,1) 
                        }
                    })

                    // 组成新的code字符串，填入文本框中
                    uploadCodes.forEach((item) => {
                        newCodes = newCodes +item+ ','
                    })                    
                    this.addForm.couponUserString = newCodes.substr(0, newCodes.length - 1);

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
            },
        },
        watch: {
            'addForm.effective': {
                handler(curVal, oldVal){
                    this.addForm.effective = curVal
                    if (curVal == '1') {
                        this.addForm.isShowFixedDays = true
                        this.addForm.isShowSpecifyDate = false
                    } else if(curVal == '2'){
                        this.addForm.isShowFixedDays = false
                        this.addForm.isShowSpecifyDate = true
                    }
                },
            },
            'addForm.applyProductTypeValue': {
                handler(curVal, oldVal){
                    this.addForm.applyProductTypeValue = curVal
                    if(curVal == '0') {
                        this.addForm.isShowUpload = false
                    }else if(curVal == '4') {
                        this.addForm.isShowUpload = true
                    }
                },
            },
            'addForm.couponUserTypesValue': {
                handler(curVal, oldVal){
                    this.addForm.couponUserTypesValue = curVal
                    if(curVal == '0') {
                        this.addForm.isShowUserUpload = false
                    }else if(curVal == '4') {
                        this.addForm.isShowUserUpload = true
                    }
                },
            },
            'addForm.sendTimeValue': {
                handler(curVal, oldVal){
                    this.addForm.sendTimeValue = curVal
                    if(curVal == '0') {
                        this.addForm.isShowTransmissionLock = true
                        this.addForm.transmission = todayCurrentTime()

                    }else if(curVal == '1') {
                        this.addForm.isShowTransmissionLock = false
                    }
                },
            },
            'addForm.enableValue': {
                handler(curVal, oldVal){
                    if(curVal == '1') {
                        this.addForm.isEnable = true

                    }else if(curVal == '0') {
                        this.addForm.isEnable = false
                    }
                },
            },           
            'addForm.gainWayValue': {
                handler(curVal, oldVal){
                    this.$refs['addForm'].clearValidate();
                    this.addForm.applicationValue = ["PC", "WAP", "APP"]
                    // 个人限量
                    if(curVal == '01') { // 积分兑换
                        this.addForm.isShowgainDateTime = false  // 获取时间
                        this.addForm.isShowSendTime = false  // 计划发送时间
                        this.addForm.isShowMaxOwnCount = false  // 个人限量
                        this.addForm.maxOwnCount = ''
                        this.addForm.isDisabledMaxOwnCount = false
                        this.addForm.isShowStock = false  // 发行总量

                    }else if(curVal == '02') {  // 系统赠送
                        this.addForm.isShowgainDateTime = false
                        this.addForm.isShowSendTime = true
                        this.addForm.isShowMaxOwnCount = true
                        this.addForm.maxOwnCount = 1
                        this.addForm.isDisabledMaxOwnCount = true
                        this.addForm.isShowStock = false

                    }else if(curVal == '03') {  // 客户领取
                        this.addForm.isShowgainDateTime = true
                        this.addForm.isShowSendTime = false
                        this.addForm.isShowMaxOwnCount = true
                        this.addForm.maxOwnCount = ''
                        this.addForm.isDisabledMaxOwnCount = false  
                        this.addForm.isShowStock = true
                        this.addForm.stock = ''
                    }
                },
            },           

        }       
    }   
</script>

<style lang="scss" scoped>
    .addForm {
        .inputInline {
            display: inline-block;
            margin-bottom: 0;
            color: #606266;
        }
        .applyProductView {
            cursor: pointer;                
        }
        .applyProductView:hover {
            text-decoration: underline;
        } 
    }   

</style>
