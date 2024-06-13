import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchDomains(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/domains`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteDomain(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${process.env.VUE_APP_API_BASE_URL}/api/domains/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
