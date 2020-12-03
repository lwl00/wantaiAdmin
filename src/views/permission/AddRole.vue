<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20">
                <el-col :span="24">
                    <!-- :rules="rules" -->
                    <el-form
                        :model="addForm"
                        ref="addForm"
                        label-width="100px"
                        class="demo-ruleForm"
                        :rules="rules"
                    >
                        <el-form-item label="角色编号" required size="small" prop="code">
                            <el-input
                                v-model="addForm.code"
                                placeholder="请输入编号"
                                class="pull-left"
                                style="width:200px;"
                                @change="_getAddRolesCode"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="角色名称" required size="small" prop="name">
                            <el-input
                                v-model="addForm.name"
                                placeholder="请输入名称"
                                class="pull-left"
                                style="width:200px;"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" size="small" prop>
                            <el-input
                                v-model="addForm.remark"
                                placeholder="请输入描述内容"
                                class="pull-left"
                                style="width:500px;"
                                :maxlength="50"
                            ></el-input>
                            <div class="pull-left contentTip">(限制50文字内)</div>
                        </el-form-item>
                        <el-form-item label="角色状态" required>
                            <el-radio-group
                                v-model="addForm.enableLoad"
                                class="pull-left lineHeight"
                            >
                                <el-radio :label="true">启用</el-radio>
                                <el-radio :label="false">禁用</el-radio>
                            </el-radio-group>
                            <div class="pull-left contentTip">（禁用后此角色的账号将同步禁用）</div>
                        </el-form-item>
                        <el-form-item label="角色权限" required>
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
                                        <!--  @change="customerCheckAllChange" -->
                                        <el-checkbox
                                            :indeterminate="Permiss.customerIsIndeterminate"
                                            v-model="Permiss.customerCheckAll"
                                            @change="CheckAllChange($event, Permiss.customerList, power.customerList, 'customerList')"
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
                                            @change="CheckAllChange($event, Permiss.giftList, power.giftList, 'giftList')"
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
                                            @change="CheckAllChange($event, Permiss.orderList, power.orderList, 'orderList')"
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
                                            @change="CheckAllChange($event, Permiss.systemList, power.systemList, 'systemList')"
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
                                            :indeterminate="Permiss.otherIsIndeterminate"
                                            v-model="Permiss.otherCheckAll"
                                            @change="CheckAllChange($event, Permiss.otherList, power.otherList, 'otherList')"
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
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="_addRolesDetail('addForm')"
                                size="small"
                                v-if="isAddPermission"
                                :loading="saveLoading"
                            >新增</el-button>
                            <!-- <el-button @click="addClose('addForm')"  size="small">取消</el-button> -->
                            <el-button @click="resetForm('addForm')" size="small">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { getAddRolesCode, addRolesDetail, getPermissions } from 'api/interface';

export default {
    components: {

    },
    name: "AddRole",
    data() {
        return {
            saveLoading: false,  // 确定新增
            addForm: {
                code: '',
                name: '',
                remark: '',
                enable: '',
                permissions: '',
                enableLoad: true
            },
            ruleForm: {
                name: '',
                describe: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            rules: {  //验证错误
                code: [{
                    required: true,
                    message: '请输入角色编号',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入角色名称',
                    trigger: 'blur'
                }],
                remark: [{
                    required: true,
                    message: '请输入角色描述',
                    trigger: 'blur'
                }],
            },

            isAddPermission: false,

            Permiss: {
                customerList: '',
                giftList: '',
                orderList: '',
                pointList: '',
                systemList: '',
                otherList: '',

                pointIsIndeterminate: false,
                customerIsIndeterminate: false,
                giftIsIndeterminate: false,
                orderIsIndeterminate: false,
                systemIsIndeterminate: false,
                otherIsIndeterminate: false,

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

                nullList: [],
            }
        }
    },
    created() {
        this._getPermissions()
        this.getPermissions()
    },
    mounted() {

    },
    methods: {
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("system:roles:create")) {
                this.isAddPermission = true
            } else {
                this.isAddPermission = false
            }
        },
        // 获取数据
        _addRolesDetail(formName) {
            this.saveLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        code: this.addForm.code,
                        name: this.addForm.name,
                        remark: this.addForm.remark,
                        enable: this.addForm.enableLoad,
                        permissions: []
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
                    addRolesDetail(params).then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            this.$refs[formName].resetFields()
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
        //取消
        addClose(formName) {
            this.$refs[formName].resetFields()
            this.$message('取消成功')
            this.$router.go(-1)
        },
        // 重置
        resetForm: function (formName) {
            this.$refs[formName].resetFields();
            this.$message('重置成功');
        },
        _getAddRolesCode: function (val) {
            var params = {
                code: val
            }
            getAddRolesCode(params).then(res => {
                if (res.data == null) {
                    this.addForm.code = val
                } else {
                    this.addForm.code = ''
                    this.$message('编号已重复,请重新输入')
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
                //console.log(this.Permiss.giftList.length != 0)

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
                //其他管理获取当前被选中的id
                if (this.Permiss.otherList.length != 0) {
                    for (var key in this.Permiss.otherList) {
                        if (this.Permiss.otherList[key].checked == true) {
                            this.power.otherList.push(this.Permiss.otherList[key].id)
                        }
                    }
                }
            })
        },
        checkChange: function (val) {
            //console.log(this.power.systemList)
        },
        customerListChange: function (val) {
            //console.log(this.power.customerList)
        },

        // 其中有两个属性来控制全选这个checkbox：indeterminate和checkAll。
        // indeterminate为false，checkAll为false的时候，状态为未选中。
        // indeterminate为true，checkAll为false的时候，状态为半选中。
        // indeterminate为false，checkAll为true的时候，状态为全选中。
        // 把全选框状态改为未选中状态，应该修改indeterminate和checkAll，均为false

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
