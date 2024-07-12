import request from '@/utils/request'

export const getServicePipelineList = (data: any) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/servicePipelineList',
    data,
  })
}

export const getDemandPipelineList = (data: any) => {
  return request({
    method: 'POST',
    url: '/api/admin-gray/gray/admin/demandPipelineList',
    data,
  })
}
