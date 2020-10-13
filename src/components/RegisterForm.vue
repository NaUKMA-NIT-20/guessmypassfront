<template>
  <v-form class="register">
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
          v-model="nickname"
          type="text"
          :rules="[nickname => isNicknameValid(nickname)]"
          label="Ваш нікнейм"
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
      <v-row><v-text-field
          v-model="again_password"
          :counter="passwordBounds.max"
          :maxlength="passwordBounds.max"
          label="Повторіть пароль"
          :rules="[passwordMatch ? true : 'Пароль не співпадає']"
          :append-icon="showAgainPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="() => (showAgainPassword = !showAgainPassword)"
          :type="showAgainPassword ? 'text' : 'password'"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-btn @click="toRegister">Зареєструватися</v-btn>
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
      name: 'RegisterForm',
      data: () => ({
          email: '',
          nickname: '',
          password: '',
          showPassword: false,
          again_password: '',
          showAgainPassword: false,
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
          passwordBounds: { min: 8, max: 120 },
          nicknameBounds: { min: 3, max: 14 }
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
          isNicknameValid (nickname) {
              if (nickname === '') return 'Введіть нікнейм'
              else if (nickname.length < this.nicknameBounds.min) return 'Нікнейм занадто короткий'
              else if (nickname.length > this.nicknameBounds.max) return 'Нікнейм занадто довгий'
              else return true
          },
          changeState () {
              if (this.state === 0) this.state = 1
              else if (this.state === 1) this.state = 0
          },
          async toRegister () {
              this.validateRegister()
              if (this.passwordMatch && !this.invalid) {
                  await this.$store.dispatch('auth/toRegister',
                      { email: this.email, hashedPassword: this.password, username: this.nickname, passwordHelp: 'something' })
              }
          },
          validateRegister () {
              const emailValid = this.isEmailValid(this.email)
              const nicknameValid = this.isNicknameValid(this.nickname)
              const passValid = this.rules.password(this.password)
              const againPassValid = this.passwordMatch
              if (emailValid !== true) {
                  this.invalidText = emailValid
                  this.invalid = true
              }
              else if (nicknameValid !== true) {
                  this.invalidText = nicknameValid
                  this.invalid = true
              }
              else if (passValid !== true) {
                  this.invalidText = passValid
                  this.invalid = true
              }
              else if (againPassValid !== true) {
                  this.invalidText = 'Паролі не співпадають'
                  this.invalid = true
              }
              else {
                  alert('Акаунт створено.\nВаша пошта: ' + this.email + '\nВаш нікнейм: ' + this.nickname + '\nВаш пароль: ' + this.password + '.')
              }
          }
      },
      computed: {
          passwordMatch () {
              return this.password === this.again_password
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
  .v-form.register .row button
    margin-top: 50px
    background-color: $tangerine!important
    width: 100%
    color: white
</style>