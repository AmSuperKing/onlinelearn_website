<template>
  <div class="wrapper">
    <div class="header-box">
      <div class="banner">
        <el-image
          :src="require('../../assets/imgs/sunset.jpg')"
          class="banner-img"
          fit="cover">
        </el-image>
      </div>
      <div class="course-header">
        <el-image
          v-if="courseInfo.imgUrl"
          :src="courseInfo.imgUrl"
          class="course-header-img"
          fit="cover">
        </el-image>
      </div>
      <div class="tabs-wrapper">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="详情" name="first">
            <div class="course-info">
              <p><span class="info-title">课程名称：</span>{{courseInfo.name}}</p>
              <p><span class="info-title">课程简介：</span>{{courseInfo.describe_text}}</p>
              <p><span class="info-title">创建者：</span>{{userName}}</p>
              <p><span class="info-title">创建时间：</span>{{courseInfo.newTime}}</p>
              <p><span class="info-title">加入：</span>当前共 {{joinNum}} 人加入</p>
              <p><span class="info-title">点击量：</span>{{courseInfo.count_num}}</p>
              <div class="join-exit-btn">
                <el-button type="success" plain v-if="showJoin" @click="joinCourse">加入课程</el-button>
                <el-button type="danger" plain v-if="showExit" @click="exitCourse">退出课程</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="课程资源" name="second">
            <resource-component ref="resource" class="resource"></resource-component>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { courseInfoApi } from '@/api/courseInfoApi'
import { userApi } from '@/api/userApi'
import resourceComponent from './component/resourceComponent'

export default {
  name: 'CourseDetail',
  components: {
    resourceComponent
  },
  data () {
    return {
      activeName: 'first',
      courseInfo: {
        name: '',
        describe_text: '',
        creator: '',
        count_num: '',
        imgUrl: 'http://127.0.0.1:8186/images/4.jpg'
      },
      userName: '',
      joinNum: 0,
      showJoin: true,
      showExit: false
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.userId // 需要监听的数据
    }
  },
  watch: {
    isLogin (newVal, oldVal) {
      if (newVal !== '') {
        this.judgeJoin()
      } else {
        this.showJoin = true
        this.showExit = false
      }
    }
  },
  mounted () {
    this.getCourseInfo()
    this.judgeJoin()
  },
  methods: {
    getCourseInfo () {
      const param = this.$route.params.type
      courseInfoApi
        .getCourseInfo(param)
        .then(res => {
          // console.log('getCourseInfo', res)
          if (res.data.length) {
            this.courseInfo = res.data[0]
            if (this.courseInfo.creator) {
              this.getUserName(this.courseInfo.creator)
            }
          } else {
            this.$message.error('获取信息出错')
          }
        })
        .catch((e) => {
          // console.log(e)
        })
      courseInfoApi
        .getJoinNum(param)
        .then(res => {
          if (res.code === 200) {
            this.joinNum = res.total
          }
        })
        .catch((e) => {
          // console.log(e)
        })
    },
    getUserName (id) {
      const param = {
        curr_id: id
      }
      userApi
        .searchName(param)
        .then(res => {
          if (res.code === 200) {
            this.userName = res.data.user_name
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(e => {
          this.$message.error(e)
        })
    },
    handleClick (tab, event) {
      if (tab.name === 'second') {
        this.$refs.resource.getSourceList()
      }
    },
    judgeJoin () {
      if (this.$store.getters.getUserId) {
        const params = {
          userId: this.$store.getters.getUserId,
          course: this.$route.params.type
        }
        courseInfoApi
          .judeJoin(params)
          .then(res => {
            // console.log('judgeJoin', res.data)
            if (res.data.haveJoin) {
              this.showJoin = false
              this.showExit = true
            } else {
              this.showJoin = true
              this.showExit = false
            }
          })
          .catch((e) => {
            // console.log(e)
          })
      } else {
        this.showJoin = true
        this.showExit = false
      }
    },
    joinCourse () {
      // console.log('this.courseInfo', this.courseInfo)
      if (this.$store.getters.getUserId) {
        const params = {
          name: this.courseInfo.name,
          text: this.courseInfo.describe_text,
          path: this.courseInfo.path,
          imgUrl: this.courseInfo.imgUrl,
          joiner: this.$store.getters.getUserId,
          count: this.courseInfo.count_num
        }
        courseInfoApi
          .joinCourse(params)
          .then(res => {
            // console.log('join', res.data)
            if (res.data.code === 200) {
              this.showJoin = false
              this.showExit = true
              this.$message.success(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch((e) => {
            // console.log(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
    exitCourse () {
      // console.log('this.courseInfo', this.courseInfo)
      const params = {
        path: this.courseInfo.path,
        userId: this.$store.getters.getUserId
      }
      courseInfoApi
        .exitCourse(params)
        .then(res => {
          // console.log('exit', res.data)
          if (res.data.code === 200) {
            this.showJoin = true
            this.showExit = false
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch((e) => {
          // console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 80vh;
  background-color: #fff;
}
.header-box {
  background-color: #fff;
  text-align: center;
}
.banner {
  width: 100%;
  height: 120px;
  background-color: #fff;
}
.banner-img {
  width: 100%;
  height: 120px;
}
.course-header {
  display: inline-block;
  width: 250px;
  height: 200px;
  margin-top: -100px;
  .course-header-img {
    border: 1px solid #e5e9ef;
  }
}
.tabs-wrapper {
  padding: 0 15px;
  margin-top: -40px;
}
.course-info {
  padding: 15px 15px 40px;
  margin-bottom: 30px;
  text-align: left;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  border: 1px solid #e5e9ef;
  background-color: #f8f8f8;
}
.info-title {
  font-size: 14px;
  font-weight: 600;
  color: rgb(100, 100, 100);
}
.join-exit-btn {
  margin-top: 50px;
}
.resource {
  margin-bottom: 40px;
}
</style>
