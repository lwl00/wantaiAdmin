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
                placeholder="请填写产品名称"
                maxlength="60"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-if="isShow.number">
            <el-form-item label="产品编号" prop="number" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.number"
                placeholder="请填写产品编号"
                maxlength="60"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="品列" prop="brandId" :label-width="formLabelWidth">
              <el-cascader
                v-model="options.brandId"
                :options="options.brandTree"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="工艺" prop="crafts" :label-width="formLabelWidth">
                <el-select v-model="options.crafts" multiple collapse-tags placeholder="请选择工艺">
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
                <el-select v-model="options.categorys" multiple collapse-tags placeholder="请选择分类">
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
            <el-form-item label="商品主图" prop="imgMain" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.imgMain"
                placeholder="请填写商品主图"
                maxlength="60"></el-input>
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
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
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
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="材质说明" prop="instructions" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.instructions"
                placeholder="请填写材质说明"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="颜色" prop="color" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.color"
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
            <el-form-item label="关联产品" prop="contactNumbers" :label-width="formLabelWidth">
              <el-tooltip class="item" effect="light"  placement="bottom" popper-class="searchWarp_tooltip">
                <div slot="content">{{addForm.contactNumbers ? addForm.contactNumbers : '暂无内容'}}</div>
                <el-input
                  placeholder="请选择商品"
                  v-model="addForm.contactNumbers"
                  disabled>
                  <template slot="append">
                    <el-button @click="showProduct">选择</el-button>
                  </template>
                </el-input>
              </el-tooltip>
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
                    <el-input size="mini" placeholder="请输入内容" v-model="detail.addRow[item.field]">
                    </el-input>
                  </span>
                  <span v-else>{{scope.row[item.field]}}</span>
                </div>

                <!-- upload -->
                <div v-if="item.type == 'upload'">
                  <span v-if="scope.row.isEdit">
                    <el-upload
                      name="file"
                      :action="searchImportAction"
                      :before-upload="beforeAvatarUpload"
                      :file-list="fileList"
                      :on-success="uploadSuccess"
                      :on-error="handleErrorPreviary"
                      :on-change="handleFileChange"
                      :multiple="false">
                      <el-button size="mini">上传</el-button>
                    </el-upload>
                  </span>
                  <span v-else>查看(2)</span>
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
                <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row, scope.$index, false)">
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
import { getDictsData, getProduct, addProduct, editProduct, getBrandTree } from 'api/interface';
import { searchImportAction } from 'api/interface';

export default {
  components: {
    ButtonGroup,
    Search,
    Table,
    'dialogModel': Dialog,
    DialogProduct,
  },
  name: "ProductAdd",
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
        {
          name: 'cancel',
          type: '',
          icon: '',
          text: '获取明细行数据',
          class: '',
          show: true,
          loading: false,
          click: this.handleDetailData,
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
        contactNumbers: '',  // 关联产品
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

        brandId: [],  //
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
          { modelNumber: 'modelNumber', size: 'size', unitPrice: 'unitPrice', volume: 'volume', image: 'image', id: 1, "isEdit": false },
          { modelNumber: '2', size: '1', unitPrice: '3', volume: '2', image: 'image', id: 2, "isEdit": false },
          { modelNumber: '1', size: 'si23ze', unitPrice: 'unitPrice', volume: '3', image: '3', id: 3, "isEdit": false },
        ],
      },

      // 上传图片
      searchImportAction: searchImportAction(),
      isExcel: false,
      fileList: [],
      uploadSuccess: [],


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

      // 表格
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
            field: 'craftNames',
          },
          {
            label: '分类',
            field: 'categoryNames',
          },
          {
            label: '关联产品',
            field: 'contactNames',
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

    }
  },
  created() {
    this.id = this.$route.query.id
    this._getDictsData()
    this._getBrandTree()
    if(this.id) {
      this._getProduct()
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
    _getProduct() {
      this.loading = true
      getProduct(this.id).then(res => {
        this.loading = false
        if (res.status == 200) {
          console.log(res)
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
    handleChange(value) {
      console.log(value);
    },
    // 保存
    handleSave() {
      let _this = this
      console.log('明细行数据', this.detail.tableData)
      this.addForm.crafts = arrToString(this.options.crafts)
      this.addForm.categorys = arrToString(this.options.categorys)
      this.addForm.brandId = this.options.brandId[0]
      this.addForm.seriesId = this.options.brandId[1]

      let params  = this.addForm
      console.log('保存参数', params)
      let formName = 'addProductForm'

      this.saveLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if(this.detail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加规格明细'
            })
            return false
          }
          this.detail.tableData.forEach(function(item, index) {
            if(item.isEdit) {
              _this.$message({
                type: 'warning',
                message: '请保存规格明细'
              })
              return false
            }
          })

          params.specificationList = this.detail.tableData
          console.log(params)

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
            this.saveLoading = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善信息'
          })
          this.saveLoading = false
          return false;
        }
      })

    },
    // 取消
    handleCancel() {
      let query = {}
      routerLinkPage(this, 'ProductList', query)
    },


    /* 明细表 */
    // 双击行
    handleDblclick(row) {
      console.log(row)
      this.pwdChange(row, row.row_index, true)
    },

    // 把每一行的索引放进row.row_index
    rowClassName({row, rowIndex}) {
        row.row_index = rowIndex+1;
    },
    // 获取明细行数据
    handleDetailData() {
      console.log('获取明细行数据', this.detail.tableData)
    },

    // 新增行
    handleDetailAdd() {
      for (let i of this.detail.tableData) {
        if (i.isEdit) return this.$message.warning("请先保存当前编辑项");
      }
      let j = { id: null, modelNumber: '1', size: '', unitPrice: '', volume: '', image: '', "isEdit": true }
      this.detail.tableData.push(j);
      this.detail.addRow = JSON.parse(JSON.stringify(j));
      console.log(this.detail.addRow)
    },

    // 删除行  √
    handleDetailDelete(row, index) {
      this.detail.tableData.splice(index, 1);
    },
    //修改
    pwdChange(row, index, cg) {
      console.log('行号---', index+1)
      console.log('行数据---', row)

      // 点击修改 判断是否已经保存所有操作
      for(let i of this.detail.tableData) {
        if (i.isEdit && i.id != row.id) {
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
        this.$message({
            type: 'success',
            message: "保存成功!"
        });
        row.isEdit = false;
      }else {  // 编辑
        this.detail.addRow = JSON.parse(JSON.stringify(row));
        row.isEdit = true;
      }
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
    // 上传失败
    handleErrorPreviary: function (err, file, fileList) {
      this.$message({
        message: file.name + '上传失败',
        type: 'error'
      })
    },
    // 多次上传，只保留最后一次文件
    handleFileChange(file, fileList) {
      // console.log('多次上传，只保留最后一次文件')
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
      let ids = ''
      e.forEach(function(item, index) {
        ids += item.id+','
      })
      this.addForm.contactNumbers = ids.substring(0, ids.length - 1)
    },
    // 商品弹窗取消
    handleDialogNo(type) {
      this.$message('已取消')
      this.hide('dialog-model-product')
    },



  }
}
</script>

<style>

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
