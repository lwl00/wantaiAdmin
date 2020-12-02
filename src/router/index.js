import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    roles: 'system:roles:read'   原本为roles: 'admin'访问菜单，
                                 改造后为权限'system:roles:read'访问，此后src/permission下roles表示权限
}
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/Login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/modifypassword',
    name: 'pointsManage',
    meta: { title: '设置', icon: 'example' },
    hidden: true,
    children: [
      {
        path: 'modifypassword',
        name: 'ModifyPassword',
        component: () => import('@/views/user/ModifyPassword'),
        meta: { title: '修改密码', icon: '' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    // alwaysShow: true,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'shouye', noCache: true, affix: true },
        alwaysShow: true
      }
    ]
  },


  // 客户管理
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/list',
    name: 'Customer',
    meta: { title: '客户管理', icon: 'huiyuan' },
    children: [
      {
        path: '/customer/list',
        name: 'MemberList',
        component: () => import('@/views/customer/List'),
        meta: { title: '客户管理', icon: '' }
      },
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: { title: '产品管理', icon: 'lipin' },
    children: [
      // {
      //   path: '/product/list',
      //   name: 'ProductList',
      //   component: () => import('@/views/product/List'),
      //   meta: { title: '产品管理', icon: '' }
      // },
      // {
      //   path: '/product/add',
      //   name: 'ProductAdd',
      //   component: () => import('@/views/product/Add'),
      //   meta: { title: '新增产品', icon: '' }
      // },
      // {
      //   path: '/product/detail',
      //   name: 'ProductDetail',
      //   component: () => import('@/views/product/Detail'),
      //   meta: { title: '产品详情', icon: '' }
      // },



      {
        path: '/product/normal/list',
        name: 'ProductNormalList',
        component: () => import('@/views/product/normal/List'),
        meta: { title: '正价产品', icon: '' }
      },
      {
        path: '/product/normal/add',
        name: 'ProductNormalAdd',
        component: () => import('@/views/product/normal/Add'),
        meta: { title: '新增正价产品', icon: '' },
        hidden: true
      },
      {
        path: '/product/normal/detail',
        name: 'ProductNormalDetail',
        component: () => import('@/views/product/normal/Detail'),
        meta: { title: '正价产品详情', icon: '', noCache: true },
        hidden: true
      },
      {
        path: '/product/discount/list',
        name: 'ProductDiscountList',
        component: () => import('@/views/product/discount/List'),
        meta: { title: '折扣产品', icon: '' }
      },
      {
        path: '/product/discount/add',
        name: 'ProductDiscountAdd',
        component: () => import('@/views/product/discount/Add'),
        meta: { title: '新增折扣产品', icon: '' },
        hidden: true
      },
      {
        path: '/product/discount/detail',
        name: 'ProductDiscountDetail',
        component: () => import('@/views/product/discount/Detail'),
        meta: { title: '折扣产品详情', icon: '', noCache: true },
        hidden: true
      },
      {
        path: '/product/brand/list',
        name: 'ProductBrandList',
        component: () => import('@/views/product/brand/List'),
        meta: { title: '品列管理', icon: '' }
      },
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    name: 'Project',
    meta: { title: '方案管理', icon: 'link' },
    children: [
      {
        path: '/project/list',
        name: 'ProjectList',
        component: () => import('@/views/project/List'),
        meta: { title: '方案管理', icon: '' }
      },
      {
        path: '/project/detail',
        name: 'ProjectDetail',
        component: () => import('@/views/project/Detail'),
        meta: { title: '方案详情', icon: '', noCache: true },
        hidden: true
      },
    ]
  },
  {
    path: '/space',
    component: Layout,
    redirect: '/space/list',
    name: 'Space',
    meta: { title: '空间管理', icon: 'nested' },
    children: [
      {
        path: '/space/list',
        name: 'SpaceList',
        component: () => import('@/views/space/List'),
        meta: { title: '空间管理', icon: '' }
      },
      {
        path: '/space/add',
        name: 'SpaceAdd',
        component: () => import('@/views/space/Add'),
        meta: { title: '新增空间', icon: '' },
        hidden: true
      },
      {
        path: '/space/detail',
        name: 'SpaceDetail',
        component: () => import('@/views/space/Detail'),
        meta: { title: '空间详情', icon: '', noCache: true },
        hidden: true
      },
    ]
  },



    // {
    //   path: '/theme',
    //   component: Layout,
    //   redirect: '/theme/index',
    //   name: '',
    //   meta: { title: '主题', icon: 'example' },
    //   children: [
    //     {
    //       path: 'index',
    //       name: 'index',
    //       component: () => import('@/views/theme/index'),
    //       meta: { title: '主题', icon: '' }
    //     }
    //   ]
    // }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  // 系统管理
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/role',
    name: 'permission',
    meta: { title: '系统管理', icon: 'xitong', roles: ['system:system:read'] },
    children: [
      {
        path: 'managerrole',
        name: 'ManageRole',
        component: () => import('@/views/permission/ManageRole'),
        meta: { title: '用户管理', icon: '', roles: ['system:users:read'] }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/permission/Role'),
        meta: { title: '角色管理', icon: '', roles: ['system:roles:read'] }
      },
      {
        path: 'addrole',
        name: 'AddRole',
        component: () => import('@/views/permission/AddRole'),
        meta: { title: '添加角色', icon: '', roles: ['system:roles:create'] },
        hidden: true
      },
      {
        path: 'roledetail',
        name: 'RoleDetail',
        component: () => import('@/views/permission/RoleDetail'),
        meta: { title: '角色详情', icon: '', roles: ['system:roles:read'] },
        hidden: true
      },
      {
        path: 'editrole',
        name: 'EditRole',
        component: () => import('@/views/permission/EditRole'),
        meta: { title: '编辑角色', icon: '', roles: ['system:roles:update'] },
        hidden: true
      },
      {
        path: 'rolejurisdiction',
        name: 'RoleJurisdiction',
        component: () => import('@/views/permission/RoleJurisdiction'),
        meta: { title: '权限管理', icon: '', roles: ['system:roles:read'] }
      },
      {
        path: 'digitaldictionary',
        name: 'DigitalDictionary',
        component: () => import('@/views/permission/DigitalDictionary'),
        meta: { title: '数据字典管理', icon: '', roles: ['system:dicts:read'] }
      },
      {
        path: 'digitaldetail',
        name: 'DigitalDetail',
        component: () => import('@/views/permission/DigitalDetail'),
        meta: { title: '数据字典明细', icon: '', roles: ['system:dicts:read'] },
        hidden: true
      }
    ]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
