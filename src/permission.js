import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store
          .dispatch('GetInfo')
          .then(res => {
            // 拉取用户信息
            // note: 'permissionsMenuArr', 'permissionsBtnArr' must be a array! such as: ['editor','develop']
            var permissionsMenuArr = [] // 菜单权限
            var permissionsBtnArr = [] // 按钮权限
            res.data.roles[0].permissions.forEach(item => {
              if (item.resourceType == 'menu') {
                permissionsMenuArr.push(item.code)
              } else if (item.resourceType == 'button') {
                permissionsBtnArr.push(item.code)
              }
            })
            localStorage.setItem(
              'permissionsMenu',
              JSON.stringify(permissionsMenuArr)
            )
            localStorage.setItem(
              'permissionsBtn',
              JSON.stringify(permissionsBtnArr)
            )
            // console.log('菜单权限', permissionsMenuArr)
            // console.log('按钮权限', permissionsBtnArr)
            store
              .dispatch('GenerateRoutes', { permissionsMenuArr })
              .then(() => {
                // 根据permissionsMenuArr权限生成可访问的路由表
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
          })
          .catch(err => {
            Message({
              message: err,
              type: 'error',
              duration: 5 * 1000
            })
            store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
