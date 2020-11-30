### ButtonGroup 封装说明  

简化html代码  用数组对象来 操作传值

使用示范：

```
<ButtonGroup :buttonList="buttonList"></ButtonGroup>
```


#### 数据示范  : 

```js
  [
    //参数都是可以选择不写
    buttonList: [
      {
        name: 'add',              // 按钮名称，新增【add】、编辑【edit】、删除【delete】、导出【export】
        type: 'primary',          // primary, success, info, warning, danger,
        icon: 'el-icon-edit',     // element图标库
        text: '新增',             // 按钮显示的文字
        class: '',                // 类名
        show: true,               // 是否展示，用于按钮权限
        loading: false,           // 按钮loading
        click(){},                // 可以传入一个函数  函数名字固定写为click
      },
    ],
  ]
```