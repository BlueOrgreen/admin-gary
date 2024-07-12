import React from 'react'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Card, Form, Switch, message } from 'antd'
import { useRequest } from 'ahooks'

import * as API from '../servie'

function GlobalSetting() {
  const [form] = Form.useForm()

  const { run: updateGlobalGraySwitch, loading } = useRequest<any, any>(
    (query) => API.updateGlobalGraySwitch({ ...query }),
    {
      manual: true,
      onSuccess: ({ code }) => {
        if (code === 0) {
          message.success('设置成功')
        }
      },
    },
  )

  const { run: getGlobalGraySwitch, data } = useRequest<any, any>(
    (query) => API.getGlobalGraySwitch({ ...query }),
    {
      onSuccess: ({ code, data }) => {
        if (code === 0) {
          form.setFieldsValue({
            switchStatus: !!data,
          })
        }
      },
    },
  )

  const handleFinish = () => {
    const { switchStatus } = form.getFieldsValue()
    updateGlobalGraySwitch({
      switchStatus: !!switchStatus,
    })
  }

  return (
    <PageContainer ghost>
      <Card bordered={false}>
        <Form form={form} onFinish={handleFinish}>
          <Form.Item
            label="是否开启全局设置"
            name="switchStatus"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={loading} type="primary">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}

export default GlobalSetting
