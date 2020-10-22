<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="password"
        :counter="passwordBounds.max"
        :maxlength="passwordBounds.max"
        label="Ваш старий пароль"
        placeholder="Старий пароль"
        :rules="[rules.password]"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="() => (showPassword = !showPassword)"
        :type="showPassword ? 'text' : 'password'"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12"><v-text-field
      v-model="newPassword"
      :counter="passwordBounds.max"
      :maxlength="passwordBounds.max"
      label="Ваш новий пароль"
      placeholder="Новий крутий пароль"
      :rules="[rules.password]"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="() => (showPassword = !showPassword)"
      :type="showPassword ? 'text' : 'password'"
      required
    ></v-text-field>
      </v-col>

    <v-col cols="12"><v-text-field
      v-model="newPasswordRepeat"
      :counter="passwordBounds.max"
      :maxlength="passwordBounds.max"
      label="Повторіть новий пароль"
      placeholder="Новий крутий пароль"
      :rules="[passwordMatch ? true : 'Пароль не співпадає']"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="() => (showPassword = !showPassword)"
      :type="showPassword ? 'text' : 'password'"
      required
    ></v-text-field>
    </v-col>
  </v-row>

</template>
<script>

  export default {
      name: 'ChangePasswordArea',
      data () {
          return {
              password: '',
              newPassword: '',
              newPasswordRepeat: '',
              showPassword: false,
              isLoading: false,
              rules: {
                  password: value => {
                      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
                      const msg = 'Мін. 8 символів і хоча б одна заголовна буква, число'
                      return value === '' ? msg : (pattern.test(value) || msg)
                  }
              },
              passwordBounds: { min: 8, max: 120 }
          }
      },
      methods: {
          passwords () {
              return { password: this.password, newPassword: this.newPassword }
          },
          validatePasswords () {
              const passOld = this.password.length < 1 ? 'Введіть пароль, який хочете змінити' : this.rules.password(this.password)
              const passNew = this.newPassword.length < 1 ? 'Введіть новий пароль' : this.rules.password(this.newPassword)
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
