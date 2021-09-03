export function showToast(msg, options?) {
  uni.showToast({ title: msg, icon: 'none', ...options })
}

export function showLoading(msg, options?) {
  uni.showLoading({ title: msg, icon: 'none', ...options })
}

export function jumpWebview(h5Url:string) {
  const [frontPart, rearPart] = h5Url.split('?')
  if (!rearPart) {
    uni.navigateTo({ url: `/pages/webview/index?h5Url=${h5Url}` })
  } else {
    uni.navigateTo({ url: `/pages/webview/index?h5Url=${frontPart}&${rearPart}` })
  }
}

export function jump(url:string) {
  if (!url) return showToast('url路径不存在')

  if (/^https?:\/\//.test(url)) {
    jumpWebview(url)
  } else {
    uni.navigateTo({ url, fail() {
      showToast('跳转失败')
    } })
  }
}

export const plugins = {
  install(Vue) {
    Vue.prototype.$showToast = showToast
    Vue.prototype.$jumpWebview = jumpWebview
    Vue.prototype.$jump = jump
  }
}

