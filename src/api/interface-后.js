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

// ==================后期,当前页面中(主要指导出功能)的httpUrl将全部替换为api========2020.11.25======buttonList

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
  console.log('// 新增', params)
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
// 导出明细
export function exportProjectDetail(params) {
  let url = `${base}/project/id=${params.id}/export`

  return (
    api +
    url +
    '?fieldTail=' +
    params.fieldTail +
    '&nameStr=' +
    params.nameStr +
    '&fieldStr=' +
    params.fieldStr +
    ''
  )
}

/*
 * 空间管理
 *
 */
// 列表
export function getSpaceList(params) {
  let url = `${base}/space/name=${params.name}/number=${params.number}/createdTime=${params.createdTime}/pageNum=${params.pageNum}/pageSize=${params.pageSize}`

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
export function addSpace(params) {
  const url = `${base}/space`

  return ajaxPostnotUrl(url, params)
}
// 编辑
export function editSpace(params) {
  const url = `${base}/space`

  return ajaxPutnotUrl(url, params)
}
// 删除
export function delSpace(ids) {
  const url = `${base}/space/ids=${ids}/delete`

  return ajaxGet(url)
}
// 详情
export function getSpace(id) {
  const url = `${base}/space/id=${id}`

  return ajaxGet(url)
}



/*
 * 图片上传
 *
 */
// 单图
export function imageUploadAction() {
  const url = `${base}/upload/uploadImage`

  return httpUrl + url
}
// 多图
export function imagesUploadAction() {
  const url = `/${base}/upload/uploadImages`

  return httpUrl + url
}
// 产品批量上传
export function productImportAPPOINTAction() {
  const url = httpUrl + `/${base}/upload/productImport`

  return url
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
