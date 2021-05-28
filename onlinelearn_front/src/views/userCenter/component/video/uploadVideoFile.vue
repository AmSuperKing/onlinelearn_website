<template>
  <div>
    <div class="form-box">
      <el-form :model="uploadForm" :rules="rules" ref="uploadForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="选择视频教程" prop="video">
          <el-select v-model="uploadForm.video" placeholder="请选择上传的教程">
            <el-option
              v-for="item of videoList"
              :key="item.path"
              :label="item.name"
              :value="item.path">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="章节数" prop="section">
          <el-input v-model.trim="uploadForm.section" type="number" maxlength="3"></el-input>
        </el-form-item>
        <el-form-item label="文件名称" prop="fileName">
          <el-input v-model.trim="uploadForm.fileName"></el-input>
        </el-form-item>
        <el-form-item v-if="haveUploadFile" label="文件类型" prop="fileType">
          <el-input v-model="uploadForm.fileType" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="haveUploadFile" label="文件状态" prop="fileStatus">
          <el-input v-model="uploadForm.fileStatus" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="haveUploadFile" label="上传时间" prop="uploadTime">
          <el-input v-model="uploadForm.uploadTime" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="!haveUploadFile" >
          <el-button type="warning" plain size="small" @click="showUploadForm">选择文件上传</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpLoadForm('uploadForm')">提交信息</el-button>
          <el-button @click="resetForm('uploadForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="选择文件进行上传"
      :visible.sync="uploadVisible"
      width="370px"
      :close-on-click-modal="false"
      :destroy-on-close="true">
      <upload-file @fileUploadSucc="fileUploadSucc"></upload-file>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUploadInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { videoInfoApi } from '@/api/videoInfoApi'
import uploadFile from './uploadFile'

export default {
  name: 'UploadVideoFile',
  components: {
    uploadFile
  },
  data () {
    return {
      videoList: [],
      uploadForm: {
        video: '',
        section: '',
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileStatus: '',
        uploadTime: '',
        count_num: 0,
        creator: ''
      },
      haveUploadFile: false,
      uploadVisible: false,
      uploadSuccData: {},
      rules: {
        video: [
          { required: true, message: '请选择上传的视频', trigger: 'change' }
        ],
        section: [
          { required: true, message: '请输入章节数', trigger: 'change' }
        ],
        fileName: [
          { required: true, message: '请输入文件名称', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // this.getMyAllVideo()
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
    fileUploadSucc (val) {
      this.$message.success('文件上传完成，请完善信息提交')
      this.uploadSuccData = val
      setTimeout(this.uploadVisible = false, 4000)
      // console.log('fileUploadSucc', val)
      const timeNow = this.formatTime()
      this.uploadForm.fileType = val.data.fileType
      this.uploadForm.fileUrl = val.data.url
      this.uploadForm.fileStatus = '已上传'
      this.uploadForm.uploadTime = timeNow
      this.uploadForm.creator = this.$cookie.get('userId')
      this.haveUploadFile = true
    },
    setUploadInfo () {
      this.uploadVisible = false
    },
    getMyAllVideo () {
      const userId = this.$cookie.get('userId')
      if (userId) {
        const param = {
          user: userId
        }
        videoInfoApi
          .getMyAllVideo(param)
          .then(res => {
            // console.log('全部数据列表', res.data)
            if (res.data.length) {
              this.videoList = res.data
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.uploadForm.video = ''
      this.uploadForm.section = ''
      this.uploadForm.fileName = ''
      this.uploadForm.fileType = ''
      this.uploadForm.fileUrl = ''
      this.uploadForm.fileStatus = ''
      this.uploadForm.uploadTime = ''
      this.uploadForm.count_num = 0
      this.uploadForm.creator = ''
      this.haveUploadFile = false
    },
    submitUpLoadForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.uploadForm.section = 'section' + this.uploadForm.section
          // console.log(this.uploadForm)
          videoInfoApi
            .uploadVideoFile(this.uploadForm)
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
