<template>
  <v-card elevation="0">
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab>
        Зміна паролю
      </v-tab>
      <v-tab>
        Зміна нікнейму
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card
          color="basil"
          flat
        >
          <v-card-text>
            <change-password-area ref="passwordTab"></change-password-area>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          color="basil"
          flat
        >
          <v-card-text>CheerUp</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
  import ChangePasswordArea from './AccountTabs/ChangePasswordArea'
  export default {
      name: 'AccountTabs',
      components: {
          ChangePasswordArea
      },
      data () {
          return {
              tab: null,
              items: [
                  'Appetizers', 'Entrees', 'Deserts', 'Cocktails'
              ],
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          }
      },
      props: {
          updating: Boolean
      },
      methods: {
         getPasswords () {
           return this.$refs.passwordTab.passwords()
         },
         validatePasswords () {
           return this.$refs.passwordTab.validatePasswords()
         },
         cleanFields () {
           this.$refs.passwordTab.cleanFields()
         }
      },
      watch: {
          updating: function (newVal, oldVal) {
              this.tab = null
          }
      }
  }
</script>
<style>

</style>
