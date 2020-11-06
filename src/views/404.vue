<template>
  <v-app id="inspire">
    <v-card
      class="mx-auto"
      max-width="400"
    >
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://blog.vverh.digital/wp-content/uploads/2020/06/oblojka-404.png"
      >
        <v-card-title>Вибачте, але цієї сторінки не існує</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0">
        Оберіть наступні дії:
      </v-card-subtitle>

      <v-card-text class="text--primary">
        <div>Спробуйте повернутися на головну сторінку</div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="orange"
          text
        >
          <router-link :to = "{ name: 'Home' }">До головної</router-link>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>
<style scoped lang="sass">
  .v-card.mx-auto
    margin: auto
  a
    text-decoration: none
    color: orange
  .v-card-title

</style>
