/* 封装的axios
 * @ 李汶龙
 * @ 2018-08-22*/
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { httpUrl, api } from './config'
// ==================后期,当前页面中的httpUrl将全部替换为api========2020.11.25======

// axios Post方式--参数为json时，使用
export function ajaxPostnotUrl(url, data) {
  var url = api + url
  return axios({
    method: 'post',
    url,
    data,
    headers: {
      applicationType: 'PC',
      Authorization: getToken()
    }
  })
    .then(function(response) {
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}

// axios Put方式--参数为json时，使用
export function ajaxPutnotUrl(url, data) {
  var url = api + url
  return axios({
    method: 'put',
    url,
    data,
    headers: {
      applicationType: 'PC',
      Authorization: getToken()
    }
  })
    .then(function(response) {
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}

// axios Post方式--拼接参数时，使用
export function ajaxPost(url) {
  var url = api + url
  return axios({
    method: 'post',
    url,
    headers: {
      applicationType: 'PC',
      Authorization: getToken()
    }
  })
    .then(function(response) {
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}

// axios Get
export function ajaxGet(url) {
  var url = httpUrl + url
  return axios
    .get(url, {
      headers: {
        applicationType: 'PC',
        Authorization: getToken()
      }
    })
    .then(function(response) {
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}

// axios ajaxGetAllDictsData
export function ajaxGetAllDictsData(url) {
  var url = api + url
  return axios
    .get(url, {
      headers: {
        applicationType: 'PC',
        Authorization: getToken()
      }
    })
    .then(function(response) {
      if (response.status == 200) {
        var allSite = {
          createdTime: null,
          creator: null,
          enable: true,
          id: 0,
          modifiedTime: null,
          modifier: null,
          name: '全部',
          remark: null,
          sort: 0,
          value: ''
        }
        response.data.data.unshift(allSite)
      }
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}

// axios ajaxGetAllDictsRoleData(角色专用)
export function ajaxGetAllDictsRoleData(url) {
  var url = api + url
  return axios
    .get(url, {
      headers: {
        applicationType: 'PC',
        Authorization: getToken()
      }
    })
    .then(function(response) {
      if (response.status == 200) {
        var allSite = {
          createdTime: null,
          creator: null,
          enable: true,
          id: 0,
          modifiedTime: null,
          modifier: null,
          name: null,
          name: '全部',
          sort: 0,
          value: '',
          code: '',
          remark: ''
        }
        response.data.data.unshift(allSite)
      }
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}
// axios ajaxGetAllGiftClass(礼品分类专用)
export function ajaxGetAllGiftClass(url) {
  var url = api + url
  return axios
    .get(url, {
      headers: {
        applicationType: 'PC',
        Authorization: getToken()
      }
    })
    .then(function(response) {
      if (response.status == 200) {
        var allSite = {
          createdTime: null,
          creator: null,
          categoryCode: null,
          id: 0,
          modifiedTime: null,
          modifier: null,
          categoryName: '全部',
          status: ''
        }
        response.data.data.unshift(allSite)
      }
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}

// axios ajaxGetAllGiftType(礼品类型专用)
export function ajaxGetAllGiftType(url) {
  var url = api + url
  return axios
    .get(url, {
      headers: {
        applicationType: 'PC',
        Authorization: getToken()
      }
    })
    .then(function(response) {
      if (response.status == 200) {
        var allSite = {
          createdTime: null,
          creator: null,
          giftTypeName: '全部',
          id: 0,
          modifiedTime: '',
          modifier: ''
        }
        response.data.data.unshift(allSite)
      }
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}

// axios Put
export function ajaxPut(url) {
  var url = api + url
  return axios({
    method: 'put',
    url,
    headers: {
      applicationType: 'PC',
      Authorization: getToken()
    }
  })
    .then(function(response) {
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}

// axios Delete
export function ajaxDelete(url) {
  var url = api + url
  return axios
    .delete(url, {
      headers: {
        applicationType: 'PC',
        Authorization: getToken()
      }
    })
    .then(function(response) {
      return Promise.resolve(response.data)
    })
    .catch(function(error) {
      return Promise.resolve(error.data)
    })
}
