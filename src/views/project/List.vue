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
  </div>
</template>

<script type="text/ecmascript-6">
import Search from '@/components/Search'
import Table from '@/components/Table'
import Dialog from 'base/Dialog';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, formatBrandTreeData } from 'common/js/dom';
import { getDictsData, getProjectList, delProject, exportProjectDetail } from 'api/interface';

export default {
  components: {
    Search,
    Table,
    'dialogModel': Dialog,
  },
  name: "ProductList",
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
        }
      ],

      // 搜索栏
      searchOptions: [
        {
          label: '方案名称',
          field: 'name',
          value: '',
          type: 'input',
        },
        {
          label: '方案编号',
          field: 'number',
          value: '',
          type: 'input',
        },
        {
          label: '客户名称',
          field: 'customerName',
          value: '',
          type: 'input',
          hide: true,
        },
        {
          label: '公司名称',
          field: 'companyName',
          value: '',
          type: 'input',
        },
        {
          label: '联系人',
          field: 'contact',
          value: '',
          type: 'input',
        },
        {
          label: '联系电话',
          field: 'phone',
          value: '',
          type: 'input',
          hide: true,
        },
        {
          label: '创建时间',
          field: 'createdTime',
          value: '',
          type: 'input',
          hide: true,
        },
      ],
      search: {},

      // 表格
      table: {
        title: [
          {
            label: '方案名称',
            field: 'name',
            width: 200,
          },
          {
            label: '方案编号',
            field: 'number',
            width: 130,
            type: 'link',
            click: this.handleDblclick
          },
          {
            label: '客户名称',
            field: 'customerName',
          },
          {
            label: '公司名称',
            field: 'companyName',
            width: 200,
          },
          {
            label: '联系人',
            field: 'contact',
          },
          {
            label: '联系电话',
            field: 'phone',
          },
          {
            label: '总金额',
            field: 'amount',
            width: 100,
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
              { name: '查看', type: 'view', show: true, click: this.handleView }
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

      exportTitle: [
        {
          label: '产品名称',
          field: 'name',
          width: 200,
        },
        {
          label: '产品编号',
          field: 'number',
          type: 'link',
          click: this.handleDblclick,
        },
        {
          label: '数量',
          field: 'quantity',
        },
        {
          label: '小计',
          field: 'subtotal',
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
          label: '商品状态',
          field: 'status',
          type: 'radioProductStatus',
        },
        {
          label: '材质说明',
          field: 'instructions',
          width: 200,
        },
        {
          label: '型号',
          field: 'modelNumber',
        },
        {
          label: '规格',
          field: 'size',
          width: 200,
        },
        {
          label: '单价',
          field: 'unitPrice',
        },
        {
          label: '体积',
          field: 'volume',
        },
        {
          label: '图片',
          field: 'image',
          type: 'image',
          width: 150,
        },
        {
          label: '图片',
          field: 'imgMainSrc',
          type: 'image',
          width: 150,
        },
      ],

    }
  },
  created() {
    this.search = formatSearch(this.searchOptions)
    this._getDictsData()
    this.getPermissions()
    this._getProjectList(this.table.pageNum, this.table.pageSize);
  },
  mounted() {

  },
  methods: {
    // 数据字典
    _getDictsData: function () {

    },
    // 页面权限
    getPermissions: function () {
      var permissionsBtnArr = localStorage.getItem("permissionsBtn");
      // this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:project:create")     // 无新增功能
      this.buttonList.filter(item => item.name === 'delete')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:project:delete")     // 删除功能
      // 表格按钮权限
      // tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("furniture:project:update"))   // 无编辑功能
    },
    // 获取列表数据
    _getProjectList: function (pageNum, pageSize) {
      var params = this.search
      params.pageNum = pageNum,
      params.pageSize = pageSize,

      this.table.tableLoading = true
      getProjectList(params).then(res => {
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
      this.search = e
      this._getProjectList(1, this.table.pageSize);
    },
    // 查询-重置
    handleReset(e) {
      this.search = e
      this._getProjectList(1, this.table.pageSize);
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


      // this.buttonList.filter(item => item.name === 'export')[0].loading = true
      if(this.table.selectionChange.length == 0) {
        this.$message({
          type: 'warning',
          message: '请先选择数据'
        })
        this.buttonList.filter(item => item.name === 'export')[0].loading = false
        return
      }else if(this.table.selectionChange.length > 1) {
        this.$message({
          type: 'warning',
          message: '只能选择导出一条数据'
        })
         this.buttonList.filter(item => item.name === 'export')[0].loading = false
         return
      }

      console.log(this.table.selectionChange)

      let params = {
        // nameStr: ',商品名称,商品编号,数量,小计,品牌,系列,工艺,分类,,,',
        // fieldStr: ',name,number,quantity,subtotal,brandName,seriesName,craftNames,categoryNames,,',
        nameStr: '序号,图片,名称,编号,规格,型号,数量,单位,单价,小计,材质说明',
        fieldStr: 'indexes,imgMain,name,number,size,modelNumber,quantity,unit,unitPrice,subtotal,instructions',
        fieldTail: 'amount,name,companyName,contact,phone,customerName',
        id: this.table.selectionChange[0].id,
      }


       // Long id = 9L;
       //                fieldStr = "indexes,imgMain,name,number,size,modelNumber,quantity,unit,unitPrice,subtotal,instructions";
       //                nameStr = "序号,图片,名称,编号,规格,型号,数量,单位,单价,小计,材质说明";


      console.log(params)

      window.location.href = exportProjectDetail(params)
    },
    // 每页显示条数
    handleSizeChange: function (val) {
      this.table.pageSize = val
      this._getProjectList(this.table.pageNum, this.table.pageSize);
    },
    // 翻页
    handleCurrentChange: function (val) {
      this.table.pageNum = val
      this._getProjectList(this.table.pageNum, this.table.pageSize);
    },
    // 双击行
    handleDblclick(row) {
      let query = {
          id: row.id
      }
      routerLinkPage(this, 'ProjectDetail', query)
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
        this._getdelProject()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        this.buttonList.filter(item => item.name === 'delete')[0].loading = false
      });
    },
    // 删除确定
    _getdelProject() {
      let ids = ''
      this.table.selectionChange.forEach(function (item, index) {
        ids += item.id + ','
      })
      ids = ids.substring(0, ids.length - 1)

      delProject(ids).then(res => {
        if (res.status == 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this._getProjectList(this.table.pageNum, this.table.pageSize)
        } else if (res.status == 500) {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
        this.buttonList.filter(item => item.name === 'delete')[0].loading = false
      })
    },
    // 查看
    handleView(row) {
      let query = {
        id: row.id
      }
      routerLinkPage(this, 'ProjectDetail', query)
    },

  }
}
</script>

<style>
</style>

<!-- {
  "amount": 27000,
  "companyName": "创美老板办公室",
  "contact": "购买方联系人",
  "customerName": "万泰业务员",
  "name": "创美老板办公方案",
  "phone": "18924540017",
  "projectDetailList": [
    {
      "productId": "143",
      "quantity": 4,
      "specificationId": "394",
      "subtotal": 5000
    },
    {
      "productId": "143",
      "quantity": 1,
      "specificationId": "396",
      "subtotal": 7000
    }
  ],
  "remark": "备注说明"
} -->
