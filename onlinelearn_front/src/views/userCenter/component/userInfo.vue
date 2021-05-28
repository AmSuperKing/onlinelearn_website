<template>
  <div class="wrapper">
    <h3>用户信息</h3>
    <el-divider></el-divider>
    <el-row>
      <el-col :sm="24" :md="12" :lg="12" :xl="12" class="info-card-box">
        <div class="info-card">
          <div class="user-favicon">{{faviconText}}</div>
          <div class="user-info">
            <p class="user-name">用户名称：{{userName}}</p>
            <p class="user-id">id：{{userId}}</p>
            <p class="user-id">角色：{{userRole}}</p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :lg="12" :xl="12" class="clock-wrapper">
        <calendar-component class="hidden-xs-only clock"></calendar-component>
        <el-image class="site-img" :src="require('../../../assets/imgs/OnlineLearn_LOGO.png')" fit="cover"></el-image>
      </el-col>
    </el-row>
    <el-row class="lizi-box">
      <vue-particles
        color="#3CB371"
        :particleOpacity="0.7"
        :particlesNumber="90"
        shapeType="circle"
        :particleSize="4"
        linesColor="#3CB371"
        :linesWidth="2"
        :lineLinked="true"
        :lineOpacity="0.6"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        class="lizi"
      ></vue-particles>
    </el-row>
  </div>
</template>

<script>
import calendarComponent from '@/components/calendarComponent'
import { userApi } from '@/api/userApi'
import { userCenterApi } from '@/api/userCenterApi'

export default {
  name: 'UserInfo',
  components: {
    calendarComponent
  },
  data () {
    return {
      userId: '',
      userName: '',
      userRole: '普通用户',
      faviconText: ''
    }
  },
  mounted () {
    this.getUserInfo()
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
            // console.log('getRole:', res.data[0].user_role)
            if (res.data[0].user_role) {
              this.userRole = res.data[0].user_role === 'usual' ? '普通用户' : '系统管理员'
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
    getUserInfo () {
      this.getRole()
      this.userId = this.$cookie.get('userId')
      const token = this.$cookie.get('token')
      if (this.userId && token) {
        userApi
          .getUserName(this.userId, token)
          .then(res => {
            // console.log('getUserName', res.data[0].user_name)
            if (res.data[0].user_name) {
              this.userName = res.data[0].user_name
              this.faviconText = this.userName.slice(0, 2)
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.wrapper {
  min-height: 90vh;
  background-color: #fff;
  h3 {
    padding-left: 10px;
  }
}
.info-card-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.info-card {
  width: 90%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  border: 1px solid #e5e9ef;
  // background-color: #fff;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .32), 0 0 6px rgba(0, 0, 0, .14);
}
.user-favicon {
  display: inline-block;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-right: 25px;
  font-size: 30px;
  font-weight: bold;
  color: #fff;
  border-radius: 50%;
  background-color: $theme-color;
}
.user-info {
  display: inline-block;
}
.user-name {
  font-size: 15px;
  color: #777;
  font-weight: 600;
}
.user-id {
  font-size: 13px;
  color: #777;
  font-weight: 500;
}

.clock-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.clock {
  margin: 10px;
}
.site-img {
  width: 300px;
  height: auto;
}
.lizi-box {
  position: relative;
  width: 80vw;
  height: 60vh;
}
#particles-js {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute; // 设置absolute,其他DIV设置为relative，这样这个例子效果就作为背景
}
</style>
