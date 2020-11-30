<template>
	<div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20"  class="searchToolbar">
                <el-col :span="21">
                    <el-form :model="search" ref="search" :inline="true" class="searchWarp" size="small">
                        <el-form-item label="站点:" size="small"  prop="siteAll">
                            <el-select  v-model="search.siteAll" placeholder="所有" class="w100" @change="siteChange">
                                <el-option
                                    v-for="item in search.site"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色:" size="small" prop="roleAll">
                            <el-select v-model="search.roleAll" placeholder="所有" class="w150" @change="roleChange">
                                <el-option
                                    v-for="item in search.role"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态:" size="small" prop="statusAll">
                            <el-select v-model="search.statusAll" placeholder="所有" class="w150" @change="statusChange">
                                <el-option
                                    v-for="item in search.status"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="账号名称:" prop="accountName">
                            <el-input 
                                v-model="search.accountName" 
                                placeholder="请输入内容" 
                                @change="nameChange"
                                @keyup.enter.native="_getSearchUser"
                                class="w150"></el-input>
                        </el-form-item>
                        <el-button type="primary" size="small" @click="_getSearchUser">查询</el-button>
                        <el-button type="info" size="small" @click="handleReset('search')">重置</el-button>
                    </el-form>
                </el-col>
                <el-col :span="3"  class="todoWarp">
                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="pull-right" @click="handleAddEdit('dialog-model-add')" v-if="isAddPermission">新增</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="table-container">
                <el-col :span="24">
                    <div class="cmyyTable">
                        <el-table
                            ref="singleTable"
                            :data="table.tableData"
                            stripe
                            v-loading="table.tableLoading"
                            highlight-current-row>
                            <el-table-column
                                type="index"
                                :index="getIndex"
                                align="center"
                                label="序号"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                property="username"
                                align="center"
                                label="登录账号">
                                <template slot-scope="{row}">
                                    {{ row.username || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="name"
                                label="用户名称"
                                align="center">
                                <template slot-scope="{row}">
                                    {{ row.name || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="roles[0].name"
                                align="center"
                                label="角色">
                                <template slot-scope="{row}">
                                    {{ row.roles[0] == null? '--' : row.roles[0].name}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="companyName"
                                align="center"
                                label="站点">
                                <template slot-scope="{row}">
                                    {{ row.companyName || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="statusName"
                                align="center"
                                label="状态">
                                <template slot-scope="{row}">
                                    {{ row.statusName || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="remark"
                                align="center"
                                label="备注">
                                <template slot-scope="{row}">
                                    {{ row.remark || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                property="modifier"
                                label="修改人员"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="修改时间"
                                align="center"
                                :formatter="formatterDate"
                                width="150">
                            </el-table-column>
                            <el-table-column
                                property="status"
                                align="center"
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button size="mini" 
                                        @click="_getEdit(scope.$index, scope.row, 'dialog-model')" 
                                        v-if="isEditPermission">编辑</el-button>
                                    <el-button size="mini"
                                        :type="scope.row.status==1?'danger':'success'" 
                                        @click="_getOperation(scope.$index, scope.row, 'dialog-model-operation')" 
                                        v-if="isDeletePermission">{{scope.row.status == 1? '禁用':'启用'}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination  
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="table.pageNum"
                            :page-sizes="[20, 50, 100]"
                            :page-size="table.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="table.totalPage">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
            <!-- 编辑的弹出层 -->
            <dialogModel class="dialog-model" ref="dialog-model" :title="dialog.dialogTitle+'用户管理'" :width="dialog.dialogWidth">
                <div class="dialog-model-content">
                    <el-form :model="editRole" ref="editRole" :rules="rules">
                        <el-form-item label="登录账号:" :label-width="formLabelWidth" size="small">
                            <div class="loginId pull-left">{{editForm.username}}</div>
                        </el-form-item>
                        <el-form-item label="名称:" :label-width="formLabelWidth" size="small" prop="name">
                            <el-input v-model="editRole.name" class="pull-left w200" placeholder="请输入用户名称"></el-input>
                        </el-form-item>
                        <el-form-item label="角色:" :label-width="formLabelWidth" size="small" prop="roles">
                            <el-select v-model="editRole.roles" placeholder="请选择角色" class="pull-left" @change="changeEditRole">
                                <el-option
                                    v-for="item in search.editRole"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="站点:" :label-width="formLabelWidth" size="small"  class="lastItem" prop="companyCode">
                            <el-select v-model="editRole.companyCode" placeholder="请选择站点" class="pull-left">
                                <el-option
                                    v-for="item in search.editSite"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态:" :label-width="formLabelWidth" style="margin-bottom:0;" prop="status">
                            <el-radio-group v-model="editRole.status" class="pull-left radioHeight">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="2">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="密码:" :label-width="formLabelWidth" size="small" prop="pass">
                            <el-input type="password" v-model="editRole.pass" class="pull-left w200" placeholder="请输入密码" @change="handlePassword" :maxlength="16"></el-input>
                        </el-form-item>
                        <!-- <div class="tips">*默认密码为123456</div> -->
                    </el-form>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="primary" 
                        size="small"
                        @click="_getUpDate('dialog-model','editRole')"
                        :loading="editSaveLoading">确定</el-button>
                    <el-button size="small" @click="handleEditHide('dialog-model', 'editRole')">取消</el-button>
                </div>
            </dialogModel>
            <!-- 新增的弹出层 -->
            <dialogModel class="dialog-model" ref="dialog-model-add" :title="dialog.addTitle+'用户管理'" :width="dialog.dialogWidth">
                <div class="dialog-model-content">
                    <el-form :model="addForm" ref="addForm" :rules="rules">
                         <el-form-item label="登录账号:" :label-width="formLabelWidth" size="small" prop="username" required>
                            <!-- @change="_getAddusername" -->
                            <el-input 
                                v-model="addForm.username" 
                                style="width:200px;" class="pull-left" 
                                placeholder="请输入十个字以内"
                                @change="_getAddusername"
                                :maxlength="10"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名称:" :label-width="formLabelWidth" size="small" prop="name">
                            <el-input v-model="addForm.name" style="width:200px;" class="pull-left" placeholder="请输入十个字以内" :maxlength="10"></el-input>
                        </el-form-item>
                        <el-form-item label="角色:" :label-width="formLabelWidth" size="small" prop="role" >
                            <el-select v-model="addForm.role" placeholder="请选择" class="pull-left">
                                <el-option
                                    v-for="item in addForm.roles"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="站点:" :label-width="formLabelWidth" size="small" class="lastItem" prop="companyCode">
                            <el-select v-model="addForm.companyCode" placeholder="请选择" class="pull-left">
                                <el-option
                                    v-for="item in addForm.site"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态:" :label-width="formLabelWidth" style="margin-bottom:0;" required>
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
                        :loading="addSaveLoading">确定</el-button>
                    <el-button size="small" @click="handleAddClose('dialog-model-add','addForm')">取消</el-button>
                </div>
            </dialogModel>
             <!-- 启动禁用 -->
            <dialogModel class="dialog-model" ref="dialog-model-operation" :title="'提示'" :width="dialog.dialogWidth">
                <div class="dialog-model-content operation">
                    <p class="operationText">
                        {{search.contentSite}}后该账号可登录系统并操作其权限。是否确认账号 <span>{{search.contentSite}}</span> <span>{{search.contentName}}</span>？
                        <!-- {{content}} -->
                    </p>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        :type="search.contentColor"
                        size="small"
                        @click="_getBtnChange('dialog-model-operation')"
                        :loading="delSaveLoading">{{search.contentLock == true? '启动':'禁用'}}</el-button>
                    <el-button size="small" @click="operationHide('dialog-model-operation')">取消</el-button>
                </div>
            </dialogModel>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { formatDateTimes, deleteBlankSpace, } from 'common/js/dom';
    import Dialog from 'base/Dialog';
    import { getUserManage, getAddRole, getUpDate, getOperation, getDictsData, getAddusername, getBtnChange, getRolesData} from 'api/interface';

    export default {
        components: {
            'dialogModel': Dialog,
        },
        name: "ManageRole",
        data() {
            var validateUsername = (rule, value, callback) => {
                setTimeout(() => {
                    if (value === '') {
                        callback(new Error('请输入账号'));
                    }else if (value == this.addForm.ReUsername) {
                        callback(new Error('账号已存在，请勿重复'))
                    }else {
                        callback();
                    }
                }, 1000)
            }
            return {
                addSaveLoading: false,   // 确定新增
                editSaveLoading: false,  // 确定编辑
                delSaveLoading: false,   // 确定禁用/启用
                table: {
                    tableData: [],   //table数据
                    totalPage: 20,    //分页
                    pageSize: 20,      //页数
                    pageNum: 1,     //当前页
                    tableLoading: false,   //table加载
                },
                search: {
                    site: null,
                    siteAll: '',    //所有站点
                    roleAll: '',    //所有角色
                    statusAll: '',   //所有状态
                    siteValue: '',      //站点
                    roleValue: '',      //角色
                    statusValue: '',    //状态
                    accountName: '',   //账号名称
                    name: '',
                    value2: '',
                    status: null,
                    role: null,
                    editSite: '', //点击编辑重新生成site
                    editRole: '', //点击编辑重新生成role
                    contentSite: '',   //当前站点
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
                    name: '',
                    roles: '',
                    companyCode: '',
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
                    companyCode: '', //站点
                    status: 1, //状态,
                    site: null,
                    roles: null,
                    addSite: '',
                    addRole: '',

                    ReUsername: '', //重名
                },
                rules: {
                    id: [{
                        required: true,
                        message: '请输入登陆账号',
                        trigger: 'blur'
                    },{
                        min: 2,
                        max: 10,
                        message: '长度在 2 到 10 个数字或者英文',
                        },{
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
                    companyCode: [{
                         required: true, 
                         message: '请选择站点', 
                         trigger: 'change' 
                    }],
                    pass: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },{
                        min: 6,
                        max: 16,
                        message: '长度在 6 到 16 个数字或者英文',
                        },{
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
            }
        },
        created() {
            this._getDictsData()
            this.getPermissions()
            this._getUserManage(this.table.pageNum, this.table.pageSize)
        },
        mounted() {

        },
        methods: {
            //加载列表数据字典
            _getDictsData: function(){
                if(this.search.siteAll==''){
                    var params = {
                        isAll: true,
                        code: 'CompanyCode'
                    }
                    getDictsData(params).then(res=> {
                        this.search.site = res.data
                    })
                }
                if(this.search.statusAll==''){
                    var params = {
                        isAll: true,
                        code: 'UserStatus'
                    }
                    getDictsData(params).then(res=> {
                        this.search.status = res.data
                    })
                }
                if (this.search.roleAll=='') {
                    var params = {
                        isAll: true,
                        code: '',
                        name: '',
                        enable: '',
                        // enable为true的时候拿到启用的  false禁用的 ''为全部拿取回来
                    }
                    getRolesData(params).then( res => {
                        this.search.role = res.data
                    })
                }
            },
            // 页面权限
            getPermissions: function() {
                var permissionsBtnArr = localStorage.getItem("permissionsBtn"); 
                if(permissionsBtnArr.includes("system:users:create")) {
                    this.isAddPermission = true
                }else {
                    this.isAddPermission = false
                }
                if(permissionsBtnArr.includes("system:users:update")) {
                    this.isEditPermission = true
                }else {
                    this.isEditPermission = false
                }
                if(permissionsBtnArr.includes("system:users:delete")) {
                    this.isDeletePermission = true
                }else {
                    this.isDeletePermission = false
                }
            },  
            // 获取数据          
            _getUserManage: function(pageNum, pageSize){    //首次加载请求
                var params = {
                    //companyCode: this.search.siteValue,
                    companyCode: this.search.siteAll,
                    status: this.search.statusAll,
                    role: this.search.roleAll,
                    username: deleteBlankSpace(this.search.accountName),
                    pageNum: pageNum,
                    pageSize: pageSize
                }                
                this.table.tableLoading = true
                getUserManage(params).then(res=> {
                    this.table.tableLoading = false
                    if(res.status == 200){
                        this.table.tableData = res.data
                        this.table.totalPage = res.pageVO.total
                    }
                })
            },
            // 站点当前值
            siteChange: function(val) {
                this.search.siteValue = val
                console.log("站点==="+this.search.siteValue)
            },
            roleChange: function(val) {         // 角色当前值
                this.search.roleValue = val
                console.log("角色==="+this.search.roleValue)
            },
            statusChange: function(val) {         //状态当前值
                this.search.statusValue = val
                console.log("状态==="+this.search.statusValue)
            },
            nameChange: function(val) {         //input当前值
                
                this.search.accountName = deleteBlankSpace(val)
                console.log("名称==="+this.search.accountName)
            },
            //查询请求
            _getSearchUser: function() {
                this._getUserManage(1, this.table.pageSize)
            },
            handleSizeChange: function(val) {       //分页请求
                console.log(`每页 ${val} 条`);
                this.table.pageSize = val
                this._getUserManage(this.table.pageNum, this.table.pageSize);
            },
            handleCurrentChange: function(val) {    //当前页请求
                console.log(`当前页: ${val}`);
                this.table.pageNum = val
                this._getUserManage(this.table.pageNum, this.table.pageSize);
            },
            show: function(type) {      //弹出弹出框   type(ref)
                this.$refs[type].showModel();
            },
            hide: function(type) {      //隐藏弹出框
                this.$refs[type].hideModel();
            },
            _getEdit(index, row, type) {   //点击编辑按钮   请求站点
                this.editForm = Object.assign({}, row)
                console.log(row)
                this.editRole.name = row.name
                this.editRole.companyCode = row.companyCode
                this.editRole.status = row.status
                this.editRole.oldPass = row.password

                if (row.roles[0] == null) {
                    this.editRole.roles = ''
                    this.editRole.rolesId = ''
                }else {
                    this.editRole.roles = row.roles[0].name
                    this.editRole.rolesId = row.roles[0].id
                }

                if (this.search.editSite=='') {
                    var params = {
                        isAll: false,
                        code: 'CompanyCode'
                    }
                    getDictsData(params).then(res=> {
                        this.search.editSite = res.data
                    })
                }
                if (this.search.editRole=='') {
                    var params = {
                        isAll: false,
                        code: '',
                        name: '',
                        enable: true
                    }
                    getRolesData(params).then( res => {
                        this.search.editRole = res.data
                    })
                }
                this.show(type)
            },
            _getUpDate: function(type,formName) {      //编辑更新
                var params = {
                    name: this.editRole.name,
                    username: this.editForm.username,
                    companyCode: this.editRole.companyCode,
                    status: this.editRole.status,
                    id: this.editForm.id,
                    password: this.editForm.password,      //this部分是全部拿取返回给后台
                    createdTime: this.editForm.createdTime,
                    creator: this.editForm.creator,
                    modifiedTime: this.editForm.modifiedTime,
                    modifier: this.editForm.modifier,
                    roles:[{id:this.editRole.roles}],
                    salt: this.editForm.salt,
                    type: 'manager'
                }

                if(this.passwordLock) {
                    params.password = this.editRole.pass
                }else {
                    params.password = ''
                }

                if (isNaN(this.editRole.roles)) {
                    params.roles = [{id:this.editRole.rolesId}]
                }
                this.editSaveLoading = true
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        getUpDate(params).then(res => {
                            if (res.status == 200) {
                                this.hide(type)
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                })
                                this.passwordLock = false
                                this._getUserManage(this.table.pageNum, this.table.pageSize)
                            }else if (res.status == 500) {
                                this.$message({
                                    type: 'warning',
                                    message: res.message
                                })
                            }
                            this.editSaveLoading = false
                        })
                    }else {
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
                            companyCode: this.addForm.companyCode,
                            roles: [{id: this.addForm.role}],
                            status: this.addForm.status,
                            password: "123456",
                            type: "manager"
                        }
                       
                        getAddRole(params).then(res => {
                            if(res.status == 200){
                                this._getUserManage(this.table.pageNum, this.table.pageSize);
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                })
                            }else {
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
            handleAddClose: function(type,formName) {   //新增取消
                this.$message('已取消')
                this.$refs[formName].resetFields()
                this.addForm = {
                    status: '',
                }
                this.hide(type)
            },
            handleAddEdit(type) {       //点击新增
                if (this.addForm.addSite=='') {
                    var params = {
                        isAll: false,
                        code: 'CompanyCode'
                    }
                    getDictsData(params).then(res=> {
                        this.addForm.site = res.data
                    })
                }
                if (this.addForm.addRole=='') {
                    var params = {
                        isAll: false,
                        code: '',
                        name: '',
                        enable: true
                    }
                    getRolesData(params).then( res => {
                        this.addForm.roles = res.data
                    })
                }
                // if (this.addForm.addSite == '') {

                // }
                this.show(type)
            },
            _getOperation(index, row, type) {     //启动禁用提示弹框
                this.editForm = Object.assign({}, row)
                if(row.state == '1'){
                    this.lock = true
                    this.btnColor = 'primary'
                }else {
                    this.lock = false
                    this.btnColor = 'danger'
                }
                this.search.contentSite = row.companyName
                this.search.contentName = row.username
                if (row.status == 0) {
                    this.search.contentLock = true
                    this.search.contentColor = 'primary'
                }else if (row.status == 1){
                    this.search.contentLock = false
                    this.search.contentColor = 'danger'
                }else{
                    this.search.contentLock = true
                    this.search.contentColor = 'primary'
                }
                this.show(type);
                // getOperation(params).then(res => {
                       
                // })
            },
            _getBtnChange(type) {      //确定(禁用或启动)按钮
                var params = {
                    id: this.editForm.id,
                    name: this.editForm.name,
                    username: this.editForm.username,
                    companyCode: this.editForm.companyCode,
                    password: this.editForm.password,      //this部分是全部拿取返回给后台
                    createdTime: this.editForm.createdTime,
                    companyName: this.editForm.companyName,
                    creator: this.editForm.creator,
                    modifiedTime: this.editForm.modifiedTime,
                    modifier: this.editForm.modifier,
                    roles: this.editForm.roles,
                    salt: this.editForm.salt,
                    statusName: '',
                    status: '',
                    type: 'manager'
                }
                if (this.search.contentLock) {
                    params.status = '1'
                    params.statusName = '启动'
                }else{
                    params.status = '2'
                    params.statusName = '禁用'
                }
                this.delSaveLoading = true
                getUpDate(params).then(res => {
                    if(res.status == 200) {
                        this.$message({
                            message: params.statusName+'成功',
                            type: 'success'
                        })
                        this.hide(type)
                        this._getUserManage(this.table.pageNum, this.table.pageSize);
                    }else {
                        this.$message({
                            message: res.message,
                            type: 'error'
                        })                        
                    }
                    this.delSaveLoading = false                    
                })
            },
            handleReset(formName) {     //点击重置
                this.$refs[formName].resetFields();

                this._getUserManage(1, this.table.pageSize)
                this.$message('重置成功');
            },
            //转换时间值
            formatterDate: function(row, column) {
                if (row.modifiedTime) {
                    return formatDateTimes(row.modifiedTime)
                }else {
                    return '--'
                }
            },
            operationHide: function(type) {
                this.$message('取消成功')
                this.hide(type)
            },
            //验证登录账号重名
            _getAddusername: function(val){     
                var params = {
                    username: val
                }
                getAddusername(params).then(res=> {
                    if (res.data == null) {
                        this.addForm.ReUsername = ''
                    }else{
                        this.addForm.ReUsername = res.data.username
                    }
                })
            },
            //分页序号
            getIndex (index) {      
                return (this.table.pageNum - 1) * this.table.pageSize + index + 1
            },
            //当前密码
            handlePassword: function(val) {
                this.passwordLock = true
            },
            //编辑角色
            changeEditRole: function(val){
            },

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