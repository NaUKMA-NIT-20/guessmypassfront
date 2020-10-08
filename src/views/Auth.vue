<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="4" offset="4">
            <v-expansion-panels :value="getState">
              <v-expansion-panel
                @change="changeState"
                v-for="(item, i) in fields"
                :key="i"
                hover
              >
                <v-expansion-panel-header>
                  {{item.title}}
                </v-expansion-panel-header>
                <v-expansion-panel-content >
                  <v-form class="login" v-if="item.mission ==='login'">
                    <v-container>
                      <v-row>
                        <v-text-field
                          v-model="login.email"
                          type="email"
                          :rules="[email => isEmailValid(email)]"
                          label="Ваш імейл"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="login.password"
                          :counter="passwordBounds.max"
                          :maxlength="passwordBounds.max"
                          label="Ваш пароль"
                          :rules="[pass => isPasswordValid(pass)]"
                          :append-icon="login.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="() => (login.showPassword = !login.showPassword)"
                          :type="login.showPassword ? 'text' : 'password'"
                          required
                        ></v-text-field>
                      </v-row>
                      <v-row>
                        <v-btn @click="toLogin">Ввійти</v-btn>
                      </v-row>
                      <v-snackbar
                        v-model="login.invalid"
                      >
                        {{ login.invalidText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn
                            color="pink"
                            text
                            v-bind="attrs"
                            @click="login.invalid = false"
                          >
                            Закрити
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-container>
                  </v-form>
                  <v-form class="register" v-if="item.mission ==='register'">
                    <v-container>
                      <v-row>
                        <v-text-field
                          v-model="register.email"
                          type="email"
                          :rules="[email => isEmailValid(email)]"
                          label="Ваш імейл"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="register.nickname"
                          type="text"
                          :rules="[nickname => isNicknameValid(nickname)]"
                          label="Ваш нікнейм"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="register.password"
                          :counter="passwordBounds.max"
                          :maxlength="passwordBounds.max"
                          label="Ваш пароль"
                          :rules="[rules.password]"
                          :append-icon="register.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="() => (register.showPassword = !register.showPassword)"
                          :type="register.showPassword ? 'text' : 'password'"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="register.again_password"
                          :counter="passwordBounds.max"
                          :maxlength="passwordBounds.max"
                          label="Повторіть пароль"
                          :rules="[passwordMatch ? true : 'Пароль не співпадає']"
                          :append-icon="register.showAgainPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="() => (register.showAgainPassword = !register.showAgainPassword)"
                          :type="register.showAgainPassword ? 'text' : 'password'"
                          required
                        ></v-text-field>
                      </v-row>
                      <v-row>
                        <v-btn @click="toRegister">Зареєструватися</v-btn>
                      </v-row>
                      <v-snackbar
                        v-model="register.invalid"
                      >
                        {{ register.invalidText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn
                            color="pink"
                            text
                            v-bind="attrs"
                            @click="register.invalid = false"
                          >
                            Закрити
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-container>
                  </v-form>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
// import { mapActions } from 'vuex'
export default {
  name: 'Auth',
  components: {
  },
  data: () => ({
      fields: {
          login: {
              title: 'Логін',
              mission: 'login'
          },
          register: {
              title: 'Реєстрація',
              mission: 'register'
          }
      },
      login: {
          email: '',
          password: '',
          showPassword: false,
          invalid: false,
          invalidText: ''
      },
      register: {
          email: '',
          nickname: '',
          password: '',
          showPassword: false,
          again_password: '',
          showAgainPassword: false,
          invalid: false,
          invalidText: ''
      },
      rules: {
      password: value => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
        const msg = 'Мін. 8 символів і хоча б одна заголовна буква, число'
        return value === '' ? msg : (pattern.test(value) || msg)
        }
      },
      state: 0,
      emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      passwordBounds: { min: 8, max: 120 },
      nicknameBounds: { min: 3, max: 14 }
      }),
  computed: {
      getState () {
          return this.state
      },
      passwordMatch () {
          return this.register.password === this.register.again_password
      }
  },
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
      async toLogin () {
          this.validateLogin()
          await this.$store.dispatch('auth/toLogin',
              { email: this.login.email, hashedPassword: this.login.password })
      },
      toRegister () {
          this.validateRegister()
          if (this.passwordMatch()) {
              ///
          }
      },
      validateLogin () {
          const emailValid = this.isEmailValid(this.login.email)
          const passValid = this.isPasswordValid(this.login.password)
          if (emailValid !== true) {
              this.login.invalidText = emailValid
              this.login.invalid = true
          }
          else if (passValid !== true) {
              this.login.invalidText = passValid
              this.login.invalid = true
          }
          else {
              alert('Ваша пошта: ' + this.login.email + '\nВаш пароль: ' + this.login.password + '.')
          }
      },
      validateRegister () {
          const emailValid = this.isEmailValid(this.register.email)
          const nicknameValid = this.isNicknameValid(this.register.nickname)
          const passValid = this.rules.password(this.register.password)
          const againPassValid = this.passwordMatch
          if (emailValid !== true) {
              this.register.invalidText = emailValid
              this.register.invalid = true
          }
          else if (nicknameValid !== true) {
              this.register.invalidText = nicknameValid
              this.register.invalid = true
          }
          else if (passValid !== true) {
              this.register.invalidText = passValid
              this.register.invalid = true
          }
          else if (againPassValid !== true) {
              this.register.invalidText = 'Паролі не співпадають'
              this.register.invalid = true
          }
          else {
              alert('Акаунт створено.\nВаша пошта: ' + this.register.email + '\nВаш нікнейм: ' + this.register.nickname + '\nВаш пароль: ' + this.register.password + '.')
          }
      }
  },
    beforeMount () {
        if (localStorage.getItem('token') !== null) {
            this.$router.push('/')
        }
    }
}
</script>
<style scoped lang="sass">
  @import "../../src/assets/sass/assets/variables/colors"
  main.v-main
    background: url("../../src/assets/BG.png")
    background-color: $brown
    background-position: center center
    background-size: cover
    display: flex
    align-items: center
  .v-expansion-panel
    border: solid 2px $azure
  .v-expansion-panel-header
    font-size: 1.5rem
    padding: 20px 24px
  .v-expansion-panel + .v-expansion-panel
    margin-top: 20px
  .v-form.login .row button
    margin-top: 50px
    background-color: $azure!important
    width: 100%
    color: white
  .v-form.register .row button
    margin-top: 50px
    background-color: $tangerine!important
    width: 100%
    color: white
  .v-text-field
    font-family: 'Merriweather', serif
  .v-text-field .v-counter
    color: $azure!important
</style>
