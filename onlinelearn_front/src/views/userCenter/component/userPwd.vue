<template>
  <div>
    <h3 class="pwd-title">密码修改</h3>
    <el-divider><i class="el-icon-user"></i></el-divider>
    <div class="curr-pwd" v-if="first">
      <p>请输入当前密码：</p>
      <el-input placeholder="请输入当前密码" v-model="currPwd" show-password required></el-input>
      <el-button type="primary" class="confirm-btn" @click="confirmCurrPwd">确定</el-button>
    </div>
    <div class="curr-pwd" v-if="second">
      <p>请输入新密码：</p>
      <el-input placeholder="请输入新密码" v-model="newPwd1" show-password required></el-input>
      <p>确认新密码：</p>
      <el-input placeholder="确认新密码" v-model="newPwd2" show-password required></el-input>
      <el-button type="primary" class="confirm-btn" @click="commitNewPwd">修改密码</el-button>
      <el-button class="confirm-btn" @click="cancelChange">取消</el-button>
    </div>
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
      newPwd1: '',
      newPwd2: ''
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
    cancelChange () {
      this.newPwd1 = ''
      this.newPwd2 = ''
      this.second = false
      this.first = true
    },
    commitNewPwd () {
      if (this.newPwd1 === this.newPwd2) {
        const params = {
          pwd: this.newPwd1,
          userId: this.$cookie.get('userId')
        }
        userApi
          .changePwd(params)
          .then(res => {
            // console.log('changePwd', res)
            if (res.code === 200) {
              this.$message.success(res.message)
              this.newPwd1 = ''
              this.newPwd2 = ''
              this.second = false
              this.first = true
              setTimeout(() => {
                this.$cookie.remove('userId')
                this.$store.commit('setUserId', '')
              }, 1000)
              this.$router.push({
                path: '/'
              })
            }
          })
      } else {
        this.$message.error('两次密码不一致')
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
