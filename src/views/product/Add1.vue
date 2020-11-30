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
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="产品编号" prop="number" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.number"
                placeholder="请填写产品编号"
                maxlength="60"></el-input>
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
          <!-- <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="系列" prop="seriesId" :label-width="formLabelWidth">
              <el-input
                v-model="addForm.seriesId"
                placeholder="请填写系列"
                maxlength="60"></el-input>
            </el-form-item>
          </el-col> -->
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
            <el-form-item label="折扣商品" prop="discount" :label-width="formLabelWidth">
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
              <el-select v-model="addForm.unit" placeholder="请选择单位">
                <el-option
                  v-for="item in options.unitOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>

        </el-row>

      </el-form>


      <div class="detailListTitle">规格明细</div>
      <!-- 表格 -->
      <div class="detailTable" v-if="!showEditForm">
        <div class="add-page-button-warp">
          <ButtonGroup :buttonList="buttonListDetailTable"></ButtonGroup>
        </div>

        <div class="cmyyTable">
          <Table :table="table" @dblclick="handleDblclick" @handleSelectionChange="handleSelectionChange"></Table>
        </div>
      </div>


      <!-- 编辑 -->
      <div class="detailEdit" v-if="showEditForm">
        <div class="add-page-button-warp">
          <ButtonGroup :buttonList="buttonListDetailEdit"></ButtonGroup>
        </div>

        <el-form :model="detailForm" ref="addProductDetailForm" :rules="rules" label-width="170px" class="" size="small">
          <el-row :gutter="0" class="query">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="型号" prop="modelNumber" :label-width="formLabelWidth">
                <el-input
                  v-model="detailForm.modelNumber"
                  placeholder="请填写型号"
                  maxlength="60"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="规格" prop="size" :label-width="formLabelWidth">
                <el-input
                  v-model="detailForm.size"
                  placeholder="请填写型号"
                  maxlength="60"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="单价" prop="unitPrice" :label-width="formLabelWidth">
                <el-input
                  v-model="detailForm.unitPrice"
                  placeholder="请填写单价"
                  maxlength="60"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="体积" prop="volume" :label-width="formLabelWidth">
                <el-input
                  v-model="detailForm.volume"
                  placeholder="请填写体积"
                  maxlength="60"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="图片" prop="image" :label-width="formLabelWidth">
                <el-input
                  v-model="detailForm.image"
                  placeholder="请填写图片"
                  maxlength="60"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>


    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import ButtonGroup from '@/components/ButtonGroup'
import Table from '@/components/Table'
import Dialog from 'base/Dialog';
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage, arrToString, formatBrandTreeData, delTableDataDetailReturn } from 'common/js/dom';
import { getDictsData, getProduct, addProduct, editProduct, getBrandTree } from 'api/interface';

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
      saveLoading: false, // 新增保存

      formLabelWidth: '100px',

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
          type: 'danger',
          icon: '',
          text: '删除',
          class: '',
          show: true,
          loading: false,
          click: this.handleDetailDelete,
        },
      ],
      // 操作栏按钮（明细表）
      buttonListDetailEdit: [
        {
          name: 'save',
          type: 'primary',
          icon: '',
          text: '保存',
          class: '',
          show: true,
          loading: false,
          click: this.handleDetailSave,
        },
        {
          name: 'cancel',
          type: '',
          icon: '',
          text: '取消',
          class: '',
          show: true,
          loading: false,
          click: this.handleDetailCancel,
        },
      ],

      //
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
        modelNumber: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        size: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],


      },



      // 表格
      table: {
        title: [
          {
            label: '型号',
            field: 'modelNumber',
          },
          {
            label: '规格',
            field: 'size',
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
          },
        ],
        tableData: [],
        totalPage: 20,
        pageSize: 20,
        pageNum: 1,
        selectionChange: [],  // 多选行数据
      },


      detailForm: {
        modelNumber: '',  // 型号
        size: '',  // 规格
        unitPrice: '',  // 单价
        volume: '',  // 体积
        image: '',  // 图片
      },

      showEditForm: false,
      isAdd: false,  // true为新增数据，false为编辑数据
      tableSeq: 0,//选中的子表序号


    }
  },
  created() {
    this._getDictsData()
    this._getBrandTree()
  },
  mounted() {

  },
  methods: {
    // 数据字典
    _getDictsData: function () {
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
    // 递归方法
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].seriesList) {
          if (data[i].seriesList.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
      }
      return data;
    },
    // 品列树
    _getBrandTree() {
      getBrandTree().then(res => {
        if (res.status == 200) {
          this.options.brandTree = formatBrandTreeData(res.data.brandList);

          console.log(this.options.brandTree)
        }
      })
    },
    // 品列树选择
    handleChange(value) {
      console.log(value);
    },
    // 保存
    handleSave() {
      this.addForm.crafts = arrToString(this.options.crafts)
      this.addForm.categorys = arrToString(this.options.categorys)
      this.addForm.brandId = this.options.brandId[0]
      this.addForm.seriesId = this.options.brandId[1]
      let params = this.addForm

      console.log('保存参数', params)

      let formName = 'addProductForm'

      this.saveLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.addForm
          addProduct(params).then(res => {
            if (res.status == 200) {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
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

    },


    /* 明细表 */

    // 双击行
    handleDblclick(row) {
      this.tableSeq = row.row_index
      this.showEditForm = !this.showEditForm
      this.isAdd = false
      this.detailForm = row

      console.log('双击行，进行编辑，行号：', this.tableSeq, row)
    },

    // 多选行数据
    handleSelectionChange(e) {
      this.table.selectionChange = e
    },
    // 明细表新增
    handleDetailAdd() {
      this.showEditForm = !this.showEditForm
      this.isAdd = true

    },
    // 明细表删除
    handleDetailDelete() {
      if(this.table.selectionChange.length == 0) {
        this.$message({
          type: 'warning',
          message: '请先选择数据'
        })
        return
      }
      delTableDataDetailReturn(this.table.selectionChange, this.table.tableData)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    },

    // 明细表保存
    handleDetailSave() {
      let _this = this
      let formName = 'addProductDetailForm'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('保存----是否新增', this.isAdd)

          let data = this.detailForm
          this.showEditForm = !this.showEditForm
          if(this.isAdd) {
            // data['employeeId'] = this.id  // 编辑待定

            console.log('新增明细', data)
            this.table.tableData = [...this.table.tableData, data]
            _this.$nextTick(() => {

              _this.$refs['addProductDetailForm'].resetFields();
            })
          }else {
            console.log('编辑明细', data)
            // let _data = this.table.tableData[this.tableSeq - 1]
            // _data = {
            //   ..._data,
            //   ...data
            // }
            // this.table.tableData.splice(this.tableSeq - 1, 1, _data)

          }
          console.log("明细表格----", this.table.tableData)
        }
      })
    },
    // 明细表取消
    handleDetailCancel() {
      this.showEditForm = !this.showEditForm
      this.$refs['addProductDetailForm'].resetFields();
    },

  }
}
</script>

<style>

</style>
