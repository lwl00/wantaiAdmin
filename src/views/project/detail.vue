<template>
  <div class="app-container">
    <div class="filter-container" v-loading="loading">
      <div class="add-page-button-warp">
        <ButtonGroup :buttonList="buttonList"></ButtonGroup>
      </div>
      <el-form :model="addForm" ref="addProductForm" :rules="rules" label-width="170px" class="" size="small">
        <el-row :gutter="0" class="query">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="方案名称" prop="name" :label-width="formLabelWidth">
              <el-input v-model="addForm.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="方案编号" prop="number" :label-width="formLabelWidth">
              <el-input v-model="addForm.number" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="客户名称" prop="customerName" :label-width="formLabelWidth">
              <el-input v-model="addForm.customerName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="公司名称" prop="companyName" :label-width="formLabelWidth">
              <el-input v-model="addForm.companyName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="联系人" prop="contact" :label-width="formLabelWidth">
              <el-input v-model="addForm.contact" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth">
              <el-input v-model="addForm.phone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="总金额" prop="amount" :label-width="formLabelWidth">
              <el-input v-model="addForm.amount" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="创建人" prop="creator" :label-width="formLabelWidth">
              <el-input v-model="addForm.creator" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="创建时间" prop="createdTime" :label-width="formLabelWidth">
              <el-input v-model="addForm.createdTime" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="修改人" prop="modifier" :label-width="formLabelWidth">
              <el-input v-model="addForm.modifier" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="修改时间" prop="modifiedTime" :label-width="formLabelWidth">
              <el-input v-model="addForm.modifiedTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="detailListTitle">方案明细</div>
      <div class="cmyyTable">
        <Table :table="table" @dblclick="handleDblclick" @handleSelectionChange="handleSelectionChange"></Table>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import ButtonGroup from '@/components/ButtonGroup'
import Table from '@/components/Table'
import Dialog from 'base/Dialog';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, dataToString } from 'common/js/dom';
import { getProject } from 'api/interface';

export default {
  components: {
    ButtonGroup,
    Table,
    'dialogModel': Dialog,
  },
  name: "ProductAdd",
  data() {
    return {
      loading: false,  // 页面
      formLabelWidth: '100px',
      id: '',

      // 操作栏按钮（主表）
      buttonList: [
        {
          name: 'back',
          type: '',
          icon: '',
          text: '返回',
          class: '',
          show: true,
          loading: false,
          click: this.handleBack,
        },
      ],
      addForm: {
        name: '',
        number: '',
        customerName: '',
        companyName: '',
        contact: '',
        phone: '',
        amount: '',
        creator: '',
        createdTime: '',
        modifier: '',
        modifiedTime: '',
        remark: '',
        projectDetailList: []
      },
      table: {
        title: [
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
    this.id = this.$route.query.id
    if(this.id) {
      this._getProject()
    }
  },
  mounted() {

  },
  methods: {

    // 获取数据
    _getProject() {
      this.loading = true
      getProject(this.id).then(res => {
        this.loading = false
        if (res.status == 200) {
          this.addForm = res.data.project
          this.addForm.createdTime = dataToString(this.addForm.createdTime)
          this.addForm.modifiedTime = dataToString(this.addForm.modifiedTime)

          // 明细表
          if(res.data.project.productSpecifiList.length > 0) {
            res.data.project.productSpecifiList.forEach(function(item, index) {
              if(item.image) {
                item.imageUrl = item.imageSrc
              }
            })
            this.table.tableData = res.data.project.productSpecifiList
          }else {
            this.table.tableData = []
          }
        }
      })
    },
    // 返回
    handleBack() {
      let query = {}
      routerLinkPage(this, 'ProjectList', query)
    },
    // 双击行
    handleDblclick(row) {
      let query = {
          id: row.productId
      }
      routerLinkPage(this, row.discount ? 'ProductDiscountDetail' : 'ProductNormalDetail', query)
    },
    // 多选行数据
    handleSelectionChange(e) {},
  }
}
</script>

<style>
</style>
