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
                @input="handleDeleteBlankSpacer($event, 'name')"
                placeholder="请填写空间名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-if="isShow.number">
            <el-form-item label="空间编号" prop="number" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.number"
                @input="handleDeleteBlankSpacer($event, 'number')"
                placeholder="请填写空间编号"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.remark"
                @input="handleDeleteBlankSpacer($event, 'remark')"
                placeholder="请填写备注"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="空间图(多张)" prop="imgMain" :label-width="formLabelWidth">
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


      <div class="detailListTitle">商品明细</div>
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
                <!-- 图片 -->
                <span v-if="item.field == 'imgMain'"><img v-if="scope.row.url" :src="scope.row.url" class="productAvatar"></span>

                <!-- 其他 -->
                <span v-else>{{scope.row[item.field]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <span class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="handleDetailDelete(scope.row, scope.$index)">
                  删除
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
import { getDictsData, getSpace, addSpace, editSpace, getBrandTree, imageUploadAction, imagesUploadAction } from 'api/interface';

export default {
  components: {
    ButtonGroup,
    Search,
    Table,
    'dialogModel': Dialog,
    DialogProduct,
  },
  name: "SpaceAdd",
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
        remark: '',  //
        productList: [],  // 明细表(返回数据)
        spaceDetailList: [],  // 明细表(上传数据)
        spaceImgList: [],  // 实景效果图表(返回、上传数据)
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
        id: '',  // 商品ID
        name: '',  // 商品名称
        number: '',  // 商品编号
        imgMain: '',  // 商品编号
      },


      detail: {
        detailRowIndex: null, // 选中行好
        addRow: null, // 选中行
        title: [
          {
            label: '商品ID',
            field: 'id',
          },
          {
            label: '商品名称',
            field: 'name',
          },
          {
            label: '商品编号',
            field: 'number',
          },
          {
            label: '图片',
            field: 'imgMain',
          },
        ],
        tableData: [
          // { id: '', name: '', number: '', imgMain: '' }
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
      buttonListDialogSpace: [],
      searchOptionsDialogSpace: [],
      // 搜索栏
      searchOptionsDialogSpace: [
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
      searchDialogSpace: {},

      // 弹窗表格
      tableDialogSpace: {
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
            type: 'radioSpaceStatus',
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
    if(this.id) {
      this._getSpace(this.id)
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

    },
    // 获取数据
    _getSpace(id) {
      let _this = this
      this.loading = id ? true : false
      getSpace(id).then(res => {
        this.loading = false
        if (res.status == 200) {
          this.addForm = res.data.space

          // 明细表
          if(res.data.space.productList.length > 0) {
            let productList = []
            res.data.space.productList.forEach(function(item, index) {
              if(item) {
                if(item.imgMain) {
                  item.url = item.imgMainSrc
                }
                productList.push(item)
              }
            })
            this.detail.tableData = productList
          }else {
            this.detail.tableData = []
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
        }
      })
    },
    // 保存
    handleSave() {
      let _this = this

      // 空间图
      this.addForm.spaceImgList = []
      this.upload.effectFileList.forEach(function(item, index) {
        item.responseData = item.response.data.split("/").pop()
        let img = {
          image: item.response.data.split("/").pop()
        }
        _this.addForm.spaceImgList.push(img)
      })

      let params  = this.addForm
      let formName = 'addSpaceForm'
      this.buttonList.filter(item => item.name === 'save')[0].loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {

          // 商品明细
          if(this.detail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加商品明细'
            })
            this.buttonList.filter(item => item.name === 'save')[0].loading = false
            return false
          }
          if(this.detail.tableData.length > 0 && !this.detail.tableData[this.detail.tableData.length-1].id) {
            this.$message({
              type: 'warning',
              message: `请选择第${this.detail.tableData.length}行商品`
            })
            _this.buttonList.filter(item => item.name === 'save')[0].loading = false
            return false
          }

          let spaceDetailList = []
          this.detail.tableData.forEach(function(item, index) {
            let obj = {}
            if(item.id) {  // 编辑,新增
              obj.productId = item.id
            }
            if(_this.id) {  // 编辑
              obj.spaceId = _this.id
            }
            spaceDetailList.push(obj)
          })

          params.spaceDetailList = spaceDetailList
          params.productList = []

          console.log('保存参数', params)
          if(this.id) {
            editSpace(params).then(res => {
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
            addSpace(params).then(res => {
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
      routerLinkPage(this, 'SpaceList', query)
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
      this.show('dialog-model-product')
    },

    // 删除行  √
    handleDetailDelete(row, index) {
      this.detail.tableData.splice(index, 1);
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
    // 商品弹窗确定
    handleDialogYes(e) {
      let _this = this
      this.hide('dialog-model-product')

      let detailString = ''
      e.forEach(function(el, elIndex) {
        if(_this.detail.tableData.length > 0 && _this.detail.tableData.filter(item => item.id === el.id).length > 0) {
          detailString += el.name+','
        }else {
          if(el.imgMain) {
            el.url = el.imgMainSrc
          }else {
            el.url = ''
          }
          _this.detail.tableData.push(el)
        }
      })

      if(detailString) {
        this.$message({
          type: 'warning',
          message: '明细表已存在'+detailString+'等商品，不能重复添加'
        })
      }
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


<!-- {
  "name": "空间名称",
  "number": "1",
  "remark": "备注",
  "productList": [],
  "spaceDetailList": [
    {
      "productId": 23
    }
  ],
  "spaceImgList": [
    {
      "image": "2020113015321814561.png"
    }
  ]
} -->
