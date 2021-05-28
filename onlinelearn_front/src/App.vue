<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view />
    <foot></foot>
  </div>
</template>

<script>
import NavBar from './components/nav'
import Foot from './components/footer'

export default {
  name: 'App',
  components: {
    NavBar,
    Foot
  }
}
</script>

<style lang="scss" scoped>

</style>
