<template>
  <div
    class="ebook-read-wrapper"
    v-loading="loading"
  >
    <el-row class="breadcrumb-wrapper hidden-xs-only">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ebooks' }">电子书籍</el-breadcrumb-item>
        <el-breadcrumb-item :to="'/ebooks/'+ currEbookInfo.path">{{currEbookInfo.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>书籍在线阅读</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="read-box">
      <el-col :xs="24" :sm="24" :md="18" :lg="16" :xl="12" class="pdf-box">
        <pdf
          :page="pageNum"
          :src="url"
          @progress="loadedRatio=$event"
          @num-pages="pageTotalNum=$event"
        ></pdf>
      </el-col>
    </el-row>
    <el-row class="page-num-wrapper">
      <div class="page-num"><span class="curr-page-num">{{ pageNum }}</span> / <span>{{ pageTotalNum }}</span></div>
    </el-row>
    <el-row  class="page-btns-wrapper">
      <el-button-group>
        <el-button type="primary" size="mini" @click="prePage"><i class="el-icon-arrow-left"></i> 上一页</el-button>
        <el-button type="primary" size="mini" @click="nextPage">下一页 <i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
    </el-row>
    <div class="jump-wrapper">
      <div class="input-box">
        <el-input
          class="input-num"
          placeholder="请输入跳转页数"
          v-model="jumpNum"
          size="mini"
          type="number"
          min="1"
          :max="pageTotalNum">
        </el-input>
        <el-button size="mini" @click="jumpPage">跳转</el-button>
      </div>
    </div>
    <div class="collect-btn" @click="collectToHistory">
      <el-tooltip class="item" effect="dark" content="添加书签" placement="top">
        <i class="el-icon-star-off collect-star-icon"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { ebookInfoApi } from '@/api/ebookInfoApi'
import { historyApi } from '@/api/historyApi'
import pdf from 'vue-pdf'

export default {
  name: 'EbookRead',
  components: {
    pdf
  },
  data () {
    return {
      loading: false,
      url: '',
      pageNum: 1,
      pageTotalNum: 1,
      loadedRatio: 0, // 当前页面的加载进度，范围是0-1 ，等于1的时候代表当前页已经完全加载完成了
      jumpNum: null,
      currEbookInfo: {},
      addParams: {
        title: '',
        time: '',
        id: '',
        path: ''
      }
    }
  },
  mounted () {
    this.getEbookInfo()
    window.scrollTo(0, 0)
  },
  methods: {
    getEbookInfo () {
      const ebookName = this.$route.params.ebookName
      if (ebookName) {
        ebookInfoApi
          .getEbookInfo(ebookName)
          .then(res => {
            // console.log('getEbookInfo', res.data[0])
            if (res.data.length) {
              this.currEbookInfo = res.data[0]
              this.getEbookUrl()
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      }
    },
    getEbookUrl () {
      this.loading = true
      // const pathArr = this.$route.path.split('/')
      // pathArr.shift(0)
      // pathArr.pop()
      // pathArr.push(this.currEbookInfo.name)
      // console.log(pathArr)
      // ebookInfoApi
      //   .getEbookUrl(pathArr)
      //   .then(res => {
      //     // console.log(res.data)
      //     if (res.data.data) {
      //       this.url = res.data.data
      //       this.setCurrPageNum()
      //     }
      //   })
      //   .catch((e) => {
      //     // console.log(e)
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
      if (this.currEbookInfo.file_url) {
        this.url = this.currEbookInfo.file_url
        setTimeout(() => {
          this.loading = false
        }, 2000)
      }
    },
    setCurrPageNum () {
      this.pageNum = parseInt(this.$route.params.pageNum)
    },
    // 上一页
    prePage () {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
      const prePathArr = this.$route.path.split('/')
      prePathArr.pop()
      const preStr = prePathArr.join('/')
      // console.log(preStr)
      this.$router.replace({
        path: preStr + '/' + this.pageNum
      })
      window.scrollTo(0, 0)
    },
    // 下一页
    nextPage () {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
      const prePathArr = this.$route.path.split('/')
      prePathArr.pop()
      const preStr = prePathArr.join('/')
      // console.log(preStr)
      this.$router.replace({
        path: preStr + '/' + this.pageNum
      })
      window.scrollTo(0, 0)
    },
    jumpPage () {
      if (this.jumpNum < 1 || this.jumpNum > this.pageTotalNum) {
        this.$message.warning('请输入页码范围数字')
        this.jumpNum = null
      } else {
        this.pageNum = parseInt(this.jumpNum)
        const prePathArr = this.$route.path.split('/')
        prePathArr.pop()
        const preStr = prePathArr.join('/')
        this.$router.replace({
          path: preStr + '/' + this.pageNum
        })
        this.jumpNum = null
        window.scrollTo(0, 0)
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
        // console.log('this.currEbookInfo', this.currEbookInfo)
        this.addParams.title = this.currEbookInfo.name
        this.addParams.time = nowtimeStr
        this.addParams.id = currUserId
        this.addParams.path = this.$route.path
        // console.log('this.addParams', this.addParams)
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
.ebook-read-wrapper {
  min-height: 80vh;
  overflow: scroll;
  background-color: #ddd;
}
.breadcrumb-wrapper {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fff;
}
.read-box {
  display: flex;
  justify-content: center;
}
.pdf-box {
  box-shadow: 0 6px 8px rgba(0, 0, 0, .3), 0 0 6px rgba(0, 0, 0, .24);
  background-color: #fff;
}
.page-num-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.page-num {
  width: 100%;
  padding-top: 20px;
  text-align: center;
  background-color: #fff;
}
.curr-page-num {
  color: $theme-color;
}
.page-btns-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  background-color: #fff;
}
.jump-wrapper {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
  background-color: #fff;
}
.input-num {
  width: 150px;
  margin-right: 20px;
}
.collect-btn {
  position: fixed;
  right: 40px;
  bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: $theme-color;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 6px 8px rgba(60, 179, 113, .7), 0 0 6px rgba(60, 179, 113, .54);
}
.collect-btn:hover {
  color: rgb(252, 85, 49);
}
.collect-star-icon {
  font-size: 32px;
}
</style>
