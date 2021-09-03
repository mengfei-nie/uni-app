type ENV = 'development' | 'test' | 'production'

export const env: ENV = process.env.VUE_APP_ENV || 'production'
export const isProduction = env === 'production'

export const BASE_URL = {
  development: 'http://localhost:8080',
  test: 'https://inpark-sit.cmsk-icool.com',
  production: 'https://inpark-sit.cmsk-icool.com'
}[env]

// API访问地址前缀
export const API_URL = `${BASE_URL}/park-gateway`

// API微服务应用
export const MICRO_SERVICE = {
  PARK_SERVICE: '/park-service',
  ACTIVITY_SERVICE: '/activity-service',
  GOODS_SERVICE: '/goods-service'
}

// H5访问地址
export const H5_URL = (path, baseUrl = BASE_URL) => `${baseUrl}/${path.replace(/^\//, '')}`

// 嵌入webview的h5链接地址
export const WEBVIEW_URLS = {
  MY_BUSSINESS: H5_URL('/mini/#/business/index'), // 我的企业
  MY_APPLY: H5_URL('/mini/#/residence/index'), // 我的申请
  USER_SETTING: H5_URL('/mini/#/mine/setting'), // 用户设置
  CHOSE_PARK: H5_URL('/mini/#/choosePark/index'), // 选择园区
  ABOUT_US: H5_URL('/oss-test/static/about/about.html'), // 关于我们
  USER_PROTOCAL: H5_URL('oss-test/static/rivacy572e198f6a5945a6a39dfffeffa5e63f.html') // 用户协议
}

// 小程序路径
export const MINI_PATH = {
  LOGIN: '/pages/login/index'
}
