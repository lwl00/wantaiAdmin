<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="19">
                    <el-form
                        :inline="true"
                        :model="search"
                        ref="search"
                        class="searchWarp"
                        size="small"
                    >
                        <el-form-item label="站点：" prop="siteValue">
                            <el-select v-model="search.siteValue" class="w100">
                                <el-option
                                    v-for="item in search.siteData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态：" prop="enableValue">
                            <el-select v-model="search.enableValue" class="w100">
                                <el-option
                                    v-for="item in search.enableData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品：" prop="applyProductTypesValue">
                            <el-select v-model="search.applyProductTypesValue" class="w100">
                                <el-option
                                    v-for="item in search.applyProductTypesData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="平台：" prop="applicationValue">
                            <el-select v-model="search.applicationValue" class="w100">
                                <el-option
                                    v-for="item in search.applicationData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="获取方式：" prop="gainWayValue">
                            <el-select v-model="search.gainWayValue" class="w100">
                                <el-option
                                    v-for="item in search.gainWayData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="使用描述：" prop="couponTypeName">
                            <el-input
                                v-model="search.couponTypeName"
                                placeholder="请输入使用描述"
                                class="w150"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="类型编号：" prop="typeNumber">
                            <el-input
                                v-model="search.typeNumber"
                                placeholder="请输入类型编号"
                                class="w150"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="时间类型：" prop="dateTimeTypeValue">
                            <el-select v-model="search.dateTimeTypeValue" class="w100">
                                <el-option
                                    v-for="item in search.dateTimeTypeData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label
                            prop="days"
                            v-if="!search.isShowDateTime && !search.isDateTimeTypeNameAll"
                        >
                            <el-input
                                v-model="search.days"
                                placeholder="请输入固定天数"
                                class="w150"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label
                            prop="dateTime"
                            v-if="search.isShowDateTime && !search.isDateTimeTypeNameAll"
                        >
                            <el-date-picker
                                v-model="search.dateTime"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '23:59:59']"
                            ></el-date-picker>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="_getSearch">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="info" @click="resetSearchForm('search')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="5" class="todoWarp">
                    <el-button
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        size="small"
                        @click="handleAdd('/coupons/CouponsAdd')"
                        v-if="isAddPermission"
                    >新增</el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-download"
                        size="small"
                        @click="_getExport"
                    >导出excel</el-button>
                </el-col>
            </el-row>
            <ButtonGroup :buttonList="buttonList"></ButtonGroup>
            <Search :searchOptions="searchOptions" @search="_getSearch" @reset="resetSearchForm"></Search>
            <el-row :gutter="20" class="table-container">
                <el-col :span="24">
                    <div class="cmyyTable">
                        <el-table
                            ref="singleTable"
                            :data="table.tableData"
                            stripe
                            v-loading="table.tableLoading"
                            highlight-current-row
                        >
                            <el-table-column
                                type="index"
                                :index="getIndex"
                                align="center"
                                label="序号"
                                width="50"
                            ></el-table-column>
                            <el-table-column
                                property="id"
                                align="center"
                                label="优惠券ID"
                                width="100px"
                            ></el-table-column>
                            <el-table-column property align="center" label="类型编号" width="100px">
                                <template slot-scope="{row}">
                                    <span
                                        class="mianColor routerLink"
                                        @click="routerLinkPage('/coupons/CouponsDetail?couponTypeCode='+row.couponTypeCode+'')"
                                    >{{row.couponTypeCode}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="companyName" label="站点" align="center"></el-table-column>
                            <el-table-column property="deduction" align="center" label="优惠金额"></el-table-column>
                            <el-table-column property="premisPrice" align="center" label="起用金额"></el-table-column>
                            <el-table-column
                                property="applyProductTypesName"
                                align="center"
                                label="适用商品"
                            ></el-table-column>
                            <el-table-column
                                property="application"
                                align="center"
                                label="适用平台"
                                width="120"
                            ></el-table-column>
                            <el-table-column
                                property
                                align="center"
                                label="获取时间"
                                width="150"
                                :formatter="formatterGainDateTime"
                            ></el-table-column>
                            <el-table-column
                                property="effectiveDays"
                                align="center"
                                label="有效时间（天）"
                                width="150"
                                :formatter="formatterEffectiveDays"
                            ></el-table-column>
                            <el-table-column
                                property="couponTypeName"
                                align="center"
                                label="使用描述"
                                width="150"
                            ></el-table-column>
                            <el-table-column property="enable" align="center" label="状态">
                                <template slot-scope="{row}">{{ row.enable?'已启用': '已禁用' }}</template>
                            </el-table-column>
                            <el-table-column property="gainWayName" align="center" label="获取方式">
                                <template slot-scope="{row}">{{ row.gainWayName || '--' }}</template>
                            </el-table-column>
                            <el-table-column property="stock" align="center" label="总发行量"></el-table-column>
                            <el-table-column property="issuedQuantity" align="center" label="已发放"></el-table-column>
                            <el-table-column property="unissuedQuantity" align="center" label="待发放"></el-table-column>
                            <el-table-column property="unusedQuantity" align="center" label="未使用"></el-table-column>
                            <el-table-column property="usedQuantity" align="center" label="已使用"></el-table-column>
                            <el-table-column property="expiredQuantity" align="center" label="已过期"></el-table-column>
                            <el-table-column
                                property="status"
                                align="center"
                                label="操作"
                                width="280px"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="getCouponTypeDetail('/coupons/CouponsDetail', scope)"
                                    >查看</el-button>
                                    <el-button
                                        type
                                        size="mini"
                                        @click="getCouponTypeEdit('/coupons/CouponsEdit', scope)"
                                        v-if="scope.row.issuedQuantity == 0 && isEditPermission"
                                    >编辑</el-button>
                                    <el-button
                                        type="danger"
                                        size="mini"
                                        @click="dialogShow('disableDialog-model', scope)"
                                        v-if="scope.row.issuedQuantity > 0 && scope.row.enable && isDeletePermission"
                                    >禁用</el-button>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        @click="getCouponTypeUrl('dialog-model-url', scope)"
                                        v-if="scope.row.gainWayName == '客户领取'"
                                    >复制短链接</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="table.pageNum"
                            :page-sizes="[20, 50, 100]"
                            :page-size="table.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="table.totalPage"
                        ></el-pagination>
                    </div>
                </el-col>
            </el-row>

            <!-- 优惠券链接弹窗 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-url"
                :title="dialog.dialogTitle"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content operation">
                    <p class="operationText">
                        短链接：
                        <a
                            target="_blank"
                            :href="copyData.gainUrl"
                            class="errorColor"
                        >{{copyData.gainUrl}}</a>
                        <span
                            class="mianColor routerLink copys"
                            v-clipboard:copy="copyData.gainUrl"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                        >复制</span>
                    </p>
                    <p
                        class="operationText TextContent"
                    >优惠券信息:{{copyData.couponTypeCode}}，{{copyData.companyName}}，{{copyData.couponTypeName}}</p>
                </div>
                <div class="dialog-model-footer">
                    <el-button type="primary" size="small" @click="know('dialog-model-url')">知道了</el-button>
                </div>
            </dialogModel>

            <!-- 客户列表弹窗 -->
            <dialogModel
                class="disableDialog-model"
                ref="disableDialog-model"
                :title="dialog.disableDialogTitle"
                :width="dialog.disableDialogWidth"
            >
                <div class="dialog-model-content">
                    <p class="dialogNote">
                        禁用后，已发放至客户账号的
                        <b
                            class="errorColor"
                        >{{dialog.disableDialogData.issuedQuantity}}</b>张未使用张优惠券将变为已失效，请谨慎修改。
                    </p>
                    <el-form :model="reasonData" ref="reasonData" :rules="rules" class size="small">
                        <el-form-item label prop="disableReason">
                            <el-input
                                type="textarea"
                                rows="3"
                                v-model="reasonData.disableReason"
                                class
                                placeholder="请填写禁用原因（向客户展示）"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="changeStatus('reasonData')"
                        :loading="saveLoading"
                    >禁用</el-button>
                    <el-button size="mini" @click="cancelChangeStatus('disableDialog-model')">取消</el-button>
                </div>
            </dialogModel>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDateSearch, formatDateTimes, deleteBlankSpace, onlineDateTime, todayEndTime, formatSearch } from 'common/js/dom';
import ButtonGroup from '@/components/ButtonGroup'
import Search from '@/components/Search'
import { getDictsData, getCouponList, editCouponsType } from 'api/interface';
import Dialog from 'base/Dialog';

export default {
    components: {
        ButtonGroup,
        Search,
        'dialogModel': Dialog,
    },
    name: "CouponType",
    data() {
        return {
            saveLoading: false,  // 禁用保存
            table: {
                tableData: [],
                totalPage: 20,
                pageSize: 20,
                pageNum: 1,
                tableLoading: false,
            },
            dialog: {
                dialogTitle: '优惠券链接',
                dialogWidth: '450px',

                disableDialogTitle: '禁用优惠券提醒 ',
                disableDialogWidth: '400px',

                disableDialogData: '',  // 禁用弹窗数据信息
            },
            reasonData: {
                disableReason: '',     // 禁用原因
            },
            rules: {
                disableReason: [
                    { required: true, message: '请完善原因', trigger: 'blur' }
                ],
            },
            search: {
                siteData: [],  // 站点数组
                siteName: '',  // 选中站点中文名
                siteValue: '', // 选中站点code

                enableData: [], // 启用状态
                enableName: '',
                enableValue: '',

                applyProductTypesData: [],// 适用商品
                applyProductTypesName: '',
                applyProductTypesValue: '',

                applicationData: [], // 适用平台
                applicationName: '',
                applicationValue: '',

                gainWayData: [], // 获取方式
                gainWayName: '',
                gainWayValue: '',

                couponTypeName: '',// 使用描述
                typeNumber: '',// 类型编号

                dateTimeTypeData: [
                    { name: '全部', value: '' },
                    { name: '指定日期', value: '1' },
                    { name: '固定天数', value: '2' }
                ], // 获取方式
                dateTimeTypeName: '',
                dateTimeTypeValue: '',
                isShowDateTime: true,
                isDateTimeTypeNameAll: true,

                days: '',// 固定天数

                dateTime: [onlineDateTime(), todayEndTime()],
                startTimeValue: onlineDateTime(),
                endTimeValue: todayEndTime(),
            },
            buttonList: [
                {
                    name: 'add',
                    type: 'primary',
                    icon: 'el-icon-circle-plus-outline',
                    text: '新增',
                    class: '',
                    show: true,
                    loading: false,
                    click: this.handleAdd,
                },
                {
                    name: 'export',
                    type: 'primary',
                    icon: 'el-icon-download',
                    text: '导出',
                    class: '',
                    show: true,
                    loading: false,
                    click: this._getExport,
                }
            ],
            // companyCode: this.search.siteValue,
            //     enable: this.search.enableValue,
            //     applyProductTypes: this.search.applyProductTypesValue,
            //     application: this.search.applicationValue,
            //     gainWay: this.search.gainWayValue,
            //     couponTypeName: deleteBlankSpace(this.search.couponTypeName),
            //     couponTypeCode: deleteBlankSpace(this.search.typeNumber),
            //     pageNum: pageNum,
            //     pageSize: pageSize,
            //     export: false,
            //     nameStr: '',
            //     fieldStr: '',
            searchOptions: [{
                label: '站点',
                field: 'companyCode',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '状态',
                field: 'enable',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '商品',
                field: 'applyProductTypes',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '平台',
                field: 'application',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '获取方式',
                field: 'gainWay',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '使用描述',
                field: 'couponTypeName',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '类型编号',
                field: 'couponTypeCode',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '时间类型',
                field: 'customerName',
                value: '',
                type: 'select',
                options: [{ name: '全部', value: '' },
                { name: '指定日期', value: '1' },
                { name: '固定天数', value: '2' }],
            }, {
                label: '固定天数',
                field: 'effectiveDays',
                value: '',
                type: 'input',
                options: [],
            },
            {
                label: '',
                field: 'date',
                value: [onlineDateTime(), todayEndTime()],
                type: 'datetimerange',
                fields: ['startDate', 'endDate'],
            }
            ],
            newSearch: {},
            copyData: {
                gainUrl: '',
                couponTypeCode: '',
                companyName: '',
                couponTypeName: ''
            },
            isAddPermission: false,  // 新增按钮权限
            isEditPermission: false,  // 编辑按钮权限
            isDeletePermission: false,  // 删除按钮权限
        }
    },
    created() {
        this.newSearch = formatSearch(this.searchOptions)
        this._getDictsData()
        this.getPermissions()
        this._getCouponList(this.table.pageNum, this.table.pageSize);
    },
    methods: {
        // 查询数据字典
        _getDictsData: function () {
            // 站点
            var paramsSite = {
                isAll: true,
                code: 'CompanyCode'
            }
            getDictsData(paramsSite).then(res => {
                if (res.status == 200) {
                    this.searchOptions.filter(item => item.field === 'companyCode')[0].options = res.data
                    this.search.siteData = res.data
                }
            })

            // 状态
            var paramsEnableDisable = {
                isAll: true,
                code: 'EnableDisable'
            }
            getDictsData(paramsEnableDisable).then(res => {
                if (res.status == 200) {
                    this.searchOptions.filter(item => item.field === 'enable')[0].options = res.data
                    this.search.enableData = res.data
                    this.loading = false
                }
            })

            // 优惠券适用商品类型
            var paramsCouponProductTypes = {
                isAll: true,
                code: 'CouponProductTypes'
            }
            getDictsData(paramsCouponProductTypes).then(res => {
                if (res.status == 200) {
                    this.searchOptions.filter(item => item.field === 'applyProductTypes')[0].options = res.data
                    this.search.applyProductTypesData = res.data
                    this.loading = false
                }
            })

            // 适用平台
            var paramsApplication = {
                isAll: true,
                code: 'Application'
            }
            getDictsData(paramsApplication).then(res => {
                if (res.status == 200) {
                    this.searchOptions.filter(item => item.field === 'application')[0].options = res.data
                    this.search.applicationData = res.data
                    this.loading = false
                }
            })

            // 优惠券获取类型
            var paramsCouponGainWay = {
                isAll: true,
                code: 'CouponGainWay'
            }
            getDictsData(paramsCouponGainWay).then(res => {
                if (res.status == 200) {
                    this.searchOptions.filter(item => item.field === 'gainWay')[0].options = res.data
                    this.search.gainWayData = res.data
                    this.loading = false
                }
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("operation:couponType:create")) {
                this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = true
            } else {
                this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = false
            }
            if (permissionsBtnArr.includes("operation:couponType:update")) {
                this.isEditPermission = true
            } else {
                this.isEditPermission = false
            }
            if (permissionsBtnArr.includes("operation:couponType:delete")) {
                this.isDeletePermission = true
            } else {
                this.isDeletePermission = false
            }
        },
        // 获取表格数据
        _getCouponList: function (pageNum, pageSize) {
            var params = {
                companyCode: this.search.siteValue,
                enable: this.search.enableValue,
                applyProductTypes: this.search.applyProductTypesValue,
                application: this.search.applicationValue,
                gainWay: this.search.gainWayValue,
                couponTypeName: deleteBlankSpace(this.search.couponTypeName),
                couponTypeCode: deleteBlankSpace(this.search.typeNumber),
                pageNum: pageNum,
                pageSize: pageSize,
                export: false,
                nameStr: '',
                fieldStr: '',
            }
            if (this.search.isDateTimeTypeNameAll) {
                params.startTimeValue = ''
                params.endTimeValue = ''
                params.effectiveDays = ''
                params.effectiveDaysFlag = ''
            } else {
                if (this.search.isShowDateTime) {
                    params.startTimeValue = this.search.startTimeValue
                    params.endTimeValue = this.search.endTimeValue
                    params.effectiveDays = ''
                    params.effectiveDaysFlag = false
                } else {
                    params.startTimeValue = ''
                    params.endTimeValue = ''
                    params.effectiveDays = this.search.days
                    params.effectiveDaysFlag = true
                }
            }


            this.table.tableLoading = true
            getCouponList(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    this.table.tableData = res.data
                    this.table.totalPage = res.pageVO.total
                }
            })
        },
        // 导出
        _getExport: function () {
            var params = {
                companyCode: this.search.siteValue,
                enable: this.search.enableValue,
                applyProductTypes: this.search.applyProductTypesValue,
                application: this.search.applicationValue,
                gainWay: this.search.gainWayValue,
                couponTypeName: deleteBlankSpace(this.search.couponTypeName),
                couponTypeCode: deleteBlankSpace(this.search.typeNumber),
                startTimeValue: '',
                endTimeValue: '',
                effectiveDays: '',
                effectiveDaysFlag: '',
                pageNum: '',
                pageSize: '',
                export: true,
                nameStr: '优惠券ID,类型编号,站点,优惠金额,起用金额,适用商品,适用平台,获取时间,有效时间（天）,使用描述,状态,获取方式,总发行量,已发放,待发放,未使用,已使用,已过期',
                fieldStr: 'id,couponTypeCode,companyName,deduction,premisPrice,applyProductTypesName,application,gainDateTime,effectiveDays,couponTypeName,enable,gainWayName,stock,issuedQuantity,unissuedQuantity,unusedQuantity,usedQuantity,expiredQuantity',

                //有效时间(effectiveDays)   站点(companyName)  适用商品(applyProductTypesName)   状态(enable)
            }

            window.location.href = getCouponList(params)
        },
        // 查询条件重置
        resetSearchForm: function (e) {
            this.newSearch = e
            // this.$refs[formName].resetFields();
            this.search.days = ''
            this.search.isDateTimeTypeNameAll = true
            this.search.isShowDateTime = true
            this.search.startTimeValue = this.search.dateTime[0]
            this.search.endTimeValue = this.search.dateTime[1]
            this._getCouponList(1, this.table.pageSize)
            this.$message('重置成功');
        },
        // 查询
        _getSearch: function (e) {
            this.newSearch = e
            this._getCouponList(1, this.table.pageSize)
        },
        // 格式化日期--获取时间
        formatterGainDateTime: function (row, column) {
            if (row.gainStartTime && row.gainStartTime) {
                var gainDateTime = formatDateTimes(row.gainStartTime) + ' -- ' + formatDateTimes(row.gainEndTime)
                return gainDateTime
            } else {
                return '--'
            }
        },
        // 格式化日期--有效时间
        formatterEffectiveDays: function (row) {
            var effectiveDays = ''
            if (row.effectiveFlag) {
                effectiveDays = "从客户获取起 " + row.effectiveDays + " 天内"
            } else {
                effectiveDays = formatDateTimes(row.effectiveStartTime) + ' -- ' + formatDateTimes(row.effectiveEndTime)
            }

            return effectiveDays

        },
        //新增
        handleAdd: function (index) {
            this.$router.push(index)
        },
        //分页序号
        getIndex(index) {
            return (this.table.pageNum - 1) * this.table.pageSize + index + 1
        },
        //分页请求
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getCouponList(this.table.pageNum, this.table.pageSize);
        },
        //当前页请求
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getCouponList(this.table.pageNum, this.table.pageSize);
        },
        //跳转到详情
        getCouponTypeDetail: function (index, row) {
            this.$router.push({
                path: index,
                query: {
                    couponTypeCode: row.row.couponTypeCode
                }
            })
        },
        //跳转到编辑
        getCouponTypeEdit: function (index, row) {
            this.$router.push('/coupons/CouponsEdit?couponTypeCode=' + row.row.couponTypeCode + '')
        },
        // 已发送数量大于0时，显示禁用按钮，改变状态为false
        changeStatus: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = this.dialog.disableDialogData
                    params.enable = false
                    params.reason = this.reasonData.disableReason

                    if (params.applyProductTypes == '4') {
                        params.applyProductCodes = params.applyProductCodes.substr(0, params.applyProductCodes.length - 1)
                        params.applyProductCodes = params.applyProductCodes.substr(1)
                    }

                    if (params.applyUserTypes == '4') {
                        params.applyUserIds = params.applyUserIds.substr(0, params.applyUserIds.length - 1)
                        params.applyUserIds = params.applyUserIds.substr(1)
                    }

                    this.saveLoading = true
                    editCouponsType(params).then(res => {
                        if (res.status = 200) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                        this.$refs['disableDialog-model'].hideModel();
                        this.saveLoading = false
                    })
                } else {
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    })
                    return false;
                }
            })
        },
        // 禁用弹窗取消
        cancelChangeStatus: function (model) {
            this.$refs['reasonData'].resetFields();
            this.dialogHide(model)
        },
        // 弹窗展示
        dialogShow: function (type, data) {
            this.dialog.disableDialogData = data.row
            this.$refs[type].showModel();
        },
        // 弹窗关闭
        dialogHide: function (type) {
            this.$refs[type].hideModel();
        },
        // 跳转页面(新增、查看、编辑)
        routerLinkPage: function (index) {
            this.$router.push(index)
            this.dialogHide('disableDialog-model')
        },
        //复制短链接
        getCouponTypeUrl: function (type, row) {
            this.$refs[type].showModel()
            this.copyData.gainUrl = row.row.gainUrl
            this.copyData.couponTypeCode = row.row.couponTypeCode
            this.copyData.companyName = row.row.companyName
            this.copyData.couponTypeName = row.row.couponTypeName
        },
        //知道了
        know: function (type) {
            this.$refs[type].hideModel()
        },
        //点击复制
        //成功
        onCopy: function (e) {
            this.$message({
                type: "success",
                message: '复制成功     ' + e.text
            })
        },
        //失败
        onError: function (e) {
            this.$message({
                type: "error",
                message: '复制失败'
            })
        },
        //点击跳转到客户领取页面
        getGainUrl: function (index) {
            this.$router.push(index)
        }

    },
    watch: {
        'search.dateTime': {
            handler(curVal, oldVal) {
                this.search.startTimeValue = formatDateSearch(new Date(curVal[0]), 'yyyy-MM-dd hh:mm:ss')
                this.search.endTimeValue = formatDateSearch(new Date(curVal[1]), 'yyyy-MM-dd hh:mm:ss')
            },
        },
        'search.dateTimeTypeValue': {
            handler(curVal, oldVal) {
                if (curVal == '') {
                    this.search.isDateTimeTypeNameAll = true
                } else if (curVal == '1') {
                    this.search.isShowDateTime = true
                    this.search.isDateTimeTypeNameAll = false
                } else if (curVal == '2') {
                    this.search.isShowDateTime = false
                    this.search.isDateTimeTypeNameAll = false
                }
            },
        },
    }
}   
</script>

<style lang="scss" scoped>
.operationText {
    text-align: center;
}
.TextContent {
    margin-top: 10px;
}
.copys {
    margin-left: 6px;
}
</style>
