import store from '@/store'
import { MINI_PATH } from './config'

interface DebounceOptions {
  time:number,
  immediate:boolean
}

export function debounce(options:DebounceOptions = { time: 200, immediate: true }) {
  const { time, immediate } = options
  let timer:ReturnType<typeof setTimeout>

  return function(target, name, descriptor) {
    const execFn = descriptor.value

    descriptor.value = function(...args) {
      if (timer) clearTimeout(timer)

      if (!immediate) {
        timer = setTimeout(() => {
          execFn.apply(this, args)
        }, time)
      } else {
        const immediateCall = !timer
        timer = setTimeout(() => {
          timer = null as any
        }, time)

        if (immediateCall) {
          execFn.apply(this, args)
        }
      }
    }

    return descriptor
  }
}

// 鉴权
export function auth(target, name, descriptor) {
  const execFn = descriptor.value

  descriptor.value = function(...args) {
    const isLogin = store.getters['user/isLogin']

    if (!isLogin) {
      uni.navigateTo({ url: MINI_PATH.LOGIN })
    } else {
      execFn.apply(this, args)
    }
  }
}

