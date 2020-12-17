<template>
  <div class="app-container">
    <div class="filter-container" v-loading="loading">
      <div class="add-page-button-warp">
        <ButtonGroup :buttonList="buttonList"></ButtonGroup>
      </div>

      <el-form :model="addForm" ref="addProductForm" :rules="rules" label-width="170px" class="" size="small">

        <el-row :gutter="0" class="query">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="产品名称" prop="name" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.name"
                @input="handleDeleteBlankSpacer($event, 'name')"
                placeholder="请填写产品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-if="isShow.number">
            <el-form-item label="产品编号" prop="number" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.number"
                @input="handleDeleteBlankSpacer($event, 'number')"
                placeholder="请填写产品编号"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="品列" prop="brandId" :label-width="formLabelWidth">
              <el-cascader
                v-model="options.brandId"
                :options="options.brandTree"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange($event)"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="工艺" prop="crafts" :label-width="formLabelWidth">
                <el-select v-model="options.crafts" multiple collapse-tags placeholder="请选择工艺" @change="changeCrafts($event)">
                  <el-option
                    v-for="item in options.craftsOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="分类" prop="categorys" :label-width="formLabelWidth">
                <el-select v-model="options.categorys" multiple collapse-tags placeholder="请选择分类" @change="changeCategorys($event)">
                  <el-option
                    v-for="item in options.categorysOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="商品状态" prop="status" :label-width="formLabelWidth">
              <el-radio-group v-model="addForm.status">
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
            <el-form-item label="是否折扣" prop="discount" :label-width="formLabelWidth">
              <el-radio-group v-model="addForm.discount">
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
                @input="handleDeleteBlankSpacer($event, 'instructions')"
                placeholder="请填写材质说明"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="颜色" prop="color" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.color"
                @input="handleDeleteBlankSpacer($event, 'color')"
                placeholder="请填写颜色"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="单位" prop="unit" :label-width="formLabelWidth">
              <el-select v-model="addForm.unit" placeholder="请选择单位" size="small">
                <el-option
                  v-for="item in options.unitOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="关联产品" prop="contactsName" :label-width="formLabelWidth">
              <el-tooltip class="item" effect="light"  placement="bottom" popper-class="searchWarp_tooltip">
                <div slot="content">{{addForm.contactsName ? addForm.contactsName : '暂无内容'}}</div>
                <el-input
                  placeholder="请选择商品"
                  v-model="addForm.contactsName"
                  disabled>
                  <template slot="append">
                    <el-button @click="showProduct">选择</el-button>
                  </template>
                </el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="商品主图" prop="imgMain" :label-width="formLabelWidth">
                <el-upload
                  class="avatar-uploader"
                  :action="upload.imageUploadAction"
                  :before-upload="beforeUpload"
                  :show-file-list="false"
                  :on-success="handleMianSuccess"
                  :on-error="handleErrorUpload">
                  <img v-if="upload.mainImage" :src="upload.mainImage" class="productAvatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="场景图" prop="imgEffectList" :label-width="formLabelWidth">
                <el-upload
                  ref="upload"
                  :action="upload.imageUploadAction"
                  :on-preview="handlePreview"
                  :before-upload="beforeUpload"
                  :on-remove="handleEffectRemove"
                  :on-success="handleEffectSuccess"
                  :on-error="handleErrorUpload"
                  :file-list="upload.effectFileList"
                  :multiple="false"
                  list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>


      <div class="detailListTitle">规格明细</div>
      <div class="add-page-button-warp">
        <ButtonGroup :buttonList="buttonListDetailTable"></ButtonGroup>
      </div>
      <el-row>
        <el-col span="24">
          <el-table
            size="mini"
            :data="detail.tableData"
            border
            style="width: 100%"
            highlight-current-row
            :row-class-name="rowClassName"
            @cell-dblclick="handleDblclick">
            <el-table-column type="index"></el-table-column>
            <el-table-column
              v-for="(item, index) in detail.title"
              :key="index"
              :prop="item.field"
              :label="item.label"
              :width="item.width">
              <template slot-scope="scope">
                <!-- input -->
                <div v-if="item.type == 'input'">
                  <span v-if="scope.row.isEdit">
                    <el-input
                      size="mini"
                      placeholder="请输入内容"
                      @input="handleDeleteBlankSpacerDetail($event, item.field)"
                      v-model="detail.addRow[item.field]">
                    </el-input>
                  </span>
                  <span v-if="!scope.row.isEdit">{{scope.row[item.field]}}</span>
                </div>

                <!-- upload -->
                <div v-if="item.type == 'upload'">
                  <span v-if="scope.row.isEdit">
                    <el-upload
                      class="avatar-uploader"
                      :action="upload.imageUploadAction"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      :on-success="handleDetailSuccess"
                      :on-error="handleErrorUpload">
                      <img v-if="upload.detailImage" :src="upload.detailImage" class="productAvatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </span>
                  <span v-if="!scope.row.isEdit"><img v-if="scope.row.url" :src="scope.row.url" class="productAvatar"></span>
                </div>

              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row, scope.$index, true)">
                  {{scope.row.isEdit?'保存':"修改"}}
                </span>
                <span v-if="!scope.row.isEdit" class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="handleDetailDelete(scope.row, scope.$index)">
                  删除
                </span>
                <span v-if="scope.row.isEdit" class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row, scope.$index, false)">
                  取消
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>


      <!-- 选择商品弹出层 -->
      <dialogModel
        class="dialog-model"
        ref="dialog-model-product"
        :title="dialog.dialogTitle"
        width="80%">
        <DialogProduct
          @handleDialogYes="handleDialogYes"
          @handleDialogNo="handleDialogNo"></DialogProduct>
      </dialogModel>


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
  name: "BaseProductAdd",
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
          name: 'save',
          type: 'primary',
          icon: '',
          text: '保存',
          class: '',
          show: true,
          loading: false,
          click: this.handleSave,
        },
        {
          name: 'cancel',
          type: '',
          icon: '',
          text: '取消',
          class: '',
          show: true,
          loading: false,
          click: this.handleCancel,
        },
      ],
      // 操作栏按钮（明细表）
      buttonListDetailTable: [
        {
          name: 'save',
          type: 'primary',
          icon: '',
          text: '新增',
          class: '',
          show: true,
          loading: false,
          click: this.handleDetailAdd,
        },
      ],

      // 表单数据
      addForm: {
        name: '',  // 产品名称
        number: '',  // 产品编号
        brandId: '',  //
        seriesId: '',  //
        crafts: '',  //
        craftsName: '',  //
        categorys: '',  //
        categorysName: '',  //
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
        name: [{ required: false, message: '请输入产品名称', trigger: 'blur' }],
        brandId: [{ required: true, message: '请选择品列', trigger: 'change' }],
        crafts: [{ required: true, message: '请选择工艺', trigger: 'change' }],
        categorys: [{ required: true, message: '请选择分类', trigger: 'change' }],
        status: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
        discount: [{ required: true, message: '请选择是否折扣商品', trigger: 'change' }],
        unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
        imgMain: [{ required: false, message: '请选择上传商品主图', trigger: 'change' }],
        imgEffectList: [{ required: false, message: '请选择上传场景图', trigger: 'change' }],

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


      detail: {
        addRow: null, // 选中行
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
            type: 'upload',
          },

        ],
        tableData: [
          // 自定义 字段isEdit  默认为false，true为编辑状态
          // { modelNumber: 'modelNumber', size: 'size', unitPrice: 'unitPrice', volume: 'volume', image: '', id: 1, "isEdit": false }
        ],
      },


      /*
       * 选择商品
       */

      // 弹窗层
      dialog: {
        loading: false,
        dialogTitle: '选择商品',    //编辑弹窗标题
        dialogWidth: '1200px',   //弹窗宽度
      },
      // 操作栏按钮（主表）
      buttonListDialogProduct: [],
      searchOptionsDialogProduct: [],
      // 搜索栏
      searchOptionsDialogProduct: [
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
      searchDialogProduct: {},

      // 弹窗表格
      tableDialogProduct: {
        title: [
          {
            label: '产品名称',
            field: 'name',
            width: 200,
          },
          {
            label: '产品编号',
            field: 'number',
          },
          {
            label: '品列ID',
            field: 'brandId',
          },
          {
            label: '系列ID',
            field: 'seriesId',
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
            label: '关联产品',
            field: 'contactsName',
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
          {
            label: '材质说明',
            field: 'instructions',
            width: '150px',
          },
          {
            label: '操作',
            field: '',
            type: 'operat',
            options: [
              { name: '编辑', type: 'update', show: true, click: this.handleEdit }
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
    this._getBrandTree()
    if(this.id) {
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
      // 工艺
      var paramsCraft = {
        isAll: false,
        code: 'Craft'
      }
      getDictsData(paramsCraft).then(res => {
        this.options.craftsOptions = res.data
      })
      // 分类
      var paramsCategory = {
        isAll: false,
        code: 'Category'
      }
      getDictsData(paramsCategory).then(res => {
        this.options.categorysOptions = res.data
      })
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
      // 单位
      var paramsUnit = {
        isAll: false,
        code: 'Unit'
      }
      getDictsData(paramsUnit).then(res => {
        this.options.unitOptions = res.data
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
          // this.addForm.discount = res.data.product.discount ? 'true' : 'false'
          // 品列
          let brandIdArr = []
          brandIdArr.push(res.data.product.brandId)
          brandIdArr.push(res.data.product.seriesId)
          this.options.brandId = brandIdArr

          // 工艺
          let crafts = res.data.product.crafts
          if(crafts.indexOf(",") >= 0) {
            this.options.crafts = crafts.split(',')
          }else {
            this.options.crafts.push(crafts)
          }

          // 分类
          let categorys = res.data.product.categorys
          if(categorys.indexOf(",") >= 0) {
            this.options.categorys = categorys.split(',')
          }else {
            this.options.categorys.push(categorys)
          }

          // 明细表
          if(res.data.product.specificationList.length > 0) {
            res.data.product.specificationList.forEach(function(item, index) {
              item.isEdit = false
              if(item.image) {
                item.url = item.imageSrc
              }
            })
            this.detail.tableData = res.data.product.specificationList
          }else {
            this.detail.tableData = []
          }

          // 主图图片 TODO
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
        }
      })
    },
    // 品列树
    _getBrandTree() {
      getBrandTree().then(res => {
        if (res.status == 200) {
          this.options.brandTree = formatBrandTreeData(res.data.brandList);
        }
      })
    },
    // 品列树选择
    handleChange(e) {
      console.log(e);
      this.addForm.brandId = e[0]
      this.addForm.seriesId = e[1]
    },
    // 保存
    handleSave() {
      let _this = this
      // this.addForm.crafts = arrToString(this.options.crafts)
      // this.addForm.categorys = arrToString(this.options.categorys)
      // this.addForm.brandId = this.options.brandId[0]
      // this.addForm.seriesId = this.options.brandId[1]
      this.addForm.discount = this.isDiscountPage  // 页面传值

      // 主图
      if(this.upload.mainImage.indexOf("/") >= 0) {
        this.addForm.imgMain = this.upload.mainImage.split("/").pop()
      }else {
        this.addForm.imgMain = this.upload.mainImage
      }

      // 实景图
      this.addForm.imgEffectList = []
      this.upload.effectFileList.forEach(function(item, index) {
        item.responseData = item.response.data.split("/").pop()
        let img = {
          image: item.response.data.split("/").pop()
        }
        _this.addForm.imgEffectList.push(img)
      })

      let params  = this.addForm
      let formName = 'addProductForm'

      console.log('保存参数', params)
      this.buttonList.filter(item => item.name === 'save')[0].loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if(this.detail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加规格明细'
            })
            this.buttonList.filter(item => item.name === 'save')[0].loading = false
            return false
          }
          this.detail.tableData.forEach(function(item, index) {
            if(item.isEdit) {
              _this.$message({
                type: 'warning',
                message: '请保存规格明细'
              })
              _this.buttonList.filter(item => item.name === 'save')[0].loading = false
              return false
            }
          })

          params.specificationList = this.detail.tableData
          if(this.id) {
            editProduct(params).then(res => {
              if (res.status == 200) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.handleCancel() // 跳转至列表页
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }
              this.buttonList.filter(item => item.name === 'save')[0].loading = false
            })
          }else {
            addProduct(params).then(res => {
              if (res.status == 200) {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.handleCancel() // 跳转至列表页
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }
              this.buttonList.filter(item => item.name === 'save')[0].loading = false
            })
          }

        } else {
          this.$message({
            type: 'warning',
            message: '请完善信息'
          })
          this.buttonList.filter(item => item.name === 'save')[0].loading = false
          return false;
        }
      })

    },
    // 取消
    handleCancel() {
      let query = {}
      routerLinkPage(this, this.isDiscountPage ? 'ProductDiscountList' : 'ProductNormalList', query)
    },


    /* 明细表 */
    // 双击行
    handleDblclick(row) {},

    // 把每一行的索引放进row.row_index
    rowClassName({row, rowIndex}) {
      row.row_index = rowIndex+1;
    },

    // 新增行
    handleDetailAdd() {
      for (let i of this.detail.tableData) {
        if (i.isEdit) return this.$message.warning("请先保存当前编辑项");
      }
      let j = { id: null, modelNumber: '', size: '', unitPrice: '', volume: '', image: '', "isEdit": true }
      this.detail.tableData.push(j);
      this.detail.addRow = JSON.parse(JSON.stringify(j));

      this.upload.detailImage = ''
      this.upload.detailFileList = []
    },

    // 删除行  √
    handleDetailDelete(row, index) {
      this.detail.tableData.splice(index, 1);
    },
    //修改
    pwdChange(row, index, cg) {
      console.log('行数据---', row)

      // 点击修改 判断是否已经保存所有操作
      for(let i of this.detail.tableData) {
        if (i.isEdit && i.row_index != row.row_index) {
          this.$message.warning("请先保存当前编辑项");
          return false;
        }
      }
      // 是否是取消操作
      if (!cg) {
        if (!this.detail.addRow.id) this.detail.tableData.splice(index, 1);
        return row.isEdit = !row.isEdit
      }

      if(row.isEdit) {  // 保存操作
        let data = JSON.parse(JSON.stringify(this.detail.addRow));
        for (let k in data) row[k] = data[k];

        // 明细图
        row.url = this.upload.detailImage
        if(this.upload.detailImage.indexOf("/") >= 0) {
          row.image = this.upload.detailImage.split("/").pop()
        }
        this.$message({
            type: 'success',
            message: "保存成功!"
        });
        row.isEdit = false;
      }else {  // 编辑
        if(row.image) {
          // 明细图
          let obj = {
            data: row.imageSrc
          }
          this.upload.detailImage = obj.data
          this.upload.detailFileList.push(obj)
        }
        this.detail.addRow = JSON.parse(JSON.stringify(row))
        row.isEdit = true;
      }
    },

    /*
     * 选择商品
     */
    show: function (type) {      //弹出弹出框   type(ref)
      this.$refs[type].showModel();
    },
    hide: function (type) {      //隐藏弹出框
      this.$refs[type].hideModel();
    },
    // 展示商品弹窗，请求商品第一页数据
    showProduct() {
      this.show('dialog-model-product')
    },
    // 商品弹窗确定
    handleDialogYes(e) {
      this.hide('dialog-model-product')
      let contactNumbers = ''
      let contactsName = ''
      e.forEach(function(item, index) {
        contactNumbers += item.number+','
        contactsName += item.name+','
      })
      this.addForm.contactNumbers = contactNumbers.substring(0, contactNumbers.length - 1)
      this.addForm.contactsName = contactsName.substring(0, contactsName.length - 1)
    },
    // 商品弹窗取消
    handleDialogNo(type) {
      this.$message('已取消')
      this.hide('dialog-model-product')
    },


    /*
     * 图片上传
     */
    // 主图
    // 点击图片上传
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除主图
    handleMianRemove(file, fileList) {
      this.upload.mainImage = ''
      this.upload.mainFileList = fileList
    },
    // 主图上传成功
    handleMianSuccess: function (response, file, fileList) {
      if(response.status == 200) {
        this.upload.mainImage = response.data
        this.upload.mainFileList = fileList
      }
    },
    // 主图超出限制回调
    handleMianExceed: function (files, fileList) {
      this.$message({
        type: 'error',
        message: '产品主图最多只能上传一张'
      })
    },
    // 删除实景图
    handleEffectRemove(file, fileList) {
      this.upload.effectFileList = fileList
    },
    // 实景图上传成功(多张)
    handleEffectSuccess: function (response, file, fileList) {
      if(response.status == 200) {
        this.upload.effectFileList = fileList
      }
    },
    // 明细图上传成功
    handleDetailSuccess: function (response, file, fileList) {
      if(response.status == 200) {
        this.upload.detailImage = response.data
        this.upload.detailFileList = fileList
      }
    },
    // 上传之前
    beforeUpload: function (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');

      if (!isJPG) {
        this.$message.error('上传图片格式之能是 JPG/PNG !');
      }
      return isJPG
    },
    // 上传失败
    handleErrorUpload: function (err, file, fileList) {
      this.$message({
        message: file.name + '上传失败',
        type: 'error'
      })
    },

    // 输入时去空格
    handleDeleteBlankSpacer(val, key) {
      this.addForm[key] = this.addForm[key].replace(/^\s+|\s+$/g, '').replace(/\s/g, '') // 去空格
    },

    // 输入时去空格（明细表）
    handleDeleteBlankSpacerDetail(val, key) {
      this.detail.addRow[key] = this.detail.addRow[key].replace(/^\s+|\s+$/g, '').replace(/\s/g, '') // 去空格
    },
    // 工艺选择
    changeCrafts(e) {
      let _this = this
      let nameArr = []
      e.forEach(function(el, elIndex) {
        _this.options.craftsOptions.forEach(function(item, index) {
          if(item.value == el) {
            nameArr.push(item.name)
          }
        })
      })
      this.addForm.crafts = arrToString(e)
      this.addForm.craftsName = arrToString(nameArr)
    },
    // 分类选择
    changeCategorys(e) {
      let _this = this
      let nameArr = []
      e.forEach(function(el, elIndex) {
        _this.options.categorysOptions.forEach(function(item, index) {
          if(item.value == el) {
            nameArr.push(item.name)
          }
        })
      })
      this.addForm.categorys = arrToString(e)
      this.addForm.categorysName = arrToString(nameArr)
    }
  },
  watch: {

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
<!--
{
  "name": "办公桌",
  "number": "",
  "brandId": 1,
  "seriesId": 1,
  "crafts": "1,2",
  "categorys": "2,3",
  "imgMain": "",
  "status": "true",
  "discount": "false",
  "unit": "1",
  "instructions": "材质说明",
  "specificationList": [
    {
      "id": null,
      "modelNumber": "BGZ-001",
      "size": "1800x1200x1000",
      "unitPrice": "1230",
      "volume": "1.5",
      "image": "",
    }
  ],
  "color": "棕色",
  "imgEffectList": []
} -->
