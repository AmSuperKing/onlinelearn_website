<template>
  <div>
    <el-row>
      <el-col :sm="24" :md="4" :lg="4" :xl="4" class="list-wrapper">
        <div class="btns-wrapper">
          <el-button @click="foldOrNot" size="small" class="small-btn-padding">
            <i class="el-icon-s-fold fold-icon-size" v-show="showFoldIcon"></i>
            <i class="el-icon-s-unfold fold-icon-size" v-show="!showFoldIcon"></i>
          </el-button>
          <span class="star-btn" @click="collectToHistory">
            <el-tooltip content="收藏到书签" placement="bottom" effect="light">
              <i class="el-icon-star-off collect-star-icon"></i>
            </el-tooltip>
          </span>
        </div>
        <div v-show="showMenu">
          <el-menu
            :default-active="$route.params.section"
            class="el-menu-vertical-demo"
            @select="handleSelect" >
            <template v-for="item of sectionListData">
              <el-menu-item class="menu-item-border" :index="item.section_id" :key="item.section_key">
                <span slot="title">{{item.section_title}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-col>
      <el-col :sm="24" :md="20" :lg="20" :xl="20" class="section-content" v-loading="loading">
        <div>
          <iframe :srcdoc="section_content" class="section-text">
            <p>您的浏览器不支持  iframe 标签。</p>
          </iframe>
        </div>
      </el-col>
    </el-row>
    <!-- 二维码按钮 -->
    <urlQrcode ref="shareUrlCode"></urlQrcode>
  </div>
</template>

<script>
import { getDocumentApi } from '@/api/getDocumentApi'
import urlQrcode from '../../index/urlQrcode'
import { historyApi } from '@/api/historyApi'

export default {
  name: 'DocumentDetail',
  components: {
    urlQrcode
  },
  data () {
    return {
      screenWidth: document.body.clientWidth,
      timer: '',
      prefixPath: '',
      documentName: '',
      showMenu: true,
      showFoldIcon: true,
      sectionListData: [],
      loading: false,
      section_content: '',
      currSectionInfo: {
        section_id: '',
        section_key: '',
        section_title: '',
        video_name: ''
      },
      addParams: {
        title: '',
        time: '',
        id: '',
        path: ''
      }
    }
  },
  mounted () {
    this.isMobile()
    // this.getPrefixPath()
    this.getDocSectionList()
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
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
    getPrefixPath () {
      // console.log('this.$route:', this.$route.path)
      var pathArr = this.$route.path.split('/')
      if (pathArr.length) {
        pathArr.pop()
        this.prefixPath = pathArr.join('/')
        // console.log('getPrefixPath:', this.prefixPath)
      }
    },
    foldOrNot () {
      this.showMenu = !this.showMenu
      this.showFoldIcon = !this.showFoldIcon
    },
    getCurrSectionInfo () {
      this.documentName = this.$route.params.documentName
      const section = this.$route.params.section
      var currParams = []
      currParams.push(this.documentName)
      currParams.push(section)
      getDocumentApi
        .getCurrSectionInfo(currParams)
        .then(res => {
          this.currSectionInfo = res.data.data[0]
        })
        .catch((e) => {
          // console.log(e)
        })
    },
    formatTime () {
      var now = new Date()
      const y = now.getFullYear()
      const M = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
      const d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      const h = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
      const m = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
      const s = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
      const timeStr = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
      return timeStr
    },
    collectToHistory () {
      const currUserId = this.$cookie.get('userId')
      if (currUserId) {
        const nowtimeStr = this.formatTime()
        this.addParams.title = this.currSectionInfo.section_title
        this.addParams.time = nowtimeStr
        this.addParams.id = currUserId
        this.addParams.path = this.$route.path
        // console.log(this.addParams)
        historyApi
          .addHistory(this.addParams)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
    getDocSectionList () {
      var nameArr = this.$route.path.split('/')
      nameArr.shift(0)
      // console.log('name:', nameArr[1])
      if (nameArr[1]) {
        getDocumentApi
          .getDocSectionList(nameArr[1])
          .then(res => {
            // console.log('getDocSectionList:', res.data)
            var temp = []
            temp = res.data.data
            temp.sort(this.sortByName('section_key'))
            this.orderSort(temp)
            if (this.sectionListData.length) {
              this.getDocumentSection()
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      }
    },
    sortByName (prop) {
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
      this.sectionListData = []
      this.sectionListData = tempArr
    },
    getDocumentSection () {
      var paramsArr = this.$route.path.split('/')
      paramsArr.shift(0)
      // console.log('getDocumentSection:', paramsArr)
      if (paramsArr.length < 3) {
        paramsArr.push('section1')
        this.$router.replace({
          path: this.$route.path + '/section1'
        })
      }
      this.loading = true
      getDocumentApi
        .getDocumentSection(paramsArr)
        .then(res => {
          // console.log('section file meta:', res)
          if (res.data) {
            this.section_content = ''
            this.section_content = res.data
            this.$refs.shareUrlCode.currentUrl = window.location.href
            this.getCurrSectionInfo()
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSelect (key, keyPath) {
      this.getPrefixPath()
      if (this.$route.params.section && key) {
        if (this.$route.params.section !== key) {
          this.$router.replace({
            path: this.prefixPath + `/${key}`
          })
          this.getDocumentSection()
        }
      }
    }
  }
}
</script>

<style lang="scss" scope>
$theme-color: #3CB371;
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 100%;
  // background-color: #f8f8f8;
  // border-right: 1px solid #ddd
}
.el-menu {
  border-right: none;
}
.el-menu--collapse {
  width: 0;
}
.el-menu-item, .el-submenu__title {
  height: 35px;
  line-height: 30px;
}
.list-wrapper {
  padding: 10px;
  // background-color: #f8f8f8;
}
.btns-wrapper {
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(60, 179, 113, .4);
}
.small-btn-padding {
  padding: 3px 9px;
}
.fold-icon-size {
  font-size: 22px;
}
.star-btn:hover {
  cursor: pointer;
}
.collect-star-icon {
  display: block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  float: right;
  font-size: 30px;
  color: rgb(252, 85, 49);
}
.collect-star-icon:hover {
  color: $theme-color;
}
.menu-item-border {
  border-bottom: 1px solid rgba(60, 179, 113, .2);
}
.section-content {
  height: 82vh;
}
.section-text {
  width: 96%;
  height: 82vh;
  margin-left: 6px;
  border-style: outset;
  border-left: 1px solid #c6c6c6;
  border-right: 1px solid #c6c6c6;
  border-top: 0;
  border-bottom: 0;
}
</style>
