/* 调用接口
 * @ 李汶龙
 * @ 2018-08-22 */
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import {
  ajaxPost,
  ajaxPostnotUrl,
  ajaxPutnotUrl,
  ajaxGet,
  ajaxPut,
  ajaxDelete,
  ajaxGetAllDictsData,
  ajaxGetAllDictsRoleData,
  ajaxGetAllGiftType,
  ajaxGetAllGiftClass,
  ajaxPostIpNotUrl
} from './axios'
import { httpUrl, api } from './config'
const base = '/base'
const system = '/system'

// ==================后期,当前页面中(主要指导出功能)的httpUrl将全部替换为api========2020.11.25======


/* 登录
 * 相关数据接口*/
// 登录
export function login(username, password) {
  return request({
    url: api + '/ajaxLogin',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 获取登录用户信息
export function getInfo(username) {
  return request({
    url: api + '/system/users/username=' + username,
    method: 'get',
    headers: {
      Authorization: getToken()
    }
  })
}

// 退出登录
export function logout() {
  const url = '/logout'

  return ajaxGet(url)
}

// 修改密码
export function modifyPassword(params) {
  const url =
    '/system/users/' +
    params.usersname +
    '/password/currentPassword=' +
    params.currentPassword +
    '/password=' +
    params.password +
    ''

  return ajaxPut(url)
}

// 获取修改历史记录（通用）
export function getHishory(params) {
  const url =
    '/system/operationRecords/entity=' +
    params.entity +
    '/property=' +
    params.property +
    '/targetId=' +
    params.targetId +
    '/operator=' +
    params.operator +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  return ajaxGet(url)
}

/* 查询条件
 * 相关数据接口*/
// 获取数据字典
export function getDictsData(params) {
  var url = '/system/dicts/code=' + params.code + '/items'

  if (params.isAll) {
    return ajaxGetAllDictsData(url)
  } else {
    return ajaxGet(url)
  }
}

// 获取角色
export function getRolesData(params) {
  // var url = '/system/roles'
  var url =
    '/system/roles/name=' +
    params.name +
    '/enable=' +
    params.enable +
    '/pageNum=1/pageSize=999'

  if (params.isAll) {
    return ajaxGetAllDictsRoleData(url)
  } else {
    return ajaxGet(url)
  }
}





/*
 * 客户管理
 *
 */
// 列表
export function getCustomerList(params) {
  let url = `${base}/customer/name=${params.name}/username=${params.userName}/company=${params.company}/status=${params.status}/pageNum=${params.pageNum}/pageSize=${params.pageSize}`

  if (params.export) {
    // 导出表格数据(跨域添加 /api)
    return (
      httpUrl +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url) // 展示表格数据
  }
}
// 新增
export function addCustomer(params) {
  const url = `${base}/customer`

  return ajaxPostnotUrl(url, params)
}
// 编辑
export function editCustomer(params) {
  const url = `${base}/customer`

  return ajaxPutnotUrl(url, params)
}
// 删除
export function delCustomer(ids) {
  const url = `${base}/customer/ids=${ids}/delete`

  return ajaxGet(url)
}
// 详情
export function getCustomer(id) {
  const url = `${base}/customer/id=${id}`

  return ajaxGet(url)
}


/*
 * 品牌管理
 *
 */
// 品列树
export function getBrandTree() {
  let url = `${base}/brand/brandTree`

  return ajaxGet(url) // 展示表格数据
}
// 新增
export function addBrand(params) {
  const url = `${base}/brand`

  return ajaxPostnotUrl(url, params)
}
// 编辑
export function editBrand(params) {
  const url = `${base}/brand`

  return ajaxPutnotUrl(url, params)
}
// 删除
export function delBrand(ids) {
  const url = `${base}/brand/ids=${ids}/delete`

  return ajaxGet(url)
}

/*
 * 系列管理
 *
 */
// 列表
export function getSeriesList(brandId) {
  let url = `${base}/series/brandId=${brandId}`

  return ajaxGet(url) // 展示表格数据
}
// 新增
export function addSeries(params) {
  const url = `${base}/series`

  return ajaxPostnotUrl(url, params)
}
// 编辑
export function editSeries(params) {
  const url = `${base}/series`

  return ajaxPutnotUrl(url, params)
}
// 删除
export function delSeries(ids) {
  const url = `${base}/series/ids=${ids}/delete`

  return ajaxGet(url)
}



/*
 * 产品管理
 *
 */
// 列表
export function getProductList(params) {
  let url = `${base}/product/name=${params.name}/number=${params.number}/brandId=${params.brandId}/seriesId=${params.seriesId}/crafts=${params.crafts}/categorys=${params.categorys}/status=${params.status}/discount=${params.discount}/pageNum=${params.pageNum}/pageSize=${params.pageSize}`

  if (params.export) {
    // 导出表格数据(跨域添加 /api)
    return (
      httpUrl +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url) // 展示表格数据
  }
}
// 新增
export function addProduct(params) {
  const url = `${base}/product`

  return ajaxPostnotUrl(url, params)
}
// 编辑
export function editProduct(params) {
  const url = `${base}/product`

  return ajaxPutnotUrl(url, params)
}
// 删除
export function delProduct(ids) {
  const url = `${base}/product/ids=${ids}/delete`

  return ajaxGet(url)
}
// 详情
export function getProduct(id) {
  const url = `${base}/product/id=${id}`

  return ajaxGet(url)
}


/*
 * 方案管理
 *
 */
// 列表
export function getProjectList(params) {
  let url = `${base}/project/number=${params.number}/name=${params.name}/companyName=${params.companyName}/contact=${params.contact}/createdTime=${params.createdTime}/pageNum=${params.pageNum}/pageSize=${params.pageSize}`
  
  if (params.export) {
    // 导出表格数据(跨域添加 /api)
    return (
      httpUrl +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url) // 展示表格数据
  }
}
// 新增
export function addProject(params) {
  const url = `${base}/project`

  return ajaxPostnotUrl(url, params)
}
// 编辑
export function editProject(params) {
  const url = `${base}/project`

  return ajaxPutnotUrl(url, params)
}
// 删除
export function delProject(ids) {
  const url = `${base}/project/ids=${ids}/delete`

  return ajaxGet(url)
}
// 详情
export function getProject(id) {
  const url = `${base}/project/id=${id}`

  return ajaxGet(url)
}


















// 获取礼品分类
export function getGiftClass(params) {
  var url =
    '/gift/categories/getGiftCategoryList/status=' +
    params.status +
    '/category=' +
    params.category +
    '/pageNum=1/pageSize=999'

  if (params.isAll) {
    return ajaxGetAllGiftClass(url)
  } else {
    return ajaxGet(url)
  }
}

/* 积分记录管理
 * 相关数据接口*/
// 积分记录管理
export function getPointRecord(params) {
  const url =
    '/point/pointRecord/uid=' +
    params.uid +
    '/ruleNature=' +
    params.ruleNature +
    '/changedState=' +
    params.changedState +
    '/companyCode=' +
    params.companyCode +
    '/ruleType=' +
    params.ruleType +
    '/startDate=' +
    params.startDate +
    '/endDate=' +
    params.endDate +
    '/customerName=' +
    params.customerName +
    '/orderCode=' +
    params.orderCode +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  if (params.export) {
    // 导出表格数据(跨域添加 /api)
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url) // 展示表格数据
  }
}

/* 积分规则管理
 * 相关数据接口*/
// 获取积分规则列表
export function getPointRule(params) {
  const url =
    '/point/pointRule/serialNumber=' +
    params.serialNumber +
    '/ruleType=' +
    params.ruleType +
    '/companyCode=' +
    params.companyCode +
    '/enable=' +
    params.enable +
    '/ruleNature=' +
    params.ruleNature +
    '/ruleDesc=' +
    params.ruleDesc +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  if (params.export) {
    // 导出表格数据(跨域添加 /api)
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url) // 展示表格数据
  }
}

// 新增积分规则
export function addPointRule(params) {
  const url = '/point/pointRule'

  return ajaxPostnotUrl(url, params)
}

// 编辑积分规则
export function editPointRule(params) {
  const url = '/point/pointRule'

  return ajaxPutnotUrl(url, params)
}

// 新增或编辑时，查看输入或导入商品ID详情(指定商品)
export function applyProductView(params) {
  const url = '/point/pointRule/applyProductView'

  return ajaxPutnotUrl(url, params)
}

// 查看积分详情
export function getPointRuleDatail(params) {
  const url = '/point/pointRule/' + params.id + ''

  return ajaxGet(url)
}

/* 礼品管理
 * 相关数据接口*/
// 查询ERP商品编号
export function getAllProductCodeList(params) {
  var url = '/gift/categories/getAllProductCodeList'

  return ajaxGet(url)
}

// 查询ERP商品编号详情
export function getProductCodeDetail(params) {
  var url = '/gift/categories/productCode=' + params.productCode + ''

  return ajaxGet(url)
}

// 礼品分类列表
export function getGiftCategoryList(params) {
  var url =
    '/gift/categories/getGiftCategoryList/status=' +
    params.status +
    '/category=' +
    params.category +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  // 导出
  if (params.export) {
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 其他礼品分类列表(不包含当前分类)
export function getOtherGiftCategoryList(params) {
  var url =
    '/gift/categories/getGiftCategoryList/category=' + params.category + ''

  return ajaxGet(url)
}

// 新增检验礼品分类名称是否重复
export function getCheckCategoryName(params) {
  var url = '/gift/categories/categoryName=' + params.categoryName + ''

  return ajaxGet(url)
}

// 编辑、新增礼品分类保存
export function addGiftCategory(params) {
  var url = '/gift/categories'

  if (params.id) {
    // 编辑
    return ajaxPutnotUrl(url, params)
  } else {
    // 新增
    return ajaxPostnotUrl(url, params)
  }
}

// 删除礼品分类
export function delGiftCategory(params) {
  var url = '/gift/categories/delete/categoryId=' + params.categoryId + ''

  return ajaxDelete(url)
}

// 确认批量移出礼品
export function sureMoreModifyGift(params) {
  var url =
    '/gift/categories/gifts/oldCategoryName=' +
    params.oldCategoryName +
    '/newCategoryName=' +
    params.newCategoryName +
    ''

  return ajaxPut(url)
}

// 批量移出分类
export function moveOutCategory(params) {
  var url =
    '/gift/pointGift/oldCategoryId=' +
    params.oldCategoryId +
    '/newCategoryId=' +
    params.newCategoryId +
    ''

  return ajaxPut(url)
}

// 通用礼品列表
export function getBaseGift(params) {
  //   var url =
  //     '/gift/categories/gifts/giftTypeCode=' +
  //     params.giftTypeCode +
  //     '/giftName=' +
  //     params.giftName +
  //     '/giftCode=' +
  //     params.giftCode +
  //     '/pageNum=' +
  //     params.pageNum +
  //     '/pageSize=' +
  //     params.pageSize +
  //     ''
  const url = `/point/commonGift/productCode=${
    params.productCode
  }/productName=${params.productName}/ean=${params.ean}/relevance=${
    params.relevance
  }/pageNum=${params.pageNum}/pageSize=${params.pageSize}`

  if (params.export) {
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 通用礼品详情
export function getBaseGiftDetail(params) {
  //   var url = '/gift/categories/gifts/id=' + params.id + ''
  //   let id = 1
  //   if (params.id) {
  //     id = params.id
  //   }
  const url = `/point/commonGift/${params.id}`

  return ajaxGet(url)
}

// 新增通用礼品
export function addGifts(data) {
  const url = '/gift/categories/gifts'

  return ajaxPostnotUrl(url, data)
}

// 修改通用礼品
export function editGifts(data) {
  const url = '/gift/categories/gifts'

  return ajaxPutnotUrl(url, data)
}

/* 积分礼品*/
// 积分礼品获取数据列表
export function getIntegralGift(params) {
  //   var url =
  //     '/gift/pointGift/companyCode=' +
  //     params.companyCode +
  //     '/category=' +
  //     params.category +
  //     '/giftTypeCode=' +
  //     params.giftTypeCode +
  //     '/status=' +
  //     params.status +
  //     '/giftName=' +
  //     params.giftName +
  //     '/pageNum=' +
  //     params.pageNum +
  //     '/pageSize=' +
  //     params.pageSize +
  //     ''
  const url = `/point/PointProduct/productCode=${
    params.productCode
  }/productName=${params.productName}/remark=${params.remark}/ean=${
    params.ean
  }/companyCode=${params.companyCode}/onlineFlag=${params.onlineFlag}/status=${
    params.status
  }/pageNum=${params.pageNum}/pageSize=${params.pageSize}`

  // 导出
  if (params.export) {
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 新增礼品
export function addIntegralGift(params) {
  //   var url = '/gift/pointGift'
  const url = '/point/PointProduct'

  return ajaxPostnotUrl(url, params)
  //   return ajaxPostIpNotUrl(url, params)
}

// 加载礼品id
export function getGiftId(params) {
  //   var url = '/gift/categories/getGiftCodeList/giftCode=' + params.giftCode + ''
  // const url = `/point/commonGift/${params.giftCode}`
  const url = `/point/commonGift/${params.giftCode}/list`

  return ajaxGet(url)
}

// 加载礼品id站点
export function getGiftSite(params) {
  const url = `/point/PointProduct/${params.productCode}/site`

  return ajaxGet(url)
}

// 查询通用礼品信息（需要code和站点）
export function getBaseGiftInfo(params) {
  const url = `/point/PointProduct/productCode=${
    params.productCode
  }/companyCode=${params.companyCode}`

  return ajaxGet(url)
}

// 刷新库存
export function getStocks(params) {
  const url = `/point/PointProduct/productCode=${
    params.productCode
  }/companyCode=${params.companyCode}/stock`
  return ajaxGet(url)
}

// 礼品详情
export function getGiftCode(params) {
  //   var url = '/gift/pointGift/id=' + params.id + ''
  const url = `/point/PointProduct/${params.id}/pointProduct`

  return ajaxGet(url)
}

// 编辑礼品列表
export function editIntegralGift(params) {
  //   var url = '/gift/pointGift'
  const url = `/point/PointProduct`

  return ajaxPutnotUrl(url, params)
}

// 查询积分礼品是否存在
export function isGiftCode(params) {
  var url =
    '/gift/pointGift/companyCode=' +
    params.companyCode +
    '/giftCodes=' +
    params.giftCodes +
    ''

  return ajaxGet(url)
}

// 批量修改礼品的分类
export function editGifeChange(params) {
  var url =
    '/gift/pointGift/companyCode=' +
    params.companyCode +
    '/giftCodes=' +
    params.giftCodes +
    '/newCategoryName=' +
    params.newCategoryName +
    ''

  return ajaxPut(url)
}

// 获取积分礼品通用信息
export function getGiftMessage(params) {
  //   var url = 'gift/categories/gifts/giftCode=' + params.giftCode + ''
  const url = `/point/commonGift/${params.giftCode}/list`

  return ajaxGet(url)
}

// 积分礼品浏览记录--获取列表
export function getGiftBrowse(params) {
  var url =
    '/point/PointProduct/giftId=' +
    params.giftId +
    '/uid=' +
    params.uid +
    '/customerName=' +
    params.customerName +
    '/client=' +
    params.client +
    '/startDate=' +
    params.startDate +
    '/endDate=' +
    params.endDate +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  // 导出
  if (params.export) {
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 积分礼品兑换记录--获取列表
export function getGiftForRecord(params) {
  var url =
    '/point/PointProduct/giftId=' +
    params.giftId +
    '/uid=' +
    params.uid +
    '/customerName=' +
    params.customerName +
    '/client=' +
    params.client +
    '/giftOrderCode=' +
    params.giftOrderCode +
    '/startDate=' +
    params.startDate +
    '/endDate=' +
    params.endDate +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  // 导出
  if (params.export) {
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 积分礼品修改历史--获取列表
export function getGiftModify(params) {
  var url =
    '/point/PointProduct/giftId=' +
    params.giftId +
    '/username=' +
    params.username +
    '/name=' +
    params.name +
    '/startDate=' +
    params.startDate +
    '/endDate=' +
    params.endDate +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  // 导出
  if (params.export) {
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

/* 积分会员管理
 * 相关数据接口*/
// 积分会员列表
export function getUserList(params) {
  //   var url =
  //     '/point/customer/companyCode=' +
  //     params.companyCode +
  //     '/memberLevel=' +
  //     params.memberLevel +
  //     '/customerGroup=' +
  //     params.customerGroup +
  //     '/pointState=' +
  //     params.pointState +
  //     '/uid=' +
  //     params.uid +
  //     '/customerName=' +
  //     params.customerName +
  //     '/cellphone=' +
  //     params.cellphone +
  //     '/pointBlack=' +
  //     params.pointBlack +
  //     '/couponBlack=' +
  //     params.couponBlack +
  //     '/pageNum=' +
  //     params.pageNum +
  //     '/pageSize=' +
  //     params.pageSize +
  //     ''

  if (!params.cellphone) {
    params.cellphone = ''
  }
  const url = `/point/customer/companyCode=${
    params.companyCode
  }/customerGroup=${params.customerGroup}/pointState=${
    params.pointState
  }/pointBlack=${params.pointBlack}/uid=${params.uid}/customerName=${
    params.customerName
  }/cellphone=${params.cellphone}/pageNum=${params.pageNum}/pageSize=${
    params.pageSize
  }`

  if (params.export) {
    // 导出
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 会员详情
export function getCustomerBase(params) {
  var url = '/point/customer/uid=' + params.uid + '/customerInfo'

  return ajaxGet(url)
}

// 会员操作（冻结、解冻、移入/移出积分黑名单、移入/移出优惠券黑名单）
export function customerOperate(params) {
  var url =
    '/point/customer/uid=' +
    params.uid +
    '/customerOperate=' +
    params.customerOperate +
    '/remark=' +
    params.remark +
    ''

  return ajaxPost(url)
}

// 可用/不可用积分明细列表
export function getPointsRecord(params) {
  var url =
    '/point/customer/uid=' +
    params.uid +
    '/changedState=' +
    params.changedState +
    '/ruleNature=' +
    params.ruleNature +
    '/ruleType=' +
    params.ruleType +
    '/startDate=' +
    params.startDate +
    '/endDate=' +
    params.endDate +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    '/export=' +
    params.export +
    '/nameStr=' +
    params.nameStr +
    '/fieldStr=' +
    params.fieldStr +
    ''

  return ajaxGet(url)
}
// 修改可用积分
export function customerPointEdit(params) {
  var url =
    '/point/customer/uid=' +
    params.uid +
    '/amount=' +
    params.amount +
    '/remark=' +
    params.remark +
    ''

  return ajaxPost(url)
}

// 奖品明细列表
export function getPrizeRecord(params) {
  var url =
    '/point/customer/uid=' +
    params.uid +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    '/prizeRecords'

  return ajaxGet(url)
}

// 操作历史明细列表
export function getCustomerOperate(params) {
  var url =
    '/point/customer/uid=' +
    params.uid +
    '/customerOperate=' +
    params.customerOperate +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    '/export=' +
    params.export +
    '/nameStr=' +
    params.nameStr +
    '/fieldStr=' +
    params.fieldStr +
    ''

  if (params.export) {
    // 导出
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

/* 优惠券管理
 * 相关数据接口*/

// 已发放优惠券列表
export function getCouponsToCustomers(params) {
  var url =
    '/operation/couponsToCustomers/companyCode=' +
    params.companyCode +
    '/gainWay=' +
    params.gainWay +
    '/status=' +
    params.status +
    '/applyProductTypes=' +
    params.applyProductTypes +
    '/application=' +
    params.application +
    '/couponCode=' +
    params.couponCode +
    '/couponTypeCode=' +
    params.couponTypeCode +
    '/customerId=' +
    params.customerId +
    '/customerName=' +
    params.customerName +
    '/orderCode=' +
    params.orderCode +
    '/hybrisOrderCode=' +
    params.hybrisOrderCode +
    '/timeFlag=' +
    params.timeFlag +
    '/startTimeValue=' +
    params.startTimeValue +
    '/endTimeValue=' +
    params.endTimeValue +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  if (params.export) {
    // 导出
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 赠送优惠券列表
export function getCouponsGiving(params) {
  var url =
    '/operation/couponType/companyCode=' +
    params.companyCode +
    '/sendFlag=' +
    params.sendFlag +
    '/sendStatus=' +
    params.sendStatus +
    '/sendStartTime=' +
    params.sendStartTime +
    '/sendEndTime=' +
    params.sendEndTime +
    '/creator=' +
    params.creator +
    '/couponTypeCode=' +
    params.couponTypeCode +
    '/remark=' +
    params.remark +
    '/applyProductTypes=' +
    params.applyProductTypes +
    '/application=' +
    params.application +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  if (params.export) {
    // 导出
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 赠送优惠券操作人员select数据
export function getCouponCreator(params) {
  var url = '/operation/couponsToCustomers/AllCreators'

  return ajaxGet(url)
}

// 已发放优惠券详情
export function getCouponsDetailData(params) {
  var url = '/operation/couponType/' + params.couponTypeCode + ''

  return ajaxGet(url)
}

// 优惠券详情中查看指定商品
export function getApplyProductTypesView(params) {
  var url =
    '/operation/couponType/' +
    params.id +
    '/applyProductTypes=' +
    params.applyProductTypes +
    ''

  return ajaxGet(url)
}

// 优惠券详情中查看指定客户
export function getApplyUserTypesView(params) {
  var url =
    '/operation/couponType/' +
    params.id +
    '/applyUserTypes=' +
    params.applyUserTypes +
    ''

  return ajaxGet(url)
}

// 优惠券黑名单列表
export function getCouponsToBlackCustomers(params) {
  var url =
    '/operation/couponsToBlackCustomers/companyCode=' +
    params.companyCode +
    '/level=' +
    params.level +
    '/groups=' +
    params.groups +
    '/pointStatus=' +
    params.pointStatus +
    '/customerUid=' +
    params.customerUid +
    '/customerName=' +
    params.customerName +
    '/customerPhone=' +
    params.customerPhone +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  if (params.export) {
    // 导出
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
}

// 删除优惠券黑名单（移出黑名单）
export function delBlackCustomers(params) {
  var url =
    '/operation/couponsToBlackCustomers/customerUid=' + params.customerUid + ''

  return ajaxDelete(url)
}

// 新增优惠券黑名单（根据客户编码，查询客户未使用的优惠券数量和金额）
export function getUserCouponsnumMoney(params) {
  var url = '/operation/couponsToCustomers/customerUid=' + params.uid + ''

  return ajaxGet(url)
}

// 新增或编辑时，查看输入或导入客户详情(指定客户)
export function applyUserView(params) {
  const url = '/operation/couponType/applyCustomerView'

  return ajaxPutnotUrl(url, params)
}

// 新增通用礼品为优惠券时，券类型编号select
export function getCouponCodeAndNameList(params) {
  var url = '/operation/couponType/getCouponCodeAndNameList'

  return ajaxGet(url)
}

// 新增通用礼品为优惠券时，券类型编号select，选中option查看券详情
export function getCouponCodeDeail(params) {
  var url = '/operation/couponType/' + params.couponTypeCode + ''

  return ajaxGet(url)
}

// 优惠券编辑时，点击状态为禁用=0时，查找该优惠券下的积分礼品
export function getCouponTypeToPointGift(params) {
  var url =
    '/gift/pointGift/getCouponTypeToPointGift/couponTypeCode=' +
    params.couponTypeCode +
    '/companyCode=' +
    params.companyCode +
    ''

  return ajaxGet(url)
}

/* 权限管理
 * 相关数据接口*/
// 获取用户列表
export function getUserManage(params) {
  var url =
    '/system/users/companyCode=' +
    params.companyCode +
    '/role=' +
    params.role +
    '/status=' +
    params.status +
    '/username=' +
    params.username +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  return ajaxGet(url)
}

// 更新数据(编辑，启用/禁用)
export function getUpDate(params) {
  var url = '/system/users/'

  return ajaxPutnotUrl(url, params)
}

// 新增用户
export function getAddRole(data) {
  var url = '/system/users'

  return ajaxPostnotUrl(url, data)
}

// 验证用户名是否重复
export function getAddusername(params) {
  var url = '/system/users/username=' + params.username + ''

  return ajaxGet(url)
}

// 获取权限管理
export function getPermissions(params) {
  var url = '/system/roles/code=' + params.code + '/permissions/config'

  return ajaxGet(url)
}

/* 数据字典
 * 相关数据接口*/
// 获取用户列表
export function getDataUserManage(params) {
  var url =
    '/system/dicts/code=' +
    params.code +
    '/name=' +
    params.name +
    '/enable=' +
    params.enable +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  return ajaxGet(url)
}

// 更新数据字典
export function getDataUpdate(params) {
  var url = '/system/dicts/' + params.id + ''

  return ajaxPutnotUrl(url, params)
}

// 新增数据字典
export function getAddDataUpdate(data) {
  var url = '/system/dicts'

  return ajaxPostnotUrl(url, data)
}

// 删除数据字典
export function getNumberDelete(params) {
  var url = '/system/dicts/' + params.id + ''

  return ajaxDelete(url)
}

// 查询code重名
export function getAddDigitalCode(params) {
  var url = '/system/dicts/code=' + params.code + ''

  return ajaxGet(url)
}

/* 数据字典明细*/
// 获取用户列表
export function getDetailUserManage(params) {
  var url =
    '/system/dicts/code=' +
    params.code +
    '/items/name=' +
    params.name +
    '/value=' +
    params.value +
    '/enable=' +
    params.enable +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  return ajaxGet(url)
}

// 删除明细
export function getDetailDelete(params) {
  var url = '/system/dicts/items/' + params.id + ''

  return ajaxDelete(url)
}

// 查询明细
export function getSearchDetailUser(params) {
  var url =
    '/system/dicts/code=' + params.code + '/items/value=' + params.value + ''

  return ajaxGet(url)
}

// 新增明细用户
export function getAddDetailData(params) {
  var url = '/system/dicts/code=' + params.code + '/items'

  return ajaxPostnotUrl(url, params)
}

// 更新明细用户
export function getDetailUpdate(params) {
  // var url = '/system/dicts/items/'+params.id+''
  var url = '/system/dicts/code=' + params.code + '/items'

  return ajaxPutnotUrl(url, params)
}

// 删除数据字典

export function deleteDicts(params) {
  var url = '/system/dicts/' + params.id + ''

  return ajaxDelete(url)
}

// 删除数据字典明细
export function deleteItemDicts(params) {
  var url = '/system/dicts/items/' + params.id + ''

  return ajaxDelete(url)
}

/* 角色管理*/

// 获取角色列表
export function getRolesUser(params) {
  var url =
    '/system/roles/name=' +
    params.name +
    '/enable=' +
    params.enable +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  return ajaxGet(url)
}

// 角色编辑跳转加载
export function getRolesDetail(params) {
  var url = '/system/roles/' + params.id + ''

  return ajaxGet(url)
}

// 查询新增code重名
export function getAddRolesCode(params) {
  var url = '/system/roles/code=' + params.code + ''

  return ajaxGet(url)
}

// 新增角色管理
export function addRolesDetail(params) {
  var url = '/system/roles'

  return ajaxPostnotUrl(url, params)
}

// 更新角色管理
export function editRolesData(params) {
  var url = '/system/roles/' + params.id + ''

  return ajaxPutnotUrl(url, params)
}

// 查看下属账号
export function getDetailDialogShow(params) {
  var url = '/system/roles/code=' + params.code + '/users'

  return ajaxGet(url)
}

/* 角色权限管理*/

// 获取权限明细项列表
export function getRoleDetailUser(params) {
  var url =
    '/system/roles/code=' +
    params.code +
    '/permissions/name=' +
    params.name +
    '/permissionCode=' +
    params.permissionCode +
    '/resourceCode=' +
    params.resourceCode +
    '/resourceLevel=' +
    params.resourceLevel +
    '/resourceType=' +
    params.resourceType +
    '/enable=' +
    params.enable +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  return ajaxGet(url)
}

// 新增权限
export function AddRoleDetail(params) {
  var url = '/system/roles/code=' + params.code + '/permissions'

  return ajaxPostnotUrl(url, params)
}

// 编辑权限
export function editRoleDeital(params) {
  var url = '/system/roles/permissions/'

  return ajaxPutnotUrl(url, params)
}

// 删除权限
export function deleteRole(params) {
  var url = '/system/roles/permissions/' + params.id + ''

  return ajaxDelete(url)
}

/* 优惠券*/
// 获取优惠券类型列表
export function getCouponList(params) {
  var url =
    '/operation/couponType/companyCode=' +
    params.companyCode +
    '/applyProductTypes=' +
    params.applyProductTypes +
    '/effectiveDays=' +
    params.effectiveDays +
    '/application=' +
    params.application +
    '/gainWay=' +
    params.gainWay +
    '/couponTypeName=' +
    params.couponTypeName +
    '/couponTypeCode=' +
    params.couponTypeCode +
    '/startTimeValue=' +
    params.startTimeValue +
    '/endTimeValue=' +
    params.endTimeValue +
    '/effectiveDaysFlag=' +
    params.effectiveDaysFlag +
    '/enable=' +
    params.enable +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''

  if (params.export) {
    // 导出
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }
  // return ajaxGet(url)
}

// 新增优惠卷
export function addCouponsType(params) {
  var url = '/operation/couponType'

  return ajaxPostnotUrl(url, params)
}

// 更新优惠卷
export function editCouponsType(params) {
  var url = '/operation/couponType/' + params.id + ''

  return ajaxPutnotUrl(url, params)
}

/* 礼品订单*/
// 获取礼品订单列表

export function getOrderList(params) {
  console.log(params)
  var url =
    '/order/orders/companyCode=' +
    params.companyCode +
    '/status=' +
    params.status +
    '/application=' +
    params.application +
    '/creatStartTime=' +
    params.creatStartTime +
    '/creatEndTime=' +
    params.creatEndTime +
    '/codeType=' +
    params.codeType +
    '/codeValue=' +
    params.codeValue +
    '/pageNum=' +
    params.pageNum +
    '/pageSize=' +
    params.pageSize +
    ''
  // var url = '/order/orders/companyCode='+params.companyCode+'/status='+params.status+'/application='+params.application+'/creatStartTime='+params.creatStartTime+'/creatEndTime='+params.creatEndTime+'/codeType='+params.codeType+'/codeValue='+params.codeValue+'/pageNum='+params.pageNum+'/pageSize='+params.pageSize+'/export='+params.export+'/nameStr='+params.nameStr+'/fieldStr='+params.fieldStr+''

  if (params.export) {
    // 导出
    return (
      api +
      url +
      '?export=' +
      params.export +
      '&nameStr=' +
      params.nameStr +
      '&fieldStr=' +
      params.fieldStr +
      ''
    )
  } else {
    return ajaxGet(url)
  }

  // return ajaxGet(url)
}

// 查询订单详情
// /order/orders/201810110114853=code
export function getOrdersDetail(params) {
  var url = '/order/orders/code=' + params.code

  return ajaxGet(url)
}

// 查询客户收货地址数据
export function getAddressCode(params) {
  var url = '/order/orders/address=' + params.addressCode

  return ajaxGet(url)
}

/* 文件上传
 * 相关数据action*/
// 积分规则新增-下单返积分商品-指定商品上传excel action
export function addRulesAPPOINTAction() {
  var url = api + '/point/pointRule/uploadProductData'

  return url
}

// 批量导入积分礼品
export function addGiftAPPOINTAction() {
  var url = api + '/point/PointProduct/pointProductImport'

  return url
}

// 测试礼品上传
export function testGiftAction() {
  var url = api + '/gift/pointGift/uploadGiftImage'

  return url
}
// 积分礼品上传图片
export function GiftAction() {
  //   var url = api + '/gift/pointGift/uploadGiftImage'
  const url = api + '/point/PointProduct/uploadGiftImage'

  return url
}

// 查询条件批量上传
export function searchImportAction() {
  var url = api + '/point/pointRecord/searchImport'

  return url
}

// 批量导入黑名单
export function addBlockGiftAPPOINTAction() {
  var url = api + '/point/customer/pointBlackImport'

  return url
}

// 批量导入积分名单
export function customerImportAPPOINTAction() {
  var url = api + '/point/customer/customerImport'

  return url
}

// 未获得积分订单生成流水
export function getNotGetPointOrder() {
  var url = '/point/customer/NotGetPointOrder'

  return ajaxGet(url)
}

// 积分流水导入
export function editPointRunAction() {
  const url = api + '/point/pointRecord/pointRecordImport'

  return url
}
