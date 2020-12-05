### Table 封装说明  

简化html代码  用数组对象来 操作传值

使用示范：

```
<Table 
  :table="table" 
  @dblclick="handleDblclick"></Table>
  
```


#### 数据示范  : 

```js
  [
    //参数都是可以选择不写
    table: {
      title: [     // 表头信息
        <!-- 链接列 -->
        {
          label: '所属',
          field: 'companyName',
          width: '170',    // 设置列宽，不设置此项，默认为100（放6个汉字）
          align: 'center', // left/center/right，不设置此项，默认为center
          type: 'link',    // 列类型 【链接link】, 【时间dateTime】, 【操作operat】, 【是否radio】, 【上下架radioProductStatus】
          click: this.handleDblclick
        },
        <!-- 时间列 -->
        {
          label: '生效开始时间',
          field: 'enableStartDate',
          width: '150',
          type: 'dateTime',
        },
        {
          label: '生效结束时间',
          field: 'enableEndDate',
          width: '150',
          type: 'dateTime',
        },
        <!-- 操作列 -->
        {
          label: '操作',
          field: '',
          width: '150',
          type: 'operat',
          options: [       // 操作列按钮（固定以下四类）
            // 【查看】按钮不做权限，直接调用双击行，跳转详情页
            // 【编辑】【删除】【禁用】回调方法click，调用页面写接口逻辑
            {name: '查看', type: 'view', show: true},
            {name: '编辑', type: 'update', show: true, click: this.handleUpdate},
            {name: '删除', type: 'delete', show: true, click: this.handleDelete},
            {name: '禁用', type: 'disable', show: true, click: this.handleDisable},
            { name: '批量移除礼品', type: 'gift', show: true, click: this.transferNoteDialogShow },   // 【礼品管理-礼品分类-批量移除礼品】
          ]
        },
        <!-- 切换状态 -->
        {
          label: '状态',
          field: 'enable',
          type: 'operatSwitch',
          click: this.handleSwitch
        },
      ],
      tableData: [],    // 表数据
      totalPage: 20,
      pageSize: 2,
      pageNum: 1,
      tableLoading: false,
      tableHeight: '450px',    // 表格高度
    },
  ]
  
  
  methods: {
    // 双击行/查看/表格数据链接
    handleDblclick(row) {
      let query = {
        uid: row.uid
      }
      routerLinkPage(this, 'MemberDetail', query)
    },
    // 编辑
    handleUpdate(row, option) {
      console.log('编辑handleUpdate')
    },
    // 删除
    handleDelete(row, option) {
      console.log('删除handleDelete')
    },
    // 禁用
    handleDisable(row, option) {
      console.log('禁用handleDisable')
    },
    // 切换状态
    handleSwitch(row, val) {
      console.log('切换状态事件')
    }
  }
  
  
```