<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="username"
        label="Введіть старий нік"
        placeholder="Старий нік"
        :rules="[username => isUsernameValid(username)]"
      >
      </v-text-field>
      <v-text-field
        v-model="newUsername"
        label="Введіть новий нік"
        placeholder="Новий крутий нік"
        :rules="[username => isUsernameValid(newUsername)]"
      >
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ChangeUsernameArea',
  data () {
    return {
      username: '',
      newUsername: '',
      usernameBounds: {
        min: 3,
        max: 14
      }
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
      const nameOld = this.username.length >= this.usernameBounds.min ? this.username.length <= this.usernameBounds.max ? true
        : 'Нікнейм задовгий. Максимальна кількість символів: ' + this.usernameBounds.max : 'Нікнейм закороткий. Мінімальна кількість символів: ' + this.usernameBounds.min
      const nameNew = this.newUsername.length >= this.usernameBounds.min ? this.newUsername.length <= this.usernameBounds.max ? true
        : 'Нікнейм задовгий. Максимальна кількість символів: ' + this.usernameBounds.max : 'Нікнейм закороткий. Мінімальна кількість символів: ' + this.usernameBounds.min
      return nameNew !== true ? nameNew : nameOld !== true ? nameOld : true
    },
    cleanFields () {
      this.username = ''
      this.newUsername = ''
    },
    isUsernameValid (username) {
      if (username === '') {
        return true
      } else if (username.length < this.usernameBounds.min) {
        return 'Нікнейм занадто короткий'
      } else if (username.length > this.usernameBounds.max) {
        return 'Нікнейм занадто довгий'
      } else {
        return true
      }
    },
    isActive () {
      return true
    }
  }
}
</script>

<style scoped>

</style>
