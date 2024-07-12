import React, { useEffect, useState } from 'react'
import { useAntdTable } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@ant-design/pro-components'
import { Card, Form, Table } from 'antd'

import { commonTableProps } from '@/utils/utils'
import { useQuery } from '@/utils/hooks'
import getPathInMenu from '@/utils/get-path-in-menu'
import { useUserStore } from '@/store'

import * as API from '../servie'

import type { TableProps } from 'antd'

function DemandDetailPipeline() {
  const menuConfig = useUserStore((state) => state.menuConfig)
  const [form] = Form.useForm()
  const { id, pipelineName } = useQuery()
  const navigate = useNavigate()
  const [breadcrumbItems, setBreadcrumbItems] = useState<any>([])

  const { tableProps } = useAntdTable(async ({ current, pageSize }) => {
    try {
      const {
        data: { records, total },
      } = await API.getServicePipelineList({
        current,
        size: pageSize,
        grayDemandPipelineId: id,
      })
      return {
        list: records ?? [],
        total: total ?? 0,
      }
    } catch (error) {
      return {
        list: [],
        total: 0,
      }
    }
  })

  const renderTableColumns = (): TableProps<any>['columns'] => {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
        width: 100,
      },
      {
        dataIndex: 'application',
        title: '应用名称',
        width: 250,
      },
      {
        dataIndex: 'namespace',
        title: '命名空间',
        width: 200,
      },
      {
        dataIndex: 'pipelineName',
        title: '需求流水线名称',
        width: 250,
        render: (_, record) => {
          return record?.demandPipelineBaseInfo
            ? record?.demandPipelineBaseInfo.pipelineName
            : '--'
        },
      },
      {
        dataIndex: 'pipelineId',
        title: '流水线ID',
        width: 300,
        render: (_, record) => {
          return record?.demandPipelineBaseInfo
            ? record?.demandPipelineBaseInfo.pipelineId
            : '--'
        },
      },
      {
        dataIndex: 'pipelineBuildId',
        title: '需求流水线构建ID',
        width: 300,
        render: (_, record) => {
          return record?.demandPipelineBaseInfo
            ? record?.demandPipelineBaseInfo.pipelineBuildId
            : '--'
        },
      },
      {
        dataIndex: 'projectCode',
        title: '需求流水线项目编码',
        width: 250,
        render: (_, record) => {
          return record?.demandPipelineBaseInfo
            ? record?.demandPipelineBaseInfo.projectCode
            : '--'
        },
      },
      {
        dataIndex: 'updatedAt',
        title: '修改时间',
        width: 250,
      },
      {
        dataIndex: 'createdAt',
        title: '创建时间',
        width: 180,
      },
      {
        dataIndex: 'stage',
        title: '灰度阶段',
        fixed: 'right',
        width: 250,
      },
    ]
  }

  useEffect(() => {
    const pathList = getPathInMenu(menuConfig, '/gray/publish/demand')
    const routesList = pathList.map?.((item: any) => ({
      title: item.name,
    }))
    setBreadcrumbItems([...routesList, { title: '需求流水线详情' }])
    form.setFieldsValue({
      name: '测试名字-123',
    })
  }, [])

  return (
    <PageContainer
      breadcrumb={{ items: breadcrumbItems }}
      title="需求流水线详情"
      onBack={() => navigate(-1)}
    >
      <Card bordered={false}>
        <Form form={form} layout="inline" style={{ marginBottom: '12px' }}>
          <Form.Item label="需求流水线名称" name="name" shouldUpdate>
            <span>{pipelineName}</span>
          </Form.Item>
        </Form>
        <Table
          {...commonTableProps}
          columns={renderTableColumns()}
          {...tableProps}
          pagination={{
            ...tableProps?.pagination,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30'],
          }}
        />
      </Card>
    </PageContainer>
  )
}

export default DemandDetailPipeline
