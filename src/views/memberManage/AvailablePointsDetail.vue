<template>
    <div class="app-container">
        <div class="filter-container">
            <div ref="searchToolbar" class="searchToolbar">
                <Search
                    :buttonList="buttonList"
                    :searchOptions="searchOptions"
                    @search="_getSearch"
                    @reset="_getReset"
                    @change="handleChange"
                ></Search>
            </div>
            <div class="cmyyTable">
                <Table :table="table"></Table>
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
import Table from '@/components/Table'
import Search from '@/components/Search'
import { formatDateSearch, formatDateTimes, dateToStamp, deleteBlankSpace, onlineDateTime, todayEndTime, integer, calculateTableHeight, formatSearch } from 'common/js/dom';
import { getExport, getDictsData, getPointsRecord } from 'api/interface';
export default {
    components: {
        Table,
        Search
    },
    name: "",
    props: {
        isNORMAL: {
            type: Boolean,
            default: false
        },
    },
    data() {
        let validatePoints = (rule, value, callback) => {
            setTimeout(() => {
                if (value === '') {
                    callback(new Error('积分值不能为空'));
                } else if (value == '-') {
                    callback(new Error('请修改积分值'))
                } else {
                    callback()
                }
            }, 0)
        };
        return {
            table: {
                title: [
                    {
                        label: '时间',
                        type: 'dateTime',
                        field: 'createdTime',
                    },
                    {
                        label: '类型',
                        field: 'ruleNatureName',
                    },
                    {
                        label: '渠道',
                        field: 'ruleTypeName',
                    },
                    {
                        label: '可用积分变动值',
                        field: 'ruleNatureNameAmount',
                    },
                    {
                        label: '当时剩余可用积分',
                        field: 'availableAmount',
                    },
                    {
                        label: '当时积分状态',
                        field: 'pointStateName',
                    },
                    {
                        label: '备注',
                        field: 'remark',
                    }
                ],
                tableData: [],
                totalPage: 20,
                pageSize: 20,
                pageNum: 1,
                tableLoading: false,
                tableHeight: '450px',
            },
            buttonList: [{
                name: 'export',
                type: 'primary',
                icon: 'el-icon-download',
                text: '导出',
                class: '',
                show: true,
                loading: false,
                click: this._getExport,
            }],
            searchOptions: [{
                label: '类型',
                field: 'ruleNature',
                value: '',
                type: 'select',
                options: []
            }, {
                label: '渠道',
                field: 'ruleType',
                value: '',
                type: 'select',
                options: []
            }, {
                label: '日期',
                field: 'date',
                value: [onlineDateTime(), todayEndTime()],
                type: 'datetimerange',
                fields: ['startDate', 'endDate']
            },],
            search: {}
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        this._getPointsRecord(this.table.pageNum, this.table.pageSize);
    },
    methods: {
        // 查询数据字典
        _getDictsData: function () {
            // 类型
            var paramsRuleNature = {
                isAll: true,
                code: 'RuleNature'
            }
            getDictsData(paramsRuleNature).then(res => {
                this.searchOptions.filter(item => item.field === 'ruleNature')[0].options = res.data
            })

            // 渠道
            var paramsRuleType = {
                isAll: true,
                code: 'RuleType'
            }
            getDictsData(paramsRuleType).then(res => {
                this.searchOptions.filter(item => item.field === 'ruleType')[0].options = res.data
            })
        },
        // 获取数据
        _getPointsRecord: function (pageNum, pageSize) {
            let params = this.search
            params.uid = this.$route.query.uid
            params.changedState = 'AVAILABLE'
            params.pageNum = pageNum
            params.pageSize = pageSize

            console.log(params)
            this.table.tableLoading = true
            getPointsRecord(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    res.data.data.forEach(item => {
                        if (item.ruleNatureName == '获取') {
                            item.ruleNatureNameAmount = `+${item.amount}`
                        } else {
                            item.ruleNatureNameAmount = `-${item.amount}`
                        }
                    })
                    this.table.tableData = res.data.data
                    this.table.totalPage = res.pageVO.total
                    // 需要计算table高度
                    calculateTableHeight(this)
                    window.onresize = () => {   // 缩放窗口实时计算
                        calculateTableHeight(this)
                    };
                }
            })
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
        // 查询条件重置
        _getReset: function (e) {
            this.search = e
            this._getPointsRecord(1, this.table.pageSize)
            this.$message('重置成功');
        },
        // 查询
        _getSearch: function (e) {
            this.search = e
            this._getPointsRecord(1, this.table.pageSize)
        },
        // 导出
        _getExport: function () {

        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getPointsRecord(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getPointsRecord(this.table.pageNum, this.table.pageSize);
        },
    },
    watch: {
    }
}   
</script>

<style lang="scss" scoped>
</style>
