import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import { store } from './store'
import './assets/scss/main.scss'

// Configure axios
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_FOODICS_TOKEN}`
  return config
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')