<template>
    <div class="app-container">
        <div class="filter-container">
            <div ref="searchToolbar" class="searchToolbar">
                <el-row :gutter="20" class="showPoint">
                    <el-col :xs="24" :sm="12" :md="6" :lg="6" class="pointItem">
                        <div
                            class="pointNum mianColor"
                        >{{infoMap.historyGetAmount ? infoMap.historyGetAmount : 0}}</div>
                        <div class="pointText">全平台历史获取积分</div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="6" :lg="6" class="pointItem">
                        <div class="pointNum">{{infoMap.availableAmount?infoMap.availableAmount:0}}</div>
                        <div class="pointText">可用积分</div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="6" :lg="6" class="pointItem">
                        <div class="pointNum">{{infoMap.disabledAmount?infoMap.disabledAmount:0}}</div>
                        <div class="pointText">待入账积分</div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="6" :lg="6" class="pointItem">
                        <div
                            class="pointNum errorColor"
                        >{{infoMap.historyUseAmount?infoMap.historyUseAmount:0}}</div>
                        <div class="pointText">全平台历史消耗积分</div>
                    </el-col>
                </el-row>

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

        <!-- 积分流水导入 -->
        <dialogModel
            class="check-model successDialog"
            ref="batch-gift-model"
            title="修改积分流水导入"
            :width="batchForm.dialogWidth"
        >
            <div class="dialog-model-content">
                <el-upload
                    name="file"
                    class="upload-demo"
                    :action="editPointRunAction"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleBatchRemove"
                    :file-list="batchForm.fileList1"
                    :on-success="handleSuccesBatch"
                    :on-error="handleErrorBatch"
                    :on-change="handleFileChange"
                    width="200px"
                    :multiple="false"
                >
                    批量积分流水导入：
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
import Search from '@/components/Search'
import Table from '@/components/Table'
import Dialog from 'base/Dialog'
import { formatDateSearch, formatDateTimes, todayEndTime, onlineDateTime, dateToStamp, deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, uploadDataNoRepeat } from 'common/js/dom';
import { getPointRecord, getExport, getDictsData, editPointRunAction } from 'api/interface';

export default {
    name: "pointList",
    components: {
        Search,
        Table,
        'dialogModel': Dialog,
    },
    data() {
        return {
            infoMap: {
                availableSum: 0,
                disabledSum: 0,
                getSum: 0,
                useSum: 0,
            },
            buttonList: [
                {
                    name: 'edit',
                    type: 'primary',
                    icon: 'el-icon-edit',
                    text: '积分流水导入',
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
                },
            ],
            searchOptions: [
                {
                    label: '站点',
                    field: 'companyCode',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '性质',
                    field: 'ruleNature',
                    value: '',
                    type: 'select',
                    options: [],
                    handleSelect: this.changeRuleNature
                },
                {
                    label: '渠道',
                    field: 'ruleType',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '变动积分状态',
                    field: 'changedState',
                    value: '',
                    type: 'select',
                    options: [],
                },
                {
                    label: '关联单号',
                    field: 'orderCode',
                    value: '',
                    type: 'input',
                },
                {
                    label: '客户名称',
                    field: 'customerName',
                    value: '',
                    type: 'input',
                },
                {
                    label: '客户账号',
                    field: 'uid',
                    value: '',
                    type: 'inputImport',
                    fileList: [],
                    uploadSuccess: this.handleSuccessUid,
                },
                {
                    label: '时间',
                    field: 'date',
                    value: [onlineDateTime(), todayEndTime()],
                    type: 'datetimerange',
                    fields: ['startDate', 'endDate'],
                },
            ],
            search: {},

            table: {
                title: [
                    {
                        label: '时间',
                        field: 'createdTime',
                        width: 150,
                        type: 'dateTime',
                    },
                    {
                        label: '客户账号',
                        field: 'uid',
                        type: 'link',
                        click: this.handleDblclick
                    },
                    {
                        label: '客户名称',
                        field: 'customerName',
                        width: 200,
                    },
                    {
                        label: '性质',
                        field: 'ruleNatureName',
                    },
                    {
                        label: '渠道',
                        field: 'ruleTypeName',
                    },
                    {
                        label: '变动积分值',
                        field: 'amountShow',
                    },
                    {
                        label: '变动积分状态',
                        field: 'changedStateName',
                    },
                    {
                        label: '剩余可用积分',
                        field: 'availableAmount',
                    },
                    {
                        label: '剩余待入账积分',
                        field: 'disabledAmount',
                    },
                    {
                        label: '积分流水号',
                        field: 'serialNumber',
                        width: 170,
                    },
                    {
                        label: '单号',
                        field: 'orderCode',
                        width: 170,
                        type: 'link',
                        click: this.handleViewOrderCode
                    },
                    {
                        label: '备注',
                        field: 'remark',
                        width: 200,
                    },
                ],
                tableData: [],
                totalPage: 20,
                pageSize: 20,
                pageNum: 1,
                tableLoading: false,
                tableHeight: '450px',
            },

            editPointRunAction: editPointRunAction(),
            isExcel: false,
            batchForm: {        //批量导入积分流水
                dialogWidth: '544px',
                fileList1: [],
                batchData: null,
            },
        }
    },
    created() {
        this.search = formatSearch(this.searchOptions)
        this._getDictsData()
        this._getPointRecord(this.table.pageNum, this.table.pageSize);
    },
    mounted() {

    },
    methods: {
        // 查询数据字典
        _getDictsData: function () {
            // 站点
            var paramsSite = {
                isAll: true,
                code: 'CompanyCode'
            }
            getDictsData(paramsSite).then(res => {
                this.searchOptions.filter(item => item.field === 'companyCode')[0].options = res.data
            })

            // 类型
            var paramsRuleNature = {
                isAll: true,
                code: 'RuleNature'
            }
            getDictsData(paramsRuleNature).then(res => {
                this.searchOptions.filter(item => item.field === 'ruleNature')[0].options = res.data
            })

            // 渠道
            var paramsRuleType = {
                isAll: true,
                code: 'RuleType'
            }
            var paramsRuleGetType = {
                isAll: false,
                code: 'RuleGetType'
            }
            var paramsRuleUseType = {
                isAll: false,
                code: 'RuleUseType'
            }
            getDictsData(paramsRuleType).then(res => {
                this.searchOptions.filter(item => item.field === 'ruleType')[0].options = res.data
            })

            // 积分变动
            var paramsChangedState = {
                isAll: true,
                code: 'ChangedState'
            }
            getDictsData(paramsChangedState).then(res => {
                this.searchOptions.filter(item => item.field === 'changedState')[0].options = res.data
            })
        },
        // 选择类型
        changeRuleNature: function (field, value) {
            var params = {}
            if (value == 'GET') {
                params.isAll = true
                params.code = 'RuleGetType'
            } else if (value == 'USE') {
                params.isAll = true
                params.code = 'RuleUseType'
            } else if (value == '') {
                params.isAll = true
                params.code = 'RuleType'
            }
            getDictsData(params).then(res => {
                this.searchOptions.filter(item => item.field === 'ruleType')[0].options = res.data
            })
        },
        // 获取表格数据
        _getPointRecord: function (pageNum, pageSize) {
            var params = this.search
            params.pageNum = pageNum,
                params.pageSize = pageSize,

                this.table.tableLoading = true
            getPointRecord(params).then(res => {
                this.table.tableLoading = false
                if (res.status == 200) {
                    let data = res.data.data
                    data.forEach((item, index) => {
                        // 变动积分值
                        if (item.amount == 0) {
                            item.amountShow = item.amount
                        } else {
                            if (item.ruleNature == 'GET') {
                                item.amountShow = '+' + item.amount
                            } else if (item.ruleNature == 'USE') {
                                item.amountShow = '-' + item.amount
                            }
                        }
                    })
                    this.table.tableData = data
                    this.infoMap = res.data.summaryInfo
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
            this._getPointRecord(1, this.table.pageSize);
        },
        // 查询-重置
        handleReset(e) {
            this.search = e
            this._getPointRecord(1, this.table.pageSize);
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
            params.pageNum = ''
            params.pageSize = ''
            params.export = true
            params.nameStr = '时间,客户ID,客户名称,类型,渠道,变动积分值,变动积分状态,当时剩余可用积分,当时剩余待入账积分',
                params.fieldStr = 'createdTime,uid,customerName,ruleNature,ruleType,amount,changedState,availableAmount,disabledAmount',

                window.location.href = getPointRecord(params)
        },
        // 每页显示条数
        handleSizeChange: function (val) {
            this.table.pageSize = val
            this._getPointRecord(this.table.pageNum, this.table.pageSize);
        },
        // 翻页
        handleCurrentChange: function (val) {
            this.table.pageNum = val
            this._getPointRecord(this.table.pageNum, this.table.pageSize);
        },
        // 双击行
        handleDblclick(row) {
            let query = {
                uid: row.uid
            }
            routerLinkPage(this, 'MemberDetail', query)
        },
        // 查看-orderCode
        handleViewOrderCode(row) {
            if (row.ruleTypeName == '下单返积分') {
                return false
            }
            let query = {
                code: row.orderCode
            }
            console.log(row.ruleTypeName)
            routerLinkPage(this, 'GiftOrdersDetail', query)
        },
        // 上传成功
        handleSuccessUid(response, file, fileList) {
            this.$message({
                message: file.name + '上传成功',
                type: 'success'
            })
            this.searchOptions.filter(item => item.field === 'uid')[0].value = uploadDataNoRepeat(this, response.data)
        },
        //弹出
        show: function (type) {
            this.$refs[type].showModel();
        },
        //点击批量修改
        editModify: function (type) {
            // this.show('dialog-model-modify')
            this.show('batch-gift-model')
        },
        // 上传之前
        beforeAvatarUpload: function (file) {
            //验证上传文件的类型
            var newArr = file.name.split('.')
            var newType = newArr[1]

            if (newType == 'xls') {
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
        //批量导入删除
        handleBatchRemove(file, fileList) {
            this.batchForm.batchData = null
        },
        //批量积分流水导入上传成功
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
        // 多次上传，只保留最后一次文件
        handleFileChange(file, fileList) {
            this.batchForm.fileList1 = fileList.slice(-1);
        },
        //批量导入礼品  （知道了）
        dialogBatchHide: function (type) {
            this.batchForm.batchData = null
            this.batchForm.fileList1 = []
            this.$refs[type].hideModel();
        },
    },
    watch: {}
}
</script>

<style lang="scss" scoped>
.showPoint {
    margin-bottom: 10px;
    .pointItem {
        margin-bottom: 10px;
        .pointText {
            color: #606266;
            font-size: 15px;
            margin-top: 8px;
            font-weight: 800;
        }
        .pointNum {
            font-size: 20px;
        }
    }
}
</style>
