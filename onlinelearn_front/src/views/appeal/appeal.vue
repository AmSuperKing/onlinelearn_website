<template>
  <div class="page-wrapper">
    <el-row class="appeal-box">
      <el-col :sm="24" :md="12" :lg="12" :xl="12" class="form-box">
        <p class="form-title">账户申诉/反馈</p>
        <el-form
          v-show="findByAppear"
          v-loading="commitLoading"
          :model="appealForm"
          :rules="rules"
          ref="appealForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="申诉账号" prop="account">
            <el-input
              placeholder="申诉账号名称"
              v-model.trim="appealForm.account">
            </el-input>
          </el-form-item>
          <el-form-item label="申诉问题" prop="title">
            <el-input
              placeholder="请填写问题"
              v-model.trim="appealForm.title">
            </el-input>
          </el-form-item>
          <el-form-item label="问题时间" required>
            <el-form-item prop="date">
              <!-- <el-date-picker
                type="date"
                placeholder="请选择问题发生时间"
                v-model="appealForm.date"
                value-format="yyyy-MM-dd"
                style="width: 100%;">
              </el-date-picker> -->
              <el-date-picker
                v-model="appealForm.date"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="问题描述" prop="desc">
            <el-input
              type="textarea"
              placeholder="请填写问题描述"
              v-model.trim="appealForm.desc"
              maxlength="120"
              :autosize="{ minRows: 3, maxRows: 5}"
              show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="申诉佐证" prop="prove">
            <el-input
              type="textarea"
              placeholder="请填写申诉佐证，如最近收藏过的文档，视频等"
              v-model.trim="appealForm.prove"
              maxlength="120"
              :autosize="{ minRows: 3, maxRows: 5}"
              show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contact">
            <el-input
              placeholder="请填写联系方式，方便反馈联系"
              v-model.trim="appealForm.contact"
              maxlength="30">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('appealForm')">提交</el-button>
            <el-button @click="resetForm('appealForm')">重置</el-button>
            <el-button @click="findPwd()">密保找回</el-button>
          </el-form-item>
        </el-form>

        <el-form
          v-show="findByQA"
          v-loading="resetLoading"
          :model="formQA"
          :rules="rules"
          ref="formQA"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="申诉账号" prop="account" v-show="showQAacount">
            <el-input
              placeholder="申诉账号名称"
              v-model.trim="formQA.account"
              style="width: 90%;">
            </el-input>
          </el-form-item>
          <!-- 密码问题 -->
          <el-form-item label="密码问题" v-show="showQAquestion">
            <el-select
              v-model.trim="formQA.question"
              placeholder="请选择回答的密保问题">
              <el-option
                v-for="item of qaList"
                :key="item.index"
                :label="item.question"
                :value="item.question">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="回答" v-show="showQAquestion">
            <el-input
              placeholder="回答"
              v-model.trim="formQA.answer"
              style="width: 90%;">
            </el-input>
          </el-form-item>
          <!-- 设置新密码 -->
          <el-form-item label="密码" prop="password" v-show="setNewPwd">
            <el-input
              type="password"
              placeholder="设置新密码"
              v-model.trim="formQA.password"
              autocomplete="off"
              show-password
              style="width: 90%;"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password" v-show="setNewPwd">
            <el-input
              type="password"
              placeholder="确认密码"
              v-model.trim="formQA.confirmPass"
              autocomplete="off"
              show-password
              style="width: 90%;"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="backPre()">返回</el-button>
            <el-button @click="goNext()">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { appealApi } from '@/api/appealApi'
import { userApi } from '@/api/userApi'

export default {
  name: 'Appeal',
  data () {
    return {
      findByAppear: true,
      findByQA: false,
      commitLoading: false,
      resetLoading: false,
      appealForm: {
        account: '',
        title: '',
        date: '',
        desc: '',
        prove: '',
        contact: ''
      },
      showQAacount: true,
      showQAquestion: false,
      setNewPwd: false,
      formQA: {
        account: '',
        question: '',
        answer: '',
        password: '',
        confirmPass: ''
      },
      qaList: [],
      confirmRes: '',
      rules: {
        account: [
          { required: true, message: '请输入申诉的账号', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入申诉的问题', trigger: 'blur' },
          { min: 4, max: 50, message: '长度在 4 到 50 个字', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择出现问题时间', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写问题详情', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请填写联系方式', trigger: 'blur' }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: '密码长度在6到16个字符',
          trigger: 'blur'
        }],
        confirmPass: [{
          required: true,
          message: '请再次输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: '密码长度在6到16个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.appealForm)
          this.commitLoading = true
          appealApi
            .submitAppeal(this.appealForm)
            .then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$refs.appealForm.resetFields()
              } else {
                this.$message.warning(res.message)
              }
            })
            .catch((e) => {
              // console.log(e)
            })
            .finally(() => {
              this.commitLoading = false
            })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    findPwd () {
      this.findByAppear = false
      this.findByQA = true
      this.$refs.appealForm.resetFields()
    },
    backPre () {
      if (this.showQAacount) {
        this.findByQA = false
        this.findByAppear = true
        this.$refs.formQA.resetFields()
      } else if (this.showQAquestion) {
        this.showQAacount = true
        this.showQAquestion = false
      } else if (this.setNewPwd) {
        this.setNewPwd = false
        this.showQAquestion = true
      }
    },
    goNext () {
      if (this.showQAacount) {
        if (this.formQA.account) {
          appealApi
            .getQuestion(this.formQA.account)
            .then(res => {
              if (res.code === 200) {
                this.qaList = res.data
                this.showQAacount = false
                this.showQAquestion = true
              } else {
                this.$message.warning(res.message)
              }
            })
        } else {
          this.$message.warning('请填写申诉账号')
        }
      } else if (this.showQAquestion) {
        const quesAns = {
          user_name: '',
          question: '',
          answer: ''
        }
        if (this.formQA.question && this.formQA.answer) {
          quesAns.user_name = this.formQA.account
          quesAns.question = this.formQA.question
          quesAns.answer = this.formQA.answer
          appealApi
            .confirmAnswer(quesAns)
            .then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.confirmRes = res.code
                this.showQAquestion = false
                this.setNewPwd = true
              } else {
                this.$message.error(res.message)
              }
            })
            .catch((e) => {
              this.$message.error(e)
            })
        } else {
          this.$message.warning('请选择密保问题回答')
        }
      } else if (this.setNewPwd) {
        if (this.formQA.password === this.formQA.confirmPass) {
          if (this.confirmRes === 200) {
            this.resetLoading = true
            userApi
              .resetPwd(this.formQA)
              .then(res => {
                if (res.code === 200) {
                  this.$refs.formQA.resetFields()
                  this.formQA.account = ''
                  this.formQA.question = ''
                  this.formQA.answer = ''
                  this.formQA.password = ''
                  this.formQA.confirmPass = ''
                  this.qaList = []
                  this.$confirm(res.message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success',
                    center: true
                  }).then(() => {
                    this.$router.push({
                      path: '/'
                    })
                  }).catch(() => {
                    this.setNewPwd = false
                    this.showQAacount = true
                    this.findByAppear = true
                    this.findByQA = false
                  })
                }
              })
              .catch((e) => {
                this.$message.error(e)
              })
              .finally(() => {
                this.resetLoading = false
              })
          }
        } else {
          this.$message.error('两次密码不一致')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  min-height: 60vh;
  background-color: #f9f9f9;
}
.appeal-box {
  display: flex;
  justify-content: center;
}
.form-box {
  min-width: 50vw;
  min-height: 50vh;
  margin-bottom: 30px;
  padding: 30px 15px;
  background-color: #fff;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
}
.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 30px;
}
</style>
