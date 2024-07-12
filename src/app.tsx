import React, { useMemo } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { ConfigProvider, App as AntdApp } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'

import { constantRouterConfig } from './router/routerConfig'
import { createRouter, filterAccessedRoute } from './router'
import { useUserStore } from './store'

import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'
import type { PropsWithChildren } from 'react'

let message: MessageInstance
let notification: NotificationInstance
let modal: Omit<ModalStaticFunctions, 'warn'>

const App: React.FC = () => {
  const { authList, userInfo } = useUserStore()

  const accessedRouteConfig = useMemo(() => {
    const res = filterAccessedRoute(authList)
    console.log('authList===>', authList, res)
    return res
  }, [authList])

  return (
    <HelmetProvider>
      <ConfigProvider
        locale={zh_CN}
        theme={{
          token: {
            // colorPrimary: '#6871F4',
            // colorInfo: '#6871F4',
          },
        }}
      >
        <AntdApp>
          <FeedbackWrapper>
            {createRouter(constantRouterConfig, accessedRouteConfig)}
          </FeedbackWrapper>
        </AntdApp>
      </ConfigProvider>
    </HelmetProvider>
  )
}

export const FeedbackWrapper: React.FC<PropsWithChildren<any>> = ({
  children,
}) => {
  const staticFunction = AntdApp.useApp()
  message = staticFunction.message
  modal = staticFunction.modal
  notification = staticFunction.notification
  return children
}

export { message, notification, modal }

export default App
