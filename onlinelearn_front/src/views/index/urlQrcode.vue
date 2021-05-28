<template>
  <div class="code-btn-wrapper">
    <el-popover
      placement="top-start"
      title="扫码访问当前页"
      width="125"
      trigger="hover">
      <div class="code-wrapper">
        <vue-qr
          :text="currentUrl"
          :size="120"
          :margin="2"
        />
      </div>
      <el-button slot="reference" class="code-btn">
        <i class="el-icon-mobile-phone"></i>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import vueQr from 'vue-qr'

export default {
  name: 'UrlQrcode',
  components: {
    vueQr
  },
  data () {
    return {
      currentUrl: ''
    }
  },
  mounted () {
    this.getCurrUrl()
  },
  methods: {
    getCurrUrl () {
      var href = window.location.href
      this.currentUrl = href.toString()
    }
  }
}
</script>

<style lang="scss" scoped>
.code-btn-wrapper {
  position: fixed;
  right: 20px;
  bottom: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.code-wrapper {
  display: inline-block;
  display: flex;
  justify-content: center;
}
.code-btn {
  background-color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 10%;
  color: #3cb371;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
}
</style>
