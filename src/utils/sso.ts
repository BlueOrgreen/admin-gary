import config from '@/config/config'

const { baseCommonURL, baseSsoURL } = config

const sso = {
  login: () => {
    window.location.href = `${baseCommonURL}/api/base-gateway/admin/openapi/oauth2/authorization/base-gateway?origin_web_uri=${window.location.href}`
  },
  logout: () => {
    window.location.href = baseSsoURL
  },
}

export default sso
