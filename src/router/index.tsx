import { createBrowserHistory } from 'history'
import { Modal } from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { cloneDeep } from 'lodash'

import NotRequireLogin from '@/components/Access/NotRequireLogin'
import RequireLogin from '@/components/Access/RequireLogin'
import NoFoundPage from '@/pages/error-page/no-found-page'

import { asyncRouterConfig, constantRouterConfig } from './routerConfig'

import type { ReactNode } from 'react'
import type { RouterItem } from './routerConfig'

export type MenuConfig = {
  key: string
  label: string
  icon: string
  children?: MenuConfig
}[]

export type OriginPriv = {
  id: number
  navName: string
  webUrl: string
  visible: boolean
  icon: string
  privType: number
  children?: OriginPriv
}[]

export type AuthList = string[]

const hasPermission = (authList: any, route: RouterItem): boolean =>
  !route.auth || authList.includes(route.auth)

export const filterAccessedRoute = (authList: any): RouterItem[] => {
  const loop = (_routerConfig: RouterItem[]): RouterItem[] => {
    const res: RouterItem[] = []
    _routerConfig.forEach((route: RouterItem) => {
      if (hasPermission(authList, route)) {
        if (route.children) {
          route.children = loop(route.children)
        }
        res.push(route)
      }
    })
    return res
  }

  return loop(cloneDeep(asyncRouterConfig))
}

export const createMenu = (list: OriginPriv): MenuConfig => {
  return list
    ?.map((item: any) => {
      if (item?.privType === 1) {
        return {
          ...item,
          path: item.webUrl,
          name: item?.navName,
          children: item?.children?.length ? createMenu(item.children) : [],
        }
      } else {
        return false
      }
    })
    ?.filter(Boolean) as MenuConfig
}

export const createAuthList = (list: OriginPriv): AuthList => {
  const r: AuthList = []
  const loop = (rc: OriginPriv, prefix: string = ''): void => {
    rc?.forEach(({ navName, children }) => {
      children?.length &&
        loop(children, `${prefix ? prefix + '-' : ''}${navName}`)
      navName && r.push(`${prefix ? prefix + '-' : ''}${navName}`)
    })
  }
  loop(list)
  return r
}

export const history = createBrowserHistory()

const generateRouteFromConfig = (config: RouterItem[]): ReactNode[] => {
  const loop = (rc: RouterItem[]): ReactNode[] =>
    rc.map((r: RouterItem) => {
      const { component: Component } = r
      return (
        <Route element={<Component />} key={r.path} path={r.path}>
          {r.children && r.children.length > 0 ? loop(r.children) : null}
        </Route>
      )
    })

  return loop(config)
}

export const createRouter = (
  _constantRouterConfig: RouterItem[],
  _accessedRouteConfig: RouterItem[],
) => {
  const constantRoutes = generateRouteFromConfig(_constantRouterConfig)
  const asyncRoutes = generateRouteFromConfig(_accessedRouteConfig)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NotRequireLogin />}>{constantRoutes}</Route>
        <Route element={<RequireLogin />}>
          {asyncRoutes}
          <Route element={<NoFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

// 路由切换,弹框清除
history.listen(() => {
  Modal.destroyAll()
})
