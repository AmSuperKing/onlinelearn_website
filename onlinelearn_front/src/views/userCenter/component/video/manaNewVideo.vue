<template>
  <div>
    <div class="form-box">
      <el-form :model="uploadForm" :rules="rules" ref="uploadForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="教程名称" prop="name">
          <el-input v-model.trim="uploadForm.name"></el-input>
        </el-form-item>
        <el-form-item label="教程描述" prop="desc">
          <el-input
            type="textarea"
            maxlength="120"
            show-word-limit
            :autosize="{ minRows: 5, maxRows: 7}"
            v-model="uploadForm.desc">
        </el-input>
        </el-form-item>
        <el-form-item v-if="haveUploadFile" label="封面状态" prop="imgStatus">
          <el-input v-model="uploadForm.imgStatus" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="!haveUploadFile" >
          <el-button type="warning" plain size="small" @click="showUploadForm">选择教程封面上传</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpLoadForm('uploadForm')">提交创建</el-button>
          <el-button @click="resetForm('uploadForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="选择视频封面进行上传"
      :visible.sync="uploadVisible"
      width="370px"
      :close-on-click-modal="false"
      :destroy-on-close="true">
      <upload-image @fileUploadSucc="fileUploadSucc"></upload-image>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUploadInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { videoInfoApi } from '@/api/videoInfoApi'
import uploadImage from '../upload/uploadImage'

export default {
  name: 'ManaNewVideo',
  components: {
    uploadImage
  },
  data () {
    return {
      uploadForm: {
        name: '',
        desc: '',
        imgUrl: '',
        imgStatus: '',
        path: '',
        count_num: 0,
        newTime: '',
        creator: ''
      },
      haveUploadFile: false,
      uploadVisible: false,
      uploadSuccData: {},
      rules: {
        name: [
          { required: true, message: '请填写教程名称', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入教程描述', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    showUploadForm () {
      this.uploadVisible = true
    },
    formatTime () {
      var now = new Date()
      const y = now.getFullYear()
      const M = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      const d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      const h = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
      const m = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
      const s = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
      const timeStr = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
      return timeStr
    },
    randomString (len) {
      len = len || 12
      const letter = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const letterLen = letter.length
      let res = ''
      for (let i = 0; i < len; i++) res += letter.charAt(Math.floor(Math.random() * letterLen))
      return res
    },
    fileUploadSucc (val) {
      this.$message.success('封面上传完成，请完善信息提交')
      this.uploadSuccData = val
      setTimeout(this.uploadVisible = false, 4000)
      // console.log('fileUploadSucc', val)
      const timeNow = this.formatTime()
      this.uploadForm.imgUrl = val.data.url
      this.uploadForm.imgStatus = '已上传'
      this.uploadForm.newTime = timeNow
      this.uploadForm.creator = this.$cookie.get('userId')
      this.uploadForm.path = this.randomString(15)
      this.haveUploadFile = true
    },
    setUploadInfo () {
      this.uploadVisible = false
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.uploadForm.name = ''
      this.uploadForm.desc = ''
      this.uploadForm.imgUrl = ''
      this.uploadForm.imgStatus = ''
      this.uploadForm.path = ''
      this.uploadForm.newTime = ''
      this.uploadForm.count_num = 0
      this.uploadForm.creator = ''
      this.haveUploadFile = false
    },
    submitUpLoadForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.uploadForm.imgUrl) {
            // console.log('this.uploadForm', this.uploadForm)
            videoInfoApi
              .newVideo(this.uploadForm)
              .then(res => {
                // console.log('submitUpLoadForm', res)
                if (res.data.code === 200) {
                  this.$message.success(res.data.message)
                  this.resetForm('uploadForm')
                  this.haveUploadFile = false
                } else {
                  this.$message.error(res.data.message)
                }
              })
          } else {
            this.$message.warning('请选择教程封面')
          }
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  width: 100%;
  padding: 15px;
}
</style>
