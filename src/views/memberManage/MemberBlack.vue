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

        <!--======== 以下是弹出层 ========-->
        <!-- 新增积分黑名单 -->
        <dialogModel
            class="addPointBlackDialog-model"
            ref="addPointBlackDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content" v-loading="dialog.loading">
                <div class="warnWarp">加入黑名单后客户在客户端不可见所有积分系统相关的入口、图标、提示等所有展示，也不再参与积分的计算，可用积分将被冻结</div>
                <el-form
                    :inline="true"
                    :model="dialog"
                    ref="dialog"
                    :rules="rules"
                    class
                    size="small"
                    label-width="100px"
                >
                    <el-form-item label="新增账号：" prop="uid">
                        <!-- <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="dialog.uid"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入或选择新增账号"
                            @select="handleSelect"
                            class="w300">
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                                <span class="addr">{{ item.customerName }}</span>
                            </template>
                        </el-autocomplete>-->

                        <!-- <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="dialog.uid"
                            :fetch-suggestions="querySearch"
                            @select="handleSelect"
                            placeholder="请输入或选择新增账号"
                            class="w300"
                        >
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                                <span class="addr">{{ item.customerName }}</span>
                            </template>
                        </el-autocomplete>-->
                        <!-- 新逻辑 -->
                        <!-- 回车触发   _getNativeUid-->
                        <!-- 延迟触发 _getTimeUid-->
                        <!-- @keyup.native="_getTimeUid" -->
                        <el-input
                            v-model="dialog.uid"
                            @keyup.enter.native="_getNativeUid"
                            placeholder="请填写账号"
                            class="w150 pull-left"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="可用积分：" prop>{{dialog.availableAmount}}积分</el-form-item>
                    <el-form-item label="待入账积分：" prop>{{dialog.disabledAmount}}积分</el-form-item>
                    <el-form-item label="加入原因：" prop="addBlackReason">
                        <el-input
                            minlength="1"
                            maxlength="50"
                            type="textarea"
                            rows="4"
                            v-model="dialog.addBlackReason"
                            placeholder="必填（50字内）"
                            class="w300"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="add('dialog')"
                    :loading="addLoading"
                >确定</el-button>

                <el-button size="small" @click="dialogHideMeg('addPointBlackDialog-model')">取消</el-button>
            </div>
        </dialogModel>

        <!-- 移入积分黑名单成功弹窗 -->
        <dialogModel
            class="addPointBlackSuccessDialog-model successDialog"
            ref="addPointBlackSuccessDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    客户
                    <b
                        class="errorColor"
                    >{{dialog.uid}} &nbsp; {{dialog.customerInfo.customerName}}</b> 已成功加入积分黑名单，其客户信息不再在积分会员列表显示。但其历史积分记录仍然保存，如需查看请进入积分黑名单会员列表。
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('addPointBlackSuccessDialog-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 批量导入黑名单 -->
        <dialogModel
            class="check-model successDialog"
            ref="batch-gift-model"
            title="批量导入积分黑名单"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <el-upload
                    name="file"
                    class="upload-demo"
                    :action="addBlockGiftAPPOINTAction"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :file-list="batchForm.fileList1"
                    :on-success="handleSuccesBatch"
                    :on-error="handleErrorBatch"
                    :on-change="handleFileChange"
                    width="200px"
                    :multiple="false"
                >
                    批量导入积分黑名单：
                    <el-button size="small" type="primary">点击上传</el-button>
                    <span slot="tip" class="el-upload__tip"></span>
                </el-upload>
                <!--  v-if="batchForm.batchData" -->
                <div class="tipContent" v-if="batchForm.batchData">
                    <p>
                        成功导入积分黑名单：
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
import Dialog from 'base/Dialog';
import { getUserList, getDictsData, customerOperate, addBlockGiftAPPOINTAction } from 'api/interface';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage } from 'common/js/dom';

export default {
    components: {
        Search,
        Table,
        'dialogModel': Dialog,
    },
    name: "MemberBlack",
    data() {
        return {
            addLoading: false,  // 新增积分黑名单
            addBlockGiftAPPOINTAction: addBlockGiftAPPOINTAction(),
            buttonList: [
                {
                    name: 'add',
                    type: 'primary',
                    icon: '',
                    text: '新增积分黑名单',
                    class: '',
                    show: false,
                    loading: false,
                    click: this.dialogShow,
                },
                {
                    name: 'add',
                    type: 'primary',
                    icon: '',
                    text: '批量导入积分黑名单',
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
                uid: '',
                addBlackReason: '',
                customerInfo: '',
                availableAmount: 0,
                disabledAmount: 0,
                dialogData: [],//全部数据
                dialogSelectData: [], //下拉框数据
            },
            timer: null,
            batchForm: { fileList1: [], batchData: null },
            rules: {
                uid: [
                    { required: true, message: '请选择新增账号', trigger: 'change' },
                    // {validator: validateUid, trigger: 'change' }
                ],
                addBlackReason: [
                    { required: true, message: '请完善原因', trigger: 'blur' }
                ],
            },
            isAddPermission: false,  // 新增按钮权限
            isEditPermission: false,  // 编辑按钮权限
            isDeletePermission: false,  // 删除按钮权限
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        this.getPermissions()
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
            // tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("point:customer:update"))   // 无编辑功能
            // tableBtnPermissions(this.table.title, 'delete', permissionsBtnArr.includes("point:customer:delete"))   // 无删除功能
        },
        // 获取列表数据
        _getUserList: function (pageNum, pageSize) {
            var params = this.search
            params.pageNum = pageNum,
                params.pageSize = pageSize,
                params.pointBlack = true,     // 积分黑名单
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
            params.pointBlack = true
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
        // 显示弹窗    blockDialog
        dialogShow: function (type) {
            this.$refs['addPointBlackDialog-model'].showModel();
            // this.dialog.loading = true;
            // var params = {
            //     companyCode: '',
            //     memberLevel: '',
            //     customerGroup: '',
            //     pointState: '',
            //     uid: '',
            //     customerName: '',
            //     cellphone: '',
            //     pointBlack: false,
            //     couponBlack: '',
            //     pageNum: 1,
            //     pageSize: 9999,
            //     export: false,
            //     nameStr: '',
            //     fieldStr: '',
            // }
            // getUserList(params).then(res => {
            //     this.dialog.loading = false
            //     if (res.status == 200) {
            //         // el-autocomplete元素要求数组内是对象，且有value属性，此处做一个格式调整
            //         res.data.data.forEach(function (el, index) {
            //             el.value = el.uid
            //         });
            //         this.dialog.dialogData = res.data.data
            //         this.dialog.dialogSelectData = res.data.data
            //     }
            // })
        },
        //批量导入
        batchGiftShow: function () {
            this.$refs['batch-gift-model'].showModel();

        },
        // 关闭弹窗
        dialogHideMeg: function (type) {
            this.$refs[type].hideModel();
            this.$refs['dialog'].resetFields();
            this.dialog.availableAmount = 0
            this.dialog.disabledAmount = 0
            this.$message('已取消加入')
        },
        // 关闭弹窗（知道了按钮）
        dialogHide: function (type, info) {
            this.$refs[type].hideModel();
        },
        //关闭批量导入积分黑名单   （知道了）
        dialogBatchHide: function (type) {
            this.batchForm.fileList1 = []
            this.batchForm.batchData = null
            this.$refs[type].hideModel();
        },

        // 模糊查询非黑名单账号数据
        querySearch(queryString, cb) {
            var dialogSelectData = this.dialog.dialogSelectData;
            cb(dialogSelectData)
        },
        // 下拉框选择账号
        handleSelect(item) {
            this.dialog.customerInfo = item
            this.dialog.availableAmount = item.availableAmount
            this.dialog.disabledAmount = item.disabledAmount
        },
        // 确定添加
        add: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        uid: this.dialog.uid,
                        customerOperate: 'JOINPOINTBLACK',
                        remark: deleteBlankSpace(this.dialog.addBlackReason),
                    }
                    this.addLoading = true
                    customerOperate(params).then(res => {
                        this.addLoading = false
                        if (res.status == 200) {
                            this.$refs['addPointBlackDialog-model'].hideModel();
                            this.$refs['addPointBlackSuccessDialog-model'].showModel();
                            this._getUserList(this.table.pageNum, this.table.pageSize);
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                    })
                } else {
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    })
                    return false;
                }
            });
        },
        // 上传之前
        beforeAvatarUpload: function (file) {
            //验证上传文件的类型
            if (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                this.isExcel = true
            } else {
                this.isExcel = false
            }

            if (!this.isExcel) {
                this.$message({
                    message: '上传文件只能是 xls或xlsx 格式',
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
        //延迟触发查询
        _getTimeUid() {
            // 当输入完整的uid时候触发
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                if (this.dialog.uid.length == 10) {
                    this.getPointList()
                } else {
                    this.$message('请输入完整客户uid')
                }
            }, 1500);
            // if (this.dialog.uid.length == 10) {
            //     this.getPointList()
            // } else {
            //     this.$message('请输入完整客户uid')
            // }
        },
        //回车触发查询
        _getNativeUid() {
            //当输入完整的uid时候触发
            if (this.dialog.uid.length == 10) {
                this.getPointList()
            } else {
                this.$message('请输入完整客户uid')
            }
        },
        //查询积分
        getPointList() {
            this.dialog.loading = true;
            var params = {
                companyCode: '',
                memberLevel: '',
                customerGroup: '',
                pointState: '',
                uid: this.dialog.uid,
                customerName: '',
                cellphone: '',
                pointBlack: false,
                couponBlack: '',
                pageNum: 1,
                pageSize: 9999,
                export: false,
                nameStr: '',
                fieldStr: '',
            }
            getUserList(params).then(res => {
                this.dialog.loading = false
                if (res.status == 200) {
                    // el-autocomplete元素要求数组内是对象，且有value属性，此处做一个格式调整
                    // res.data.data.forEach(function (el, index) {
                    //     el.value = el.uid
                    // });
                    // this.dialog.dialogData = res.data.data
                    // this.dialog.dialogSelectData = res.data.data
                    console.log(res)
                    this.dialog.availableAmount = res.data.data[0].availableAmount
                    this.dialog.disabledAmount = res.data.data[0].disabledAmount
                }
            })
        }

    },
    watch: {
        'dialog.uid': {
            handler: function () {
                // this.dialog.dialogSelectData = [];//这是定义好的用于存放下拉提醒框中数据的数组
                // var len = this.dialog.dialogData.length;//dialogData是页面初始化时得到的初始全部数据
                // var arr = [];
                // for (var i = 0; i < len; i++) {//根据输入框中uid的值进行模糊匹配
                //     if (this.dialog.dialogData[i].uid.indexOf(this.dialog.uid) >= 0) {
                //         arr.push(this.dialog.dialogData[i]);//符合条件的值都放入arr中
                //     }
                // }
                // this.dialog.dialogSelectData = arr
                // console.log(this.dialog.dialogSelectData)

                //新逻辑
                // let timer = null;
                if (this.timer) {
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(() => {
                    console.log('11111')
                    if (this.dialog.uid.length == 10) {
                        this.getPointList()
                    } else {
                        this.$message('请输入完整客户uid')
                    }
                }, 1500);
            }
        }
    },
}

</script>

<style lang="scss" scoped>
.addPointBlackDialog-model {
    .el-form-item {
        display: block;
        margin-bottom: 5px;
        color: #666;
    }
    .warnWarp {
        color: #333;
        font-size: 18px;
        text-align: center;
        margin-bottom: 10px;
        font-weight: bold;
        line-height: 26px;
    }
    .noteWarp {
        color: #666;
        font-size: 12px;
        margin-bottom: 20px;
        line-height: 18px;
    }
}

.successDialog {
    .successNoteWarp {
        font-size: 14px;
        line-height: 20px;
    }
    .tipContent {
        margin-top: 20px;
        font-size: 13px;
        p {
            margin-bottom: 6px;
        }
        .tip-fail {
            font-style: normal;
        }
    }
}

.my-autocomplete {
    li {
        line-height: normal;
        padding: 7px;

        .name {
            text-overflow: ellipsis;
            overflow: hidden;
            float: left;
        }
        .addr {
            font-size: 12px;
            color: #b4b4b4;
            float: right;
        }
    }
}
</style>
