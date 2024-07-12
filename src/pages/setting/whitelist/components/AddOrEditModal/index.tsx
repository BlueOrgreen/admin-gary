import { useRequest } from 'ahooks'
import { Form, Input, Modal, Select, message } from 'antd'
import React, { useEffect } from 'react'

import * as API from '../../../servie'

type ModalProps = {
  modalState: Record<string, any>
  onClose: () => void
  refresh: () => void
}

function AddOrEditModal(props: ModalProps) {
  const [form] = Form.useForm()
  const { modalState, onClose, refresh } = props

  const handClose = () => {
    form.resetFields()
    onClose()
  }

  const { run: addWhiteList, loading } = useRequest<any, any>(
    (query) => API.addWhiteList({ ...query }),
    {
      manual: true,
      onSuccess: ({ code }) => {
        if (code === 0) {
          message.success('新建成功')
          handClose()
          refresh()
        }
      },
    },
  )

  const { run: editWhiteList } = useRequest<any, any>(
    (query) => API.editWhiteList({ ...query }),
    {
      manual: true,
      onSuccess: ({ code, message: msg }) => {
        if (code === 0) {
          message.success('编辑成功')
          handClose()
          refresh()
        } else {
          message.warning(msg)
        }
      },
    },
  )

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (modalState.type === 'new') {
          addWhiteList(values)
        } else {
          editWhiteList(values)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (modalState.type === 'edit' && modalState?.data?.name)
      form.setFieldsValue({
        ...modalState.data,
      })
  }, [modalState.type])

  return (
    <Modal
      confirmLoading={loading}
      open={modalState.open}
      title={modalState.type === 'new' ? '新建白名单' : '编辑白名单'}
      onCancel={handClose}
      onOk={handleOk}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        style={{ marginTop: '18px' }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="类型"
          name="name"
          rules={[{ required: true, message: '请输入类型' }]}
        >
          {/* <Input disabled={modalState.type === 'edit'} /> */}
          <Select
            disabled={modalState.type === 'edit'}
            options={[
              {
                label: 'P0_MEMBER',
                value: 'P0_MEMBER',
              },
              {
                label: 'P0_STAFF',
                value: 'P0_STAFF',
              },
              {
                label: 'P0_SHOP',
                value: 'P0_SHOP',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="白名单值"
          name="values"
          rules={[
            { required: true, message: '请输入白名单值' },
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve()
                }

                if (!/^[0-9,]+$/.test(value)) {
                  return Promise.reject(
                    new Error('只支持输入逗号(非中文逗号)和数字'),
                  )
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddOrEditModal
