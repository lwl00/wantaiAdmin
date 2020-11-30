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
            <!-- 新增的弹出层 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-add"
                :title="dialog.addTitle"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content">
                    <!--  :rules="rules" -->
                    <el-form :model="addForm" ref="addForm" :rules="rules">
                        <el-form-item
                            label="权限名称:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="name"
                        >
                            <el-input
                                v-model="addForm.name"
                                style="width:214px;"
                                class="pull-left"
                                placeholder="请输入名称"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="权限代码:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="code"
                        >
                            <el-input
                                v-model="addForm.code"
                                style="width:214px;"
                                class="pull-left"
                                placeholder="请输入代码"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="资源类型:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="resourceType"
                        >
                            <el-select
                                v-model="addForm.resourceType"
                                placeholder="所有"
                                style="width:214px;"
                            >
                                <el-option
                                    v-for="item in addForm.resourceTypes"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="资源层级:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="resourceType"
                        >
                            <el-select
                                v-model="addForm.resourceLayer"
                                placeholder="所有"
                                style="width:214px;"
                            >
                                <el-option
                                    v-for="item in addForm.resourceLayerData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="资源编号:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="resourceCode"
                        >
                            <el-input
                                v-model="addForm.resourceCode"
                                style="width:214px;"
                                class="pull-left"
                                placeholder="请输入编号"
                                :maxlength="6"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="权限说明:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="remark"
                        >
                            <el-input
                                v-model="addForm.remark"
                                style="width:214px;"
                                class="pull-left"
                                placeholder="请输入内容"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="primary"
                        size="small"
                        @click="_AddRoleDetail('dialog-model-add','addForm')"
                        :loading="addSaveLoading"
                    >确定</el-button>
                    <el-button size="small" @click="handleAddClose('dialog-model-add','addForm')">取消</el-button>
                </div>
            </dialogModel>
            <!-- 编辑弹出框 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-edit"
                :title="dialogTitle+'详细'"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content">
                    <el-form :model="editForm" ref="editForm" :rules="rules">
                        <el-form-item
                            label="权限名称:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="name"
                        >
                            <el-input
                                v-model="editForm.name"
                                style="width:214px;"
                                class="pull-left"
                                placeholder="请输入内容"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="权限代码:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="code"
                        >
                            <el-input
                                v-model="editForm.code"
                                style="width:214px;"
                                class="pull-left"
                                placeholder="请输入内容"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="资源类型:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="resourceType"
                        >
                            <el-select
                                v-model="editForm.resourceType"
                                placeholder="所有"
                                style="width:214px;"
                            >
                                <el-option
                                    v-for="item in resourceTypes"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="资源层级:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="resourceType"
                        >
                            <el-select
                                v-model="editForm.resourceLayer"
                                placeholder="所有"
                                style="width:214px;"
                            >
                                <el-option
                                    v-for="item in editResourceLayerData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="资源编号:"
                            :label-width="formLabelWidth"
                            size="small"
                            prop="resourceCode"
                        >
                            <el-input
                                v-model="editForm.resourceCode"
                                style="width:214px;"
                                class="pull-left"
                                placeholder="请输入编号"
                                :maxlength="6"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="权限说明:" :label-width="formLabelWidth" size="small">
                            <el-input
                                v-model="editForm.remark"
                                style="width:214px;"
                                class="pull-left"
                                placeholder="请输入内容"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="primary"
                        size="small"
                        @click="_editRoleDeital('dialog-model-edit', 'editForm')"
                        :loading="editSaveLoading"
                    >确定</el-button>
                    <el-button size="small" @click="handleEditClose('dialog-model-edit')">取消</el-button>
                </div>
            </dialogModel>
            <!-- 删除按钮 弹框 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-delete"
                :title="'删除权限管理'"
                :width="dialog.dialogWidth2"
            >
                <div class="dialog-model-content operation">
                    <div class="operationText">
                        <p class="deleteText">是否确定删除？</p>
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
import Search from '@/components/Search'
import Table from '@/components/Table'
import Dialog from 'base/Dialog';
import { deleteBlankSpace, formatSearch, calculateTableHeight } from 'common/js/dom';
import { getRoleDetailUser, AddRoleDetail, editRoleDeital, getDictsData, deleteRole } from 'api/interface';

export default {
    components: {
        Table,
        Search,
        'dialogModel': Dialog,
    },
    name: "RoleJurisdiction",
    data() {
        return {
            addSaveLoading: false,  // 确定新增
            editSaveLoading: false,  // 确定编辑
            delSaveLoading: false,  // 确定删除
            table: {
                title: [
                    {
                        label: '权限名称',
                        field: 'name',
                    },
                    {
                        label: '权限代码',
                        field: 'code',
                    },
                    {
                        label: '资源类型',
                        field: 'resourceTypeName',
                    },
                    {
                        label: '资源编号',
                        field: 'resourceCode',
                    },
                    {
                        label: '权限说明',
                        field: 'remark',
                    },
                    {
                        label: '操作',
                        field: '',
                        width: '200',
                        type: 'operat',
                        options: [
                            { name: '编辑', type: 'update', show: true, click: this.handleEdit },
                            { name: '删除', type: 'delete', show: true, click: this.hanleDelete },
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
                    show: true,       //根据权限来显示
                    loading: false,
                    click: this.handleAdd,
                },
            ],
            searchOptions: [{
                label: '权限名称',
                field: 'name',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '权限代码',
                field: 'code',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '资源类型',
                field: 'resourceType',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '资源层级',
                field: 'resourceLayer',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '资源编号',
                field: 'resourceCode',
                value: '',
                type: 'input',
                options: [],
            }],
            search: {},

            addForm: {
                name: '',
                code: '',
                resourceType: 'menu',
                remark: '',
                resourceLayer: '1',  //资源层次
                resourceCode: '',   //资源编号

                resourceTypes: [],
                resourceLayerData: [],
            },
            dialog: {
                addTitle: '新增',
                dialogWidth: '400px',
                dialogWidth2: '350px'
            },
            editForm: {
                name: '',
                code: '',
                resourceType: '',
                remark: '',
                id: '',
                resourceLayer: '',
                resourceCode: ''
            },
            resourceTypes: [],
            editResourceLayerData: [],

            deleteId: '',

            rules: {
                name: [{
                    required: true,
                    message: '请输入权限名称',
                    trigger: 'blur'
                }],
                code: [{
                    required: true,
                    message: '请输入权限代码',
                    trigger: 'blur'
                }],
                resourceType: [{
                    required: true,
                    message: '请选择资源类型',
                    trigger: 'change'
                }],
                resourceType: [{
                    required: true,
                    message: '请选择资源层级',
                    trigger: 'change'
                }],
                resourceCode: [{
                    required: true,
                    message: '请输入资源编号',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 6,
                    message: '长度在 6 到 6 位数字',
                }, {
                    pattern: /^[0-9]+$/,
                    message: '用编号只能为数字',
                }]
            },
            formLabelWidth: '100px',   //宽度
            dialogFormVisible: false,
            dialogTitle: '编辑',    //弹窗提示
        }
    },
    created() {
        // 权限管理无按钮权限控制
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        this._getRoleDetailUser(this.table.pageNum, this.table.pageSize)
    },
    mounted() {

    },
    methods: {
        //加载列表数据字典
        _getDictsData: function () {
            //加载资源类型
            var params = {
                isAll: true,
                code: 'PemissionResourceType'
            }
            getDictsData(params).then(res => {
                this.searchOptions.filter(item => item.field === 'resourceType')[0].options = res.data
            })
            //加载资源层级
            let paramsLayer = {
                isAll: true,
                code: 'PermissionResourceLayer'
            }

            getDictsData(paramsLayer).then(res => {
                this.searchOptions.filter(item => item.field === 'resourceLayer')[0].options = res.data
            })

            //加载资源类型                
            let resourceParams = {
                isAll: false,
                code: 'PemissionResourceType'
            }
            getDictsData(resourceParams).then(res => {
                this.resourceTypes = res.data
            })
            //加载资源层级
            let LayerParams = {
                isAll: false,
                code: 'PermissionResourceLayer'
            }
            getDictsData(LayerParams).then(res => {
                this.editResourceLayerData = res.data
            })

            //新增加载资源类型
            let addPemissionResourceTypeParams = {
                isAll: false,
                code: 'PemissionResourceType'
            }
            getDictsData(addPemissionResourceTypeParams).then(res => {
                this.addForm.resourceTypes = res.data
            })
            //新增加载资源层级
            let addParamsLayer = {
                isAll: false,
                code: 'PermissionResourceLayer'
            }
            getDictsData(addParamsLayer).then(res => {
                this.addForm.resourceLayerData = res.data
            })
        },
        //获取用户列表
        _getRoleDetailUser: function (pageNum, pageSize) {
            //新版
            var params = {
                code: '',
                name: this.search.name,
                enable: '',
                permissionCode: this.search.code,
                resourceCode: this.search.resourceCode,
                resourceLevel: this.search.resourceLayer,
                resourceType: this.search.resourceType,
                pageNum: pageNum,
                pageSize: pageSize,
            }

            this.table.tableLoading = true
            getRoleDetailUser(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    this.table.tableData = res.data
                    this.table.totalPage = res.pageVO.total
                    // 需要计算table高度
                    calculateTableHeight(this)
                    window.onresize = () => {   // 缩放窗口实时计算
                        calculateTableHeight(this)
                    };
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
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
        //查询请求
        _getSearchUser: function (e) {
            this.search = e
            this._getRoleDetailUser(1, this.table.pageSize)
        },
        //点击重置
        handleReset(e) {
            this.search = e
            this._getRoleDetailUser(1, this.table.pageSize)
            this.$message('重置成功');
        },
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getRoleDetailUser(this.table.pageNum, this.table.pageSize);
        },
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getRoleDetailUser(this.table.pageNum, this.table.pageSize);
        },
        show: function (type) {
            this.$refs[type].showModel();
        },
        hide: function (type) {
            this.$refs[type].hideModel();
        },
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData.splice(index, 1)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        //点击新增
        handleAdd: function (type) {
            this.show('dialog-model-add')
        },
        //点击编辑
        handleEdit: function (e) {
            this.editForm = Object.assign({}, e)
            this.show('dialog-model-edit')
        },
        //点击新增-取消
        handleAddClose: function (type, formName) {
            this.addForm.remark = ''
            this.hide(type)
            this.$refs[formName].resetFields()
            this.$message('取消成功')
        },
        //点击新增-确定
        _AddRoleDetail: function (type, formName) {
            this.addSaveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        enable: true,
                        name: this.addForm.name,
                        code: this.addForm.code,
                        resourceType: this.addForm.resourceType,
                        remark: this.addForm.remark,
                        resourceCode: this.addForm.resourceCode,
                        resourceLayer: this.addForm.resourceLayer
                    }
                    AddRoleDetail(params).then(res => {
                        if (res.status == 200) {
                            this.$refs[formName].resetFields()
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            this.hide(type)
                            this._getRoleDetailUser(this.table.pageNum, this.table.pageSize)
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
        //点击编辑-确定
        _editRoleDeital: function (type, formName) {
            this.editSaveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        id: this.editForm.id,
                        name: this.editForm.name,
                        code: this.editForm.code,
                        resourceType: this.editForm.resourceType,
                        remark: this.editForm.remark,
                        resourceCode: this.editForm.resourceCode,
                        resourceLayer: this.editForm.resourceLayer,
                        enable: this.editForm.enable
                    }
                    editRoleDeital(params).then(res => {
                        if (res.status == 200) {
                            this.$refs[formName].resetFields()
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            })
                            this.hide(type)
                            this._getRoleDetailUser(this.table.pageNum, this.table.pageSize)

                        } else {
                            this.$message({
                                type: 'error',
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
                    return false;
                }
            })
        },
        //点击新增-取消
        handleEditClose: function (type, formName) {
            this.hide(type)
            this.$message('取消成功')
        },
        //点击按钮
        hanleDelete: function (row) {
            this.deleteId = row.id
            this.show('dialog-model-delete')
        },
        //点击删除-确定
        _getDetailDelete: function (type) {
            var params = {
                id: this.deleteId
            }
            this.delSaveLoading = true
            deleteRole(params).then(res => {
                if (res.status == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.hide(type)
                    this._getRoleDetailUser(1, this.table.pageSize)
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }
                this.delSaveLoading = false
                this._getRoleDetailUser(1, this.table.pageSize)
            })
        },
        //点击删除-取消
        handleBtnClose: function (type) {
            this.$message('取消删除')
            this.hide(type)
        },
        //
        handleDblclick(e) {
        }

    }
}
</script>

<style lang="scss" scoped>
.table-container {
    margin-top: 20px;
}
.radioHeight {
    line-height: 50px;
}
.deleteText {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 30px;
}
</style>