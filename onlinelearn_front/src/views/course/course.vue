<template>
  <div class="wrapper">
    <!-- 内容 -->
    <el-row>
      <!-- 左侧 -->
      <el-col :sm="3" :md="3" :lg="3" :xl="3" class="hidden-xs-only">
        <el-row>
          <div class="hold-place"></div>
        </el-row>
      </el-col>
      <!-- 中侧 -->
      <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="content-wrapper">
        <!-- 课程标签页 -->
        <el-tabs type="border-card" v-model.trim="activeName" @tab-click="handleClick">
          <!-- 全部课程 -->
          <el-tab-pane label="全部课程" name="first">
            <all-course></all-course>
          </el-tab-pane>
          <el-tab-pane label="我加入的" name="second">
            <div class="join-box" v-show="haveMyjoin">
              <my-join-course
                ref="myJoinCourse"
                v-show="showMyJoin"
                @noJoinCourse="noJoinCourse">
              </my-join-course>
              <p v-show="!showMyJoin">请先登录</p>
            </div>
            <div v-show="!haveMyjoin" class="gotoJoin">
              <el-tooltip class="item" effect="dark" content="去加入课程学习" placement="right">
                <el-button plain class="addJoin" icon="el-icon-plus" @click="gotoJoin"></el-button>
              </el-tooltip>
            </div>
          </el-tab-pane>
          <el-tab-pane label="我创建的" name="third">
            <div class="join-box" v-show="haveMycreate">
              <my-create-course
                ref="myCreateCourse"
                v-show="showMyCreate"
                @noMyCreate="noMyCreate">
              </my-create-course>
              <p v-show="!showMyCreate">请先登录</p>
            </div>
            <div v-show="!haveMycreate" class="gotoJoin">
              <el-tooltip class="item" effect="dark" content="去我的创建课程" placement="right">
                <router-link to="/userCenter/myCourse">
                  <el-button plain class="addJoin" icon="el-icon-plus"></el-button>
                </router-link>
              </el-tooltip>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!-- 右侧 -->
      <el-col :sm="3" :md="3" :lg="3" :xl="3" class="hidden-xs-only">
        <el-row>
          <div class="hold-place"></div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AllCourse from './allCourse'
import MyJoinCourse from './myJoinCourse'
import MyCreateCourse from './myCreateCourse'

export default {
  name: 'Course',
  components: {
    AllCourse,
    MyJoinCourse,
    MyCreateCourse
  },
  data () {
    return {
      activeName: 'first',
      haveMyjoin: true,
      showMyJoin: false,
      haveMycreate: true,
      showMyCreate: false
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.userId // 需要监听的数据
    }
  },
  watch: {
    isLogin (newVal, oldVal) {
      if (newVal) {
        if (this.activeName === 'second') {
          this.showMyJoin = true
          this.$refs.myJoinCourse.getJoinCourseList()
        } else if (this.activeName === 'third') {
          this.showMyCreate = true
          this.$refs.myCreateCourse.getMyCourseList()
        }
      } else {
        this.showMyJoin = false
        this.showMyCreate = false
        this.$message.warning('请先登录再获取用户信息')
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0)
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab.name)
      if (tab.name === 'second') {
        this.activeName = tab.name
        const judge = this.$store.getters.getUserId
        // console.log(judge)
        if (judge) {
          this.showMyJoin = true
          this.$refs.myJoinCourse.getJoinCourseList()
        } else {
          this.showMyJoin = false
          this.showMyCreate = false
          this.$message.warning('请先登录')
        }
      } else if (tab.name === 'third') {
        this.activeName = tab.name
        const judge = this.$store.getters.getUserId
        if (judge) {
          this.showMyCreate = true
          this.$refs.myCreateCourse.getMyCourseList()
        } else {
          this.showMyJoin = false
          this.showMyCreate = false
          this.$message.warning('请先登录')
        }
      }
    },
    noJoinCourse () {
      this.haveMyjoin = false
    },
    gotoJoin () {
      this.activeName = 'first'
    },
    noMyCreate () {
      this.haveMycreate = false
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.wrapper {
  background-color: #f9f9f9;
  background-image: url('../../assets/imgs/anna.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.hold-place {
  width: 10px;
  height: 10px;
}
.content-wrapper {
  height: 80vh;
  overflow-y: scroll;
  background-color: #fff;
  box-shadow: 15px 0 15px -15px rgba(0, 0, 0, .42), -15px 0 15px -15px rgba(0, 0, 0, .32);
}
.content-wrapper::-webkit-scrollbar {
  width: 6px; /* 对垂直流动条有效 */
}
/* 定义滚动条的轨道颜色、内阴影及圆角 */
.content-wrapper::-webkit-scrollbar-track{
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: rgb(255, 255, 255);
  border-radius: 3px;
}
/* 定义滑块颜色、内阴影及圆角 */
.content-wrapper::-webkit-scrollbar-thumb {
  position: relative;
  display: block;
  cursor: pointer;
  border-radius: 3px;
  background-color: rgba(144,147,153,0.3);
  transition: .3s background-color;
}
.join-box {
  margin: 0;
  padding: 0;
}
.gotoJoin {
  width: 300px;
  height: 450px;
}
.addJoin {
  display: inline-block;
  width: 150px;
  height: 200px;
  font-size: 32px;
  border: 1px solid #e5e9ef;
}
</style>
