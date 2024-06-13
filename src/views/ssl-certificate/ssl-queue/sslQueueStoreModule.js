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
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/ssl-queue`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteSsl(ctx) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${process.env.VUE_APP_API_BASE_URL}/api/ssl-queue/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    downloadSslQueue(ctx, { id, name }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/ssl-queue/${id}/ssl`, {responseType: 'blob'})
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${name}.zip`)
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
    downloadSslQueueKey(ctx, { id, name }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/api/ssl-queue/${id}/key`, {responseType: 'blob'})
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${name}.pem`)
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
