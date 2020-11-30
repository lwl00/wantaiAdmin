<template>
   <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="20" class="searchToolbar">
                <el-col :span="21">
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
                                @keyup.enter.native="_getSearch"></el-input>
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
                        
                        <el-form-item>
                            <el-button type="primary" @click="_getSearch">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="info" @click="resetSearchForm('search')">重置</el-button>
                        </el-form-item>                        
                        
                    </el-form>            
                </el-col>
                <el-col :span="3" class="todoWarp">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addDialogShow" v-if="isAddPermission">新增</el-button>
                    <el-button type="primary" icon="el-icon-download" size="small" @click="_getExport">导出excel</el-button>
                </el-col>                
            </el-row>

            <el-row :gutter="20" class="">
                <el-col :span="24">
                    <div class="cmyyTable">
                        <el-table
                            :data="table.tableData"
                            stripe
                            highlight-current-row
                            v-loading="table.tableLoading">
                            <el-table-column
                                type="index"
                                width="50"
                                :index="getIndex"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="客户账号"
                                align="center">  
                                <template slot-scope="scope">
                                    <span class="mianColor routerLink" @click="routerLinkPage('/memberManage/MemberDetail?uid='+scope.row.customerId.uid+'')">{{scope.row.customerId.uid}}</span>
                                </template>   
                            </el-table-column>
                            <el-table-column
                                property="customerId.customerName"
                                label="客户名称"
                                align="center">                 
                            </el-table-column>
                            <el-table-column
                                property="customerId.cellphone"
                                label="ERP联系电话"
                                align="center">                 
                            </el-table-column>
                            <el-table-column
                                property="customerId.companyName"
                                label="所属站点"
                                align="center">      
                            </el-table-column>
                            <el-table-column
                                property="customerId.customerGroupName"
                                label="客户组"
                                align="center">      
                            </el-table-column>
                            <el-table-column
                                property="unusedQuantity"
                                label="未使用券"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property="usedQuantity"
                                label="已使用券"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property="expiredQuantity"
                                label="已过期券"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="移入黑名单时间"
                                align="center"
                                width="150"
                                :formatter="formatterDateBlackTime">
                            </el-table-column>
                            <el-table-column
                                property="blackReason"
                                label="移入原因"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                property=""
                                label="操作"
                                align="center"
                                width="200">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="mini" @click="routerLinkPage('/memberManage/MemberDetail?uid='+scope.row.customerId.uid+'')">查看</el-button>
                                    <el-button type="" size="mini" @click="delDialogShow(scope.$index, scope.row)">移出黑名单</el-button>
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
        <!-- 移出优惠券黑名单确认弹窗 -->
        <dialogModel class="delDialog-model" ref="delDialog-model" :title="dialog.delTitle" :width="dialog.delWidth">
            <div class="dialog-model-content">
                移出黑名单后，客户将可继续获得、使用优惠券，其原有优惠券也继续按原有效期生效。是否确认将客户 <b class="errorColor">{{dialog.currentCustomerUid}}</b> <b class="errorColor">{{dialog.currentCustomerName}}</b> 移出优惠券黑名单，恢复为其优惠券功能？
            </div>
            <div class="dialog-model-footer">
                <el-button 
                    type="primary"
                    size="small"
                    @click="_delBlackCustomers"
                    :loading="delBlackCustomersLoading">确定</el-button>
                <el-button size="small" @click="dialogHideMeg('delDialog-model', '移出')">取消</el-button>
            </div>
        </dialogModel>

        <!-- 移出优惠券黑名单成功弹窗 -->
        <dialogModel class="delCouponsBlackSuccessDialog-model successDialog" ref="delCouponsBlackSuccessDialog-model" :title="dialog.delSuccessTitle" :width="dialog.addSuccessWidth">
            <div class="dialog-model-content"> 
                <div class="successNoteWarp">客户 <b class="errorColor">{{dialog.currentCustomerUid}} &nbsp;{{dialog.currentCustomerName}} </b> 已成功移出优惠券黑名单，其优惠券已恢复正常使用。</div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('delCouponsBlackSuccessDialog-model')">知道了</el-button>
                <el-button type="primary" size="mini" @click="viewCouponsInfoDel('/memberManage/MemberDetail?uid='+dialog.currentCustomerUid+'')">查看其优惠券</el-button>
            </div>
        </dialogModel> 

        <!-- 新增 -->
        <dialogModel class="addDialog-model" ref="addDialog-model" :title="dialog.addTitle" :width="dialog.addWidth">
            <div class="dialog-model-content" v-loading="dialog.loading">
                <div class="warnWarp">
                    <img src="~common/images/warn.png" alt=""> 客户加入黑名单后将不可使用、获得优惠券
                </div>
                <el-form :inline="true" :model="dialog" ref="dialog" :rules="rules" class="" size="small" label-width="140px">
                    <el-form-item label="新增黑名单账号：" prop="uid">
                        <el-autocomplete 
                            popper-class="my-autocomplete"
                            v-model="dialog.uid" 
                            :fetch-suggestions="querySearch" 
                            @select="handleSelect"
                            placeholder="请输入或选择新增账号"
                            class="w300"
                            @keyup.native="timeoutGetUserCouponsnumMoney"
                            @keyup.enter.native="_getUserCouponsnumMoney">
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                                <span class="addr">{{ item.customerName }}</span>
                            </template>                                
                        </el-autocomplete>                        
                    </el-form-item>                    
                    <el-form-item label="客户未使用优惠券：" prop=""> 
                        <span>{{dialog.unUsedQuantity}}张</span>
                        <span>合计￥{{dialog.unUsedPrice}}</span>
                    </el-form-item>
                    <el-form-item label="加入原因：" prop="blackReason" style="margin-bottom: 0"> 
                        <el-input 
                            type="textarea"
                            rows="4"
                            v-model="dialog.blackReason" 
                            placeholder="必填（50字内）"
                            style="width: 390px;"></el-input>
                    </el-form-item>

                </el-form>               
            </div>
            <div class="dialog-model-footer">
                <el-button type="primary" size="small" @click="_addBlackCustomers('dialog')" :loading="addBlackLoading">加入优惠券黑名单</el-button>
                <el-button size="small" @click="dialogHideMeg('addDialog-model', '新增')">取消</el-button>
            </div>
        </dialogModel> 

        <!-- 新增成功提示 -->
        <dialogModel class="addSuccessDialog-model" ref="addSuccessDialog-model" :title="dialog.addSuccessTitle" :width="dialog.addSuccessWidth">
            <div class="dialog-model-content">
                客户 <b class="errorColor">{{addResultUid}} </b> <b class="errorColor">{{addResultCustomerName}}</b> 已成功加入优惠券黑名单，其已有优惠券不可使用，也不可获得新优惠券。
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('addSuccessDialog-model')">知道了</el-button>
                <el-button type="primary" size="mini" @click="viewCouponsInfoAdd('/memberManage/MemberDetail?uid='+dialog.customerInfo.uid+'')">查看其优惠券</el-button>
            </div>
        </dialogModel>        
    </div>
</template>

<script type="text/ecmascript-6">
    import { formatDateTimes, dateToStamp, deleteBlankSpace, onlineDateTime, todayEndTime } from 'common/js/dom';
    import { getDictsData, getCouponsToBlackCustomers, delBlackCustomers, customerOperate, getUserList, getUserCouponsnumMoney } from 'api/interface';
    import Dialog from 'base/Dialog';

    export default {
        components: {
            'dialogModel': Dialog,
        },      
        name: "CouponsToBlackCustomers",
        data() {
            return {  
                delBlackCustomersLoading: false,  // 移出优惠券黑名单         
                addBlackLoading: false,  // 添加优惠券黑名单         
                table: {
                    tableData: [],
                    totalPage: 20,
                    pageSize: 20,
                    pageNum: 1,
                    tableLoading: false,                    
                },
                search: {
                    siteData: [],  // 站点数组
                    siteName: '',  // 选中站点中文名
                    siteValue: '', // 选中站点code

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
                    delTitle: '移出黑名单',
                    delWidth: '400px',                    
                    currentCustomerUid: '1001201001',
                    currentCustomerName: '佛山南海张三药房',

                    loading: false,
                    addTitle: '新增黑名单',
                    addWidth: '600px',
                    uid: '',// 已选客户uid
                    customerInfo: '', // 已选客户信息                    
                    unUsedQuantity: 0, // 已选客户未使用优惠券数量
                    unUsedPrice: 0, // 已选客户未使用金额
                    blackReason: '', // 新增原因
                    dialogData: [],//全部数据
                    dialogSelectData: [], //下拉框数据                       

                    delSuccessTitle: '移出成功',
                    addSuccessTitle: '新增成功',
                    addSuccessWidth: '400px',

                },
                rules: {
                    uid: [
                        { required: true, message: '请选择新增账号', trigger: 'change' },
                    ],                    
                    blackReason: [
                        { required: true, message: '请输入加入原因', trigger: 'blur' }
                    ],                    
                },
                addResultUid: '',
                addResultCustomerName: '',

                isAddPermission: false,  // 新增按钮权限
                isEditPermission: false,  // 编辑按钮权限
                isDeletePermission: false,  // 删除按钮权限                

            }
        },
        created() {            
            this._getDictsData()
            this.getPermissions()
            this._getCouponsToBlackCustomers(this.table.pageNum, this.table.pageSize);
        },    
        mounted(){

        },   
        methods: {
            // 查询数据字典
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
            // 页面权限
            getPermissions: function() {
                var permissionsBtnArr = localStorage.getItem("permissionsBtn"); 
                if(permissionsBtnArr.includes("operation:couponsToBlackCustomers:create")) {  
                    this.isAddPermission = true
                }else {
                    this.isAddPermission = false
                }
                if(permissionsBtnArr.includes("operation:couponsToBlackCustomers:update")) {  
                    this.isEditPermission = true
                }else {
                    this.isEditPermission = false
                }
                if(permissionsBtnArr.includes("operation:couponsToBlackCustomers:delete")) {  
                    this.isDeletePermission = true
                }else {
                    this.isDeletePermission = false
                }
            },                      
            // 获取表格数据
            _getCouponsToBlackCustomers: function(pageNum, pageSize) {
                var params = {
                    companyCode: this.search.siteValue,
                    level: this.search.customerLevelValue,
                    groups: this.search.customerGroupsValue,
                    pointStatus: this.search.pointStateValue,
                    customerUid: deleteBlankSpace(this.search.uid),
                    customerName: deleteBlankSpace(this.search.customerName),
                    customerPhone: deleteBlankSpace(this.search.cellphone),
                    pageNum: pageNum,
                    pageSize: pageSize,
                    export: false,
                    nameStr: '',
                    fieldStr: '',
                }

                this.table.tableLoading = true
                getCouponsToBlackCustomers(params).then(res=> {
                    this.table.tableLoading = false
                    if(res.status == 200) {
                        this.table.tableData = res.data
                        this.table.totalPage = res.pageVO.total
                    }
                })
            },
            // 导出
            _getExport: function() {
                var params = {
                    companyCode: this.search.siteValue,
                    level: this.search.customerLevelValue,
                    groups: this.search.customerGroupsValue,
                    pointStatus: this.search.pointStateValue,
                    customerUid: deleteBlankSpace(this.search.uid),
                    customerName: deleteBlankSpace(this.search.customerName),
                    customerPhone: deleteBlankSpace(this.search.cellphone),
                    pageNum: '',
                    pageSize: '',
                    export: true,
                    nameStr: '客户账号,客户名称,ERP联系电话,所属站点,客户组,未使用券,已使用券,已过期券,移入黑名单时间,移入原因',
                    fieldStr: 'customerId.uid,customerId.customerName,customerId.cellphone,customerId.companyName,customerId.customerGroupName,unusedQuantity,usedQuantity,expiredQuantity,blackTime,blackReason',

                    //客户账号(customerId.uid)  客户名称(customerId.customerName) ERP联系电话(customerId.cellphone) 所属站点(customerId.companyName) 客户组(customerId.customerGroupName) 
                }
        
                window.location.href = getCouponsToBlackCustomers(params)
            },          
            // 查询条件重置
            resetSearchForm: function(formName) {
                this.$refs[formName].resetFields();
                this._getCouponsToBlackCustomers(1, this.table.pageSize)
                this.$message('重置成功');
            },
            // 查询
            _getSearch: function() {
                this._getCouponsToBlackCustomers(1, this.table.pageSize)
            },
            // 每页显示条数
            handleSizeChange: function(val) {
                this.table.pageSize = val
                this._getCouponsToBlackCustomers(this.table.pageNum, this.table.pageSize);
            },
            // 翻页
            handleCurrentChange: function(val) {
                this.table.pageNum = val
                this._getCouponsToBlackCustomers(this.table.pageNum, this.table.pageSize);
            }, 
            //分页序号
            getIndex: function(index) {      
                return (this.table.pageNum - 1) * this.table.pageSize + index + 1
            },                                            
            // 格式化日期--移入黑名单时间
            formatterDateBlackTime: function(row, column) {
                return formatDateTimes(row.blackTime)
            }, 
            // 跳转页面(新增、查看、编辑)
            routerLinkPage: function(index) {
                this.$router.push(index)  
            },
            // 关闭弹窗（取消）
            dialogHideMeg: function(type, info) {
                this.$refs[type].hideModel();
                this.$message('已取消'+info)        
                if(type == 'addDialog-model') {
                    this.$refs['dialog'].resetFields();
                }        
            },                      
            // 关闭弹窗（知道了）
            dialogHide: function(type) {
                this.$refs[type].hideModel();
            },            
            // 删除弹窗显示
            delDialogShow: function(index, row) {
                this.$refs['delDialog-model'].showModel();
                this.dialog.currentCustomerUid = row.customerId.uid
                this.dialog.currentCustomerName = row.customerId.customerName
            },
            // 确定删除
            _delBlackCustomers: function() {
                var params = {
                    uid: this.dialog.currentCustomerUid,
                    customerOperate: 'REMOVECOUPONBLACK',
                    remark: '',
                }
                this.delBlackCustomersLoading = true
                customerOperate(params).then(res => {
                    if(res.status == 200) {
                        this.dialogHide('delDialog-model')
                        this.$refs['delCouponsBlackSuccessDialog-model'].showModel();
                        this._getCouponsToBlackCustomers(1, this.table.pageSize)
                    }else {
                        this.dialogHide('delDialog-model')
                        this.$message({
                            message: '请求失败',
                            type: 'error'
                        })
                        return false;
                    }
                    this.delBlackCustomersLoading = false                      
                })                            
            },  
            // 查看优惠券详情(删除成功后)
            viewCouponsInfoDel: function(index) {
                this.dialogHide('delCouponsBlackSuccessDialog-model')
                this.routerLinkPage(index)                
            },
            // 新增黑名单弹窗显示
            addDialogShow: function() {
                this.$refs['addDialog-model'].showModel();
                this.dialog.loading = true;
                var params = {
                    companyCode: '',
                    memberLevel: '',
                    customerGroup: '',
                    pointState: '',
                    uid: '',
                    customerName: '',
                    cellphone: '',
                    pointBlack: '',
                    couponBlack: false,
                    pageNum: 1,
                    pageSize: 9999,
                    export: false,
                    nameStr: '',
                    fieldStr: '',
                }
                getUserList(params).then(res => {
                    this.dialog.loading = false
                    if(res.status == 200) {
                        // el-autocomplete元素要求数组内是对象，且有value属性，此处做一个格式调整
                        res.data.data.forEach(function(el, index) {
                            el.value = el.uid
                        });                        
                        this.dialog.dialogData = res.data.data
                        this.dialog.dialogSelectData = res.data.data
                    }
                })
            },
            // 确定新增
            _addBlackCustomers: function(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {                        
                        var params = {
                            uid: this.dialog.uid,
                            customerOperate: 'JOINCOUPONBLACK',
                            remark: deleteBlankSpace(this.dialog.blackReason),
                        }
                        this.addBlackLoading = true
                        customerOperate(params).then(res => {
                            this.addBlackLoading = false
                            if(res.status == 200) {
                                this.addResultUid = res.data.uid
                                this.addResultCustomerName = res.data.customerName
                                this.dialogHide('addDialog-model')
                                this.$refs['addSuccessDialog-model'].showModel();  
                                this._getCouponsToBlackCustomers(1, this.table.pageSize)
                            }else {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            }                           
                        })                        

                    }else {
                        this.$message({
                            message: '请完善信息',
                            type: 'warning'
                        })
                        return false;
                    }
                });
            },
            // 查看优惠券详情(新增成功后)
            viewCouponsInfoAdd: function(index) {
                this.dialogHide('addSuccessDialog-model')
                this.routerLinkPage(index)                
            },
            // 模糊查询客户名单账号数据（延迟3秒）
            querySearch(queryString, cb) {
                var dialogSelectData = this.dialog.dialogSelectData;
                cb(dialogSelectData)                
            },
            // 输入完整账号时，查询客户未使用的优惠券数量和金额
            timeoutGetUserCouponsnumMoney: function() {
                if(this.dialog.uid.length == 10) {
                    this._getUserCouponsnumMoney()
                }
            },            
            // 下拉框选择账号
            handleSelect(item) {
                this.dialog.customerInfo = item                  
                console.log(item)
                this._getUserCouponsnumMoney()
            },
            // 根据客户编码，查询客户未使用的优惠券数量和金额
            _getUserCouponsnumMoney: function() {
                var params = {
                    uid: this.dialog.uid
                }                
                getUserCouponsnumMoney(params).then(res => {
                    if(res.status == 200) {
                        this.dialog.unUsedQuantity = res.data.unUsedQuantity                      
                        this.dialog.unUsedPrice = res.data.unUsedPrice                      
                    }
                })                
            }
            
        },
        watch: {
            // 'dialog.uid': {
            //     handler(curVal, oldVal){
            //         if (curVal == '') {
            //             this.dialog.unUsedQuantity = 0
            //             this.dialog.unUsedPrice = 0
            //         }
            //     },
            // },
            'dialog.uid': {
                handler: function(curVal, oldVal) {
                    this.dialog.dialogSelectData = [];//这是定义好的用于存放下拉提醒框中数据的数组
                    var len = this.dialog.dialogData.length;//dialogData是页面初始化时得到的初始全部数据
                    var arr = [];
                    for (var i = 0; i < len; i++) {//根据输入框中uid的值进行模糊匹配
                        if (this.dialog.dialogData[i].uid.indexOf(this.dialog.uid) >= 0) {
                            arr.push(this.dialog.dialogData[i]);//符合条件的值都放入arr中
                        }
                    }                  
                    
                    this.dialog.dialogSelectData = arr
                    console.log(this.dialog.dialogSelectData)

                    if (curVal == '') {
                        this.dialog.unUsedQuantity = 0
                        this.dialog.unUsedPrice = 0
                    }                    
                }
            }          
        }
    }   
</script>

<style lang="scss" scoped>
    .addDialog-model {
        .warnWarp {
            color: #ff6700;
            font-size: 12px;
            margin-bottom: 15px;
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
