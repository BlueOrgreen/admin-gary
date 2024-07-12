import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { storage } from '@mango-kit/utils'

// import { createMenu, createAuthList } from '@/router'
import * as API from '@/services/user'
import sso from '@/utils/sso'
import {
  type OriginPriv,
  type MenuConfig,
  type AuthList,
  createMenu,
  createAuthList,
} from '@/router'

type UserStore = {
  token: string
  userInfo: Record<string, any>
  menuConfig: MenuConfig
  authList: AuthList
  login: () => void
  getUserInfo: () => Promise<boolean>
  getAuthList: () => Promise<boolean>
  logout: () => void
}

const useUserStore = create<UserStore>()(
  devtools((set, get) => ({
    token: storage.getItem('TOKEN', ''),
    userInfo: {},
    authList: [],
    menuConfig: [],
    login: async () => {
      return sso.login()
    },
    getUserInfo: async () => {
      const { code, data } = await API.getUserInfo()
      if (code === 0) {
        storage.setItem('USER_NAME', data?.name)
        set({ userInfo: data })
        return true
      } else {
        return false
      }
    },
    getAuthList: async () => {
      const { code, data } = await API.getPriv()
      if (code === 0) {
        const { moduleList = [] } = data
        const list: OriginPriv =
          moduleList?.find((i: any) => i?.path === 'GSR')?.navList ?? []
        console.log('GSR menu list===>', list)
        set({ menuConfig: createMenu(list), authList: createAuthList(list) })
        return true
      } else {
        return false
      }
    },
    logout: () => {
      set({ token: '' })
      storage.removeItem('TOKEN')
      sso.logout()
    },
  })),
)

export default useUserStore
