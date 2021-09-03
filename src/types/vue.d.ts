
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $showToast: (msg: string, options?: unknown) => unknown
    $jumpWebview: (h5Url: string) => unknown
    $jump: (url: string) => unknown
  }
}
