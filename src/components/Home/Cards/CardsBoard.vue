<template>
  <v-row>
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
    <v-col
      v-for="card in cards"
      :key="card.id"
      :cols="card.mobile"
      :xs="card.mobile"
      :md="card.flex"
    >
      <v-card link>
        <v-img
          :src="card.src"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200px"
        >
          <v-card-title v-text="card.title"></v-card-title>
        </v-img>
        <v-card-actions>
          <!--<v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-bookmark</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-trash-can</v-icon>
          </v-btn> !-->
        </v-card-actions>
      </v-card>
    </v-col>
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
  </v-row>

</template>

<script>
  import AddCard from './Dialogs/AddCard'

  export default {
      data () {
          return {
              invalid: false,
              invalidText: '',
              cards: [],
              states: {
                  dialogs: {
                      add: false
                  }
              }
          }
      },
      components: {
        AddCard
      },
      methods: {
          async getCards () {
              this.$store.dispatch('cards/getCards')
                  .then((cards) => {
                      this.cards = this.renderCards(cards)
                  })
                  .catch((error) => {
                      if (error.status === 500) {
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
