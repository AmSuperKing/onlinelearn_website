<template>
  <div class="play-wrapper">
    <el-row class="play-box">
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
          <p class="play-video-info-title">《{{courseInfo.name}}》</p>
          <p class="play-video-info-subtitle">{{currVideoInfo.source_name}}</p>
          <p class="source-sub-info">
            <span class="source-info">{{currVideoInfo.source_type}}</span>
            <span class="source-info">{{currVideoInfo.add_time}}</span>
            <span class="source-info"><i class="el-icon-view"></i> {{currVideoInfo.count_num}} 人次查看</span>
          </p>
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
    </el-row>
  </div>
</template>

<script>
import { courseInfoApi } from '@/api/courseInfoApi'
import { historyApi } from '@/api/historyApi'
import vueQr from 'vue-qr'
import vueFlvPlayer from 'vue-flv-player'

export default {
  name: 'PlayVideo',
  components: {
    vueQr,
    vueFlvPlayer
  },
  data () {
    return {
      isMp4: false,
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
      currUrl: '',
      videoSrc: '',
      courseInfo: {},
      currVideoInfo: {},
      addParams: {
        title: '',
        time: '',
        id: '',
        path: ''
      }
    }
  },
  mounted () {
    this.getCurrUrl()
    this.getCourseInfo()
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
    getCurrUrl () {
      this.currUrl = window.location.href
    },
    getCourseInfo () {
      // console.log(this.$route.params.type)
      courseInfoApi
        .getCourseInfo(this.$route.params.type)
        .then(res => {
          // console.log('getCourseInfo', res.data)
          if (res.data.length) {
            this.courseInfo = res.data[0]
            this.getCurrVideoInfo()
          }
        })
        .catch((e) => {})
    },
    getCurrVideoInfo () {
      // console.log(this.$route.params.type, this.$route.params.file)
      const params = {
        type: this.$route.params.type,
        file: this.$route.params.file
      }
      courseInfoApi
        .getCurrFileInfo(params)
        .then(res => {
          // console.log('getCurrFileInfo', res.data)
          if (res.data.data.length) {
            this.currVideoInfo = res.data.data[0]
            // console.log('this.currVideoInfo', this.currVideoInfo)
            this.judeFileType()
          }
        })
        .catch((e) => {})
    },
    judeFileType () {
      if (this.currVideoInfo.source_type === 'mp4') {
        this.isMp4 = true
        this.isFlv = false
        this.playerOptions.sources[0].type = ''
        this.playerOptions.sources[0].src = ''
        this.playerOptions.sources[0].type = 'video/mp4'
        this.playerOptions.sources[0].src = this.currVideoInfo.source_path
        // console.log(this.playerOptions.sources.src)
      } else if (this.currVideoInfo.source_type === 'flv') {
        this.isMp4 = false
        this.isFlv = true
        this.videoSrc = this.currVideoInfo.source_path
        // console.log(this.videoUrl)
      }
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
        this.addParams.title = this.currVideoInfo.source_name
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
.play-box {
  display: flex;
  justify-content: center;
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
  padding: 0 15px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}
.source-sub-info {
  position: relative;
  padding: 0 15px;
}
.source-sub-info span:nth-child(3) {
  border-right: 0;
}
.source-info {
  display: inline-block;
  padding: 0 10px;
  font-size: 12px;
  color: rgb(155, 155, 155);
  border-right: 1px solid rgb(180, 180, 180);
}
.source-info:first-child {
  padding-left: 0;
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
</style>
