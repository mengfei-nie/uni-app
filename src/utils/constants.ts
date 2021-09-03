import { isProduction } from './config'

export const Authorization = 'Authorization'

export const CLIENT_INFO = {
  loginType: 'wpLogin',
  clientCode: 'cyyq-mini',
  clientType: 'parkMini',
  clientId: isProduction ? 'CYYQ' : 'test',
  parkId: ''
}

