import Vue from 'vue'
import Vuex from 'vuex'
import branches from './modules/branches'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    branches
  }
})