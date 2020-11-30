<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="19">
                    <el-form :inline="true" :model="search" ref="search" class="searchWarp" size="small">
                        <el-form-item label="站点：" prop="siteValue">
                            <el-select v-model="search.siteValue" class="w100">
                                <el-option
                                    v-for="item in search.siteData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>                                    
                        <el-form-item label="会员等级：" prop="customerLevelValue">
                            <el-select v-model="search.customerLevelValue" class="w100">
                                <el-option
                                    v-for="item in search.customerLevelData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户组：" prop="customerGroupsValue">
                            <el-select v-model="search.customerGroupsValue" class="w100">
                                <el-option
                                    v-for="item in search.customerGroupsData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>                        
                        <el-form-item label="积分状态：" prop="pointStateValue">
                            <el-select v-model="search.pointStateValue" class="w100">
                                <el-option
                                    v-for="item in search.pointStateData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>                        
                                              
                        <el-form-item label="客户账号：" prop="uid">
                            <el-input 
                                v-model="search.uid"
                                placeholder="请输入客户账号" 
                                class="w150"
                                maxlength="10"
                                @keyup.enter.native="_getSearch"
                                ></el-input>
                        </el-form-item>
                        <el-form-item label="客户名称：" prop="customerName">
                            <el-input
                                v-model="search.customerName"
                                placeholder="请输入客户名称"
                                class="w150"
                                @keyup.enter.native="_getSearch"></el-input>
                        </el-form-item>
                        <el-form-item label="ERP联系电话：" prop="cellphone">
                            <el-input
                                v-model="search.cellphone"
                                placeholder="请输入ERP联系电话"
                                class="w150"
                                maxlength="11"
                                @keyup.enter.native="_getSearch"></el-input>
                        </el-form-item>

                        <el-button type="primary" size="small" @click="_getSearch">查询</el-button>
                        <el-button type="info" size="small" @click="resetSearchForm('search')">重置</el-button>                            
                    </el-form>
                </el-col>
                <el-col :span="5" class="todoWarp">
                    <el-button type="primary" size="small" @click="dialogShow('addPointBlackDialog-model')">新增积分黑名单</el-button>
                    <el-button type="primary" icon="el-icon-download" size="small" @click="_getExport" >导出excel</el-button>
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
                                property=""
                                align="center"
                                label="客户ID">
                                <template slot-scope="scope">
                                    <span class="mianColor routerLink" @click="routerLinkPage('/memberManage/MemberDetail?uid='+scope.row.uid+'')">{{scope.row.uid}}</span>
                                </template>                                   
                            </el-table-column>
                            <el-table-column
                                property="customerName"
                                label="客户名称"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property="cellphone"
                                align="center"
                                label="ERP联系电话">
                            </el-table-column>
                            <el-table-column
                                property="companyName"
                                align="center"
                                label="所属站点">
                            </el-table-column>
                            <el-table-column
                                property="customerGroupName"
                                align="center"
                                label="客户组">
                            </el-table-column>
                            <el-table-column
                                property="memberLevelName"
                                label="会员等级"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property="pointStateName"
                                label="积分状态"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="可用积分"
                                align="center">
                                <template slot-scope="scope">
                                    <span class="mianColor routerLink" @click="routerLinkPage('/memberManage/MemberDetail?uid='+scope.row.uid+'')">{{scope.row.availableAmount}}</span>
                                </template>                                  
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="待入账积分"
                                align="center">
                                <template slot-scope="scope">
                                    <span class="mianColor routerLink" @click="routerLinkPage('/memberManage/MemberDetail?uid='+scope.row.uid+'')">{{scope.row.disabledAmount}}</span>
                                </template>                                
                            </el-table-column>
                            <el-table-column
                                property="expireAmount"
                                label="已过期积分"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property="historyGetAmount"
                                label="历史获的积分"
                                align="center">
                            </el-table-column>                            
                            <el-table-column
                                align="center"
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" @click="routerLinkPage('/memberManage/MemberDetail?uid='+scope.row.uid+'')">查看</el-button>
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
        </div>

        <!--======== 以下是弹出层 ========-->
        <!-- 新增积分黑名单 -->
        <dialogModel class="addPointBlackDialog-model" ref="addPointBlackDialog-model" :title="dialog.dialogTitle" :width="dialog.dialogWidth">
            <div class="dialog-model-content">
                <div class="warnWarp">加入黑名单后客户在客户端不可见所有积分系统相关的入口、图标、提示等所有展示，也不再参与积分的计算，可用积分将被冻结</div>
                <el-form :inline="true" :model="dialog" ref="dialog" :rules="rules" class="" size="small" label-width="100px">               
                    <el-form-item label="新增账号：" prop="uid">
                        <el-autocomplete
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
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="可用积分：" prop="">{{dialog.availableAmount}}积分</el-form-item>
                    <el-form-item label="待入账积分：" prop="">{{dialog.disabledAmount}}积分</el-form-item>
                    <el-form-item label="加入原因：" prop="addBlackReason" >
                        <el-input 
                            minlength="1"
                            maxlength="50"
                            type="textarea"
                            rows="4"
                            v-model="dialog.addBlackReason" 
                            placeholder="必填（50字内）"
                            class="w300"></el-input>
                    </el-form-item>

                </el-form>                 
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small" 
                    @click="add('dialog')"
                    :loading="addLoading">确定</el-button>

                <el-button size="small" @click="dialogHideMeg('addPointBlackDialog-model')">取消</el-button>
            </div>
        </dialogModel>

        <!-- 移入积分黑名单成功弹窗 -->
        <dialogModel class="addPointBlackSuccessDialog-model successDialog" ref="addPointBlackSuccessDialog-model" :title="dialog.dialogTitle" :width="dialog.dialogWidth">
            <div class="dialog-model-content"> 
                <div class="successNoteWarp">客户 <b class="errorColor">{{dialog.customerInfo.uid}} &nbsp; {{dialog.customerInfo.customerName}}</b> 已成功加入积分黑名单，其客户信息不再在积分会员列表显示。但其历史积分记录仍然保存，如需查看请进入积分黑名单会员列表。</div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('addPointBlackSuccessDialog-model')">知道了</el-button>
            </div>
        </dialogModel>                 
    </div>
</template>

<script type="text/ecmascript-6">
    import Dialog from 'base/Dialog';
    import { getUserList, getDictsData, customerOperate } from 'api/interface';
    import { deleteBlankSpace } from 'common/js/dom';

    export default {
        components: {
            'dialogModel': Dialog,
        },        
        name: "MemberBlack",
        data() {
            return {
                addLoading: false,  // 新增积分黑名单
                table: {
                    tableData: [],
                    totalPage: 20,
                    pageSize: 20,
                    pageNum: 1,
                    tableLoading: false,
                },
                search: {
                    siteData: [],
                    siteName: '',
                    siteValue: '',

                    customerLevelData: [],
                    customerLevelName: '',
                    customerLevelValue: '',

                    customerGroupsData: [],
                    customerGroupsName: '',
                    customerGroupsValue: '',

                    pointStateData: [],
                    pointStateName: '',
                    pointStateValue: '',

                    uid: '',
                    customerName: '',
                    cellphone: '', 
                },
                dialog: {
                    dialogWidth: '470px',
                    dialogTitle: '提示',
                    uid: '',
                    addBlackReason: '',
                    customerInfo: '',
                    availableAmount: 0,
                    disabledAmount: 0,
                },
                rules: {
                    uid: [
                        { required: true, message: '请选择新增账号', trigger: 'change' },
                        // {validator: validateUid, trigger: 'change' }
                    ],
                    addBlackReason: [
                        { required: true, message: '请完善原因', trigger: 'blur' }
                    ],
                },
                restaurants: [],               
                timeout:  null,              
            }
        },
        created() {
            this._getDictsData()
            this._getUserList(this.table.pageNum, this.table.pageSize);
        },
        mounted() {

        },
        methods: {
            // 数据字典
            _getDictsData: function() {
                // 站点
                var paramsSite = {
                    isAll: true,
                    code: 'CompanyCode'
                }
                getDictsData(paramsSite).then(res=> {
                    this.search.siteData = res.data
                })

                // 会员等级
                var paramsCustomerLevel = {
                    isAll: true,
                    code: 'CustomerLevel'
                }                
                getDictsData(paramsCustomerLevel).then(res=> {
                    this.search.customerLevelData = res.data
                }) 

                // 客户组
                var paramsCustomerGroups = {
                    isAll: true,
                    code: 'CustomerGroup'
                }                
                getDictsData(paramsCustomerGroups).then(res=> {
                    this.search.customerGroupsData = res.data
                }) 

                // 积分状态
                var paramsPointState = {
                    isAll: true,
                    code: 'PointState'
                }                
                getDictsData(paramsPointState).then(res=> {
                    this.search.pointStateData = res.data
                })                               

            },
            // 获取列表数据
            _getUserList: function(pageNum, pageSize) {
                var params = {
                    companyCode: this.search.siteValue,
                    memberLevel: this.search.customerLevelValue,
                    customerGroup: this.search.customerGroupsValue,
                    pointState: this.search.pointStateValue,
                    uid: deleteBlankSpace(this.search.uid),
                    customerName: deleteBlankSpace(this.search.customerName),
                    cellphone: deleteBlankSpace(this.search.cellphone),
                    pointBlack: true,
                    couponBlack: '',
                    pageNum: pageNum,
                    pageSize: pageSize,
                    export: false,
                    nameStr: '',
                    fieldStr: '',
                }

                this.table.tableLoading = true
                getUserList(params).then(res => {
                    this.table.tableLoading = false
                    if(res.status == 200) {
                        this.table.tableData = res.data.data
                        this.table.totalPage = res.pageVO.total
                    }
                })
            },

            // 查询条件重置
            resetSearchForm: function(formName) {     //点击重置
                this.$refs[formName].resetFields();
                this._getUserList(1, this.table.pageSize)
                this.$message('重置成功');
            },
            // 查询
            _getSearch: function() {            
                this._getUserList(1, this.table.pageSize);
            },
            // 导出
            _getExport: function() {
                var params = {
                    companyCode: this.search.siteValue,
                    memberLevel: this.search.customerLevelValue,
                    customerGroup: this.search.customerGroupsValue,
                    pointState: this.search.pointStateValue,
                    uid: deleteBlankSpace(this.search.uid),
                    customerName: deleteBlankSpace(this.search.customerName),
                    cellphone: deleteBlankSpace(this.search.cellphone),
                    pointBlack: true,
                    couponBlack: '',
                    pageNum: '',
                    pageSize: '',
                    export: true,
                    nameStr: '客户ID,客户名称,ERP联系电话,所属站点,客户组,会员等级,积分状态',
                    fieldStr: 'uid,customerName,cellphone,companyCode,customerGroup,memberLevel,pointState',
                }
                window.location.href = getUserList(params)
            },            
            // 每页显示条数
            handleSizeChange: function(val) {
                this.table.pageSize = val
                this._getUserList(this.table.pageNum, this.table.pageSize);
            },
            // 翻页
            handleCurrentChange: function(val) {
                this.table.pageNum = val
                this._getUserList(this.table.pageNum, this.table.pageSize);
            },
            // 跳转页面
            routerLinkPage: function(index) {
                this.$router.push(index)  
            },
            // 显示弹窗
            dialogShow: function(type) {
                this.$refs[type].showModel();
            },
            // 关闭弹窗
            dialogHideMeg: function(type) {
                this.$refs[type].hideModel();
                this.$refs['dialog'].resetFields();
                this.dialog.availableAmount = 0
                this.dialog.disabledAmount = 0
                this.$message('已取消加入')                
            },
            // 关闭弹窗（知道了按钮）
            dialogHide: function(type, info) {
                this.$refs[type].hideModel();               
            },                       
            // 模糊查询非黑名单账号数据（延迟3秒）
            querySearch(queryString, cb) {
                var params = {
                    companyCode: '',
                    memberLevel: '',
                    customerGroup: '',
                    pointState: '',
                    uid: queryString,
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
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    getUserList(params).then(res => {
                        if(res.status == 200) {
                            res.data.data.forEach(function(el, index) {
                                el.value = el.uid
                            });
                            this.restaurants = res.data.data
                            cb(this.restaurants);                            
                        }
                    })
                }, 1500 * Math.random());
            },
            // 下拉框选择账号
            handleSelect(item) {
                this.dialog.customerInfo = item
                this.dialog.availableAmount = item.availableAmount
                this.dialog.disabledAmount = item.disabledAmount                
            },
            // 确定添加
            add: function(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) { 
                        var params = {
                            uid: this.dialog.uid,
                            customerOperate: 'JOINPOINTBLACK',
                            remark: deleteBlankSpace(this.dialog.addBlackReason),
                        }
                        this.addLoading = true
                        customerOperate(params).then(res => {
                            if(res.status == 200) {
                                this.$refs['addPointBlackDialog-model'].hideModel();        
                                this.$refs['addPointBlackSuccessDialog-model'].showModel(); 
                                this._getUserList(this.table.pageNum, this.table.pageSize);
                            }else {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            }  
                            this.addLoading = false                          
                        })                 
                    }else {
                        this.$message({
                            message: '请完善信息',
                            type: 'warning'
                        })
                        return false;
                    }
                });                
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