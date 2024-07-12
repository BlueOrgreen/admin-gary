import { Outlet } from 'react-router'
import { PageLoading, ProLayout } from '@ant-design/pro-components'
import { Link, useLocation } from 'react-router-dom'
import { LogoutOutlined } from '@ant-design/icons'
import { ConfigProvider, Dropdown, Tag, theme } from 'antd'
import { Suspense } from 'react'

import avatar from '@/assets/images/avatar.png'
import logo from '@/assets/images/logo.png'
import sso from '@/utils/sso'
import { useUserStore } from '@/store'

const env = process.env.REACT_APP_API_ENV

const BasicLayout: React.FC<{}> = () => {
  const location = useLocation()
  const { authList, userInfo } = useUserStore()
  const menuConfig = useUserStore((state) => state.menuConfig)
  console.log('menuConfig', menuConfig, 'location===>', location)

  return (
    <ProLayout
      avatarProps={{
        src: avatar,
        size: 'small',
        title: userInfo?.name || '阿喜',
        render: (_props, dom) => {
          return (
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                    },
                  ],
                  onClick: () => {
                    sso.logout()
                  },
                }}
                placement="bottomRight"
              >
                {dom}
              </Dropdown>
            </ConfigProvider>
          )
        },
      }}
      breadcrumbProps={{
        itemRender: (item) => item.title,
      }}
      headerTitleRender={(logo, title) => {
        return (
          <>
            {logo}
            {title}
            {env ? (
              <Tag color="#52c41a" style={{ marginLeft: 8 }}>
                {env}
              </Tag>
            ) : null}
          </>
        )
      }}
      layout="mix"
      location={location}
      logo={logo}
      menuItemRender={(item, dom) => {
        return <Link to={item.path}>{dom}</Link>
      }}
      route={{
        path: '/',
        children: menuConfig,
      }}
      title={'灰度配置系统'}
      token={{
        header: {
          colorBgHeader: '#141414',
          colorHeaderTitle: '#fff',
          colorTextRightActionsItem: '#dfdfdf',
        },
        sider: {
          colorMenuBackground: '#fff',
        },
      }}
    >
      <Suspense fallback={<PageLoading spinning />}>
        <Outlet />
      </Suspense>
    </ProLayout>
  )
}

export default BasicLayout
