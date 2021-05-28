<template>
  <div class="play-wrapper">
    <el-row class="breadcrumb-wrapper hidden-xs-only">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/videos' }">视频教程</el-breadcrumb-item>
        <el-breadcrumb-item :to="'/videos/'+ videoName">{{videoParentTitle}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{currVideoInfo.section_title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <el-col :xs="24" :md="18" :lg="18" :xl="18">
        <div class="video-wrapper">
          <video-player
            v-if="isMp4"
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @statechanged="playerStateChanged($event)"
            @loadeddata="onPlayerLoadeddata($event)"
            @timeupdate="onPlayerTimeupdate($event)">
          </video-player>
          <vue-flv-player
            v-if="isFlv"
            ref="flvPlayer"
            type="flv"
            :controls="true"
            :muted="true"
            :source="videoSrc"
            :autoCleanupSourceBuffer="true"
            class="my-flv-player"
          />
        </div>
        <div class="play-video-info">
          <p class="play-video-info-title">《{{videoParentTitle}}》 &emsp;{{currVideoInfo.section_title}}</p>
          <div class="collect-btn">
            <div class="star-btn" @click="collectToHistory">
              <el-tooltip content="收藏到书签" placement="bottom" effect="light">
                <i class="el-icon-star-off collect-star-icon"></i>
              </el-tooltip>
            </div>
            <div class="star-btn">
              <el-popover
                placement="bottom"
                title="二维码分享"
                trigger="hover">
                <div class="share-code-wrapper">
                  <vue-qr
                    :text="currUrl"
                    :size="100"
                    :margin="2"
                  />
                </div>
                <span slot="reference">
                  <i class="el-icon-s-promotion collect-share-icon"></i>
                </span>
              </el-popover>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :md="6" :lg="6" :xl="6">
        <div class="list-wrapper">
          <el-collapse v-model="activeName">
            <el-collapse-item name="videoChapter">
              <template slot="title">
                <span class="list-title">视频目录列表<i class="header-icon el-icon-more"></i></span>
              </template>
              <el-menu
                :default-active="$route.params.videoPlay"
                class="el-menu-vertical-demo"
                @select="handleSelect" >
                <template v-for="item of chapterList">
                  <el-menu-item class="menu-item-border chapters-list-item" :index="item.section_id" :key="item.section_key">
                    <span class="list-item">
                      <p class="list-item-text">
                        <span>
                          <i class="el-icon-video-play list-icon-size"></i>{{item.section_title}}
                        </span>
                      </p>
                    </span>
                  </el-menu-item>
                </template>
              </el-menu>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { videoInfoApi } from '@/api/videoInfoApi'
import { historyApi } from '@/api/historyApi'
import vueQr from 'vue-qr'
import vueFlvPlayer from 'vue-flv-player'

export default {
  name: 'VideoPlay',
  components: {
    vueQr,
    vueFlvPlayer
  },
  data () {
    return {
      isMp4: true,
      isFlv: false,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: 'http://127.0.0.1:8186/videos/error.mp4' // url地址
        }],
        poster: '../../assets/imgs/anna.jpg', // 你的封面地址
        // width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      videoSrc: '',
      chapterList: [],
      videoParentTitle: '',
      activeName: 'videoChapter',
      videoName: '',
      currVideoInfo: {
        section_id: '',
        section_key: '',
        section_title: '',
        video_name: ''
      },
      currUrl: '',
      addParams: {
        title: '',
        time: '',
        id: '',
        path: ''
      }
    }
  },
  mounted () {
    this.getVideoPlayList()
    this.getVideoParentTitle()
    this.setCurrUrl()
  },
  methods: {
    onPlayerPlay (player) {
    },
    onPlayerPause (player) {
      // 监听暂停
      // console.log('暂停')
      // 暂停时时间
      // console.log(player.duration())
      this.$emit('onPlayerPauseFun', player)
    },
    playerStateChanged (player) {
    },
    onPlayerLoadeddata (player) {
    },
    onPlayerTimeupdate (player) {
    },
    videoUrl (val) {
      if (val !== '') {
        this.$refs.videoPlayer.player.src(val)
      }
    },
    poster (newImg, oldImg) {
      if (newImg) {
        this.$refs.videoPlayer.player.poster(newImg)
      }
    },
    getCurrVideoInfo () {
      this.videoName = this.$route.params.videoName
      const videoPlay = this.$route.params.videoPlay
      var currParams = []
      currParams.push(this.videoName)
      currParams.push(videoPlay)
      videoInfoApi
        .getCurrVideoInfo(currParams)
        .then(res => {
          this.currVideoInfo = res.data.data[0]
          // console.log('this.currVideoInfo', this.currVideoInfo)
          this.getVideoPlayUrl(this.currVideoInfo.section_key)
        })
        .catch((e) => {
          // console.log(e)
        })
    },
    getVideoParentTitle () {
      const paramName = this.$route.params.videoName
      if (paramName) {
        videoInfoApi
          .getVideoInfo(paramName)
          .then(res => {
            if (res) {
              // console.log('getVideoParentTitle', res.data[0].name)
              this.videoParentTitle = res.data[0].name
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      }
      this.getCurrVideoInfo()
    },
    getVideoPlayList () {
      const nameParam = this.$route.params.videoName
      videoInfoApi
        .getVideoSectionList(nameParam)
        .then(res => {
          if (res.data.data) {
            var temp = []
            temp = res.data.data
            temp.sort(this.sortByName('section_id'))
            this.orderSort(temp)
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
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
    },
    handleSelect (key, keyPath) {
      if (this.$route.params.videoPlay !== key) {
        var pathArr = this.$route.path.split('/')
        if (pathArr.length) {
          pathArr.pop()
          const prefixPath = pathArr.join('/')
          // console.log('PrefixPath:', prefixPath)
          this.$router.replace({
            path: prefixPath + `/${key}`
          })
        }
        this.$route.params.videoPlay = key
        this.getCurrVideoInfo()
        this.setCurrUrl()
      }
    },
    getVideoPlayUrl (title) {
      // var paramsArr = this.$route.path.split('/')
      // paramsArr.shift(0)
      // paramsArr.pop()
      // paramsArr.push(title)
      // videoInfoApi
      //   .downloadVideo(paramsArr)
      //   .then(res => {
      //     if (res.data.type === 'mp4') {
      //       this.isMp4 = true
      //       this.isFlv = false
      //       this.playerOptions.sources[0].type = ''
      //       this.playerOptions.sources[0].src = ''
      //       this.playerOptions.sources[0].type = 'video/mp4'
      //       this.playerOptions.sources[0].src = res.data.data
      //     } else if (res.data.type === 'flv') {
      //       this.isMp4 = false
      //       this.isFlv = true
      //       this.videoSrc = res.data.data
      //     }
      //   })
      //   .catch((e) => {
      //     // console.log(e)
      //   })
      const arr = title.split('.')
      const end = arr.pop()
      if (end === 'mp4') {
        this.isMp4 = true
        this.isFlv = false
        this.playerOptions.sources[0].type = ''
        this.playerOptions.sources[0].src = ''
        this.playerOptions.sources[0].type = 'video/mp4'
        this.playerOptions.sources[0].src = title
      } else if (end === 'flv') {
        this.isMp4 = false
        this.isFlv = true
        this.videoSrc = title
      }
    },
    setCurrUrl () {
      this.currUrl = ''
      this.currUrl = window.location.href
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
        this.addParams.title = this.currVideoInfo.section_title
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
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.play-wrapper {
  min-height: 30vh;
  border: 1px solid #cfcfcf;
  background-color: #f9f9f9;
}
.breadcrumb-wrapper {
  padding: 15px;
}
.video-wrapper {
  min-height: 10vh;
  margin: 15px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background-color: #fff;
}
.my-flv-player {
  width: 100%;
  height: auto;
}
.play-video-info {
  min-height: 10vh;
  margin: 15px;
  margin-bottom: 1px solid $theme-color;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background-color: #fff;
}
.play-video-info-title {
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #666;
}
.play-video-info-subtitle {
  padding: 0 10px;
  font-size: 16px;
  font-weight: bold;
  color: #666;
}
// 收藏按钮
.collect-btn {
  vertical-align: middle;
  padding: 15px;
  font-size: 15px;
}
.star-btn {
  display: inline-block;
}
.star-btn:hover {
  cursor: pointer;
}
.share-address {
  display: inline-block;
  margin-left: 20px;
}
.collect-star-icon {
  display: inline-block;
  margin-right: 20px !important;
  font-size: 32px;
  color: rgb(252, 85, 49);
}
.collect-star-icon:hover {
  color: $theme-color;
}
.share-code-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.collect-share-icon {
  font-size: 32px;
  color: rgb(252, 85, 49);
}
.collect-share-icon:hover {
  color: $theme-color;
}
// 右侧列表
.list-wrapper {
  width: 92%;
  margin: 10px 10px 20px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.list-title {
  padding-left: 10px;
  font-weight: bold;
  font-size: 16px;
}
.chapters-list-item {
  width: 100%;
  border-bottom: 1px dashed $theme-color;
}
.list-item {
  width: 100%;
  overflow: hidden;
  font-size: 14px;
}
.list-item:hover {
  color: $theme-color;
}
.list-item-text {
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-menu-item, .el-submenu__title {
  height: 40px;
  line-height: 40px;
}
.menu-item-border {
  border-bottom: 1px dashed $theme-color;
}
.list-icon-size {
  margin: 0 8px;
  font-size: 18px;
  color: rgb(252, 85, 49);
}
</style>
