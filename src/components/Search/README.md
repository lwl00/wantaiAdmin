### Search 封装说明  

简化html代码  用数组对象来 操作传值

使用示范：

```
<Search
  :searchOptions="searchOptions"
  @search="handleSearch"
  @reset="handleReset"></Search>
  
```


#### 数据示范  : 

```js
  [
    //参数都是可以选择不写
    searchOptions: [
      // 输入框类型
      {
        label: '名称',
        field: 'sbuId',
        value: '默认值',
        type: 'input',
      },
      // 下拉选择框类型
      {
        label: '性别',
        field: 'six',
        value: '',
        type: 'select',
        options: [
          { name: '全部', value: '' },
          { name: '男', value: '0' },
          { name: '女', value: '1' },
        ],
      },
      // 时间选择框类型   fields为数组，真实的参数key值
      {
        label: '时间',
        field: 'date',
        value: [ onlineDateTime(), todayEndTime() ],
        type: 'datetimerange',
        fields: [ 'startDate', 'etartDate' ],
      },
      // 下拉选择输入框类型   fields为数组，真实的参数key值
      {
        label: '',
        field: 'selectInput',
        value: ['select值', 'input值'],
        type: 'selectWithInput',
        fields: ['codeType', 'codeValue'],
        options: [
          {name: '订单编码', value: '01'},
          {name: '客户ID', value: '02'},
          {name: '客户名称', value: '03'},
          {name: 'ERP编号', value: '04'},
        ],
      },
      // 组件插槽
      {
        label: '说明书图片',
        field: 'instructionImage',
        scopedSlot: { customRender: 'instructionImage' },
        value: '',
      },
      // 多数据批量导入
      {
        label: '客户多个账号',
        field: 'uids',
        value: '',
        type: 'inputImport',
        fileList: [],               // 已上传文件列表
        uploadSuccess: this.handleSuccessUid,  // 上传成功回调方法
      },
      // 联动选择
      {
        label: '品列ID',
        field: 'brandId',
        value: '',
        type: 'cascader',
        hide: true,  // 隐藏，默认为显示false或者不设置 2020.11.27
        chooseOptions: [],  // 已选数组 ['zhinan1', 'shejiyuanze2', 'shejiyuanze3']
        options: [   // 备选树
          {
            value: 'zhinan1',
            label: '指南',
            children: [{
              value: 'shejiyuanze2',
              label: '设计原则',
              children: [{
                value: 'shejiyuanze3',
                label: '设计原则',
                children: []
              }]
            }]
          },
          {
            value: 'zhinan11',
            label: '指南2',
            children: [{
              value: 'shejiyuanze22',
              label: '设计原则2',
              children: [{
                value: 'shejiyuanze33',
                label: '设计原则2',
                children: []
              }]
            }]
          },
        ],
      },
    ],
    instructionImageValue: ''   // 用于插槽绑定值
  ]
  
  // 查询
  handleSearch(e) {
    console.log('查询条件', e)
  },
  // 查询-重置
  handleReset(e) {
    console.log('查询-重置', e)
  },
  // 上传成功回调方法（处理输入框赋值）
  handleSuccessUid(response, file, fileList) {
    this.$message({
      message: file.name + '上传成功',
      type: 'success'
    })
    this.searchOptions.filter(item => item.field === 'uids')[0].value = uploadDataNoRepeat(this, response.data)
  },
  
  // 用于插槽绑定值
  created() {
    this.instructionImageValue = this.searchOptions.filter(item => item.field === 'instructionImage')[0].value
  },
  watch: {
    instructionImageValue(newVal, oldVal) {
      this.searchOptions.filter(item => item.field === 'instructionImage')[0].value = newVal
    }
  }
```