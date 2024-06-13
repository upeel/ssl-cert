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

      <!-- Col: Left (Invoice Container) -->
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
                      label="Name"
                      label-for="dns-name"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="DNS Name"
                        rules="required"
                      >
                        <b-form-input
                          id="dns-name"
                          v-model="dns.name"
                          type="text"
                          :state="errors.length > 0 ? false:null"
                          class="mb-2"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col
                    cols="12"
                    md="6"
                    class="mb-lg-1"
                  >
                  <b-form-group
                      label="API Key"
                      label-for="api-key"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="API Key"
                        rules="required"
                      >
                        <b-form-input
                          id="api-key"
                          v-model="dns.api_key"
                          type="text"
                          :state="errors.length > 0 ? false:null"
                          class="mb-2"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </validation-provider>
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
                      label="API Secret"
                      label-for="api-secret"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="API Secret"
                        rules="required"
                      >
                        <b-form-input
                          id="api-secret"
                          v-model="dns.api_secret"
                          type="text"
                          :state="errors.length > 0 ? false:null"
                          class="mb-2"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col
                    cols="12"
                    md="6"
                    class="mb-lg-1"
                  >
                    <b-form-group
                      label="Base URL"
                      label-for="base-url"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Base URL"
                        rules="required"
                      >
                        <b-form-input
                          id="base-url"
                          v-model="dns.base_url"
                          type="text"
                          :state="errors.length > 0 ? false:null"
                          class="mb-2"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </validation-provider>
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
                      label="Account Name"
                      label-for="account-name"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Account Name"
                        rules="required"
                      >
                        <b-form-input
                          id="account-name"
                          v-model="dns.account_name"
                          type="text"
                          :state="errors.length > 0 ? false:null"
                          class="mb-2"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col
                    cols="12"
                    md="6"
                    class="mb-lg-1"
                  >
                    <b-form-group
                      label="Account Password"
                      label-for="account-pass"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Account Password"
                        rules="required"
                      >
                        <b-form-input
                          id="account-pass"
                          v-model="dns.account_password"
                          type="text"
                          :state="errors.length > 0 ? false:null"
                          class="mb-2"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col
                    cols="12"
                    md="6"
                    class="mb-lg-1"
                  >
                    <b-form-group
                      label="DNS Type"
                      :label-for="`dns-type`"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="DNS Type"
                        rules="required"
                      >
                        <v-select
                          :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                          v-model="dns.dns_type"
                          :options="['DNSPOD', 'DNSCOM' ]"
                          :input-id="`dns-type`"
                          :clearable="false"
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
                      @click="validationFormEditDns"
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
  BRow, BCol, BCard, BCardBody, BButton, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, VBToggle, BLink,
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BButton,
    BForm,
    BFormInput,
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
      dns: {},
      required,
    }
  },
  mounted() {
    this.getDns()
  },
  methods: {
    async getDns() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/dns/${this.$route.params.id}`)
        this.dns = response.data
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
    validationFormEditDns() {
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
        const res = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/api/dns/${this.$route.params.id}`, this.dns)
        await this.$router.push({ name: 'dns-list' }, () => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'DNS Updated Successfully',
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
    back() {
      window.history.back()
    }
  }
}
</script>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
</style>
