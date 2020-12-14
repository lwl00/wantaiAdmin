<template>
  <div class="app-container">
    <div class="filter-container" v-loading="loading">
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
        <Table :table="table" @dblclick="handleDblclick" @handleSelectionChange="handleSelectionChange"></Table>
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

    <!-- 批量导入产品 -->
    <dialogModel
      class="check-model successDialog"
      ref="batch-gift-model"
      title="批量导入产品"
      :width="dialog.dialogWidth">
      <div class="dialog-model-content">
        <el-upload
          name="file"
          class="upload-demo"
          :action="productImportAPPOINTAction"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove"
          :file-list="batchForm.fileList1"
          :on-success="handleSuccesBatch"
          :on-error="handleErrorBatch"
          :on-change="handleFileChange"
          width="200px"
          :multiple="false">
          批量导入产品：
          <el-button size="small" type="primary">点击上传</el-button>
          <span slot="tip" class="el-upload__tip"></span>
        </el-upload>
        <div class="tipContent" v-if="batchForm.batchData">
            <p>
              成功导入产品：
              <span class="mianColor">{{batchForm.batchData.importNumSucc}}</span>&nbsp;个
            </p>
            <p>
              导入失败：
              <span class="errorColor">{{batchForm.batchData.importNumFail}}</span>&nbsp;个
            </p>
            <p v-if="batchForm.batchData.failLine">
              导入失败行：第
              <span class="errorColor">{{batchForm.batchData.failLine}}</span>&nbsp;行
            </p>
            <i
              class="tip-fail errorColor"
              v-if="batchForm.batchData.failLine">请检查并修正失败行数据后，重新导入失败行数据</i>
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
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, formatBrandTreeData } from 'common/js/dom';
import { getDictsData, getProductList, delProduct, getBrandTree, productImportAPPOINTAction  } from 'api/interface';

export default {
  components: {
    Search,
    Table,
    'dialogModel': Dialog,
  },
  name: "BaseProductList",
  props: {
    isDiscountPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isAddPermission: false,  // 新增按钮权限
      isEditPermission: false,  // 编辑按钮权限
      isDeletePermission: false,  // 删除按钮权限

      loading: false,  // 页面load
      addSaveLoading: false,   // 确定新增
      editSaveLoading: false,  // 确定编辑
      delSaveLoading: false,   // 确定删除

      // 操作栏按钮
      buttonList: [
        {
          name: 'add',
          type: 'primary',
          icon: 'el-icon-circle-plus-outline',
          text: this.isDiscountPage ? '新增折扣商品' : '新增',
          class: '',
          show: true,       //根据权限来显示
          loading: false,
          click: this.handleAdd,
        },
        {
          name: 'delete',
          type: '',
          icon: 'el-icon-delete',
          text: '删除',
          class: '',
          show: true,       //根据权限来显示
          loading: false,
          click: this.handleDelete,
        },
        {
          name: 'export',
          type: '',
          icon: 'el-icon-download',
          text: '导出',
          class: '',
          show: true,
          loading: false,
          click: this.handleExport,
        },
        {
          name: 'add',
          type: '',
          icon: 'el-icon-circle-plus-outline',
          text: '批量上传',
          class: '',
          show: true,
          loading: false,
          click: this.handleUpload,
        }
      ],

      // 搜索栏
      searchOptions: [
        {
          label: '产品名称',
          field: 'name',
          value: '',
          type: 'input',
        },
        {
          label: '产品编号',
          field: 'number',
          value: '',
          type: 'input',
        },
        {
          label: '品列',
          field: 'brandId',
          value: '',
          type: 'cascader',
          chooseOptions: [],
          options: [],
        },
        {
          label: '系列ID',
          field: 'seriesId',
          value: '',
          type: 'input',
          hide: true,
        },
        {
          label: '工艺',
          field: 'crafts',
          value: '',
          type: 'select',
          dictsCode: 'Craft',
        },
        {
          label: '分类',
          field: 'categorys',
          value: '',
          type: 'select',
          dictsCode: 'Category',
        },
        {
          label: '商品状态',
          field: 'status',
          value: '',
          type: 'select',
          dictsCode: 'TrueOfFalse',
          options: [],
        },
        {
          label: '是否折扣库商品',
          field: 'discount',
          value: this.isDiscountPage,
          type: 'select',
          dictsCode: 'TrueOfFalse',
          options: [],
          hide: true
        },
      ],
      search: {},

      // 表格
      table: {
        title: [
          {
            label: '产品编号',
            field: 'number',
            type: 'link',
            click: this.handleDblclick,
          },
          {
            label: '产品名称',
            field: 'name',
            width: 200,
          },
          {
            label: '品牌',
            field: 'brandName',
          },
          {
            label: '系列',
            field: 'seriesName',
          },
          {
            label: '工艺',
            field: 'craftNames',
            width: 200,
          },
          {
            label: '分类',
            field: 'categoryNames',
            width: 200,
          },
          {
            label: '关联产品',
            field: 'contactNames',
            width: 200,
          },
          // {
          //   label: '是否折扣库商品',
          //   field: 'discount',
          //   type: 'radio',
          // },
          {
            label: '商品状态',
            field: 'status',
            type: 'radioProductStatus',
          },
          {
            label: '材质说明',
            field: 'instructions',
            width: 300,
          },
          {
            label: '创建人',
            field: 'creator',
          },
          {
            label: '创建时间',
            field: 'createdTime',
            type: 'dateTime',
            width: '130px',
          },
          {
            label: '修改人',
            field: 'modifier',
          },
          {
            label: '修改时间',
            field: 'modifiedTime',
            type: 'dateTime',
            width: '130px',
          },
          {
            label: '操作',
            field: '',
            type: 'operat',
            options: [
              { name: '编辑', type: 'update', show: true, click: this.handleEdit },
              { name: '查看', type: 'view', show: true, click: this.handleView },
            ]
          },
        ],
        tableData: [],
        totalPage: 20,
        pageSize: 20,
        pageNum: 1,
        tableLoading: false,
        tableHeight: '450px',
        selectionChange: [],  // 多选行数据
      },

      dialog: {
        loading: false,
        dialogWidth: '470px',
        dialogTitle: '提示',
      },
      // 批量导入
      batchForm: { fileList1: [], batchData: null },
      productImportAPPOINTAction: productImportAPPOINTAction()
    }
  },
  created() {
    console.log('折扣页面-==', this.isDiscountPage)
    this.search = formatSearch(this.searchOptions)
    this._getDictsData()
    this._getBrandTree()
    this.getPermissions()
    this._getProductList(this.table.pageNum, this.table.pageSize);
  },
  mounted() {

  },
  methods: {
    // 数据字典
    _getDictsData: function () {
      // 工艺
      var paramsCraft = {
        isAll: true,
        code: 'Craft'
      }
      getDictsData(paramsCraft).then(res => {
        this.searchOptions.filter(item => item.field === 'crafts')[0].options = res.data
      })
      // 分类
      var paramsCategory = {
        isAll: true,
        code: 'Category'
      }
      getDictsData(paramsCategory).then(res => {
        this.searchOptions.filter(item => item.field === 'categorys')[0].options = res.data
      })
      // 状态
      var paramsProductStatus = {
        isAll: true,
        code: 'ProductStatus'
      }
      getDictsData(paramsProductStatus).then(res => {
        this.searchOptions.filter(item => item.field === 'status')[0].options = res.data
      })
      // // 折扣
      var paramsDiscount = {
        isAll: true,
        code: 'TrueOfFalse'
      }
      getDictsData(paramsDiscount).then(res => {
        this.searchOptions.filter(item => item.field === 'discount')[0].options = res.data
      })
    },
    // 页面权限
    getPermissions: function () {
      var permissionsBtnArr = localStorage.getItem("permissionsBtn");
      if(this.isDiscountPage) {   // 折扣
        this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:disProduct:create")     // 新增功能
        this.buttonList.filter(item => item.name === 'add')[1].show = this.isAddPermission = permissionsBtnArr.includes("furniture:disProduct:create")     // 批量上传功能
        this.buttonList.filter(item => item.name === 'delete')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:disProduct:delete")     // 删除功能

        // 表格按钮权限
        tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("furniture:disProduct:update"))   // 编辑功能
      }else {   // 正价
        this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:norProduct:create")     // 新增功能
        this.buttonList.filter(item => item.name === 'add')[1].show = this.isAddPermission = permissionsBtnArr.includes("furniture:norProduct:create")     // 批量上传功能
        this.buttonList.filter(item => item.name === 'delete')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:norProduct:delete")     // 删除功能

        // 表格按钮权限
        tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("furniture:norProduct:update"))   // 编辑功能
      }

    },
    // 获取列表数据
    _getProductList: function (pageNum, pageSize) {
      var params = this.search
      params.pageNum = pageNum,
      params.pageSize = pageSize,

      this.table.tableLoading = true
      getProductList(params).then(res => {
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
      this.brandSeriesChooseOptions(e, false) // 品列赋值

      this.search = e
      this._getProductList(1, this.table.pageSize);
    },
    // 查询-重置
    handleReset(e) {
      this.brandSeriesChooseOptions(e, true) // 品列赋值

      this.search = e
      this._getProductList(1, this.table.pageSize);
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
    handleExport: function () {
      let params = this.search
      params.pageSize = ''
      params.pageNum = ''
      params.export = true
      params.nameStr = ''
      params.fieldStr = ''
      this.table.title.forEach(function (item, index) {
        if(item.type != 'operat') {
          params.nameStr = params.nameStr + item.label + ','
          params.fieldStr = params.fieldStr + item.field + ','
        }
      });

      window.location.href = getProductList(params)
    },
    // 批量上传
    handleUpload() {
      this.$refs['batch-gift-model'].showModel();
    },
    // 每页显示条数
    handleSizeChange: function (val) {
      this.table.pageSize = val
      this._getProductList(this.table.pageNum, this.table.pageSize);
    },
    // 翻页
    handleCurrentChange: function (val) {
      this.table.pageNum = val
      this._getProductList(this.table.pageNum, this.table.pageSize);
    },
    // 双击行
    handleDblclick(row) {
      let query = {
          id: row.id
      }
      routerLinkPage(this, this.isDiscountPage ? 'ProductDiscountDetail' : 'ProductNormalDetail', query)
    },
    // 多选行数据
    handleSelectionChange(e) {
      this.table.selectionChange = e
    },
    show: function (type) {      //弹出弹出框   type(ref)
      this.$refs[type].showModel();
    },
    hide: function (type) {      //隐藏弹出框
      this.$refs[type].hideModel();
    },
    // 删除
    handleDelete() {
      this.buttonList.filter(item => item.name === 'delete')[0].loading = true
      if(this.table.selectionChange.length == 0) {
        this.$message({
          type: 'warning',
          message: '请先选择数据'
        })
        this.buttonList.filter(item => item.name === 'delete')[0].loading = false
        return
      }

      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._getDelProduct()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });

        this.buttonList.filter(item => item.name === 'delete')[0].loading = false
      });
    },
    // 删除确定
    _getDelProduct() {
      let ids = ''
      this.table.selectionChange.forEach(function (item, index) {
        ids += item.id + ','
      })
      ids = ids.substring(0, ids.length - 1)

      delProduct(ids).then(res => {
        if (res.status == 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this._getProductList(this.table.pageNum, this.table.pageSize)
        } else if (res.status == 500) {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
        this.buttonList.filter(item => item.name === 'delete')[0].loading = false
      })
    },
    // 新增
    handleAdd() {
      let query = {}
      routerLinkPage(this, this.isDiscountPage ? 'ProductDiscountAdd' : 'ProductNormalAdd', query)
    },
    // 编辑
    handleEdit(row) {
      let query = {
        id: row.id
      }
      routerLinkPage(this, this.isDiscountPage ? 'ProductDiscountAdd' : 'ProductNormalAdd', query)
    },
    // 查看
    handleView(row) {
      let query = {
        id: row.id
      }
      routerLinkPage(this, this.isDiscountPage ? 'ProductDiscountAdd' : 'ProductNormalAdd', query)
    },

    // 品列树
    _getBrandTree() {
      getBrandTree().then(res => {
        if (res.status == 200) {
          this.searchOptions.filter(item => item.field == 'brandId')[0].options = formatBrandTreeData(res.data.brandList)
        }
      })
    },
    // 品列树选择
    handleChange(value) {
      console.log(value);
    },
    // 品列赋值
    brandSeriesChooseOptions(e ,Reset) {
      let chooseOptions = []
      if(Reset) {  // 重置
        chooseOptions = this.searchOptions.filter(item => item.field === 'brandId')[0].chooseOptions = []
      }else {
        chooseOptions = this.searchOptions.filter(item => item.field === 'brandId')[0].chooseOptions
      }

      e.brandId = chooseOptions.length > 0 ? chooseOptions[0] : ''
      e.seriesId = chooseOptions.length > 1 ? chooseOptions[1] : ''

      return e
    },



    // 上传之前
    beforeAvatarUpload: function (file) {
        //验证上传文件的类型
        // if (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        //     this.isExcel = true
        // } else {
        //     this.isExcel = false
        // }
        var newArr = file.name.split('.')
        var newType = newArr[1]

        if (newType == 'xls') {
            this.isExcel = true
        } else {
            this.isExcel = false
        }

        if (!this.isExcel) {
            this.$message({
                message: '上传文件只能是 xls 格式',
                type: 'error'
            })
        }

        return this.isExcel;
    },
    //批量产品上传成功
    handleSuccesBatch: function (response, file, fileList) {
        console.log(response)
        this.batchForm.batchData = response.data
        this._getProductList(this.table.pageNum, this.table.pageSize);
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
    //关闭批量导入积分产品   （知道了）
    dialogBatchHide: function (type) {
        this.batchForm.fileList1 = []
        this.batchForm.batchData = null
        this.$refs[type].hideModel();
    },

  }
}
</script>

<style>
</style>
