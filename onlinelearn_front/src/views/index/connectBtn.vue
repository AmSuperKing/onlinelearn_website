<template>
  <div>
    <router-link class="connect-btn" to="/about">联系我们</router-link>
  </div>
</template>

<script>

export default {
  name: 'ConnectBtn',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.connect-btn {
  position: fixed;
  left: 0;
  top: calc(70% + 30px);
  margin-top: 36px;
  width: 28px;
  height: 72px;
  transition: all .3s;
  font-size: 12px;
  color: #505050;
  background: #fff;
  border: 1px solid #e7e7e7;
  box-shadow: 0 4px 6px 0 #3CB371;
  border-radius: 0 2px 2px 0;
  padding: 8px 7px;
  line-height: 14px;
}
.connect-btn:link {
  text-decoration: none;
}
.connect-btn:visited {
  text-decoration: none;
}
.connect-btn:hover {
  text-decoration: none;
}
.connect-btn:active {
  text-decoration: none;
}
</style>
