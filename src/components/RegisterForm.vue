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
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="username"
          type="text"
          :rules="[username => isUsernameValid(username)]"
          label="Ваш нікнейм"
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
        <v-text-field
          v-model="passwordRepeat"
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
        <v-text-field
          v-model="passwordHelp"
          type="text"
          :rules="[hint => isPasswordHelpValid(hint)]"
          label="Підказка до паролю"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-btn
          @click="toRegister"
          :loading="isLoading"
        >Зареєструватися
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
  name: 'RegisterForm',
  data: () => ({
    email: '',
    username: '',
    password: '',
    passwordHelp: '',
    showPassword: false,
    passwordRepeat: '',
    showAgainPassword: false,
    isLoading: false,
    invalid: false,
    invalidText: '',
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
    },
    nicknameBounds: {
      min: 3,
      max: 14
    },
    passwordHelpBounds: {
      min: 3,
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
    isUsernameValid (username) {
      if (username === '') {
        return true
      } else if (username.length < this.nicknameBounds.min) {
        return 'Нікнейм занадто короткий'
      } else if (username.length > this.nicknameBounds.max) {
        return 'Нікнейм занадто довгий'
      } else {
        return true
      }
    },
    isPasswordHelpValid (hint) {
      if (hint === '') {
        return true
      } else if (hint.length < this.passwordHelpBounds.min) {
        return 'Підказка занадто коротка'
      } else if (hint.length > this.passwordHelpBounds.max) {
        return 'Підказка занадто довга'
      } else {
        return true
      }
    },
    changeState () {
      if (this.state === 0) {
        this.state = 1
      } else if (this.state === 1) this.state = 0
    },
    async toRegister () {
      this.validateRegister()
      if (!this.invalid) {
        this.isLoading = true
        this.$store.dispatch('auth/toRegister',
          {
            email: this.email,
            password: this.password,
            passwordHelp: this.passwordHelp,
            username: this.username
          })
          .then((createdUser) => {
            console.log('Succesfully registered.\nTrying to Login')
            return this.$store.dispatch('auth/toLogin',
              {
                email: this.email,
                password: this.password
              })
          })
          .then((user) => {
            this.isLoading = false
            console.log(user)
          })
          .catch((error) => {
            this.isLoading = false
            switch (error.status) {
              case 400:
                if (error.data === 'Wrong request. User already exists') {
                  this.invalidText = 'Такий користувач вже існує :/'
                } else {
                  this.invalidText = 'Порожній запит :/'
                }
                break
              case 404:
                this.invalidText = 'Користувача створено, проте трапилась помилка при логіні. Спробуйте увійти трохи пізніше :/'
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
    validateRegister () {
      const emailValid = this.isEmailValid(this.email)
      const usernameValid = this.isUsernameValid(this.username)
      const passValid = this.rules.password(this.password)
      const againPassValid = this.passwordMatch
      const passwordHelpValid = this.isPasswordHelpValid(this.passwordHelp)
      if (emailValid !== true || this.email === '') {
        this.invalidText = emailValid
        if (this.email === '') {
          this.invalidText = 'Пошта не може бути порожня'
        }
        this.invalid = true
      } else if (usernameValid !== true || this.username === '') {
        this.invalidText = usernameValid
        if (this.username === '') {
          this.invalidText = 'Нік не може бути порожній'
        }
        this.invalid = true
      } else if (passValid !== true || this.password === '') {
        this.invalidText = passValid
        if (this.password === '') {
          this.invalidText = 'Пароль не може бут порожній'
        }
        this.invalid = true
      } else if (againPassValid !== true) {
        this.invalidText = 'Паролі не співпадають'
        this.invalid = true
      } else if (this.passwordHelp === '') {
        this.invalidText = 'Підказка не може бути порожня'
        this.invalid = true
      } else if (passwordHelpValid !== true) {
        this.invalidText = passwordHelpValid
        this.invalid = true
      }
    }
  },
  computed: {
    passwordMatch () {
      return this.password === this.passwordRepeat
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

.v-form.register .row button
  margin-top: 50px
  background-color: $tangerine !important
  width: 100%
  color: white
</style>
