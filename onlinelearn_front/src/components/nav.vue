<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">
            <img src="../assets/imgs/OnlineLearn_LOGO.png" alt="website logo" class="img-response" height="50px">
          </a>
        </div>
        <div class="collapse navbar-collapse" id="myNavbar">
          <ul class="nav navbar-nav nav-item">
            <li><router-link to="/"> 网站主页 </router-link></li>
            <li><router-link to="/document"> 文档教程 </router-link></li>
            <li><router-link to="/videos"> 视频教程 </router-link></li>
            <li><router-link to="/ebooks"> 电子书籍 </router-link></li>
            <li><router-link to="/course"> 课程区域 </router-link></li>
            <li><router-link to="/discuss"> 留言讨论 </router-link></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li @click="showRegister" v-if="!isLogin"><a class="nav-text"><span class="glyphicon glyphicon-user"></span> 注册 </a></li>
            <li @click="showLogin" v-if="!isLogin"><a class="nav-text"><span class="glyphicon glyphicon-log-in"></span> 登录 </a></li>
            <li class="dropdown" v-if="isLogin">
              <a href="#" class="nav-text" data-toggle="dropdown">
                <span>{{userName}}</span>
                <b class="caret"></b>
              </a>
              <ul class="dropdown-menu">
                <li class="dropdown-menu-item"><router-link to="/userCenter/userInfo" class="user-menu-list">个人中心</router-link></li>
                <li class="divider"></li>
                <li class="dropdown-menu-item"><a class="user-menu-list" @click="logOut">退出</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <el-dialog
      width="300px"
      title="登录"
      :visible.sync="loginVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            type="text"
            placeholder="请输入您的账号"
            v-model.trim="loginForm.account"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            placeholder="请输入您的密码"
            v-model.trim="loginForm.password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-row>
            <el-col :span="12">
              <el-input
                type="text"
                placeholder="验证码"
                v-model.trim="loginForm.verifyCode"
                autocomplete="off"
                maxlength="4"
                show-word-limit
              />
            </el-col>
            <el-col :span="10">
              <img :src="verifyCodeUrl" alt="验证码" class="verifyCodeImg" @click="getVerifyCode"/>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="form-btns">
        <el-button @click="closeDialog" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
      <span>
        <router-link to="/userInfoAppeal">
          <el-link class="appeal-text" @click="showAppeal">账户反馈/申诉，忘记密码？</el-link>
        </router-link>
      </span>
    </el-dialog>
    <el-dialog
      width="300px"
      title="用户注册"
      :visible.sync="registerVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerForm"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            type="text"
            placeholder="自定义登录名(4-15个字)"
            v-model.trim="registerForm.account"
            autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            placeholder="设置密码"
            v-model.trim="registerForm.password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input
            type="password"
            placeholder="确认密码"
            v-model.trim="registerForm.confirmPass"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-row>
            <el-col :span="12">
              <el-input
                type="text"
                placeholder="验证码"
                v-model.trim="registerForm.verifyCode"
                autocomplete="off"
                maxlength="4"
                show-word-limit
              />
            </el-col>
            <el-col :span="10">
              <img :src="verifyCodeUrl" alt="验证码" class="verifyCodeImg" @click="getVerifyCode"/>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="form-btns">
        <el-button @click="closeDialog" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="register">注册</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引用bootstrap
import '@/assets/bootstrap3/css/bootstrap.css'
import '@/assets/bootstrap3/js/bootstrap.js'
import { userApi } from '@/api/userApi'
import { verifyCode } from '@/api/verifyCodeApi'

export default {
  name: 'NavBar',
  data () {
    return {
      userName: '用户名',
      loginVisible: false,
      registerVisible: false,
      isLogin: false,
      verifyCodeUrl: '',
      verifyCode: '',
      loginForm: {
        account: '',
        password: '',
        verifyCode: ''
      },
      registerForm: {
        account: '',
        password: '',
        confirmPass: '',
        verifyCode: ''
      },
      rules: {
        account: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }, {
          min: 4,
          max: 15,
          message: '账号长度在 4 到 15 个字符',
          trigger: 'blur'
        }],
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
        }],
        verifyCode: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }, {
          min: 4,
          max: 4,
          message: '验证码长度为4个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    changeLogin () {
      return this.$store.state.userId // 需要监听的数据
    }
  },
  watch: {
    changeLogin (newVal, oldVal) {
      if (newVal === '') {
        this.isLogin = false
        this.$message.warning('已退出登录状态')
      }
    }
  },
  mounted () {
    this.haveLogin()
  },
  methods: {
    haveLogin () {
      const currUserId = this.$cookie.get('userId')
      const token = this.$cookie.get('token')
      if (currUserId && token) {
        userApi
          .getUserName(currUserId, token)
          .then(res => {
            if (res.code === 200) {
              this.isLogin = true
              this.userName = res.data[0].user_name
              this.$store.commit('setUserId', currUserId)
            } else {
              this.$message.error(res.message)
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
          .finally(() => {})
      }
    },
    showRegister () {
      this.registerVisible = true
      this.getVerifyCode()
    },
    getVerifyCode () {
      verifyCode
        .randomCode()
        .then(res => {
          // console.log('getVerifyCode', res)
          if (res.code === 1) {
            this.verifyCodeUrl = res.data.verifyCodeImgUrl
            this.verifyCode = res.data.verifyCode
          }
        })
    },
    showLogin () {
      this.loginVisible = true
      this.getVerifyCode()
    },
    register () {
      // console.log('注册信息:', this.registerForm)
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          if (this.registerForm.verifyCode.toLowerCase() === this.verifyCode.toLowerCase()) {
            if (this.registerForm.password === this.registerForm.confirmPass) {
              userApi
                .register(this.registerForm)
                .then(res => {
                  if (res.code === 200) {
                    // console.log('res:', res)
                    this.loginForm.account = this.registerForm.account
                    this.registerForm.account = ''
                    this.registerForm.password = ''
                    this.registerForm.confirmPass = ''
                    this.registerForm.verifyCode = ''
                    this.registerVisible = false
                    this.$message.success(res.message)
                    // this.loginVisible = true
                    this.$confirm('注册成功, 是否登陆?', '提示', {
                      confirmButtonText: '登陆',
                      cancelButtonText: '取消',
                      type: 'success',
                      center: true
                    }).then(() => {
                      this.loginVisible = true
                    }).catch(() => {
                      this.loginForm.account = ''
                    })
                  } else {
                    // console.log('res:', res)
                    this.$message.error(res.message)
                    this.getVerifyCode()
                  }
                })
                .catch(e => {
                  this.$message.error(e)
                })
                .finally(() => {})
            } else {
              this.$message.error('两次密码不一致')
            }
          } else {
            this.$message.error('验证码错误')
          }
        } else {
          this.$message.warning('请先填写注册信息')
        }
      })
    },
    login () {
      // console.log('登录信息:', this.loginForm)
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.loginForm.verifyCode.toLowerCase() === this.verifyCode.toLowerCase()) {
            userApi
              .login(this.loginForm)
              .then(res => {
                if (res.data[0].user_id) {
                  // console.log(res)
                  this.userName = res.data[0].user_name
                  this.$cookie.set('userId', res.data[0].user_id, { expires: 7 })
                  this.$cookie.set('token', res.token, { expires: 7 })
                  this.$store.commit('setUserId', res.data[0].user_id)
                  this.isLogin = true
                  this.loginVisible = false
                  this.loginForm.account = ''
                  this.loginForm.password = ''
                  this.loginForm.verifyCode = ''
                  this.$message.success(res.message)
                } else {
                  // console.log(res.data)
                  this.$message.error(res.message)
                  this.getVerifyCode()
                }
              })
              .catch(e => {
                this.$message.error(e)
              })
              .finally(() => {})
          } else {
            this.$message.error('验证码错误')
          }
        } else {
          this.$message.warning('请先填写登录信息')
        }
      })
    },
    closeDialog () {
      this.registerVisible = false
      this.loginVisible = false
      this.loginForm.account = ''
      this.loginForm.password = ''
      this.loginForm.verifyCode = ''
      this.registerForm.account = ''
      this.registerForm.password = ''
      this.registerForm.confirmPass = ''
      this.registerForm.verifyCode = ''
    },
    logOut () {
      this.$cookie.remove('userId')
      this.$store.commit('setUserId', '')
      this.isLogin = false
      this.$message.success('退出成功')
    },
    showAppeal () {
      this.loginVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.navbar {
  margin-top: 0;
  margin-bottom: 0;
  border-top: none;
}
.navbar-default {
  border-radius: 0;
  background-color: rgba(60, 179, 113, .2);
  border-color: rgba(60, 179, 113, .2);
}
.navbar-brand {
  padding-top: 2px;
  padding-left: 20px;
  padding-right: 20px;
  color: $theme-color;
  font-style: italic;
  font-weight: bold;
}
.navbar-brand:hover {
  color: #3CB371;
  font-style: italic;
  background: transparent;
}
.navbar-default .navbar-nav > li > a {
  color: $theme-color;
  font-size: 16px;
  font-weight: bold;
}
.navbar-default .navbar-nav > li > a:hover {
  color: #fff;
  background: $theme-color;
}
.nav-item > li > a {
  padding: 19px 20px;
}
.nav-text {
  padding: 19px 15px;
}
.nav-text:hover {
  cursor: pointer;
}
.dropdown-menu .divider {
  margin: 2px 0;
}
.dropdown-menu-item:hover {
  cursor: pointer;
}
.user-menu-list {
  color: $theme-color;
  background: #fff;
  padding: 10px;
}
.user-menu-list:hover {
  color: #fff;
  background: $theme-color;
}
.verifyCodeImg {
  margin-left: 10px;
  width: 100%;
  height: 40px;
}
.form-btns {
  display: flex;
  justify-content: center;
  align-items: center;
}
.cancel-btn {
  margin-right: 15px;
}
.form-item-label {
  line-height: 20px;
}
.appeal-text {
  display: inline-block;
  margin: 20px 4px;
  text-align: center;
  font-size: 12px;
  color: #c7c7c7;
  text-decoration: underline
}
.appeal-text:hover {
  text-decoration: none;
}
</style>

<style lang="scss">
.el-message-box {
  width: 300px !important;
}
</style>
