<template>
  <v-card elevation="0">
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab @click="setActivePasswordTab">
        Зміна паролю
      </v-tab>
      <v-tab
        @click="setActiveUsernameTab">
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
            <change-password-area
              ref="passwordTab"
            ></change-password-area>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          color="basil"
          flat
        >
          <v-card-text>
            <change-username-area ref="usernameTab"></change-username-area>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import ChangePasswordArea from './AccountTabs/ChangePasswordArea.vue'
import ChangeUsernameArea from './AccountTabs/ChangeUsernameArea.vue'

export default {
  name: 'AccountTabs',
  components: {
    ChangePasswordArea,
    ChangeUsernameArea
  },
  data () {
    return {
      tab: null,
      activePasswordTab: true
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
    validateUsernames () {
      return this.$refs.usernameTab.validateUsernames()
    },
    cleanFields () {
      this.$refs.passwordTab.cleanFields()
      if (this.$refs.usernameTab !== undefined) {
        this.$refs.usernameTab.cleanFields()
      }
    },
    getUsernames () {
      return this.$refs.usernameTab.usernames()
    },
    isUsernameTabActive () {
      return this.$refs.usernameTab.isActive()
    },
    isPasswordTabActive () {
      return this.activePasswordTab
    },
    setActivePasswordTab () {
      this.activePasswordTab = true
    },
    setActiveUsernameTab () {
      this.activePasswordTab = false
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
