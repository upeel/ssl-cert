import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchDns(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/dns`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteDns(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${process.env.VUE_APP_API_BASE_URL}/api/dns/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    syncDns(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_API_BASE_URL}/api/dns/${id}/sync`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    }
  },
}
