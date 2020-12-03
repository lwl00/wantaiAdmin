<template>
    <div class="app-container">
        <div class="filter-container" v-loading="loading">
            <el-tabs type="border-card" style="overflow: auto;">
                <el-tab-pane style="overflow: auto;">
                    <span slot="label">
                        详细信息
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-form
                        :model="editForm"
                        ref="editForm"
                        label-width="120px"
                        class="demo-ruleForm"
                        :rules="rules"
                    >
                        <el-form-item label="角色编号:" required>
                            <div class="pull-left">{{editForm.code}}</div>
                        </el-form-item>
                        <el-form-item label="角色名称:" size="small" prop="name">
                            <el-input
                                v-model="editForm.name"
                                placeholder="请输入内容"
                                class="pull-left w120"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" size="small">
                            <el-input
                                v-model="editForm.remark"
                                placeholder="请输入描述内容"
                                class="pull-left w500"
                                :maxlength="50"
                            ></el-input>
                            <div class="pull-left contentTip">(限制50文字内)</div>
                        </el-form-item>
                        <el-form-item label="角色状态:" required>
                            <el-radio-group v-model="editForm.enable" class="pull-left lineHeight">
                                <el-radio :label="true">启用</el-radio>
                                <el-radio :label="false">禁用</el-radio>
                            </el-radio-group>
                            <div class="pull-left contentTip">（禁用后此角色的账号将同步禁用）</div>
                        </el-form-item>
                        <el-form-item label="下属账号数量:" required>
                            <div class="pull-left">{{editForm.userCount}}</div>
                        </el-form-item>
                        <el-form-item label="创建时间:" required>
                            <div class="pull-left">{{editForm.createdTime}}</div>
                        </el-form-item>
                        <el-form-item label="角色权限:" required>
                            <div class="roleList">
                                <ul>
                                    <li>
                                        <el-checkbox
                                            :indeterminate="Permiss.pointIsIndeterminate"
                                            v-model="Permiss.pointCheckAll"
                                            @change="CheckAllChange($event,Permiss.pointList, power.pointList, 'pointList')"
                                        >产品管理</el-checkbox>
                                        <ul class="listItem" v-if="Permiss.pointList.length!==0">
                                            <el-checkbox-group
                                                v-model="power.pointList"
                                                @change="pointCheckChange"
                                            >
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
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li>
                                        <el-checkbox
                                            :indeterminate="Permiss.customerIsIndeterminate"
                                            v-model="Permiss.customerCheckAll"
                                            @change="CheckAllChange($event,Permiss.customerList, power.customerList, 'customerList')"
                                        >客户管理</el-checkbox>
                                        <ul class="listItem" v-if="Permiss.customerList.length!==0">
                                            <el-checkbox-group
                                                v-model="power.customerList"
                                                @change="customerCheckChange"
                                            >
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
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li style="width:170px;">
                                        <el-checkbox
                                            :indeterminate="Permiss.giftIsIndeterminate"
                                            v-model="Permiss.giftCheckAll"
                                            @change="CheckAllChange($event,Permiss.giftList, power.giftList, 'giftList')"
                                        >方案管理</el-checkbox>
                                        <ul class="listItem" v-if="Permiss.giftList.length!==0">
                                            <el-checkbox-group
                                                v-model="power.giftList"
                                                @change="giftCheckChange"
                                            >
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
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li>
                                        <el-checkbox
                                            :indeterminate="Permiss.orderIsIndeterminate"
                                            v-model="Permiss.orderCheckAll"
                                            @change="CheckAllChange($event,Permiss.orderList, power.orderList, 'orderList')"
                                        >空间管理</el-checkbox>
                                        <ul class="listItem" v-if="Permiss.orderList.length!==0">
                                            <el-checkbox-group
                                                v-model="power.orderList"
                                                @change="orderCheckChange"
                                            >
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
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li style="width:163px;">
                                        <el-checkbox
                                            :indeterminate="Permiss.systemIsIndeterminate"
                                            v-model="Permiss.systemCheckAll"
                                            @change="CheckAllChange($event,Permiss.systemList, power.systemList, 'systemList')"
                                        >系统管理</el-checkbox>
                                        <ul class="listItem" v-if="Permiss.systemList.length!==0">
                                            <el-checkbox-group
                                                v-model="power.systemList"
                                                @change="systemCheckChange"
                                            >
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
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                    <li>
                                        <el-checkbox
                                            :indeterminate="Permiss.otherIsIndeterminate"
                                            v-model="Permiss.otherCheckAll"
                                            @change="CheckAllChange($event,Permiss.otherList, power.otherList, 'otherList')"
                                        >其他管理</el-checkbox>
                                        <ul class="listItem" v-if="Permiss.otherList.length!==0">
                                            <el-checkbox-group
                                                v-model="power.otherList"
                                                @change="otherCheckChange"
                                            >
                                                <li
                                                    style="width:135px;"
                                                    v-for="item in Permiss.otherList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    v-model="item.checked"
                                                    <el-checkbox
                                                        v-model="item.checked"
                                                        :label="item.id"
                                                        :key="item.id"
                                                    >{{item.name}}</el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div class="todoWarpBottom">
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="_editRolesData('editForm')"
                                    v-if="isEditPermission"
                                    :loading="saveLoading"
                                >保存</el-button>
                                <!-- <el-button size="small" @click="back">取消</el-button> -->
                                <el-button size="small" @click="resetForm">重置</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label">
                        修改历史
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <div class="cmyyTable">
                        <el-table stripe :data="browseRecords" style="width: 100%">
                            <el-table-column prop="date" label="时间" align="center" width="300"></el-table-column>
                            <el-table-column prop="name" label="修改人" align="center" width="300"></el-table-column>
                            <el-table-column prop="content" align="centent" label="修改内容"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDateTimes, deleteBlankSpace, dateToStamp, dateTimeToStamp } from 'common/js/dom';
import { getRolesDetail, editRolesData, getPermissions } from 'api/interface';
export default {
    components: {

    },
    name: "EditRole",
    data() {
        return {
            loading: true,
            saveLoading: false,  // 编辑保存
            table: {
                tableData: [],
            },
            editForm: {
                id: '',
                code: '',
                name: '',
                remark: '',
                enable: '',
                number: '',
                createdTime: '',
                permissions: null,
                userCount: '',
            },
            browseRecords: null,

            isEditPermission: false,

            Permiss: {
                customerList: '',
                giftList: '',
                orderList: '',
                pointList: '',
                systemList: '',
                otherList: '',

                pointIsIndeterminate: true,
                customerIsIndeterminate: true,
                giftIsIndeterminate: true,
                orderIsIndeterminate: true,
                systemIsIndeterminate: true,
                otherIsIndeterminate: true,

                pointCheckAll: false,
                customerCheckAll: false,
                giftCheckAll: false,
                orderCheckAll: false,
                systemCheckAll: false,
                otherCheckAll: false,
            },
            power: {
                customerList: [],
                giftList: [],
                orderList: [],
                pointList: [],
                systemList: [],
                otherList: [],
            },
            rules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this._getPermissions(this.$route.query.code)
        this.getPermissions()
        this._getRolesDetail(this.$route.query.id)
    },
    methods: {
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("system:roles:update")) {
                this.isEditPermission = true
            } else {
                this.isEditPermission = false
            }
        },
        // 获取数据
        _getRolesDetail: function (id) {
            var params = {
                id: id
            }

            this.loading = true
            getRolesDetail(params).then(res => {
                this.loading = false
                if (res.status == 200) {
                    this.editForm.id = res.data.id
                    this.editForm.code = res.data.code
                    this.editForm.name = res.data.name
                    this.editForm.remark = res.data.remark
                    this.editForm.enable = res.data.enable
                    //this.editForm.number = res.data.permissions.length
                    //this.editForm.createdTime = res.data.createdTime
                    this.editForm.permissions = res.data.permissions
                    this.editForm.userCount = res.data.userCount

                    if (res.data.createdTime) {
                        this.editForm.createdTime = formatDateTimes(res.data.createdTime)
                    }
                }
            })
        },
        // 重置
        resetForm: function (formName) {
            this.$message('重置成功');
            this._getRolesDetail(this.$route.query.id)
        },
        back: function () {
            this.$message('取消成功')
            this.$router.go(-1)
        },
        //保存编辑
        _editRolesData: function (formName) {
            this.saveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        id: this.editForm.id,
                        code: this.editForm.code,
                        name: this.editForm.name,
                        remark: this.editForm.remark,
                        enable: this.editForm.enable,
                        createdTime: dateTimeToStamp(this.editForm.createdTime),
                        permissions: [],
                    }
                    //产品管理
                    if (this.power.pointList) {
                        for (var i = 0; i < this.power.pointList.length; i++) {
                            let permiss = { id: this.power.pointList[i] }
                            params.permissions.push(permiss)
                        }
                    }
                    //客户管理
                    if (this.power.customerList) {
                        for (var i = 0; i < this.power.customerList.length; i++) {
                            let permiss = { id: this.power.customerList[i] }
                            params.permissions.push(permiss)
                        }
                    }
                    //方案管理
                    if (this.power.giftList) {
                        for (var i = 0; i < this.power.giftList.length; i++) {
                            let permiss = { id: this.power.giftList[i] }
                            params.permissions.push(permiss)
                        }
                    }
                    //空间管理
                    if (this.power.orderList) {
                        for (var i = 0; i < this.power.orderList.length; i++) {
                            let permiss = { id: this.power.orderList[i] }
                            params.permissions.push(permiss)
                        }
                    }
                    //系统管理
                    if (this.power.systemList) {
                        for (var i = 0; i < this.power.systemList.length; i++) {
                            let permiss = { id: this.power.systemList[i] }
                            params.permissions.push(permiss)
                        }
                    }
                    //其他管理
                    if (this.power.otherList) {
                        for (var i = 0; i < this.power.otherList.length; i++) {
                            let permiss = { id: this.power.otherList[i] }
                            params.permissions.push(permiss)
                        }
                    }
                    console.log(params.permissions)
                    editRolesData(params).then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            })
                            this.$router.push('/permission/Role')
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }
                        this.saveLoading = false
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请完善信息'
                    })
                    this.saveLoading = false
                    return false;
                }
            })
        },
        //获取角色权限
        _getPermissions: function (code) {
            var params = {
                code: code
            }
            getPermissions(params).then(res => {
                //this.Permiss. = res.data
                this.Permiss.customerList = res.data.customerList
                this.Permiss.giftList = res.data.giftList
                this.Permiss.orderList = res.data.orderList
                this.Permiss.pointList = res.data.pointList
                this.Permiss.systemList = res.data.systemList
                this.Permiss.otherList = res.data.otherList

                // 其中有两个属性来控制全选这个checkbox：indeterminate和checkAll。
                // indeterminate为false，checkAll为false的时候，状态为未选中。
                // indeterminate为true，checkAll为false的时候，状态为半选中。
                // indeterminate为false，checkAll为true的时候，状态为全选中。
                // 把全选框状态改为未选中状态，应该修改indeterminate和checkAll，均为false

                //产品管理获取当前被选中的id
                if (this.Permiss.pointList.length != 0) {
                    for (var key in this.Permiss.pointList) {
                        if (this.Permiss.pointList[key].checked == true) {
                            this.power.pointList.push(this.Permiss.pointList[key].id)
                        }
                    }
                    if (this.power.pointList.length == this.Permiss.pointList.length) {
                        this.Permiss.pointIsIndeterminate = false
                        this.Permiss.pointCheckAll = true
                    } else if (this.power.pointList.length == 0) {
                        this.Permiss.pointIsIndeterminate = false
                        this.Permiss.pointCheckAll = false
                    }
                }
                //客户管理获取当前被选中的id
                if (this.Permiss.customerList.length != 0) {
                    for (var key in this.Permiss.customerList) {
                        if (this.Permiss.customerList[key].checked == true) {
                            this.power.customerList.push(this.Permiss.customerList[key].id)
                        }
                    }
                    if (this.power.customerList.length == this.Permiss.customerList.length) {
                        this.Permiss.customerIsIndeterminate = false
                        this.Permiss.customerCheckAll = true
                    } else if (this.power.customerList.length == 0) {
                        this.Permiss.customerIsIndeterminate = false
                        this.Permiss.customerCheckAll = false
                    }
                }
                //方案管理获取当前被选中的id
                if (this.Permiss.giftList.length != 0) {
                    for (var key in this.Permiss.giftList) {
                        if (this.Permiss.giftList[key].checked == true) {
                            this.power.giftList.push(this.Permiss.giftList[key].id)
                        }
                    }
                    if (this.power.giftList.length == this.Permiss.giftList.length) {
                        this.Permiss.giftIsIndeterminate = false
                        this.Permiss.giftCheckAll = true
                    } else if (this.power.giftList.length == 0) {
                        this.Permiss.giftIsIndeterminate = false
                        this.Permiss.giftCheckAll = false
                    }
                }
                //空间管理获取当前被选中的id
                if (this.Permiss.orderList.length != 0) {
                    for (var key in this.Permiss.orderList) {
                        if (this.Permiss.orderList[key].checked == true) {
                            this.power.orderList.push(this.Permiss.orderList[key].id)
                        }
                    }
                    if (this.power.orderList.length == this.Permiss.orderList.length) {
                        this.Permiss.orderIsIndeterminate = false
                        this.Permiss.orderCheckAll = true
                    } else if (this.power.orderList.length == 0) {
                        this.Permiss.orderIsIndeterminate = false
                        this.Permiss.orderCheckAll = false
                    }
                }
                //系统管理获取当前被选中的id
                if (this.Permiss.systemList.length != 0) {
                    for (var key in this.Permiss.systemList) {
                        if (this.Permiss.systemList[key].checked == true) {
                            this.power.systemList.push(this.Permiss.systemList[key].id)
                        }
                    }
                    if (this.power.systemList.length == this.Permiss.systemList.length) {
                        this.Permiss.systemIsIndeterminate = false
                        this.Permiss.systemCheckAll = true
                    } else if (this.power.systemList.length == 0) {
                        this.Permiss.systemIsIndeterminate = false
                        this.Permiss.systemCheckAll = false
                    }
                }
                //其他管理获取当前被选中的id
                if (this.Permiss.otherList.length != 0) {
                    for (var key in this.Permiss.otherList) {
                        if (this.Permiss.otherList[key].checked == true) {
                            this.power.otherList.push(this.Permiss.otherList[key].id)
                        }
                    }
                    if (this.power.otherList.length == this.Permiss.otherList.length) {
                        this.Permiss.otherIsIndeterminate = false
                        this.Permiss.otherCheckAll = true
                    } else if (this.power.otherList.length == 0) {
                        this.Permiss.otherIsIndeterminate = false
                        this.Permiss.otherCheckAll = false
                    }
                }
            })
        },
        //监听ckeckbox的改变
        checkChange: function (val, id) {
        },

        //管理全选(通用)
        CheckAllChange: function (val, PermissList, powerList, pointName) {
            if (val) {
                PermissList.forEach((item, index) => {
                    item.checked == true
                    powerList.push(item.id)
                })

                if (pointName == 'pointList') {
                    this.Permiss.pointIsIndeterminate = false
                } else if (pointName == 'customerList') {
                    this.Permiss.customerIsIndeterminate = false
                } else if (pointName == 'giftList') {
                    this.Permiss.giftIsIndeterminate = false
                } else if (pointName == 'orderList') {
                    this.Permiss.orderIsIndeterminate = false
                } else if (pointName == 'systemList') {
                    this.Permiss.systemIsIndeterminate = false
                } else if (pointName == 'otherList') {
                    this.Permiss.otherIsIndeterminate = false
                }
            } else {
                PermissList.forEach((item, index) => {
                    item.checked == false
                })

                if (pointName == 'pointList') {
                    this.power.pointList = []
                } else if (pointName == 'customerList') {
                    this.power.customerList = []
                } else if (pointName == 'giftList') {
                    this.power.giftList = []
                } else if (pointName == 'orderList') {
                    this.power.orderList = []
                } else if (pointName == 'systemList') {
                    this.power.systemList = []
                } else if (pointName == 'otherList') {
                    this.power.otherList = []
                }
            }
        },
        pointCheckChange: function (value) {
            //console.log(value.length)
            let checkedCount = value.length;
            this.Permiss.pointCheckAll = checkedCount === this.Permiss.pointList.length;
            this.Permiss.pointIsIndeterminate = checkedCount > 0 && checkedCount < this.Permiss.pointList.length;
        },
        customerCheckChange: function (value) {
            //console.log(value.length)
            let checkedCount = value.length;
            this.Permiss.customerCheckAll = checkedCount === this.Permiss.customerList.length;
            this.Permiss.customerIsIndeterminate = checkedCount > 0 && checkedCount < this.Permiss.customerList.length;
        },
        giftCheckChange: function (value) {
            //console.log(value.length)
            let checkedCount = value.length;
            this.Permiss.giftCheckAll = checkedCount === this.Permiss.giftList.length;
            this.Permiss.giftIsIndeterminate = checkedCount > 0 && checkedCount < this.Permiss.giftList.length;
        },
        orderCheckChange: function (value) {
            //console.log(value.length)
            let checkedCount = value.length;
            this.Permiss.orderCheckAll = checkedCount === this.Permiss.orderList.length;
            this.Permiss.orderIsIndeterminate = checkedCount > 0 && checkedCount < this.Permiss.orderList.length;
        },
        systemCheckChange: function (value) {
            //console.log(value.length)
            let checkedCount = value.length;
            this.Permiss.systemCheckAll = checkedCount === this.Permiss.systemList.length;
            this.Permiss.systemIsIndeterminate = checkedCount > 0 && checkedCount < this.Permiss.systemList.length;
        },
        otherCheckChange: function (value) {
            //console.log(value.length)
            let checkedCount = value.length;
            this.Permiss.otherCheckAll = checkedCount === this.Permiss.otherList.length;
            this.Permiss.otherIsIndeterminate = checkedCount > 0 && checkedCount < this.Permiss.otherList.length;
        },
    }
}
</script>

<style lang="scss" scoped>
.contentTip {
    font-size: 12px;
    margin-left: 6px;
    color: #848484;
}
.detailClick {
    margin-left: 10px;
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
