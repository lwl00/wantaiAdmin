<template>
    <div class="app-container">
        <div class="filter-container">
            <div ref="searchToolbar" class="searchToolbar">
                <Search
                    :buttonList="buttonList"
                    :searchOptions="searchOptions"
                    @search="_getSearchUser"
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
            <!-- 编辑的弹出层 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model"
                :title="dialog.dialogTitle+'用户管理'"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content">
                    <el-form :model="editRole" ref="editRole" :rules="rules">
                        <el-form-item label="登录账号:" :label-width="formLabelWidth" size="small">
                            <div class="loginId pull-left">{{editForm.username}}</div>
                        </el-form-item>
                        <el-form-item
                            label="名称:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="name"
                        >
                            <el-input
                                v-model="editRole.name"
                                class="pull-left w200"
                                placeholder="请输入用户名称"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="角色:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="roles"
                        >
                            <el-select
                                v-model="editRole.roles"
                                placeholder="请选择角色"
                                class="pull-left"
                            >
                                <el-option
                                    v-for="item in editRole.editRoleData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="状态:"
                            :label-width="formLabelWidth"
                            style="margin-bottom:0;"
                            prop="status"
                        >
                            <el-radio-group v-model="editRole.status" class="pull-left radioHeight">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="2">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            label="密码:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="pass"
                        >
                            <el-input
                                type="password"
                                v-model="editRole.pass"
                                class="pull-left w200"
                                placeholder="请输入密码"
                                @change="handlePassword"
                                :maxlength="16"
                                show-password
                            ></el-input>
                        </el-form-item>
                        <!-- <div class="tips">*默认密码为123456</div> -->
                    </el-form>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="primary"
                        size="small"
                        @click="_getUpDate('dialog-model','editRole')"
                        :loading="editSaveLoading"
                    >确定</el-button>
                    <el-button size="small" @click="handleEditHide('dialog-model', 'editRole')">取消</el-button>
                </div>
            </dialogModel>
            <!-- 新增的弹出层 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-add"
                :title="dialog.addTitle+'用户管理'"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content">
                    <el-form :model="addForm" ref="addForm" :rules="rules">
                        <el-form-item
                            label="登录账号:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="username"
                            required
                        >
                            <!-- @change="_getAddusername" -->
                            <el-input
                                v-model="addForm.username"
                                style="width:200px;"
                                class="pull-left"
                                placeholder="请输入十个字以内"
                                @change="_getAddusername"
                                :maxlength="10"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="用户名称:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="name"
                        >
                            <el-input
                                v-model="addForm.name"
                                style="width:200px;"
                                class="pull-left"
                                placeholder="请输入十个字以内"
                                :maxlength="10"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="角色:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="role"
                        >
                            <el-select v-model="addForm.role" placeholder="请选择" class="pull-left">
                                <el-option
                                    v-for="item in addForm.roles"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="状态:"
                            :label-width="formLabelWidth"
                            style="margin-bottom:0;"
                            required
                        >
                            <el-radio-group v-model="addForm.status" class="pull-left radioHeight">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="2">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="tips" :label-width="formLabelWidth">*默认密码为123456</div>
                    </el-form>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="primary"
                        size="small"
                        @click="_getAddRole('dialog-model-add','addForm')"
                        :loading="addSaveLoading"
                    >确定</el-button>
                    <el-button size="small" @click="handleAddClose('dialog-model-add','addForm')">取消</el-button>
                </div>
            </dialogModel>
            <!-- 启动禁用 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-operation"
                :title="'提示'"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content operation">
                    <p class="operationText">
                        {{search.contentSite}}后该账号可登录系统并操作其权限。是否确认账号
                        <span>{{search.contentSite}}</span>
                        <span>{{search.contentName}}</span>？
                        <!-- {{content}} -->
                    </p>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        :type="search.contentColor"
                        size="small"
                        @click="_getBtnChange('dialog-model-operation')"
                        :loading="delSaveLoading"
                    >{{search.contentLock == true? '启动':'禁用'}}</el-button>
                    <el-button size="small" @click="operationHide('dialog-model-operation')">取消</el-button>
                </div>
            </dialogModel>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDateTimes, deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions } from 'common/js/dom';
import Table from '@/components/Table'
import Search from '@/components/Search'
import Dialog from 'base/Dialog';
import { getUserManage, getAddRole, getUpDate, getOperation, getDictsData, getAddusername, getBtnChange, getRolesData } from 'api/interface';

export default {
    components: {
        Table,
        Search,
        'dialogModel': Dialog,
    },
    name: "ManageRole",
    data() {
        var validateUsername = (rule, value, callback) => {
            setTimeout(() => {
                if (value === '') {
                    callback(new Error('请输入账号'));
                } else if (value == this.addForm.ReUsername) {
                    callback(new Error('账号已存在，请勿重复'))
                } else {
                    callback();
                }
            }, 1000)
        }
        return {
            addSaveLoading: false,   // 确定新增
            editSaveLoading: false,  // 确定编辑
            delSaveLoading: false,   // 确定禁用/启用
            search: {
                contentSite: '',   //当前
                contentName: '',    //当前角色
                contentLock: '',  //当前按钮
                contentColor: ''
            },
            dialog: {
                dialogTitle: '编辑',    //编辑弹窗标题
                addTitle: '新增',      //新增弹窗标题
                dialogWidth: '400px',   //弹窗宽度
            },
            editForm: {
            },
            editRole: {
                editSiteData: [],
                editRoleData: [],
                name: '',
                roles: '',
                status: '',
                pass: '123456',
                oldPass: '',     //修改前的密码  
            },
            pass: '123456',     //六个星号密码
            oldPass: '123456',     //修改前的密码    
            addForm: {
                username: '',  //登录账号
                name: '', //用户名称
                role: '',  //角色
                status: 1, //状态,
                site: null,
                roles: null,
                addRole: '',

                ReUsername: '', //重名
            },
            rules: {
                id: [{
                    required: true,
                    message: '请输入登陆账号',
                    trigger: 'blur'
                }, {
                    min: 2,
                    max: 10,
                    message: '长度在 2 到 10 个数字或者英文',
                }, {
                    pattern: /^[0-9a-zA-Z]+$/,
                    message: '用户名只能为数字或者英文',
                }],
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                role: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'change'
                }],
                roles: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'change'
                }],
                status: [{
                    required: true,
                    message: '请选择状态',
                    trigger: 'change'
                }],
                pass: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 16,
                    message: '长度在 6 到 16 个数字或者英文',
                }, {
                    pattern: /^[0-9a-zA-Z]+$/,
                    message: '密码只能为数字或者英文',
                }],
            },
            formLabelWidth: '100px',
            lock: true,
            btnColor: 'danger',

            isAddPermission: false,  // 新增按钮权限
            isEditPermission: false,  // 编辑按钮权限
            isDeletePermission: false,  // 删除按钮权限

            passwordLock: false,

            buttonList: [
                {
                    name: 'add',
                    type: 'primary',
                    icon: 'el-icon-circle-plus-outline',
                    text: '新增',
                    class: '',
                    show: false,       //根据权限来显示
                    loading: false,
                    click: this.handleAddEdit,
                },
            ],
            searchOptions: [ {
                label: '账号名称',
                field: 'accountName',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '角色',
                field: 'roleAll',
                value: '',
                type: 'selectRole',
                options: [],
            }, {
                label: '状态',
                field: 'statusAll',
                value: '',
                type: 'select',
                options: [],
            },],
            newSearch: {},
            table: {
                title: [
                    {
                        label: '登录账号',
                        field: 'username',
                        width: '170',
                    },
                    {
                        label: '用户名称',
                        field: 'name',
                        width: '200',
                    },
                    {
                        label: '角色',
                        field: 'ruleShow',
                        width: '100',
                    },
                    {
                        label: '状态',
                        field: 'statusFlag',
                        type: 'operatSwitch',
                        click: this.handleSwitch
                    },
                    {
                        label: '备注',
                        field: 'remark',
                        width: '100',
                    },
                    {
                        label: '修改人员',
                        field: 'modifier',
                        width: '100',
                    },
                    {
                        label: '修改时间',
                        field: 'modifiedTime',
                        width: '150',
                        type: 'dateTime',
                    },
                    {
                        label: '操作',
                        field: '',
                        width: '200',
                        type: 'operat',
                        options: [
                            { name: '编辑', type: 'update', show: true, click: this.handleEdit },
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
        this.newSearch = formatSearch(this.searchOptions)
        this._getDictsData()
        this.getPermissions()
        this._getUserManage(this.table.pageNum, this.table.pageSize)
    },
    mounted() {

    },
    methods: {
        //加载列表数据字典
        _getDictsData: function () {
            let paramsStatus = {
                isAll: true,
                code: 'UserStatus'
            }
            getDictsData(paramsStatus).then(res => {
                this.searchOptions.filter(item => item.field === 'statusAll')[0].options = res.data
            })
            let paramsRole = {
                isAll: true,
                code: '',
                name: '',
                enable: '',
            }
            getRolesData(paramsRole).then(res => {
                this.searchOptions.filter(item => item.field === 'roleAll')[0].options = res.data
            })
            
            let editRoleParams = {
                isAll: false,
                code: '',
                name: '',
                enable: true
            }
            getRolesData(editRoleParams).then(res => {
                this.editRole.editRoleData = res.data
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("system:users:create")) {
                this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = true
            } else {
                this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = false
            }
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("system:users:update"))
            if (permissionsBtnArr.includes("system:users:delete")) {
                this.isDeletePermission = true
            } else {
                this.isDeletePermission = false
            }
        },
        // 获取数据          
        _getUserManage: function (pageNum, pageSize) {    //首次加载请求
            var params = {
                companyCode: '',
                status: this.newSearch.statusAll,
                role: this.newSearch.roleAll,
                username: this.newSearch.accountName,
                pageNum: pageNum,
                pageSize: pageSize
            }
            this.table.tableLoading = true
            getUserManage(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    let data = res.data
                    data.forEach((item, index) => {
                        item.ruleShow = item.roles[0] == null ? '--' : item.roles[0].name
                        item.statusFlag = item.status == 1 ? true : false
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
        //查询请求
        _getSearchUser: function (e) {
            this.newSearch = e
            this._getUserManage(1, this.table.pageSize)
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
        handleSizeChange: function (val) {       //分页请求
            this.table.pageSize = val
            this._getUserManage(this.table.pageNum, this.table.pageSize);
        },
        handleCurrentChange: function (val) {    //当前页请求
            this.table.pageNum = val
            this._getUserManage(this.table.pageNum, this.table.pageSize);
        },
        show: function (type) {      //弹出弹出框   type(ref)
            this.$refs[type].showModel();
        },
        hide: function (type) {      //隐藏弹出框
            this.$refs[type].hideModel();
        },
        handleEdit(e) {
            this.editForm = Object.assign({}, e)
            this.editRole.name = e.name
            this.editRole.companyCode = ''
            this.editRole.status = e.status
            this.editRole.oldPass = e.password

            if (e.roles[0] == null) {
                this.editRole.roles = ''
                this.editRole.rolesId = ''
            } else {
                this.editRole.roles = e.roles[0].name
                this.editRole.rolesId = e.roles[0].id
            }
            this.show('dialog-model')
        },
        _getUpDate: function (type, formName) {      //编辑更新
            var params = {
                name: this.editRole.name,
                username: this.editForm.username,
                companyCode: '',
                status: this.editRole.status,
                id: this.editForm.id,
                password: this.editForm.password,      //this部分是全部拿取返回给后台
                createdTime: this.editForm.createdTime,
                creator: this.editForm.creator,
                modifiedTime: this.editForm.modifiedTime,
                modifier: this.editForm.modifier,
                roles: [{ id: this.editRole.roles }],
                salt: this.editForm.salt,
                type: 'manager'
            }

            if (this.passwordLock) {
                params.password = this.editRole.pass
            } else {
                params.password = ''
            }

            if (isNaN(this.editRole.roles)) {
                params.roles = [{ id: this.editRole.rolesId }]
            }
            this.editSaveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    getUpDate(params).then(res => {
                        if (res.status == 200) {
                            this.hide(type)
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            })
                            this.passwordLock = false
                            this._getUserManage(this.table.pageNum, this.table.pageSize)
                        } else if (res.status == 500) {
                            this.$message({
                                type: 'warning',
                                message: res.message
                            })
                        }
                        this.editSaveLoading = false
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请完善信息'
                    })
                    this.editSaveLoading = false
                    return false
                }
            })
        },
        handleEditHide(type, formName) {
            this.hide(type)
            this.$refs[formName].resetFields()
            this.$message('取消成功')
        },
        _getAddRole(type, formName) {    //点击新增确定
            this.addSaveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this._getAddusername()
                    var params = {
                        username: this.addForm.username,
                        name: this.addForm.name,
                        companyCode: '',
                        roles: [{ id: this.addForm.role }],
                        status: this.addForm.status,
                        password: "123456",
                        type: "manager"
                    }

                    getAddRole(params).then(res => {
                        if (res.status == 200) {
                            this._getUserManage(this.table.pageNum, this.table.pageSize);
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                        this.addSaveLoading = false
                    })
                    this.$refs[formName].resetFields()
                    this.hide(type)
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请完善信息'
                    })
                    this.addSaveLoading = false
                    return false;
                }
            })
        },
        handleAddClose: function (type, formName) {   //新增取消
            this.$message('已取消')
            this.$refs[formName].resetFields()
            this.addForm = {
                status: '',
            }
            this.hide(type)
        },
        handleAddEdit() {      //点击新增
            if (this.addForm.addRole == '') {
                var params = {
                    isAll: false,
                    code: '',
                    name: '',
                    enable: true
                }
                getRolesData(params).then(res => {
                    this.addForm.roles = res.data
                })
            }
            this.show('dialog-model-add')
        },
        _getOperation(e) {     //启动禁用提示弹框
            index, row, type
            this.editForm = Object.assign({}, row)
            if (row.state == '1') {
                this.lock = true
                this.btnColor = 'primary'
            } else {
                this.lock = false
                this.btnColor = 'danger'
            }
            this.search.contentSite = row.companyName
            this.search.contentName = row.username
            if (row.status == 0) {
                this.search.contentLock = true
                this.search.contentColor = 'primary'
            } else if (row.status == 1) {
                this.search.contentLock = false
                this.search.contentColor = 'danger'
            } else {
                this.search.contentLock = true
                this.search.contentColor = 'primary'
            }
            this.show(type);
        },
        _getBtnChange(value) {      //确定(禁用或启动)按钮
            let params = value
            // this.delSaveLoading = true
            getUpDate(params).then(res => {
                if (res.status == 200) {
                    let statusName = params.statusName == '启用' ? '禁用' : '启用'
                    this.$message({
                        message: statusName + '成功',
                        type: 'success'
                    })
                    // this.hide(type)
                    this._getUserManage(this.table.pageNum, this.table.pageSize);
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                }
                // this.delSaveLoading = false
            })
        },
        handleReset(e) {     //点击重置
            this.newSearch = e
            this._getUserManage(1, this.table.pageSize)
            this.$message('重置成功');
        },
        operationHide: function (type) {
            this.$message('取消成功')
            this.hide(type)
        },
        //验证登录账号重名
        _getAddusername: function (val) {
            var params = {
                username: val
            }
            getAddusername(params).then(res => {
                if (res.data == null) {
                    this.addForm.ReUsername = ''
                } else {
                    this.addForm.ReUsername = res.data.username
                }
            })
        },
        //当前密码
        handlePassword: function (val) {
            this.passwordLock = true
        },
        // 双击行
        handleDblclick(e) {
        },
        //状态
        handleSwitch(e) {
            e.statusFlag ? e.status = 1 : e.status = 2
            let data = Object.assign({}, e)
            this._getBtnChange(data)
        }
    }
}

</script>

<style lang="scss" scoped>
.selectWidth {
    width: 120px;
}
.radioHeight {
    padding-top: 14px;
}
.tips {
    margin-bottom: 18px;
    color: #a4a4a4;
    text-align: center;
    margin-top: 6px;
}
.lastItem {
    margin-bottom: 6px;
}
.operation {
    margin-bottom: 20px;
}
.operation span {
    color: red;
}
.operationText {
    font-size: 14px;
}
.loginId {
}
</style>