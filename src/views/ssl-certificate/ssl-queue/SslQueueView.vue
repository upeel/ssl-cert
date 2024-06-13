<template>
  <section class="content-body-wrapper">
    <b-row>
      <b-link class="d-flex align-items-center mb-2" style="padding-left: 1rem" @click="back">
        <div class="icon-wrapper" style="margin-right: 8px">
          <feather-icon
            icon="ArrowLeftCircleIcon"
            size="24"
          />
        </div>
        Back
      </b-link>
    </b-row>
    <b-row class="invoice-add">

      <b-col
        cols="12"
      >
        <b-card
          no-body
          class="invoice-preview-card"
        >
          <b-card-body class="invoice-padding pb-0">
            <b-row class="mb-1">
              <b-col
                cols="12"
                class="mb-lg-1"
              >
                <!-- <div class="m-2">
                  <b-row>
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

                </div> -->
                <b-table
                  ref="refQueueDetailTable"
                  :items="queueDetail"
                  responsive
                  :fields="tableColumns"
                  primary-key="id"
                  :per-page="perPage" 
                  :current-page="currentPage"
                  :filter="searchQuery"
                  :sort-by.sync="sortBy"
                  show-empty
                  empty-text="No matching records found"
                  :sort-desc.sync="isSortDirDesc"
                  class="position-relative mt-2"
                  @filtered="onFiltered"
                >
                  <template #cell(updated_at)="data">
                    <div v-if="data.item.updated_at !== null" class="text-nowrap">
                      {{ getFormattedDate(data.item.updated_at) }}
                    </div>
                    <div v-else class="text-nowrap">
                      -
                    </div>
                  </template>
                  <template #cell(domain)="data">
                    <b-link :to="{ name: 'ssl-view', params: { id: data.item.ssl_id } }">
                      {{ data.item.domain }}
                    </b-link>
                  </template>
                  <template #cell(status)="data">
                    <div v-if="data.item.status === 'done'" class="badge badge-light-success badge-pill">
                      {{ data.item.status }}
                    </div>
                    <div v-else class="badge badge-light-secondary badge-pill">
                      {{ data.item.status }}
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
                      <!-- <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span> -->
                    </b-col>
                    <!-- Pagination -->
                    <b-col
                      cols="12"
                      sm="6"
                      class="d-flex align-items-center justify-content-center justify-content-sm-end"
                    >

                      <b-pagination
                        v-model="currentPage"
                        :total-rows="totalQueueDetail"
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
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { heightTransition } from '@core/mixins/ui/transition'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import axios from '@axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import moment from 'moment'
import {
  BRow, BCol, BCard, BCardBody, BButton, VBToggle, BLink, BTable, BPagination, BFormInput,
} from 'bootstrap-vue'
import debounce from 'lodash.debounce'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BButton,
    vSelect,
    BLink,
    BTable,
    BPagination,
    BFormInput,
  },
  directives: {
    Ripple,
    'b-toggle': VBToggle,

  },
  mixins: [heightTransition],
  data() {
    return {
      tableColumns: [
        { key: 'domain', sortable: true },
        { key: 'updated_at', label: 'Last Updated', sortable: true },
        { key: 'status', sortable: true },
      ],
      perPage: 10,
      totalQueueDetail: 0,
      currentPage: 1,
      perPageOptions: [10, 25, 50, 100],
      searchQuery: null,
      sortBy: 'id',
      isSortDirDesc: true,
      refQueueDetailTable: null,
      queueDetail: [],
      dataMeta: {
        from: 1,
        to: 1,
        of: 1
      }
    }
  },
  watch: {
    searchQuery: debounce(async function() {
      this.getDetail()
    }, 800),
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/ssl-queue/${this.$route.params.id}`)
        this.queueDetail = response.data.domains
        this.totalQueueDetail = this.queueDetail.length
        this.dataMeta.of = this.totalQueueDetail
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: error.response.data.message,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      }
    },
    getFormattedDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    back() {
      window.history.back()
    },
    onFiltered(filteredItems) {
      this.totalQueueDetail = filteredItems.length;
      this.currentPage = 1;
    }
  }
}
</script>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
</style>
