<template>
  <div id="content-box">
    <el-row>
      <!-- 左 -->
      <el-col :span="menuSpan">
        <!-- 左侧工具列表 -->
        <el-row class="menu-icon-btn">
          <div class="tools-div">
            <el-collapse v-model="toolActiveName">
              <el-collapse-item name="tools" class="tools-text">
                <template slot="title">
                  <span class="tools-collapse-title">
                    站内工具
                    <img class="tools-icon" src="../../assets/icons/tools.png" />
                  </span>
                </template>
                <ul class="tool-list">
                  <li @click="openHistoryList">
                    <span class="tools-text">
                      书签历史
                      <img class="tools-icon" src="../../assets/icons/bookmarks.png" />
                    </span>
                  </li>
                  <li @click="openTextToAudio">
                    <span class="tools-text">
                      文字转语音
                      <img class="tools-icon" src="../../assets/icons/voice.png" />
                    </span>
                  </li>
                  <li @click="openGetQrcode">
                    <span class="tools-text">
                      二维码生成
                      <img class="tools-icon" src="../../assets/icons/qrcode.png" />
                    </span>
                  </li>
                  <li @click="openGetBarcode">
                    <span class="tools-text">
                      条形码生成
                      <img class="tools-icon" src="../../assets/icons/barcode.png" />
                    </span>
                  </li>
                  <li @click="openHexToRgb">
                    <span class="tools-text">
                      颜色取值
                      <img class="tools-icon" src="../../assets/icons/color.png" />
                    </span>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-row>
        <!-- 左侧一言卡片 -->
        <el-row class="word-card-wrapper" v-show="showRecWord">
          <rec-word class="rec-word-card"></rec-word>
        </el-row>
        <!-- 书签抽屉 -->
        <el-row>
          <el-drawer
            title="书签历史列表"
            size="300px"
            :visible.sync="drawer"
            :direction="direction"
            :modal="modal">
            <el-table
              :data="historyList"
              border
              stripe
              :show-header="true"
              v-loading="historyLoding"
              style="width: 100%;"
              class="history-table"
            >
              <el-table-column
                prop="title"
                label="书签项"
                width="240"
              >
                <template slot-scope="scope">
                  <router-link :to="scope.row.history_path" class="history_link">
                    {{scope.row.history_title}}
                    <br>
                    <span class="history_time">{{scope.row.history_time}}</span>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="60">
                <template slot-scope="scope">
                  <span @click="delCurrHistory(scope.row)" class="del-history-btn">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </el-drawer>
        </el-row>
        <!-- 文字转语音对话框 -->
        <el-dialog
          title="文字转语音"
          width="60vw"
          height="400px"
          :visible.sync="textAudioVisible"
          :close-on-click-modal="false"
          :destroy-on-close="true"
        >
          <text-to-audio @closeTextToAudio="closeTextToAudio"></text-to-audio>
        </el-dialog>
        <!-- 二维码生成对话框 -->
        <el-dialog
          title="二维码生成"
          width="60vw"
          height="400px"
          :visible.sync="getQrcodeVisible"
          :close-on-click-modal="false"
          :destroy-on-close="true"
        >
          <get-qrcode @closeGetQrcode="closeGetQrcode"></get-qrcode>
        </el-dialog>
        <!-- 条形码生成对话框 -->
        <el-dialog
          title="条形码生成"
          width="370px"
          height="300px"
          :visible.sync="getBarcodeVisible"
          :close-on-click-modal="false"
          :destroy-on-close="true"
        >
          <get-barcode @closeGetBarode="closeGetBarcode"></get-barcode>
        </el-dialog>
        <!-- 颜色取值对话框 -->
        <el-dialog
          title="颜色取值"
          width="360px"
          height="300px"
          :visible.sync="hexToRgbVisible"
          :close-on-click-modal="false"
          :destroy-on-close="false"
        >
          <hex-to-rgb @closeHexToRgb="closeGetBarcode"></hex-to-rgb>
        </el-dialog>
      </el-col>
      <!-- 中 -->
      <el-col :span="leftSpan" class="content-list">
        <!-- 轮播图 -->
        <el-carousel height="40vh" arrow="always">
          <el-carousel-item v-for="(item, index) of carouselList" :key="index">
            <router-link :to="'/' + item.type + '/' + item.data.path">
              <el-image
                :src="item.data.imgUrl"
                fit="cover"
                class="carouselImg">
              </el-image>
            </router-link>
          </el-carousel-item>
        </el-carousel>
        <div class="content-wrapper">
          <!-- 电子文档推荐 -->
          <span class="section-wrapper" v-if="showRec.document_rec">
            <span class="rec-title"><i class="el-icon-tickets icon-document"></i>电子文档</span>
            <span>
              <router-link to="/document" class="go-to-page">
                更多 <i class="el-icon-d-arrow-right"></i>
              </router-link>
            </span>
            <el-row class="list-item">
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(item, index) of documentList" :key="index">
                <router-link class="container-block" :to="'/document/'+ item.path">
                  <el-row>
                    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="rec_img_wrapper">
                      <el-image
                        class="rec_img"
                        :src="item.imgUrl"
                        fit="cover">
                      </el-image>
                    </el-col>
                    <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16" class="rec-text">
                      <el-row>
                        <p class="rec_title">{{item.name}}</p>
                      </el-row>
                      <el-row class="rec_desc_wrapper">
                        <p class="rec_desc">{{item.describe_text}}</p>
                      </el-row>
                    </el-col>
                  </el-row>
                </router-link>
              </el-col>
            </el-row>
          </span>
          <br>
          <!-- 视频教程推荐 -->
          <span class="section-wrapper" v-if="showRec.video_rec">
            <span class="rec-title"><i class="el-icon-video-play icon-document"></i>视频教程</span>
            <span>
              <router-link to="/videos" class="go-to-page">
                更多 <i class="el-icon-d-arrow-right"></i>
              </router-link>
            </span>
            <el-row class="video-list-item" :gutter="10">
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(item, index) of videoList" :key="index">
                <router-link class="video-wrapper" :to="'/videos/'+ item.path">
                  <el-row>
                    <div class="video-rec-img-wrapper">
                      <el-image class="video-rec-img" :src="item.imgUrl" alt="video-Image" fit="cover" lazy></el-image>
                      <p class="video-rec-txt">{{item.describe_text}}</p>
                    </div>
                  </el-row>
                </router-link>
              </el-col>
            </el-row>
          </span>
          <br>
          <!-- 电子书籍推荐区域 -->
          <span class="section-wrapper" v-if="showRec.ebook_rec">
            <span class="rec-title"><i class="el-icon-reading icon-document"></i>电子书籍</span>
            <span>
              <router-link to="/ebooks" class="go-to-page">
                更多 <i class="el-icon-d-arrow-right"></i>
              </router-link>
            </span>
            <el-row class="ebook-list-item" :gutter="10">
              <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" v-for="(item, index) of ebookList" :key="index" class="ebook-item">
                <router-link class="ebook-wrapper" :to="'/ebooks/' + item.path">
                  <el-row>
                    <div class="ebook-rec-img-wrapper">
                      <el-image class="ebook-rec-img" :src="item.imgUrl" alt="video-Image" fit="cover" lazy></el-image>
                    </div>
                    <div class="ebook-rec-txt-wrapper">
                      <p class="ebook-rec-txt">《{{item.name}}》</p>
                    </div>
                  </el-row>
                </router-link>
              </el-col>
            </el-row>
          </span>
          <br>
          <!-- 课程推荐区域 -->
          <span class="section-wrapper" v-if="showRec.course_rec">
            <span class="rec-title" id="课程推荐"><i class="el-icon-film icon-document"></i>课程推荐</span>
            <span>
              <router-link to="/course" class="go-to-page">
                更多 <i class="el-icon-d-arrow-right"></i>
              </router-link>
            </span>
            <el-row class="video-list-item" :gutter="10">
              <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(item, index) of courseList" :key="index">
                <router-link class="video-wrapper" :to="'/course/' + item.path">
                  <el-row>
                    <div class="video-rec-img-wrapper">
                      <el-image class="video-rec-img" :src="item.imgUrl" alt="video-Image" fit="cover" lazy></el-image>
                      <p class="video-rec-txt">{{item.describe_text}}</p>
                    </div>
                  </el-row>
                </router-link>
              </el-col>
            </el-row>
          </span>
        </div>
      </el-col>
      <!-- 右侧操作菜单 -->
      <el-col :span="rightSpan">
        <el-menu
          class="el-menu-vertical-demo menu-shadow"
          background-color="#3CB371"
          text-color="#fff"
          active-text-color="#fff"
          @select="handleSelect">
          <el-menu-item
            v-for="(item, key) in leftNavItems"
            :key="key"
            :ref="item.name"
            @click="showMenuItem(item.name)"
          >{{item.name}}</el-menu-item>
          <!-- v-if="Object.keys(rightNavItems).length === 0 ? false : true" -->
          <el-submenu
            style="float:right;"
            v-if="false"
            index="10"
          >
            <template slot="title">
              <i class="el-icon-s-unfold fold-icon" style="background: transparent; font-size: 18px; color:#3CB371;"></i>
            </template>
            <el-menu-item
              :key="key"
              v-for="(item, key) in rightNavItems"
            >{{item.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
    <!-- 联系按钮 -->
    <connect-btn v-show="showContactBtn"></connect-btn>
    <!-- 二维码按钮 -->
    <urlQrcode v-show="showUrlQrcodeBtn"></urlQrcode>
    <!-- 返回顶部按钮 -->
    <el-tooltip class="item" effect="dark" content="返回顶部" placement="top">
      <div @click="scrollToTop" class="topBtn">
        <i class="el-icon-arrow-up"></i>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { userApi } from '@/api/userApi'
import { infoApi } from '@/api/infoApi'
import textToAudio from './textToAudio'
import getQrcode from './getQrcode'
import getBarcode from './getBarcode'
import hexToRgb from './hexToRgb'
import recWord from './recWord'
import urlQrcode from './urlQrcode'
import connectBtn from './connectBtn'

export default {
  name: 'Index',
  components: {
    textToAudio,
    getQrcode,
    getBarcode,
    hexToRgb,
    recWord,
    urlQrcode,
    connectBtn
  },
  data () {
    return {
      userId: '',
      drawer: false,
      direction: 'ltr',
      modal: false,
      menuSpan: 4,
      leftSpan: 16,
      rightSpan: 4,
      timer: '',
      toolActiveName: 'tools',
      textAudioVisible: false,
      getQrcodeVisible: false,
      getBarcodeVisible: false,
      hexToRgbVisible: false,
      showRecWord: true,
      showContactBtn: true,
      showUrlQrcodeBtn: true,
      navItems: [{
        name: '全部推荐'
      }, {
        name: '电子文档'
      }, {
        name: '视频教程'
      }, {
        name: '电子书籍'
      }, {
        name: '课程专区'
      }],
      screenWidth: document.body.clientWidth,
      historyList: [{
        history_title: '暂无书签',
        history_path: '',
        history_time: ''
      }],
      historyLoding: true,
      showRec: {
        document_rec: true,
        video_rec: true,
        ebook_rec: true,
        course_rec: true
      },
      carouselList: [],
      documentList: [{
        name: '获取推荐数据失败',
        path: '',
        describe_text: '',
        imgUrl: ''
      }],
      videoList: [{
        name: '获取推荐数据失败',
        path: '',
        describe_text: '',
        imgUrl: ''
      }],
      ebookList: [{
        name: '获取推荐数据失败',
        path: '',
        describe_text: '',
        imgUrl: ''
      }],
      courseList: [{
        name: '获取推荐数据失败',
        path: '',
        describe_text: '',
        imgUrl: ''
      }]
    }
  },
  mounted () {
    this.isMobile()
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
    }
    this.getCarouselRec()
    this.getDocumnetRec()
    this.getVideoRec()
    this.getEbookRec()
    this.getCourseRec()
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
            this.menuSpan = 4
            this.leftSpan = 16
            this.rightSpan = 4
            this.toolActiveName = 'tools'
            this.showRecWord = true
            this.showContactBtn = true
            this.showUrlQrcodeBtn = true
          } else {
            this.isCollapse = true
            this.menuSpan = 24
            this.leftSpan = 24
            this.rightSpan = 0
            this.toolActiveName = ''
            this.showRecWord = false
            this.showContactBtn = false
            this.showUrlQrcodeBtn = false
          }
          this.timer = false
        }, 300)
      }
    }
  },
  computed: {
    leftNavItems: function () {
      return this.screenWidth >= 780 ? this.navItems : {}
    },
    rightNavItems: function () {
      return this.screenWidth < 780 ? this.navItems : {}
    }
  },
  methods: {
    // 判断是否为移动设备
    isMobile () {
      const deviceType = /Android|iPhone|iPad|iPad Pro|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent)
      // console.log(deviceType)
      if (deviceType) {
        this.isCollapse = true
        this.menuSpan = 24
        this.leftSpan = 24
        this.rightSpan = 0
        this.toolActiveName = ''
        this.showRecWord = false
        this.showContactBtn = false
        this.showUrlQrcodeBtn = false
      }
    },
    // 页面回到顶部
    scrollToTop () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      // window.scrollTo({
      //   top: 0,
      //   behavior: 'smooth'
      // })
    },
    // 打开书签历史
    openHistoryList () {
      const currUserId = this.$cookie.get('userId')
      // console.log('currUserId:', currUserId)
      if (currUserId) {
        this.drawer = !this.drawer
        this.getUserHistory(currUserId)
      } else {
        this.$message.warning('请先登录')
      }
    },
    // 获取书签历史列表
    getUserHistory (userId) {
      userApi
        .getUserHistory(userId)
        .then(res => {
          if (res.code === 200) {
            // console.log('historyList:', res.data)
            if (res.data.length) {
              this.historyList = res.data
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(e => {
          this.$message.error(e)
        })
        .finally(() => {
          this.historyLoding = false
        })
    },
    // 删除书签历史列表
    delCurrHistory (row) {
      // console.log('del row:', row)
      userApi
        .delHistory(row)
        .then(res => {
          if (res.code === 200) {
            // console.log('del res:', res)
            const currUserId = this.$cookie.get('userId')
            if (currUserId) {
              this.historyList = []
              this.getUserHistory(currUserId)
              this.historyLoding = !this.historyLoding
            } else {
              this.$message.warning('请先登录')
            }
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 文字转语音开/关
    openTextToAudio () {
      this.textAudioVisible = true
    },
    closeTextToAudio () {
      this.textAudioVisible = false
    },
    // 二维码生成开/关
    openGetQrcode () {
      this.getQrcodeVisible = true
    },
    closeGetQrcode () {
      this.getQrcodeVisible = false
    },
    // 条形码生成开/关
    openGetBarcode () {
      this.getBarcodeVisible = true
    },
    closeGetBarcode () {
      this.getBarcodeVisible = false
    },
    // 颜色取值器
    openHexToRgb () {
      this.hexToRgbVisible = true
    },
    closeHexToRgb () {
      this.hexToRgbVisible = false
    },
    // 获取轮播数据
    getCarouselRec () {
      infoApi
        .getCarouselRec()
        .then(res => {
          if (res.code === 200) {
            // console.log('轮播推荐列表：', res.data)
            if (res.data.length > 0) {
              this.carouselList = res.data
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 获取电子文档推荐数据
    getDocumnetRec () {
      infoApi
        .getDocumnetRec()
        .then(res => {
          if (res.code === 200) {
            // console.log('文档推荐列表：', res.data)
            if (res.data.length > 0) {
              this.documentList = res.data
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 获取视频教程推荐数据
    getVideoRec () {
      infoApi
        .getVideoRec()
        .then(res => {
          if (res.code === 200) {
            // console.log('视频推荐列表：', res.data)
            if (res.data.length > 0) {
              this.videoList = res.data
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 获取电子书籍推荐数据
    getEbookRec () {
      infoApi
        .getEbookRec()
        .then(res => {
          if (res.code === 200) {
            // console.log('电子书推荐列表：', res.data)
            if (res.data.length > 0) {
              this.ebookList = res.data
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 获取课程推荐数据
    getCourseRec () {
      infoApi
        .getCourseRec()
        .then(res => {
          if (res.code === 200) {
            // console.log('课程推荐列表：', res.data)
            if (res.data.length > 0) {
              this.courseList = res.data
            }
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 右侧菜单项选择方法
    handleSelect () {
      // console.log('this item was selected')
    },
    // 右侧菜单项单击方法
    showMenuItem (target) {
      // console.log(target)
      if (target !== '全部推荐') {
        if (target === '电子文档') {
          this.showRec.document_rec = true
          this.showRec.video_rec = false
          this.showRec.ebook_rec = false
          this.showRec.course_rec = false
        } else if (target === '视频教程') {
          this.showRec.document_rec = false
          this.showRec.video_rec = true
          this.showRec.ebook_rec = false
          this.showRec.course_rec = false
        } else if (target === '电子书籍') {
          this.showRec.document_rec = false
          this.showRec.video_rec = false
          this.showRec.ebook_rec = true
          this.showRec.course_rec = false
        } else {
          this.showRec.document_rec = false
          this.showRec.video_rec = false
          this.showRec.ebook_rec = false
          this.showRec.course_rec = true
        }
      } else {
        this.showRec.document_rec = true
        this.showRec.video_rec = true
        this.showRec.ebook_rec = true
        this.showRec.course_rec = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
#content-box {
  padding-top: 25px;
  background-color: #eee;
  background: url('../../assets/imgs/anna.jpg') no-repeat 0 0;
  background-size: 100% 100%;
}
.menu-shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 80%;
  min-height: 400px;
}
.menu-icon-content:hover {
  cursor: pointer;
}
.menu-icon-btn {
  margin: 0 12px 12px;
  color: $theme-color;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .14);
}
.tools-div {
  width:100%;
  margin-right: 4px;
}
.menu-icon {
  font-size: 15px;
  color: #8a8a8a;
  vertical-align: middle;
}
.menu-item-title {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 12px;
  border-bottom: 1px solid $theme-color;
}
.menu-item-text {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
.el-menu {
  display: inline-block;
  margin-left: 15px;
  padding: 0 10px;
  font-weight: bold;
  text-align: center;
}
.el-menu-item {
  font-size: 16px;
}
.tools-collapse-title {
  padding-left: 10px !important;
  font-size: 15px !important;
  font-weight: bold !important;
  color: $theme-color !important;
}
.tools-text {
  font-size: 15px;
  color: #8a8a8a;
}
.tools-icon {
  width: 15px;
  height: auto;
}
.tool-list {
  list-style: none;
  padding-inline-start: 6px;
}
.tool-list > li {
  margin: 10px;
  border-bottom: 1px solid $theme-color;
}
.tool-list > li:hover {
  cursor: pointer;
}
// 左侧语句推荐卡片
.word-card-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 50px;
}
.rec-word-card {
  width: 90%;
}
.history-table {
  height: 90vh;
  overflow: scroll;
}
.el-table th, .el-table tr, .el-table td {
  height: 100%;
}
.history-table::-webkit-scrollbar {
  width: 6px; /* 对垂直流动条有效 */
  height: 0;
}
/* 定义滚动条的轨道颜色、内阴影及圆角 */
.history-table::-webkit-scrollbar-track{
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: rgb(255, 255, 255);
  border-radius: 3px;
}
/* 定义滑块颜色、内阴影及圆角 */
.history-table::-webkit-scrollbar-thumb {
  position: relative;
  display: block;
  cursor: pointer;
  border-radius: 3px;
  background-color: rgba(144,147,153,0.3);
  transition: .3s background-color;
}
.history_wrapper {
  display: inline-block;
}
.history_link {
  padding: 0 5px;
  font-size: 14px;
  color: $theme-color;
}
.history_link:link,
.history_link:visited,
.history_link:hover,
.history_link:active {
  text-decoration: none;
}
.history_time {
  font-size: 12px;
  color: #7e7e7e;
}
.del-history-btn {
  color: rgba(255, 0, 0, .6);
  cursor: pointer;
}
.content-wrapper {
  margin-left: 15px;
  margin-top: 30px;
}
.content-list {
  background-color: #fff;
}
// 轮播样式
.el-carousel {
  margin: 10px 20px;
  border: 1px solid #8f8f8f;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .15), 0 0 6px rgba(0, 0, 0, .04);
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 40vh;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.el-carousel /deep/ .el-carousel__button {
  height: 3px;
  background-color: $theme-color;
}
.carouselImg {
  width: 100%;
  height: 40vh;
  cursor: pointer;
}
.section-wrapper {
  width: 97%;
  display: block;
  margin: 0;
  padding: 0;
}
.right-content {
  padding-left: 20px;
  padding-right: 20px;
}
.rec-title {
  display: inline-block;
  margin: 6px 4px;
  font-size: 15px;
  font-weight: bold;
  color: #4e4e4e;
}
.icon-document {
  margin-right: 4px;
  font-size: 18px;
  color: $theme-color;
}
.go-to-page {
  float: right;
  margin: 0;
  padding: 0;
  color: $theme-color;
  font-size: 15px;
  text-decoration: none;
}
.go-to-page:link {
  text-decoration: none;
}
.go-to-page:visited {
  text-decoration: none;
}
.go-to-page:hover {
  text-decoration: none;
}
.go-to-page:active {
  text-decoration: none;
}
.list-item {
  text-align: left;
  border-top: 3px solid $theme-color;
  padding-top: 5px;
}
.container-block {
  display: block;
  width: 80%;
  height: 100px;
  // border: 1px solid $theme-color;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 4px;
  margin: 10px auto;
  background: #f8f8f8;
}
.rec_img_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.rec_img {
  width: 90px;
  height: 90px;
  margin: 2px;
  border: 1px solid rgba(60, 179, 113, .4);
}
.rec-text {
  padding: 4px;
}
.rec_title {
  margin: 8px 0 4px 0;
  font-size: 14px;
  font-weight: bold;
  color: rgb(105, 105, 105);
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rec_desc_wrapper {
  margin: 0 4px 4px;
  height: 60px;
}
.rec_desc {
  height: 50px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: 12px;
  color: #8f8f8f;
  text-align: justify;
  overflow: hidden;
  text-overflow: ellipsis;
}
.video-list-item {
  text-align: left;
  border-top: 3px solid $theme-color;
  padding-top: 5px;
  margin-bottom: 10px;
}
.video-wrapper {
  display: inline-block;
  width: 98%;
  height: 220px;
  background: #f8f8f8;
  font-size: 15px;
  color: $theme-color;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 6px;
}
.video-wrapper:hover {
  text-decoration: none;
}
.video-rec-img-wrapper {
  width: 100%;
  height: 220px;
}
.video-rec-img {
  width: 100%;
  height: 75%;
}
.video-rec-txt {
  width: 100%;
  height: 25%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 6px;
}
.ebook-list-item {
  text-align: left;
  border-top: 3px solid $theme-color;
  padding-top: 5px;
  margin-bottom: 10px;
}
.ebook-item {
  display: flex;
  justify-content: center;
}
.ebook-wrapper {
  display: inline-block;
  width: 80%;
  height: 30vh;
  background: #f8f8f8;
  font-size: 15px;
  color: $theme-color;
  margin-top: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .32), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 6px;
}
.ebook-wrapper:hover {
  text-decoration: none;
}
.ebook-rec-img-wrapper {
  width: 100%;
  height: 26vh;
}
.ebook-rec-img {
  width: 100%;
  height: 100%;
  padding: 6px;
}
.ebook-rec-txt-wrapper {
  width: 100%;
  height: 4vh;
}
.ebook-rec-txt {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 6px;
}
.topBtn {
  position: fixed;
  right: 20px;
  bottom: 40px;
  background-color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: $theme-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
  cursor: pointer;
}
.topBtn:hover {
  background-color: #f0f0f0;
}
</style>
