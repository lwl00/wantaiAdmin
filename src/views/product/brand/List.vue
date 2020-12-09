<template>
  <div class="app-container">
    <div class="filter-container" v-loading="loading">
      <div class="add-page-button-warp">
        <ButtonGroup :buttonList="buttonList"></ButtonGroup>
      </div>
      <el-tree
        class="brandTree"
        :data="brandTreeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }" style="display: flex;width: 100%;">
          <div style="flex: 1;line-height: 28px;">{{ node.label }}</div>
          <!-- <div style="flex: 1;line-height: 28px;" class="createdTime">{{ data.createdTime }}</div> -->
            <div style="flex: 1;line-height: 28px;padding-right: 10px;">
              ID: {{data.id}}
            </div>
            <div style="flex: 1;line-height: 28px;padding-right: 10px;">
              排序: {{data.sort}}
            </div>
            <div style="text-align: right;padding-right: 10px;">
            <el-button
              type="text"
              size="mini"
              @click="handleAddSeries(data)"
              v-if="!data.brandId && brandSerCreate">
              新增系列
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleEdit(data)"
              v-if="brandSerUpdate">
              编辑
            </el-button>
            <el-popover
              placement="top"
              width="160"
              v-model="data.isDelPopover"
              style="margin-left: 10px;"
              v-if="brandSerDelete">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" size="mini" @click="data.isDelPopover = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleDelete(data)">确定</el-button>
              </div>
              <el-button
              type="text"
              size="mini"
              slot="reference">删除</el-button>
            </el-popover>
          </div>
        </div>
      </el-tree>

      <!-- 新增的弹出层 -->
      <dialogModel
        class="dialog-model"
        ref="dialog-model-add-edit"
        :title=" (isAdd?'新增':'编辑')+(validationLayerBrand?'品牌':'系列')"
        :width="dialog.dialogWidth">
        <div class="dialog-model-content">
          <el-form :model="addForm" ref="addForm" :rules="rules">
            <el-form-item
              label="品牌"
              :label-width="formLabelWidth"
              size="small"
              prop="brandId"
              v-if="!validationLayerBrand">
              <el-select
                v-model="addForm.brandId">
                <el-option
                  v-for="option in options.brandTree"
                  :key="option.value"
                  :label="option.name"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="validationLayerBrand?'品牌名称':'系列名称'"
              :label-width="formLabelWidth"
              size="small"
              prop="name"
              required>
              <el-input
                v-model="addForm.name"
                style="width:200px;"
                class="pull-left"
                :placeholder="validationLayerBrand?'请填写品牌名称':'请填写系列名称'"></el-input>
            </el-form-item>

            <el-form-item
              :label="validationLayerBrand?'品牌排序':'系列排序'"
              :label-width="formLabelWidth"
              size="small"
              prop="sort"
              required>
              <el-input
                v-model="addForm.sort"
                style="width:200px;"
                class="pull-left"
                :placeholder="validationLayerBrand?'请填写品牌排序':'请填写系列排序'"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <div class="dialog-model-footer">
          <el-button
            type="primary"
            size="small"
            @click="handleSave('dialog-model-add-edit','addForm')"
            :loading="addSaveLoading">确定</el-button>
          <el-button size="small" @click="handleAddHide('dialog-model-add-edit','addForm')">取消</el-button>
        </div>
      </dialogModel>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import ButtonGroup from '@/components/ButtonGroup'
import Dialog from 'base/Dialog';
import { formatBrandTreeData } from 'common/js/dom';
import { getBrandTree, addBrand, editBrand, delBrand, addSeries, editSeries, delSeries } from 'api/interface';

export default {
  components: {
    ButtonGroup,
    'dialogModel': Dialog,
  },
  name: "ProductBrandList",
  data() {
    return {
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
          text: '新增品牌',
          class: '',
          show: true,       //根据权限来显示
          loading: false,
          click: this.handleAdd,
        },
      ],
      // options
      options: {
        brandId: [],
        brandTree: [],
      },
      brandTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isAdd: null,  // 是否新增
      validationLayerBrand: null,  // 打开层级是否为品牌（一级）

      // 弹窗层
      dialog: {
        loading: false,
        dialogTitle: '提示',    //编辑弹窗标题
        dialogWidth: '400px',   //弹窗宽度
      },
      formLabelWidth: '100px',

      addForm: {
        brandId: '',
        name: '',
        sort: '',
      },
      rules: {
        brandId: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请填写排序', trigger: 'blur' }
        ],
      },


      brandSerCreate: false,  // 新增
      brandSerDelete: false,  // 删除
      brandSerUpdate: false,  // 编辑

    }
  },
  created() {
    this.getPermissions()
    this._getBrandTree()
  },
  mounted() {

  },
  methods: {
    // 页面权限
    getPermissions: function () {
      var permissionsBtnArr = localStorage.getItem("permissionsBtn");
      this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:brandSer:create")     // 新增功能

      // 表格按钮权限
      this.brandSerCreate = permissionsBtnArr.includes("furniture:brandSer:create")
      this.brandSerDelete = permissionsBtnArr.includes("furniture:brandSer:delete")
      this.brandSerUpdate = permissionsBtnArr.includes("furniture:brandSer:update")
    },
    // 品列树
    _getBrandTree() {
      this.loading = true
      getBrandTree().then(res => {
        this.loading = false
        if (res.status == 200) {
          this.options.brandTree = this.brandTreeData = formatBrandTreeData(res.data.brandList)
        }
      })
    },
    // 品列树选择
    handleChange(value) {
      console.log(value);
    },
    show: function (type) {      //弹出弹出框   type(ref)
      this.$refs[type].showModel();
    },
    hide: function (type) {      //隐藏弹出框
      this.$refs[type].hideModel();
    },
    // 判断层级
    validationLayer(data) {
      if(data.brandId) {
        this.validationLayerBrand = false
      }else {
        this.validationLayerBrand = true
      }
      console.log('是否点击品牌====', this.validationLayerBrand)
    },
    // 新增（品牌）
    handleAdd() {
      this.isAdd = true
      this.validationLayerBrand = true
      this.show('dialog-model-add-edit')
    },
    // 新增（系列）
    handleAddSeries(data) {
      console.log('新增', data);
      this.isAdd = true
      this.validationLayerBrand = false
      this.show('dialog-model-add-edit')
      this.addForm.brandId = data.id
    },
    // 新增取消
    handleAddHide: function (type, formName) {
      this.$message('已取消')
      this.$refs[formName].resetFields()
      this.hide(type)
    },
    // 编辑
    handleEdit(data) {
      this.isAdd = false
      this.validationLayer(data)
      console.log('编辑', data);
      this.show('dialog-model-add-edit')
      // if(this.validationLayerBrand) {  // 品牌级
      //   this.addForm.name = data.name
      // }else {  // 系列级
      //   this.addForm.brandId = data.brandId
      //   this.addForm.name = data.name
      // }
      this.addForm = data
    },
    // 删除
    handleDelete(data) {
      this.validationLayer(data)
      console.log('删除', data);
      if(this.validationLayerBrand) {  // 品牌级
        let ids = data.id
        delBrand(ids).then(res => {
          if (res.status == 200) {
            this._getBrandTree();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            data.isDelPopover = false
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.addSaveLoading = false
        })
      }else {     // 系列级
        let ids = data.id
        delSeries(ids).then(res => {
          if (res.status == 200) {
            this._getBrandTree();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            data.isDelPopover = false
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.addSaveLoading = false
        })
      }
    },
    // 保存
    handleSave(type, formName, data) {
      this.addSaveLoading = true
      console.log(this.addForm)

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.validationLayerBrand) {  // 品牌级
            if(this.isAdd) {  // 新增
              let params = {}
              params.name = this.addForm.name
              params.sort = this.addForm.sort
              addBrand(params).then(res => {
                if (res.status == 200) {
                  this._getBrandTree();
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })

                  this.addForm.name = ''
                  this.addForm.sort = ''
                  this.$refs[formName].resetFields()
                  this.hide(type)
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
                this.addSaveLoading = false
              })
            }else {  // 编辑
              let params = this.addForm
              editBrand(params).then(res => {
                if (res.status == 200) {
                  this._getBrandTree();
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })

                  this.addForm.name = ''
                  this.addForm.sort = ''
                  this.$refs[formName].resetFields()
                  this.hide(type)
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
                this.addSaveLoading = false
              })
            }

          }else {     // 系列级
            if(this.isAdd) {  // 新增
              let params = {}
              params.brandId = this.addForm.brandId
              params.name = this.addForm.name
              params.sort = this.addForm.sort
              addSeries(params).then(res => {
                if (res.status == 200) {
                  this._getBrandTree();
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })

                  this.addForm.name = ''
                  this.addForm.sort = ''
                  this.$refs[formName].resetFields()
                  this.hide(type)
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
                this.addSaveLoading = false
              })
            }else {  // 编辑
              let params = this.addForm
              editSeries(params).then(res => {
                if (res.status == 200) {
                  this._getBrandTree();
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })

                  this.addForm.name = ''
                  this.addForm.sort = ''
                  this.$refs[formName].resetFields()
                  this.hide(type)
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
                this.addSaveLoading = false
              })
            }
          }

        } else {
          this.$message({
            type: 'warning',
            message: '请完善信息'
          })
          this.addSaveLoading = false
          return false;
        }
      })
    },
  },
  watch: {

  },
}
</script>

<style >
    /* .brandTree>.el-tree-node:nth-child(2n) {
      background-color: #f1f1f1;
    } */
    .brandTree>.el-tree-node {
      background-color: #f1f1f1;
    }
    .brandTree>.el-tree-node>.el-tree-node__content {
      border-bottom: 1px solid #e6e6e6;
    }

   .brandTree .el-tree-node .el-tree-node__children{
      background-color: #fff;
    }
    /* .brandTree .el-tree-node .el-tree-node__children .el-tree-node:nth-child(2n) .custom-tree-node {
      background-color: #D9D9D9;
    } */
</style>
