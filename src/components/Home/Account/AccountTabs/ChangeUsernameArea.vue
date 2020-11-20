<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="username"
        label="Введіть старий нік"
        placeholder="Старий нік"
        :rules="[library.Auth.validateUsername]"
      >
      </v-text-field>
      <v-text-field
        v-model="newUsername"
        label="Введіть новий нік"
        placeholder="Новий крутий нік"
        :rules="[library.Auth.validateUsername]"
      >
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
    import { Patterns, Bounds, AuthorisationValidation } from '../../../../assets/js/Validation'
export default {
  name: 'ChangeUsernameArea',
  data () {
    return {
        library: {
            Patterns, Bounds, Auth: AuthorisationValidation
        },
      username: '',
      newUsername: ''
    }
  },
  props: {
    updating: Boolean
  },
  methods: {
    usernames () {
      return {
        username: this.username,
        newUsername: this.newUsername
      }
    },
    validateUsernames () {
      const validatorOld = this.library.Auth.validateUsername(this.username)
      const validatorNew = this.library.Auth.validateUsername(this.newUsername)
      const oldInstructions = this.library.Auth.getUsernameInstructions(this.username, validatorOld)
      const newIntstructions = this.library.Auth.getUsernameInstructions(this.newUsername, validatorNew)
      let msg = ''
      if (oldInstructions.invalid) msg += oldInstructions.message + ' '
      if (newIntstructions.invalid) msg += newIntstructions.message
      if (msg === '') return true
      return msg
    },
    cleanFields () {
      this.username = ''
      this.newUsername = ''
    },
    isActive () {
      return true
    }
  }
}
</script>

<style scoped>

</style>
