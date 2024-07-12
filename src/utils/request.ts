import axios from 'axios'
import { notification } from 'antd'
import { merge } from 'lodash'
import { storage } from '@mango-kit/utils'

import config from '@/config/config'

import sso from './sso'

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

const { baseURL } = config

// 状态码错误信息
const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  600: '网络未连接或请求配置发生错误。', // 自定义，axios配置发生错误
}

export type IResult<R = any> = {
  code: number
  message: string
  data: R
}

export default async function request(options: AxiosRequestConfig) {
  const token = storage.getItem('TOKEN')
  const defaultOptions: AxiosRequestConfig = {
    method: 'GET',
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const newOptions: AxiosRequestConfig = merge({}, defaultOptions, options)
  let result: IResult = {
    code: 200,
    message: '',
    data: {},
  }

  try {
    const response: AxiosResponse = await axios(newOptions)
    result = response.data
  } catch (error) {
    const { response: { status = 600, statusText = '', data } = {} } =
      error as AxiosError<IResult>
    result = {
      code: data?.code || status,
      message: data?.message || codeMessage[status] || statusText,
      data: {},
    }
  }

  switch (result.code) {
    case 0:
      break
    case 401:
      sso.login()
      break
    default:
      notification.warning({
        message: `请求失败：${result.code || 600}`,
        description: result?.message || '网络请求遇到了点问题～',
      })
  }

  return result
}
