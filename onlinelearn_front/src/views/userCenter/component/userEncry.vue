<template>
  <div>
    <h3 class="pwd-title">密保管理</h3>
    <el-divider><i class="el-icon-user"></i></el-divider>
    <div class="curr-pwd" v-if="first">
      <p>请输入当前密码：</p>
      <el-input placeholder="请输入当前密码" v-model="currPwd" show-password required></el-input>
      <el-button type="primary" class="confirm-btn" @click="confirmCurrPwd">确定</el-button>
    </div>
    <div class="curr-pwd" v-if="second">
      <div v-if="haveEncry">
        <p>密保问题1：</p>
        问题1：<el-input placeholder="密保问题1" :value="quesAns[0].question1" required></el-input>
        回答1：<el-input placeholder="密保回答1" :value="quesAns[0].answer1" required></el-input>
        <el-divider></el-divider>
        <p>密保问题2：</p>
        问题2：<el-input placeholder="密保问题2" :value="quesAns[1].question2" required></el-input>
        回答2：<el-input placeholder="密保回答2" :value="quesAns[1].answer2" required></el-input>
      </div>
      <h3 v-if="!haveEncry">暂未设置密保</h3>
      <el-button type="primary" class="confirm-btn" @click="changeEncry" v-if="second && haveEncry">修改密保</el-button>
      <el-button type="primary" class="confirm-btn" @click="setEncry" v-if="!haveEncry">设置密保</el-button>
      <el-button class="confirm-btn" @click="cancel" v-if="second">取消</el-button>
    </div>
    <el-dialog
      title="设置密保"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="370px">
      <el-form :model="changeForm" ref="changeForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="问题1" prop="q1" required maxlength="120">
          <el-input v-model="changeForm.q1"></el-input>
        </el-form-item>
        <el-form-item label="回答1" prop="a1" required maxlength="120">
          <el-input v-model="changeForm.a1"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="问题2" prop="q2" required maxlength="120">
          <el-input v-model="changeForm.q2"></el-input>
        </el-form-item>
        <el-form-item label="回答2" prop="a2" required maxlength="120">
          <el-input v-model="changeForm.a2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userApi } from '@/api/userApi'

export default {
  name: 'UserPwd',
  data () {
    return {
      currPwd: '',
      first: true,
      second: false,
      quesAns: [{
        question1: '',
        answer1: ''
      }, {
        question2: '',
        answer2: ''
      }],
      dialogVisible: false,
      haveEncry: true,
      changeForm: {
        q1: '',
        a1: '',
        q2: '',
        a2: '',
        userId: ''
      }
    }
  },
  mounted () {

  },
  methods: {
    confirmCurrPwd () {
      if (this.currPwd) {
        const params = {
          userId: this.$cookie.get('userId'),
          pwd: this.currPwd
        }
        userApi
          .confirmPwd(params)
          .then(res => {
            // console.log('confirmPwd', res)
            if (res.code === 200) {
              this.$message.success(res.message)
              this.currPwd = ''
              this.first = false
              this.second = true
              this.getQuesAns()
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请填写当前密码')
      }
    },
    cancel () {
      this.quesAns = []
      this.dialogVisible = false
      this.second = false
      this.first = true
    },
    getQuesAns () {
      const param = {
        userId: this.$cookie.get('userId')
      }
      userApi
        .getQuesAns(param)
        .then(res => {
          // console.log(res)
          if (res.data.length) {
            this.quesAns = res.data
            this.haveEncry = true
          } else {
            this.haveEncry = false
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    changeEncry () {
      this.dialogVisible = true
      if (this.quesAns.length) {
        this.changeForm.q1 = this.quesAns.question1
        this.changeForm.a1 = this.quesAns.answer1
        this.changeForm.q2 = this.quesAns.question2
        this.changeForm.a2 = this.quesAns.answer2
      } else {
        this.changeForm.q1 = ''
        this.changeForm.a1 = ''
        this.changeForm.q2 = ''
        this.changeForm.a2 = ''
      }
    },
    setEncry () {
      this.dialogVisible = true
      if (this.quesAns.length) {
        this.changeForm.q1 = this.quesAns.question1
        this.changeForm.a1 = this.quesAns.answer1
        this.changeForm.q2 = this.quesAns.question2
        this.changeForm.a2 = this.quesAns.answer2
      } else {
        this.changeForm.q1 = ''
        this.changeForm.a1 = ''
        this.changeForm.q2 = ''
        this.changeForm.a2 = ''
      }
    },
    commitChange () {
      if (this.changeForm.q1 && this.changeForm.a1 && this.changeForm.q2 && this.changeForm.a2) {
        this.changeForm.userId = this.$cookie.get('userId')
        // console.log(this.changeForm)
        userApi
          .updateEncry(this.changeForm)
          .then(res => {
            // console.log('commitChange', res)
            if (res.code === 200) {
              this.$message.success(res.message)
              this.dialogVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请填写完整密保的问题与答案')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pwd-title {
  padding-left: 15px;
}
.curr-pwd {
  width: 370px;
  margin: 30px 10px;
}
.confirm-btn {
  margin: 15px;
}
</style>
