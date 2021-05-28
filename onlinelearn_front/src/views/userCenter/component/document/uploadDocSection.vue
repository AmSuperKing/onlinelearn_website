<template>
  <div>
    <div class="form-box">
      <el-form :model="uploadForm" :rules="rules" ref="uploadForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="选择文档教程" prop="document">
          <el-select v-model="uploadForm.document" placeholder="请选择上传的教程">
            <el-option
              v-for="item of docList"
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
import { userCenterApi } from '@/api/userCenterApi'
import { getDocumentApi } from '@/api/getDocumentApi'
import uploadFile from './uploadFile'

export default {
  name: 'UploadDocSection',
  components: {
    uploadFile
  },
  data () {
    return {
      userRole: '',
      docList: [],
      uploadForm: {
        user_role: '',
        document: '',
        section: '',
        section_id: '',
        fileName: '',
        fileType: '',
        fileUrl: '',
        fileStatus: '',
        uploadTime: ''
      },
      haveUploadFile: false,
      uploadVisible: false,
      uploadSuccData: {},
      rules: {
        document: [
          { required: true, message: '请选择上传的文档教程', trigger: 'change' }
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
    this.getRole()
  },
  methods: {
    getRole () {
      const currUserId = this.$cookie.get('userId')
      if (currUserId) {
        const param = {
          userId: currUserId
        }
        userCenterApi
          .getRole(param)
          .then(res => {
            if (res.data[0].user_role) {
              this.userRole = res.data[0].user_role
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
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
      const urlArr = val.data.url.split('/')
      urlArr.shift()
      urlArr.shift()
      urlArr.shift()
      const path = urlArr.join('/')
      const timeNow = this.formatTime()
      this.uploadForm.fileType = val.data.fileType
      this.uploadForm.fileUrl = path
      this.uploadForm.fileStatus = '已上传'
      this.uploadForm.uploadTime = timeNow
      this.haveUploadFile = true
    },
    setUploadInfo () {
      this.uploadVisible = false
    },
    getAllDoc () {
      const userId = this.$cookie.get('userId')
      if (userId) {
        getDocumentApi
          .getAllDoc()
          .then(res => {
            if (res.data.length) {
              this.docList = res.data
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
      this.uploadForm.user_role = ''
      this.uploadForm.document = ''
      this.uploadForm.section = ''
      this.uploadForm.fileName = ''
      this.uploadForm.fileType = ''
      this.uploadForm.fileUrl = ''
      this.uploadForm.fileStatus = ''
      this.uploadForm.uploadTime = ''
      this.haveUploadFile = false
    },
    submitUpLoadForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.uploadForm.section_id = 'section' + this.uploadForm.section.toString()
          this.uploadForm.user_role = this.userRole
          getDocumentApi
            .uploadDocSection(this.uploadForm)
            .then(res => {
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
