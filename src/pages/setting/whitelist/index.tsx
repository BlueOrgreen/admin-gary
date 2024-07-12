import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-components'
import { useAntdTable, useRequest } from 'ahooks'
import { isEmpty, isObject } from 'lodash'
import { Card, Table, Button, Row, message, Modal } from 'antd'

import { commonTableProps } from '@/utils/utils'

import AddOrEditModal from './components/AddOrEditModal'

import * as API from '../servie'

import type { TableProps } from 'antd'

function WhiteListSetting() {
  const [modalState, setmodalState] = useState({
    type: 'new',
    open: false,
    data: {},
  })

  const { tableProps, refresh } = useAntdTable<any, any>(
    async ({ current, pageSize }) => {
      try {
        const { data } = await API.getWhiteList({
          current,
          size: pageSize,
        })

        return {
          list: Array.isArray(data)
            ? data
            : isObject(data) && isEmpty(data)
              ? []
              : [],
        }
      } catch (error) {
        return {
          list: [],
          total: 0,
        }
      }
    },
  )

  const { run: deleteWhiteList } = useRequest<any, any>(
    (query) => API.deleteWhiteList({ ...query }),
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
      open: true,
      data: record,
    }))
  }

  const handleDelete = (data: Record<string, any>) => {
    const { name } = data
    Modal.confirm({
      title: '提示',
      content: `确定要删除${name}吗？`,
      onOk: () => {
        deleteWhiteList({ name })
      },
    })
  }

  const renderTableColumns = (): TableProps<any>['columns'] => {
    return [
      {
        dataIndex: '',
        title: '序号',
        width: 150,
        render: (_, record, index) => {
          return <span>{index + 1}</span>
        },
      },
      {
        dataIndex: 'name',
        title: '类型',
        width: 250,
      },
      {
        dataIndex: 'values',
        title: '白名单值',
        width: 300,
      },
      {
        dataIndex: '',
        title: '操作',
        align: 'center',
        width: 180,
        render: (val, record) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
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

  return (
    <PageContainer ghost>
      <Card bordered={false}>
        <Row
          style={{
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div />
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
          pagination={false}
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

export default WhiteListSetting
