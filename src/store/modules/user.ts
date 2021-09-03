import { Module } from 'vuex'
import { RootState } from '../index'
import { showToast } from '@utils/plugin'
import userAPI from '@api/user'

export interface User {
  authInfo: {
    token: string,
    appletsKey: string
  };
  validToken: boolean;
  userInfo: {
    nickname: string;
    mobile: string;
    userImageUrl: string
  }
}

const getAuthInfo = () => {
  const authInfo = uni.getStorageSync('authInfo')

  return authInfo && JSON.parse(authInfo) || {
    token: '',
    appletsKey: ''
  }
}

const userModule: Module<User, RootState> = {
  namespaced: true,
  state: {
    authInfo: getAuthInfo(),
    validToken: false,
    userInfo: {
      nickname: '',
      mobile: '',
      userImageUrl: ''
    }
  },
  getters: {
    token(state) {
      return state.authInfo.token
    },
    isLogin(state) {
      return state.validToken
    }
  },
  mutations: {
    setAuthInfo(state, payload) {
      state.authInfo = payload
      uni.setStorageSync(
        'authInfo',
        JSON.stringify(payload)

      )
    },
    setValidToken(state, payload) {
      state.validToken = payload
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    login({ commit, dispatch, state }) {
      return new Promise(async(resolve, reject) => {
        const { token } = state.authInfo

        try {
          // 存在token检测token有效性
          if (token) {
            const data = await userAPI.checkToken({ token })

            commit('setValidToken', data.flag)
            if (!data.flag) {
              throw new Error('token无效')
            } else {
              resolve(data)
            }
          } else {
            throw new Error('token不存在')
          }
        } catch (error) {
          // token失效或不存在统一重新登录
          console.error(error)
          dispatch('uniLogin').then((res) => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        }
      })
    },
    uniLogin({ commit }) {
      return new Promise((resolve, reject) => {
        uni.login({
          scopes: 'auth_base',
          async success(res) {
            const code = res.code
            if (code) {
              try {
                const authInfo = await userAPI.login({ code })

                // 保存认证信息
                commit('setAuthInfo', authInfo)

                if (authInfo && authInfo.hasMobile) {
                  commit('setValidToken', true)
                  resolve(authInfo)
                } else {
                  reject('token未绑定手机号')
                }
              } catch (error) {
                reject(error)
              }
            }
          },
          fail() {
            showToast('登入失败')
          }
        })
      })
    },
    async bindPhone({ commit, state }, payload) {
      try {
        await userAPI.saveUser(payload)

        commit('setAuthInfo', { ...state.authInfo })
      } catch (error) {
        console.error(error)
      }
    },
    async getUserInfo({ commit }) {
      // headImgUrl
      const { nickname, mobile, userImageUrl } = await userAPI.getUserInfo()

      commit('setUserInfo', { nickname, mobile, userImageUrl })
    },
    saveUser({ commit, state }, payload: { iv: string, encryptedData: string }) {
      return new Promise(async(resolve, reject) => {
        try {
          await userAPI.saveUser({ ...payload, ...state.authInfo })

          commit('setValidToken', true)
          resolve(true)
        } catch (e) {
          showToast('授权失败')
          reject(e)
        }
      })
    },
    async loginByPhone({ commit, state }, payload: { mobile: string; authCode: string }) {
      return new Promise(async(resolve, reject) => {
        try {
          const { token } = await userAPI.loginByPhone(payload)

          commit('setAuthInfo', {
            ...state.authInfo,
            token
          })
          commit('setValidToken', true)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}

export default userModule
