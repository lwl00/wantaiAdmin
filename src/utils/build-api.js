/**
 * @description  api接口头 和  接口头部域名    （统一    build/index.js   src/api/axios.js   src/api/interface.js）
 * @author rong
 */

const ENV = process.env.NODE_ENV

const tagetUrl = 'http://jfapitest.cmyynet.com/'
let API = '/api'
console.log(ENV)
// 打包 build
if (ENV == 'production') {
  API = ''
}

module.exports = {
  tagetUrl,
  API
}
