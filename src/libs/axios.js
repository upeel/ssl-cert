import Vue from 'vue'
import useJwt from '@/auth/jwt/useJwt'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: 'https://xxl.logiclabs.id'
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})

axiosIns.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

Vue.prototype.$http = axiosIns

export default axiosIns
