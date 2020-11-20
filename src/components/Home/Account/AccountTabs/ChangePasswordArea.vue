<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="password"
        :counter="library.Bounds.passwordBounds.max"
        :maxlength="library.Bounds.passwordBounds.max"
        label="Ваш старий пароль"
        placeholder="Старий пароль"
        :rules="[library.Auth.validatePassword]"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="() => (showPassword = !showPassword)"
        :type="showPassword ? 'text' : 'password'"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-text-field
        v-model="newPassword"
        :counter="library.Bounds.passwordBounds.max"
        :maxlength="library.Bounds.passwordBounds.max"
        label="Ваш новий пароль"
        placeholder="Новий крутий пароль"
        :rules="[library.Auth.validatePassword]"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="() => (showPassword = !showPassword)"
        :type="showPassword ? 'text' : 'password'"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-text-field
        v-model="newPasswordRepeat"
        :counter="library.Bounds.passwordBounds.max"
        :maxlength="library.Bounds.passwordBounds.max"
        label="Повторіть новий пароль"
        placeholder="Новий крутий пароль"
        :rules="[library.Auth.validateMatchingPasswords(passwordMatch)]"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="() => (showPassword = !showPassword)"
        :type="showPassword ? 'text' : 'password'"
        required
      ></v-text-field>
    </v-col>
  </v-row>

</template>
<script>
    import { Patterns, Bounds, AuthorisationValidation } from '../../../../assets/js/Validation'
export default {

  name: 'ChangePasswordArea',
  data () {
    return {
      library: {
          Patterns, Bounds, Auth: AuthorisationValidation
      },
      password: '',
      newPassword: '',
      newPasswordRepeat: '',
      showPassword: false,
      isLoading: false
    }
  },
  methods: {
    passwords () {
      return {
        password: this.password,
        newPassword: this.newPassword
      }
    },
    validatePasswords () {
      const passOld = this.password.length < 1 ? 'Введіть пароль, який хочете змінити' : this.library.Auth.validatePassword(this.password)
      const passNew = this.newPassword.length < 1 ? 'Введіть новий пароль' : this.library.Auth.validatePassword(this.newPassword)
      const result = (passOld === true) ? ((passNew === true) ? true : passNew) : passOld
      return (result === true) ? (this.passwordMatch ? true : 'Пароль не співпадає') : result
    },
    cleanFields () {
      this.password = ''
      this.newPassword = ''
      this.newPasswordRepeat = ''
    }
  },
  computed: {
    passwordMatch () {
      return this.newPassword === this.newPasswordRepeat
    }
  }
}
</script>
