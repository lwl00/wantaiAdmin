<template>
  <div class="cmyy">
    <div class="dialog-model-content">
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

    <div class="dialog-model-footer">
      <el-button
        type="primary"
        size="small"
        @click="handleDialogYes('dialog-model-product')">确定</el-button>
      <el-button size="small" @click="handleDialogNo('dialog-model-product')">取消</el-button>
    </div>
  </div>
</template>

<script>

  import Search from '@/components/Search'
  import Table from '@/components/Table'
  import Dialog from 'base/Dialog';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, arrToString, formatBrandTreeData, delTableDataDetailReturn } from 'common/js/dom';
  import { getDictsData, getProductList, delProduct, getBrandTree } from 'api/interface';


  export default {
    components: {
      Search,
      Table,
      'dialogModel': Dialog,
    },
    name: "DialogProduct",
    props: {
      tableprops: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        // options
        options: {
          crafts: [],
          craftsOptions: [],

          categorys: [],
          categorysOptions: [],

          statusOptions: [],

          discountOptions: [],

          unitOptions: [],

          brandId: [],  //
          brandTree: [],
        },

        /*
         * 选择商品
         */

        // 弹窗层
        dialog: {
          loading: false,
          dialogTitle: '选择商品',    //编辑弹窗标题
          dialogWidth: '1200px',   //弹窗宽度
          dialogHeight: 700,   //弹窗宽度（必须为number）
        },
        // 操作栏按钮（主表）
        buttonList: [],

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
            label: '是否折扣',
            field: 'discount',
            value: '',
            type: 'select',
            dictsCode: 'TrueOfFalse',
            options: [],
          },
        ],
        search: {},

        // 表格
        table: {
          title: [
            {
              label: '产品编号',
              field: 'number',
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
              field: 'craftsName',
            },
            {
              label: '分类',
              field: 'categorysName',
            },
            {
              label: '是否折扣库商品',
              field: 'discount',
              type: 'radio',
            },
            {
              label: '商品状态',
              field: 'status',
              type: 'radioProductStatus',
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

      }
    },
    created() {
      this.search = formatSearch(this.searchOptions)
      this._getDictsData()
      this._getBrandTree()
      this._getProductList(this.table.pageNum, this.table.pageSize);
    },
    mounted() {

    },
    methods: {
      // 数据字典
      _getDictsData() {
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
        // 折扣
        var paramsDiscount = {
          isAll: true,
          code: 'TrueOfFalse'
        }
        getDictsData(paramsDiscount).then(res => {
          this.searchOptions.filter(item => item.field === 'discount')[0].options = res.data
        })
      },
      // 品列树
      _getBrandTree() {
        getBrandTree().then(res => {
          if (res.status == 200) {
            this.searchOptions.filter(item => item.field == 'brandId')[0].options = formatBrandTreeData(res.data.brandList)
          }
        })
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

            // 需要计算table高度（暂时不用）
            this.calculateTableHeightDialog()
            window.onresize = () => {   // 缩放窗口实时计算
              this.calculateTableHeightDialog()
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
      // 查询条件是否展开(暂时不用)
      handleChange(e) {
        var _this = this
        this.$nextTick(function () {
          setTimeout(function () {
            this.calculateTableHeightDialog()
          }, 500)
        })
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
      // 商品弹窗双击行（不用）
      handleDblclick(row) {

      },
      // 商品弹窗多选行数据
      handleSelectionChange(e) {
        this.table.selectionChange = e
      },
      // 商品弹窗确定
      handleDialogYes() {
        if(this.table.selectionChange.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择商品'
          })
          return false
        }
        this.$emit('handleDialogYes', this.table.selectionChange)
      },
      // 商品弹窗取消
      handleDialogNo(type) {
        this.$emit('handleDialogNo')
      },

      // 管理列表页面动态计算table高度
      calculateTableHeightDialog(_this) {
        var homePageHeight = this.dialog.dialogHeight
        var searchToolbarHeight = this.$refs.searchToolbar.offsetHeight
        var cmyyPpaginationHeight = this.$refs.cmyyPpagination.offsetHeight

        this.table.tableHeight = homePageHeight - searchToolbarHeight - cmyyPpaginationHeight - 192
      },
    }
  }
</script>

<style>
</style>
