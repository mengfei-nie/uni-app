import Vue from 'vue'
import store from '@store/index'
import { plugins } from '@utils/plugin'
import App from './App.vue'

Vue.use(plugins)
Vue.config.productionTip = false

new App({ store }).$mount()
