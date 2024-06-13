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
      <validation-observer
          ref="formRules"
        >
          <b-form @submit.prevent>
            <b-card
              no-body
              class="invoice-preview-card"
            >
              <b-card-body class="invoice-padding pb-0">
                <b-row class="invoice-spacing">
                  <b-col
                    cols="12"
                    md="6"
                    class="mb-lg-1"
                  >
                    <b-form-group
                      label="Brand"
                      label-for="brand"
                    >
                      <v-select
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        input-id="brand"
                        :options="brandOptions"
                        :clearable="true"
                        label="brand_name"
                        @input="val => selectBrand(idx, val)"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col
                    cols="12"
                    md="6"
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
                        label="name"
                        :clearable="true"
                        @input="val => selectDns(idx, val)"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row class="invoice-spacing">
                  <b-col
                    cols="12"
                    md="6"
                    class="mb-lg-1"
                  >
                    <b-form-group
                      label="Domain"
                      label-for="domain"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Domain"
                        rules="required"
                      >
                        <b-form-textarea
                          id="domain"
                          v-model="domain.domain"
                          :state="errors.length > 0 ? false:null"
                          rows="4"
                          placeholder="multiple domains are separated by comma"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row 
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
                      @click="validationFormAddDomain"
                      block
                    >
                      Save
                    </b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-form>
        </validation-observer>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { heightTransition } from '@core/mixins/ui/transition'
import Ripple from 'vue-ripple-directive'
import { required } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import vSelect from 'vue-select'
import axios from '@axios'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import {
  BRow, BCol, BCard, BCardBody, BButton, BForm, BFormGroup, BFormTextarea, BFormInvalidFeedback, VBToggle, BLink,
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
    vSelect,
    BLink,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
    'b-toggle': VBToggle,

  },
  mixins: [heightTransition],
  data() {
    return {
      domain: {
        dns_id: null,
        brand_id: null,
        domain: ''
      },
      dnsOptions: [],
      brandOptions: [],
      required,
    }
  },
  mounted() {
    this.getBrands()
    this.getDns()
  },
  methods: {
    async getBrands() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/brands`)
        this.brandOptions = response.data.data
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
    async getDns() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/dns`)
        this.dnsOptions = response.data.data
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
    validationFormAddDomain() {
      return new Promise((resolve, reject) => {
        this.$refs.formRules.validate().then(success => {
          if (success) {
            this.submitForm()
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    async submitForm() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/domains`, this.domain)
        await this.$router.push({ name: 'domain-list' }, () => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Domain Added Successfully',
              icon: 'CheckIcon',
              variant: 'success',
            },
          })
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
    selectBrand(idx, val) {
      this.domain.brand_id = val.id
    },
    selectDns(idx, val) {
      this.domain.dns_id = val.id
    },
    back() {
      window.history.back()
    }
  }
}
</script>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
</style>
