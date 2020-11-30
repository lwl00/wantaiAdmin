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

        <!-- 批量导入黑名单 -->
        <dialogModel
            class="check-model successDialog"
            ref="batch-gift-model"
            title="批量导入积分会员名单"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <el-upload
                    name="file"
                    class="upload-demo"
                    :action="customerImportAPPOINTAction"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :file-list="batchForm.fileList1"
                    :on-success="handleSuccesBatch"
                    :on-error="handleErrorBatch"
                    :on-change="handleFileChange"
                    width="200px"
                    :multiple="false"
                >
                    批量导入积分会员名单：
                    <el-button size="small" type="primary">点击上传</el-button>
                    <span slot="tip" class="el-upload__tip"></span>
                </el-upload>
                <!--  v-if="batchForm.batchData" -->
                <div class="tipContent" v-if="batchForm.batchData">
                    <p>
                        成功导入积分会员：
                        <span class="mianColor">{{batchForm.batchData.importNumSucc}}</span>&nbsp;名
                    </p>
                    <p>
                        导入失败：
                        <span class="errorColor">{{batchForm.batchData.importNumFail}}</span>&nbsp;名
                    </p>
                    <p v-if="batchForm.batchData.failLine">
                        导入失败行：第
                        <span class="errorColor">{{batchForm.batchData.failLine}}</span>&nbsp;行
                    </p>
                    <i
                        class="tip-fail errorColor"
                        v-if="batchForm.batchData.failLine"
                    >请检查并修正失败行后，重新导入失败行数据</i>
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogBatchHide('batch-gift-model')">知道了</el-button>
            </div>
        </dialogModel>
    </div>
</template>

<script type="text/ecmascript-6">
import Search from '@/components/Search'
import Table from '@/components/Table'
import Dialog from 'base/Dialog'
import { getUserList, getDictsData, customerImportAPPOINTAction, getNotGetPointOrder } from 'api/interface';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage } from 'common/js/dom';

export default {
    components: {
        Search,
        Table,
        'dialogModel': Dialog,
    },
    name: "Member",
    data() {
        return {
            buttonList: [
                {
                    name: 'add',
                    type: '',
                    icon: '',
                    text: '未获得积分订单生成流水',
                    class: '',
                    show: true,
                    loading: false,
                    click: this._getNotGetPointOrder,
                },
                {
                    name: 'add',
                    type: 'primary',
                    icon: '',
                    text: '批量导入积分会员名单',
                    class: '',
                    show: true,
                    loading: false,
                    click: this.batchGiftShow,
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
            searchOptions: [
                {
                    label: '客户账号',
                    field: 'uid',
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
                    label: '站点',
                    field: 'companyCode',
                    value: '',
                    type: 'select',
                    options: [],
                }, {
                    label: '客户组',
                    field: 'customerGroup',
                    value: '',
                    type: 'select',
                    options: [],
                }, {
                    label: '积分状态',
                    field: 'pointState',
                    value: '',
                    type: 'select',
                    options: [],
                }],
            search: {},
            isAddPermission: false,  // 新增按钮权限
            isEditPermission: false,  // 编辑按钮权限
            isDeletePermission: false,  // 删除按钮权限


            table: {
                title: [
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
                        label: '站点',
                        field: 'companyName',
                    },
                    {
                        label: '客户组',
                        field: 'customerGroupName',
                    },
                    {
                        label: '积分状态',
                        field: 'pointStateName',
                    },
                    {
                        label: '可用积分',
                        field: 'availableAmount',
                        type: 'link',
                        click: this.handleDblclick,
                    },
                    {
                        label: '待入账积分',
                        field: 'disabledAmount',
                        type: 'link',
                        click: this.handleDblclick,
                    },
                    {
                        label: '已过期积分',
                        field: 'expireAmount',
                    },
                    {
                        label: '历史获的积分',
                        field: 'historyGetAmount',
                    },
                    {
                        label: '操作',
                        field: '',
                        type: 'operat',
                        options: [
                            { name: '查看', type: 'view', show: true },
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
            dialog: {
                loading: false,
                dialogWidth: '470px',
                dialogTitle: '提示',
            },
            batchForm: { fileList1: [], batchData: null },
            customerImportAPPOINTAction: customerImportAPPOINTAction()
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        // this.getPermissions()  // 无按钮权限
        this._getUserList(this.table.pageNum, this.table.pageSize);
    },
    mounted() {

    },
    methods: {
        // 数据字典
        _getDictsData: function () {
            // 站点
            var paramsSite = {
                isAll: true,
                code: 'CompanyCode'
            }
            getDictsData(paramsSite).then(res => {
                this.searchOptions.filter(item => item.field === 'companyCode')[0].options = res.data
            })

            // 客户组
            var paramsCustomerGroups = {
                isAll: true,
                code: 'CustomerGroup'
            }
            getDictsData(paramsCustomerGroups).then(res => {
                this.searchOptions.filter(item => item.field === 'customerGroup')[0].options = res.data
            })

            // 积分状态
            var paramsPointState = {
                isAll: true,
                code: 'PointState'
            }
            getDictsData(paramsPointState).then(res => {
                this.searchOptions.filter(item => item.field === 'pointState')[0].options = res.data
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = permissionsBtnArr.includes("point:customer:create")     // 无新增功能

            // 表格按钮权限
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("point:customer:update"))   // 无编辑功能
            tableBtnPermissions(this.table.title, 'delete', permissionsBtnArr.includes("point:customer:delete"))   // 无删除功能
        },
        // 获取列表数据
        _getUserList: function (pageNum, pageSize) {
            var params = this.search
            params.pageNum = pageNum,
            params.pageSize = pageSize,
            params.pointBlack = false,    // 非积分黑名单
            params.couponBlack = '',      // 优惠券黑名单会存在积分会员列表里

            this.table.tableLoading = true
            getUserList(params).then(res => {
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

        // 查询条件重置
        resetSearchForm: function (e) {     //点击重置
            this.search = e
            this._getUserList(1, this.table.pageSize)
            this.$message('重置成功');
        },
        // 查询
        handleSearch: function (e) {
            this.search = e
            this._getUserList(1, this.table.pageSize);
        },
        // 查询
        handleSearch(e) {
            this.search = e
            this._getUserList(1, this.table.pageSize);
        },
        // 查询-重置
        handleReset(e) {
            this.search = e
            this._getUserList(1, this.table.pageSize);
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
            params.pageSize = ''
            params.pageNum = ''
            params.pointBlack = false
            params.couponBlack = ''
            params.export = true
            params.nameStr = '客户ID,客户名称,ERP联系电话,所属站点,客户组,会员等级,积分状态'
            params.fieldStr = 'uid,customerName,cellphone,companyCode,customerGroup,memberLevel,pointState'
            window.location.href = getUserList(params)
        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getUserList(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getUserList(this.table.pageNum, this.table.pageSize);
        },
        // 双击行
        handleDblclick(row) {
            let query = {
                uid: row.uid
            }
            routerLinkPage(this, 'MemberDetail', query)
        },
        //批量导入
        batchGiftShow: function () {
            this.$refs['batch-gift-model'].showModel();
        },
        // 上传之前
        beforeAvatarUpload: function (file) {
            //验证上传文件的类型
            // if (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            //     this.isExcel = true
            // } else {
            //     this.isExcel = false
            // }
            var newArr = file.name.split('.')
            var newType = newArr[1]

            if (newType == 'xls') {
                this.isExcel = true
            } else {
                this.isExcel = false
            }

            if (!this.isExcel) {
                this.$message({
                    message: '上传文件只能是 xls 格式',
                    type: 'error'
                })
            }

            return this.isExcel;
        },
        //批量黑名单上传成功
        handleSuccesBatch: function (response, file, fileList) {
            console.log(response)
            this.batchForm.batchData = response.data
        },
        // 上传失败
        handleErrorBatch: function (err, file, fileList) {
            this.$message({
                message: file.name + '上传失败',
                type: 'error'
            })
        },
        // 删除已上传文件
        handleRemove(file, fileList) {
            this.batchForm.batchData = null
            // this.uploadCodesLength = 0
        },
        // 多次上传，只保留最后一次文件
        handleFileChange(file, fileList) {
            // this.modifyForm.fileList1 = fileList.slice(-1);


            // this.batchForm.fileList1 = fileList.slice(-1);
        },
        //关闭批量导入积分黑名单   （知道了）
        dialogBatchHide: function (type) {
            this.batchForm.fileList1 = []
            this.batchForm.batchData = null
            this.$refs[type].hideModel();
        },
        // 未获得积分订单生成流水(调用后，后台跑，前端不用任何操作)
        _getNotGetPointOrder: function() {
            getNotGetPointOrder().then(res => {
                console.log(res)
            })
        }
    },
}

</script>

<style lang="scss" scoped>
</style>
