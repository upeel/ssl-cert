import { ref, watch, computed, onBeforeUnmount } from '@vue/composition-api'
import store from '@/store'
import debounce from 'lodash.debounce'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useBrandsList() {
  // Use toast
  const toast = useToast()

  const refBrandListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'brand_name', label: 'Brand Name', sortable: true },
    { key: 'brand_code', label: 'Brand Code', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalBrands = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refBrandListTable.value ? refBrandListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalBrands.value,
    }
  })

  const debouncedWatch = debounce(() => {
    refBrandListTable.value.refresh()
  }, 800);

  watch(searchQuery, debouncedWatch)

  const refetchData = () => {
    refBrandListTable.value.refresh()
  }

  watch([currentPage, perPage], () => {
    refetchData()
  })

  onBeforeUnmount(() => {
    debouncedWatch.cancel()
  })

  const fetchBrands = (ctx, callback) => {
    store
      .dispatch('brand/fetchBrands', {
        per_page: perPage.value,
        page: currentPage.value,
        query: searchQuery.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { data, total } = response.data

        callback(data)
        totalBrands.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching brand list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }
  
  const deleteBrand = (brandId) => {
    store.dispatch('brand/deleteBrand', { id: brandId })
      .then(response => {
        refBrandListTable.value.refresh()
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
    fetchBrands,
    deleteBrand,
    tableColumns,
    perPage,
    currentPage,
    totalBrands,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refBrandListTable,

    refetchData,
  }
}
