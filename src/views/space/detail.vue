<template>
  <div class="app-container">
    <div class="filter-container" v-loading="loading">
      <div class="add-page-button-warp">
        <ButtonGroup :buttonList="buttonList"></ButtonGroup>
      </div>

      <el-form :model="addForm" ref="addSpaceForm" :rules="rules" label-width="170px" class="" size="small">

        <el-row :gutter="0" class="query">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="空间名称" prop="name" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.name"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-if="isShow.number">
            <el-form-item label="空间编号" prop="number" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.number"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.remark"
                disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="空间图(多张)" prop="imgMain" :label-width="formLabelWidth">
              <img
                v-for="(item, indx) in upload.effectFileList"
                :key="index"
                :src="item.response.data" class="avatar" style="display: inline-block;margin-left: 5px;">
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>


      <div class="detailListTitle">商品明细</div>
      <div class="cmyyTable">
        <Table :table="table" @dblclick="handleDblclick" @handleSelectionChange="handleSelectionChange"></Table>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import ButtonGroup from '@/components/ButtonGroup'
import Search from '@/components/Search'
import Table from '@/components/Table'
import Dialog from 'base/Dialog';
import DialogProduct from '@/components/DialogProduct';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, arrToString, formatBrandTreeData, delTableDataDetailReturn } from 'common/js/dom';
import { getDictsData, getSpace, addSpace, editSpace, getBrandTree, imageUploadAction, imagesUploadAction } from 'api/interface';

export default {
  components: {
    ButtonGroup,
    Search,
    Table,
    'dialogModel': Dialog,
    DialogProduct,
  },
  name: "SpaceDetail",
  data() {
    return {
      loading: false,  // 页面
      saveLoading: false, // 新增保存

      formLabelWidth: '100px',
      id: '',

      // 操作栏按钮（主表）
      buttonList: [
        {
          name: 'cancel',
          type: '',
          icon: '',
          text: '返回',
          class: '',
          show: true,
          loading: false,
          click: this.handleCancel,
        },
      ],


      // 表单数据
      addForm: {
        name: '',  // 产品名称
        number: '',  // 产品编号
        remark: '',  //
        productList: [],  // 明细表
        spaceDetailList: [],  // 明细表
        spaceImgList: [],  // 实景效果图表
      },

      // 表单展示
      isShow: {
        number: false
      },

      // options
      options: {
        crafts: [],
        craftsOptions: [],

        categorys: [],
        categorysOptions: [],

        statusOptions: [],

        discountOptions: [],

        unitOptions: [],

        brandId: [],  // [10, 11]
        brandTree: [],
      },

      rules: {
        name: [{ required: true, message: '请输入空间名称', trigger: 'blur' }],

        modelNumber: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        size: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],

      },

      // 明细表
      detailForm: {
        productId: '',  // 商品ID（传后台）
        productName: '',  // 商品名称
        productNumber: '',  // 商品编号
      },


      table: {
        detailRowIndex: null, // 选中行好
        addRow: null, // 选中行
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
            field: 'craftsName',
            width: 200,
          },
          {
            label: '分类',
            field: 'categorysName',
            width: 200,
          },
          {
            label: '关联产品',
            field: 'contactsName',
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
            width: '150px',
          },
          {
            label: '图片',
            field: 'imgMain',
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

      /*
       * 图片上传
       */
      upload: {
        imageUploadAction: imageUploadAction(),   // 上传单图action
        imagesUploadAction: imagesUploadAction(),   // 上传多图action
        mainLimitNum: 1,    // 主图/明细图最多一张，其他图可以多张
        mainImage: '',  // 主图
        mainFileList: [],

        effectFileList: [],  // 实景图

        detailImage: '',  // 明细图
        detailFileList: [],
      },
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  created() {
    this.id = this.$route.query.id
    this._getDictsData()
    if(this.id) {
      this._getSpace(this.id)
      this.isShow.number = true
    }else {
      this._getSpace("")
      this.isShow.number = false
    }
  },
  mounted() {

  },
  methods: {
    // 数据字典
    _getDictsData() {

    },
    // 获取数据
    _getSpace(id) {
      let _this = this
      this.loading = id ? true : false
      getSpace(id).then(res => {
        this.loading = false
        if (res.status == 200) {
          if(id) {  // 获取编辑数据
            this.addForm = res.data.space

            // 明细表
            if(res.data.space.productList.length > 0) {
              let productList = []
              res.data.space.productList.forEach(function(item, index) {
                if(item) {
                  if(item.imgMain) {
                    item.imageUrl = item.imgMainSrc
                  }
                  productList.push(item)
                }
              })
              this.table.tableData = productList
            }else {
              this.table.tableData = []
            }

            // 实景图
            if(res.data.space.spaceImgList.length > 0) {
              res.data.space.spaceImgList.forEach(function(item, index) {
                if(item.image) {
                  let obj = {
                    url: item.imageSrc,
                    response: {
                      data: item.imageSrc,
                    }

                  }
                  _this.upload.effectFileList.push(obj)
                }
              })
            }else {
              this.upload.effectFileList = []
            }

          }else {  // 新增时，自动生成产品编号
            this.addForm.number = res.data.space.number
          }
        }
      })
    },
    // 取消
    handleCancel() {
      let query = {}
      routerLinkPage(this, 'SpaceList', query)
    },


    /* 明细表 */
    // 双击行
    handleDblclick(row) {
      let query = {
          id: row.id
      }
      routerLinkPage(this, row.discount ? 'ProductDiscountDetail' : 'ProductNormalDetail', query)
    },

    // 把每一行的索引放进row.row_index
    rowClassName({row, rowIndex}) {
      row.row_index = rowIndex+1;
    },

  }
}
</script>

<style>
  .el-upload-list--picture-card .el-upload-list__item,
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  .el-upload-list--picture-card .el-upload-list__item-status-label i {
    position: absolute;
    top: 0;
    right: 15px;
  }
</style>
