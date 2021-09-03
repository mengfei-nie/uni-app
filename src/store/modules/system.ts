import { Module } from 'vuex'
import { RootState } from '../index'

export interface System {
    statusBarHeight: number
}

const systemModule:Module<System, RootState> = {
  namespaced: true,
  state: {
    statusBarHeight: 0
  },
  getters: {
    barHeightStyle(state) {
      const statusBarHeight = state.statusBarHeight

      return statusBarHeight !== 0 ? `padding-top:${statusBarHeight}px` : ''
    }
  },
  mutations: {
    setSystemInfo(state) {
      uni.getSystemInfo({
        success: function(res) {
          state.statusBarHeight = res.statusBarHeight
        }
      })
    }
  },
  actions: {
  }
}

export default systemModule
