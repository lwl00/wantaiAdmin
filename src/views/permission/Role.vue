<template>
    <div class="app-container">
        <div class="filter-container">
            <div ref="searchToolbar" class="searchToolbar">
                <Search
                    :buttonList="buttonList"
                    :searchOptions="searchOptions"
                    @search="_getRoleSearch"
                    @reset="_getreset"
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
            <!-- 启动禁用 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-operation"
                :title="'提示'"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content operation">
                    <p class="operationText">
                        {{tableEdit.contentSite}}后该账号可登录系统并操作其权限。是否确认账号
                        <span
                            class="errorColor"
                        >{{tableEdit.contentSite}}</span>
                        <span class="errorColor">{{tableEdit.contentName}}</span>？
                        <!-- {{content}} -->
                    </p>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        :type="tableEdit.contentColor"
                        size="small"
                        @click="_getBtnChange('dialog-model-operation')"
                        :loading="delSaveLoading"
                    >{{tableEdit.contentLock == true? '启动':'禁用'}}</el-button>
                    <el-button size="small" @click="operationClose('dialog-model-operation')">取消</el-button>
                </div>
            </dialogModel>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Table from '@/components/Table'
import Search from '@/components/Search'
import { formatDateTimes, deleteBlankSpace, formatSearch, calculateTableHeight, routerLinkPage, tableBtnPermissions } from 'common/js/dom';
import Dialog from 'base/Dialog';
import { getRolesUser, editRolesData, getDictsData } from 'api/interface';

export default {
    components: {    //注册组件
        Table,
        Search,
        'dialogModel': Dialog,
    },
    name: "Role",
    data() {
        return {
            delSaveLoading: false,  // 启用/禁用保存
            //table编辑字段
            tableEdit: {
                contentSite: '',
                contentName: '',
                contentLock: '',
                contentColor: ''
            },
            search: {},
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
            ],
            searchOptions: [{
                label: '状态',
                field: 'status',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '角色名称',
                field: 'name',
                value: '',
                type: 'input',
                options: [],
            }],
            editForm: null,
            lock: true,
            dialog: {
                dialogWidth: '320px',
            },
            dialogWidth: '306px',   //弹窗宽度
            contentName: '',
            table: {
                title: [
                    {
                        label: '角色编号',
                        width: 200,
                        field: 'code',
                    },
                    {
                        label: '角色名称',
                        width: 200,
                        field: 'name',
                    },
                    {
                        label: '角色描述',
                        width: 200,
                        field: 'remark',
                    },
                    {
                        label: '角色状态',
                        width: 200,
                        field: 'enableName',
                    },
                    {
                        label: '下属账号数量',
                        width: 150,
                        field: 'userCount',
                    },
                    {
                        label: '修改时间',
                        field: 'createdTime',
                        width: 250,
                        type: 'dateTime'
                    },
                    {
                        label: '状态',
                        field: 'enable',
                        width: 150,
                        type: 'operatSwitch',
                        click: this.handleSwitch
                    },
                    {
                        label: '操作',
                        field: '',
                        type: 'operat',
                        options: [
                            { name: '编辑', type: 'update', show: true, click: this.handleEdit },
                            { name: '查看', type: 'view', show: true, click: this.handleView },
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
        this._getRolesUser(this.table.pageNum, this.table.pageSize)
    },
    mounted() {

    },
    methods: {
        //获取数据字典
        _getDictsData() {
            var params = {
                isAll: true,
                code: 'EnableDisable'
            }
            getDictsData(params).then(res => {
                this.searchOptions.filter(item => item.field === 'status')[0].options = res.data
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("system:roles:create")) {
                this.buttonList.filter(item => item.name === 'add')[0].show = true
            } else {
                this.buttonList.filter(item => item.name === 'add')[0].show = false
            }
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("system:roles:update"))
        },
        // 获取数据
        _getRolesUser: function (pageNum, pageSize) {
            let params = {
                name: this.search.name,
                enable: this.search.status,
                pageNum: pageNum,
                pageSize: pageSize
            }
            this.table.tableLoading = true
            getRolesUser(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    this.table.tableData = res.data
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
        //跳转新增
        handleAdd(index, row) {
            this.$router.push('/permission/AddRole')
        },
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getRolesUser(this.table.pageNum, this.table.pageSize)
        },
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getRolesUser(this.table.pageNum, this.table.pageSize)
        },
        show: function (type) {
            this.$refs[type].showModel();
        },
        hide: function (type) {
            this.$refs[type].hideModel();
        },
        operation: function (indx, row, type) {
            this.contentName = row.name
            this.show(type)
        },
        handleBtnChange(type) {
            this.hide(type)
        },
        //转换时间值
        formatterDate: function (row, column) {
            if (row.modifiedTime) {
                return formatDateTimes(row.modifiedTime)
            } else {
                return '--'
            }
        },
        //点击启用-禁用
        _getOperation: function (index, row, type) {
            this.editForm = Object.assign({}, row)
            if (row.enable == true) {
                this.lock = true
                this.btnColor = 'primary'
            } else {
                this.lock = false
                this.btnColor = 'danger'
            }
            this.tableEdit.contentName = row.name
            if (row.enable == 0) {
                this.tableEdit.contentLock = true
                this.tableEdit.contentSite = '启动'
                this.tableEdit.contentColor = 'primary'
            } else if (row.enable == 1) {
                this.tableEdit.contentLock = false
                this.tableEdit.contentSite = '禁用'
                this.tableEdit.contentColor = 'danger'
            } else {
                this.tableEdit.contentLock = true
                this.tableEdit.contentColor = 'primary'
            }
            this.show(type);
        },
        //点击启用-取消
        operationClose: function (type) {
            this.hide(type)
            this.$message('取消成功')
        },
        _getBtnChange: function (data) {
            var params = {
                id: data.id,
                code: data.code,
                name: data.name,
                remark: data.remark,
                permissions: data.permissions,
                enable: data.enable
            }
            editRolesData(params).then(res => {
                if (res.status == 200) {
                    this.$message({
                        message: data.enable ? '启用成功' : '禁用成功',
                        type: 'success'
                    })
                    this._getRolesUser(this.table.pageNum, this.table.pageSize)
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            })

        },
        //点击查询
        _getRoleSearch: function (e) {
            this.search = e
            this._getRolesUser(1, this.table.pageSize)
        },
        //点击重置
        _getreset: function (e) {
            this.search = e
            this._getRolesUser(1, this.table.pageSize)
            this.$message('重置成功')
        },
        // 双击行
        handleDblclick(row) {
            let query = {
                id: row.id,
                code: row.code
            }
            routerLinkPage(this, 'RoleDetail', query)
        },
        // 编辑
        handleEdit(row, option) {
            let query = {
                id: row.id,
                code: row.code
            }
            routerLinkPage(this, 'EditRole', query)
        },
        // 查看
        handleView(row) {
          let query = {
            id: row.id,
            code: row.code
          }
          routerLinkPage(this, 'RoleDetail', query)
        },
        //状态
        handleSwitch(e) {
            let data = Object.assign({}, e)
            this._getBtnChange(data)
        }
    }
}
</script>

<style lang="scss" scoped>
.marginTop {
    margin-top: 50px;
}
.operation {
    margin-bottom: 30px;
}
</style>
