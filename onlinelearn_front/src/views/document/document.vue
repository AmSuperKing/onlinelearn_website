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
          <el-input placeholder="请输入搜索词" v-model.trim="searchWord" clearable @clear="clearSearchWord" @keypress.native.enter="searchDocument">
            <el-button slot="append" icon="el-icon-search" @click="searchDocument"></el-button>
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
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8"
            v-for="(item, index) of documentList"
            :key="index"
            class="item-wrapper">
            <div  class="document-card">
              <router-link class="container-block" :to="'/document/' + item.path" @click.native="addCountNum(item)">
                <el-row>
                  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="img_wrapper">
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
              <div class="count_num">
                <p>{{item.count_num}} 次点击浏览</p>
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
            <el-button size="small" type="primary" class="show-all-btn" @click="getDocumentList">返回全部文档列表</el-button>
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
import { getDocumentApi } from '@/api/getDocumentApi'

export default {
  name: 'Document',
  components: {
  },
  data () {
    return {
      searchWord: '',
      documentList: [{
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
    this.getDocumentList()
  },
  methods: {
    getDocumentList () {
      getDocumentApi
        .getDocumentList(this.pageParams)
        .then(res => {
          // console.log('文档数据列表', res.data)
          if (res.data) {
            this.documentList = []
            this.noHaveContent = false
            this.showPagination = true
            this.documentList = res.data.data
            if (this.currSortModel === '2') {
              if (this.documentList.length > 1) {
                this.documentList.sort(this.sortByNum('count_num'))
              }
            } else {
              if (this.documentList.length > 1) {
                this.documentList.sort(this.sortByName('name'))
              }
            }
            this.total = res.data.total
          }
        })
        .catch(e => {
          this.$message.error(e)
        })
    },
    searchDocument () {
      // console.log('搜索关键词：', this.searchWord)
      if (this.searchWord.length) {
        getDocumentApi
          .searchDocument(this.searchWord)
          .then(res => {
            // console.log('搜索结果：', res.data)
            if (res.data.length) {
              this.documentList = []
              this.documentList = res.data
              if (this.currSortModel === '2') {
                if (this.documentList.length > 1) {
                  this.documentList.sort(this.sortByNum('count_num'))
                }
              } else {
                if (this.documentList.length > 1) {
                  this.documentList.sort(this.sortByName('name'))
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
        this.getDocumentList()
      }
    },
    handleSelect (key, keyPath) {
      if (key === '2') {
        if (this.documentList.length > 1) {
          this.currSortModel = key
          this.documentList.sort(this.sortByNum('count_num'))
        }
      } else {
        if (this.documentList.length > 1) {
          this.currSortModel = key
          this.documentList.sort(this.sortByName('name'))
        }
      }
    },
    clearSearchWord () {
      this.getDocumentList()
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
      getDocumentApi
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
      this.getDocumentList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pageParams.currentPage = val
      this.getDocumentList()
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
  min-height: 85%;
  text-align: left;
  padding-top: 5px;
}
.document-card {
  margin: 15px auto;
  width: 80%;
  border-radius: 8px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
}
.container-block {
  display: block;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  background: #f8f8f8;
}
.img_wrapper {
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
// 点击次数
.count_num {
  width: 100%;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: 1px solid rgb(214, 214, 214);
  text-align: right;
  background: #fff;
}
.count_num > p {
  padding: 6px;
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
