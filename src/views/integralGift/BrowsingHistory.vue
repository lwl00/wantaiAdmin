<template>
    <div class="app-container">
        <div class="filter-container">
            <div class="hostoryText">历史浏览量：{{browseTotal}}</div>
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
import { formatDateTimes, deleteBlankSpace, dataToString, onlineDateTime, todayEndTime, formatSearch, calculateTableHeight } from 'common/js/dom';
import { getGiftBrowse } from 'api/interface';
export default {
    components: {
        Table,
        Search
    },
    name: "BrowsingHistory",
    data() {
        return {
            browseTotal: 0,    //历史浏览
            recordForm: {
                enableDate: '',
                customerName: '',
                uid: '',
                enableDate: [onlineDateTime(), todayEndTime()],
                startDate: onlineDateTime(),
                endDate: todayEndTime()
            },
            table: {
                title: [
                    {
                        label: '时间',
                        type: 'dateTime',
                        field: 'createdTime',
                    },
                    {
                        label: '浏览账号',
                        field: 'uid',
                    },
                    {
                        label: '客户名称',
                        field: 'customerName',
                    },
                    {
                        label: '浏览客户端',
                        field: 'clientName',
                    }
                ],
                tableData: [],
                totalPage: 20,
                pageSize: 20,
                pageNum: 1,
                tableLoading: false,
                tableHeight: '450px',
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
            searchOptions: [{
                label: '有效期',
                field: 'date',
                value: [onlineDateTime(), todayEndTime()],
                type: 'datetimerange',
                fields: ['startDate', 'endDate']
            }, {
                label: '客户名称',
                field: 'customerName',
                value: '',
                type: 'input',
            }, {
                label: '客户ID',
                field: 'uid',
                value: '',
                type: 'input',
            }],
            search: {},
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        //console.log(this.$route.query.id)
        this._getGiftBrowse(this.table.pageNum, this.table.pageSize)
    },
    methods: {
        _getGiftBrowse: function (pageNum, pageSize) {
            let params = this.search
            params.giftId = this.$route.query.id
            params.client = ''
            params.pageNum = pageNum
            params.pageSize = pageSize
            console.log(params)
            this.table.tableLoading = true
            getGiftBrowse(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    this.table.tableData = res.data.data
                    this.table.totalPage = res.pageVO.total
                    this.browseTotal = res.data.browseTotal
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
            params.pageNum = ''
            params.pageSize = ''
            params.export = true
            params.nameStr = '时间,浏览账号,客户名称,浏览客户端'
            params.fieldStr = 'createdTime,uid,customerName,clientName'
            //浏览客户端(导出没有值)

            window.location.href = getGiftBrowse(params)
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
            this._getGiftBrowse(this.table.pageNum, this.table.pageSize)
        },
        //当前页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getGiftBrowse(this.table.pageNum, this.table.pageSize)
        },
        //转换时间值
        formatterDate: function (row, column) {
            return formatDateTimes(row.createdTime)
        },
        //查询
        _getSearch: function (e) {
            this.search = e
            this._getGiftBrowse(1, this.table.pageSize)
        },
        //重置
        _getReset: function (e) {
            // this.$refs[formName].resetFields()
            this.search = e
            this._getGiftBrowse(1, this.table.pageSize)
            this.$message('重置成功')
        }
    },
    //监听函数
    watch: {
        'recordForm.enableDate': {
            handler(curVal, oldVal) {
                this.recordForm.startDate = formatDateTimes(curVal[0])
                this.recordForm.endDate = formatDateTimes(curVal[1])
            },
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
.hostoryText {
    color: #666;
    font-size: 16px;
    margin-bottom: 20px;
}
.el-tabs__content {
    padding: 0;
}
</style>