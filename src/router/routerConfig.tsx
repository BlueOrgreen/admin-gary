import { lazy } from 'react'

import BlankLayout from '@/layouts/BlankLayout'
import Application from '@/pages/application'
import BasicLayout from '@/layouts/BasicLayout'

export type RouterItem = {
  path: string
  name: string
  auth?: number | string
  redirect?: string
  hideInBreadcrumb?: boolean
  component?: any
  children?: RouterItem[]
  element?: any
}

export const constantRouterConfig: RouterItem[] = [
  {
    auth: '',
    path: '/gray/user',
    name: '登录',
    component: BlankLayout,
    children: [
      {
        auth: '',
        path: 'login',
        name: '登录',
        component: lazy(() => import('@/pages/login')),
      },
    ],
  },
]

export const asyncRouterConfig: RouterItem[] = [
  {
    path: '/gray/application',
    name: '',
    component: BasicLayout,
    children: [
      {
        auth: '应用管理',
        path: '/gray/application/list',
        name: '应用管理',
        component: Application,
      },
    ],
  },
  {
    auth: '灰度设置',
    path: '/gray/setting',
    name: '灰度设置',
    component: BasicLayout,
    children: [
      {
        auth: '灰度设置-全局设置',
        name: '全局设置',
        path: '/gray/setting/global',
        component: lazy(() => import('@/pages/setting/global')),
      },
      {
        auth: '灰度设置-白名单设置',
        path: '/gray/setting/whitelist',
        name: '白名单设置',
        component: lazy(() => import('@/pages/setting/whitelist')),
      },
    ],
  },
  {
    auth: '发布管理',
    path: '/gray/publish',
    name: '发布管理',
    component: BasicLayout,
    children: [
      {
        auth: '发布管理-需求流水线',
        name: '需求流水线',
        path: '/gray/publish/demand',
        component: lazy(() => import('@/pages/publish/demand-pipeline')),
      },
      {
        auth: '发布管理-需求流水线详情',
        name: '需求流水线',
        path: '/gray/publish/demand/detail',
        component: lazy(() => import('@/pages/publish/demand-detail')),
      },
      {
        auth: '发布管理-服务流水线',
        path: '/gray/publish/service',
        name: '服务流水线',
        component: lazy(() => import('@/pages/publish/service-pipeline')),
      },
    ],
  },
]
