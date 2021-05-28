<template>
  <div>
    <div class="text-wrapper">
      <el-input
        type="text"
        placeholder="请输入内容(只能数字/字母/正常符号)"
        v-model="inputText"
        maxlength="16"
        show-word-limit
        clearable
        @keyup.native="inputText=inputText.replace(/[\u4E00-\u9FA5]/g,'')">
      </el-input>
      <div class="change-btns">
        <el-button @click="closeGetBarcode">取消</el-button>
        <el-button type="primary" @click="getBarcode">生成</el-button>
      </div>
    </div>
    <div class="code-img">
      <p class="desc-title">生成结果：</p>
      <div v-show="showCodeRes">
        <svg id="barcode" />
      </div>
    </div>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'

export default {
  name: 'GetBarcode',
  components: {
  },
  data () {
    return {
      inputText: '',
      originText: '请输入内容',
      showCodeRes: false
    }
  },
  methods: {
    genBarCode (originText) {
      JsBarcode('#barcode', originText, {
        format: 'CODE128', // 条形码的格式
        // lineColor: '#0aa', // 线条颜色
        width: 1.5, // 线宽
        height: 40, // 条码高度
        displayValue: false, // 是否显示文字信息
        textMargin: 1,
        margin: 0
      })
    },
    getBarcode () {
      if (this.inputText) {
        this.originText = this.inputText
        this.genBarCode(this.originText)
        this.showCodeRes = true
      } else {
        this.showCodeRes = false
        this.$message.warning('请输入内容生成条码')
      }
    },
    closeGetBarcode () {
      this.showCodeRes = false
      this.$emit('closeGetBarode')
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
