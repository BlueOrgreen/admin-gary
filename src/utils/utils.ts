import { isNil, isUndefined, pickBy } from 'lodash'

import type { TableProps } from 'antd'

export const commonTableProps: TableProps<any> = {
  rowKey: 'id',
  scroll: { x: '100%', scrollToFirstRowOnChange: true },
  style: { width: '100%' },
  pagination: {
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30'],
  },
}

export function cleanObj(vals: Record<string, any>) {
  const res = pickBy(vals, (value) => !isNil(value) && !isUndefined(value))
  return res
}
