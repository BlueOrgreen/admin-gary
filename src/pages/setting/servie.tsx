import request from '@/utils/request'

export const updateGlobalGraySwitch = (data: any) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/updateGlobalGraySwitch',
    data,
  })
}

export const getWhiteList = (data: Record<string, any>) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/whiteList/list',
    data,
  })
}

export const deleteWhiteList = (data: Record<string, any>) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/whiteList/delete',
    data,
  })
}

export const addWhiteList = (data: Record<string, any>) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/whiteList/add',
    data,
  })
}

export const editWhiteList = (data: Record<string, any>) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/whiteList/update',
    data,
  })
}

export const getGlobalGraySwitch = (data: Record<string, any>) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/getGlobalGraySwitch',
    data,
  })
}
