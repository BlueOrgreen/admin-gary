import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'
import { useMount } from 'ahooks'

import { useUserStore } from '@/store'

const NotRequireLogin: React.FC = () => {
  const token = useUserStore((state) => state.token)
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location

  const [isReady, setIsReady] = useState<boolean>(false)

  useMount(() => {
    setIsReady(true)
  })

  useEffect(() => {
    if (pathname.startsWith('/user') && token) {
      navigate(`/gray/application/list`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!isReady) {
    return <Spin spinning={true} />
  }

  return <Outlet />
}

export default NotRequireLogin
