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
                          label="Ваш імейл"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="login.password"
                          :counter="10"
                          label="Ваш пароль"
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
                          label="Ваш імейл"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="register.nickname"
                          label="Ваш нікнейм"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="register.password"
                          :counter="16"
                          label="Ваш пароль"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="register.again_password"
                          :counter="16"
                          label="Повторіть пароль"
                          required
                        ></v-text-field>
                      </v-row>
                      <v-row>
                        <v-btn @click="toRegister">Зареєструватися</v-btn>
                      </v-row>

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

export default {
  name: 'Home',
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
          invalid: false,
          invalidText: ''
      },
      register: {
          email: '',
          nickname: '',
          password: '',
          again_password: '',
          invalid: false,
          invalidText: ''

      },
      state: 0
  }),
  computed: {
      getState () {
          return this.state
      }
  },
  methods: {
      changeState () {
          if (this.state === 0) this.state = 1
          else if (this.state === 1) this.state = 0
      },
      toLogin () {
          if (this.login.email === '') {
              this.login.invalidText = 'Відсутній імейл'
              this.login.invalid = true
          }
          else if (this.login.password === '') {
              this.login.invalidText = 'Відсутній пароль'
              this.login.invalid = true
          }
          else {
              alert('Ваша пошта: ' + this.login.email + '\n' + ' Ваш пароль: ' + this.login.password + '.')
          }
      },
      toRegister () {

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
