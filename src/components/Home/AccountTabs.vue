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
        @click="setActiveNicknameTab">
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
            <change-nickname-area ref="nicknameTab"></change-nickname-area>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import ChangePasswordArea from './AccountTabs/ChangePasswordArea'
import ChangeNicknameArea from './AccountTabs/ChangeNicknameArea'

export default {
  name: 'AccountTabs',
  components: {
    ChangePasswordArea,
    ChangeNicknameArea
  },
  data () {
    return {
      tab: null,
      activePasswordTab: true,
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
      if (this.$refs.nicknameTab !== undefined) {
        this.$refs.nicknameTab.cleanFields()
      }
    },
    getNickname () {
      this.$refs.nicknameTab.getNickname()
    },
    isNicknameTabActive () {
      return this.$refs.nicknameTab.isActive()
    },
    isPasswordTabActive () {
      return this.activePasswordTab
    },
    setActivePasswordTab () {
      this.activePasswordTab = true
    },
    setActiveNicknameTab () {
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
