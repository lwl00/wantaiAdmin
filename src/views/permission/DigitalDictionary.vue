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
            <!-- 新增 弹出框 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-add"
                :title="dialog.dialogAddTitle"
                :width="dialog.dialogWidth1"
            >
                <div class="dialog-model-content operation">
                    <el-form :model="addForm" ref="addForm" :rules="rulesAdd">
                        <el-form-item
                            label="编码："
                            :label-width="editFormWidth"
                            size="small"
                            prop="code"
                            required
                        >
                            <el-input
                                v-model="addForm.code"
                                class="pull-left"
                                style="width: 214px;"
                                @change="_getAddDigitalCode"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="名称："
                            :label-width="editFormWidth"
                            size="small"
                            prop="name"
                        >
                            <el-input
                                v-model="addForm.name"
                                style="width: 214px;"
                                class="pull-left"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="是否有效："
                            :label-width="editFormWidth"
                            size="small"
                            prop="enableLoad"
                        >
                            <el-select
                                v-model="addForm.enableLoad"
                                placeholder="请选择"
                                class="pull-left"
                                style="width: 214px;"
                            >
                                <el-option
                                    v-for="item in addForm.enables"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="备注："
                            :label-width="editFormWidth"
                            size="small"
                            prop="remark"
                        >
                            <el-input
                                v-model="addForm.remark"
                                style="width: 214px;"
                                class="pull-left"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="primary"
                        size="small"
                        @click="_getAddDataUpdate('dialog-model-add', 'addForm')"
                        :loading="addSaveLoading"
                    >确定</el-button>
                    <el-button
                        size="small"
                        @click="handleAddClose('dialog-model-add', 'addForm')"
                    >取消</el-button>
                </div>
            </dialogModel>
            <!-- 编辑详细 弹出框 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-edit"
                :title="dialog.dialogTitle+'数据字典'"
                :width="dialog.dialogWidth1"
            >
                <div class="dialog-model-content operation">
                    <el-form :model="editForm" ref="editForm" :rules="rulesEdit">
                        <el-form-item
                            label="编码："
                            :label-width="editFormWidth"
                            size="small"
                            prop="code"
                            required
                        >
                            <el-input
                                v-model="editForm.code"
                                class="pull-left"
                                @change="_getEditDigitalCode"
                                style="width: 214px;"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="名称："
                            :label-width="editFormWidth"
                            size="small"
                            prop="name"
                        >
                            <el-input
                                v-model="editForm.name"
                                style="width: 214px;"
                                class="pull-left"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="是否有效：" :label-width="editFormWidth" size="small">
                            <el-select
                                v-model="editForm.enableName"
                                placeholder="请选择活动区域"
                                class="pull-left"
                                style="width: 214px;"
                            >
                                <el-option
                                    v-for="item in editEnableData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注：" :label-width="editFormWidth" size="small" prop>
                            <el-input
                                v-model="editForm.remark"
                                style="width: 214px;"
                                class="pull-left"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="primary"
                        size="small"
                        @click="_getDataUpdate('dialog-model-edit', 'editForm')"
                        :loading="editSaveLoading"
                    >确定</el-button>
                    <el-button
                        size="small"
                        @click="handleEditClose('dialog-model-edit', 'editForm')"
                    >取消</el-button>
                </div>
            </dialogModel>
            <!-- 删除按钮 弹框 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-delete"
                :title="'提示'"
                :width="dialog.dialogWidth2"
            >
                <div class="dialog-model-content operation">
                    <div class="operationText">
                        <p class="deleteText">是否确定删除？</p>
                        <p style="color:red; text-align:center;">(删除并不是真正的删除,只是将状态禁用)</p>
                    </div>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="danger"
                        size="small"
                        @click="_getDetailDelete('dialog-model-delete')"
                        :loading="delSaveLoading"
                    >删除</el-button>
                    <el-button size="small" @click="handleBtnClose('dialog-model-delete')">取消</el-button>
                </div>
            </dialogModel>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDateTimes, deleteBlankSpace, formatSearch, calculateTableHeight, routerLinkPage, tableBtnPermissions } from 'common/js/dom';
import Table from '@/components/Table'
import Search from '@/components/Search'
import Dialog from 'base/Dialog';
import { getDataUserManage, getDataUpdate, getDictsData, getAddDataUpdate, getNumberDelete, getAddDigitalCode, deleteDicts } from 'api/interface';

export default {
    components: {
        Table,
        Search, //注册组件
        'dialogModel': Dialog,
    },
    name: "DigitalDictionary",
    data() {
        let validateCode = (rule, value, callback) => {
            setTimeout(() => {
                if (value === '') {
                    callback(new Error('请输入编码'));
                } else if (value == this.addForm.ReCode) {
                    callback(new Error('编码已存在，请勿重复'))
                } else {
                    callback()
                }
            }, 500)
        };
        let validateEditCode = (rule, value, callback) => {
            setTimeout(() => {
                if (value === '') {
                    callback(new Error('请输入编码'));
                } else if (value == this.editReCode) {
                    if (this.editForm.code == this.editReCode && this.editForm.id == this.editReId) {
                        callback()
                    } else {
                        callback(new Error('编码已存在，请勿重复'))
                    }
                } else {
                    callback()
                }
            }, 500)
        };
        return {
            addSaveLoading: false,  // 确定新增
            editSaveLoading: false,  // 确定编辑
            delSaveLoading: false,  // 确定删除                
            deleteId: '',   //禁用id
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
            searchOptions: [{
                label: '名称',
                field: 'name',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '编码',
                field: 'code',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '状态',
                field: 'enable',
                value: '',
                type: 'select',
                options: [],
            }],
            search: {},
            table: {
                title: [
                    {
                        label: '名称',
                        field: 'name',
                    },
                    {
                        label: '编码',
                        field: 'code',
                        width: '200',
                    },
                    {
                        label: '是否生效',
                        field: 'enableName',
                        width: '100',
                    },
                    {
                        label: '备注',
                        field: 'remark',
                    },
                    {
                        label: '修改人',
                        field: 'modifier',
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
                            { name: '明细', type: 'view', show: true },
                            { name: '编辑', type: 'update', show: true, click: this.handleEdit },
                            { name: '删除', type: 'delete', show: true, click: this.hanleDelete }
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
                dialogTitle: '编辑',
                dialogAddTitle: '新增数据字典',
                dialogWidth1: '400px',   //弹窗宽度
                dialogWidth2: '350px',   //弹窗宽度
            },
            editForm: {},   //编辑数据
            editEnableData: [],
            editReCode: '', //编码重名
            editReId: '',   //编码Id
            addForm: {
                code: '',
                name: '',
                enableName: '',
                remark: '',
                enables: null,  //获取状态值
                enableAll: null,    //绑定true或者false
                enableLoad: '1',

                ReCode: '', //编码重名
            },
            editFormWidth: '100px',  //input和select的宽度
            rulesAdd: {
                code: [{
                    validator: validateCode,
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                enableLoad: [{
                    required: true,
                    message: '请选择站点',
                    trigger: 'change'
                }],
            },
            rulesEdit: {
                code: [{
                    validator: validateEditCode,
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                enableLoad: [{
                    required: true,
                    message: '请选择站点',
                    trigger: 'change'
                }],
            },
            contentSite: '',
            contentName: '',
            value: '',
            dialogFormVisible: false,   //弹出框
            formLabelWidth: '90px',   //label长度
            currentPage: 4,     //分页
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        this.getPermissions()
        this._getDataUserManage(this.table.pageNum, this.table.pageSize)
    },
    mounted() {

    },
    methods: {
        //获取数据字典
        _getDictsData: function () {
            let enableParams = {
                isAll: true,
                code: 'EnableDisable'
            }
            getDictsData(enableParams).then(res => {
                this.searchOptions.filter(item => item.field === 'enable')[0].options = res.data
            })

            let addEnablesParams = {
                isAll: false,
                code: 'EnableDisable'
            }
            getDictsData(addEnablesParams).then(res => {
                this.addForm.enables = res.data
            })

            let editEnableParams = {
                isAll: false,
                code: 'EnableDisable'
            }
            getDictsData(editEnableParams).then(res => {
                this.editEnableData = res.data
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("system:dicts:create")) {
                this.buttonList.filter(item => item.name === 'add')[0].show = true
            } else {
                this.buttonList.filter(item => item.name === 'add')[0].show = false
            }
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("system:dicts:update"))
            tableBtnPermissions(this.table.title, 'delete', permissionsBtnArr.includes("system:dicts:delete"))
        },
        // 获取数据            
        _getDataUserManage: function (pageNum, pageSize) {    //获取用户列表
            let params = {
                code: this.search.code,
                enable: this.search.enable,
                name: this.search.name,
                pageNum: pageNum,
                pageSize: pageSize
            }
            this.table.tableLoading = true
            getDataUserManage(params).then(res => {
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
        handleEdit: function (row) {    //点击编辑
            this.editForm = Object.assign({}, row)
            if (row.enable == true) {
                this.editForm.enableName = '1'
            } else {
                this.editForm.enableName = '0'
            }
            // //给编辑code赋值
            // this.editForm.editCode = row.code
            this.show('dialog-model-edit')
        },
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getDataUserManage(this.table.pageNum, this.table.pageSize);
        },
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getDataUserManage(this.table.pageNum, this.table.pageSize);
        },
        show: function (type) {
            this.$refs[type].showModel();
        },
        hide: function (type) {
            this.$refs[type].hideModel();
        },
        hanleDelete: function (row) {     //删除按钮
            this.deleteId = row.id
            this.contentName = row.name
            this.show('dialog-model-delete')
        },
        _getDetailDelete: function (type) {
            var params = {
                id: this.deleteId
            }
            this.delSaveLoading = true
            deleteDicts(params).then(res => {
                if (res.status == 200) {
                    this.hide(type)
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    this.delSaveLoading = false
                    //删除(禁用)后回到当前页
                    this._getDataUserManage(this.table.pageNum, this.table.pageSize)
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
            })
        },
        //转换时间值
        formatterDate: function (row, column) {
            if (row.modifiedTime) {
                return formatDateTimes(row.modifiedTime)
            } else {
                return '--'
            }
        },
        _getSearchUser: function (e) {    //查询请求
            this.search = e
            this._getDataUserManage(1, this.table.pageSize);
        },
        handleReset(e) {
            this.search = e    //点击重置
            // this.$refs[formName].resetFields()
            this._getDataUserManage(1, this.table.pageSize)
            this.$message('重置成功')
        },
        handleBtnClose: function (type) {    //删除取消按钮
            this.hide(type)
            this.$message('取消成功');
        },
        handleEditClose: function (type, formName) {   //编辑取消按钮
            this.$refs[formName].resetFields()
            this.hide(type)
            this.$message('取消成功');
        },
        //点击编辑
        _getDataUpdate: function (type, formName) {
            this.editSaveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this._getEditDigitalCode()
                    var params = {
                        id: this.editForm.id,     //id
                        code: this.editForm.code,   //类型编码
                        name: this.editForm.name,   //类型名称
                        enable: '',     //是否生效
                        createdTime: this.editForm.createdTime,    //时间
                        creator: this.editForm.creator,    //创建人
                        modifier: this.editForm.modifier,   //修改人
                        remark: this.editForm.remark,    //类型备注
                    }

                    if (this.editForm.enableName == "1") {
                        params.enable = true
                    } else {
                        params.enable = false
                    }
                    getDataUpdate(params).then(res => {
                        if (res.status == 200) {
                            this.hide(type)
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            })
                            this.editSaveLoading = false
                            this._getDataUserManage(this.table.pageNum, this.table.pageSize)
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请完善信息'
                    })
                    this.editSaveLoading = false
                    return false;
                }
            })
        },
        //点击新增
        handleAddEdit: function () {
            this.show('dialog-model-add')
        },
        //新增取消
        handleAddClose: function (type, formName) {
            this.$message('取消成功')
            this.hide(type)
            this.$refs[formName].resetFields()
        },
        //新增确定
        _getAddDataUpdate: function (type, formName) {
            this.addSaveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this._getAddDigitalCode()
                    var params = {
                        code: this.addForm.code,
                        name: this.addForm.name,
                        remark: this.addForm.remark,
                        enable: '',
                        id: null
                    }
                    if (this.addForm.enableLoad == "1") {
                        params.enable = true
                    } else {
                        params.enable = false
                    }

                    getAddDataUpdate(params).then(res => {
                        if (res.status == 200) {
                            this.$refs[formName].resetFields()
                            this.hide(type)
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            this._getDataUserManage(this.table.pageNum, this.table.pageSize)
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                        this.addSaveLoading = false
                    })

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
        //分页序号
        getIndex(index) {
            return (this.table.pageNum - 1) * this.table.pageSize + index + 1
        },
        //查查新增(编辑)中编码是否重名
        _getAddDigitalCode: function (val) {
            var params = {
                code: val
            }
            getAddDigitalCode(params).then(res => {
                if (res.data == null) {
                    this.addForm.ReCode = ''
                } else {
                    this.addForm.ReCode = res.data.code
                }
            })
        },
        //查查编辑中编码是否重名
        _getEditDigitalCode: function (val) {
            var paramsEdit = {
                code: val
            }
            getAddDigitalCode(paramsEdit).then(res => {
                if (res.data == null) {
                    this.editReCode = ''
                    this.editReId = this.editForm.id
                } else {
                    this.editReCode = res.data.code
                    this.editReId = res.data.id
                }
            })
        },
        //
        handleDblclick(row) {
            let query = {
                code: row.code,
                name: row.name
            }
            routerLinkPage(this, 'DigitalDetail', query)
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
.btnItem {
    color: red;
    width: 100px;
    cursor: pointer;
    text-decoration: underline;
}
.deleteText {
    text-align: center;
    margin-top: 16px;
    margin-bottom: 16px;
}
</style>