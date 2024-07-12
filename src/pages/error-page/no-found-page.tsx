import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NoFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Result
      extra={
        <Button
          type="primary"
          onClick={() => navigate('/gray/application/list')}
        >
          回到首页
        </Button>
      }
      status="404"
      subTitle="抱歉，您访问的页面不存在"
      title="页面不存在"
    />
  )
}

export default NoFoundPage
