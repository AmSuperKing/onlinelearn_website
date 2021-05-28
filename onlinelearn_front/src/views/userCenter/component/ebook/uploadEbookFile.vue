<template>
  <div>
    <div class="form-box">
      <el-form :model="uploadForm" :rules="rules" ref="uploadForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="书籍名称" prop="name">
          <el-input v-model.trim="uploadForm.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="书籍描述" prop="desc">
          <el-input
            type="textarea"
            maxlength="120"
            show-word-limit
            :autosize="{ minRows: 5, maxRows: 7}"
            v-model="uploadForm.desc">
          </el-input>
        </el-form-item>
        <el-form-item v-if="!haveUploadImg" >
          <el-button type="warning" plain size="small" @click="showUploadImg">选择封面上传</el-button>
        </el-form-item>
        <el-form-item v-if="haveUploadImg" label="封面上传" prop="imgStatus">
          <el-input v-model="uploadForm.imgStatus" disabled></el-input>
        </el-form-item>

        <el-form-item v-if="!haveUploadFile">
          <el-button type="warning" plain size="small" @click="showUploadFile">选择书籍上传</el-button>
        </el-form-item>
        <el-form-item v-if="haveUploadFile" label="文件状态" prop="fileStatus">
          <el-input v-model="uploadForm.fileStatus" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="haveUploadFile" label="上传时间" prop="uploadTime">
          <el-input v-model="uploadForm.uploadTime" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpLoadForm('uploadForm')">提交信息</el-button>
          <el-button @click="resetForm('uploadForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="选择封面进行上传"
      :visible.sync="uploadImg"
      width="370px"
      :close-on-click-modal="false"
      :destroy-on-close="true">
      <upload-img @imgUploadSucc="imgUploadSucc"></upload-img>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadImg = false">取 消</el-button>
        <el-button type="primary" @click="uploadImg = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择书籍进行上传"
      :visible.sync="uploadFile"
      width="370px"
      :close-on-click-modal="false"
      :destroy-on-close="true">
      <upload-file @fileUploadSucc="fileUploadSucc"></upload-file>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadFile = false">取 消</el-button>
        <el-button type="primary" @click="uploadFile = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ebookInfoApi } from '@/api/ebookInfoApi'
import uploadImg from './uploadImg'
import uploadFile from './uploadFile'

export default {
  name: 'UploadEbookFile',
  components: {
    uploadImg,
    uploadFile
  },
  data () {
    return {
      uploadForm: {
        name: '',
        desc: '',
        path: '',
        imgUrl: '',
        imgStatus: '',
        fileUrl: '',
        fileStatus: '',
        count_num: 0,
        creator: '',
        uploadTime: ''
      },
      haveUploadImg: false,
      haveUploadFile: false,
      uploadImg: false,
      uploadFile: false,
      rules: {
        name: [
          { required: true, message: '请填写书籍名称', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入书籍描述', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {
    showUploadImg () {
      this.uploadImg = true
    },
    showUploadFile () {
      this.uploadFile = true
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
    imgUploadSucc (val) {
      this.$message.success('封面上传完成')
      // console.log('imgUploadSucc', val)
      const timeNow = this.formatTime()
      setTimeout(this.uploadImg = false, 4000)
      this.uploadForm.imgUrl = val.data.url
      this.uploadForm.imgStatus = '已上传'
      this.uploadForm.uploadTime = timeNow
      this.uploadForm.creator = this.$cookie.get('userId')
      this.haveUploadImg = true
    },
    fileUploadSucc (val) {
      this.$message.success('书籍文件上传完成')
      setTimeout(this.uploadFile = false, 4000)
      // console.log('fileUploadSucc', val)
      const timeNow = this.formatTime()
      this.uploadForm.fileUrl = val.data.url
      this.uploadForm.fileStatus = '已上传'
      this.uploadForm.uploadTime = timeNow
      this.uploadForm.creator = this.$cookie.get('userId')
      this.haveUploadFile = true
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.uploadForm.name = ''
      this.uploadForm.desc = ''
      this.uploadForm.fileType = ''
      this.uploadForm.path = ''
      this.uploadForm.imgUrl = ''
      this.uploadForm.imgStatus = ''
      this.uploadForm.fileUrl = ''
      this.uploadForm.fileStatus = ''
      this.uploadForm.count_num = 0
      this.uploadForm.creator = ''
      this.uploadForm.uploadTime = ''
      this.haveUploadImg = false
      this.haveUploadFile = false
    },
    randomString (len) {
      len = len || 12
      const letter = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const letterLen = letter.length
      let res = ''
      for (let i = 0; i < len; i++) res += letter.charAt(Math.floor(Math.random() * letterLen))
      return res
    },
    submitUpLoadForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.uploadForm)
          if (this.uploadForm.imgUrl && this.uploadForm.fileUrl) {
            this.uploadForm.path = this.randomString(15)
            // console.log(this.uploadForm)
            ebookInfoApi
              .newEbook(this.uploadForm)
              .then(res => {
                // console.log('submitUpLoadForm', res)
                if (res.data.code === 200) {
                  this.$message.success(res.data.message)
                  this.resetForm('uploadForm')
                  this.haveUploadImg = false
                  this.haveUploadFile = false
                } else {
                  this.$message.error(res.data.message)
                }
              })
          } else {
            this.$message.error('请检查封面或书籍是否上传')
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
