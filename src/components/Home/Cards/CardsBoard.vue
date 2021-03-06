<template>
  <v-row>

    <v-container v-if="loadingCards" style="height: 400px;">
      <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="subtitle-1 text-center"
          cols="12"
        >
          Картки завантажуються...
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>

    <v-col v-else
      v-for="card in cards"
      :key="card.id"
      :cols="card.mobile"
      :xs="card.mobile"
      :md="card.flex"
    >
      <v-card>
        <v-img
          :src="card.src"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200px"
        >
          <v-card-title v-text="card.title"></v-card-title>
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn icon
                 @click="editCard(card)"
          >
            <v-icon>
              mdi-wrench
            </v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>
              mdi-bookmark
            </v-icon>
          </v-btn>

          <v-btn icon
                 color="red"
                 @click="deleteCard(card.id)"
          >
            <v-icon>
              mdi-trash-can
            </v-icon>
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-col>

    <v-btn
      key="mdi-plus"
      color="success"
      @click="states.dialogs.add = true"
      fab
      large
      dark
      bottom
      left
      class="v-btn--add"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

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

    <add-card
      :state="states.dialogs.add"
      @close="closeAddDialog"
      @onSave="getCards"
    ></add-card>

    <edit-card
      ref="edit_card"
      :state="states.dialogs.edit"
      @close="closeEditDialog"
      @onSave="getCards"
    ></edit-card>

  </v-row>

</template>

<script>
  import AddCard from './Dialogs/AddCard'
  import EditCard from './Dialogs/EditCard'

  export default {
      data () {
          return {
              loadingCards: true,
              invalid: false,
              invalidText: '',
              cards: [],
              states: {
                  dialogs: {
                      add: false,
                      edit: false
                  }
              }
          }
      },
      components: {
        AddCard,
        EditCard
      },
      methods: {
          editCard (cardSelected) {
            const cardList = this.$store.state.cards
            const card = cardList.cards.find(it => it.id === cardSelected.id)

            this.$refs.edit_card.startEditingCard(card)
            this.states.dialogs.edit = true
          },
          async deleteCard (id) {
            const res = await this.$confirm('Ви дійсно хочете видалити картку ?', {
              title: 'Підтвердження',
              color: 'red',
              icon: 'mdi-trash-can'
            })
            if (res) {
              this.$store.dispatch('cards/deleteCard', id)
                .then((response) => {
                  const updatedCards = this.getCards()
                  this.cards = this.renderCards(updatedCards)
                })
                .catch((error) => {
                  if (error.status === 400) {
                    this.invalidText = 'Картки з таким id не існує :/'
                    this.invalid = true
                  } else if (error.status === 401) {
                    this.invalidText = 'Користувач не аутентифікований :/'
                    this.invalid = true
                    this.$store.dispatch('auth/toLogout')
                  } else if (error.status === 500) {
                    this.invalidText = 'Помилка сервера'
                    this.invalid = true
                  }
                })
            }
          },
          async getCards () {
              this.loadingCards = true
              this.$store.dispatch('cards/getCards')
                  .then((cards) => {
                      this.loadingCards = false
                      this.cards = this.renderCards(cards)
                  })
                  .catch((error) => {
                    this.loadingCards = false
                    if (error.status === 401) {
                      this.invalidText = 'Користувач не аутентифікований :/'
                      this.invalid = true
                      this.$store.dispatch('auth/toLogout')
                    }
                    else if (error.status === 500) {
                      this.invalidText = 'Помилка сервера'
                      this.invalid = true
                    }
                  })
          },
          renderCards (cards) {
              return cards.map(
                  card => {
                      const id = card.id
                      const name = card.name
                      return {
                          id,
                          title: name,
                          src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
                          flex: 3,
                          mobile: 12
                      }
                  }
              )
          },
          closeAddDialog () {
              this.states.dialogs.add = false
          },
          closeEditDialog () {
              this.states.dialogs.edit = false
          }
      },
      beforeMount () {
          this.getCards()
      }
  }
</script>

<style lang="sass" scoped>
  .v-btn--add
    position: fixed
    z-index: 10
    right: 2rem
    bottom: 2rem
  .row--dense > .col, .row--dense > [class*=col-]
    padding: 10px
</style>
