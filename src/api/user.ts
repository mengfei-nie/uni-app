import http from './http'
import { MICRO_SERVICE } from '@utils/config'

const parkServiceAPI = (url: string) => `${MICRO_SERVICE.PARK_SERVICE}${url}`

export default {
  // 微信登入
  login(data: { code: string }) {
    return http.post<{ token: string; hasMobile: boolean; appletsKey: string }>(
      parkServiceAPI('/applets/inpark/authorize/login'),
      data
    )
  },
  // 检查token有效期
  checkToken(data: { token: string }) {
    return http.post<{ flag: boolean }>(parkServiceAPI('/applets/inpark/tokenEffective'), data)
  },
  // 微信手机号授权绑定
  saveUser(data: { iv: string; encryptedData: string; token: string; appletsKey: string }) {
    return http.post(parkServiceAPI('/applets/inpark/saveUser'), data)
  },
  // 发送验证码
  sendCode(data: { mobile: string }) {
    return http.post(parkServiceAPI('/api/v1/sys/sms/login/sendCode'), data)
  },
  // 手机号登入
  loginByPhone(data: { mobile: string; authCode: string }) {
    return http.post<{token:string}>(parkServiceAPI('/api/v1/user/registerOrLogin'), data)
  },
  // 获取用户信息/api/v1/user/findUserByToken
  getUserInfo() {
    return http.post<{ nickname: string; mobile: string; userImageUrl: string }>(parkServiceAPI('/api/v1/user/queryUserCard'), {}, {
      ignoreErrorTips: true
    })
  }
}
