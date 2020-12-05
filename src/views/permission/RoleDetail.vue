<template>
    <div class="app-container">
        <!-- {{this.$route.query.id}} -->
        <div class="filter-container">
            <el-tabs type="border-card" style="overflow: auto;" v-model="activeTab">
                <el-tab-pane style="overflow: auto;">
                    <span slot="label">
                        详细信息
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <!--  :model="ruleForm" ref="ruleForm" -->
                    <div class="todoWarpTop">
                        <el-button
                            type="primary"
                            size="small"
                            icon="el-icon-edit-outline"
                            @click="handleEdit('/permission/EditRole?id='+editId+'')"
                            v-if="isEditPermission"
                        >编辑</el-button>
                    </div>
                    <el-form label-width="120px" class="demo-ruleForm" v-loading="loading">
                        <el-form-item label="角色编号:" prop="name" required>
                            <div class="pull-left">{{table.tableData.code}}</div>
                        </el-form-item>
                        <el-form-item label="角色名称:" required>
                            <div class="pull-left">{{table.tableData.name}}</div>
                        </el-form-item>
                        <el-form-item label="角色描述:" required>
                            <div class="pull-left">{{table.tableData.remark}}</div>
                        </el-form-item>
                        <el-form-item label="角色状态:" required>
                            <div class="pull-left">{{table.tableData.enableName}}</div>
                        </el-form-item>
                        <!-- 还没解决 -->
                        <el-form-item label="下属账号数量:" required>
                            <div class="pull-left">{{table.tableData.userCount}}</div>
                            <!-- <div class="pull-left">{{this.$route.query.length}}</div> -->
                            <div
                                class="pull-left mianColor number"
                                v-if="table.tableData.userCount!==0"
                                @click="_getDetailDialogShow"
                            >点击详情</div>
                        </el-form-item>
                        <el-form-item label="创建时间:" required>{{table.tableData.createdTime}}</el-form-item>
                        <el-form-item label="角色权限:" required>
                            <div class="roleList">
                                <ul>
                                    <li>
                                        产品管理
                                        <ul class="listItem" v-if="Permiss.pointList.length!==0">
                                            <el-checkbox-group v-model="power.pointList">
                                                <li
                                                    style="width:134.4px;"
                                                    v-for="item in Permiss.pointList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    v-model="item.checked"
                                                    <el-checkbox
                                                        v-model="item.checked"
                                                        :label="item.id"
                                                        :key="item.id"
                                                        disabled
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li>
                                        客户管理
                                        <ul class="listItem" v-if="Permiss.customerList.length!==0">
                                            <el-checkbox-group v-model="power.customerList">
                                                <li
                                                    style="width:134.4px;"
                                                    v-for="item in Permiss.customerList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    v-model="item.checked"
                                                    <el-checkbox
                                                        v-model="item.checked"
                                                        :label="item.id"
                                                        :key="item.id"
                                                        disabled
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li style="width:170px;">
                                        方案管理
                                        <ul class="listItem" v-if="Permiss.giftList.length!==0">
                                            <el-checkbox-group v-model="power.giftList">
                                                <li
                                                    style="width:170px;"
                                                    v-for="item in Permiss.giftList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    v-model="item.checked"
                                                    <el-checkbox
                                                        v-model="item.checked"
                                                        :label="item.id"
                                                        :key="item.id"
                                                        disabled
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li>
                                        空间管理
                                        <ul class="listItem" v-if="Permiss.orderList.length!==0">
                                            <el-checkbox-group v-model="power.orderList">
                                                <li
                                                    style="width:134.4px;"
                                                    v-for="item in Permiss.orderList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    v-model="item.checked"
                                                    <el-checkbox
                                                        v-model="item.checked"
                                                        :label="item.id"
                                                        :key="item.id"
                                                        disabled
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li style="width:163px;">
                                        系统管理
                                        <ul class="listItem" v-if="Permiss.systemList.length!==0">
                                            <el-checkbox-group v-model="power.systemList">
                                                <li
                                                    style="width:162px;"
                                                    v-for="item in Permiss.systemList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    <!-- v-model="item.checked" -->
                                                    <el-checkbox
                                                        v-model="item.checked"
                                                        :label="item.id"
                                                        :key="item.id"
                                                        disabled
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li>
                                        其他管理
                                        <ul class="listItem" v-if="Permiss.otherList.length!==0">
                                            <el-checkbox-group v-model="power.otherList">
                                                <li
                                                    style="width:134.4px;"
                                                    v-for="item in Permiss.otherList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    v-model="item.checked"
                                                    <el-checkbox
                                                        v-model="item.checked"
                                                        :label="item.id"
                                                        :key="item.id"
                                                        disabled
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane name="HistoryList" v-if="isOperationHistoryPermission">
                    <span slot="label">
                        修改历史
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <keep-alive>
                        <HistoryList
                            v-if="activeTab=='HistoryList'"
                            :entity="history.entity"
                            :targetId="history.targetId"
                        ></HistoryList>
                    </keep-alive>
                </el-tab-pane>
            </el-tabs>
            <!-- 弹出框 -->
            <el-dialog title="编辑角色" :visible.sync="isShowRove" width="70%">
                <el-form :model="editForm" ref="editForm" label-width="120px" :rules="rules">
                    <el-form-item label="角色编号:" :label-width="formLabelWidth">
                        <el-input
                            v-model="editForm.name"
                            class="pull-left"
                            size="small"
                            style="width:200px;"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称:" required prop="name">
                        <el-input
                            v-model="editForm.name"
                            class="pull-left"
                            size="small"
                            style="width:200px;"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述:" required prop="content">
                        <el-input
                            v-model="editForm.content"
                            class="pull-left"
                            size="small"
                            style="width:400px;"
                        ></el-input>
                        <div class="pull-left contentTip">(限制50文字内)</div>
                    </el-form-item>
                    <el-form-item label="角色状态:" :label-width="formLabelWidth" required prop="state">
                        <el-radio-group v-model="editForm.state" class="pull-left radioHeight">
                            <el-radio label="启用"></el-radio>
                            <el-radio label="禁用"></el-radio>
                        </el-radio-group>
                        <div class="pull-left contentTip">（禁用后此角色的账号将同步禁用）</div>
                    </el-form-item>
                    <el-form-item label="下属账号数量:" required></el-form-item>
                    <el-form-item label="角色权限:" required>
                        <div class="cmyyTable">
                            <el-table stripe style="width: 100%">
                                <el-table-column prop="date" label="产品管理" align="center"></el-table-column>
                                <el-table-column prop="name" label="客户管理" align="center"></el-table-column>
                                <el-table-column prop="address" align="center" label="方案管理"></el-table-column>
                                <el-table-column prop="address" align="center" label="空间管理"></el-table-column>
                                <el-table-column prop="address" align="center" label="系统管理"></el-table-column>
                                <el-table-column prop="address" align="center" label="其他管理"></el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="submitForm('editForm')">保 存</el-button>
                    <el-button size="small" @click="resetForm('editForm')">取 消</el-button>
                </div>
            </el-dialog>
            <!-- 下属账号弹窗 -->
            <dialogModel
                class="detailDialog-model"
                ref="detailDialog-model"
                :title="dialog.detailDialogTitle"
                :width="dialog.detailDialogWidth"
            >
                <div class="dialog-model-content">
                    <p class="dialogNote">
                        下属账号数量共有：
                        <b class="errorColor">{{dialog.userCount}}</b>个
                    </p>
                    <div class="cmyyTable" style="margin-top: 20px;">
                        <el-table
                            :data="dialog.detailDialogData"
                            stripe
                            height="400"
                            highlight-current-row
                            v-loading="dialog.dialogTableLoading"
                        >
                            <el-table-column property="username" label="用户账号" align="center"></el-table-column>
                            <el-table-column property="name" label="用户名称" align="center"></el-table-column>
                            <el-table-column property="statusName" label="状态" align="center"></el-table-column>
                            <el-table-column property label="描述" align="center">
                                <template slot-scope="{row}">{{row.remark?row.remark:'--'}}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="dialog-model-footer">
                    <el-button
                        type="primary"
                        size="small"
                        @click="dialogHide('detailDialog-model')"
                    >确定</el-button>
                    <el-button size="small" @click="dialogHide('detailDialog-model')">取消</el-button>
                </div>
            </dialogModel>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Dialog from 'base/Dialog';
import HistoryList from 'base/HistoryList';
import { formatDateTimes, deleteBlankSpace } from 'common/js/dom';
import { getRolesDetail, getPermissions, getDetailDialogShow } from 'api/interface';

export default {
    components: {    //注册组件
        'dialogModel': Dialog,
        'HistoryList': HistoryList
    },
    name: "RoleDetail",
    data() {
        return {
            loading: false,
            table: {
                tableData: [],
            },
            ruleForm: {},
            isShowRove: false,
            editForm: {             //编辑页form
                name: '',
                content: '',
                state: 'false'
            },
            formLabelWidth: '120px',
            radio: '1', // 角色状态
            rules: {  //验证错误
                name: [{
                    required: true,
                    message: '请输入角色名称',
                    trigger: 'blur'
                }],
                remark: [{
                    required: true,
                    message: '请输入角色名称',
                    trigger: 'blur'
                }],
            },
            editId: this.$route.query.id,
            Permiss: {
                customerList: [],
                giftList: [],
                orderList: [],
                pointList: [],
                systemList: [],
                otherList: [],
            },
            power: {
                customerList: [],
                giftList: [],
                orderList: [],
                pointList: [],
                systemList: [],
                otherList: [],
            },
            dialog: {
                detailDialogTitle: '下属账号列表',
                detailDialogWidth: '1000px',
                userCount: 0,
                detailDialogData: [],
                dialogTableLoading: false
            },

            activeTab: '',
            history: {
                entity: '',
                property: '',
                targetId: '',
                operator: '',
            },

            isEditPermission: false,  // 编辑按钮权限
            isOperationHistoryPermission: false,  // 操作历史tab权限
        }
    },
    created() {
        this.history.entity = 'Role'
        this.history.targetId = String(this.$route.query.id)

        this._getPermissions(this.$route.query.code)
        this._getRolesDetail(this.$route.query.id)

        this.getPermissions()
    },
    mounted() {

    },
    methods: {
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            var permissionsMenuArr = localStorage.getItem("permissionsMenu");

            if (permissionsBtnArr.includes("system:roles:update")) {
                this.isEditPermission = true
            } else {
                this.isEditPermission = false
            }
            if (permissionsMenuArr.includes("system:operationRecords:read")) {
                this.isOperationHistoryPermission = true
            } else {
                this.isOperationHistoryPermission = false
            }
        },
        _getRolesDetail: function (id) {
            var params = {
                id: id
            }
            this.loading = true
            getRolesDetail(params).then(res => {
                this.loading = false
                if (res.status == 200) {
                    this.table.tableData = res.data
                    if (this.table.tableData.createdTime) {
                        this.table.tableData.createdTime = formatDateTimes(this.table.tableData.createdTime)
                    }
                }
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            var _this = this
            _this.$refs[formName].resetFields()
            _this.isShowRove = false
        },
        // 重置
        resetForm: function (formName) {
            this.$refs[formName].resetFields();
            this.$message('重置成功');
        },
        // 返回上一层
        back() {
            this.$router.go(-1);
        },
        //转换时间值
        formatterDate: function (row, column) {
            var date = new Date(row.createdTime)
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        },
        handleEdit: function (index) {
            this.$router.push({
                path: index,
                query: {
                    //id: row.id,
                    code: this.$route.query.code
                }
            })
        },
        //获取角色权限
        _getPermissions: function (code) {
            var params = {
                code: code
            }
            getPermissions(params).then(res => {
                this.Permiss.customerList = res.data.customerList
                this.Permiss.giftList = res.data.giftList
                this.Permiss.orderList = res.data.orderList
                this.Permiss.pointList = res.data.pointList
                this.Permiss.systemList = res.data.systemList
                this.Permiss.otherList = res.data.otherList

                //产品管理获取当前被选中的id
                if (this.Permiss.pointList.length != 0) {
                    for (var key in this.Permiss.pointList) {
                        if (this.Permiss.pointList[key].checked == true) {
                            this.power.pointList.push(this.Permiss.pointList[key].id)
                        }
                    }
                }
                //客户管理获取当前被选中的id
                if (this.Permiss.customerList.length != 0) {
                    for (var key in this.Permiss.customerList) {
                        if (this.Permiss.customerList[key].checked == true) {
                            this.power.customerList.push(this.Permiss.customerList[key].id)
                        }
                    }
                }
                //方案管理获取当前被选中的id
                if (this.Permiss.giftList.length != 0) {
                    for (var key in this.Permiss.giftList) {
                        if (this.Permiss.giftList[key].checked == true) {
                            this.power.giftList.push(this.Permiss.giftList[key].id)
                        }
                    }
                }
                //空间管理获取当前被选中的id
                if (this.Permiss.orderList.length != 0) {
                    for (var key in this.Permiss.orderList) {
                        if (this.Permiss.orderList[key].checked == true) {
                            this.power.orderList.push(this.Permiss.orderList[key].id)
                        }
                    }
                }
                //系统管理获取当前被选中的id
                if (this.Permiss.systemList.length != 0) {
                    for (var key in this.Permiss.systemList) {
                        if (this.Permiss.systemList[key].checked == true) {
                            this.power.systemList.push(this.Permiss.systemList[key].id)
                        }
                    }
                }
                //其他管理取当前被选中的id
                if (this.Permiss.otherList.length != 0) {
                    for (var key in this.Permiss.otherList) {
                        if (this.Permiss.otherList[key].checked == true) {
                            this.power.otherList.push(this.Permiss.otherList[key].id)
                        }
                    }
                }
            })
        },
        //查看详情
        _getDetailDialogShow: function () {
            ///system/roles/code=admin/users
            var params = {
                code: this.table.tableData.code
            }
            this.dialog.dialogTableLoading = true
            getDetailDialogShow(params).then(res => {
                this.dialog.dialogTableLoading = false
                if (res.status == 200) {
                    if (res.data.length != 0) {
                        this.dialog.userCount = res.data.length
                    }
                    this.dialog.detailDialogData = res.data
                }
            })
            this.$refs['detailDialog-model'].showModel();
        },
        //查看详情(关闭和确定)
        dialogHide: function (formName) {
            this.$refs[formName].hideModel()
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form-item_label {
    width: 120px !important;
}
.radioHeight {
    line-height: 50px;
}
.contentTip {
    font-size: 12px;
    margin-left: 6px;
    color: #848484;
}
.number {
    margin-left: 16px;
    cursor: pointer;
}
.roleList {
    width: 1200px;
    height: 760px;
    background-color: #ebeef5;
    overflow: auto;
    overflow-x: hidden;
    ul {
        float: left;
        li {
            float: left;
            width: 135.4px;
            height: 40px;
            background-color: #9ba2ab;
            color: #fff;
            text-align: center;
            border-right: 1px solid #fff;
            .listItem {
                li {
                    background-color: #fff;
                    color: #333;
                    text-align: left;
                    padding-left: 16px;
                    border-bottom: 1px solid #ebeef5;
                }
            }
        }
    }
}
</style>
