<template>
  <div class="content-wrapper">
    <el-row class="page-box" v-if="haveLogin">
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
        <!-- usual -->
        <user-info v-if="showUserInfo"></user-info>
        <user-course v-if="showUserCourse"></user-course>
        <user-history v-if="showUserHistory"></user-history>
        <user-video v-if="showUserVideo"></user-video>
        <user-book v-if="showUserBook"></user-book>
        <user-discuss v-if="showUserDiscuss"></user-discuss>
        <user-pwd v-if="showUserPwd"></user-pwd>
        <user-encry v-if="showUserEncry"></user-encry>
        <user-destory v-if="showUserDestory"></user-destory>
        <!-- admin -->
        <mana-user v-if="showManaUser"></mana-user>
        <mana-doc v-if="showManaDoc"></mana-doc>
        <mana-video v-if="showManaVideo"></mana-video>
        <mana-course v-if="showManaCourse"></mana-course>
        <mana-ebook v-if="showManaEbook"></mana-ebook>
        <mana-question v-if="showManaQuestion"></mana-question>
        <mana-history v-if="showManaHistory"></mana-history>
        <mana-advice v-if="showManaAdvice"></mana-advice>
        <mana-appeal v-if="showManaAppeal"></mana-appeal>
        <mana-correct v-if="showManaCorrect"></mana-correct>
        <mana-protect v-if="showManaProtect"></mana-protect>
      </el-col>
    </el-row>
    <div v-if="!haveLogin" class="no-login">
      <h3>请 先 登 录 ！</h3>
      <el-image class="site-img" :src="require('@/assets/imgs/OnlineLearn_LOGO.png')" fit="cover"></el-image>
    </div>
  </div>
</template>

<script>
import { userCenterApi } from '@/api/userCenterApi'
// usual
import userInfo from './component/userInfo'
import userCourse from './component/userCourse'
import userHistory from './component/userHistory'
import userVideo from './component/userVideo'
import userBook from './component/userBook'
import userDiscuss from './component/userDiscuss/userDiscuss'
import userPwd from './component/userPwd'
import userEncry from './component/userEncry'
import userDestory from './component/userDestory'
// admin
import manaUser from './component/user/manaUser'
import manaDoc from './component/document/manaDoc'
import manaVideo from './component/manaVideo'
import manaCourse from './component/manaCourse'
import manaEbook from './component/manaEbook'
import manaQuestion from './component/manaQuestion'
import manaHistory from './component/manaHistory'
import manaAdvice from './component/manaAdvice'
import manaAppeal from './component/manaAppeal'
import manaCorrect from './component/manaCorrect'
import manaProtect from './component/manaProtect'

export default {
  name: 'UserCenter',
  components: {
    userInfo,
    userCourse,
    userHistory,
    userVideo,
    userBook,
    userDiscuss,
    userPwd,
    userEncry,
    userDestory,
    manaUser,
    manaDoc,
    manaVideo,
    manaCourse,
    manaEbook,
    manaQuestion,
    manaHistory,
    manaAdvice,
    manaAppeal,
    manaCorrect,
    manaProtect
  },
  data () {
    return {
      haveLogin: false,
      screenWidth: document.body.clientWidth,
      timer: '',
      showMenu: true,
      showFoldIcon: true,
      menuList: [],
      usualRole: true,
      showUserInfo: true, // usual
      showUserCourse: false,
      showUserHistory: false,
      showUserVideo: false,
      showUserBook: false,
      showUserDiscuss: false,
      showUserPwd: false,
      showUserEncry: false,
      showUserDestory: false,
      showManaUser: false, // admin
      showManaDoc: false,
      showManaVideo: false,
      showManaCourse: false,
      showManaEbook: false,
      showManaQuestion: false,
      showManaHistory: false,
      showManaAdvice: false,
      showManaAppeal: false,
      showManaCorrect: false,
      showManaProtect: false
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.userId // 需要监听的数据
    }
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
    isLogin (newVal, oldVal) {
      if (newVal !== '') {
        this.haveLogin = true
        this.getRole()
        this.getShowView()
      } else {
        this.$router.push({
          path: '/'
        })
      }
    }
  },
  mounted () {
    this.isMobile()
    this.judgeStatus()
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
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
    judgeStatus () {
      const currUserId = this.$cookie.get('userId')
      if (currUserId) {
        this.haveLogin = true
        this.getRole()
        this.getShowView()
      } else {
        this.haveLogin = false
      }
    },
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
              this.getRoleMenu(res.data[0].user_role)
            } else {
              this.$message.error('获取用户权限菜单出错')
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
    getRoleMenu (param) {
      userCenterApi
        .getRoleMenu(param)
        .then(res => {
          // console.log('getRoleMenu:', res.data)
          if (res.data.length) {
            this.menuList = res.data
            var temp = []
            temp = res.data
            temp.sort(this.sortByIndex('menu_index'))
            this.orderSort(temp)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    sortByIndex (prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (val1.length > val2.length) {
          return -1
        } else if (val1.length < val2.length) {
          return 1
        } else {
          if (val1 > val2) {
            return -1
          } else if (val1 < val2) {
            return 1
          } else {
            return 0
          }
        }
      }
    },
    orderSort (param) {
      var tempArr = []
      for (let i = param.length - 1; i >= 0; i--) {
        tempArr.push(param[i])
      }
      this.menuList = []
      this.menuList = tempArr
    },
    foldOrNot () {
      this.showMenu = !this.showMenu
      this.showFoldIcon = !this.showFoldIcon
    },
    getShowView () {
      // console.log(this.$route.params.type)
      const key = this.$route.params.type
      if (key) {
        this.changeView(key)
      }
    },
    handleSelect (key, keyPath) {
      // console.log('key, path:', key, keyPath)
      const preStrArr = this.$route.path.split('/')
      preStrArr.pop()
      const preStr = preStrArr.join('/')
      // console.log(preStr)
      if (this.$route.params.type !== key) {
        this.$router.replace({
          path: preStr + '/' + key
        })
        this.changeView(key)
      }
    },
    changeView (key) {
      switch (key) {
        case 'userInfo':
          // usual
          this.showUserInfo = true
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'myCourse':
          // usual
          this.showUserInfo = false
          this.showUserCourse = true
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'myHistory':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = true
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'myVideo':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = true
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'myEbook':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = true
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaDiscuss':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = true
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'modifyPwd':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = true
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'myEncrypted':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = true
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'destory':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = true
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaUser':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = true
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaDoc':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = true
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaVideo':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = true
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaCourse':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = true
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaEbook':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = true
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaQuestion':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = true
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaHistory':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = true
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaAdvice':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = true
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaAppeal':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = true
          this.showManaCorrect = false
          this.showManaProtect = false
          break
        case 'manaCorrect':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = true
          this.showManaProtect = false
          break
        case 'manaProtect':
          // usual
          this.showUserInfo = false
          this.showUserCourse = false
          this.showUserHistory = false
          this.showUserVideo = false
          this.showUserBook = false
          this.showUserDiscuss = false
          this.showUserPwd = false
          this.showUserEncry = false
          this.showUserDestory = false
          // admin
          this.showManaUser = false
          this.showManaDoc = false
          this.showManaVideo = false
          this.showManaCourse = false
          this.showManaEbook = false
          this.showManaQuestion = false
          this.showManaHistory = false
          this.showManaAdvice = false
          this.showManaAppeal = false
          this.showManaCorrect = false
          this.showManaProtect = true
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.content-wrapper {
  min-height: 90vh;
  overflow: scroll;
  background-color: #fff;
}
.content-wrapper::-webkit-scrollbar {
  width: 6px; /* 对垂直流动条有效 */
  height: 10px;
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
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 90%;
  min-height: 100%;
  margin-left: 10px;
  background-color: #fff;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .32), 0 0 6px rgba(0, 0, 0, .14);
}
.el-menu {
  border: 1px solid $theme-color;
}
.el-menu--collapse {
  width: 0;
}
.el-menu-item {
  font-size: 15px;
  font-weight: 500;
}
.el-menu-item:hover {
  color: #fff;
  background-color: $theme-color;
}
.el-menu-item.is-active {
  color: #fff;
  border-top: 1px solid $theme-color;
  border-bottom: 1px solid $theme-color;
  background-color: $theme-color;
}
.el-menu-item:first-child.is-active {
  border-top: none;
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
  border-top: 1px solid $theme-color;
}
.el-menu-item:first-child, .el-submenu__title:first-child {
  border-top: none;
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
  height: 50vh;
  background-color: #fff;
}
.no-login {
  width: 100vw;
  height: 100vh;
  background-color: #f8f8f8;
  padding: 20px;
  text-align: center;
  color: #fff;
}
.no-login h3 {
  white-space: nowrap;
  font-size: 32px;
  font-weight: bold;
  animation: animate .3s linear infinite;
}
.site-img {
  width: 300px;
  height: auto;
}
@keyframes animate {
  0%, 100% {
    text-shadow: -1.5px -1.5px 0 $theme-color, 1.5px 1.5px 0 rgb(255, 66, 66);
  }
  25% {
    text-shadow: 1.5px 1.5px 0 $theme-color, -1.5px -1.5px 0 rgb(255, 66, 66);
  }
  50% {
    text-shadow: 1.5px -1.5px 0 $theme-color, 1.5px -1.5px 0 rgb(255, 66, 66);
  }
  75% {
    text-shadow: -1.5px 1.5px 0 $theme-color, -1.5px 1.5px 0 rgb(255, 66, 66);
  }
}
</style>
