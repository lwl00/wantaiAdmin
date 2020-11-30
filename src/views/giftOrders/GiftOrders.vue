<template>
    <div class="app-container">
        <div class="filter-container">
            <div ref="searchToolbar" class="searchToolbar">
                <Search
                    :buttonList="buttonList"
                    :searchOptions="searchOptions"
                    @search="handleSearch"
                    @reset="handleReset"
                    @change="handleChange"
                ></Search>
            </div>

            <div class="cmyyTable">
                <Table :table="table" @dblclick="handleDblclick"></Table>
            </div>

            <div ref="cmyyPpagination" class="cmyyPpaginationWarp">
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
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Search from '@/components/Search'
import Table from '@/components/Table'
import { onlineMonthDateTime, todayEndTime, formatDateTimes, dataToString, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage } from 'common/js/dom';
import { getDictsData, getOrderList } from 'api/interface';

export default {
    name: "GiftOrders",
    components: {
        Search,
        Table,
    },
    data() {
        return {
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
                },
            ],
            searchOptions: [
                {
                    label: '站点',
                    field: 'companyCode',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '订单状态',
                    field: 'status',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '下单平台',
                    field: 'application',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '',
                    field: 'selectInput',
                    value: ['01', ''],
                    type: 'selectWithInput',
                    fields: ['codeType', 'codeValue'],
                    options: [
                        { name: '电商单号', value: '01' },
                        { name: '客户ID', value: '02' },
                        { name: '客户名称', value: '03' },
                        { name: 'ERP编号', value: '04' },
                    ],
                    placeholder: '电商单号',
                },
                {
                    label: '创建时间',
                    field: 'date',
                    value: [onlineMonthDateTime(), todayEndTime()],
                    type: 'datetimerange',
                    fields: ['creatStartTime', 'creatEndTime'],
                },
            ],
            search: {},
            isAddPermission: false,  // 新增按钮权限
            isEditPermission: false,  // 编辑按钮权限
            isDeletePermission: false,  // 删除按钮权限

            table: {
                title: [
                    {
                        label: '电商单号',
                        field: 'code',
                        type: 'link',
                        click: this.handleDblclick,
                        width: 150,
                    },
                    {
                        label: 'ERP单号',
                        field: 'erpCode',
                    },
                    {
                        label: '订单状态',
                        field: 'statusName',
                    },
                    {
                        label: '下单平台',
                        field: 'application',
                    },
                    {
                        label: '客户账号',
                        field: 'uid',
                        type: 'link',
                        click: this.handleDblclick,
                    },
                    {
                        label: '客户名称',
                        field: 'customerName',
                        width: 200,
                    },
                    {
                        label: '订单积分',
                        field: 'point',
                    },
                    {
                        label: '创建时间',
                        field: 'createdTime',
                        type: 'dateTime',
                        width: 150,
                    },
                    {
                        label: '操作',
                        field: '',
                        type: 'operat',
                        options: [
                            { name: '查看', type: 'view', show: true },
                        ],
                    },
                ],
                tableData: [],
                totalPage: 20,
                pageSize: 20,
                pageNum: 1,
                tableLoading: false,
                tableHeight: '450px',
            },
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        // this.getPermissions()  // 无按钮权限
        this._getOrderList(this.table.pageNum, this.table.pageSize)
    },

    methods: {
        //加载数据字典
        _getDictsData: function () {
            // 站点
            var paramsSite = {
                isAll: true,
                code: 'CompanyCode'
            }
            getDictsData(paramsSite).then(res => {
                if (res.status == 200) {
                    this.searchOptions.filter(item => item.field === 'companyCode')[0].options = res.data
                }
            })
            // 订单状态
            var paramsOrder = {
                isAll: true,
                code: 'OrderStatus'
            }
            getDictsData(paramsOrder).then(res => {
                if (res.status == 200) {
                    this.searchOptions.filter(item => item.field === 'status')[0].options = res.data
                }
            })
            // 下单平台
            var paramsApplication = {
                isAll: true,
                code: 'OrderApplication'
            }
            getDictsData(paramsApplication).then(res => {
                if (res.status == 200) {
                    this.searchOptions.filter(item => item.field === 'application')[0].options = res.data
                }
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = permissionsBtnArr.includes("order:orders:create")     // 无新增功能

            // 表格按钮权限
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("order:orders:update"))   // 无编辑功能
            tableBtnPermissions(this.table.title, 'delete', permissionsBtnArr.includes("order:orders:delete"))   // 无删除功能
        },
        // 获取表格数据
        _getOrderList: function (pageNum, pageSize) {
            console.log(this.search)
            var params = this.search
            params.pageNum = pageNum,
                params.pageSize = pageSize,

                this.table.tableLoading = true
            getOrderList(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    let data = res.data
                    data.forEach((item, index) => {
                        // item.uid = item.customer.uid
                        // item.customerName = item.customer.customerName
                    })
                    this.table.tableData = data
                    this.table.totalPage = res.pageVO.total

                    // 需要计算table高度
                    calculateTableHeight(this)
                    window.onresize = () => {   // 缩放窗口实时计算
                        calculateTableHeight(this)
                    };
                }
            })
        },
        // 查询
        handleSearch(e) {
            this.search = e
            this._getOrderList(1, this.table.pageSize);
        },
        // 查询-重置
        handleReset(e) {
            this.search = e
            this._getOrderList(1, this.table.pageSize);
            this.$message('重置成功');
        },
        // 查询条件是否展开
        handleChange(e) {
            var _this = this
            this.$nextTick(function () {
                setTimeout(function () {
                    calculateTableHeight(_this)
                }, 500)
            })
        },
        // 导出
        _getExport: function () {
            let params = this.search
            params.pageNum = ''
            params.pageSize = ''
            params.export = true
            params.nameStr = '电商单号,ERP单号,订单状态,下单平台,订单积分,创建时间',
                params.fieldStr = 'code,erpCode,statusName,application,point,createdTime',

                // 暂时屏蔽客户账号,客户名称(customer.uid,customer.customerName)
                // params.nameStr = '电商单号,ERP单号,订单状态,下单平台,客户账号,客户名称,订单积分,创建时间',
                // params.fieldStr = 'code,erpCode,statusName,application,customer.uid,customer.customerName,point,createdTime',

                window.location.href = getOrderList(params)
        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getOrderList(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getOrderList(this.table.pageNum, this.table.pageSize);
        },
        // 双击行
        handleDblclick(row) {
            let query = {
                code: row.code
            }
            routerLinkPage(this, 'GiftOrdersDetail', query)
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
