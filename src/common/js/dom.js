/* 所有通用js方法，包括: 操作dom、过滤数据、工具函数
 * @ 李汶龙
 * @ 2018-09-26*/

// 设置cookie
export function setCookie(c_name, c_pwd, exdays) {
  var exdate = new Date() // 获取时间
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
  // 字符串拼接cookie
  window.document.cookie =
    'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
  window.document.cookie =
    'userPwd' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
}

// 读取cookie
export function getCookie(data) {
  if (document.cookie.length > 0) {
    var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('=') // 再次切割
      // 判断查找相对应的值
      if (arr2[0] == data) {
        return arr2[1] // 保存到保存数据的地方
      }
    }
  }
}

// 清除cookie
export function clearCookie() {
  setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
}

// 搜索栏时间处理
export function formatDateSearch(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

// 格式化时间(带时分秒)
export function formatDateTimes(dateStr) {
  if (dateStr) {
    var date = replaceTime(dateStr)
    return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
  } else {
    return '--'
  }
}

// 格式化时间(不带时分秒)
export function formatDateTime(dateStr) {
  if (dateStr) {
    var date = replaceTime(dateStr)
    return formatDate(new Date(date), 'yyyy-MM-dd')
  } else {
    return '--'
  }
}

// 替换时间
export function replaceTime(time) {
  if (!time) {
    var NewDate = '--'
  } else {
    if (time.length > 19) {
      var data = time.substr(0, 19)
      var NewDate =
        new Date(data.replace(/T/g, ' ').replace(/-/g, '/')).getTime() +
        8 * 60 * 60 * 1000
    } else {
      var NewDate = '--'
    }
  }

  return NewDate
}

// 格式化时间
export function formatDate(date, fmt) {
  const o = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  var MM = o.M < 10 ? '0' + o.M : o.M
  var dd = o.d < 10 ? '0' + o.d : o.d
  var hh = o.h < 10 ? '0' + o.h : o.h
  var mm = o.m < 10 ? '0' + o.m : o.m
  var ss = o.s < 10 ? '0' + o.s : o.s

  var newDateStr = ''
  return (newDateStr =
    o.Y + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss)
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

// 当天日期 (yyyy-mm-dd)
export function today() {
  var newDate = new Date()
  var y = newDate.getFullYear()
  var m = newDate.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = newDate.getDate()
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d
}

// 当天开始日期时间 (yyyy-mm-dd 00:00:00)
export function todayTime() {
  var newDate = new Date()
  var y = newDate.getFullYear()
  var m = newDate.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = newDate.getDate()
  d = d < 10 ? '0' + d : d
  var hh = '00'
  return y + '-' + m + '-' + d + ' ' + hh + ':' + hh + ':' + hh
}

// 当天结束日期时间 (yyyy-mm-dd 23:59:59)
export function todayEndTime() {
  var newDate = new Date()
  var y = newDate.getFullYear()
  var m = newDate.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = newDate.getDate()
  d = d < 10 ? '0' + d : d
  var hh = '23'
  var MM = '59'
  var ss = '59'
  return y + '-' + m + '-' + d + ' ' + hh + ':' + MM + ':' + ss
}

// 当天日期时间时分秒 (yyyy-mm-dd 00:00:00)
export function todayCurrentTime() {
  var newDate = new Date()
  var y = newDate.getFullYear()
  var m = newDate.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = newDate.getDate()
  d = d < 10 ? '0' + d : d
  var hh =
    newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
  var mm =
    newDate.getMinutes() < 10
      ? '0' + newDate.getMinutes()
      : newDate.getMinutes()
  var ss =
    newDate.getSeconds() < 10
      ? '0' + newDate.getSeconds()
      : newDate.getSeconds()
  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 上线日期 (yyyy-mm-dd 00:00:00)
export function onlineDateTime() {
  return '2020-08-01 00:00:00'
}

// 上线当月日期 (yyyy-mm-dd 00:00:00)
export function onlineMonthDateTime() {
  var newDate = new Date()
  var y = newDate.getFullYear()
  var m = newDate.getMonth() + 1
  m = m < 10 ? '0' + m : m
  return `${y}-${m}-01 00:00:00`
}

// 上线日期 (yyyy-mm-dd)
export function onlineDate() {
  return '2020-08-01'
}

// 转时间戳  'Mon Oct 23 2017 17:20:13 GMT+0800 (中国标准时间)' 或 '2020-09-01 12:11:01'
export function dateTimeToStamp(date) {
  var result = new Date(date).getTime()
  return result
}

// 转时间戳  'Mon Oct 23 2017 17:20:13 GMT+0800 (中国标准时间)' 或 '2020-09-01'
export function dateToStamp(date) {
  var result = new Date(date).getTime()
  return result
}

// 时间转字符串
export function dataToString(date) {
  var date = new Date(date)
  var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  var dateValue =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    DD +
    ' ' +
    hh +
    ':' +
    mm +
    ':' +
    ss
  return dateValue
}

// 去空格
export function deleteBlankSpace(val) {
  val = val.replace(/^\s+|\s+$/g, '') // 去两端空格
  val = val.replace(/\s/g, '') // 去内部空格
  return val
}

// 取正整数
// export function positiveInteger(value) {
//     var val = /^[0-9]+$/ ;
//      return val.test(value)
// }

// 正整数
export function positiveInteger(value) {
  value = value.replace(/[^\.\d]/g, '')
  value = value.replace('.', '')

  return value
}

// 整数(正、负整数)
export function integer(value) {
  var t = value.charAt(0)
  value = value.replace(/[^\.\d]/g, '')
  value = value.replace('.', '')
  if (t == '-') {
    value = '-' + value
  }

  return value
}

// 处理查询条件
export function formatSearch(searchOptions) {
  const obj = {}
  searchOptions.forEach(item => {
    // 输入框去空格
    if (item.type == 'input') {
      obj[item.field] = deleteBlankSpace(item.value)
    } else {
      obj[item.field] = item.value
    }
    // 时间处理
    if (item.type == 'datetimerange') {
      item.fields.forEach((el, index) => {
        // 时间非空判断
        if (item.value) {
          //   obj[el] = obj[item.field][index]
          obj[el] = dataToString(obj[item.field][index])
        } else {
          obj[el] = ''
        }
      })
      delete obj[item.field]
    }
    // 下拉选择输入框处理
    if (item.type == 'selectWithInput') {
      item.fields.forEach((el, index) => {
        // 时间非空判断
        if (item.value) {
          obj[el] = obj[item.field][index]
        } else {
          obj[el] = ''
        }
      })
    }
  })

  // 导出相关
  obj.export = false
  obj.nameStr = ''
  obj.fieldStr = ''

  return obj
}

// 管理列表页面动态计算table高度
export function calculateTableHeight(_this) {
  var homePageHeight = document.body.clientHeight
  var searchToolbarHeight = _this.$refs.searchToolbar.offsetHeight
  var cmyyPpaginationHeight = _this.$refs.cmyyPpagination.offsetHeight

  _this.table.tableHeight =
    homePageHeight - searchToolbarHeight - cmyyPpaginationHeight - 192
}

// 表格按钮权限
export function tableBtnPermissions(tableTitle, typeValue, flag) {
  tableTitle.forEach(item => {
    if (item.options && item.options.length > 0) {
      item.options.filter(option => option.type === typeValue)[0].show = flag
    }
  })
}

// 跳转页面(新增、查看、编辑)
export function routerLinkPage(_this, pageName, query) {
  _this.$router.push({
    name: pageName,
    query: query
  })
}

// 批量上传返回数据去重
export function uploadDataNoRepeat(_this, str) {
  if (str) {
    str = str.split(',')
    var newCodes = ''

    // 删除重复ID
    for (var i = str.length - 1; i >= 0; i--) {
      var targetNode = str[i]
      for (var j = 0; j < i; j++) {
        if (targetNode == str[j]) {
          str.splice(i, 1)
          break
        }
      }
    }
    // 组成新的code字符串，填入文本框中
    str.forEach(item => {
      newCodes = newCodes + item + ','
    })

    return newCodes.substr(0, newCodes.length - 1)
  } else {
    _this.$message({
      message: '上传文件格式错误，请检查修正后重新上传',
      type: 'error'
    })
  }
}

// 数组转字符串  ['1', '2', '3', '4' ]  ==> 1,2,3,4
export function arrToString(arr) {
  var string = ''
  arr.forEach(function (el, index) {
    string += el+','
  });
  string = string.substring(0, string.length - 1)

  return string
}

// 品列树递归方法--增加label,value,children
export function formatBrandTreeData(data) {
  let newArr = [];
  if (data != undefined && data.length > 0) {
    newArr = data.map(item => {
      item.label = item.name;
      item.value = item.id;
      item.children = item.seriesList;
      item.isDelPopover = false;  // 品列管理删除使用

      if (item.seriesList != undefined && item.children.length > 0) {
        formatBrandTreeData(item.seriesList);
      }
      return item;
    });
  }
  return newArr;
}


// 明细表(可批量删除)
export function delTableDataDetailReturn(chooseTableData, tableDataDetail) {
  let rows = []
  chooseTableData.forEach(item => {
    rows.push(item.row_index)
  })
  rows.forEach(row_index => {
    tableDataDetail.splice(tableDataDetail.findIndex(item => item.row_index === row_index), 1)
  })
}
