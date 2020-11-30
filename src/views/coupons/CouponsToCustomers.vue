<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="21">
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
                        <el-form-item label="适用商品：" prop="applyProductTypesValue">
                            <el-select v-model="search.applyProductTypesValue" class="w100">
                                <el-option
                                    v-for="item in search.applyProductTypesData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="适用平台：" prop="applicationValue">
                            <el-select v-model="search.applicationValue" class="w100">
                                <el-option
                                    v-for="item in search.applicationData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="券编号：" prop="couponCode">
                            <el-input
                                v-model="search.couponCode"
                                placeholder="请输入券编号"
                                class="w150"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="券类型编号：" prop="couponTypeCode">
                            <el-input
                                v-model="search.couponTypeCode"
                                placeholder="请输入券类型编号"
                                class="w150"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="客户账号：" prop="customerId">
                            <el-input
                                v-model="search.customerId"
                                placeholder="请输入客户账号"
                                class="w150"
                                maxlength="10"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="客户名称：" prop="customerName">
                            <el-input
                                v-model="search.customerName"
                                placeholder="请输入客户名称"
                                class="w150"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="使用单号：" prop="hybrisOrderCode">
                            <el-input
                                v-model="search.hybrisOrderCode"
                                placeholder="请输入使用单号"
                                class="w150"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="兑换单号：" prop="orderCode">
                            <el-input
                                v-model="search.orderCode"
                                placeholder="请输入兑换单号"
                                class="w150"
                                @keyup.enter.native="_getSearch"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="时间类型：" prop="timeFlagName">
                            <el-select v-model="search.timeFlagName" class="w100">
                                <el-option
                                    v-for="item in search.timeFlagData"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label prop="dateTime">
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
                <el-col :span="3" class="todoWarp">
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
            <el-row :gutter="20" class>
                <el-col :span="24">
                    <div class="cmyyTable">
                        <el-table
                            :data="table.tableData"
                            stripe
                            highlight-current-row
                            v-loading="table.tableLoading"
                        >
                            <el-table-column
                                type="index"
                                :index="getIndex"
                                width="50"
                                align="center"
                            ></el-table-column>
                            <el-table-column
                                property="couponCode"
                                label="优惠券编号"
                                align="center"
                                width="150"
                            ></el-table-column>
                            <el-table-column property label="券类型编号" align="center" width="150">
                                <template slot-scope="{row}">
                                    <router-link
                                        class="mianColor routerLink"
                                        :to="{path: '/coupons/CouponsDetail', query: {couponTypeCode: row.couponTypeCode}}"
                                    >{{row.couponTypeCode}}</router-link>
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="companyName"
                                label="站点"
                                align="center"
                                width="100"
                            ></el-table-column>
                            <el-table-column property label="获取会员" align="center" width="150">
                                <template slot-scope="{row}">
                                    <router-link
                                        class="mianColor routerLink"
                                        :to="{path: '/memberManage/MemberDetail', query: {uid: row.customerId.uid}}"
                                    >{{row.customerId.uid}}</router-link>
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="customerId.customerName"
                                label="客户名称"
                                align="center"
                                width="200"
                            ></el-table-column>
                            <el-table-column
                                property="couponTypeId.gainWayName"
                                label="获取方式"
                                align="center"
                                width="150"
                            ></el-table-column>
                            <el-table-column
                                property
                                label="获取时间"
                                align="center"
                                width="150"
                                :formatter="formatterGainDateTime"
                            ></el-table-column>
                            <el-table-column
                                property
                                label="有效时间"
                                align="center"
                                width="140"
                                :formatter="formatterEffectiveDays"
                            ></el-table-column>
                            <el-table-column
                                property="statusName"
                                label="当前状态"
                                align="center"
                                width="80"
                            ></el-table-column>
                            <el-table-column
                                property="couponTypeId.deduction"
                                label="优惠金额"
                                align="center"
                                width="100"
                            ></el-table-column>
                            <el-table-column
                                property="couponTypeId.premisPrice"
                                label="起用金额"
                                align="center"
                                width="100"
                            ></el-table-column>
                            <el-table-column
                                property="couponTypeId.applyProductTypesName"
                                label="适用商品"
                                align="center"
                                width="150"
                            ></el-table-column>
                            <el-table-column
                                property="couponTypeId.application"
                                label="适用平台"
                                align="center"
                                width="100"
                            ></el-table-column>
                            <el-table-column
                                property="couponTypeId.couponTypeName"
                                label="使用描述"
                                align="center"
                                width="200"
                            ></el-table-column>
                            <el-table-column
                                property
                                label="订单时间"
                                align="center"
                                width="150"
                                :formatter="formatterDateHybrisOrderTime"
                            ></el-table-column>
                            <el-table-column property label="hybris单号" align="center" width="150">
                                <template slot-scope="{row}">{{ row.hybrisOrderCode || '--'}}</template>
                            </el-table-column>
                            <el-table-column
                                property
                                label="兑换时间"
                                align="center"
                                width="150"
                                :formatter="formatterDateOrder"
                            ></el-table-column>
                            <el-table-column property label="兑换单号" align="center" width="150">
                                <template slot-scope="{row}">
                                    <router-link
                                        class="mianColor routerLink"
                                        :to="{path: '/giftOrders/GiftOrdersDetail', query: {code: row.orderCode}}"
                                    >{{row.orderCode}}</router-link>
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
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import ButtonGroup from '@/components/ButtonGroup'
import Search from '@/components/Search'
import { formatDateSearch, formatDateTimes, dateToStamp, deleteBlankSpace, onlineDateTime, todayEndTime, formatSearch } from 'common/js/dom';
import { getDictsData, getCouponsToCustomers } from 'api/interface';

export default {
    components: {
        ButtonGroup,
        Search
    },
    name: "CouponsToCustomers",
    data() {
        return {
            table: {
                tableData: [],
                totalPage: 20,
                pageSize: 20,
                pageNum: 1,
                tableLoading: false,
            },
            search: {
                siteData: [],  // 站点数组
                siteName: '',  // 选中站点中文名
                siteValue: '', // 选中站点code

                enableData: [],
                enableName: '',
                enableValue: '',

                applyProductTypesData: [],
                applyProductTypesName: '',
                applyProductTypesValue: '',

                applicationData: [],
                applicationName: '',
                applicationValue: '',

                gainWayData: [],
                gainWayName: '',
                gainWayValue: '',

                couponCode: '',
                couponTypeCode: '',
                customerId: '',
                customerName: '',
                hybrisOrderCode: '',
                orderCode: '',

                timeFlagData: [
                    { name: '获取时间' },
                    { name: '有效时间' },
                    { name: '使用时间' },
                ],
                timeFlagName: '获取时间',
                timeFlagValue: '',
                dateTime: [onlineDateTime(), todayEndTime()],
                startTimeValue: onlineDateTime(),
                endTimeValue: todayEndTime(),
            },
            buttonList: [
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
            // status: this.search.enableValue,
            // applyProductTypes: this.search.applyProductTypesValue,
            // application: this.search.applicationValue,
            // gainWay: this.search.gainWayValue,
            // couponCode: deleteBlankSpace(this.search.couponCode),
            // couponTypeCode: deleteBlankSpace(this.search.couponTypeCode),
            // customerId: deleteBlankSpace(this.search.customerId),
            // customerName: deleteBlankSpace(this.search.customerName),
            // hybrisOrderCode: deleteBlankSpace(this.search.hybrisOrderCode),
            // orderCode: deleteBlankSpace(this.search.orderCode),  
            searchOptions: [{
                label: '站点',
                field: 'companyCode',
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
                label: '状态',
                field: 'status',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '适用商品',
                field: 'applyProductTypes',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '适用平台',
                field: 'application',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '卷编号',
                field: 'couponCode',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '卷类型编号',
                field: 'couponTypeCode',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '客户账号',
                field: 'customerId',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '客户名称',
                field: 'customerName',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '时间类型',
                field: 'timeFlag',
                value: '获取时间',
                type: 'select',
                options: [{ name: '获取时间', value: '获取时间' },
                { name: '有效时间', value: '有效时间' },
                { name: '使用时间', value: '使用时间' },],
            },
            {
                label: '',
                field: 'date',
                value: [onlineDateTime(), todayEndTime()],
                type: 'datetimerange',
                fields: ['startDate', 'endDate'],
            }, {
                label: '兑换单号',
                field: 'orderCode',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '使用单号',
                field: 'hybrisOrderCode',
                value: '',
                type: 'input',
                options: [],
            }
            ],
            newSearch: {},

        }
    },
    created() {
        this.newSearch = formatSearch(this.searchOptions)
        this._getDictsData()
        this._getCouponsToCustomers(this.table.pageNum, this.table.pageSize);
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
                this.searchOptions.filter(item => item.field === 'companyCode')[0].options = res.data
                this.search.siteData = res.data
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

            // 状态
            var paramsEnableDisable = {
                isAll: true,
                code: 'CouponsToCustomersStatus'
            }
            getDictsData(paramsEnableDisable).then(res => {
                this.searchOptions.filter(item => item.field === 'status')[0].options = res.data
                this.search.enableData = res.data
                this.loading = false
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

        },
        // 获取表格数据
        _getCouponsToCustomers: function (pageNum, pageSize) {
            // var params = {
            //     companyCode: this.search.siteValue,
            //     status: this.search.enableValue,
            //     applyProductTypes: this.search.applyProductTypesValue,
            //     application: this.search.applicationValue,
            //     gainWay: this.search.gainWayValue,
            //     couponCode: deleteBlankSpace(this.search.couponCode),
            //     couponTypeCode: deleteBlankSpace(this.search.couponTypeCode),
            //     customerId: deleteBlankSpace(this.search.customerId),
            //     customerName: deleteBlankSpace(this.search.customerName),
            //     hybrisOrderCode: deleteBlankSpace(this.search.hybrisOrderCode),
            //     orderCode: deleteBlankSpace(this.search.orderCode),
            //     timeFlag: this.search.timeFlagName,
            //     startTimeValue: this.search.startTimeValue,
            //     endTimeValue: this.search.endTimeValue,
            //     pageNum: pageNum,
            //     pageSize: pageSize,
            //     export: false,
            //     nameStr: '',
            //     fieldStr: '',
            // }
            var params = {
                companyCode: this.newSearch.companyCode,
                status: this.newSearch.status,
                applyProductTypes: this.newSearch.applyProductTypes,
                application: this.newSearch.application,
                gainWay: this.newSearch.gainWay,
                couponCode: this.newSearch.couponCode,
                couponTypeCode: this.newSearch.couponTypeCode,
                customerId: this.newSearch.customerId,
                customerName: this.newSearch.customerName,
                hybrisOrderCode: this.newSearch.hybrisOrderCode,
                orderCode: this.newSearch.orderCode,
                timeFlag: this.newSearch.timeFlag,
                startTimeValue: this.newSearch.startTimeValue,
                endTimeValue: this.newSearch.endTimeValue,
                pageNum: pageNum,
                pageSize: pageSize,
                export: false,
                nameStr: '',
                fieldStr: '',
            }
            console.log(this.newSearch)
            // console.log(params)
            this.table.tableLoading = true
            getCouponsToCustomers(params).then(res => {
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
                status: this.search.enableValue,
                applyProductTypes: this.search.applyProductTypesValue,
                application: this.search.applicationValue,
                gainWay: this.search.gainWayValue,
                couponCode: deleteBlankSpace(this.search.couponCode),
                couponTypeCode: deleteBlankSpace(this.search.couponTypeCode),
                customerId: deleteBlankSpace(this.search.customerId),
                customerName: deleteBlankSpace(this.search.customerName),
                hybrisOrderCode: deleteBlankSpace(this.search.hybrisOrderCode),
                orderCode: deleteBlankSpace(this.search.orderCode),
                timeFlag: this.search.timeFlagName,
                startTimeValue: this.search.startTimeValue,
                endTimeValue: this.search.endTimeValue,
                pageNum: '',
                pageSize: '',
                export: true,
                nameStr: '优惠券编号,券类型编号,站点,获取会员,客户名称,获取方式,获取时间,有效时间,当前状态,优惠金额,起用金额,适用商品,适用平台,使用描述,订单时间,hybris单号,兑换时间,兑换单号',
                fieldStr: 'couponCode,couponTypeCode,companyName,customerId.uid,customerId.customerName,couponTypeId.gainWayName,gainDate,effectiveDays,statusName,couponTypeId.deduction,couponTypeId.premisPrice,couponTypeId.applyProductTypesName,couponTypeId.application,couponTypeId.couponTypeName,hybrisOrderTime,hybrisOrderCode,orderTime,orderCode',
            }

            //站点 (companyName)   获取会员(customerId.uid) 客户名称(customerId.customerName) 获取方式(couponTypeId.gainWayName) 有效时间(effectiveDays) 当前状态(statusName)  优惠金额(couponTypeId.deduction) 起用金额(couponTypeId.premisPrice) 适用商品(couponTypeId.applyProductTypesName)  适用平台(couponTypeId.application)  使用描述(couponTypeId.couponTypeName)

            window.location.href = getCouponsToCustomers(params)
        },
        // 查询条件重置
        resetSearchForm: function (formName) {
            this.$refs[formName].resetFields();
            this.search.startTimeValue = this.search.dateTime[0]
            this.search.endTimeValue = this.search.dateTime[1]
            this._getCouponsToCustomers(1, this.table.pageSize)
            this.$message('重置成功');
        },
        // 查询
        _getSearch: function () {
            this._getCouponsToCustomers(1, this.table.pageSize)
        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getCouponsToCustomers(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getCouponsToCustomers(this.table.pageNum, this.table.pageSize);
        },
        //分页序号
        getIndex: function (index) {
            return (this.table.pageNum - 1) * this.table.pageSize + index + 1
        },
        // 格式化日期--获取时间
        formatterGainDateTime: function (row, column) {
            if (row.gainDate) {
                var gainDateTime = formatDateTimes(row.gainDate)
                return gainDateTime
            } else {
                return '--'
            }
        },
        // 格式化日期--有效时间
        formatterEffectiveDays: function (row) {
            var effectiveDays = ''
            if (row.couponTypeId.effectiveFlag) {
                effectiveDays = "从客户获取起 " + row.couponTypeId.effectiveDays + " 天内"
            } else {
                effectiveDays = formatDateTimes(row.couponTypeId.effectiveStartTime) + ' -- ' + formatDateTimes(row.couponTypeId.effectiveEndTime)
            }

            return effectiveDays
        },
        // 格式化日期--兑换时间
        formatterDateHybrisOrderTime: function (row, column) {
            if (row.hybrisOrderTime) {
                return formatDateTimes(row.hybrisOrderTime)
            } else {
                return '--'
            }
        },
        // 格式化日期--订单时间
        formatterDateOrder: function (row, column) {
            if (row.orderTime) {
                return formatDateTimes(row.orderTime)
            } else {
                return '--'
            }
        },
        // 跳转页面(新增、查看、编辑)
        routerLinkPage: function (index) {
            this.$router.push(index)
        },

        // 返回上一层             
        back() {
            this.$router.go(-1);
        },
    },
    watch: {
        search: {  // 监听对象值的改变
            handler(curVal, oldVal) {
                this.search.startTimeValue = formatDateSearch(new Date(curVal.dateTime[0]), 'yyyy-MM-dd hh:mm:ss')
                this.search.endTimeValue = formatDateSearch(new Date(curVal.dateTime[1]), 'yyyy-MM-dd hh:mm:ss')
            },
            deep: true,
        }
    }
}   
</script>

<style lang="scss" scoped>
</style>
