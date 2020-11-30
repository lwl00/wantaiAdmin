<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="24">
                    <el-form :inline="true" class="searchWarp" size="medium">
                        <el-form-item label="历史兑换数量：">{{amountSum}}人次</el-form-item>
                        <el-form-item label="历史兑换消耗积分：">{{pointSum}}分</el-form-item>
                    </el-form>
                </el-col>
            </el-row>
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
import Table from '@/components/Table'
import Search from '@/components/Search'
import { formatDateTimes, deleteBlankSpace, dataToString, onlineDateTime, todayEndTime, routerLinkPage, formatSearch, calculateTableHeight } from 'common/js/dom';
import { getGiftForRecord } from 'api/interface';

export default {
    components: {
        Table,
        Search
    },
    name: "ForRecord",
    data() {
        return {
            table: {
                title: [
                    {
                        label: '时间',
                        type: 'dateTime',
                        field: 'createdTime',
                    },
                    {
                        label: '兑换客户账号',
                        field: 'uid',
                    },
                    {
                        label: '兑换客户名称',
                        field: 'customerName',
                    },
                    {
                        label: '兑换客户端',
                        field: 'browseClientName',
                    },
                    {
                        label: '积分单价',
                        field: 'point',
                    },
                    {
                        label: '兑换数量',
                        field: 'amount',
                    },
                    {
                        label: '兑换礼品单号',
                        field: 'giftOrderCode',
                        type: 'link',
                        click: this.handleDblclick
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
                label: '客户账号',
                field: 'uid',
                value: '',
                type: 'input',
            }, {
                label: '客户名称',
                field: 'customerName',
                value: '',
                type: 'input',
            }, {
                label: '订单号',
                field: 'giftOrderCode',
                value: '',
                type: 'input',
            }, {
                label: '有效期',
                field: 'date',
                value: [onlineDateTime(), todayEndTime()],
                type: 'datetimerange',
                fields: ['startDate', 'endDate']
            }],
            search: {},

            pointSum: 0,   //兑换积分
            amountSum: 0,  //兑换数量
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        this._getGiftForRecord(this.table.pageNum, this.table.pageSize)
    },
    methods: {
        _getGiftForRecord: function (pageNum, pageSize) {
            let params = this.search
            params.giftId = this.$route.query.id
            params.client = ''
            params.pageNum = pageNum
            params.pageSize = pageSize
            this.table.tableLoading = true
            getGiftForRecord(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    this.table.tableData = res.data.data
                    this.table.totalPage = res.pageVO.total
                    this.amountSum = res.data.amountSum
                    this.pointSum = res.data.pointSum
                    // 需要计算table高度
                    calculateTableHeight(this)
                    window.onresize = () => {   // 缩放窗口实时计算
                        calculateTableHeight(this)
                    };
                }
            })
        },
        // 导出
        _getExport: function () {
            let params = this.search
            params.giftId = this.$route.query.id
            params.client = ''
            params.pageNum = pageNum
            params.pageSize = pageSize
            params.export = true
            params.nameStr = '时间,兑换客户账号,兑换客户名称,兑换客户端,积分单价,兑换数量,兑换礼品单号'
            params.fieldStr = 'createdTime,uid,customerName,browseClientName,point,amount,giftOrderCode'

            //兑换客户端(导出没有值)

            window.location.href = getGiftForRecord(params)
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
        //分页
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getGiftForRecord(this.table.pageNum, this.table.pageSize)
        },
        //当前页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getGiftForRecord(this.table.pageNum, this.table.pageSize)
        },
        //转换时间值
        formatterDate: function (row, column) {
            return formatDateTimes(row.createdTime)
        },
        //跳到礼品订单详情
        getOrdersDetail: function (index, row) {
            this.$router.push({
                path: index,
                query: {
                    code: row.giftOrderCode
                }
            })
        },
        //查询
        _getSearch: function (e) {
            this.search = e
            this._getGiftForRecord(1, this.table.pageSize)
        },
        //重置
        _getReset: function (e) {
            this.search = e
            // this.$refs[formName].resetFields()
            this._getGiftForRecord(1, this.table.pageSize)
            this.$message('重置成功')
        },
        // 双击行
        handleDblclick(row) {
            let query = {
                code: row.giftOrderCode
            }
            routerLinkPage(this, 'GiftOrdersDetail', query)
        },
    },
    watch: {
    }
}
</script>

<style lang="scss" scoped>
</style>