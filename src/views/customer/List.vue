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

      <!-- 编辑的弹出层 -->
      <dialogModel
        class="dialog-model"
        ref="dialog-model"
        :title="dialog.editTitle+'用户管理'"
        :width="dialog.dialogWidth">
        <div class="dialog-model-content">
          <el-form :model="editRole" ref="editRole" :rules="rules">
            <el-form-item label="客户账号:" :label-width="formLabelWidth" size="small">
                <div class="pull-left">{{editForm.username}}</div>
            </el-form-item>
            <el-form-item
              label="客户名称"
              :label-width="formLabelWidth"
              size="small"
              prop="name">
              <el-input
                v-model="editRole.name"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'name')"
                placeholder="请输入客户名称"
                :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item
              label="公司"
              :label-width="formLabelWidth"
              size="small"
              prop="company">
              <el-input
                v-model="editRole.company"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'company')"
                placeholder="请输入公司名称"
                :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item
              label="职位"
              :label-width="formLabelWidth"
              size="small"
              prop="position">
              <el-input
                v-model="editRole.position"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'position')"
                placeholder="请输入职位名称"
                :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item
              label="联系电话"
              :label-width="formLabelWidth"
              size="small"
              prop="phone">
              <el-input
                v-model="editRole.phone"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'phone')"
                placeholder="请输入联系电话"
                :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item
              label="失效时间"
              :label-width="formLabelWidth"
              size="small"
              prop="failureTime">
              <el-date-picker
                v-model="editRole.failureTime"
                style="width:200px;"
                type="datetime"
                placeholder="请选择失效时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="状态:"
              :label-width="formLabelWidth"
              style="margin-bottom:0;"
              prop="status">
              <el-radio-group v-model="editRole.status" class="pull-left radioHeight">
                  <el-radio :label="true">启用</el-radio>
                  <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="密码:"
              :label-width="formLabelWidth"
              size="small"
              prop="password">
              <el-input
                type="password"
                v-model="editRole.password"
                class="pull-left w200"
                placeholder="请输入密码"
                :maxlength="16"
              ></el-input>
            </el-form-item>
              <!-- <div class="tips">*默认密码为123456</div> -->
          </el-form>
        </div>
        <div class="dialog-model-footer">
          <el-button
            type="primary"
            size="small"
            @click="_editCustomer('dialog-model','editRole')"
            :loading="editSaveLoading">确定</el-button>
          <el-button size="small" @click="handleEditHide('dialog-model', 'editRole')">取消</el-button>
        </div>
      </dialogModel>

      <!-- 新增的弹出层 -->
      <dialogModel
        class="dialog-model"
        ref="dialog-model-add"
        :title="dialog.addTitle+'用户管理'"
        :width="dialog.dialogWidth">
        <div class="dialog-model-content">
          <el-form :model="addForm" ref="addForm" :rules="rules">
            <el-form-item
              label="客户账号"
              :label-width="formLabelWidth"
              size="small"
              prop="username"
              required>
              <!-- @change="_getAddusername" -->
              <el-input
                v-model="addForm.username"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'username')"
                placeholder="请输入客户账号11"></el-input>
            </el-form-item>
            <el-form-item
              label="客户名称"
              :label-width="formLabelWidth"
              size="small"
              prop="name">
              <el-input
                v-model="addForm.name"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'name')"
                placeholder="请输入客户名称"></el-input>
            </el-form-item>
            <el-form-item
              label="公司"
              :label-width="formLabelWidth"
              size="small"
              prop="company">
              <el-input
                v-model="addForm.company"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'company')"
                placeholder="请输入公司名称"></el-input>
            </el-form-item>
            <el-form-item
              label="职位"
              :label-width="formLabelWidth"
              size="small"
              prop="position">
              <el-input
                v-model="addForm.position"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'position')"
                placeholder="请输入职位名称"></el-input>
            </el-form-item>
            <el-form-item
              label="联系电话"
              :label-width="formLabelWidth"
              size="small"
              prop="phone">
              <el-input
                v-model="addForm.phone"
                style="width:200px;"
                class="pull-left"
                @input="handleDeleteBlankSpacer($event, 'phone')"
                placeholder="请输入联系电话"
                :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item
              label="失效时间"
              :label-width="formLabelWidth"
              size="small"
              prop="failureTime">
              <el-date-picker
                v-model="addForm.failureTime"
                style="width:200px;"
                type="datetime"
                placeholder="请选择失效时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="状态:"
              :label-width="formLabelWidth"
              style="margin-bottom:0;"
              required>
              <el-radio-group v-model="addForm.status" class="pull-left radioHeight">
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>

            <div class="tips" :label-width="formLabelWidth">*默认密码为{{addForm.password}}</div>
          </el-form>
        </div>
        <div class="dialog-model-footer">
          <el-button
            type="primary"
            size="small"
            @click="_addCustomer('dialog-model-add','addForm')"
            :loading="addSaveLoading">确定</el-button>
          <el-button size="small" @click="handleAddHide('dialog-model-add','addForm')">取消</el-button>
        </div>
      </dialogModel>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Search from '@/components/Search'
import Table from '@/components/Table'
import Dialog from 'base/Dialog'
import { deleteBlankSpace, formatSearch, calculateTableHeight, tableBtnPermissions, routerLinkPage } from 'common/js/dom';
import { getDictsData, getCustomerList, getCustomer, addCustomer, editCustomer, delCustomer } from 'api/interface';

export default {
  components: {
    Search,
    Table,
    'dialogModel': Dialog,
  },
  name: "MemberList",
  data() {

    var validateUsername = (rule, value, callback) => {
      setTimeout(() => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else if (value == this.ReUsername) {
          callback(new Error('账号已存在，请勿重复'))
        } else {
          callback();
        }
      }, 1000)
    }

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
          name: 'add',
          type: 'primary',
          icon: 'el-icon-circle-plus-outline',
          text: '新增',
          class: '',
          show: true,       //根据权限来显示
          loading: false,
          click: this.handleAdd,
        },
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
          label: '客户账号',
          field: 'userName',
          value: '',
          type: 'input',
        },
        {
          label: '客户名称',
          field: 'name',
          value: '',
          type: 'input',
        },
        {
          label: '公司',
          field: 'company',
          value: '',
          type: 'input',
        },
        {
          label: '状态',
          field: 'status',
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
            label: '客户账号',
            field: 'username',
          },
          {
            label: '客户名称',
            field: 'name',
            width: 200,
          },
          {
            label: '公司',
            field: 'company',
            width: 200,
          },
          {
            label: '职位',
            field: 'position',
          },
          {
            label: '联系电话',
            field: 'phone',
          },
          {
            label: '失效时间',
            field: 'failureTime',
            type: 'dateTime',
            width: 200,
          },
          {
            label: '备注',
            field: 'remark',
          },
          {
            label: '状态',
            field: 'status',
            type: 'operatSwitch',
            click: this.handleSwitch
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
      batchForm: { fileList1: [], batchData: null },

      // 弹窗层
      dialog: {
        loading: false,
        editTitle: '编辑',    //编辑弹窗标题
        addTitle: '新增',      //新增弹窗标题
        dialogWidth: '400px',   //弹窗宽度
      },
      editForm: {},
      editRole: {
        username: '',  //登录账号
        name: '', //用户名称
        company: '', //公司
        position: '', //职位
        phone: '', //电话
        failureTime: '', //失效时间
        status: true, //状态,
        password: '123456',  //默认密码
        oldPassWord: '',     //修改前的密码
      },
      formLabelWidth: '100px',
      addForm: {
        userName: '',  //登录账号
        name: '', //用户名称
        company: '', //公司
        position: '', //职位
        phone: '', //电话
        failureTime: '2099-12-31T15:59:59.000Z',  //失效时间
        status: true, //状态,
        password: '123456',  //默认密码
      },
      ReUsername: '', //重名
      rules: {
        id: [{
            required: true,
            message: '请输入登陆账号',
            trigger: 'blur'
        }, {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个数字或者英文',
        }, {
            pattern: /^[0-9a-zA-Z]+$/,
            message: '用户名只能为数字或者英文',
        }],
        // username: [
        //   { validator: validateUsername, trigger: 'blur' }
        // ],
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个数字或者英文' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '密码只能为数字或者英文' },
        ],
      },
    }
  },
  created() {
    this.search = formatSearch(this.searchOptions)
    this._getDictsData()
    this.getPermissions()
    this._getCustomerList(this.table.pageNum, this.table.pageSize);
  },
  mounted() {

  },
  methods: {
    // 数据字典
    _getDictsData: function () {
      // 状态
      var paramsState = {
        isAll: true,
        code: 'TrueOfFalse'
      }
      getDictsData(paramsState).then(res => {
        this.searchOptions.filter(item => item.field === 'status')[0].options = res.data
      })
    },
    // 页面权限
    getPermissions: function () {
      var permissionsBtnArr = localStorage.getItem("permissionsBtn");
      this.buttonList.filter(item => item.name === 'add')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:customer:create")     // 新增功能
      this.buttonList.filter(item => item.name === 'delete')[0].show = this.isAddPermission = permissionsBtnArr.includes("furniture:customer:delete")     // 删除功能
      
      // 表格按钮权限
      tableBtnPermissions(this.table.title, 'update', permissionsBtnArr.includes("furniture:customer:update"))   // 编辑功能
    },
    // 获取列表数据
    _getCustomerList: function (pageNum, pageSize) {
      var params = this.search
      params.pageNum = pageNum,
      params.pageSize = pageSize,

      this.table.tableLoading = true
      getCustomerList(params).then(res => {
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
      this._getCustomerList(1, this.table.pageSize);
    },
    // 查询-重置
    handleReset(e) {
      this.search = e
      this._getCustomerList(1, this.table.pageSize);
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
      let params = this.search
      params.pageSize = ''
      params.pageNum = ''
      params.export = true
      params.nameStr = ''
      params.fieldStr = ''
      this.table.title.forEach(function (item, index) {
        if(item.type != 'operat') {
          params.nameStr = params.nameStr + item.label + ','
          params.fieldStr = params.fieldStr + item.field + ','
        }
      });

      window.location.href = getCustomerList(params)
    },
    // 每页显示条数
    handleSizeChange: function (val) {
      this.table.pageSize = val
      this._getCustomerList(this.table.pageNum, this.table.pageSize);
    },
    // 翻页
    handleCurrentChange: function (val) {
      this.table.pageNum = val
      this._getCustomerList(this.table.pageNum, this.table.pageSize);
    },
    // 双击行
    handleDblclick(row) {
      console.log(row)
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
        this._getDelCustomer()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });

        this.buttonList.filter(item => item.name === 'delete')[0].loading = false
      });
    },
    // 删除确定
    _getDelCustomer() {
      let ids = ''
      this.table.selectionChange.forEach(function (item, index) {
        ids += item.id + ','
      })
      ids = ids.substring(0, ids.length - 1)

      delCustomer(ids).then(res => {
        if (res.status == 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this._getCustomerList(this.table.pageNum, this.table.pageSize)
        } else if (res.status == 500) {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
        this.buttonList.filter(item => item.name === 'delete')[0].loading = false
      })
    },
    // 编辑
    handleEdit(e) {
      this.editForm = Object.assign({}, e)
      this.editRole.username = e.username
      this.editRole.name = e.name
      this.editRole.company = e.company
      this.editRole.position = e.position
      this.editRole.phone = e.phone
      this.editRole.failureTime = e.failureTime
      this.editRole.status = e.status
      this.editRole.oldPassWord = e.password
      this.show('dialog-model')
    },
    // 编辑取消
    handleEditHide(type, formName) {
      this.hide(type)
      this.$refs[formName].resetFields()
      this.$message('已取消')
    },
    // 编辑确定
    _editCustomer(type, formName) {
      let params = { ...this.editForm, ...this.editRole }

      this.editSaveLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editCustomer(params).then(res => {
            if (res.status == 200) {
              this.hide(type)
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this._getCustomerList(this.table.pageNum, this.table.pageSize)
            } else if (res.status == 500) {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
            this.editSaveLoading = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善信息'
          })
          this.editSaveLoading = false
          return false
        }
      })
    },
    // 表格编辑状态
    handleSwitch(e) {
      console.log(e)
      let params = e
      editCustomer(params).then(res => {
        if (res.status == 200) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        } else if (res.status == 500) {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 新增
    handleAdd() {
      this.show('dialog-model-add')
    },
    // 新增取消
    handleAddHide: function (type, formName) {
      this.$message('已取消')
      this.$refs[formName].resetFields()
      this.addForm = {
        status: '',
      }
      this.hide(type)
    },
    // 新增确定
    _addCustomer(type, formName) {
      this.addSaveLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.addForm
          console.log(params)
          addCustomer(params).then(res => {
            if (res.status == 200) {
              this._getCustomerList(this.table.pageNum, this.table.pageSize);
              this.$message({
                message: '添加成功',
                type: 'success'
              })

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
    //验证登录账号重名
    _getAddusername: function (val) {
      var params = {
        username: val
      }
      getAddusername(params).then(res => {
        if (res.data == null) {
          this.ReUsername = ''
        } else {
          this.ReUsername = res.data.username
        }
      })
    },
    // 输入时去空格
    handleDeleteBlankSpacer(val, key) {
      this.addForm[key] = this.addForm[key].replace(/^\s+|\s+$/g, '').replace(/\s/g, '') // 去空格
    },

  },
}

</script>


<style lang="scss" scoped>
.selectWidth {
  width: 120px;
}
.radioHeight {
  padding-top: 14px;
}
.tips {
  margin-bottom: 18px;
  color: #a4a4a4;
  text-align: center;
  margin-top: 6px;
}
.lastItem {
  margin-bottom: 6px;
}
</style>
