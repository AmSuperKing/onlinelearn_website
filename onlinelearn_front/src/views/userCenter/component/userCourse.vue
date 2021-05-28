<template>
  <div class="wrapper">
    <h3>课程管理</h3>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="课程列表" name="first">
      <user-course-list ref="courseList"></user-course-list>
    </el-tab-pane>
    <el-tab-pane label="课程文件" name="second">
      <user-course-file ref="courseResource"></user-course-file>
    </el-tab-pane>
    <el-tab-pane label="上传资料" name="third">
      <upload-course-file ref="uploadCourseFile"></upload-course-file>
    </el-tab-pane>
    <el-tab-pane label="新建课程" name="fourth">
      <user-new-course></user-new-course>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import userCourseList from './course/userCourseList'
import userCourseFile from './course/userCourseFile'
import uploadCourseFile from './course/uploadCourseFile'
import userNewCourse from './course/userNewCourse'

export default {
  name: 'UserCourse',
  components: {
    userCourseList,
    userCourseFile,
    uploadCourseFile,
    userNewCourse
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab, event)
      if (tab.name === 'first') {
        this.$refs.courseList.initCourseData()
      } else if (tab.name === 'second') {
        this.$refs.courseResource.initListData()
      } else if (tab.name === 'third') {
        this.$refs.uploadCourseFile.getMyAllCourse()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 90vh;
  margin-top: 20px;
  padding-right: 10px;
  background-color: #fff;
  h3 {
    padding-left: 10px;
  }
}
</style>
