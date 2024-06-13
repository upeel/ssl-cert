import { ref, watch, computed, onBeforeUnmount } from '@vue/composition-api'
import store from '@/store'
import debounce from 'lodash.debounce'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useDnsList() {
  // Use toast
  const toast = useToast()

  const refDnsListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'dns_type', label: 'DNS Type', sortable: true },
    { key: 'base_url', label: 'Base URL', sortable: true },
    { key: 'emails', label: "Email" },
    { key: 'teams_url', label: "Teams URL" },
    { key: 'created_at', label: 'Created at', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalDns = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refDnsListTable.value ? refDnsListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalDns.value,
    }
  })

  const debouncedWatch = debounce(() => {
    refDnsListTable.value.refresh()
  }, 800);

  watch(searchQuery, debouncedWatch)

  const refetchData = () => {
    refDnsListTable.value.refresh()
  }

  watch([currentPage, perPage], () => {
    refetchData()
  })

  onBeforeUnmount(() => {
    debouncedWatch.cancel()
  })

  const fetchDns = (ctx, callback) => {
    store
      .dispatch('dns/fetchDns', {
        per_page: perPage.value,
        page: currentPage.value,
        query: searchQuery.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response.data

        callback(data)
        totalDns.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching DNS list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const deleteDns = (dnsId) => {
    store.dispatch('dns/deleteDns', { id: dnsId })
      .then(response => {
        refDnsListTable.value.refresh()
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

  const syncDns = (dnsId) => {
    store.dispatch('dns/syncDns', { id: dnsId })
      .then(response => {
        refDnsListTable.value.refresh()
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
    fetchDns,
    deleteDns,
    tableColumns,
    perPage,
    currentPage,
    totalDns,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refDnsListTable,
    syncDns,
    refetchData,
  }
}
