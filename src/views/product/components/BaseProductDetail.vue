<template>
  <div class="app-container">
    <div class="filter-container" v-loading="loading">
      <div class="add-page-button-warp">
        <ButtonGroup :buttonList="buttonList"></ButtonGroup>
      </div>

      <el-form :model="addForm" ref="addProductForm" :rules="rules" label-width="170px" class="" size="small">

        <el-row :gutter="0" class="query">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="产品名称" prop="" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.name"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-if="isShow.number">
            <el-form-item label="产品编号" prop="number" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.number"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="品牌" prop="brandName" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.brandName"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="系列" prop="seriesName" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.seriesName"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="工艺" prop="craftsName" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.craftsName"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="分类" prop="categorysName" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.categorysName"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="商品状态" prop="" :label-width="formLabelWidth">
              <el-radio-group v-model="addForm.status" disabled>
                <el-radio
                  v-for="item in options.statusOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                  {{item.name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="是否折扣" prop="" :label-width="formLabelWidth">
              <el-radio-group v-model="addForm.discount" disabled>
                <el-radio
                  v-for="item in options.discountOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                  {{item.name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="材质说明" prop="instructions" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.instructions"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="颜色" prop="color" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.color"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="单位" prop="unitName" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.unitName"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="关联产品" prop="contactsName" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.contactsName"
                disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="商品主图" prop="imgMain" :label-width="formLabelWidth">
               <img v-if="upload.mainImage" :src="upload.mainImage" class="productAvatar">
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="场景图" prop="imgMain" :label-width="formLabelWidth">
               <img
                 v-for="(item, indx) in upload.effectFileList"
                 :key="index"
                 :src="item.response.data" class="avatar" style="display: inline-block;margin-right: 5px;">
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>


      <div class="detailListTitle">规格明细</div>
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
import { getDictsData, getProduct, addProduct, editProduct, getBrandTree, imageUploadAction, imagesUploadAction } from 'api/interface';

export default {
  components: {
    ButtonGroup,
    Search,
    Table,
    'dialogModel': Dialog,
    DialogProduct,
  },
  name: "BaseProductDetail",
  props: {
    isDiscountPage: {
      type: Boolean,
      default: false,
    },
  },
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
        brandId: '',  //
        seriesId: '',  //
        crafts: '',  //
        categorys: '',  //
        imgMain: '',  //
        status: 'true',  //
        discount: 'false',  //
        unit: '',  //
        instructions: '',  //
        specificationList: [],  // 明细表
        imgEffectList: [],  // 实景效果图表
        contactsName: '',  // 关联产品名称
        contactNumbers: '',  // 关联产品编号
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
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        brandId: [{ required: true, message: '请选择品列', trigger: 'change' }],
        crafts: [{ required: true, message: '请选择工艺', trigger: 'change' }],
        categorys: [{ required: true, message: '请选择分类', trigger: 'change' }],
        status: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
        discount: [{ required: true, message: '请选择是否折扣商品', trigger: 'change' }],

        modelNumber: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        size: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],

      },

      // 明细表
      detailForm: {
        modelNumber: '',  // 型号
        size: '',  // 规格
        unitPrice: '',  // 单价
        volume: '',  // 体积
        image: '',  // 图片
      },


      table: {
        title: [
          {
            label: '型号',
            field: 'modelNumber',
            type: 'input',
          },
          {
            label: '规格',
            field: 'size',
            type: 'input',
          },
          {
            label: '单价',
            field: 'unitPrice',
            type: 'input',
          },
          {
            label: '体积',
            field: 'volume',
            type: 'input',
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
    }
  },
  created() {
    this.id = this.$route.query.id
    if(this.id) {
      this._getDictsData()
      this._getProduct(this.id)
      this.isShow.number = true
    }else {
      this.isShow.number = false
    }
  },
  mounted() {

  },
  methods: {
    // 数据字典
    _getDictsData() {
      // 状态
      var paramsProductStatus = {
        isAll: false,
        code: 'ProductStatus'
      }
      getDictsData(paramsProductStatus).then(res => {
        this.options.statusOptions = res.data
      })
      // 折扣
      var paramsDiscount = {
        isAll: false,
        code: 'TrueOfFalse'
      }
      getDictsData(paramsDiscount).then(res => {
        this.options.discountOptions = res.data
      })
    },
    // 获取数据
    _getProduct(id) {
      let _this = this
      this.loading = id ? true : false
      getProduct(id).then(res => {
        this.loading = false
        if (res.status == 200) {
          this.addForm = res.data.product
          this.addForm.status = res.data.product.status ? 'true' : 'false'
          this.addForm.discount = res.data.product.discount ? 'true' : 'false'

          // 明细表
          if(res.data.product.specificationList.length > 0) {
            res.data.product.specificationList.forEach(function(item, index) {
              item.isEdit = false
              if(item.image) {
                item.imageUrl = item.imageSrc
              }
            })
            this.table.tableData = res.data.product.specificationList
          }else {
            this.table.tableData = []
          }

          // 主图图片
          if(res.data.product.imgMain) {
            let response = {
              data: res.data.product.imgMainSrc
            }
            this.upload.mainImage = response.data
            this.upload.mainFileList.push(response)
          }

          // 实景图
          if(res.data.product.imgEffectList.length > 0) {
            res.data.product.imgEffectList.forEach(function(item, index) {
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
          console.log(this.upload.effectFileList)
        }
      })
    },
    // 取消
    handleCancel() {
      let query = {}
      routerLinkPage(this, this.isDiscountPage ? 'ProductDiscountList' : 'ProductNormalList', query)
    },
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
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
