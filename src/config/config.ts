const host = window.location.host

const hostMap = {
  'admin-gsr-1.dev.heytea.com': 'dev',
  'admin-gsr-1.test.heytea.com': 'test',
  'admin-gsr-1.stg.heytea.com': 'stg',
  'admin-gsr.lan.heytea.com': 'prod',
}

const map = {
  dev: {
    baseURL: 'https://api-gsr-1.dev.heytea.com',
    baseUpmsURL: 'https://api-upms-1.dev.heytea.com',
    baseCommonURL: 'https://dev-go-1-base-gateway.heyteago.com',
    baseSsoURL: 'https://cas-go-1.dev.heytea.com/logout',
  },
  test: {
    baseURL: 'https://api-gsr-1.test.heytea.com',
    baseUpmsURL: 'https://api-upms-1.test.heytea.com',
    baseCommonURL: 'https://test-go-1-api.heyteago.com',
    baseSsoURL: 'https://test-go-1-cas.heyteago.com/logout',
  },
  stg: {
    baseURL: 'https://api-gsr-1.stg.heytea.com',
    baseUpmsURL: 'https://api-upms-1.stg.heytea.com',
    baseCommonURL: 'https://staging.heytea.com',
    baseSsoURL: 'https://staging1-cas.heyteago.com/logout',
  },
  prod: {
    baseURL: 'https://api-gsr.lan.heytea.com',
    baseUpmsURL: 'https://api-upms.lan.heytea.com',
    baseCommonURL: 'https://go.heytea.com',
    baseSsoURL: 'https://account.heytea.com/logout',
  },
}

const { baseURL, baseUpmsURL, baseCommonURL, baseSsoURL } =
  map[
    (hostMap[host as keyof typeof hostMap] as keyof typeof map) ||
      (process.env.REACT_APP_API_ENV as keyof typeof map) ||
      'dev'
  ]

export default {
  baseURL,
  baseUpmsURL,
  baseCommonURL,
  baseSsoURL,
}
