<template>
  <transition name = 'fade'>
    <router-view/>
  </transition>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  })
}
</script>
<style lang="sass">
  @import "../src/assets/sass/assets/variables/colors"
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Merriweather:wght@300;400;700&display=swap')
  .v-application
    font-family: 'Lato', sans-serif!important
  .fade-enter-active, .fade-leave-active
    transition: opacity .4s
  .fade-enter, .fade-leave-to
    opacity: 0
</style>
