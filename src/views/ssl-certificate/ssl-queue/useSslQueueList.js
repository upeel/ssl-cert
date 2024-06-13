import { ref, watch, computed, onBeforeUnmount } from '@vue/composition-api'
import store from '@/store'
import debounce from 'lodash.debounce'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useSslQueueList() {
  // Use toast
  const toast = useToast()

  const refSslQueueListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'created_at', label: 'Name', sortable: true },
    { key: 'name', label: 'Created At', sortable: true },
    { key: 'progress', label: 'Progress', sortable: true },
    { key: 'status' },
    { key: 'actions' }
  ]
  const perPage = ref(10)
  const totalSslQueue = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refSslQueueListTable.value ? refSslQueueListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalSslQueue.value,
    }
  })

  const debouncedWatch = debounce(() => {
    refSslQueueListTable.value.refresh()
  }, 800)

  watch(searchQuery, debouncedWatch)

  const refetchData = () => {
    refSslQueueListTable.value.refresh()
  }

  watch([currentPage, perPage, statusFilter], () => {
    refetchData()
  })

  onBeforeUnmount(() => {
    debouncedWatch.cancel()
  })

  const fetchSslQueue = (ctx, callback) => {
    store
      .dispatch('ssl-queue/fetchSsl', {
        per_page: perPage.value,
        page: currentPage.value,
        query: searchQuery.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        status: statusFilter.value,
      })
      .then(response => {
        const { data, total } = response.data

        callback(data)
        totalSslQueue.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching SSL Queue list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const downloadSslQueue = (id, name) => {
    store.dispatch('ssl-queue/downloadSslQueue', { id: id, name: name })
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

  const downloadSslQueueKey = (id, name) => {
    store.dispatch('ssl-queue/downloadSslQueueKey', { id: id, name: name })
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

  const deleteSslQueue = (sslId) => {
    store.dispatch('ssl-queue/deleteSsl', { id: sslId })
      .then(response => {
        refSslQueueListTable.value.refresh()
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
    fetchSslQueue,
    tableColumns,
    perPage,
    currentPage,
    totalSslQueue,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refSslQueueListTable,
    deleteSslQueue,
    refetchData,
    downloadSslQueue,
    downloadSslQueueKey,
  }
}
