<template>
    <div class="app-container">
        <div class="filter-container">
            <div ref="searchToolbar" class="searchToolbar">
                <Search
                    :buttonList="buttonList"
                    :searchOptions="searchOptions"
                    @search="_getSearch"
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
        <!-- 新增 -->
        <dialogModel
            class="addDialog-model"
            ref="addDialog-model"
            :title="dialog.addTitle"
            :width="dialog.addWidth"
        >
            <div class="dialog-model-content">
                <el-form
                    :model="dialog"
                    ref="dialog"
                    :rules="rules"
                    label-width="85px"
                    size="small"
                >
                    <el-form-item label="分类名称：" prop="categoryName">
                        <el-input
                            v-model="dialog.categoryName"
                            placeholder="20字内，请勿与其他分类重名"
                            class
                            maxlength="20"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="temp">
                        <span slot="label" class="labelSlot">分类状态：</span>
                        <el-radio-group v-model="dialog.categoryStatusValue">
                            <el-radio
                                v-for="item in dialog.categoryStatusData"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value"
                            >
                                {{item.name}}
                                <span
                                    class="errorColor"
                                    v-if="item.name == '已下架'"
                                >(下属商品同步下架)</span>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="_addGiftCategory('dialog')"
                    :loading="saveLoading"
                >确定</el-button>
                <el-button size="small" @click="addDialogHide('addDialog-model')">取消</el-button>
            </div>
        </dialogModel>

        <!-- 编辑 -->

        <!-- 批量移出提示 -->
        <dialogModel
            class="transferNoteDialog-model"
            ref="transferNoteDialog-model"
            :title="dialog.transferNoteTitle"
            :width="dialog.delWidth"
        >
            <div class="dialog-model-content">
                <p>
                    <span class="mianColor">{{dialog.currentCategoryName}}</span>用品下仍有
                    <span class="mianColor">{{dialog.currentCategoryGiftCount}}</span>个礼品，请先修改至其他分类后再删除分类。
                </p>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="oneModify('transferNoteDialog-model',dialog.currentCategoryName)"
                >逐个修改</el-button>
                <el-button size="small" @click="moreModify('transferNoteDialog-model')">批量修改</el-button>
            </div>
        </dialogModel>

        <!-- 批量移出 -->
        <dialogModel
            class="transferDialog-model"
            ref="transferDialog-model"
            :title="dialog.transferTitle"
            :width="dialog.delWidth"
        >
            <div class="dialog-model-content">
                <p style="margin-bottom: 10px;">
                    <span class="mianColor">{{dialog.currentCategoryName}}</span>下的
                    <span class="mianColor">{{dialog.currentCategoryGiftCount}}</span>种礼品将批量移至
                </p>
                <el-form :model="dialog" ref="dialog" :rules="rules" size="small">
                    <el-form-item prop="transferCategoryValue">
                        <el-select v-model="dialog.transferCategoryValue">
                            <el-option
                                v-for="item in dialog.transferCategoryNameData"
                                :key="item.categoryName"
                                :label="item.categoryName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="_moveOutCategory('dialog')"
                    :loading="transferLoading"
                >确定</el-button>
                <el-button size="small" @click="transferDialogHide('transferDialog-model')">取消</el-button>
            </div>
        </dialogModel>

        <!-- 删除 -->
        <dialogModel
            class="delDialog-model"
            ref="delDialog-model"
            :title="dialog.delTitle"
            :width="dialog.delWidth"
        >
            <div class="dialog-model-content">
                <p>
                    确定要
                    <span class="errorColor">删除</span>以下分类吗？
                </p>
                <span class="mianColor">【{{dialog.currentCategoryName}}】</span>
            </div>
            <div class="dialog-model-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="_delGiftCategory"
                    :loading="delLoading"
                >确定</el-button>
                <el-button size="small" @click="dialogHide('delDialog-model')">取消</el-button>
            </div>
        </dialogModel>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDate, today, dateToStamp, deleteBlankSpace, formatDateTimes, formatSearch, calculateTableHeight, tableBtnPermissions } from 'common/js/dom'
import Table from '@/components/Table'
import Search from '@/components/Search'
import Dialog from 'base/Dialog';
import { getDictsData, getGiftCategoryList, getCheckCategoryName, addGiftCategory, delGiftCategory, getOtherGiftCategoryList, moveOutCategory } from 'api/interface';
export default {
    components: {
        Table,
        Search,
        'dialogModel': Dialog,
    },
    name: "GiftCategory",
    data() {
        return {
            saveLoading: false,   // 确定新增/编辑
            delLoading: false,   // 确定删除
            transferLoading: false,  // 确定批量移出礼品
            dialogTitle: '提示',
            dialogWidth: '1000px',
            table: {
                title: [
                    {
                        label: '分类编号',
                        field: 'categoryCode',
                        width: 150,
                    },
                    {
                        label: '分类名称',
                        field: 'categoryName',
                        width: 150,
                    },
                    {
                        label: '分类状态',
                        field: 'statusName',
                        width: 150,
                    },
                    {
                        label: '修改时间',
                        field: 'modifiedTime',
                        width: 250,
                        type: 'dateTime',
                    },
                    {
                        label: '下属礼品数',
                        field: 'categoryGiftCount',
                        width: 150,
                    },
                    {
                        label: '操作',
                        field: '',
                        type: 'operat',
                        options: [
                            { name: '编辑', type: 'update', show: true, click: this.addDialogShow },
                            { name: '批量移出礼品', type: 'gift', show: true, click: this.transferNoteDialogShow },
                            { name: '删除', type: 'delete', show: true, click: this.delDialogShow }
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
            search: {},
            buttonList: [
                {
                    name: 'add',
                    type: 'primary',
                    icon: 'el-icon-circle-plus-outline',
                    text: '新增',
                    class: '',
                    show: false,       //根据权限来显示
                    loading: false,
                    click: this.addDialogShow,
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
                label: '站点',
                field: 'status',
                value: '',
                type: 'select',
                options: [],
            }, {
                label: '分类名称',
                field: 'categoryName',
                value: '',
                type: 'input',
                options: [],
            }],
            dialog: {
                addTitle: '新增',
                delTitle: '删除',
                transferNoteTitle: '移出礼品提醒',
                transferTitle: '批量移出',
                addWidth: '400px',
                delWidth: '306px',
                categoryName: '',
                categoryStatusData: [],
                categoryStatusName: '已上架',
                categoryStatusValue: '1',
                currentCategoryId: '',
                currentCategoryName: '',
                currentCategoryGiftCount: '',
                transferCategoryNameData: [],
                transferCategoryName: '',
                transferCategoryValue: '',
                isRepeatCategoryName: false,
                createdTime: '',
                currentCategoryOldId: ''
            },
            rules: {
                categoryName: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '限20个字符', trigger: 'blur' }
                ],
                transferCategoryValue: [
                    { required: true, message: '请选择礼品分类', trigger: 'change' }
                ]
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
        this._getGiftCategoryList(this.table.pageNum, this.table.pageSize)
    },
    mounted() {

    },
    methods: {
        // 查询数据字典
        _getDictsData: function () {
            // 搜索栏状态
            var paramsGiftStatus = {
                isAll: true,
                code: 'GiftStatus'
            }
            getDictsData(paramsGiftStatus).then(res => {
                this.searchOptions.filter(item => item.field === 'status')[0].options = res.data
            })

            // 搜索栏状态
            var paramsCategoryStatus = {
                isAll: false,
                code: 'GiftStatus'
            }
            getDictsData(paramsCategoryStatus).then(res => {
                this.dialog.categoryStatusData = res.data
            })
        },
        // 页面权限
        getPermissions: function () {
            var permissionsBtnArr = localStorage.getItem("permissionsBtn");
            if (permissionsBtnArr.includes("gift:categories:create")) {
                this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = true
            } else {
                this.isAddPermission = false
            }
            tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("gift:categories:update"))
            tableBtnPermissions(this.table.title, 'delete', permissionsBtnArr.includes("gift:categories:delete"))
        },
        // 获取数据
        _getGiftCategoryList: function (pageNum, pageSize) {
            let params = {
                status: this.search.status,
                category: deleteBlankSpace(this.search.categoryName),
                pageNum: pageNum,
                pageSize: pageSize,
                export: false,
                nameStr: '',
                fieldStr: '',
            }
            this.table.tableLoading = true
            getGiftCategoryList(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    res.data.forEach((item, index) => {

                    })
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
        // 导出
        _getExport: function () {
            let params = this.search
            params.pageNum = ''
            params.pageSize = ''
            params.export = true
            params.nameStr = '分类编号,分类名称,分类状态,修改时间,下属礼品数'
            params.fieldStr = 'categoryCode,categoryName,statusName,modifiedTime,categoryGiftCount'
            // statusName,categoryGiftCount(导出不出来   分类状态,下属礼品数)

            window.location.href = getGiftCategoryList(params)
        },
        // 查询条件重置
        handleReset: function (e) {
            this.search = e
            this._getGiftCategoryList(1, this.table.pageSize)
        },
        // 查询
        _getSearch: function (e) {
            this.search = e
            this._getGiftCategoryList(1, this.table.pageSize)
        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getGiftCategoryList(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getGiftCategoryList(this.table.pageNum, this.table.pageSize);
        },
        // 格式化日期
        formatterDate: function (row, column) {
            return formatDateTimes(row.modifiedTime)
        },
        // 新增弹窗显示
        addDialogShow: function (row) {
            this.$refs['addDialog-model'].showModel();
            this.dialog.currentCategoryId = row.id
            if (row.categoryName) {
                this.dialog.addTitle = '编辑'
                this.dialog.categoryName = row.categoryName
                this.dialog.categoryStatusValue = row.status
                this.dialog.createdTime = row.createdTime
            } else {
                this.dialog.addTitle = '新增'
                this.dialog.categoryName = ''
                this.dialog.categoryStatusValue = '1'
            }
        },
        // 关闭批量移出弹窗
        addDialogHide: function (type) {
            this.$refs[type].hideModel();
            this.$refs['dialog'].resetFields();
            this.$message('已取消' + this.dialog.addTitle + '')
        },
        // 批量提示移出弹窗显示
        transferNoteDialogShow: function (row) {
            this.$refs['transferNoteDialog-model'].showModel();

            this.dialog.currentCategoryOldId = row.id
            this.dialog.currentCategoryName = row.categoryName
            this.dialog.currentCategoryGiftCount = row.categoryGiftCount
        },
        // 逐个修改
        oneModify: function (type, category) {
            this.$refs[type].hideModel();
            // 跳转到当前分类的积分礼品
            this.$router.push({
                path: '/integralGift/IntegralGift',
                query: {
                    category: category
                }
            })

        },
        // 批量修改
        moreModify: function (type) {
            this.$refs[type].hideModel();
            this.$refs['transferDialog-model'].showModel();

            var params = {
                category: this.dialog.currentCategoryName
            }

            getOtherGiftCategoryList(params).then(res => {
                if (res.status == 200) {
                    this.dialog.transferCategoryNameData = res.data
                }
            })
        },
        // 确认批量移出礼品
        _moveOutCategory: function (formName) {
            var params = {
                oldCategoryId: this.dialog.currentCategoryOldId,
                newCategoryId: this.dialog.transferCategoryValue,
            }
            this.transferLoading = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    moveOutCategory(params).then(res => {
                        if (res.status == 200) {
                            this.dialogHide('transferDialog-model')
                            this.$message({
                                message: res.message,
                                type: 'success'
                            })
                            this._getGiftCategoryList(this.table.pageNum, this.table.pageSize);
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                        this.transferLoading = false
                    })
                } else {
                    this.$message({
                        message: '请完善信息',
                        type: 'warning'
                    })
                    this.transferLoading = false
                    return false;
                }
            });
        },
        // 关闭批量移出弹窗
        transferDialogHide: function (type) {
            this.$refs[type].hideModel();
            this.$message('已取消移出')
        },
        // 删除弹窗显示
        delDialogShow: function (row) {
            if (row.categoryGiftCount == 0) {
                this.$refs['delDialog-model'].showModel();
            } else if (row.categoryGiftCount > 0) {
                this.$refs['transferNoteDialog-model'].showModel();
            }

            this.dialog.currentCategoryId = row.id
            this.dialog.currentCategoryName = row.categoryName
        },
        // 关闭弹窗
        dialogHide: function (type) {
            this.$refs[type].hideModel();
        },
        // 新增保存
        _addGiftCategory: function (formName) {
            var params = {
                categoryName: deleteBlankSpace(this.dialog.categoryName),
                status: this.dialog.categoryStatusValue
            }
            if (this.dialog.addTitle == '编辑') {
                params.id = this.dialog.currentCategoryId
                params.createdTime = this.dialog.createdTime
            }
            this.saveLoading = true
            this.$refs[formName].validate((valid) => {
                if (!this.dialog.isRepeatCategoryName) {
                    if (valid) {
                        addGiftCategory(params).then(res => {
                            if (res.status == 200) {
                                this.addDialogHide('addDialog-model')
                                this.$message({
                                    message: this.dialog.addTitle + '成功',
                                    type: 'success'
                                })
                                // 编辑状态刷新当前页
                                if (this.dialog.addTitle == '编辑') {
                                    this._getGiftCategoryList(this.table.pageNum, this.table.pageSize)
                                } else {
                                    this._getGiftCategoryList(1, this.table.pageSize)
                                }
                            } else if (res.status == 500) {
                                this.$message.error(res.message);
                            }
                            this.saveLoading = false
                        })
                    } else {
                        this.$message({
                            message: '请完善信息',
                            type: 'warning'
                        })
                        this.saveLoading = false
                        return false;
                    }
                }
            });
        },
        // 删除
        _delGiftCategory: function () {
            var params = {
                categoryId: this.dialog.currentCategoryId
            }
            this.delLoading = true
            delGiftCategory(params).then(res => {
                if (res.status == 200) {
                    this.dialogHide('delDialog-model')
                    this.$message({
                        message: res.message,
                        type: 'success'
                    })
                    this._getGiftCategoryList(this.table.pageNum, this.table.pageSize)
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                }
                this.delLoading = false
            })
        },
        handleDblclick(row) {

        }

    }
}

</script>

<style type="text/css" media="screen">
.addDialog-model .el-form-item__label {
    font-size: 12px;
}
.addDialog-model .el-radio__label {
    font-size: 12px;
    padding-left: 0;
}
.addDialog-model .el-form-item__content {
    text-align: left;
    font-size: 12px;
}
</style>
<style lang="scss" scoped>
</style>
