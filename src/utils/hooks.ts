import { useMount } from 'ahooks'
import { App } from 'antd'
import { useSearchParams } from 'react-router-dom'

export const useQuery = (queryList?: string[]) => {
  const { message } = App.useApp()
  const [params] = useSearchParams()

  const p: Record<string, string> = {}
  params.forEach((value, key) => {
    p[key] = value
  })

  useMount(() => {
    if (queryList?.find((query: string) => !p[query])) {
      message.error('参数错误')
    }
  })

  return p
}
