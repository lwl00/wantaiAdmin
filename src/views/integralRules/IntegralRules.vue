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
import ButtonGroup from '@/components/ButtonGroup'
import Search from '@/components/Search'
import Table from '@/components/Table'
import { formatDateTimes, today, dateToStamp, deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage } from 'common/js/dom';
import { getExport, getDictsData, getPointRule } from 'api/interface';
import Dialog from 'base/Dialog';

export default {
    components: {
        'dialogModel': Dialog,
        ButtonGroup,
        Search,
        Table,
    },
    name: "integralRules",
    data() {
        return {
            buttonList: [
                {
                    name: 'add',
                    type: 'primary',
                    icon: 'el-icon-edit',
                    text: '新增',
                    class: '',
                    show: false,
                    loading: false,
                    click: this.handleAdd
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
                },
            ],
            searchOptions: [
                {
                    label: '类型',
                    field: 'ruleType',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '站点',
                    field: 'companyCode',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '状态',
                    field: 'enable',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '性质',
                    field: 'ruleNature',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '规则说明',
                    field: 'ruleDesc',
                    value: '',
                    type: 'input',
                },
                {
                    label: '规则编号',
                    field: 'serialNumber',
                    value: '',
                    type: 'input',
                },
            ],
            search: {},
            isAddPermission: false,  // 新增按钮权限
            isEditPermission: false,  // 编辑按钮权限
            isDeletePermission: false,  // 删除按钮权限

            table: {
                title: [
                    {
                        label: '规则编号',
                        field: 'serialNumber',
                        width: 170,
                        type: 'link',
                        click: this.handleDblclick
                    },
                    {
                        label: '规则说明',
                        field: 'ruleDesc',
                        width: 200,
                    },
                    {
                        label: '规则类型',
                        field: 'ruleTypeName',
                    },
                    {
                        label: '规则性质',
                        field: 'ruleNatureName',
                    },
                    {
                        label: '站点',
                        field: 'companyName',
                        width: 80
                    },
                    {
                        label: '积分变动值',
                        field: 'fixedShow',
                        width: 120,
                    },
                    {
                        label: '周期范围',
                        field: 'cycleName',
                    },
                    {
                        label: '周期内获取/消耗上限',
                        field: 'limitValueShow',
                    },
                    {
                        label: '生效开始时间',
                        field: 'enableStartDate',
                        width: 150,
                        type: 'dateTime',
                    },
                    {
                        label: '生效结束时间',
                        field: 'enableEndDate',
                        width: 150,
                        type: 'dateTime',
                    },
                    {
                        label: '规则状态',
                        field: 'enableName',
                        width: 80,
                    },
                    {
                        label: '操作',
                        field: '',
                        type: 'operat',
                        options: [
                            { name: '查看', type: 'view', show: true },
                            { name: '编辑', type: 'update', show: true, click: this.handleUpdate },
                        ]
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
        this.getPermissions()
        this._getPointRule(this.table.pageNum, this.table.pageSize);
    },
    mounted() {

    },
    methods: {
        // 查询数据字典
        _getDictsData: function () {
            // 类型
            var paramsRuleType = {
                isAll: true,
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
                this.searchOptions.filter(item => item.field === 'ruleType')[0].options = res.data
            })

            // 站点
            var paramsSite = {
                isAll: true,
                code: 'CompanyCode'
            }
            getDictsData(paramsSite).then(res => {
                this.searchOptions.filter(item => item.field === 'companyCode')[0].options = res.data
            })

            // 规则状态
            var paramsEnableDisable = {
                isAll: true,
                code: 'EnableDisable'
            }
            getDictsData(paramsEnableDisable).then(res => {
                this.searchOptions.filter(item => item.field === 'enable')[0].options = res.data
                this.loading = false
            })

            // 规则性质
            var paramsRuleNature = {
                isAll: true,
                code: 'RuleNature'
            }
            getDictsData(paramsRuleNature).then(res => {
                this.searchOptions.filter(item => item.field === 'ruleNature')[0].options = res.data
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            var permissionsMenuArr = localStorage.getItem("permissionsMenu");
            this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = permissionsBtnArr.includes("point:pointRule:")

            // 表格按钮权限
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("point:pointRule:update"))
        },
        // 获取表格数据
        _getPointRule: function (pageNum, pageSize) {
            var params = this.search
            params.pageNum = pageNum,
                params.pageSize = pageSize,

                this.table.tableLoading = true
            getPointRule(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    let data = res.data.data
                    data.forEach((item, index) => {
                        item.limitValueShow = item.limitValue ? (item.limitType == 'FIXEDTIME' ? item.limitValue + '次' : item.limitValue + '积分') : '不限'
                        item.fixedShow = (item.fixedPoint ? (item.fixedPoint > 0 ? '+' + item.fixedPoint + '分' : item.fixedPoint + '分') : '--') + (item.fixedMoney ? ' / ' + item.fixedMoney + '元' : '')

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
            this._getPointRule(1, this.table.pageSize);
        },
        // 查询-重置
        handleReset(e) {
            this.search = e
            this._getPointRule(1, this.table.pageSize);
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
            params.nameStr = '规则编号,规则说明,规则性质,所属站点,是否固定,固定积分,固定金额,周期范围,周期内获取/消耗上限,固定次数/积分,生效时间',
                params.fieldStr = 'serialNumber,ruleDesc,ruleNature,companyCode,fixed,fixedPoint,fixedMoney,cycle,limitType,limitValue,enableStartDate',

                window.location.href = getPointRule(params)
        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getPointRule(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getPointRule(this.table.pageNum, this.table.pageSize);
        },
        // 新增
        handleAdd(index, row) {
            let query = {}
            routerLinkPage(this, 'IntegralRulesAdd', query)
        },
        // 双击行
        handleDblclick(row) {
            let query = {
                id: row.id
            }
            routerLinkPage(this, 'IntegralRulesDetail', query)
        },
        // 编辑
        handleUpdate(row, option) {
            let query = {
                id: row.id
            }
            routerLinkPage(this, 'IntegralRulesEdit', query)
        },
    },
    watch: {

    }
}

</script>

<style lang="scss" scoped>
</style>
