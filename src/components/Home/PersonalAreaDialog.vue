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
          <account-tabs :updating="states.tabs"></account-tabs>
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
          @click="closeDialog"
        >
          Зберегти
        </v-btn>
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
          closeDialog () {
              this.states.tabs = !this.states.tabs
              this.$emit('close')
          }
      }
  }
</script>
<style lang="sass" scoped>
  @import "../../../src/assets/sass/assets/variables/colors"
  .v-text-field .v-counter
    color: $azure!important
  .v-text-field
    font-family: 'Merriweather', serif
  .v-form .row button
    margin-top: 50px
    background-color: $azure!important
    width: 100%
    color: white
</style>
