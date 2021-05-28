<template>
  <div class="center-wrapper">
    <el-row class="page-box">
      <el-col :sm="24" :md="4" :lg="4" :xl="4" class="list-wrapper">
        <div class="btns-wrapper">
          <el-button @click="foldOrNot" size="small" class="small-btn-padding">
            <i class="el-icon-s-fold fold-icon-size" v-show="showFoldIcon"></i>
            <i class="el-icon-s-unfold fold-icon-size" v-show="!showFoldIcon"></i>
          </el-button>
        </div>
        <div v-show="showMenu">
          <el-menu
            :default-active="$route.params.type"
            class="el-menu-vertical-demo"
            @select="handleSelect" >
            <template v-for="item of menuList">
              <el-menu-item :index="item.menu_title" :key="item.index">
                <span slot="title">{{item.menu_name}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-col>
      <el-col :sm="24" :md="20" :lg="20" :xl="20" class="section-content">
        <!-- about us -->
        <div v-if="showAboutUs">
          <h3 class="about-title">关于我们</h3>
          <el-divider content-position="left">
              <router-link to="/" class="divider-link">OnlineLearn在线学习</router-link>
          </el-divider>
          <el-row>
            <el-col :sm="24" :md="12" :lg="12" :xl="12">
              <p class="about-text">
                <el-link class="item-link" type="primary" href="/">OnlineLearn在线学习</el-link>
                本站旨在为广大用户提供一个良好的交流学习环境，
                我们不违法盗取使用任何资源获取利益，
                站点所有源均转载自互联网公开渠道。
                我们致力于在不花费的情况下，搜罗互联网公开免费开放的资源，
                所有资源是完全免费的，并且会根据收罗得到、受允许的互联网的开放内容更新本站内容。
                同时本站内容如果有不足的地方，也欢迎各位用户在本站留言提供意见。
                本站的所有资源请勿用为私利利益化，
                仅供网友交流学习使用，请勿用作商业用途，支持正版！
              </p>
            </el-col>
            <el-col :sm="24" :md="12" :lg="12" :xl="12" class="site-img-box">
              <el-image class="site-img" :src="require('../../assets/imgs/OnlineLearn_LOGO.png')" fit="cover"></el-image>
            </el-col>
          </el-row>
        </div>
        <!-- contact us -->
        <div v-if="showContactUs">
          <h3 class="about-title">联系我们</h3>
          <el-divider content-position="left">
              <router-link to="/" class="divider-link">OnlineLearn在线学习</router-link>
          </el-divider>
          <el-row>
            <el-col :sm="24" :md="12" :lg="12" :xl="12">
              <div class="card-wrapper">
                <div class="card-title">
                  <span class="item-title">联系方式</span>
                </div>
                <p style="padding: 5px 10px 0;">
                  联系邮箱：
                  <el-link href="mailto:amsuperking@qq.com" class="mail-address" type="primary">
                    amsuperking@qq.com
                  </el-link>
                </p>
                <p style="padding: 0 10px;">QQ：2513205092</p>
                <p style="padding: 0 10px 10px; text-align: justify;">
                  在使用本网站的过程中，如有需要，您也可以通过站内反馈联系我们，
                  但建议您邮箱联系我们，站内管理员可能不一定随时在线，
                  但邮箱将随时在线，我们收到您的联系事宜后将尽快回复您。
                </p>
              </div>
            </el-col>
            <el-col :sm="24" :md="12" :lg="12" :xl="12" class="site-img-box">
              <el-image class="site-img" :src="require('../../assets/imgs/OnlineLearn_LOGO.png')" fit="cover"></el-image>
            </el-col>
          </el-row>
        </div>
        <!-- contentCorrect -->
        <div v-if="showContentCorrect">
          <h3 class="about-title">内容纠正</h3>
          <el-divider content-position="left">
              <router-link to="/" class="divider-link">OnlineLearn在线学习</router-link>
          </el-divider>
          <el-row>
            <el-col :sm="24" :md="12" :lg="12" :xl="12">
              <el-form
                ref="correctForm"
                label-position="right"
                label-width="80px"
                :rules="rules"
                :model="correctForm"
                style="padding: 15px;">
                <el-form-item label="名称" prop="title">
                  <el-input
                    placeholder="请填写模块名称"
                    v-model.trim="correctForm.title"
                    maxlength="120">
                  </el-input>
                </el-form-item>
                <el-form-item label="章节" prop="section">
                  <el-input
                    placeholder="请填写章节名称"
                    v-model.trim="correctForm.section"
                    maxlength="120">
                  </el-input>
                </el-form-item>
                <el-form-item label="内容问题" prop="content">
                  <el-input
                    placeholder="请填写描述"
                    type="textarea"
                    maxlength="120"
                    show-word-limit
                    :autosize="{ minRows: 3, maxRows: 5}"
                    v-model.trim="correctForm.content">
                  </el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                  <el-input
                    placeholder="方便我们联系您进行反馈"
                    v-model.trim="correctForm.contact"
                    maxlength="120">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitCorrect">提交</el-button>
                  <el-button @click="resetForm('correctForm')">重置</el-button>
                </el-form-item>
              </el-form>
              <div>
                <p class="about-text">
                  您也可以通过
                  <el-link
                    class="item-link"
                    type="primary"
                    href="https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=amsuperking@qq.com"
                    target="_blank"
                  >邮箱</el-link>
                  发送更多内容
                </p>
              </div>
            </el-col>
            <el-col :sm="24" :md="12" :lg="12" :xl="12" class="site-img-box">
              <el-image class="site-img" :src="require('../../assets/imgs/OnlineLearn_LOGO.png')" fit="cover"></el-image>
            </el-col>
          </el-row>
        </div>
        <!-- protectKnow -->
        <div v-if="showProtectKnow">
          <h3 class="about-title">内容维权</h3>
          <el-divider content-position="left">
              <router-link to="/" class="divider-link">OnlineLearn在线学习</router-link>
          </el-divider>
          <el-row>
            <el-col :sm="24" :md="12" :lg="12" :xl="12">
              <el-form
                ref="protectForm"
                label-position="right"
                label-width="80px"
                :rules="rules"
                :model="protectForm"
                style="padding: 15px;">
                <el-form-item label="名称" prop="title">
                  <el-input
                    placeholder="请填写模块名称"
                    v-model.trim="protectForm.title"
                    maxlength="120">
                  </el-input>
                </el-form-item>
                <el-form-item label="章节" prop="section">
                  <el-input
                    placeholder="请填写章节名称"
                    v-model.trim="protectForm.section"
                    maxlength="120">
                  </el-input>
                </el-form-item>
                <el-form-item label="内容问题" prop="content">
                  <el-input
                    placeholder="请填写描述,方便我们维护您的权益"
                    type="textarea"
                    maxlength="120"
                    show-word-limit
                    :autosize="{ minRows: 3, maxRows: 5}"
                    v-model.trim="protectForm.content">
                  </el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact" required>
                  <el-input
                    placeholder="方便我们联系您进行反馈"
                    v-model.trim="protectForm.contact"
                    maxlength="120">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitProtect">提交</el-button>
                  <el-button @click="resetForm('protectForm')">重置</el-button>
                </el-form-item>
              </el-form>
              <div>
                <p class="about-text">
                  您也可以通过
                  <el-link
                    class="item-link"
                    type="primary"
                    href="https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=amsuperking@qq.com"
                    target="_blank"
                  >邮箱</el-link>
                  发送更多内容
                </p>
              </div>
            </el-col>
            <el-col :sm="24" :md="12" :lg="12" :xl="12" class="site-img-box">
              <el-image class="site-img" :src="require('../../assets/imgs/OnlineLearn_LOGO.png')" fit="cover"></el-image>
            </el-col>
          </el-row>
        </div>
        <!-- advice -->
        <div v-if="showAdvice">
          <h3 class="about-title">网站建议</h3>
          <el-divider content-position="left">
            <router-link to="/" class="divider-link">OnlineLearn在线学习</router-link>
          </el-divider>
          <el-row>
            <el-col :sm="24" :md="12" :lg="12" :xl="12">
              <el-form
                ref="adviceForm"
                label-position="right"
                label-width="80px"
                :rules="rules"
                :model="adviceForm"
                style="padding: 15px;">
                <el-form-item label="您的建议" prop="content">
                  <el-input
                    placeholder="请填写您的建议"
                    type="textarea"
                    maxlength="120"
                    show-word-limit
                    :autosize="{ minRows: 3, maxRows: 5}"
                    v-model.trim="adviceForm.content">
                  </el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                  <el-input
                    placeholder="方便我们联系您进行反馈"
                    v-model.trim="adviceForm.contact"
                    maxlength="120">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitAdvice">提交</el-button>
                  <el-button @click="resetForm('adviceForm')">重置</el-button>
                </el-form-item>
              </el-form>
              <div>
                <p class="about-text">
                  您也可以通过
                  <el-link
                    class="item-link"
                    type="primary"
                    href="https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=amsuperking@qq.com"
                    target="_blank"
                  >邮箱</el-link>
                  发送更多内容
                </p>
              </div>
            </el-col>
            <el-col :sm="24" :md="12" :lg="12" :xl="12" class="site-img-box">
              <el-image class="site-img" :src="require('../../assets/imgs/OnlineLearn_LOGO.png')" fit="cover"></el-image>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { aboutApi } from '@/api/aboutApi'

export default {
  name: 'AboutDetail',
  data () {
    return {
      screenWidth: document.body.clientWidth,
      timer: '',
      showMenu: true,
      showFoldIcon: true,
      showAboutUs: true,
      showContactUs: false,
      showContentCorrect: false,
      showProtectKnow: false,
      showAdvice: false,
      menuList: [{
        menu_title: 'aboutUs',
        menu_name: '关于我们'
      }, {
        menu_title: 'contactUs',
        menu_name: '联系我们'
      }, {
        menu_title: 'contentCorrect',
        menu_name: '内容纠正'
      }, {
        menu_title: 'protectKnow',
        menu_name: '内容维权'
      }, {
        menu_title: 'advice',
        menu_name: '网站建议'
      }],
      correctForm: {
        title: '',
        section: '',
        content: '',
        contact: ''
      },
      protectForm: {
        title: '',
        section: '',
        content: '',
        contact: ''
      },
      adviceForm: {
        content: '',
        contact: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入内容模块名称', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字', trigger: 'blur' }
        ],
        section: [
          { required: true, message: '请输入内容小节名称', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请描述内容出现的问题', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.isMobile()
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
    }
    this.showWhich()
  },
  watch: {
    // 屏幕尺寸监听方法
    screenWidth (newValue) {
    // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = newValue
        this.timer = true
        setTimeout(() => {
          // console.log(this.screenWidth)
          if (this.screenWidth >= 780) {
            this.showMenu = true
          } else {
            this.showMenu = false
          }
          this.timer = false
        }, 300)
      }
    },
    // 监听地址栏变化
    $route (to, from) {
      // console.log(to, from)
      this.showWhich()
    }
  },
  methods: {
    // 判断是否为移动设备
    isMobile () {
      const deviceType = /Android|iPhone|iPad|iPad Pro|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent)
      // console.log(deviceType)
      if (deviceType) {
        this.showMenu = false
      }
    },
    foldOrNot () {
      this.showMenu = !this.showMenu
      this.showFoldIcon = !this.showFoldIcon
    },
    showWhich () {
      const showKey = this.$route.params.type
      if (showKey === 'aboutUs') {
        this.showAboutUs = true
        this.showContactUs = false
        this.showContentCorrect = false
        this.showProtectKnow = false
        this.showAdvice = false
      } else if (showKey === 'contactUs') {
        this.showAboutUs = false
        this.showContactUs = true
        this.showContentCorrect = false
        this.showProtectKnow = false
        this.showAdvice = false
      } else if (showKey === 'contentCorrect') {
        this.showAboutUs = false
        this.showContactUs = false
        this.showContentCorrect = true
        this.showProtectKnow = false
        this.showAdvice = false
      } else if (showKey === 'protectKnow') {
        this.showAboutUs = false
        this.showContactUs = false
        this.showContentCorrect = false
        this.showProtectKnow = true
        this.showAdvice = false
      } else {
        this.showAboutUs = false
        this.showContactUs = false
        this.showContentCorrect = false
        this.showProtectKnow = false
        this.showAdvice = true
      }
    },
    handleSelect (key, keyPath) {
      // console.log('key, path:', key, keyPath)
      if (key !== this.$route.params.type) {
        const pathArr = this.$route.path.split('/')
        pathArr.pop()
        const preStr = pathArr.join('/')
        this.$router.replace({
          path: preStr + '/' + key
        })
        this.showWhich()
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitCorrect () {
      this.$refs.correctForm.validate((valid) => {
        if (valid) {
          // console.log('this.correctForm', this.correctForm)
          aboutApi
            .addCorrect(this.correctForm)
            .then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$refs.correctForm.resetFields()
              } else {
                this.$message.error(res.message)
              }
            })
            .catch((e) => {
              // console.log(e)
            })
        } else {
          return false
        }
      })
    },
    submitProtect () {
      this.$refs.protectForm.validate((valid) => {
        if (valid) {
          // console.log('this.protectForm', this.protectForm)
          aboutApi
            .addProtect(this.protectForm)
            .then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$refs.protectForm.resetFields()
              } else {
                this.$message.error(res.message)
              }
            })
            .catch((e) => {
              // console.log(e)
            })
        } else {
          return false
        }
      })
    },
    submitAdvice () {
      this.$refs.adviceForm.validate((valid) => {
        if (valid) {
          // console.log('this.adviceForm', this.adviceForm)
          aboutApi
            .addAdvice(this.adviceForm)
            .then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$refs.adviceForm.resetFields()
              } else {
                this.$message.error(res.message)
              }
            })
            .catch((e) => {
              // console.log(e)
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.center-wrapper {
  min-height: 40vh;
  background-color: #f9f9f9;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 90%;
  min-height: 100%;
  margin-left: 10px;
  background-color: #fff;
  // border-right: 1px solid #ddd
}
.el-menu {
  border: 1px solid #e5e9ef;
}
.el-menu--collapse {
  width: 0;
}
.el-menu-item {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #e5e9ef;
}
.el-menu-item:hover {
  color: $theme-color;
}
.el-menu-item.is-active {
  color: #fff;
  border-top: 1px solid #e5e9ef;
  border-bottom: 1px solid #e5e9ef;
  background-color: $theme-color;
}
.el-menu-item:first-child.is-active {
  border-top: none;
}
.el-menu-item:last-child {
  border-bottom: none;
}
.el-menu-item:last-child.is-active {
  border-bottom: none;
}
.el-menu-item, .el-submenu__title {
  height: 50px;
  line-height: 50px;
  color: $theme-color;
  font-weight: 600;
  text-align: center;
}
.list-wrapper {
  padding: 10px;
}
.btns-wrapper {
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(255, 255, 255);
}
.small-btn-padding {
  padding: 3px 9px;
}
.fold-icon-size {
  font-size: 22px;
}
.menu-item-border {
  border-bottom: 1px solid rgb(255, 255, 255);
}
.section-content {
  min-height: 70vh;
  background-color: #fff;
}
.about-title {
  padding: 20px;
}
.divider-link {
  text-decoration: none;
  font-size: 14px;
  color: $theme-color;
}
.about-text {
  padding: 20px;
  margin-bottom: 40px;
  line-height: 30px;
  text-align: justify;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
.item-link {
  font-size: 15px;
  height: 15px;
  line-height: 15px;
  text-decoration: none;
}
.site-img-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.site-img {
  width: 300px;
  height: auto;
}
.card-wrapper {
  min-height: 150px;
  width: 90%;
  margin: 8px auto;
  border: 1px solid #e5e9ef;
  border-radius: 8px;
}
.card-title {
  margin: 0;
  padding: 6px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #e5e9ef;
}
.item-title {
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #333;
}
.mail-address {
  text-decoration: none;
}
</style>
