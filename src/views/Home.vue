<template>
  <v-app class="overflow-hidden">
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      absolute
      color="#fcb69f"
      dark
      shrink-on-scroll
      src="https://picsum.photos/1920/1080?random"
      scroll-target="#scrolling-techniques-2"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu
        offset-y
        bottom
        left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in auth_btn.items"
            :key="i"
            link
            @click="item.action"
          >
            <v-icon class="v-list-item-icon">{{ item.icon }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-2"
      class="overflow-y-auto"
      max-height="1000"
    >
      <v-container style="height: 200vh">
        <personal-area-dialog :state="dialogs.states.account"
                              @close="closeAccountDialog"
                              @updatedPassword = "updatedPassword"
                              @updatedUsername = "updatedUsername">
        </personal-area-dialog>
      </v-container>
      <v-snackbar
        v-model="dialogs.states.updatedData">
        {{ dialogs.states.updateText }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="green"
            text
            v-bind="attrs"
            @click="dialogs.states.updatedData = false">
            Закрити
          </v-btn>
        </template>
      </v-snackbar>
    </v-sheet>
  </v-app>
</template>
<script>
import PersonalAreaDialog from '../components/Home/Account/PersonalAreaDialog.vue'

export default {
  data () {
    return {
      drawer: null,
      items: [
        {
          title: 'Home',
          icon: 'mdi-view-dashboard'
        },
        {
          title: 'About',
          icon: 'mdi-forum'
        }
      ],
      title: 'Ваші акаунти',
      auth_btn: {
        items: [
          {
            title: 'Кабінет',
            linkName: 'my',
            action: () => {
              this.dialogs.states.account = true
            },
            icon: 'mdi-home'
          },
          {
            title: 'Вийти',
            linkName: null,
            action: this.logout,
            icon: 'mdi-logout'
          }
        ]
      },
      dialogs: {
        states: {
          account: false,
          updatedData: false,
          updateText: ''
        }
      }
    }
  },
  components: {
    PersonalAreaDialog
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/toLogout')
    },
    closeAccountDialog () {
      this.dialogs.states.account = false
    },
    updatedPassword () {
      this.dialogs.states.account = false
      this.dialogs.states.updatedData = true
      this.dialogs.states.updateText = 'Пароль був успішно оновлений'
    },
    updatedUsername () {
      this.dialogs.states.account = false
      this.dialogs.states.updatedData = true
      this.dialogs.states.updateText = 'Нікнейм був успішно оновлений'
    }
  }
}
</script>
<style lang="sass">
html
  overflow: hidden

</style>
<style lang="sass" scoped>
.v-list-item-icon
  margin-right: 10px

.password-dialog
  color: black
</style>
