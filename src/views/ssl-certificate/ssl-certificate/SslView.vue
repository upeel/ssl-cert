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
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  Domain:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  {{ ssl.domain.replace(/,/g, ', ') }}
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  DNS Name:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  {{ ssl.dns_name }} 
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  Brand Name:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  {{ ssl.brand_name }}
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  Expired At:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div v-if="ssl.expired_at !== null">
                  {{ getFormattedDate(ssl.expired_at) }}
                </div>
                <div v-else>
                  -
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  Issuer:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div v-if="ssl.issuer !== null">
                  {{ ssl.issuer }}
                </div>
                <div v-else>
                  -
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  Issuer_cn:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div v-if="ssl.issuer_cn !== null">
                  {{ ssl.issuer_cn }}
                </div>
                <div v-else>
                  -
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  Validation Type:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div v-if="ssl.validation_type !== null">
                  {{ ssl.validation_type }}
                </div>
                <div v-else>
                  -
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  Validation Content:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div v-if="ssl.validation_content !== null">
                  {{ ssl.validation_content }}
                </div>
                <div v-else>
                  -
                </div>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div class="">
                  Status:
                </div>
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="mb-lg-1"
              >
                <div v-if="ssl.status === 'Issued'" class="badge badge-light-success badge-pill">
                  {{ ssl.status }}
                </div>
                <div v-else class="badge badge-light-secondary badge-pill">
                  {{ ssl.status }}
                </div>
              </b-col>
            </b-row>
            <!-- <b-row 
              class="mb-2"
              style="justify-content: flex-end;"
            >
              <b-col
                cols="12"
                md="4"
                lg="3"
                xl="2"
                class="mb-lg-1"
              >
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="primary"
                  @click="validateSsl"
                  block
                >
                  Validate
                </b-button>
              </b-col>
            </b-row> -->
          </b-card-body>
        </b-card>
        <b-card>
          <div class="">
            <b-row>
              <b-col
                cols="12"
              >
                <h4 class="mb-2">
                  Activity Log
                </h4>
              </b-col>
            </b-row>
            <!-- <b-row>
              <b-col cols="12" md="9">
                <label>Entries</label>
                <v-select
                  v-model="perPage"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="perPageOptions"
                  :clearable="false"
                  class="per-page-selector d-inline-block ml-50 mr-1"
                />
              </b-col>
              <b-col cols="12" md="3">
                <div class="d-flex align-items-center justify-content-end">
                  <b-form-input
                    v-model="searchQuery"
                    class="mb-1"
                    placeholder="Search..."
                  />
                </div>
              </b-col>
            </b-row> -->
          </div>
          <b-table
            ref="refActivityLogTable"
            :items="activityLog"
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
            class="position-relative"
            @filtered="onFiltered"
          >
            <template #cell(created_at)="data">
              {{ getFormattedDate(data.item.created_at) }}
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
              <b-col
                cols="12"
                sm="6"
                class="d-flex align-items-center justify-content-center justify-content-sm-end"
              >

                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalLog"
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
  BRow, BCol, BCard, BCardBody, BButton, BForm, BFormGroup, BFormTextarea, BFormInvalidFeedback, VBToggle, BLink, BTable, BPagination, BFormInput
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BButton,
    BForm,
    BFormTextarea,
    BFormInvalidFeedback,
    BFormGroup,
    BFormInput,
    vSelect,
    BLink,
    BTable,
    BPagination,
  },
  directives: {
    Ripple,
    'b-toggle': VBToggle,

  },
  mixins: [heightTransition],
  data() {
    return {
      ssl: {},
      tableColumns: [
        { key: 'created_at', label: 'Created At', sortable: true, tdClass: 'no-whitespace' },
        { key: 'info', label: 'Activity Log', sortable: true },
        // { key: 'updated_at', label: 'Updated At', sortable: true, tdClass: 'no-whitespace' }
      ],
      perPage: 10,
      totalLog: 0,
      currentPage: 1,
      perPageOptions: [10, 25, 50, 100],
      searchQuery: null,
      sortBy: 'id',
      isSortDirDesc: true,
      refActivityLogTable: null,
      activityLog: [],
      dataMeta: {
        from: 1,
        to: 1,
        of: 1
      }
    }
  },
  mounted() {
    this.getSsl()
  },
  methods: {
    async getSsl() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/ssl/${this.$route.params.id}`)
        this.ssl = response.data
        this.activityLog = this.ssl.activity_log
        this.totalLog = this.activityLog.length
        this.dataMeta.of = this.totalLog
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
    async validateSsl() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/ssl/${this.ssl.id}/validate`)

        this.$toast({
          component: ToastificationContent,
          props: {
            title: response.data.message,
            icon: 'CheckIcon',
            variant: 'success',
          },
        })
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
    back() {
      window.history.back()
    },
    onFiltered(filteredItems) {
      this.totalLog = filteredItems.length;
      this.currentPage = 1;
    }
  }
}
</script>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
</style>
