import path from 'path'
import fs from 'fs/promises'

import qiniu from 'qiniu'
import inquirer from 'inquirer'
import fuzzypath from 'inquirer-fuzzy-path'
import { glob } from 'glob'
import pico from 'picocolors'

inquirer.registerPrompt('fuzzypath', fuzzypath)

const accessKey = 'LbXfLY1k381cVPfUqIvvwSzN2w8pQSrLMxZ-yZKe'
const secretKey = '1CI8_jzKjYDwFO7tCgDyYQEomS4PaMvJMIW7F9y4'
const prefix = 'https://static.heytea.com'

const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z2
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const putPolicy = new qiniu.rs.PutPolicy({
  scope: 'heytea-static',
  returnBody:
    '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
})

const uploadToken = putPolicy.uploadToken(mac)
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

const uploadFile = (
  filePath,
): Promise<{ fileName: string; status: boolean; data: string }> => {
  const fileName = path.basename(filePath)
  console.log(pico.cyan(`正在上传文件：${fileName}`))
  return new Promise((resolve) => {
    formUploader.putFile(
      uploadToken,
      null,
      filePath,
      putExtra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          console.log(pico.red(`上传失败：${respErr}`))
          resolve({
            fileName,
            status: false,
            data: '',
          })
        } else if (respInfo.statusCode === 200) {
          console.log('上传成功')
          resolve({
            fileName,
            status: true,
            data: `${prefix}/${respBody?.hash}`,
          })
        } else {
          console.log(pico.red(`上传失败${respInfo.statusCode}`))
          resolve({
            fileName,
            status: false,
            data: '',
          })
        }
      },
    )
  })
}

const upload = async () => {
  const { input } = await inquirer.prompt([
    {
      type: 'fuzzypath',
      name: 'input',
      excludePath: (nodePath) => nodePath.startsWith('node_modules'),
      itemType: 'directory',
      rootPath: './',
      message: '请选择输入目录路径',
      suggestOnly: false,
      depthLimit: undefined,
    },
  ])

  const inputDirPath = path.resolve(process.cwd(), input)

  console.log(`输入目录路径: ${pico.green(inputDirPath)}`)

  console.log('开始读取文件...')

  const filePathList = await glob(`${inputDirPath}/**/*`, { nodir: true })

  console.log(
    '待上传文件: ',
    filePathList.map((i) => path.basename(i)),
  )

  const { yes } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'yes',
      message: `确定上传文件？`,
    },
  ])

  if (!yes) {
    console.log(pico.red('已取消上传'))
    return
  }

  const result = {}

  for (const filePath of filePathList) {
    const { fileName, status, data } = await uploadFile(filePath)
    if (status) {
      result[fileName] = data
    }
  }

  try {
    await fs.writeFile(`${input}/map.json`, JSON.stringify(result), {
      encoding: 'utf8',
    })
  } catch (error) {
    console.log(pico.red('写入文件时出错：'))
    console.error(error)
    return
  }

  console.log(pico.green('上传完毕，你可在目录下找到对应的 map json'))
}

upload()
