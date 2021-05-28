<template>
  <div>
    <div class="text-wrapper">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="inputText"
        clearable>
      </el-input>
      <div class="change-btns">
        <el-button @click="closeGetQrcode">取消</el-button>
        <el-button type="primary" @click="getQrcode">生成</el-button>
      </div>
    </div>
    <div class="code-img">
      <p class="desc-title">生成结果：</p>
      <div>
        <vue-qr
          v-if="showCodeRes"
          :text="originText"
          :size="120"
          :margin="2"
        />
      </div>
    </div>
  </div>
</template>

<script>
import vueQr from 'vue-qr'

export default {
  name: 'GetQrcode',
  components: {
    vueQr
  },
  data () {
    return {
      inputText: '',
      originText: '请输入内容',
      showCodeRes: false
    }
  },
  methods: {
    getQrcode () {
      if (this.inputText) {
        this.originText = this.inputText
        this.$nextTick().then(this.showCodeRes = true)
      } else {
        this.showCodeRes = false
        this.$message.warning('请输入内容生成二维码')
      }
    },
    closeGetQrcode () {
      this.showCodeRes = false
      this.$emit('closeGetQrcode')
    }
  }
}
</script>

<style lang="scss" scoped>
.change-btns {
  margin-top: 20px;
  padding-bottom: 6px;
  text-align: right;
}
.code-img {
  padding-top: 6px;
  border-top: 1px solid #f8f8f8;
  text-align: center;
}
.desc-title {
  font-size: 14px;
  font-weight: bold;
}
</style>
