<template>
  <div class="about-wrapper">
    <el-row class="banner-img-box">
      <el-image
        :src="require('../../assets/imgs/sunset.jpg')"
        class="banner-img"
        fit="cover"
      ></el-image>
    </el-row>
    <el-row class="content-wrapper">
      <p class="page-title">关于</p>
      <el-row class="content-box">
        <el-col :xs="24" :md="8" :lg="8" :xl="8">
          <div class="card-wrapper">
            <div class="card-title">
              <span class="item-title"><img class="item-icon" src="../../assets/icons/zhanghao.png" alt="账号ico">账号</span>
            </div>
            <div>
              <span class="item">
                <router-link
                  class="my-router-link"
                  to="/userInfoAppeal"
                >账号申诉</router-link>
              </span>
              <span class="item">
                <router-link
                  class="my-router-link"
                  to="/userInfoAppeal"
                >密码找回</router-link>
              </span>
              <span class="item">
                <span
                  class="my-router-link"
                  @click="judgeRole"
                >账号注销</span>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="8" :lg="8" :xl="8">
          <div class="card-wrapper">
            <div class="card-title">
              <span class="item-title"><img class="item-icon" src="../../assets/icons/pencil.png" alt="账号ico">反馈</span>
            </div>
            <div>
              <span class="item">
                <el-link
                  class="item-link"
                  type="primary"
                  href="https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=amsuperking@qq.com"
                  target="_blank"
                >意见反馈</el-link>
              </span>
              <span class="item">
                <router-link to="/about/contentCorrect" class="my-router-link">
                  内容纠正
                </router-link>
              </span>
              <span class="item">
                <router-link to="/about/advice" class="my-router-link">
                  网站建议
                </router-link>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="8" :lg="8" :xl="8">
          <div class="card-wrapper">
            <div class="card-title">
              <span class="item-title">
                <img class="item-icon" src="../../assets/icons/lianxi.png" alt="账号ico">联系
              </span>
            </div>
            <div>
              <span class="item">
                <router-link to="/about/contactUs" class="my-router-link">
                  联系我们
                </router-link>
              </span>
              <span class="item">
                <router-link to="/about/protectKnow" class="my-router-link">
                  内容维权
                </router-link>
              </span>
              <span class="item">......</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { userApi } from '@/api/userApi'

export default {
  name: 'About',
  data () {
    return {
    }
  },
  methods: {
    judgeRole () {
      // console.log('judge user role')
      const currUserId = this.$cookie.get('userId')
      const userId = this.$store.state.userId
      if (currUserId && userId) {
        // console.log('已登录')
        const param = {
          user_id: currUserId
        }
        userApi
          .searchRole(param)
          .then(res => {
            // console.log('searchRole', res)
            if (res.data.user_role) {
              if (res.data.user_role === 'admin') {
                this.$message.error('管理员暂不支持注销账号')
              } else {
                this.$router.push({
                  path: '/userCenter/destory'
                })
              }
            }
          })
          .catch(() => {})
      } else {
        this.$message.warning('请先登录')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.about-wrapper {
  min-height: 70vh;
}
.banner-img-box {
  width: 100%;
  height: 25vh;
  background-color: $theme-color;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.content-wrapper {
  margin-bottom: 30px;
  background-color: #fff;
}
.content-box {
  min-width: 40vh;
  padding: 30px;
}
.page-title {
  padding: 10px;
  text-align: center;
  color: #333;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}
.card-wrapper {
  min-height: 150px;
  width: 95%;
  margin: 8px;
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
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #333;
}
.item-icon {
  width: 30px;
  height: 30px;
  margin-right: 8px;
}
.item {
  display: inline-block;
  padding: 12px;
  font-size: 15px;
  font-weight: 500;
}
.item-link {
  font-size: 15px;
  height: 17px;
  line-height: 17px;
  text-decoration: none;
}
.my-router-link {
  cursor: pointer;
  font-size: 15px;
  color: $theme-color;
  text-decoration: none;
}
.my-router-link:hover {
  text-decoration: underline;
}
</style>
