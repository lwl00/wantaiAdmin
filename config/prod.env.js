'use strict'
const VERSION = process.argv.splice(2)[0] || 'prod' // 如果打包不带参数,默认为dev

module.exports = {
  NODE_ENV: '"production"',
  VERSION: '"' + VERSION + '"'
}
