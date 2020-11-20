<template>
  <v-form class="login">
    <v-container>
      <v-row>
        <v-text-field
          v-model="email"
          type="email"
          :rules="[library.Auth.validateEmail]"
          label="Ваш імейл"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="password"
          :counter="library.Bounds.passwordBounds.max"
          :maxlength="library.Bounds.passwordBounds.max"
          label="Ваш пароль"
          :rules="[library.Auth.validatePassword]"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="() => (showPassword = !showPassword)"
          :type="showPassword ? 'text' : 'password'"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-btn
          @click="toLogin"
          :loading="isLoading"
        >Ввійти
        </v-btn>
      </v-row>
      <v-snackbar
        v-model="invalid"
      >
        {{ invalidText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="invalid = false"
          >
            Закрити
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-form>
</template>
<script>
  import { Patterns, Bounds, AuthorisationValidation, helperFunction } from '../assets/js/Validation'
  import { encryptingFunctions } from '../assets/js/Cryptor'

  export default {
  name: 'LoginForm',
  data: () => ({
    library: {
        Patterns, Bounds, Auth: AuthorisationValidation
    },
    email: '',
    password: '',
    showPassword: false,
    invalid: false,
    invalidText: '',
    isLoading: false
  }),
  methods: {
    async toLogin () {
      this.validateLogin()
      if (!this.invalid) {
        this.isLoading = true
        const loginData = {
            email: this.email,
            password: this.password
        }
        this.$store.dispatch('auth/toLogin',
          encryptingFunctions.encryptLogin(loginData))
          .then((user) => {
            this.isLoading = false
            console.log(user)
          })
          .catch((error) => {
            this.isLoading = false
            this.invalidText = helperFunction.checkLoginError(error)
            this.invalid = true
          })
      }
    },
    validateLogin () {
      const emailValid = this.library.Auth.validateEmail(this.email)
      const passValid = this.library.Auth.validatePassword(this.password)
      const emailInstructions = this.library.Auth.getEmailInstructions(this.email, emailValid)
      const passwordInstructions = this.library.Auth.getPasswordInstructions(this.password, passValid)
        if (emailInstructions.invalid) {
          this.invalid = emailInstructions.invalid
          this.invalidText = emailInstructions.message
      } else if (passwordInstructions.invalid) {
            this.invalid = passwordInstructions.invalid
            this.invalidText = passwordInstructions.message
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import "../../src/assets/sass/assets/variables/colors"
.v-text-field .v-counter
  color: $azure !important

.v-text-field
  font-family: 'Merriweather', serif

.v-form.login .row button
  margin-top: 50px
  background-color: $azure !important
  width: 100%
  color: white
</style>
