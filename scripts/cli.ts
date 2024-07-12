import execa from 'execa'
import pico from 'picocolors'
import inquirer from 'inquirer'
import yargsParser from 'yargs-parser'

const argv = yargsParser(process.argv.slice(2))
const { build } = argv
const REACT_APP_API_ENV: string | undefined = argv.REACT_APP_API_ENV

let env: NodeJS.ProcessEnv = {
  NODE_ENV: build ? 'production' : 'development',
  FORCE_COLOR: 'true',
  REACT_APP_API_ENV,
  REACT_APP_MOCK: 'false',
}

const handleError = (e: Error): void => {
  console.log('-------------------------------------------------------')
  console.error(pico.red('❗❗❗构建错误'))
  console.error(e)
  console.log(pico.red('⚠️错误报文'))
  console.log('️-------------------------------------------------------')
  process.exit(1)
}

process.on('unhandledRejection', handleError)

const createBuild = async (): Promise<void> => {
  console.log('=====>', env)
  if (!env.REACT_APP_API_ENV) {
    console.log(pico.red('❗❗❗不存在的REACT_APP_API_ENV'))
    process.exit(1)
  }
  let builder: execa.ExecaChildProcess | null = null
  try {
    console.log()
    console.log('-------------------------------------------------------')
    console.log('打印当前环境变量:', pico.cyan(JSON.stringify(env)))
    console.log('-------------------------------------------------------')
    console.log()

    builder = execa('rsbuild', build ? ['build'] : ['dev'], {
      stdio: 'inherit',
      env,
    })

    await builder

    console.log(pico.green('构建完成'))
    process.exit()
  } catch (e) {
    if (builder) builder.cancel()
    handleError(e)
  }
}

const formatApiEnv = (envStr: string): string | undefined => {
  const devRegex = /^dev-gsr-\d$/

  const testRegex = /^test-gsr-\d$/
  const ciTestRegex = /^test\/test-gsr-\d$/

  const stgRegex = /^stg-gsr-\d$/

  const releaseRegex = /^staging/
  const prodRegex = /^prod/
  if (envStr) {
    if (devRegex.test(envStr)) return 'dev'
    if (testRegex.test(envStr) || ciTestRegex.test(envStr)) return 'test'
    if (stgRegex.test(envStr)) return 'stg'
    if (prodRegex.test(envStr) || releaseRegex.test(envStr)) return 'prod'
  }
}

const main = async (): Promise<void> => {
  const { stdout } = await execa.command('echo $CI_COMMIT_REF_NAME', {
    shell: true,
  })

  const CI_COMMIT_REF_NAME = stdout.replace(/\n/gi, '')

  if (
    CI_COMMIT_REF_NAME &&
    !CI_COMMIT_REF_NAME.includes('CI_COMMIT_REF_NAME')
  ) {
    env.REACT_APP_API_ENV = formatApiEnv(CI_COMMIT_REF_NAME)
  } else {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'REACT_APP_API_ENV',
        message: '选择环境',
        choices: [
          {
            name: `dev-gsr-1`,
            value: `dev`,
          },
          {
            name: `test-gsr-1`,
            value: `test`,
          },
          {
            name: `stg-gsr-1`,
            value: `stage`,
          },
          {
            name: `prod`,
            value: `prod`,
          },
        ],
      },
      {
        type: 'list',
        name: 'REACT_APP_MOCK',
        message: '是否使用本地mock数据',
        choices: [
          {
            name: `是`,
            value: `true`,
          },
          {
            name: `否`,
            value: `false`,
          },
        ],
      },
    ])
    env = { ...env, ...answer }
  }
  await createBuild()
}

main().catch(console.error)
