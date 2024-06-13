import { ref, watch, computed, onBeforeUnmount } from '@vue/composition-api'
import store from '@/store'
import debounce from 'lodash.debounce'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useDomainsList() {
  // Use toast
  const toast = useToast()

  const refDomainListTable = ref(null)
  const domains = ref([])

  // Table Handlers
  const tableColumns = [
    { key: 'domain', label: 'Domain', sortable: true },
    { key: 'dns_name', label: 'DNS', sortable: true },
    { key: 'created_at', label: 'Created at', sortable: true },
    { key: 'brand_name', label: 'Brand', sortable: true },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalDomains = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const brandFilter = ref('')
  const dnsFilter = ref('')

  const dataMeta = computed(() => {
    const localItemsCount = refDomainListTable.value ? refDomainListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalDomains.value,
    }
  })

  const debouncedWatch = debounce(() => {
    refDomainListTable.value.refresh()
  }, 800)

  watch(searchQuery, debouncedWatch)

  const refetchData = () => {
    refDomainListTable.value.refresh()
  }

  watch([currentPage, perPage, brandFilter, dnsFilter], () => {
    refetchData()
  })

  onBeforeUnmount(() => {
    debouncedWatch.cancel()
  })

  const fetchDomains = (ctx, callback) => {
    store
      .dispatch('domain/fetchDomains', {
        per_page: perPage.value,
        page: currentPage.value,
        query: searchQuery.value,
        dns_name: dnsFilter.value,
        brand_name: brandFilter.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response.data

        callback(data)
        totalDomains.value = total
        domains.value = data
      })
      .catch(err => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching domain list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  const deleteDomain = (domainId) => {
    store.dispatch('domain/deleteDomain', { id: domainId })
      .then(response => {
        refDomainListTable.value.refresh()
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
    fetchDomains,
    deleteDomain,
    tableColumns,
    perPage,
    currentPage,
    totalDomains,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refDomainListTable,
    domains,
    brandFilter,
    dnsFilter,

    refetchData,
  }
}
