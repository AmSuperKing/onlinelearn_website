<template>
  <div class="wrapper">
    <el-upload
      class="upload-demo"
      disabled
      :headers="config"
      accept=".mp4,.MP4,.flv,.FLV,.ogg,.OGG"
      action="http://127.0.0.1:8186/upload/uploadFile"
      :on-progress="uploadProcess"
      :on-success="uploadSuccess">
      <div slot="tip" class="el-upload__tip">选择文件后将直接进行上传到服务器，请耐心稍等</div>
      <el-progress v-if="flag" type="circle" :percentage="uploadPercent" style="margin-top:30px;"></el-progress>
    </el-upload>
  </div>
</template>

<script>

export default {
  name: 'UploadFile',
  components: {
  },
  data () {
    return {
      config: {
        headers: { 'Content-Type': 'multipart/form-data' }
      },
      flag: false,
      uploadPercent: null
    }
  },
  mounted () {
  },
  methods: {
    uploadProcess (event, file, fileList) {
      // console.log(event, file, fileList)
      this.flag = true
      this.uploadPercent = Math.floor(event.percent)
    },
    uploadSuccess (res, file, fileList) {
      // console.log(res, file)
      this.$emit('fileUploadSucc', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 50vh;
}
</style>
