<template>
    <div class="app-container">
        <div class="filter-container">
            <div ref="searchToolbar" class="searchToolbar">
                <Search
                    :buttonList="buttonList"
                    :searchOptions="searchOptions"
                    @search="_getSearch"
                    @reset="resetSearchForm"
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

        <!-- 批量修改 -->
        <dialogModel
            class="dialog-model"
            ref="dialog-model-modify"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content operation">
                <el-form :model="modifyForm" size="small" :rules="modifyRules" ref="modifyForm">
                    <el-form-item
                        label="礼品站点:"
                        :label-width="formLabelWidth"
                        class="text-left"
                        prop="siteValue"
                    >
                        <el-select v-model="modifyForm.siteValue" class="w180">
                            <el-option
                                v-for="item in modifyForm.siteData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="礼品编号:"
                        class="text-left"
                        :label-width="formLabelWidth"
                        prop="applyProductCodes"
                    >
                        <el-input
                            type="textarea"
                            rows="4"
                            v-model="modifyForm.applyProductCodes"
                            class="w300"
                            placeholder="请输入礼品编号如000041,000044"
                            @change="applyProductCodesChange"
                            :disabled="true"
                        ></el-input>
                        <!-- :disabled="true" -->
                        <div style="color: #999">必须输入/导入所选站点的礼品；礼品ID间用逗号隔开</div>
                    </el-form-item>
                    <el-form-item class="inputInline" style="display: block; margin-left:120px;">
                        <el-upload
                            name="file"
                            class="upload-demo"
                            :action="addRulesAPPOINTAction"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="handleRemove"
                            :file-list="modifyForm.fileList1"
                            :on-success="handleSuccessPreviary"
                            :on-error="handleErrorPreviary"
                            :on-change="handleFileChange"
                            width="200px"
                            :multiple="false"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <span slot="tip" class="el-upload__tip">
                                <span>当前礼品数为 {{uploadCodesLength}} 个</span>
                                <span
                                    class="mianColor applyProductView"
                                    @click="_applyProductView"
                                >查看礼品</span>
                            </span>
                        </el-upload>
                    </el-form-item>
                    <el-form-item
                        label="批量移至分类:"
                        class="text-left"
                        :label-width="formLabelWidth"
                        size="small"
                        prop="categoryValue"
                    >
                        <el-select v-model="modifyForm.categoryValue" class="w180">
                            <el-option
                                v-for="item in dialog.categoryData"
                                :key="item.value"
                                :label="item.categoryName"
                                :value="item.categoryName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="_editGifeChange('dialog-model-modify', 'modifyForm')"
                >确定</el-button>
                <el-button size="small" @click="modifyClose('dialog-model-modify', 'modifyForm')">取消</el-button>
            </div>
        </dialogModel>

        <!-- 查看，出现重复code商品 -->
        <dialogModel
            class="applyProductView-model successDialog"
            ref="applyProductView-model"
            :title="dialog.dialogViewTitle"
            :width="dialog.dialogViewWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    已上传
                    <b class="errorColor">{{dialog.viewProductSize}}</b> 个礼品
                </div>
                <div class="cmyyTable">
                    <el-table
                        :data="dialog.viewTableData"
                        stripe
                        highlight-current-row
                        height="350"
                        v-loading="dialog.viewTableLoading"
                    >
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column property label="礼品编号" align="center">
                            <template slot-scope="scope">
                                <span
                                    :class="scope.row.giftTypeName ? '' : 'errorColor' "
                                >{{scope.row.giftCode}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column property label="礼品名称" align="center">
                            <template slot-scope="scope">
                                <span
                                    :class="scope.row.giftName ? '' : 'errorColor' "
                                >{{scope.row.giftName ? scope.row.giftName : '暂无该礼品信息'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="giftTypeName" label="礼品类型" align="center"></el-table-column>
                        <el-table-column property="statusName" label="状态" align="center"></el-table-column>
                        <el-table-column property label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="danger"
                                    size="mini"
                                    @click="delViewCode(scope.row)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('applyProductView-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 批量修改后提示没有找到积分礼品积分的编号 -->
        <dialogModel
            class="isGiftCodeDialog-model successDialog"
            ref="isGiftCodeDialog-model"
            :title="dialog.dialogTitle"
            :width="dialog.isdialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">{{dialog.message}}</div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="isDialogHide('isGiftCodeDialog-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 保存时验证指定礼品编号是否正确 -->
        <dialogModel
            class="check-model successDialog"
            ref="check-model"
            :title="dialog.dialogTitle"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <div class="successNoteWarp">
                    <b class="errorColor">{{dialog.giftCodeReset}}</b>找不到该礼品编号,请到
                    <span class="mianColor">查看礼品</span>编辑正确的礼品编号再来确定
                </div>
            </div>
            <div class="dialog-model-footer">
                <el-button size="small" @click="dialogHide('check-model')">知道了</el-button>
            </div>
        </dialogModel>

        <!-- 批量导入积分礼品 -->
        <dialogModel
            class="check-model successDialog"
            ref="batch-gift-model"
            title="批量导入积分礼品"
            :width="dialog.dialogWidth"
        >
            <div class="dialog-model-content">
                <el-upload
                    name="file"
                    class="upload-demo"
                    :action="addGiftAPPOINTAction"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleBatchRemove"
                    :file-list="batchForm.fileList1"
                    :on-success="handleSuccesBatch"
                    :on-error="handleErrorBatch"
                    :on-change="handleFileChange"
                    width="200px"
                    :multiple="false"
                >
                    批量导入积分礼品：
                    <el-button size="small" type="primary">点击上传</el-button>
                    <span slot="tip" class="el-upload__tip"></span>
                </el-upload>
                <div class="tipContent" v-if="batchForm.batchData">
                    <p>
                        成功导入礼品：
                        <span class="mianColor">{{batchForm.batchData.importNumSucc}}</span>&nbsp;品种
                    </p>
                    <p>
                        导入失败：
                        <span class="errorColor">{{batchForm.batchData.importNumFail}}</span>&nbsp;品种
                    </p>
                    <p>
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
import Table from '@/components/Table'
import Search from '@/components/Search'
import Dialog from 'base/Dialog';
import { formatSearch, calculateTableHeight, routerLinkPage, tableBtnPermissions } from 'common/js/dom';
import { getDictsData, getIntegralGift, getGiftType, getGiftClass, editGifeChange, addRulesAPPOINTAction, isGiftCode, addGiftAPPOINTAction } from 'api/interface';
export default {
    components: {
        Table,
        Search,
        'dialogModel': Dialog,
    },
    name: "IntegralGift",
    data() {
        return {
            addRulesAPPOINTAction: addRulesAPPOINTAction(),     //批量修改产品上传商品 action
            addGiftAPPOINTAction: addGiftAPPOINTAction(),
            isExcel: false,
            uploadCodesLength: 0,
            table: {
                title: [
                    {
                        label: '商品编号',
                        field: 'productCode',
                        type: 'link',
                        width: 100,
                        click: this.handleDblclick
                    },
                    {
                        label: '商品名称',
                        width: 150,
                        field: 'productName',
                    },
                    {
                        label: '礼品描述',
                        width: 200,
                        field: 'remark',
                    },
                    {
                        label: '厂家',
                        field: 'ean',
                    },
                    {
                        label: '站点',
                        width: 80,
                        field: 'companyCode',
                    },
                    {
                        label: '电商线上标识',
                        width: 120,
                        field: 'onlineFlagName',
                    },
                    {
                        label: '库存',
                        width: 80,
                        field: 'realStock',
                    },
                    {
                        label: '所需积分',
                        width: 80,
                        field: 'point',
                    }, {
                        label: '上架状态',
                        width: 80,
                        field: 'statusName',
                    }, {
                        label: '浏览量',
                        width: 80,
                        field: 'browseCount',
                    }, {
                        label: '兑换量',
                        width: 80,
                        field: 'exchangeCount',
                    },
                    {
                        label: '操作',
                        field: '',
                        width: 200,
                        type: 'operat',
                        options: [
                            { name: '查看', type: 'view', show: true, click: this.handleItem },
                            { name: '编辑', type: 'update', show: true, click: this.handleUpdate }
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
                    show: false,       //根据权限来显示
                    loading: false,
                    click: this.handleAdd,
                },
                {
                    name: 'edit',
                    type: 'primary',
                    icon: 'el-icon-edit',
                    text: '批量导入积分礼品',
                    class: '',
                    show: true,
                    loading: false,
                    click: this.editModify,
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
            searchOptions: [{
                label: '商品编号',
                field: 'productCode',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '商品名称',
                field: 'productName',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '礼品描述',
                field: 'remark',
                value: '',
                type: 'input',
                options: [],
            }, {
                label: '生产厂家',
                field: 'ean',
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
                label: '电商线上标识',
                field: 'onlineFlag',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '上架状态',
                field: 'status',
                value: '',
                type: 'select',
                options: [],
            }],
            search: {},
            batchForm: {        //批量导入积分礼品
                fileList1: [],
                batchData: null,
            },
            dialog: {
                dialogTitle: '批量修改礼品分类',    //编辑弹窗标题
                addTitle: '新增',      //新增弹窗标题
                dialogWidth: '544px',   //弹窗宽度
                categoryData: [],
                isdialogWidth: '400px',

                dialogViewWidth: '800px',
                dialogViewTitle: '提示',
                viewProductSize: 0,
                viewTableData: [],
                viewTableLoading: false,

                message: '',
                giftCodeReset: '',  //重复礼品编号
            },
            modifyForm: {       //批量修改
                siteValue: '',
                siteData: [],
                giftId: '',
                categoryValue: '',
                fileList1: [],
                applyProductCodes: '',
            },
            formLabelWidth: '120px',     //弹出框的label宽度

            modifyRules: {
                siteValue: [{
                    required: true,
                    message: '请选择礼品站点',
                    trigger: 'change'
                }],
                categoryValue: [{
                    required: true,
                    message: '请选择移至分类',
                    trigger: 'change'
                }],
                applyProductCodes: [{
                    required: true,
                    message: '请输入礼品编号',
                    trigger: 'blur'
                }],
            },
        }
    },
    created() {
        if (this.$route.query.category != undefined) {
            this.search.category = this.$route.query.category
        } else {
            this.search.category = ''
        }
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        this.getPermissions()
        this._getIntegralGift(this.table.pageNum, this.table.pageSize)
    },
    mounted() {

    },
    methods: {
        //获取下拉站点  状态
        _getDictsData: function () {
            // 下拉站点
            let companyCodeParams = {
                isAll: true,
                code: 'CompanyCode'
            }
            getDictsData(companyCodeParams).then(res => {
                this.searchOptions.filter(item => item.field === 'companyCode')[0].options = res.data
            })

            // 下拉状态
            let statusParams = {
                isAll: true,
                code: 'GiftStatus'
            }
            getDictsData(statusParams).then(res => {
                this.searchOptions.filter(item => item.field === 'status')[0].options = res.data
            })

            //电商线上标识
            let onlineFlagParams = {
                isAll: true,
                code: 'OnlineFlag'
            }
            getDictsData(onlineFlagParams).then(res => {
                this.searchOptions.filter(item => item.field === 'onlineFlag')[0].options = res.data
            })

            //批量分类
            // let editCategoryParams = {
            //     isAll: false,
            //     status: '',
            //     category: '',
            // }
            // getGiftClass(editCategoryParams).then(res => {
            //     this.dialog.categoryData = res.data
            // })
            //批量站点
            let editCompanyCodeParams = {
                isAll: false,
                code: 'CompanyCode'
            }
            getDictsData(editCompanyCodeParams).then(res => {
                this.modifyForm.siteData = res.data
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("point:pointProduct:create")) {
                console.log('111111')
                this.buttonList.filter(item => item.name === 'add')[0].show = true
            } else {
                console.log('222222')
                this.buttonList.filter(item => item.name === 'add')[0].show = false
            }
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("point:pointProduct:update"))
        },
        //获取列表
        _getIntegralGift: function (pageNum, pageSize) {
            let params = this.search
            params.pageNum = pageNum
            params.pageSize = pageSize
            this.table.tableLoading = true
            getIntegralGift(params).then(res => {
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
            params.companyCode = ''
            params.category = ''
            params.giftTypeCode = ''
            params.pageNum = ''
            params.pageSize = ''
            params.export = true
            params.nameStr = '礼品编号,站点,礼品类型,所属分类,礼品名称,通用礼品名称,兑换积分,礼品库存,礼品状态'
            params.fieldStr = 'giftCode,companyName,giftTypeName,category,remark,giftName,point,realStock,statusName'
            //站点,礼品类型,所属分类,(导出没有值)

            window.location.href = getIntegralGift(params)
        },
        // 查询条件重置
        resetSearchForm: function (e) {
            this.search = e
            this._getIntegralGift(1, this.table.pageSize)
            this.$message('重置成功')
        },
        // 查询
        _getSearch: function (e) {
            this.search = e
            this._getIntegralGift(1, this.table.pageSize)
        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getIntegralGift(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getIntegralGift(this.table.pageNum, this.table.pageSize);
        },
        //弹出
        show: function (type) {
            this.$refs[type].showModel();
        },
        //隐藏
        hide: function (type) {
            this.$refs[type].hideModel();
        },
        //点击详情和查看
        handleDetail: function (index, row) {
            this.$router.push({
                path: index,
                query: {
                    giftCode: row.giftCode,
                    id: row.id
                }
            })
        },
        //点击编辑
        handleUpdate: function (row) {
            let query = {
                giftCode: row.giftCode,
                id: row.id
            }
            routerLinkPage(this, 'IntegralGiftEdit', query)
        },
        //点击新增
        handleAdd: function (index) {
            this.$router.push('/integralGift/IntegralGiftAdd')
        },
        //点击批量修改
        editModify: function (type) {
            // this.show('dialog-model-modify')
            this.show('batch-gift-model')
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
        //批量积分礼品上传成功
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
        // 上传成功
        handleSuccessPreviary: function (response, file, fileList) {
            var uploadCodes = fileList[0].response.data
            if (uploadCodes != null) {
                uploadCodes = uploadCodes.split(",")
                var newCodes = ''

                // 删除重复ID
                for (var i = uploadCodes.length - 1; i >= 0; i--) {
                    var targetNode = uploadCodes[i];
                    for (var j = 0; j < i; j++) {
                        if (targetNode == uploadCodes[j]) {
                            uploadCodes.splice(i, 1);
                            break;
                        }
                    }
                }
                // 组成新的code字符串，填入文本框中
                uploadCodes.forEach((item) => {
                    newCodes = newCodes + item + ','
                })

                this.uploadCodesLength = uploadCodes.length
                this.modifyForm.applyProductCodes = newCodes.substr(0, newCodes.length - 1);
                this.modifyForm.fileList1 = fileList
            } else {
                this.$message({
                    message: '商品编号格式错误，请检查修正后重新上传',
                    type: 'error'
                })
            }
        },
        // 上传失败
        handleErrorPreviary: function (err, file, fileList) {
            this.$message({
                message: file.name + '上传失败',
                type: 'error'
            })
        },
        // 删除已上传文件
        handleRemove(file, fileList) {
            this.uploadCodesLength = 0
        },
        //批量导入删除
        handleBatchRemove(file, fileList) {
            this.batchForm.batchData = null
        },
        // 多次上传，只保留最后一次文件
        handleFileChange(file, fileList) {
            this.modifyForm.fileList1 = fileList.slice(-1);


            this.batchForm.fileList1 = fileList.slice(-1);
        },
        // 查看商品关闭弹窗（知道了按钮）
        dialogHide: function (type) {
            this.$refs[type].hideModel();
        },
        //批量导入礼品  （知道了）
        dialogBatchHide: function (type) {
            this.batchForm.batchData = null
            this.batchForm.fileList1 = []
            this.$refs[type].hideModel();
        },
        // 查看商品
        _applyProductView: function () {
            if (this.modifyForm.applyProductCodes == '') {
                this.$message({
                    message: '请上传商品ID',
                    type: 'warning'
                })
            } else {
                this._isGiftCode()
                this.dialog.viewTableLoading = true
            }
        },
        // 删除
        delViewCode: function (row) {
            this.$confirm('确定删除该商品信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除弹出层表格数据
                this.dialog.viewTableData.forEach((item, index) => {
                    if (item.giftCode == row.giftCode) {
                        this.dialog.viewTableData.splice(index, 1);
                    }
                })
                this.dialog.viewProductSize = this.dialog.viewTableData.length

                // 删除输入框商品编码字符串
                var newCodes = ''
                var uploadCodes = this.modifyForm.applyProductCodes
                uploadCodes = uploadCodes.split(",")

                uploadCodes.forEach((item, index) => {
                    if (item == row.giftCode) {
                        uploadCodes.splice(index, 1)
                    }
                })

                // 组成新的code字符串，填入文本框中
                uploadCodes.forEach((item) => {
                    newCodes = newCodes + item + ','
                })
                this.modifyForm.applyProductCodes = newCodes.substr(0, newCodes.length - 1);
                this.uploadCodesLength = this.modifyForm.applyProductCodes.split(",").length

                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //查看礼品编号
        _isGiftCode: function () {
            var params = {
                companyCode: this.modifyForm.siteValue,
                giftCodes: this.modifyForm.applyProductCodes
            }
            if (this.modifyForm.siteValue == '') {
                this.$message({
                    type: 'error',
                    message: '查看商品前请选择礼品站点'
                })
                return false
            }
            this.dialog.viewTableLoading = true
            this.$refs['applyProductView-model'].showModel()
            isGiftCode(params).then(res => {
                this.dialog.viewTableLoading = false
                if (res.status == 200) {
                    this.dialog.viewTableData = res.data.data
                    // 添加无效礼品编号
                    res.data.notList.forEach((item) => {
                        this.dialog.viewTableData.push(item)
                    })

                    this.dialog.viewProductSize = res.data.length
                }
            })
        },
        //批量修改-确定
        _editGifeChange: function (type, formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var paramsGiftCodes = {
                        companyCode: this.modifyForm.siteValue,
                        giftCodes: this.modifyForm.applyProductCodes
                    }
                    isGiftCode(paramsGiftCodes).then(res => {
                        this.dialog.giftCodeReset = ''
                        if (res.status == 200) {
                            //用于确定批量修改作为判断
                            if (res.data.notList.length != 0) {
                                res.data.notList.forEach((item) => {
                                    this.dialog.giftCodeReset += item.giftCode + ','
                                })
                                this.$refs['check-model'].showModel()
                            } else {
                                //this.dialog.giftCodeReset = ''
                                if (this.dialog.giftCodeReset == '') {
                                    var params = {
                                        companyCode: this.modifyForm.siteValue,
                                        giftCodes: this.modifyForm.applyProductCodes,
                                        newCategoryName: this.modifyForm.categoryValue,
                                    }
                                    editGifeChange(params).then(res => {
                                        if (res.status == 200) {
                                            this.$message({
                                                type: 'success',
                                                message: '批量修改成功'
                                            })
                                            this.uploadCodesLength = 0
                                            this.$refs['modifyForm'].resetFields()
                                            this.$refs['dialog-model-modify'].hideModel()
                                            this._getIntegralGift(1, this.table.pageSize)
                                        } else if (res.status == 500) {
                                            if (res.message != null) {
                                                this.dialog.message = res.message
                                                this.$refs['isGiftCodeDialog-model'].showModel()
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            })
        },
        //批量修改-关闭
        modifyClose: function (type, formName) {
            this.uploadCodesLength = 0
            this.$refs[formName].resetFields()
            this.$message('取消成功')
            this.hide(type)
        },

        //监听礼品编号
        applyProductCodesChange: function (val) {
            this.uploadCodesLength = val.split(",").length
        },
        //找不到积分编号---(知道了)
        isDialogHide: function (formName) {
            this.uploadCodesLength = 0
            this.$refs[formName].hideModel()
            this.$refs['modifyForm'].resetFields()
            this.$refs['dialog-model-modify'].hideModel()
            this._getIntegralGift(1, this.table.pageSize)
        },
        //双击行
        handleDblclick(row) {
            let query = {
                giftCode: row.giftCode,
                id: row.id
            }
            routerLinkPage(this, 'IntegralGiftDetail', query)
        }


    }
}

</script>

<style type="text/css" media="screen" >
.addDialog-model .el-form-item__content {
    text-align: left;
    font-size: 12px;
}
</style>
<style lang="scss" scoped>
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
.applyProductView {
    cursor: pointer;
}
</style>