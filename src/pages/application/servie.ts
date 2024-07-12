import request from '@/utils/request'

export const getApplicationList = (data: any) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/serviceGrayConfigList',
    data,
  })
}

export const deleteApplication = (data: any) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/deleteServiceGrayRule',
    data,
  })
}

export const addOrEditApplication = (data: any) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/saveServiceGrayRule',
    data,
  })
}
