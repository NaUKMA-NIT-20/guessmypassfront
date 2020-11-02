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
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="password"
          :counter="passwordBounds.max"
          :maxlength="passwordBounds.max"
          label="Ваш пароль"
          :rules="[rules.password]"
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
export default {
  name: 'LoginForm',
  data: () => ({
    email: '',
    password: '',
    showPassword: false,
    invalid: false,
    invalidText: '',
    isLoading: false,
    rules: {
      password: value => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
        const msg = 'Мін. 8 символів і хоча б одна заголовна буква, число'
        return value !== '' ? (pattern.test(value) || msg) : true
      }
    },
    emailRegex: /\b[\w\\.-]+@[\w\\.-]+\.\w{2,4}\b/,
    passwordBounds: {
      min: 8,
      max: 120
    }
  }),
  methods: {
    isEmailValid (email) {
      if (email === '') {
        return true
      } else if (!this.emailRegex.test(email)) {
        return 'Неправильна пошта'
      } else {
        return true
      }
    },
    async toLogin () {
      this.validateLogin()
      if (!this.invalid) {
        this.isLoading = true
        this.$store.dispatch('auth/toLogin',
          {
            email: this.email,
            password: this.password
          })
          .then((user) => {
            this.isLoading = false
            console.log(user)
          })
          .catch((error) => {
            this.isLoading = false
            switch (error.status) {
              case 400:
                this.invalidText = 'Неправильний запит:/'
                break
              case 404:
                this.invalidText = 'Користувача не знайдено:/'
                break
              case 500:
                this.invalidText = 'Помилка сервера. Спробуйте пізніше:/'
                break
              default:
                this.invalidText = 'Незнайома помилка ¯\\_(ツ)_/¯'
            }
            this.invalid = true
          })
      }
    },
    validateLogin () {
      const emailValid = this.isEmailValid(this.email)
      const passValid = this.rules.password(this.password)
      if (emailValid !== true || this.email === '') {
        this.invalidText = emailValid
        if (this.email === '') {
          this.invalidText = 'Введіть пошту'
        }
        this.invalid = true
      } else if (passValid !== true || this.password === '') {
        this.invalidText = passValid
        if (this.password === '') {
          this.invalidText = 'Введіть пароль'
        }
        this.invalid = true
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
