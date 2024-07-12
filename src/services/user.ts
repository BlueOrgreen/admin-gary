import { request, mock } from '@/utils'
import config from '@/config/config'

const { baseUpmsURL } = config

export async function getUserInfo() {
  return request({
    method: 'get',
    url: '/api/service-upms/admin/user/me',
    baseURL: baseUpmsURL,
  })
}

export async function getPriv() {
  return request({
    url: '/api/service-upms/admin/nav/priv',
    method: 'GET',
    baseURL: baseUpmsURL,
  })
}

export function login(params: { username: string; password: string }) {
  return request({
    baseURL: baseUpmsURL,
    url: '/api/service-upms/admin/user/login',
    method: 'POST',
    data: params,
  })
}
