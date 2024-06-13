import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchSsl(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/ssl`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteSsl(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${process.env.VUE_APP_API_BASE_URL}/api/ssl/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    revokeSsl(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_API_BASE_URL}/api/ssl/${id}/revoke`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    cancelSsl(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_API_BASE_URL}/api/ssl/${id}/cancel`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    downloadSsl(ctx, { id, domain }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/ssl/${id}/download`, {responseType: 'blob'})
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${domain}.zip`)
            document.body.appendChild(link)
            link.click()
            resolve(response)
          })
          .catch(async (error) => {
            if (error.response && error.response.data) {
              // Attempt to read error response as text
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  // Try to parse the response as JSON
                  const errorData = JSON.parse(reader.result);
                  reject(errorData);
                } catch (e) {
                  // If parsing fails, treat it as a plain string
                  reject(reader.result);
                }
              };
              reader.onerror = () => {
                // Handle reading error
                reject('An error occurred while reading the error response.');
              };
              reader.readAsText(error.response.data);
            } else {
              reject(error);
            }
          })
      })
    },
    downloadSslKey(ctx, { id, domain }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/ssl/${id}/download-key`, {responseType: 'blob'})
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${domain}.pem`)
            document.body.appendChild(link)
            link.click()
            resolve(response)
          })
          .catch(async (error) => {
            if (error.response && error.response.data) {
              // Attempt to read error response as text
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  // Try to parse the response as JSON
                  const errorData = JSON.parse(reader.result);
                  reject(errorData);
                } catch (e) {
                  // If parsing fails, treat it as a plain string
                  reject(reader.result);
                }
              };
              reader.onerror = () => {
                // Handle reading error
                reject('An error occurred while reading the error response.');
              };
              reader.readAsText(error.response.data);
            } else {
              reject(error);
            }
          })
      })
    }
  },
}
