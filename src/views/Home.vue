<template>
  <div>
    <p>
      You are authenticated!
    </p>
  </div>
</template>
<script>
  export default {
      beforeMount () {
          if (localStorage.getItem('token') == null) {
              this.$router.push('/auth')
          }
      }
  }
</script>
