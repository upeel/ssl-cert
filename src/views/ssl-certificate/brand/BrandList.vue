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
            <b-button
              v-ripple
              variant="primary"
              :to="{ name: 'brand-add'}"
            >
              Add Brand
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
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
            </div>
          </b-col>
        </b-row>
  
      </div>
  
      <b-table
        ref="refBrandListTable"
        :items="fetchBrands"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
        class="position-relative"
      >
        <!-- Column: Actions -->
        <template #cell(actions)="data">
  
          <div class="text-nowrap d-flex align-items-center">
            <b-link :id="`edit-${data.item.id}`" class="action-hover mr-1 text-secondary" :to="{ name: 'brand-edit', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" size="18"/>
              <b-tooltip
                triggers="hover"
                :target="`edit-${data.item.id}`"
                title="Edit"
                :delay="{ show: 500, hide: 50 }"
              />
            </b-link>
            <b-link :id="`del-${data.item.id}`" class="action-hover text-danger" v-b-modal.modalConfirmDelete @click="setId(data.item.id)">
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
              :total-rows="totalBrands"
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
        ref="modalConfirmDelete"
        id="modalConfirmDelete"
        centered
        ok-title="Delete"
        ok-variant="danger"
        @ok="confirmDelete"
        title="Are you sure wanna delete this brand?"
      >
      </b-modal>
    </b-card>
  
  </template>
  
  <script>
  import {
    BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
    BBadge, BDropdown, BDropdownItem, BPagination, BTooltip,
  } from 'bootstrap-vue'
  import vSelect from 'vue-select'
  import { onUnmounted } from '@vue/composition-api'
  import store from '@/store'
  import useBrandsList from './useBrandList'
  import Ripple from 'vue-ripple-directive'
  import brandStoreModule from './brandStoreModule'
  
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
  
      vSelect,
    },
    directives: {
      Ripple
    },
    setup() {
      const BRAND_STORE_MODULE_NAME = 'brand'
  
      // Register module
      if (!store.hasModule(BRAND_STORE_MODULE_NAME)) store.registerModule(BRAND_STORE_MODULE_NAME, brandStoreModule)
  
      // UnRegister on leave
      onUnmounted(() => {
        if (store.hasModule(BRAND_STORE_MODULE_NAME)) store.unregisterModule(BRAND_STORE_MODULE_NAME)
      })

      let selectId = null

      const setId = id => {
        selectId = id
      }

      const confirmDelete = () => {
        deleteBrand(selectId)
      }
  
      const {
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
        debounceinput,
        refetchData,
      } = useBrandsList()
  
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
        selectId,
        setId,
        confirmDelete,
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
  