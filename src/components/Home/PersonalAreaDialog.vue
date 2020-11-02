<template>
  <v-dialog
    :retain-focus="false"
    v-model="state"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Особистий кабінет</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <account-tabs :updating="states.tabs" ref="tabs"></account-tabs>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="closeDialog"
        >
          Закрити
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="saveChanges"
          :loading="saveLoading"
        >
          Зберегти
        </v-btn>
        <v-snackbar
          v-model="invalid">
          {{ invalidText }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="invalid = false">
              Закрити
            </v-btn>
          </template>
        </v-snackbar>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import AccountTabs from './AccountTabs.vue'

export default {
  name: 'PersonalAreaDialog',
  data () {
    return {
      saveLoading: false,
      invalid: false,
      invalidText: '',
      states: {
        tabs: false
      }
    }
  },
  components: {
    AccountTabs
  },
  props: {
    state: Boolean
  },
  methods: {
    saveChanges () {
      if (this.$refs.tabs.isPasswordTabActive()) {
        this.validatePasswords()
        if (!this.invalid) {
          this.saveLoading = true
          const tabData = this.$refs.tabs.getPasswords()
          this.$store.dispatch('auth/changePassword', tabData)
            .then((response) => {
              this.saveLoading = false
              this.$refs.tabs.cleanFields()
              console.log('Success ' + response)
              this.states.tabs = !this.states.tabs
              this.$emit('updatedPassword')
              this.$store.dispatch('auth/toLogout')
            })
            .catch((error) => {
              this.saveLoading = false
              console.log(error)
              switch (error.status) {
                case 400:
                  this.invalidText = 'Неправильний пароль :/'
                  break
                case 401:
                  this.invalidText = 'Користувач не аутентифікований :/'
                  break
                case 500:
                  this.invalidText = 'Помилка сервера. Спробуйте пізніше:/'
                  break
                default:
                  this.invalidText = 'Незнайома помилка ¯\\_(ツ)_/¯'
              }
              this.invalid = true
            })
        }
      } else {
        this.validateUsernames()
        if (!this.invalid) {
          this.saveLoading = true
          const tabData = this.$refs.tabs.getUsernames()
          this.$store.dispatch('auth/changeUsername', tabData)
            .then((response) => {
              this.saveLoading = false
              this.$refs.tabs.cleanFields()
              console.log('Success ' + response)
              this.states.tabs = !this.states.tabs
              this.$emit('updatedUsername')
            })
            .catch((error) => {
              this.saveLoading = false
              console.log(error)
              switch (error.status) {
                case 400:
                  this.invalidText = 'Неправильний старий нік'
                  break
                case 401:
                  this.invalidText = 'Користувач не аутентифікований :/'
                  break
                case 409:
                  this.invalidText = 'Користувач з таким ніком вже існує:/'
                  break
                case 500:
                  this.invalidText = 'Помилка сервера. Спробуйте пізніше:/'
                  break
                default:
                  this.invalidText = 'Незнайома помилка ¯\\_(ツ)_/¯'
              }
              this.invalid = true
            })
        }
      }
    },
    validatePasswords () {
      const passwordsValid = this.$refs.tabs.validatePasswords()
      if (passwordsValid !== true) {
        this.invalidText = passwordsValid
        this.invalid = true
      }
    },
    validateUsernames () {
      const usernamesValid = this.$refs.tabs.validateUsernames()
      if (usernamesValid !== true) {
        this.invalidText = usernamesValid
        this.invalid = true
      }
    },
    closeDialog () {
      this.states.tabs = !this.states.tabs
      this.$refs.tabs.cleanFields()
      this.$emit('close')
    }
  }
}
</script>
<style lang="sass" scoped>
@import "../../../src/assets/sass/assets/variables/colors"
.v-text-field .v-counter
  color: $azure !important

.v-text-field
  font-family: 'Merriweather', serif

.v-form .row button
  margin-top: 50px
  background-color: $azure !important
  width: 100%
  color: white
</style>
