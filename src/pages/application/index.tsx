import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-components'
import { useAntdTable, useRequest } from 'ahooks'
import { pick } from 'lodash'
import {
  Card,
  Table,
  Button,
  Divider,
  Form,
  Select,
  Input,
  Row,
  Modal,
  message,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { commonTableProps, cleanObj } from '@/utils/utils'
import { ruleTypeOptions } from '@/dict/gray'

import styles from './index.module.less'
import * as API from './servie'
import AddOrEditModal from './components/AddOrEditModal'

import type { TableProps } from 'antd'

function GrayApplication() {
  const [form] = Form.useForm()
  const [queryData, setQueryData] = useState<any>({})
  const [modalState, setmodalState] = useState({
    type: 'new',
    open: false,
    data: {},
  })

  const { tableProps, refresh } = useAntdTable(
    async ({ current, pageSize }) => {
      try {
        const {
          data: { records, total },
        } = await API.getApplicationList({
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

  const { run: deleteApplication } = useRequest<any, any>(
    (query) => API.deleteApplication({ ...query }),
    {
      manual: true,
      onSuccess: ({ code }) => {
        if (code === 0) {
          message.success('删除成功')
          refresh()
        }
      },
    },
  )

  const handleEdit = (record: Record<string, any>) => {
    setmodalState((pre) => ({
      ...pre,
      type: 'edit',
      data: record,
      open: true,
    }))
  }

  const handleDelete = async (record: Record<string, any>) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除${record?.application}吗？`,
      onOk: () => {
        deleteApplication(pick(record, ['id', 'namespace', 'application']))
      },
    })
  }

  const renderTableColumns = (): TableProps<any>['columns'] => {
    return [
      {
        dataIndex: 'application',
        title: '应用名称',
        width: 250,
      },
      {
        dataIndex: 'namespace',
        title: '集群',
        width: 250,
      },
      {
        dataIndex: 'ruleType',
        title: '灰度类型',
        width: 200,
        render: (val) => {
          return (
            ruleTypeOptions.find((item: Record<string, any>) => {
              return item.value === val
            })?.label ?? '--'
          )
        },
      },
      {
        dataIndex: 'createdAt',
        title: '创建时间',
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
        align: 'center',
        fixed: 'right',
        width: 180,
        render: (record) => {
          return (
            <div style={{ display: 'flex' }}>
              <Button type="link" onClick={() => handleEdit(record)}>
                编辑
              </Button>
              <Button
                style={{ marginLeft: '12px' }}
                type="link"
                onClick={() => handleDelete(record)}
              >
                删除
              </Button>
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

  const handleNew = () => {
    setmodalState((pre) => ({
      ...pre,
      open: true,
      type: 'new',
      data: {},
    }))
  }

  const handleClose = () => {
    setmodalState((pre) => ({
      ...pre,
      open: false,
      type: 'new',
      data: {},
    }))
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
          <Form.Item label="灰度类型" name="ruleType">
            <Select
              className={styles['search-item-children']}
              options={ruleTypeOptions}
              placeholder="请选择"
              allowClear
            />
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
          <div>
            <Button type="primary" onClick={handleNew}>
              新建
            </Button>
          </div>
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
      <AddOrEditModal
        modalState={modalState}
        refresh={refresh}
        onClose={handleClose}
      />
    </PageContainer>
  )
}

export default GrayApplication
