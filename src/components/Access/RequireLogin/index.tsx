import React, { useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useMount } from 'ahooks'
import { storage } from '@mango-kit/utils'

import PageLoading from '@/components/PageLoading'
import { useUserStore } from '@/store'

import type { PropsWithChildren } from 'react'

const RequireLogin: React.FC<PropsWithChildren> = () => {
  const { token, login, getUserInfo, getAuthList } = useUserStore()
  const [searchParams, setSearchParams] = useSearchParams()

  const [isReady, setIsReady] = useState<boolean>(false)

  useMount(async () => {
    const xAccessToken = searchParams.get('x-access-token')

    if (xAccessToken) {
      storage.setItem('TOKEN', xAccessToken)
      useUserStore.setState({ token })
      await getUserInfo()
      await getAuthList()
      searchParams.delete('x-access-token')
      setSearchParams(searchParams)
      setIsReady(true)
      return
    }

    if (token) {
      await getUserInfo()
      await getAuthList()
      setIsReady(true)
    } else {
      console.log('跳去大中枢登录')
      login()
    }
  })

  if (!isReady) {
    return <PageLoading spinning={true} />
  }

  return <Outlet />
}

export default RequireLogin
