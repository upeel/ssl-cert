import { ref, watch, computed, onBeforeUnmount } from '@vue/composition-api'
import store from '@/store'
import debounce from 'lodash.debounce'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useSslList() {
  // Use toast
  const toast = useToast()

  const refSslListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'domain', label: 'Domain', sortable: true },
    { key: 'expired_at', label: 'Expired At', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalSsl = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('created_at')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)
  const start_date = ref('')
  const end_date = ref('')

  const dataMeta = computed(() => {
    const localItemsCount = refSslListTable.value ? refSslListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalSsl.value,
    }
  })

  const debouncedWatch = debounce(() => {
    refSslListTable.value.refresh()
  }, 800)

  watch(searchQuery, debouncedWatch)

  const refetchData = () => {
    refSslListTable.value.refresh()
  }

  watch([currentPage, perPage, statusFilter], () => {
    refetchData()
  })

  onBeforeUnmount(() => {
    debouncedWatch.cancel()
  })

  const fetchSsl = (ctx, callback) => {
    store
      .dispatch('ssl/fetchSsl', {
        per_page: perPage.value,
        page: currentPage.value,
        query: searchQuery.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        status: statusFilter.value,
        expiry_start_date: start_date.value,
        expiry_end_date: end_date.value
      })
      .then(response => {
        const { data, total } = response.data

        callback(data)
        totalSsl.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching SSL Certificate list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const filterSsl = (startDate, endDate) => {
    start_date.value = startDate
    end_date.value = endDate
    refetchData()
  }

  const revokeSsl = (sslId) => {
    store.dispatch('ssl/revokeSsl', { id: sslId })
      .then(response => {
        refSslListTable.value.refresh()
        toast({
          component: ToastificationContent,
          props: {
            title: response.data.message,
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      })
      .catch(err => {
        toast({
          component: ToastificationContent,
          props: {
            title: err.response.data.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const cancelSsl = (sslId) => {
    store.dispatch('ssl/cancelSsl', { id: sslId })
      .then(response => {
        refSslListTable.value.refresh()
        toast({
          component: ToastificationContent,
          props: {
            title: response.data.message,
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      })
      .catch(err => {
        toast({
          component: ToastificationContent,
          props: {
            title: err.response.data.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const downloadSsl = (sslId, domain) => {
    store.dispatch('ssl/downloadSsl', { id: sslId, domain: domain })
      .then(response => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'File downloaded!',
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      })
      .catch(err => {
        toast({
          component: ToastificationContent,
          props: {
            title: err.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const downloadSslKey = (sslId, domain) => {
    store.dispatch('ssl/downloadSslKey', { id: sslId, domain: domain })
      .then(response => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Key downloaded!',
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      })
      .catch(err => {
        toast({
          component: ToastificationContent,
          props: {
            title: err.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const deleteSsl = (sslId) => {
    store.dispatch('ssl/deleteSsl', { id: sslId })
      .then(response => {
        refSslListTable.value.refresh()
        toast({
          component: ToastificationContent,
          props: {
            title: response.data.message,
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      })
      .catch(err => {
        toast({
          component: ToastificationContent,
          props: {
            title: err.response.data.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  return {
    fetchSsl,
    tableColumns,
    perPage,
    currentPage,
    totalSsl,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refSslListTable,
    deleteSsl,
    revokeSsl,
    downloadSsl,
    downloadSslKey,
    cancelSsl,
    refetchData,
    filterSsl
  }
}
