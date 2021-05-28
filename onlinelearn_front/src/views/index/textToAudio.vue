<template>
  <div>
    <div class="text-wrapper">
      <el-input
        type="textarea"
        :rows="6"
        placeholder="请输入内容"
        v-model="text"
      >
      </el-input>
      <div class="change-btns">
        <el-button @click="closeTextToAudio">取消</el-button>
        <el-button type="primary" @click="getAudio">转换</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { textToAudio } from '@/api/textToAudio'

export default {
  name: 'TextAudio',
  components: {
  },
  data () {
    return {
      text: ''
    }
  },
  methods: {
    closeTextToAudio () {
      this.$emit('closeTextToAudio')
    },
    getAudio () {
      if (this.text.length) {
        textToAudio
          .textToAudio(this.text)
          .then(res => {
            // console.log("音频文件blob:", res)
            const binaryData = []
            binaryData.push(res) // res后台返回的流数据
            const audioUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'audio/mpeg' }))
            window.open(audioUrl)
          })
          .catch(e => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请输入转换内容')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-wrapper {
  height: 250px;
}
.change-btns {
  margin-top: 20px;
  text-align: right;
}
</style>
