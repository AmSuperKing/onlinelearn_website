<template>
  <div>
    <h3 class="pwd-title">用户注销</h3>
    <el-divider><i class="el-icon-user"></i></el-divider>
    <div class="curr-pwd" v-if="first">
      <p>请输入当前密码：</p>
      <el-input placeholder="请输入当前密码" v-model="currPwd" show-password required></el-input>
      <el-button type="primary" class="confirm-btn" @click="confirmCurrPwd">确定</el-button>
    </div>
    <div class="curr-pwd" v-if="second">
      <el-button type="primary" class="confirm-btn" @click="commitDestory">确认注销</el-button>
      <el-button class="confirm-btn" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { userApi } from '@/api/userApi'

export default {
  name: 'UserDestory',
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
    cancel () {
      this.second = false
      this.first = true
    },
    commitDestory () {
      const param = {
        userId: this.$cookie.get('userId')
      }
      userApi
        .userDestory(param)
        .then(res => {
          // console.log(res)
          if (res.code === 200) {
            this.$message.success(res.message)
            this.$cookie.remove('userId')
            this.$store.commit('setUserId', '')
            this.$router.push({
              path: '/'
            })
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
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
