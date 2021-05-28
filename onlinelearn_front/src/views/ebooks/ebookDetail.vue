<template>
  <div class="detail-page">
    <el-row class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ebooks' }">电子书籍</el-breadcrumb-item>
        <el-breadcrumb-item>{{currEbookInfo.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="ebook-info-card">
      <el-row class="card-box" :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12"
          class="image-wrapper">
          <el-image
            v-if="currEbookInfo.imgUrl"
            :src="currEbookInfo.imgUrl"
            class="ebook-info-img"
            fit="cover"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="info-text-wrapper">
          <p class="info-title">{{currEbookInfo.name}}</p>
          <div class="info-desc-wrapper">
            <span class="info-desc"><i class="el-icon-reading info-icon"></i>电子书籍</span>
            <span class="info-desc"><i class="el-icon-s-flag info-icon"></i>书籍可下载</span>
            <span class="info-desc"><i class="el-icon-view info-icon"></i>{{currEbookInfo.count_num}}&nbsp;次阅读</span>
          </div>
          <p class="info-desc-text">描述：{{currEbookInfo.describe_text}}</p>
          <p class="info-author-text">创建者：{{userName}}</p>
          <p class="info-author-text">创建时间：{{currEbookInfo.newTime}}</p>
          <div class="start-study-btn-wrapper">
            <el-button type="primary" @click="gotoStart">
              开始阅读
            </el-button>
            <span class="collect-btn" @click="collectToHistory"><i class="el-icon-star-off collect-star-icon"></i>收藏</span>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="section-wrapper">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16" class="source-box">
        <el-collapse v-model="activeName">
          <el-collapse-item name="ebookSource">
            <template slot="title">
              <span class="source-title">电子书籍下载<i class="header-icon el-icon-more"></i></span>
            </template>
            <ul class="chapters-list">
              <li class="chapters-list-item">
                <span class="down-link" @click="openDownload(ebookUrl)">
                  <p>
                    <span class="list-item-text">
                      <i class="el-icon-reading list-icon-size"></i>{{currEbookInfo.name}}.{{end}}
                    </span>
                  </p>
                </span>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { userApi } from '@/api/userApi'
import { ebookInfoApi } from '@/api/ebookInfoApi'
import { historyApi } from '@/api/historyApi'
import download from 'downloadjs' // 引用插件

export default {
  name: 'EbookDetail',
  components: {
  },
  data () {
    return {
      currEbookInfo: {
        imgUrl: 'http://127.0.0.1:8186/images/4.jpg'
      },
      userName: '',
      activeName: 'ebookSource',
      sourceList: '',
      addParams: {
        title: '',
        time: '',
        id: '',
        path: ''
      },
      ebookUrl: '',
      end: ''
    }
  },
  mounted () {
    this.getEbookInfo()
  },
  methods: {
    getEbookInfo () {
      // console.log(this.$route.params.ebookName)
      const nameParam = this.$route.params.ebookName
      if (nameParam) {
        ebookInfoApi
          .getEbookInfo(nameParam)
          .then(res => {
            // console.log('getEbookInfo', res.data)
            if (res.data.length) {
              this.currEbookInfo = res.data[0]
              if (res.data[0].file_url) this.ebookUrl = res.data[0].file_url
              this.end = this.ebookUrl.split('.').pop()
              this.getUserName(this.currEbookInfo.creator)
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      }
    },
    getUserName (currUserId) {
      const param = {
        curr_id: currUserId
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
    gotoStart () {
      if (this.end === 'pdf') {
        this.$router.push({
          path: this.$route.path + '/1'
        })
      } else {
        this.$message.warning('当前格式只支持下载查看')
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
        this.addParams.title = this.currEbookInfo.name
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
    openDownload (url) {
      const currUserId = this.$cookie.get('userId')
      if (currUserId) {
        // console.log('title:', title)
        // const paramsArr = this.$route.path.split('/')
        // paramsArr.shift(0)
        // paramsArr.push(this.currEbookInfo.name)
        // paramsArr.push(suffix)
        // console.log(paramsArr)
        // ebookInfoApi
        //   .getSourceByType(paramsArr)
        //   .then(res => {
        //     // console.log(res.data)
        //     if (res.data.data) {
        //       download(res.data.data)
        //     } else {
        //       this.$message.warning(res.data.message)
        //     }
        //   })
        //   .catch((e) => {
        //     // console.log(e)
        //   })
        download(url)
      } else {
        this.$message.warning('请先登录')
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
  margin-bottom: 10px;
  padding: 15px;
  border-bottom: 1px solid $theme-color;
}
.ebook-info-card {
  min-height: 40vh;
  display: flex;
  justify-content: center;
  background-color: #f9f9f9;
}
.card-box {
  min-width: 60vw;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .3), 0 0 6px rgba(0, 0, 0, .24);
  background-color: #fff;
}
.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  border-right: 1px dashed $theme-color;
}
.ebook-info-img {
  width: 25vh;
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
.start-btn {
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
  min-height: 20vh;
  margin-top: 40px;
  margin-bottom: 30px;
}
.source-box {
  min-width: 60vw;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .3), 0 6px 20px 0 rgba(0, 0, 0, .25);
  background-color: #fff;
}
.source-title {
  margin-left: 10px;
  font-size: 15px;
  font-weight: bold;
  color: rgb(252, 85, 49);
}
.chapters-list {
  list-style: none;
  padding-inline-start: 0;
}
.chapters-list-item {
  width: 100%;
  border-bottom: 1px dashed $theme-color;
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
