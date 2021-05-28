<template>
  <div class="err-page">
    <div class="error-img-container">
      <img src="../assets/imgs/404.png" class="img-responsive error-img" alt="404 Error image">
    </div>
    <div class="error-text-container">
      <p class="error-txt">页面丢失了......</p>
      <el-button type="primary" size="mini"><router-link to="/" class="back-to-home">返回首页</router-link></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage'
}
</script>

<style lang="scss" scoped>
.err-page {
  width: 100%;
  min-height: 65vh;
  padding-bottom: 10px;
}
.error-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.error-img {
  width: 60vw;
  height: auto;
}
.error-txt {
  font-size: 120%;
  color:#3CB371;
  font-weight: bold;
}
.error-text-container {
  text-align: center;
}
.back-to-home {
  font-size: 15px;
  color: #fff;
  text-decoration: none;
}
</style>
