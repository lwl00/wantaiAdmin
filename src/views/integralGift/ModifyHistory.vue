<template>
    <div class="app-container">
        <div class>
            <el-button
                type="primary"
                icon="el-icon-download"
                size="small"
                class="pull-right marB"
                @click="_getExport"
            >导出excel</el-button>
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
import { formatDateTimes } from 'common/js/dom';
import { getGiftModify } from 'api/interface'
export default {
    components: {
        Table
    },
    name: "ModifyHistory",
    data() {
        return {
            table: {
                title: [
                    {
                        label: '修改时间',
                        type: 'dateTime',
                        field: 'modifiedTime',
                        width: 150
                    },
                    {
                        label: '修改人',
                        field: 'modifier',
                        width: 100
                    },
                    {
                        label: '修改内容',
                        field: 'content',
                    }
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
        this._getGiftModify(this.table.pageNum, this.table.pageSize)
    },
    methods: {
        _getGiftModify: function (pageNum, pageSize) {
            let params = {
                giftId: this.$route.query.id,
                username: '',
                name: '',
                startDate: '',
                endDate: '',
                pageNum: pageNum,
                pageSize: pageSize,
                export: false,
                nameStr: '',
                fieldStr: '',
            }
            //console.log(params)
            this.table.tableLoading = true
            getGiftModify(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    this.table.tableData = res.data
                    this.table.totalPage = res.pageVO.total
                    // 需要计算table高度
                    this.calculateTableHeight(this)
                    window.onresize = () => {   // 缩放窗口实时计算
                        this.calculateTableHeight(this)
                    };
                }
            })
        },
        calculateTableHeight(_this) {
            var homePageHeight = document.body.clientHeight
            var cmyyPpaginationHeight = _this.$refs.cmyyPpagination.offsetHeight
            _this.table.tableHeight = homePageHeight - cmyyPpaginationHeight - 192
        },
        // 导出
        _getExport: function () {
            var params = {
                giftId: this.$route.query.id,
                username: '',
                name: '',
                startDate: '',
                endDate: '',
                pageNum: '',
                pageSize: '',
                export: true,
                nameStr: '修改时间,修改人,修改内容',
                fieldStr: 'modifiedTime,modifier,content',
            }

            //兑换客户端(导出没有值)

            window.location.href = getGiftModify(params)
        },
        //分页
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getGiftModify(this.table.pageNum, this.table.pageSize)
        },
        //当前页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getGiftModify(this.table.pageNum, this.table.pageSize)
        },
        //转换时间值
        formatterDate: function (row, column) {
            return formatDateTimes(row.modifiedTime)
        },
    }
}
</script>

<style lang="scss" scoped>
.marB {
    margin-bottom: 20px;
}
</style>