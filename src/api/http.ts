import { decode } from 'js-base64'
import { API_URL, MINI_PATH } from '@/utils/config'
import { Authorization, CLIENT_INFO } from '@/utils/constants'
import { showToast } from '@utils/plugin'
import userModule, { User } from '@store/modules/user'

export type CustomConfig = {
  params?: { [propName: string]: any };
  hideLoading?: boolean;
  allowRepeatRequest?: boolean;
  ignoreErrorTips?: boolean;
};

type RequestConfig = Omit<
  UniApp.RequestOptions,
  'url' | 'data' | 'success' | 'fail' | 'complete'
> &
  CustomConfig;

type RequestResponse =
  { code: number | string, message: string, data: string };

const defaultConfig = {
  baseUrl: API_URL,
  timeOut: 2000
}

class Http {
  successQueue = <any>[]
  failQueue = <any>[] // 失败请求队列
  requestTasks = new Map() // 请求缓存任务

  request(config: UniApp.RequestOptions & CustomConfig) {
    const {
      baseUrl,
      url,
      data,
      header,
      allowRepeatRequest = false,
      method,
      ignoreErrorTips = false
    } = Object.assign(defaultConfig, config)

    const { token } = (<User>userModule.state).authInfo

    // 取出重复请求任务
    const historyRequestTask = this.requestTasks.get(url)

    return new Promise((resolve, reject) => {
      // 终止上一次重复请求
      if (!allowRepeatRequest && historyRequestTask) {
        historyRequestTask.abort()
      }

      const requestTask = uni.request({
        url: `${baseUrl}${url}`,
        method,
        data,
        header: {
          ...header,
          [Authorization]: token,
          clientInfo: JSON.stringify({ ...CLIENT_INFO })
        },
        success: (res) => {
          const statusCode = res.statusCode
          const { data, code, message } = <RequestResponse>res.data

          switch (true) {
            case statusCode === 200 && code === '0':
              if (this.isLoginAPI(url)) {
                this.requestRetry()
              }
              const _data = decode(data)
              console.log(JSON.parse(_data), url)
              resolve(JSON.parse(_data))
              break
            case code === '401':
              this.failQueue.push({ params: config, success: resolve, fail: reject })
              if (!ignoreErrorTips) {
                showToast(message || '服务错误')
                uni.navigateTo({ url: MINI_PATH.LOGIN })
              }
              break
            default:
              !ignoreErrorTips && showToast(message || '服务错误')
              reject(message)
          }
        },
        fail: (error) => {
          !ignoreErrorTips && showToast(error)
          reject(error)
        },
        complete: () => {
          // 服务器响应后移除任务队列
          this.requestTasks.delete(url)
        }
      })

      // 添加请求到任务列表
      this.requestTasks.set(url, requestTask)
    })
  }

  post<T>(
    url: string,
    data?: { [propName: string]: any },
    config?: RequestConfig,
  ): Promise<T>;
  post(url: any, data?: any, config?: any): any {
    return this.request({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  get<T>(url: string, config?: RequestConfig): Promise<T>;
  get(url: string, config?: any): any {
    return this.request({
      url,
      method: 'GET',
      data: config ? config.params : {},
      ...config
    })
  }

  isLoginAPI(url) {
    return /(registerOrLogin|saveUser)/g.test(url)
  }

  requestRetry() {
    // 登录成功后的回调函数可能还未执行，把重试401的操作放入异步队列等待登录回调执行后再执行
    setTimeout(() => {
      while (this.failQueue.length) {
        const { params, success, fail } = this.failQueue.shift()
        this.request(params).then(res => {
          success(res)
        }).catch(err => {
          fail(err)
        })
      }
    }, 30)
  }
}

export default new Http()
