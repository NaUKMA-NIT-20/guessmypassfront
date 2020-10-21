<template>
  <v-form class="login">
    <v-container>
      <v-row>
        <v-text-field
          v-model="email"
          type="email"
          :rules="[email => isEmailValid(email)]"
          label="Ваш імейл"
          required
        ></v-text-field></v-row>
      <v-row><v-text-field
          v-model="password"
          :counter="passwordBounds.max"
          :maxlength="passwordBounds.max"
          label="Ваш пароль"
          :rules="[rules.password]"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="() => (showPassword = !showPassword)"
          :type="showPassword ? 'text' : 'password'"
          required
        ></v-text-field></v-row>
      <v-row>
        <v-btn @click="toLogin">Ввійти</v-btn>
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
  export default {
      name: 'LoginForm',
      data: () => ({
          email: '',
          password: '',
          showPassword: false,
          invalid: false,
          invalidText: '',
          rules: {
              password: value => {
                  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
                  const msg = 'Мін. 8 символів і хоча б одна заголовна буква, число'
                  return value === '' ? msg : (pattern.test(value) || msg)
              }
          },
          emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
          passwordBounds: { min: 8, max: 120 }
      }),
      methods: {
          isEmailValid (email) {
              if (email === '') return 'Введіть пошту'
              else if (!this.emailRegex.test(email)) return 'Неправильна пошта'
              else return true
          },
          isPasswordValid (password) {
              if (password === '') return 'Введіть пароль'
              else if (password.length < this.passwordBounds.min) return 'Пароль занадто короткий'
              else return true
          },
          async toLogin () {
              this.validateLogin()
              if (!this.invalid) {
                  await this.$store.dispatch('auth/toLogin',
                      { email: this.email, hashedPassword: this.password })
              }
          },
          validateLogin () {
              const emailValid = this.isEmailValid(this.email)
              const passValid = this.isPasswordValid(this.password)
              if (emailValid !== true) {
                  this.invalidText = emailValid
                  this.invalid = true
              }
              else if (passValid !== true) {
                  this.invalidText = passValid
                  this.invalid = true
              }
              else {
                  alert('Ваша пошта: ' + this.email + '\nВаш пароль: ' + this.password + '.')
              }
          }
          }

      }
</script>
<style lang="sass" scoped>
  @import "../../src/assets/sass/assets/variables/colors"
  .v-text-field .v-counter
    color: $azure!important
  .v-text-field
    font-family: 'Merriweather', serif
  .v-form.login .row button
    margin-top: 50px
    background-color: $azure!important
    width: 100%
    color: white
</style>
