<template>
  <div class="wrapper">
    <el-row class="list-wrapper">
      <el-col :sm="24" :md="18" :lg="12" :xl="12" class="content-box">
        <div class="search-box">
          <el-input placeholder="请输入搜索词" v-model.trim="searchWord" clearable @clear="clearSearchWord" @keypress.native.enter="searchQuestion">
            <el-button slot="append" icon="el-icon-search" @click="searchQuestion"></el-button>
          </el-input>
        </div>
        <el-collapse
          v-if="haveContent"
          accordion
          @change="handleChange">
          <div v-for="item of questionList" :key="item.index">
            <el-collapse-item :name="item.question_id" @change="collapseChange">
              <template slot="title">
                <p class="question-title">{{item.question_title}}</p>
                <p class="author">
                  <span class="author-name">{{item.create_userName}}</span>
                  <span class="create-time">{{item.create_time}}</span>
                </p>
              </template>
              <div class="answer-list" v-loading="loadAnswer">
                <div v-if="haveAnswer">
                  <div v-for="item of answerList" :key="item.index" class="answer-item">
                    <p class="answer-content">{{item.answer_content}}</p>
                    <p>
                      <span class="answer-user">{{item.answer_userName}}</span>
                      <span class="answer-time">{{item.answer_time}}</span>
                    </p>
                  </div>
                </div>
                <div v-if="!haveAnswer">
                  <p class="answer-content">暂无回答！</p>
                </div>
                <div class="input-wrapper">
                  <el-input
                    v-if="showInput"
                    placeholder="请填写您的回答"
                    type="textarea"
                    maxlength="120"
                    show-word-limit
                    :autosize="{ minRows: 3, maxRows: 5}"
                    v-model.trim="answerContent">
                  </el-input>
                  <el-button plain size="small" class="cancel-btn" v-if="showInput" @click="hideInput">取消</el-button>
                  <el-tooltip class="item" effect="dark" content="添加我的回答" placement="left">
                    <el-button
                      type="success"
                      circle
                      size="small"
                      v-if="!showInput"
                      class="add-btn"
                      @click="showAddInput">
                      <i class="el-icon-edit add-icon"></i>
                    </el-button>
                    <el-button
                      type="success"
                      circle
                      size="small"
                      class="add-btn"
                      v-if="showInput"
                      @click="addAnswer">
                      <i class="el-icon-s-promotion add-icon"></i>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
        <div v-if="!haveContent" class="no-content-box">
          <p>没有找到任何留言问题~</p>
          <el-button type="success" size="small"  @click="returnAllList">返回全部列表</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="提出问题"
      :visible.sync="dialogVisible"
      width="370px"
      :destroy-on-close="true"
      :before-close="handleClose">
      <el-input
        placeholder="请填写您的问题"
        type="textarea"
        maxlength="120"
        show-word-limit
        :autosize="{ minRows: 5, maxRows: 7}"
        v-model.trim="questionContent">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addQuestion">确 定</el-button>
      </span>
    </el-dialog>
    <el-tooltip class="item" effect="dark" content="发布我的问题" placement="top">
      <div class="add-ques-btn" @click="showAddQueation">
        <i class="el-icon-plus"></i>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="返回顶部" placement="bottom">
      <div class="to-top-btn"  @click="scrollToTop">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-tooltip>
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
  </div>
</template>

<script>
import { discussApi } from '@/api/discussApi'
import { userApi } from '@/api/userApi'

export default {
  name: 'Discuss',
  components: {
  },
  data () {
    return {
      showInput: false,
      answerContent: '',
      questionList: [],
      currQuestionId: '',
      answerList: [],
      haveAnswer: true,
      loadAnswer: false,
      currUserName: '',
      dialogVisible: false,
      questionContent: '',
      showPagination: true,
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        currentPage: 1,
        pageSize: 10
      },
      searchWord: '',
      haveContent: true
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.getQuestList()
    this.getUserName()
  },
  methods: {
    handleChange (val) {
      // console.log('currQuestionId', val)
      this.currQuestionId = val
      const param = {
        key: val
      }
      this.loadAnswer = true
      discussApi
        .getAnswerList(param)
        .then(res => {
          // console.log('getAnswerList', res.data)
          if (res.data.length) {
            this.haveAnswer = true
            this.answerList = res.data
          } else {
            this.haveAnswer = false
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.loadAnswer = false
        })
    },
    getAnswerList () {
      const param = {
        key: this.currQuestionId
      }
      this.loadAnswer = true
      discussApi
        .getAnswerList(param)
        .then(res => {
          // console.log('getAnswerList', res.data)
          if (res.data.length) {
            this.haveAnswer = true
            this.answerList = res.data
          } else {
            this.haveAnswer = false
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.loadAnswer = false
        })
    },
    collapseChange (e) {
      // console.log(e)
    },
    hideInput () {
      this.showInput = false
      this.answerContent = ''
    },
    showAddInput () {
      const currUserId = this.$cookie.get('userId')
      const token = this.$cookie.get('token')
      if (currUserId && token) {
        this.showInput = true
        userApi
          .getUserName(currUserId, token)
          .then(res => {
            if (res.code === 200) {
              // console.log('currUserName', res.data[0].user_name)
              this.currUserName = res.data[0].user_name
            } else {
              this.$message.error(res.message)
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
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
    handleClose () {
      this.$confirm('确认取消？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dialogVisible = false
        })
        .catch(() => {})
    },
    showAddQueation () {
      this.dialogVisible = true
    },
    getUserName () {
      const currUserId = this.$cookie.get('userId')
      const token = this.$cookie.get('token')
      if (currUserId && token) {
        userApi
          .getUserName(currUserId, token)
          .then(res => {
            if (res.code === 200) {
              // console.log('currUserName', res.data[0].user_name)
              this.currUserName = res.data[0].user_name
            } else {
              this.$message.error(res.message)
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
    addQuestion () {
      // console.log('发布我的问题')
      this.getUserName()
      if (this.questionContent.length && this.currUserName) {
        const nowtimeStr = this.formatTime()
        const params = {
          content: this.questionContent,
          userId: this.$cookie.get('userId'),
          userName: this.currUserName,
          time: nowtimeStr
        }
        discussApi
          .addQuestion(params)
          .then(res => {
            // console.log('addQuestion res', res)
            if (res.code === 200) {
              this.questionContent = ''
              this.dialogVisible = false
              this.$message.success(res.message)
              this.getQuestList()
            } else {
              this.$message.error(res.message)
            }
          })
      } else {
        this.$message.warning('请填写您的问题')
      }
    },
    addAnswer () {
      // console.log('添加我的回答')
      if (this.answerContent.length) {
        const nowtimeStr = this.formatTime()
        const params = {
          questionId: this.currQuestionId,
          content: this.answerContent,
          userId: this.$cookie.get('userId'),
          userName: this.currUserName,
          time: nowtimeStr
        }
        discussApi
          .addAnswer(params)
          .then(res => {
            // console.log('addAnswer', res)
            if (res.code === 200) {
              this.showInput = false
              this.answerContent = ''
              this.$message.success(res.message)
              this.getAnswerList()
            } else {
              this.$message.error(res.message)
            }
          })
      } else {
        this.$message.warning('请填写您的回答')
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageParams.pageSize = val
      this.getQuestList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pageParams.currentPage = val
      this.getQuestList()
    },
    getQuestList () {
      discussApi
        .getQuestionList(this.pageParams)
        .then(res => {
          // console.log('问题数据列表', res.data)
          if (res.data.data.length) {
            this.questionList = []
            this.haveContent = true
            this.showPagination = true
            this.questionList = res.data.data
            this.total = res.data.total
          } else {
            this.haveContent = false
            this.showPagination = false
          }
        })
        .catch(e => {
          this.$message.error(e)
        })
    },
    scrollToTop () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    clearSearchWord () {
      this.getQuestList()
      this.haveContent = true
      this.showPagination = true
    },
    searchQuestion () {
      if (this.searchWord.length) {
        const param = {
          key: this.searchWord
        }
        discussApi
          .searchQuestion(param)
          .then(res => {
            // console.log('searchQuestion res', res)
            if (res.data.length) {
              this.questionList = res.data
              this.haveContent = true
              this.showPagination = false
            } else {
              this.haveContent = false
              this.showPagination = false
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.getQuestList()
      }
    },
    returnAllList () {
      this.searchWord = ''
      this.getQuestList()
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3CB371;
.wrapper {
  min-height: 80vh;
}
.list-wrapper {
  display: flex;
  justify-content: center;
  min-height: 80vh;
  margin-bottom: 40px;
  background-color: #eee;
}
.content-box {
  background-color: #fff;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .3), 0 0 6px rgba(0, 0, 0, .24);
}
.search-box {
  margin: 30px 10px;
}
// 重写展开菜单头
.el-collapse-item /deep/ .el-collapse-item__header {
  display: block;
  align-items: center;
  height: 150px;
  line-height: 20px;
  margin: 10px 10px 40px;
  padding: 10px;
  background-color: #f8f8f8;
  color: #444;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: border-bottom-color .4s;
  outline: 0;
  border: 1px solid rgba(60, 179, 113, .5);
  box-shadow: 0 6px 8px rgba(60, 179, 113, .2), 0 0 6px rgba(60, 179, 113, .04);
}
.question-title {
  display: block;
  text-align: justify;
  width: 95%;
  margin: 10px;
}
.author {
  display: block;
  width: 100%;
  font-size: 13px;
  color: #666;
}
.author-name {
  display: inline-block;
  padding: 0 10px;
  border-right: 1px solid $theme-color;
}
.create-time {
  display: inline-block;
  padding: 0 10px;
}
.answer-list {
  padding: 0 20px;
  background-color: #f9f9f9;
}
.answer-item {
  margin-bottom: 20px;
  padding: 10px;
  text-align: justify;
  border-bottom: 1px dashed $theme-color;
}
.answer-content {
  padding: 0 15px;
  font-size: 14px;
  color: #666;
}
.answer-user {
  display: inline-block;
  padding: 0 15px;
  font-size: 12px;
  color: #999;
  border-right: 1px solid #999;
}
.answer-time {
  display: inline-block;
  padding: 0 15px;
  font-size: 12px;
  color: #999;
}
.input-wrapper {
  padding: 25px;
}
.cancel-btn {
  margin: 10px;
}
.add-btn {
  margin: 10px;
  float: right;
}
.add-icon {
  font-size: 16px;
}
.no-content-box {
  width: 90%;
  height: 150px;
  margin: 15px;
  padding: 15px;
  font-size: 15px;
  color: #999;
  font-weight: 500;
  background-color: #f8f8f8;
  border: 1px solid rgba(60, 179, 113, .5);
  box-shadow: 0 6px 8px rgba(60, 179, 113, .2), 0 0 6px rgba(60, 179, 113, .04);
}
.add-ques-btn {
  position: fixed;
  bottom: 55%;
  right: 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $theme-color;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
}
.to-top-btn {
  position: fixed;
  bottom: 47%;
  right: 40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $theme-color;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
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
</style>
