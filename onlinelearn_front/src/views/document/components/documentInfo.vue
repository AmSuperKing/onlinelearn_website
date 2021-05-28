<template>
  <div class="detail-page">
    <el-row class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/document' }">文档教程</el-breadcrumb-item>
        <el-breadcrumb-item>{{currDocInfo.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="doc-info-card">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12"
        class="image-wrapper">
        <el-image
          v-if="currDocInfo.imgUrl"
          :src="currDocInfo.imgUrl"
          class="doc-info-img"
          fit="cover"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="info-text-wrapper">
        <p class="info-title">{{currDocInfo.name}}</p>
        <div class="info-desc-wrapper">
          <span class="info-desc"><i class="el-icon-document info-icon"></i>文档教程</span>
          <span class="info-desc"><i class="el-icon-info info-icon"></i>当前共&nbsp;{{chapterLen}}&nbsp;个小节</span>
          <span class="info-desc"><i class="el-icon-view info-icon"></i>{{currDocInfo.count_num}}&nbsp;次点击</span>
        </div>
        <p class="info-desc-text">描述：{{currDocInfo.describe_text}}</p>
        <div class="start-study-btn-wrapper">
          <el-button type="primary" @click="startRead">
            开始学习
          </el-button>
          <span class="collect-btn" @click="collectToHistory">
            <span><i class="el-icon-star-off collect-star-icon"></i></span>收藏
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row class="section-wrapper">
      <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
        <el-collapse v-model="activeName">
          <el-collapse-item name="docChapter">
            <template slot="title">
              <span class="list-title">文档目录列表<i class="header-icon el-icon-more"></i></span>
            </template>
            <ul v-for="item of chapterList" :key="item.section_key" class="chapters-list">
              <li v-if="!noSection" class="chapters-list-item">
                <router-link :to="$route.path + '/' + item.section_id" class="list-item">
                  <p>
                    <span class="list-item-text">
                      <i class="el-icon-document list-icon-size"></i>{{item.section_title}}
                    </span>
                    <el-button size="mini" class="play-btn">阅读</el-button>
                  </p>
                </router-link>
              </li>
              <li v-if="noSection" class="chapters-list-item">
                <el-link href="" class="no-list-item" disabled>
                  <p>
                    <span class="list-item-text">
                      <i class="el-icon-document list-icon-size"></i>{{item.section_title}}
                    </span>
                    <el-button size="mini" class="play-btn">阅读</el-button>
                  </p>
                </el-link>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDocumentApi } from '@/api/getDocumentApi'
import { historyApi } from '@/api/historyApi'

export default {
  name: 'DocumentInfo',
  components: {
  },
  data () {
    return {
      currDocInfo: {
        imgUrl: 'http://127.0.0.1:8186/images/4.jpg'
      },
      activeName: 'docChapter',
      chapterLen: 0,
      noSection: true,
      chapterList: [{
        doc_name: '暂无数据',
        section_title: '暂无数据',
        section_id: '',
        section_key: '0'
      }],
      addParams: {
        title: '',
        time: '',
        id: '',
        path: ''
      }
    }
  },
  mounted () {
    this.getDocInfo()
    this.getDocSectionList()
  },
  methods: {
    getDocInfo () {
      // console.log(this.$route.params.documentName)
      const nameParam = this.$route.params.documentName
      if (nameParam) {
        getDocumentApi
          .getDocInfo(nameParam)
          .then(res => {
            // console.log('getDocInfo', res.data)
            if (res.data.length) {
              this.currDocInfo = res.data[0]
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      }
    },
    getDocSectionList () {
      const nameParam = this.$route.params.documentName
      getDocumentApi
        .getDocSectionList(nameParam)
        .then(res => {
          // console.log('getDocSectionList', res.data)
          if (res.data.data.length) {
            var temp = []
            temp = res.data.data
            temp.sort(this.sortByName('section_key'))
            this.orderSort(temp)
            this.noSection = false
            this.chapterLen = res.data.data.length
          } else {
            this.noSection = true
            this.chapterLen = 0
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    startRead () {
      if (this.chapterLen) {
        this.$router.push({
          path: this.$route.path + '/section1'
        })
      } else {
        this.$message.warning('暂无章节可阅读')
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
        this.addParams.title = this.currDocInfo.name
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
.doc-info-card {
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
.doc-info-img {
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
  padding: 20px 0;
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
// 章节模块
.section-wrapper {
  display: flex;
  justify-content: center;
  min-height: 40vh;
  margin-top: 40px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: #fff;
}
.el-collapse {
  width: 90%;
  margin: 0 10px;
}
.list-title {
  font-size: 15px;
  color: $theme-color;
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
