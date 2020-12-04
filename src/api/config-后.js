/* 接口和路径的配置项
 * @ 李汶龙
 * @ 2020-08-05*/

// 根据 process.env.VERSION 的值判断当前是什么环境
// 命令：npm run build -- pro  或者  npm run build -- prod 或者 npm run build 开发测试环境，预部署(正式)环境，部署(正式)环境，不用跨域，api=''

let httpUrl = ''
let api = ''
const VERSION = process.env.VERSION
switch (VERSION) {
  case 'dev':
    // npm run dev
    // httpUrl = 'https://jfapitest.cmyynet.com'
    // api = '/api'
    // ========2020.11.25====
    httpUrl = 'http://localhost:8086'
    api = '/api'
    break
  case 'pre': // 预部署环境,同域名下不用跨域https://jifenpre.cmyynet.com
    // httpUrl = ''
    httpUrl = 'http://localhost:8086'
    api = ''
    break
  case 'prod': // 正式环境,同域名下不用跨域https://jifen.cmyynet.com
    // httpUrl = ''
    httpUrl = 'http://localhost:8086'
    api = ''
    break
  default:
    // npm run dev
    // httpUrl = 'https://jfapitest.cmyynet.com'
    // api = '/api'
    // ========2020.11.25====
    httpUrl = 'http://localhost:8086'
    api = '/api'
}

module.exports = {
  httpUrl,
  api
}
