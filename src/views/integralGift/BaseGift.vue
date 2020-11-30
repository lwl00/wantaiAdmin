<template>
    <div class="app-container">
        <div class="filter-container">
            <div ref="searchToolbar" class="searchToolbar">
                <Search
                    :buttonList="buttonList"
                    :searchOptions="searchOptions"
                    @search="_getSearch"
                    @reset="resetSearchForm"
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

        <!--======== 以下是弹出层 ========-->
    </div>
</template>

<script type="text/ecmascript-6">
import Table from '@/components/Table'
import Search from '@/components/Search'
import Dialog from 'base/Dialog';
import { formatDate, today, dateToStamp, deleteBlankSpace, formatSearch, calculateTableHeight, routerLinkPage, tableBtnPermissions, uploadDataNoRepeat } from 'common/js/dom';
import { getDictsData, getBaseGift, } from 'api/interface';
export default {
    components: {
        Table,
        Search,
        'dialogModel': Dialog,
    },
    name: "BaseGift",
    data() {
        return {
            table: {
                title: [
                    {
                        label: '商品编号',
                        field: 'productCode',
                        type: 'link',
                        click: this.handleDblclick,
                        width: 150
                    },
                    {
                        label: '商品名称',
                        field: 'productName',
                        width: 250,
                    },
                    {
                        label: '规格',
                        field: 'specifications',
                        width: 250
                    },
                    {
                        label: '生产厂家',
                        field: 'ean',
                    },
                    {
                        label: '是否关联积分礼品',
                        field: 'relevanceName',
                        width: 150
                    },
                    {
                        label: '操作',
                        field: '',
                        width: 200,
                        type: 'operat',
                        options: [
                            { name: '查看', type: 'view', show: true },
                            // { name: '编辑', type: 'update', show: true, click: this.handleUpdate }
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
            buttonList: [
                {
                    name: 'add',
                    type: 'primary',
                    icon: 'el-icon-circle-plus-outline',
                    text: '新增',
                    class: '',
                    show: false,       //根据权限来显示
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
            searchOptions: [{
                label: '商品编号',
                field: 'productCode',
                value: '',
                type: 'inputImport',
                fileList: [],
                uploadSuccess: this.handleSuccessUid,
            }, {
                label: '商品名称',
                field: 'productName',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '生产厂家',
                field: 'ean',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '关联积分礼品',
                field: 'relevance',
                value: '0',
                type: 'select',
                options: [],
            }],
            search: {},
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        this.getPermissions()
        this._getBaseGift(this.table.pageNum, this.table.pageSize)
    },
    mounted() {

    },
    methods: {
        // 获取礼品类型
        _getDictsData: function () {
            //是否关联  （管理积分礼品）
            var relevanceParams = {
                isAll: false,
                code: 'Relevance'
            }
            getDictsData(relevanceParams).then(res => {
                this.searchOptions.filter(item => item.field === 'relevance')[0].options = res.data
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
        },
        // 获取列表数据
        _getBaseGift: function (pageNum, pageSize) {
            console.log(this.search)
            let params = this.search
            params.pageNum = pageNum
            params.pageSize = pageSize
            this.table.tableLoading = true
            getBaseGift(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
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
        resetSearchForm: function (e) {
            this.search = e
            this._getBaseGift(1, this.table.pageSize)
            this.$message('重置成功');
        },
        // 查询
        _getSearch: function (e) {
            this.search = e
            this._getBaseGift(1, this.table.pageSize)
        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getBaseGift(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getBaseGift(this.table.pageNum, this.table.pageSize);
        },
        //分页序号
        getIndex: function (index) {
            return (this.table.pageNum - 1) * this.table.pageSize + index + 1
        },
        // 导出
        _getExport: function () {
            let params = this.search
            params.giftTypeCode = ''
            params.pageNum = ''
            params.pageSize = ''
            params.export = true
            params.nameStr = '礼品编号,礼品类型,礼品名称'
            params.fieldStr = 'giftCode,giftTypeName,giftName'
            // //giftTypeName 导出有问题

            window.location.href = getBaseGift(params)
        },
        handleAdd: function () {
            this.$router.push('/integralGift/BaseGiftAdd')
        },
        handleDblclick(row) {
            let query = {
                id: row.id
            }
            routerLinkPage(this, 'BaseGiftDetail', query)
        },
        //编辑跳转
        handleUpdate(row, option) {
            let query = {
                id: row.id
            }
            routerLinkPage(this, 'BaseGiftEdit', query)
        },
        // 上传成功
        handleSuccessUid(response, file, fileList) {
            this.$message({
                message: file.name + '上传成功',
                type: 'success'
            })
            this.searchOptions.filter(item => item.field === 'productCode')[0].value = uploadDataNoRepeat(this, response.data)
        },
    }
}

</script>

<style type="text/css" media="screen">
.addDialog-model .el-form-item__content {
    text-align: left;
    font-size: 12px;
}
</style>
<style lang="scss" scoped>
</style>