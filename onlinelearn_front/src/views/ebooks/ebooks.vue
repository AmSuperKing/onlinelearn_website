<template>
  <div class="wrapper">
    <!-- 搜索一行 -->
    <el-row>
      <!-- 左侧 -->
      <el-col :sm="3" :md="3" :lg="3" :xl="3" class="hidden-xs-only">
        <el-row>
          <div class="hold-place"></div>
        </el-row>
      </el-col>
      <!-- 中侧 -->
      <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="serach-wrapper">
        <div class="input-wrapper">
          <el-input placeholder="请输入搜索词" v-model.trim="searchWord" clearable @clear="clearSearchWord" @keypress.native.enter="searchEbook">
            <el-button slot="append" icon="el-icon-search" @click="searchEbook"></el-button>
          </el-input>
        </div>
      </el-col>
      <!-- 右侧 -->
      <el-col :sm="3" :md="3" :lg="3" :xl="3" class="hidden-xs-only">
        <el-row>
          <div class="hold-place"></div>
        </el-row>
      </el-col>
    </el-row>
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
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-menu-item index="1">默认排序</el-menu-item>
              <el-menu-item index="2">学习人数</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        <el-row class="list-item" v-show="!noHaveContent">
          <el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="4"
            class="ebook-card-wrapper"
            v-for="(item, index) of ebookList"
            :key="index"
          >
            <div class="ebook-card">
              <router-link class="container-block" :to="'/ebooks/' + item.path" @click.native="addCountNum(item)">
                <div class="img_wrapper">
                  <el-image
                    class="rec_img"
                    :src="item.imgUrl"
                    fit="cover">
                  </el-image>
                </div>
                <div class="rec-text">
                  <p class="rec_title">{{item.name}}</p>
                </div>
              </router-link>
              <div class="count_num">
                <p class="rec_desc">{{item.describe_text}}</p>
                <p class="click_num">{{item.count_num}} 次点击浏览</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="pagination-wrapper" v-show="showPagination">
          <el-pagination
            :background="true"
            :current-page="pageParams.currentPage"
            :page-sizes="pageSizes"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </el-row>
        <!-- 搜索无结果时显示 -->
        <el-row>
          <div v-show="noHaveContent" class="no-content">
            <p class="no-content-text">暂无结果,建议换个关键词看看~</p>
            <div class="no-content-img-box">
              <img class="no-content-img" src="../../assets/imgs/sorry.jpg" alt="sorry-no-content"/>
            </div>
            <el-button size="small" type="primary" class="show-all-btn" @click="getEbookList">返回全部书籍列表</el-button>
          </div>
        </el-row>
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
import { ebookInfoApi } from '@/api/ebookInfoApi'

export default {
  name: 'Ebooks',
  components: {
  },
  data () {
    return {
      searchWord: '',
      ebookList: [{
        name: '暂无数据',
        path: '',
        describe_text: '',
        imgUrl: ''
      }],
      noHaveContent: false,
      showPagination: true,
      currSortModel: '1',
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.getEbookList()
  },
  methods: {
    getEbookList () {
      ebookInfoApi
        .getEbookList(this.pageParams)
        .then(res => {
          // console.log('文档数据列表', res.data)
          if (res.data) {
            this.ebookList = []
            this.noHaveContent = false
            this.showPagination = true
            this.ebookList = res.data.data
            if (this.currSortModel === '2') {
              if (this.ebookList.length > 1) {
                this.ebookList.sort(this.sortByNum('count_num'))
              }
            } else {
              if (this.ebookList.length > 1) {
                this.ebookList.sort(this.sortByName('name'))
              }
            }
            this.total = res.data.total
          }
        })
        .catch(e => {
          this.$message.error(e)
        })
    },
    searchEbook () {
      // console.log('搜索关键词：', this.searchWord)
      if (this.searchWord.length) {
        ebookInfoApi
          .searchEbook(this.searchWord)
          .then(res => {
            // console.log('搜索结果：', res.data)
            if (res.data.length) {
              this.ebookList = []
              this.ebookList = res.data
              if (this.currSortModel === '2') {
                if (this.ebookList.length > 1) {
                  this.ebookList.sort(this.sortByNum('count_num'))
                }
              } else {
                if (this.ebookList.length > 1) {
                  this.ebookList.sort(this.sortByName('name'))
                }
              }
              this.noHaveContent = false
              this.showPagination = false
            } else {
              this.noHaveContent = true
              this.showPagination = false
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      } else {
        this.getEbookList()
      }
    },
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
      if (key === '2') {
        if (this.ebookList.length > 1) {
          this.currSortModel = key
          this.ebookList.sort(this.sortByNum('count_num'))
        }
      } else {
        if (this.ebookList.length > 1) {
          this.currSortModel = key
          this.ebookList.sort(this.sortByName('name'))
        }
      }
    },
    clearSearchWord () {
      this.getEbookList()
      this.noHaveContent = false
      this.showPagination = true
    },
    sortByNum (prop) {
      return (obj1, obj2) => {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (val1 > val2) {
          return -1
        } else if (val1 < val2) {
          return 1
        } else {
          return 0
        }
      }
    },
    sortByName (prop) {
      return (obj1, obj2) => {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      }
    },
    addCountNum (param) {
      // console.log('"点击："', param)
      ebookInfoApi
        .updateCountNum(param)
        .then(res => {
          // console.log(res.data.message)
        })
        .catch((e) => {
          // console.log(e)
        })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageParams.pageSize = val
      this.getEbookList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pageParams.currentPage = val
      this.getEbookList()
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
.serach-wrapper {
  text-align: right;
  background-color: #fff;
  border-bottom: 1px solid $theme-color;
}
.input-wrapper {
  float: right;
  margin: 20px 20px 6px 0;
}
// 排序菜单栏样式重写start
.el-menu.el-menu--horizontal {
  padding: 10px;
  border-bottom: 0;
}
.el-menu-item {
  padding: 0 5px;
}
.el-menu--horizontal>.el-menu-item {
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
  border-radius: 20px;
}
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 0;
  color: #fff;
  background-color: #3CB371;
}
// 排序菜单栏样式重写end
.content-wrapper {
  height: 80vh;
  overflow-y: scroll;
  background-color: #fff;
}
.content-wrapper::-webkit-scrollbar {
  width: 6px; /* 对垂直流动条有效 */
  height: 0;
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
.list-item {
  min-height: 80%;
  padding: 5px 10px 0 10px;
  text-align: left;
}
.ebook-card-wrapper {
  justify-content: center;
}
.ebook-card {
  margin: 15px;
  width: 95%;
  min-height: 250px;
  border-radius: 8px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
}
.container-block {
  display: block;
  width: 90%;
  min-height: 200px;
  margin: 0 auto;
  background: #f8f8f8;
}
.container-block:visited,
.container-block:hover,
.container-block:active {
  text-decoration: none;
}
.img_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.rec_img {
  width: auto;
  height: 180px;
  margin: 2px;
  border: 1px solid rgba(60, 179, 113, .4);
}
.rec-text {
  padding: 0;
}
.rec_title {
  margin: 4px 0;
  font-size: 14px;
  font-weight: bold;
  color: rgb(105, 105, 105);
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rec_desc {
  width: 95%;
  margin-bottom: 0;
  font-size: 12px;
  color: #8f8f8f;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
// 点击次数
.count_num {
  width: 100%;
  height: 50px;
  padding: 6px 6px 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: 1px solid rgb(214, 214, 214);
  background: #fff;
}
.click_num {
  margin: 0 6px 10px 0;
  float: left;
  font-size: 12px;
  color: #9199a1;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
}
.el-pagination {
  white-space: pre-wrap;
}
.no-content {
  width: 100%;
  height: 100%;
  padding-top: 100px;
  text-align: center;
}
.no-content-text {
  font-size: 16px;
  font-weight: 100;
  color: #8f8f8f;
}
.no-content-img-box {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60%;
}
.no-content-img {
  width: 40%;
  height: auto;
}
.show-all-btn {
  margin: 20px;
}
</style>
