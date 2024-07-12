import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-components'
import { useAntdTable } from 'ahooks'
import { Card, Table, Button, Divider, Form, Input, Row } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { commonTableProps, cleanObj } from '@/utils/utils'

import styles from './index.module.less'

import * as API from '../servie'

import type { TableProps } from 'antd'

function ServicePipeline() {
  const [form] = Form.useForm()
  const [queryData, setQueryData] = useState<any>({})

  const { tableProps } = useAntdTable(
    async ({ current, pageSize }) => {
      try {
        const {
          data: { records, total },
        } = await API.getServicePipelineList({
          current,
          size: pageSize,
          ...cleanObj(queryData),
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
    },
    {
      refreshDeps: [queryData],
    },
  )

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
        title: '需求流水线ID',
        width: 320,
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
        align: 'center',
        width: 200,
      },
    ]
  }

  const onClickReset = () => {
    form.resetFields()
    setQueryData({})
  }

  const handleFinish = () => {
    const vals = form.getFieldsValue()
    setQueryData(vals)
  }

  return (
    <PageContainer>
      <Card bordered={false}>
        <Form form={form} layout="inline" onFinish={handleFinish}>
          <Form.Item label="应用名称" name="application">
            <Input className={styles['search-item-children']} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" icon={<SearchOutlined />} type="primary">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="button" onClick={onClickReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
        <Divider />
        <Row
          style={{
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>符合条件的信息共 {tableProps?.pagination?.total} 条</div>
        </Row>
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
          sticky={{ offsetHeader: 48 }}
        />
      </Card>
    </PageContainer>
  )
}

export default ServicePipeline
