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
          <b-form
            @submit.prevent
          >
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
                    <validation-provider
                      #default="{ errors }"
                      name="Brand Name"
                      rules="required"
                    >
                      <b-form-group
                        label="Brand Name"
                        label-for="brand-name"
                      >
                        <b-form-input
                          id="brand-name"
                          v-model="brand.brand_name"
                          :state="errors.length > 0 ? false:null"
                          type="text"
                          class="mb-2"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                  <b-col
                    cols="12"
                    md="6"
                    class="mb-lg-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Brand Code"
                      rules="required"
                    >
                      <b-form-group
                        label="Brand Code"
                        label-for="brand-code"
                      >
                        <b-form-input
                          id="brand-code"
                          v-model="brand.brand_code"
                          :state="errors.length > 0 ? false:null"
                          type="text"
                          class="mb-2"
                        />
                        <b-form-invalid-feedback>
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
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
                      @click="validationFormEditBrand"
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
      brand: {},
      required,
    }
  },
  mounted() {
    this.getBrand()
  },
  methods: {
    async getBrand() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/brands/${this.$route.params.id}`)
        this.brand = response.data
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
    validationFormEditBrand() {
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
        const res = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/api/brands/${this.$route.params.id}`, this.brand)
        await this.$router.push({ name: 'brand-list' }, () => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Brand Updated Successfully',
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
