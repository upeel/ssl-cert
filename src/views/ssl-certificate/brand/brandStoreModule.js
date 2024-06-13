import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchBrands(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/brands`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteBrand(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${process.env.VUE_APP_API_BASE_URL}/api/brands/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
