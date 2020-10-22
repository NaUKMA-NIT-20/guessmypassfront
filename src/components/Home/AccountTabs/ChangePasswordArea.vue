<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="password"
        :counter="passwordBounds.max"
        :maxlength="passwordBounds.max"
        label="Ваш старий пароль"
        placeholder="сюди теперішній пароль"
        :rules="[rules.password]"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="() => (showPassword = !showPassword)"
        :type="showPassword ? 'text' : 'password'"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12"><v-text-field
      v-model="passwordNew"
      :counter="passwordBounds.max"
      :maxlength="passwordBounds.max"
      label="Ваш новий пароль"
      placeholder="сюди новий крутий пароль"
      :rules="[rules.password]"
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
              passwordNew: '',
              showPassword: false,
              invalid: false,
              invalidText: '',
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
      }
  }
</script>
