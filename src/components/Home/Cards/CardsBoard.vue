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

    <v-col v-else-if="this.boardGrid"
           v-for="card in cards"
           :key="card.id"
           :cols="card.mobile"
           :xs="card.mobile"
           :md="card.flex"
    >
      <v-card link>
        <v-list-item class="grow">
          <v-list-item-icon color="grey darken-3">
            <v-img
              width="100px"
              alt=""
              :src="card.favicon"
            ></v-img>
          </v-list-item-icon>

          <v-list-item-title v-text="card.title"></v-list-item-title>
        </v-list-item>

        <v-card-actions>
          <v-btn icon
                 @click="doCopy(card)"
          >
            <v-icon>
              mdi-content-copy
            </v-icon>
          </v-btn>
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

    <v-col v-else
           v-for="card in cards"
           :key="card.id"
           :cols="card.mobile"
           :xs="card.mobile"
           :md="card.flex"
    >
      <v-card link>
        <v-list-item class="grow">
          <v-list-item-avatar color="grey darken-3">
            <v-img
              class="elevation-6"
              alt=""
              :src="card.favicon"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-title v-text="card.title"></v-list-item-title>

          <v-card-actions>
            <v-btn icon>
              <v-icon>
                mdi-content-copy
              </v-icon>
            </v-btn>
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
        </v-list-item>
      </v-card>
    </v-col>

    <v-row>
      <v-btn
        key="mdi-table"
        color="blue"
        @click="changeBoardGrid()"
        fab
        large
        dark
        bottom
        left
        class="v-btn--grid"
      >
        <v-icon v-if="this.boardGrid">mdi-view-headline</v-icon>
        <v-icon v-else>mdi-table</v-icon>
      </v-btn>

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

      boardGrid: true,
      loadingCards: true,
      invalid: false,
      invalidText: '',
      cards: [],
      src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
      pass_src: 'https://media.istockphoto.com/vectors/lock-vector-icon-vector-id658262428?k=6&m=658262428&s=170667a&w=0&h=o9oKaYxul5Kb6suZdC2n3AjCNeywTGpfEuCU1cDKl7U=',
      note_src: 'https://static.vecteezy.com/system/resources/thumbnails/000/355/781/small/Education__2863_29.jpg',
      credit_src: 'https://i.pinimg.com/originals/60/21/22/602122ed5585d2b52f21892d9569d751.png',
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
  computed: {
    boardGridComputed () {
      return this.boardGrid
    }
  },
  methods: {
    doCopy (card) {
      this.$copyText(card.toCopy)
        .then(() => {
          const text = 'Ви щойно скопіювали ' + card.cardType + ' картки ' + card.title
          this.$emit('updateClipboard', text)
        })
        .catch(() => {
          this.invalidText = 'Не вдалося скопіювати ' + card.cardType + ' картки ' + card.title + ' :/'
          this.invalid = true
        })
    },
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
          const cardType = card.password !== '' ? 'пароль' : (card.number !== '' ? 'номер' : 'нотатку')
          const image = card.password !== '' ? (card.url !== '' ? 'https:/' + card.url + '/favicon.ico' : this.pass_src) : (card.number !== '' ? this.credit_src : this.note_src)
            return {
            id,
            title: name,
            favicon: image,
            flex: this.boardGrid ? 3 : 12,
            mobile: this.boardGrid ? 6 : 12,
            cardType: cardType,
            toCopy: (card.password !== '') ? (card.password) : ((card.number !== '') ? card.number : (card.notes !== '' ? card.notes : ' '))
          }
        }
      )
    },
    changeBoardGrid () {
      const cardList = this.$store.state.cards
      this.boardGrid = !this.boardGrid
      this.cards = this.renderCards(cardList.cards)
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
.v-btn--grid
  position: fixed
  z-index: 10
  right: 8rem
  bottom: 2rem
.row--dense > .col, .row--dense > [class*=col-]
  padding: 10px
</style>
