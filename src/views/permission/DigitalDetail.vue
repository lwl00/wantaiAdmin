<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="24" class="todoWarp headerTop">
                    <el-form :inline="true" class="demo-form-inline pull-left">
                        <el-form-item label="名称" size="small" prop="name">
                            <el-input
                                v-model="detail.name"
                                placeholder="请输入内容"
                                class="w120"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="编码" size="small" prop="code">
                            <el-input
                                v-model="detail.code"
                                placeholder="请输入内容"
                                class="w120"
                                disabled
                            ></el-input>
                        </el-form-item>
                        <el-button
                            type="primary"
                            size="small"
                            @click="_getDetailUserManage(detail.code)"
                        >查询</el-button>
                        <el-button type="info" size="small" @click="handleReset()">重置</el-button>
                    </el-form>
                    <el-button
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="handleAddEdit('dialog-model-add')"
                        size="small"
                        v-if="isAddPermission"
                    >新增</el-button>
                </el-col>
            </el-row>
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
            <!-- 弹出框 -->
            <el-dialog title="编辑页面" :visible.sync="dialog.dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="活动名称" :label-width="formLabelWidth">
                        <el-input
                            v-model="form.name"
                            style="width:300px;"
                            class="pull-left"
                            size="small"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="活动区域" :label-width="formLabelWidth">
                        <el-select
                            v-model="form.region"
                            placeholder="请选择活动区域"
                            class="pull-left"
                            size="small"
                        >
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间" :label-width="formLabelWidth">
                        <el-date-picker
                            type="datetime"
                            placeholder="选择日期时间"
                            default-time="12:00:00"
                            size="small"
                            class="pull-left"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input
                            v-model="form.name"
                            style="width:300px;"
                            class="pull-left"
                            size="small"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="英文" :label-width="formLabelWidth">
                        <el-input
                            v-model="form.name"
                            style="width:300px;"
                            class="pull-left"
                            size="small"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="描述" :label-width="formLabelWidth">
                        <el-input
                            v-model="form.name"
                            style="width:300px;"
                            class="pull-left"
                            size="small"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth">
                        <el-input
                            v-model="form.name"
                            style="width:300px;"
                            class="pull-left"
                            size="small"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="账号数量" :label-width="formLabelWidth">
                        <el-input
                            v-model="form.name"
                            style="width:300px;"
                            class="pull-left"
                            size="small"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialog.dialogFormVisible = false" size="small">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="dialog.dialogFormVisible = false"
                        size="small"
                    >确 定</el-button>
                </div>
            </el-dialog>
            <!-- 新增 弹出框 -->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-add"
                :title="dialog.dialogAddTitle"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content operation">
                    <!--  :rules="rules" -->
                    <el-form :model="addForm" ref="addForm" :rules="rules">
                        <el-form-item
                            label="数据字典名称:"
                            :label-width="dialog.addFormWidth"
                            size="small"
                        >
                            <div class="pull-left">{{this.$route.query.code}}</div>
                        </el-form-item>
                        <el-form-item
                            label="明细项名称:"
                            :label-width="dialog.addFormWidth"
                            size="small"
                            prop="name"
                        >
                            <el-input
                                v-model="addForm.name"
                                class="pull-left"
                                style="width: 214px;"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="明细项值："
                            :label-width="dialog.addFormWidth"
                            size="small"
                            prop="value"
                        >
                            <el-input
                                v-model="addForm.value"
                                style="width: 214px;"
                                class="pull-left"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="是否有效："
                            :label-width="dialog.addFormWidth"
                            size="small"
                            prop="enableName"
                        >
                            <!--  v-model="editForm.enable?'是':'否'"  -->
                            <el-select
                                v-model="addForm.enableName"
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
                            label="排序："
                            :label-width="dialog.editFormWidth"
                            size="small"
                            prop="sort"
                        >
                            <el-input
                                v-model.number="addForm.sort"
                                style="width: 214px;"
                                class="pull-left"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="备注："
                            :label-width="dialog.addFormWidth"
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
                        @click="_getAddDetailData('dialog-model-add', 'addForm')"
                    >确定</el-button>
                    <el-button
                        size="small"
                        @click="handleAddClose('dialog-model-add', 'addForm')"
                    >取消</el-button>
                </div>
            </dialogModel>
            <!-- 编辑 弹出层-->
            <dialogModel
                class="dialog-model"
                ref="dialog-model-edit"
                :title="dialog.dialogTitle+'详细'"
                :width="dialog.dialogWidth"
            >
                <div class="dialog-model-content operation">
                    <el-form :model="editForm" ref="editForm" :rules="rules">
                        <el-form-item
                            label="明细名称："
                            :label-width="dialog.editFormWidth"
                            size="small"
                            prop="name"
                        >
                            <el-input
                                v-model="editForm.name"
                                style="width: 214px;"
                                class="pull-left"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="明细项值："
                            :label-width="dialog.editFormWidth"
                            size="small"
                            prop="value"
                        >
                            <el-input
                                v-model="editForm.value"
                                class="pull-left"
                                style="width: 214px;"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="是否有效："
                            :label-width="dialog.editFormWidth"
                            size="small"
                            prop="enableName"
                        >
                            <el-select
                                v-model="editForm.enableName"
                                placeholder="请选择活动区域"
                                class="pull-left"
                                style="width: 214px;"
                            >
                                <el-option
                                    v-for="item in search.editEnable"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="排序："
                            :label-width="dialog.editFormWidth"
                            size="small"
                            prop="sort"
                        >
                            <el-input
                                v-model.number="editForm.sort"
                                style="width: 214px;"
                                class="pull-left"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="备注：" :label-width="dialog.editFormWidth" size="small">
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
                        @click="_getDetailUpdate('dialog-model-edit', 'editForm')"
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
                :width="dialog.dialogWidth1"
            >
                <div class="dialog-model-content operation">
                    <div class="operationText">
                        <p class="deleteText">是否确定删除</p>
                        <p style="color:red;">(删除并不是真正的删除,只是将状态禁用)</p>
                    </div>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="danger"
                        size="small"
                        @click="_getDetailDelete('dialog-model-delete')"
                    >删除</el-button>
                    <el-button size="small" @click="handleBtnClose('dialog-model-delete')">取消</el-button>
                </div>
            </dialogModel>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDateTimes, deleteBlankSpace, tableBtnPermissions } from 'common/js/dom';
import Table from '@/components/Table'
import Dialog from 'base/Dialog';
import { getNumberUserManage, getDetailUserManage, getDictsData, getAddDetailData, getDetailUpdate, deleteItemDicts } from 'api/interface';

export default {
    components: {    //注册组件
        Table,
        'dialogModel': Dialog,
    },
    name: "DigitalDetail",
    data() {
        var checkSort = (rule, value, callback) => {
            if (value == '') {
                return callback(new Error('排序不能为空'))
            } else if (!parseInt(value)) {
                callback(new Error('请输入数字值'))
            } else {
                callback()
            }
        }
        return {
            detail: {
                name: this.$route.query.name,
                code: this.$route.query.code
            },
            search: {
                enableAll: '',
                enables: null,
                value: '',
                enableValue: '',
                valValue: '',
                editEnable: '',  //用来判断新增条件
                value: '',
                deleteId: ''
            },
            table: {
                title: [
                    {
                        label: '名称',
                        field: 'name',
                    },
                    {
                        label: '明细项值',
                        field: 'value',
                    },
                    {
                        label: '是否生效',
                        field: 'enableName',
                    },
                    {
                        label: '排序',
                        field: 'sort',
                    },
                    {
                        label: '备注',
                        field: 'remark',
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
                dialogAddTitle: '新增',
                dialogTitle: '编辑',
                dialogWidth: '400px',   //弹窗宽度
                dialogWidth1: '320px',  //删除宽度
                addFormWidth: '100px',  //input和select的宽度
                editFormWidth: '100px',
                dialogFormVisible: false,   //弹出框
            },
            addForm: {
                name: '',
                enableName: '1',
                remark: '',
                value: '',
                enableAll: '',  //点开新增加载
                enables: null,
                sort: null,
            },
            editForm: {},
            rules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                value: [{
                    required: true,
                    message: '请输入明细项值',
                    trigger: 'blur'
                }],
                enableName: [{
                    required: true,
                    message: '请选择站点',
                    trigger: 'change'
                }],
                sort: [{
                    required: true,
                    message: '请输入排序'
                }, {
                    type: 'number',
                    message: '必须是数字'
                }]
            },
            contentSite: '',
            contentName: '',
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',   //label长度
            currentPage: 4,     //分页

            isAddPermission: false,
        }
    },
    created() {
        this.getPermissions()
        this._getDetailUserManage(this.table.pageNum, this.table.pageSize, this.$route.query.code)
    },
    mounted() {

    },
    methods: {
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("system:dicts:create")) {
                this.isAddPermission = true
            } else {
                this.isAddPermission = false
            }
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("system:dicts:update"))
            tableBtnPermissions(this.table.title, 'delete', permissionsBtnArr.includes("system:dicts:delete"))
        },
        //获取列表数据
        _getDetailUserManage: function (pageNum, pageSize, code) {
            var params = {
                code: code,
                name: '',
                value: '',
                enable: '',
                pageNum: pageNum,
                pageSize: pageSize
            }
            this.table.tableLoading = true
            getDetailUserManage(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    this.table.tableData = res.data
                    this.table.totalPage = res.pageVO.total
                }
            })
            if (this.search.enableAll == '') {    //首次加载页面获取状态值
                var params = {
                    isAll: true,
                    code: 'EnableDisable'
                }
                getDictsData(params).then(res => {
                    this.search.enables = res.data
                })
            }
        },
        //点击编辑
        handleEdit: function (row) {
            this.editForm = Object.assign({}, row)
            if (row.enable == true) {
                this.editForm.enableName = '1'
            } else {
                this.editForm.enableName = '0'
            }
            //this.editForm.enableName
            this.show('dialog-model-edit')
            if (this.search.editEnable == '') {
                var params = {
                    isAll: false,
                    code: 'EnableDisable'
                }
                getDictsData(params).then(res => {
                    this.search.editEnable = res.data
                })
            }
        },
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getDetailUserManage(this.table.pageNum, this.table.pageSize, this.$route.query.code)
        },
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getDetailUserManage(this.table.pageNum, this.table.pageSize, this.$route.query.code)
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
        handleBtnChange: function (type) {
            this.hide(type)
        },
        formatterDate: function (row, column) {      //转换时间值
            if (row.modifiedTime) {
                return formatDateTimes(row.modifiedTime)
            } else {
                return '--'
            }
        },
        getIndex(index) {      //分页序号
            return (this.table.pageNum - 1) * this.table.pageSize + index + 1
        },
        //查看当前状态值
        enableChange: function (val) {
            this.search.enableValue = val
        },
        //当前明细项值
        valueChange: function (val) {
            this.search.valValue = val
        },
        //查询请求
        _getSearchDetailUser: function () {
            var params = {
                code: this.$route.query.code,
            }
            getDictsData(params).then(res => {
                if (res.status == 200) {
                    this.table.tableData = res.data
                }
            })
        },
        //点击新增
        handleAddEdit: function (type) {
            if (this.addForm.enableAll == '') {    //首次加载页面获取状态值
                var params = {
                    isAll: false,
                    code: 'EnableDisable'
                }
                getDictsData(params).then(res => {
                    this.addForm.enables = res.data
                })
            }
            this.show(type)
        },
        //新增-确定
        _getAddDetailData: function (type, formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        code: this.$route.query.code,
                        name: this.addForm.name,
                        enable: '',
                        remark: this.addForm.remark,
                        value: this.addForm.value,
                        sort: this.addForm.sort,
                    }
                    if (this.addForm.enableName == "1") {
                        params.enable = true
                    } else {
                        params.enable = false
                    }
                    getAddDetailData(params).then(res => {
                        this._getDetailUserManage(1, this.table.pageSize, this.$route.query.code)
                    })
                    this.hide(type)
                    this.$refs[formName].resetFields()
                    this.$message({
                        type: 'success',
                        message: '新增成功'
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        //新增-取消
        handleAddClose: function (type, formName) {
            this.$refs[formName].resetFields()
            this.hide(type)
            this.$message('取消成功')
        },
        //编辑-确定
        _getDetailUpdate: function (type, formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        code: this.$route.query.code,
                        id: this.editForm.id,
                        name: this.editForm.name,
                        enable: '',
                        remark: this.editForm.remark,
                        value: this.editForm.value,
                        sort: this.editForm.sort
                    }
                    if (this.editForm.enableName == "1") {
                        params.enable = true
                    } else {
                        params.enable = false
                    }
                    getDetailUpdate(params).then(res => {
                        this._getDetailUserManage(this.table.pageNum, this.table.pageSize, this.$route.query.code)
                    })
                    this.hide(type)
                    this.$message({
                        type: 'success',
                        message: '编辑成功'
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        //编辑-取消
        handleEditClose: function (type, formName) {
            this.$refs[formName].resetFields()
            this.hide(type)
            this.$message('取消成功')
        },
        // 返回上一层             
        back() {
            this.$router.go(-1);
        },
        //重置
        handleReset: function () {
            //this.$refs[formName].resetFields()
            this.detail.name = this.$route.query.name
            this.detail.code = this.$route.query.code
            this._getDetailUserManage(1, this.table.pageSize, this.$route.query.code)
            this.$message('重置成功')
        },
        //删除
        hanleDelete: function (row) {
            this.search.deleteId = row.id
            this.contentName = row.name
            this.show('dialog-model-delete')
        },
        //删除-确定
        _getDetailDelete: function (type) {
            var params = {
                id: this.search.deleteId
            }
            deleteItemDicts(params).then(res => {
                this.$message({
                    message: '禁用成功',
                    type: 'error'
                })
                this._getDetailUserManage(1, this.table.pageSize, this.$route.query.code)
            })
            this.hide(type)
        },
        //删除-取消
        handleBtnClose: function (type) {
            this.$message('取消成功')
            this.hide(type)
        },
        handleDblclick(row) { }
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
section {
    font-size: 20px;
    margin-bottom: 20px;
    color: red;
}
.codeName {
    font-size: 28px;
}
.deleteText {
    text-align: center;
    margin-top: 16px;
    margin-bottom: 16px;
}
</style>