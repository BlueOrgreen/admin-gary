import { useRequest } from 'ahooks'
import { Form, Input, Modal, Select, message } from 'antd'
import { useEffect } from 'react'
import { pick } from 'lodash'

import { ruleTypeOptions } from '@/dict/gray'

import * as API from '../../servie'

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

  const { run: addOrEditApplication, loading } = useRequest(
    (query) => API.addOrEditApplication({ ...query }),
    {
      manual: true,
      onSuccess: ({ code }) => {
        if (code === 0) {
          message.success(modalState.type === 'new' ? '新建成功' : '编辑成功')
          handClose()
          refresh()
        }
      },
    },
  )

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        let res
        if (modalState.type === 'new') {
          res = {
            ...values,
          }
        } else {
          res = {
            ...values,
            ...pick(modalState.data, ['id']),
          }
        }
        addOrEditApplication(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (modalState.type === 'edit' && modalState?.data?.application)
      form.setFieldsValue({
        ...modalState.data,
      })
  }, [modalState.type])

  return (
    <Modal
      confirmLoading={loading}
      open={modalState.open}
      title={modalState.type === 'new' ? '新建应用' : '编辑应用'}
      destroyOnClose
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
          label="应用名称"
          name="application"
          rules={[{ required: true, message: '请输入应用名称' }]}
        >
          <Input disabled={modalState.type === 'edit'} />
        </Form.Item>
        <Form.Item
          label="集群"
          name="namespace"
          rules={[{ required: true, message: '请输入集群' }]}
        >
          <Input disabled={modalState.type === 'edit'} />
        </Form.Item>
        <Form.Item
          label="类型"
          name="ruleType"
          rules={[{ required: true, message: '请输入类型' }]}
        >
          <Select options={ruleTypeOptions} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddOrEditModal
