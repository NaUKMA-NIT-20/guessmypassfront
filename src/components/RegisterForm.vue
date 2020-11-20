<template>
  <v-form class="register">
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
          v-model="username"
          type="text"
          :rules="[library.Auth.validateUsername]"
          label="Ваш нікнейм"
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
        <v-text-field
          v-model="passwordRepeat"
          :counter="library.Bounds.passwordBounds.max"
          :maxlength="library.Bounds.passwordBounds.max"
          label="Повторіть пароль"
          :rules="[library.Auth.validateMatchingPasswords(passwordMatch)]"
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
          :rules="[library.Auth.validatePasswordHelp]"
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
    import { Patterns, Bounds, AuthorisationValidation, helperFunction } from '../assets/js/Validation'
    import { encryptingFunctions } from '../assets/js/Cryptor'
export default {
  name: 'RegisterForm',
  data: () => ({
    library: {
      Patterns, Bounds, Auth: AuthorisationValidation
    },
    email: '',
    username: '',
    password: '',
    passwordHelp: '',
    showPassword: false,
    passwordRepeat: '',
    showAgainPassword: false,
    isLoading: false,
    invalid: false,
    invalidText: ''
  }),
  methods: {
    async toRegister () {
      this.validateRegister()
      if (!this.invalid) {
        this.isLoading = true
        const data = {
            email: this.email,
            password: this.password,
            passwordHelp: this.passwordHelp,
            username: this.username
        }
        this.$store.dispatch('auth/toRegister',
            encryptingFunctions.encryptRegister(data))
          .then((createdUser) => {
            console.log('Succesfully registered.\nTrying to Login')
            const data = ({
                email: this.email,
                password: this.password
            })
            return this.$store.dispatch('auth/toLogin',
              encryptingFunctions.encryptLogin(data))
          })
          .then((user) => {
            this.isLoading = false
            console.log(user)
          })
          .catch(async (error) => {
            this.isLoading = false
            this.invalidText = helperFunction.checkRegisterError(await error)
            this.invalid = true
          })
      }
    },
    validateRegister () {
      const emailValid = this.library.Auth.validateEmail(this.email)
      const passValid = this.library.Auth.validatePassword(this.password)
      const usernameValid = this.library.Auth.validateUsername(this.username)
      const againPassValid = this.library.Auth.validateMatchingPasswords(this.passwordMatch)
      const passwordHelpValid = this.library.Auth.validatePasswordHelp(this.passwordHelp)
      const emailInstructions = this.library.Auth.getEmailInstructions(this.email, emailValid)
      const passwordInstructions = this.library.Auth.getPasswordInstructions(this.password, passValid)
      const usernameInstructions = this.library.Auth.getUsernameInstructions(this.username, usernameValid)
      const matchPasswordInstructions = this.library.Auth.getMatchPasswordInstructions(againPassValid)
      const passwordHelpInstructions = this.library.Auth.getPasswordHelpInstructions(passwordHelpValid)
      const arrayInstructions = [emailInstructions, passwordInstructions, usernameInstructions,
          matchPasswordInstructions, passwordHelpInstructions]
      arrayInstructions.forEach(instruction => {
          if (instruction.invalid) {
              this.invalid = true
              this.invalidText = instruction.message
          }
      })
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
