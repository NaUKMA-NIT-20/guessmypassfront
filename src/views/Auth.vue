<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="10" xl="3" md="5" sm="10">
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
                  <LoginForm v-if="item.mission === 'login'"></LoginForm>
                  <RegisterForm v-if="item.mission === 'register'"></RegisterForm>
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
  import LoginForm from '../components/LoginForm'
  import RegisterForm from '../components/RegisterForm'
// @ is an alias to /src
// import { mapActions } from 'vuex'
export default {
  name: 'Auth',
  components: {
      LoginForm,
      RegisterForm
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
</style>
