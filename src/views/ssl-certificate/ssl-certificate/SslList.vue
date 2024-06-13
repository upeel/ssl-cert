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
          md="8"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <label style="align-self: flex-end; margin-bottom: 10px;">Entries</label>
          <v-select
            v-model="perPage"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
          />
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="4"
        >
          <div class="d-flex align-items-center justify-content-end">
            <b-button
              v-ripple
              variant="primary"
              style="white-space: nowrap"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              v-b-modal.filterDate
              class="mr-2"
            >
              Filter by Date
            </b-button>
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      ref="refSslListTable"
      :items="fetchSsl"
      responsive
      :fields="tableColumns"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative ssl-table"
      @row-clicked="viewDetail"
    >

      <template #cell(expired_at)="data">
        <div v-if="data.item.expired_at !== null" class="text-nowrap">
          {{ getFormattedDate(data.item.expired_at) }}
        </div>
        <div v-else>
          -
        </div>
      </template>

      <template #cell(status)="data">
        <div v-if="data.item.status === 'Issued'" class="badge badge-light-success badge-pill">
          {{ data.item.status }}
        </div>
        <div v-if="data.item.status === 'Canceled' || data.item.status === 'Revoked'" class="badge badge-light-warning badge-pill">
          {{ data.item.status }}
        </div>
        <div v-if="data.item.status === 'Draft' || data.item.status === 'Pending Validation'" class="badge badge-light-secondary badge-pill">
          {{  data.item.status }}
        </div>
      </template>

      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div
          class="text-nowrap d-flex align-items-center"
        >
          <b-link
            :id="`download-${data.item.id}`"
            :class="[`action-hover mr-1`, { 'text-success' : data.item.status === 'Issued', 'text-secondary' : data.item.status !== 'Issued' }]"
            :disabled="data.item.status === 'Issued' ? false : true"
            @click="downloadSsl(data.item.id, data.item.domain)"
          >
            <feather-icon icon="DownloadIcon" size="18"/>
            <b-tooltip
              triggers="hover"
              :target="`download-${data.item.id}`"
              title="Download"
              :delay="{ show: 500, hide: 50 }"
            />
          </b-link>
          <b-link
            :id="`downloadkey-${data.item.id}`"
            :class="[`action-hover mr-1`, { 'text-info' : data.item.status === 'Issued', 'text-secondary' : data.item.status !== 'Issued' }]"
            :disabled="data.item.status === 'Issued' ? false : true"
            @click="downloadSslKey(data.item.id, data.item.domain)"
          >
            <feather-icon icon="KeyIcon" size="18"/>
            <b-tooltip
              triggers="hover"
              :target="`downloadkey-${data.item.id}`"
              title="Download Key"
              :delay="{ show: 500, hide: 50 }"
            />
          </b-link>
          <b-link
            v-if="data.item.status === 'Issued'"
            v-b-modal.confirmRevoke
            :id="`revoke-${data.item.id}`"
            class="action-hover mr-1 text-warning"
            @click="setId(data.item.id)"
          >
            <feather-icon icon="RotateCcwIcon" size="18"/>
            <b-tooltip
              triggers="hover"
              :target="`revoke-${data.item.id}`"
              title="Revoke"
              :delay="{ show: 500, hide: 50 }"
            />
          </b-link>
          <b-link
            v-if="data.item.status !== 'Issued'"
            v-b-modal.confirmCancel
            :id="`cancel-${data.item.id}`"
            :class="[`action-hover mr-1`, { 'text-warning' : data.item.status === 'Draft' || data.item.status === 'Pending Validation', 'text-secondary' : data.item.status === 'Expired' || data.item.status === 'Canceled' || data.item.status === 'Revoked' }]"
            :disabled="data.item.status === 'Draft' || data.item.status === 'Pending Validation' ? false : true"
            @click="setId(data.item.id)"
          >
            <feather-icon icon="XCircleIcon" size="18"/>
            <b-tooltip
              triggers="hover"
              :target="`cancel-${data.item.id}`"
              title="Cancel"
              :delay="{ show: 500, hide: 50 }"
            />
          </b-link>
          <b-link
            v-b-modal.confirmDelete
            :id="`del-${data.item.id}`"
            class="action-hover text-danger"
            @click="setId(data.item.id)"
          >
            <feather-icon icon="TrashIcon" size="18" />
            <b-tooltip
              triggers="hover"
              :target="`del-${data.item.id}`"
              title="Delete"
              :delay="{ show: 500, hide: 50 }"
            />
          </b-link>
        </div>
        
      </template>

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
            :total-rows="totalSsl"
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
    <b-modal
      ref="confirmDelete"
      id="confirmDelete"
      centered
      ok-title="Delete"
      ok-variant="danger"
      @ok="confirmDelete"
      title="Are you sure wanna delete this SSL Certificate?"
    >
    </b-modal>

    <b-modal
      ref="confirmRevoke"
      id="confirmRevoke"
      centered
      ok-title="Revoke"
      ok-variant="danger"
      @ok="confirmRevoke"
      title="Are you sure wanna Revoke this SSL Certificate?"
    >
    </b-modal>

    <b-modal
      ref="confirmCancel"
      id="confirmCancel"
      centered
      ok-title="Yes"
      ok-variant="danger"
      @ok="confirmCancel"
      title="Are you sure wanna Cancel this SSL Certificate?"
    >
    </b-modal>

    <b-modal
      ref="filterDate"
      id="filterDate"
      title="Filter by Expiry Date"
    >
      <div class="d-flex" style="justify-content: center; flex-direction: column; align-items: center; gap: 1.25rem">
        <div class="d-flex mt-2" style="align-items: center; gap: 1.25rem">
          <b-button
            v-ripple
            variant="success"
            style="white-space: nowrap"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            :disabled="filterstatus === '7days' ? true : false"
            @click="filter7days()"
          >
            Expire In 7 days
          </b-button>
          <b-button
            v-ripple
            variant="success"
            style="white-space: nowrap"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            :disabled="filterstatus === '14days' ? true : false"
            @click="filter14days()"
          >
            Expire In 14 days
          </b-button>
        </div>
        <div>
          <div>
            Custom
          </div>
          <Datepicker
            show-clear-button
            range
            v-model="dateRange"
            position="right"
            lang="en"
            @change="customFilter()"
          />
        </div>
      </div>
      <template #modal-footer="{ close }">
      <b-button variant="primary" @click="applyFilter()">
        Apply
      </b-button>
      <b-button variant="warning" @click="resetFilter()">
        Reset
      </b-button>
      <b-button variant="secondary" @click="close()">
        Cancel
      </b-button>
    </template>
    </b-modal>
  </b-card>

</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BTooltip, BFormCheckbox, BModal, VBModal
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { onUnmounted, ref } from '@vue/composition-api'
import store from '@/store'
import router from '@/router'
import useSslList from './useSslList'
import moment from 'moment'
import sslStoreModule from './sslStoreModule'
import VueDatepickerUi from 'vue-datepicker-ui'
import 'vue-datepicker-ui/lib/vuedatepickerui.css';

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,
    BFormCheckbox,
    BModal,
    vSelect,
    Datepicker: VueDatepickerUi
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  setup() {
    const SSL_STORE_MODULE_NAME = 'ssl'

    // Register module
    if (!store.hasModule(SSL_STORE_MODULE_NAME)) store.registerModule(SSL_STORE_MODULE_NAME, sslStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(SSL_STORE_MODULE_NAME)) store.unregisterModule(SSL_STORE_MODULE_NAME)
    })

    let selectId = null

    const setId = id => {
      selectId = id
    }

    const confirmRevoke = () => {
      revokeSsl(selectId)
    }

    const confirmDelete = () => {
      deleteSsl(selectId)
    }

    const confirmCancel = () => {
      cancelSsl(selectId)
    }

    const viewDetail = item => {
      router.push({ name: 'ssl-view', params: { id: item.id } })
    }

    const getFormattedDate = date => {
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    }

    const filterDate = ref(null)
    const filterstatus = ref('')
    const today = ref(new Date())
    const start = ref('')
    const end = ref(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000))
    const startDate = ref('')
    const endDate = ref('')

    const dateRange = ref([
      today.value,
      end.value
    ])

    const filter7days = () => {
      end.value = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      // dateRange.value = [
      //   today.value,
      //   end.value
      // ]
      const sYear = today.value.getFullYear()
      const sMonth = (today.value.getMonth() + 1).toString().padStart(2, '0')
      const sDay = today.value.getDate().toString().padStart(2, '0')
      startDate.value = `${sYear}-${sMonth}-${sDay}`
      const eYear = end.value.getFullYear()
      const eMonth = (end.value.getMonth() + 1).toString().padStart(2, '0')
      const eDay = end.value.getDate().toString().padStart(2, '0')
      endDate.value = `${eYear}-${eMonth}-${eDay}`
      filterstatus.value = '7days'
    }

    const filter14days = () => {
      end.value = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
      // dateRange.value = [
      //   today.value,
      //   end.value
      // ]
      const sYear = today.value.getFullYear()
      const sMonth = (today.value.getMonth() + 1).toString().padStart(2, '0')
      const sDay = today.value.getDate().toString().padStart(2, '0')
      startDate.value = `${sYear}-${sMonth}-${sDay}`
      const eYear = end.value.getFullYear()
      const eMonth = (end.value.getMonth() + 1).toString().padStart(2, '0')
      const eDay = end.value.getDate().toString().padStart(2, '0')
      endDate.value = `${eYear}-${eMonth}-${eDay}`
      filterstatus.value = '14days'
    }

    const customFilter = () => {
      start.value = dateRange.value[0]
      end.value = dateRange.value[1]
      const sYear = start.value.getFullYear()
      const sMonth = (start.value.getMonth() + 1).toString().padStart(2, '0')
      const sDay = start.value.getDate().toString().padStart(2, '0')
      startDate.value = `${sYear}-${sMonth}-${sDay}`
      const eYear = end.value.getFullYear()
      const eMonth = (end.value.getMonth() + 1).toString().padStart(2, '0')
      const eDay = end.value.getDate().toString().padStart(2, '0')
      endDate.value = `${eYear}-${eMonth}-${eDay}`
      filterstatus.value = 'custom'
    }

    const applyFilter = () => {
      filterSsl(startDate.value, endDate.value)
      if (filterDate.value) {
        filterDate.value.hide();
      }
    }

    const resetFilter = () => {
      startDate.value = ''
      endDate.value = ''
      filterstatus.value = ''
      filterSsl(startDate.value, endDate.value)
      if (filterDate.value) {
        filterDate.value.hide();
      }
    }

    const {
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
      cancelSsl,
      downloadSsl,
      downloadSslKey,
      refetchData,
      filterSsl
    } = useSslList()

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
      refetchData,
      selectId,
      setId,
      viewDetail,
      confirmDelete,
      getFormattedDate,
      revokeSsl,
      downloadSsl,
      downloadSslKey,
      cancelSsl,
      confirmCancel,
      confirmRevoke,
      dateRange,
      filter7days,
      filter14days,
      customFilter,
      filterSsl,
      applyFilter,
      filterstatus,
      resetFilter,
      filterDate
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

.ssl-table > table > tbody > tr {
  cursor: pointer;
}
</style>
