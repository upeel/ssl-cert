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
          <label>Entries</label>
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
          md="3"
        >
          <div class="d-flex align-items-center justify-content-end">
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
      ref="refSslQueueListTable"
      :items="fetchSslQueue"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative ssl-table"
      @row-clicked="viewDetail"
    >
      <template #cell(progress)="data">
        <b-progress v-if="data.item.progress === 100" :max="100" show-progress :value="data.item.progress" variant="success" striped :animated="true"></b-progress>
        <b-progress v-else :max="100" show-progress :value="data.item.progress" variant="warning" striped :animated="true"></b-progress>
      </template>

      <template #cell(status)="data">
        <div v-if="data.item.status === 'completed'" class="badge badge-light-success badge-pill">
          {{ data.item.status }}
        </div>
        <div v-else class="badge badge-light-secondary badge-pill">
          {{ data.item.status }}
        </div>
      </template>

      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div class="text-nowrap d-flex align-items-center">
          <b-link
            :id="`download-${data.item.id}`"
            class="action-hover mr-1 text-success"
            @click="downloadSslQueue(data.item.id, data.item.created_at)"
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
            class="action-hover mr-1 text-info"
            @click="downloadSslQueueKey(data.item.id, data.item.created_at)"
          >
            <feather-icon icon="KeyIcon" size="18"/>
            <b-tooltip
              triggers="hover"
              :target="`downloadkey-${data.item.id}`"
              title="Download Key"
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
            :total-rows="totalSslQueue"
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
  </b-card>

</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BTooltip, BProgress,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { onUnmounted } from '@vue/composition-api'
import store from '@/store'
import router from '@/router'
import useSslQueueList from './useSslQueueList'

import sslQueueStoreModule from './sslQueueStoreModule'

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
    BProgress,
    vSelect,
  },
  setup() {
    const SSL_QUEUE_STORE_MODULE_NAME = 'ssl-queue'

    // Register module
    if (!store.hasModule(SSL_QUEUE_STORE_MODULE_NAME)) store.registerModule(SSL_QUEUE_STORE_MODULE_NAME, sslQueueStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(SSL_QUEUE_STORE_MODULE_NAME)) store.unregisterModule(SSL_QUEUE_STORE_MODULE_NAME)
    })

    const viewDetail = item => {
      router.push({ name: 'ssl-queue-view', params: { id: item.id } })
    }

    // let selectId = null

    // const setId = id => {
    //   selectId = id
    // }

    // const confirmDelete = () => {
    //   deleteSslQueue(selectId)
    // }

    const {
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
      // deleteSslQueue,
      refetchData,
      downloadSslQueue,
      downloadSslQueueKey,
    } = useSslQueueList()

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
      // deleteSslQueue,
      viewDetail,
      // selectId,
      // setId,
      // confirmDelete,
      refetchData,
      downloadSslQueue,
      downloadSslQueueKey,
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
