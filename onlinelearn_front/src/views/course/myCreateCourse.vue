<template>
  <div>
    <el-row class="sort-menu">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">默认排序</el-menu-item>
          <el-menu-item index="2">学习人数</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="input-box">
        <div class="input-wrapper">
          <el-input placeholder="请输入搜索词" v-model.trim="searchWord" clearable @clear="clearSearchWord" @keypress.native.enter="searchCourse">
            <el-button slot="append" icon="el-icon-search" @click="searchCourse"></el-button>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row class="list-item" v-show="!noHaveContent">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8"
        v-for="(item, index) of courseList"
        :key="index"
      >
        <div class="course-card">
          <router-link class="container-block" :to="'/course/' + item.path" @click.native="addCountNum(item)">
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
            <span class="rec_desc">{{item.describe_text}}</span>
            <span class="click_num">{{item.count_num}} 次点击浏览</span>
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
        <el-button size="small" type="primary" class="show-all-btn" @click="getMyCourseList">返回全部列表</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import { courseInfoApi } from '@/api/courseInfoApi'

export default {
  name: 'MyCreateCourse',
  data () {
    return {
      haveLogin: false,
      searchWord: '',
      noHaveContent: false,
      courseList: [{
        name: '暂无数据',
        path: '',
        describe_text: '',
        imgUrl: ''
      }],
      showPagination: true,
      currSortModel: '1',
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        user: '',
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0)
  },
  methods: {
    getMyCourseList () {
      const userId = this.$cookie.get('userId')
      if (userId) {
        this.pageParams.user = userId
        courseInfoApi
          .getMyCourseList(this.pageParams)
          .then(res => {
            // console.log('文档数据列表', res.data)
            if (res.data.data.length) {
              this.courseList = []
              this.noHaveContent = false
              this.showPagination = true
              this.courseList = res.data.data
              if (this.currSortModel === '2') {
                if (this.courseList.length > 1) {
                  this.courseList.sort(this.sortByNum('count_num'))
                }
              } else {
                if (this.courseList.length > 1) {
                  this.courseList.sort(this.sortByName('name'))
                }
              }
              this.total = res.data.total
            } else {
              this.$emit('noMyCreate')
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
      if (key === '2') {
        if (this.courseList.length > 1) {
          this.currSortModel = key
          this.courseList.sort(this.sortByNum('count_num'))
        }
      } else {
        if (this.courseList.length > 1) {
          this.currSortModel = key
          this.courseList.sort(this.sortByName('name'))
        }
      }
    },
    clearSearchWord () {
      this.getMyCourseList()
      this.noHaveContent = false
      this.showPagination = true
    },
    searchCourse () {
      // console.log('搜索关键词：', this.searchWord)
      if (this.searchWord.length) {
        const userId = this.$cookie.get('userId')
        courseInfoApi
          .searchCreateCourse(userId, this.searchWord)
          .then(res => {
            // console.log('搜索结果：', res.data)
            if (res.data.length) {
              this.courseList = []
              this.courseList = res.data
              if (this.currSortModel === '2') {
                if (this.courseList.length > 1) {
                  this.courseList.sort(this.sortByNum('count_num'))
                }
              } else {
                if (this.courseList.length > 1) {
                  this.courseList.sort(this.sortByName('name'))
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
        this.getMyCourseList()
      }
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
      courseInfoApi
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
      this.getMyCourseList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pageParams.currentPage = val
      this.getMyCourseList()
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.sort-menu {
  padding-bottom: 15px;
  border-bottom: 1px solid $theme-color;
}
.input-wrapper {
  width: 100%;
  float: right;
  margin: 0 auto;
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

.list-item {
  min-height: 60vh;
  text-align: left;
  padding-top: 5px;
}
.course-card {
  margin: 15px auto;
  width: 80%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
}
.container-block {
  display: block;
  width: 100%;
  height: 200px;
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
  height: 160px;
  margin: 2px;
  border: 1px solid rgba(60, 179, 113, .4);
}
.rec-text {
  padding: 4px;
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
  display: inline-block;
  width: 60%;
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
  padding: 6px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: 1px solid rgb(214, 214, 214);
  background: #fff;
}
.click_num {
  float: right;
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
