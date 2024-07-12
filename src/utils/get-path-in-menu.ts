export default function getPathInMenu(
  tree: any[],
  value: string,
  path: any[] = [],
) {
  for (let i = 0; i < tree.length; i++) {
    const tempPath = [...path]
    tempPath.push(tree[i])

    if (tree[i].path === value) {
      return tempPath
    }

    if (tree[i].children?.length) {
      const result = getPathInMenu(tree[i].children, value, tempPath)
      if (result) {
        return result
      }
    }
  }
}
