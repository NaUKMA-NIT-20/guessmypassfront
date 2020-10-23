<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="newNickName"
        label="Введіть новий нік"
        placeholder="Новий крутий нік"
      >
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ChangeNicknameArea',
  data () {
    return {
      newNickName: ''
    }
  },
  props: {
    updating: Boolean
  },
  methods: {
    cleanFields () {
      this.newNickName = ''
    },
    getNickname () {
      return this.newNickName
    },
    isActive () {
      return true
    }
  }
}
</script>

<style scoped>

</style>
