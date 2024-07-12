import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@ant-design/pro-components'
import { useAntdTable } from 'ahooks'
import { Card, Table, Button, Divider, Form, Input, Row } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { commonTableProps, cleanObj } from '@/utils/utils'

import styles from './index.module.less'

import * as API from '../servie'

import type { TableProps } from 'antd'

function DemandPipeline() {
  const [form] = Form.useForm()
  const [queryData, setQueryData] = useState<any>({})

  const { tableProps } = useAntdTable(
    async ({ current, pageSize }) => {
      try {
        const {
          data: { records, total },
        } = await API.getDemandPipelineList({
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
        dataIndex: 'pipelineName',
        title: '流水线名称',
        width: 250,
      },
      {
        dataIndex: 'pipelineId',
        title: '流水线ID',
        width: 320,
      },
      {
        dataIndex: 'projectCode',
        title: '项目编码',
        width: 200,
      },
      {
        dataIndex: 'pipelineBuildId',
        title: '构建ID',
        width: 300,
      },
      {
        dataIndex: 'createdAt',
        title: '构建时间',
        width: 250,
      },
      {
        dataIndex: 'updatedAt',
        title: '修改时间',
        width: 250,
      },
      {
        dataIndex: '',
        title: '操作',
        fixed: 'right',
        align: 'center',
        width: 200,
        render: (val, record) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link
                to={`/gray/publish/demand/detail?id=${record.id}&pipelineName=${record.pipelineName}`}
              >
                详情
              </Link>
            </div>
          )
        },
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
          <Form.Item label="流水线名称" name="pipelineName">
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

export default DemandPipeline
