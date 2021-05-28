<template>
  <div class="detail-page">
    <el-row class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/videos' }">视频教程</el-breadcrumb-item>
        <el-breadcrumb-item>{{currVideoInfo.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="video-info-card">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12"
        class="image-wrapper">
        <el-image
          v-if="currVideoInfo.imgUrl"
          :src="currVideoInfo.imgUrl"
          class="video-info-img"
          fit="cover"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="info-text-wrapper">
        <p class="info-title">{{currVideoInfo.name}}</p>
        <div class="info-desc-wrapper">
          <span class="info-desc"><i class="el-icon-video-play info-icon"></i>视频教程</span>
          <span class="info-desc"><i class="el-icon-info info-icon"></i>当前共&nbsp;{{chapterLen}}&nbsp;个视频</span>
          <span class="info-desc"><i class="el-icon-view info-icon"></i>{{currVideoInfo.count_num}}&nbsp;次点击</span>
        </div>
        <p class="info-desc-text">描述：{{currVideoInfo.describe_text}}</p>
        <p class="info-author-text">创建者：{{userName}}</p>
        <p class="info-author-text">创建时间：{{currVideoInfo.newTime}}</p>
        <div class="start-study-btn-wrapper">
          <el-button type="primary" @click="goStartStudy">
            开始学习
          </el-button>
          <span class="collect-btn" @click="collectToHistory"><i class="el-icon-star-off collect-star-icon"></i>收藏</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="section-wrapper">
      <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
        <el-tabs class="tab-munu" v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="视频目录" name="chapters">
            <el-collapse v-model="activeName">
              <el-collapse-item name="videoChapter">
                <template slot="title">
                  视频目录列表<i class="header-icon el-icon-more"></i>
                </template>
                <ul v-for="item of chapterList" :key="item.section_key" class="chapters-list">
                  <li v-if="!noSection" class="chapters-list-item">
                    <router-link :to="$route.path + '/' + item.section_id" class="list-item">
                      <p>
                        <span class="list-item-text">
                          <i class="el-icon-video-play list-icon-size"></i>{{item.section_title}}
                        </span>
                        <el-button size="mini" class="play-btn">观看</el-button>
                      </p>
                    </router-link>
                  </li>
                  <li v-if="noSection" class="chapters-list-item">
                    <el-link href="" class="no-list-item" disabled>
                      <p>
                        <span class="list-item-text">
                          <i class="el-icon-video-play list-icon-size"></i>{{item.section_title}}
                        </span>
                        <el-button size="mini" class="play-btn">观看</el-button>
                      </p>
                    </el-link>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="视频下载" name="resources">
            <ul v-for="item of chapterList" :key="item.section_key" class="chapters-list">
              <li class="chapters-list-item">
                <span class="down-link" @click="openDownload(item.section_key)">
                  <p>
                    <span class="list-item-text">
                      <i class="el-icon-download list-icon-size"></i>{{item.section_title}}
                    </span>
                  </p>
                </span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { userApi } from '@/api/userApi'
import { videoInfoApi } from '@/api/videoInfoApi'
import { historyApi } from '@/api/historyApi'
import download from 'downloadjs' // 引用插件

export default {
  name: 'VideoDetail',
  components: {
  },
  data () {
    return {
      userName: '',
      currVideoInfo: {
        imgUrl: 'http://127.0.0.1:8186/images/4.jpg'
      },
      activeTab: 'chapters',
      activeName: 'videoChapter',
      noSection: true,
      chapterLen: 0,
      chapterList: [{
        video_name: '暂无数据',
        section_title: '暂无数据',
        section_id: '',
        section_key: ''
      }],
      addParams: {
        title: '',
        time: '',
        id: '',
        path: ''
      },
      goStart: ''
    }
  },
  mounted () {
    this.getVideoInfo()
    this.getVideoSectionList()
  },
  methods: {
    getVideoInfo () {
      // console.log(this.$route.params.videoName)
      const nameParam = this.$route.params.videoName
      if (nameParam) {
        videoInfoApi
          .getVideoInfo(nameParam)
          .then(res => {
            // console.log('getVideoInfo', res.data)
            if (res.data.length) {
              this.currVideoInfo = res.data[0]
              if (res.data[0].creator) this.getUserName(res.data[0].creator)
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      }
    },
    getUserName (currUserId) {
      if (currUserId) {
        const param = {
          curr_id: currUserId
        }
        userApi
          .searchName(param)
          .then(res => {
            // console.log('search Name:', res)
            if (res.data.user_name) {
              this.userName = res.data.user_name
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      }
    },
    getVideoSectionList () {
      const nameParam = this.$route.params.videoName
      videoInfoApi
        .getVideoSectionList(nameParam)
        .then(res => {
          // console.log('getVideoSectionList', res.data)
          if (res.data.data.length) {
            var temp = []
            temp = res.data.data
            temp.sort(this.sortByName('section_id'))
            this.orderSort(temp)
            this.chapterLen = res.data.data.length
            this.noSection = false
          } else {
            this.chapterLen = 0
            this.noSection = true
          }
        })
        .catch((e) => {
          this.$message.error(e)
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
        this.addParams.title = this.currVideoInfo.name
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
    handleTabClick (tab, event) {
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
      this.chapterList = []
      this.chapterList = tempArr
      if (this.chapterList[0].section_id) this.goStart = this.chapterList[0].section_id
    },
    openDownload (title) {
      if (title.length) {
        const currUserId = this.$cookie.get('userId')
        if (currUserId) {
          // console.log('title:', title)
          download(title)
        } else {
          this.$message.warning('请先登录')
        }
      } else {
        this.$message.warning('暂无资源可下载')
      }
    },
    goStartStudy () {
      if (this.goStart.length) {
        this.$router.push({
          path: this.$route.path + '/' + this.goStart
        })
      } else {
        this.$message.warning('暂无可学习资源')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.detail-page {
  background-color: #f9f9f9;
}
.breadcrumb-wrapper {
  padding: 15px;
}
.video-info-card {
  min-height: 40vh;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background-color: #fff;
}
.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  border-right: 1px dashed $theme-color;
}
.video-info-img {
  width: 70%;
  height: auto;
  margin: 15px;
  border: 1px solid $theme-color;
  border-radius: 10px;
}
.info-text-wrapper {
  padding: 20px;
}
.info-title {
  font-size: 26px;
  font-weight: 500;
}
.info-desc {
  padding-left: 10px;
  padding-right: 10px;
  border-right: 1px solid $theme-color;
  font-size: 14px;
  color: #666;
}
.info-desc-wrapper .info-desc:first-child {
  padding-left: 0;
}
.info-desc-wrapper .info-desc:last-child {
  padding-right: 0;
  border-right: 0;
}
.info-desc-text {
  padding: 20px 0 10px;
  color: rgb(177, 177, 177);
}
.info-author-text {
  color: rgb(177, 177, 177);
}
.info-icon {
  margin: 2px;
  font-size: 15px;
  color: $theme-color;
}
.start-study-btn-wrapper {
  margin-top: 45px;
}
.start-study-btn {
  font-size: 15px;
  color: #fff;
  text-decoration: none;
}
.collect-btn {
  display: inline-block;
  vertical-align: middle;
  margin-left: 60px;
  padding: 8px;
  font-size: 15px;
  color: rgb(252, 85, 49);
}
.collect-btn:hover {
  cursor: pointer;
  color: $theme-color;
}
.collect-star-icon {
  font-size: 32px;
}
.collect-star-icon:hover {
  color: $theme-color;
}
// 章节资料模块
.section-wrapper {
  display: flex;
  justify-content: center;
  min-height: 40vh;
  margin-top: 40px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: #fff;
}
.tab-munu {
  width: 90%;
  margin: 0 10px;
}
.chapters-list {
  list-style: none;
  padding-inline-start: 0;
}
.chapters-list-item {
  width: 100%;
  border-bottom: 1px dashed $theme-color;
}
.no-list-item {
  display: inline-block;
  width: 100%;
  text-decoration: none;
  font-size: 14px;
}
.list-item {
  width: 100%;
  text-decoration: none;
  font-size: 14px;
}
.list-item:link {
  color: #666;
}
.list-item:visited {
  color: #666;
}
.list-item:hover {
  color: rgb(252, 85, 49);
}
.list-item:active {
  color: #666;
}
.list-item-text {
  display: inline-block;
  width: 75%;
}
.list-icon-size {
  margin: 0 8px;
  font-size: 18px;
  color: rgb(252, 85, 49);
}
.list-icon-size:hover {
  color: $theme-color;
}
.play-btn {
  float: right;
  margin: 0 6px;
  padding: 5px 11px;
  border: 1px solid rgb(252, 85, 49);
  border-radius: 8px;
  font-size: 12px;
  color: rgb(252, 85, 49);
}
.play-btn:hover {
  color: #fff;
  border: 1px solid $theme-color;
  background-color: $theme-color;
}
.down-link {
  text-decoration: none;
  color: #666;
}
.down-link:hover {
  cursor: pointer;
  color: rgb(252, 85, 49);
}
</style>
