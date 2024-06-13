<template>

  <!-- Table Container Card -->
  <b-card
    no-body
    class="content-body-wrapper"
  >

    <div class="m-2">

      <!-- Table Top -->
      <b-row>

        <!-- Per Page -->
        <b-col
          cols="12"
          md="9"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          
          <!-- <b-button
            v-ripple
            variant="primary"
            :to="{ name: 'domain-add'}"
            class="mr-1"
          >
            Add Domain
          </b-button>
          <b-button
            v-ripple
            variant="info"
            style="white-space: nowrap"
            class="mr-1"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-modal.modalBulkUpdate
          >
            Bulk Update
          </b-button>
          <b-button
            v-ripple
            variant="danger"
            style="white-space: nowrap"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-modal.modalConfirmDelete
            class="mr-1"
          >
            Bulk Delete
          </b-button> -->
          <b-button
            v-ripple
            variant="success"
            style="white-space: nowrap"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-modal.modalGenerateSsl
          >
            Generate SSL
          </b-button>
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="3"
        >
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchQuery"
              placeholder="Search..."
            />
          </div>
        </b-col>
        <b-col
          cols="12"
          md="8"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <div class="mr-2 mt-2">
            <b-form-checkbox
              :checked="selectAll"
              :indeterminate="isSelectAllIndeterminate"
              @change="selectAllUpdate"
              class=""
              style="align-self: flex-end; margin-bottom: 10px;"
            >
              Select All
            </b-form-checkbox>
            <p>
              {{ totalSelected }} selected
            </p>
          </div>

          <label style="align-self: flex-end; margin-bottom: 10px;">Entries</label>
          <v-select
            v-model="perPage"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
            style="align-self: flex-end;"
          />
        </b-col>
        <b-col
          cols="12"
          md="4"
          style="margin-left: auto; display: flex; justify-content: space-between; margin-top: 8px"
        >
          <div
            style="width: 48%"
          >
            <label class="mr-1">Brand</label>
            <v-select
              v-model="brandFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              input-id="brandFilter"
              :options="brandOptionsFilter"
              :clearable="true"
              class="d-inline-block mr-1"
              label="name"
              style="width: 100%"
            />
          </div>
          <div
            style="width: 48%"
          >
            <label class="mr-1">DNS</label>
            <v-select
              v-model="dnsFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              input-id="dnsFilter"
              :options="dnsOptionsFilter"
              :clearable="true"
              class="d-inline-block"
              label="name"
              style="width: 100%"
            />
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      ref="refDomainListTable"
      :items="fetchDomains"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
      
      <!-- Column: Chckbox -->
      <template #cell(domain)="data">
        <div class="d-flex align-items-center">
          <b-form-checkbox
          class="mr-2"
            :checked="selectedRow.includes(data.item.domain)"
            @change="toggleSelectedRow(data.item.domain)"
            @click.native.stop
          >
          </b-form-checkbox>
          <div>
            {{ data.item.domain }}
          </div>
        </div>
      </template>

      <template #cell(created_at)="data">
        <div v-if="data.item.created_at !== null" class="text-nowrap">
          {{ getFormattedDate(data.item.created_at) }}
        </div>
        <div v-else>
          -
        </div>
      </template>
      <!-- Column: Actions -->
      <!-- <template #cell(actions)="data">

        <div class="text-nowrap d-flex align-items-center">
          <b-link :id="`edit-${data.item.id}`" class="action-hover mr-1 text-secondary" :to="{ name: 'domain-edit', params: { id: data.item.id } }">
            <feather-icon icon="EditIcon" size="18"/>
            <b-tooltip
              triggers="hover"
              :target="`edit-${data.item.id}`"
              title="Edit"
              :delay="{ show: 500, hide: 50 }"
            />
          </b-link>
          <b-link :id="`del-${data.item.id}`" class="action-hover text-danger" v-b-modal.confirmDelete @click="setId(data.item.id)">
            <feather-icon icon="TrashIcon" size="18" />
            <b-tooltip
              triggers="hover"
              :target="`del-${data.item.id}`"
              title="Delete"
              :delay="{ show: 500, hide: 50 }"
            />
          </b-link>
        </div>
      </template> -->

    </b-table>
    <div class="mx-2 mb-2">
      <b-row>

        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >

          <b-pagination
            v-model="currentPage"
            :total-rows="totalDomains"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                icon="ChevronLeftIcon"
                size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                icon="ChevronRightIcon"
                size="18"
              />
            </template>
          </b-pagination>

        </b-col>

      </b-row>
    </div>
    <!-- <b-modal
      id="modalBulkUpdate"
      centered
      size="lg"
      ok-title="Update"
      title="Batch Update Domains"
      @ok="bulkUpdate"
      :no-close-on-backdrop="true"
    >
      <b-row class="invoice-spacing">
        <b-col
          cols="12"
          sm="6"
          class="mb-lg-1"
        >
          <b-form-group
            label="Brand"
            label-for="brand"
          >
            <v-select
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :input-id="`brand`"
              :options="brandOptions"
              :clearable="true"
              label="name"
              @input="val => selectBrand(val)"
            />
          </b-form-group>
        </b-col>
        <b-col
          cols="12"
          sm="6"
          class="mb-lg-1"
        >
          <b-form-group
            label="DNS"
            label-for="dns"
          >
            <v-select
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :input-id="`dns`"
              :options="dnsOptions"
              :clearable="true"
              label="name"
              @input="val => selectDns(val)"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal
      ref="modalConfirmDelete"
      id="modalConfirmDelete"
      centered
      ok-title="Delete"
      ok-variant="danger"
      @ok="bulkDelete"
      title="Are you sure wanna delete these domain?"
    >
    </b-modal>
    <b-modal
      ref="confirmDelete"
      id="confirmDelete"
      centered
      ok-title="Delete"
      ok-variant="danger"
      @ok="confirmDelete"
      title="Are you sure wanna delete this domain?"
    >
    </b-modal> -->
    <b-modal
      ref="modalGenerateSsl"
      id="modalGenerateSsl"
      centered
      ok-title="Generate"
      ok-variant="primary"
      @ok="generateSsl"
      title="Are you sure wanna generate SSL with these domain?"
    >
    </b-modal>
  </b-card>

</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BTooltip, BFormCheckbox, BModal, VBModal, BFormGroup,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { ref, onUnmounted, computed, onMounted } from '@vue/composition-api'
import store from '@/store'
import useDomainsList from './useDomainList'
import Ripple from 'vue-ripple-directive'
import axios from '@axios'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import moment from 'moment'

import domainStoreModule from './domainStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,
    BFormCheckbox,
    BModal,
    BFormGroup,

    vSelect,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  setup() {
    const DOMAIN_STORE_MODULE_NAME = 'domain'

    // Register module
    if (!store.hasModule(DOMAIN_STORE_MODULE_NAME)) store.registerModule(DOMAIN_STORE_MODULE_NAME, domainStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(DOMAIN_STORE_MODULE_NAME)) store.unregisterModule(DOMAIN_STORE_MODULE_NAME)
    })

    const brandOptionsFilter = ref([])
    const dnsOptionsFilter = ref([])
    const brandOptions = ref([])
    const dnsOptions = ref([])
    const toast = useToast()

    const getBrands = async () => {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/brands/`)
        const brandList = response.data.data
        for (let i = 0; i < brandList.length; i++) {
          brandOptionsFilter.value.push(brandList[i].brand_name)
          brandOptions.value.push({
            id: brandList[i].id,
            name: brandList[i].brand_name,
          })
        }
      } catch(error) {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error Retrieving Brands',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      }
    }

    const getDns = async () => {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/dns/`)
        const dnsList = response.data.data
        for (let i = 0; i < dnsList.length; i++) {
          dnsOptionsFilter.value.push(dnsList[i].name)
          dnsOptions.value.push({
            id: dnsList[i].id,
            name: dnsList[i].name,
          })
        }
      } catch(error) {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error Retrieving DNS',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      }
    }

    onMounted(() => {
      getBrands()
      getDns()
    })

    // bind selected row
    const totalSelected = ref(0)
    const selectedRow = ref([])
    const toggleSelectedRow = domain => {
      const rowIndex = selectedRow.value.indexOf(domain)
      if (rowIndex === -1) selectedRow.value.push(domain)
      else selectedRow.value.splice(rowIndex, 1)
      totalSelected.value = selectedRow.value.length
    }
    const selectAll = computed(() => totalDomains && (totalDomains === selectedRow.value.length))
    const isSelectAllIndeterminate = computed(() => Boolean(selectedRow.value.length) && totalDomains !== selectedRow.value.length)
    const selectAllUpdate = val => {
      selectedRow.value = val ? domains.value.map(data => data.domain) : []
      selectedRow.value = [...new Set(selectedRow.value)]
      totalSelected.value = selectedRow.value.length
    }

    // batch delete
    const bulkDelete = () => {
      let domainString = selectedRow.value.toString().trim().replace(/, +/g, ',')
      axios.delete('/api/domains/bulk-delete', {
        data: { domain: domainString }
      })
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
        .catch(error => {
          toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.message,
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        })
        .finally(() => { selectedRow.value = [] })
    }

    // batch update
    let brandId = null
    let dnsId = null
    const selectBrand = val => {
      brandId = val.id
    }
    const selectDns = val => {
      dnsId = val.id
    }
    const bulkUpdate = () => {
      let domainString = selectedRow.value.toString()
      axios.post('/api/domains/bulk-update', {
        domain: domainString,
        dns_id: dnsId,
        brand_id: brandId
      })
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
      .catch(error => {
        toast({
          component: ToastificationContent,
          props: {
            title: error.response.data.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
      .finally(() => { 
        selectedRow.value = []
      })
    }

    const generateSsl = () => {
      let domainString = selectedRow.value.toString()
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/domains/generate-ssl`, {
        domain: domainString,
      })
      .then(response => {
        toast({
          component: ToastificationContent,
          props: {
            title: response.data.message,
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      })
      .catch(error => {
        toast({
          component: ToastificationContent,
          props: {
            title: error.response.data.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
      .finally(() => { 
        selectedRow.value = []
        totalSelected.value = 0
      })
    }

    const checkSslInfo = () => {
      let domainString = selectedRow.value.toString()
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/domains/check-ssl`, {
        domain: domainString,
      })
      .then(response => { 
        toast({
          component: ToastificationContent,
          props: {
            title: response.data.message,
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
      })
      .catch(error => {
        toast({
          component: ToastificationContent,
          props: {
            title: error.response.data.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
      .finally(() => { 
        selectedRow.value = [] 
      })
    }

    let selectId = null

    const setId = id => {
      selectId = id
    }

    const confirmDelete = () => {
      deleteBrand(selectId)
    }

    const getFormattedDate = date => {
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    }

    const {
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
    } = useDomainsList()

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

      // batch manage
      bulkDelete,
      bulkUpdate,
      generateSsl,
      checkSslInfo,

      // row selection
      selectAll,
      isSelectAllIndeterminate,
      selectedRow,
      toggleSelectedRow,
      selectAllUpdate,
      totalSelected,

      // options
      getBrands,
      getDns,
      brandOptions,
      dnsOptions,
      dnsId,
      brandId,
      selectBrand,
      selectDns,

      dnsFilter,
      brandFilter,
      selectId,
      setId,
      confirmDelete,
      refetchData,
      brandOptionsFilter,
      dnsOptionsFilter,
      getFormattedDate,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.invoice-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
