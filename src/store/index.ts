import Vue from 'vue'
import Vuex from 'vuex'
import { User } from './modules/user'
import { System } from './modules/system'

const requireModules = require.context('./modules', true, /\.ts/)
const modules = requireModules.keys().reduce((acc, fileName) => {
  const moduleName = fileName.match(/\.\/(.*)\.ts$/)?.[1]

  if (moduleName) {
    acc[moduleName] = requireModules(fileName).default
  }

  return acc
}, {})

export interface State {
  globalData: string,
}
export interface RootState extends State{
  user: User
  system: System
}

Vue.use(Vuex)

const store = new Vuex.Store<State>({
  state: {
    globalData: ''
  },
  modules: { ...modules }
})

export default store

