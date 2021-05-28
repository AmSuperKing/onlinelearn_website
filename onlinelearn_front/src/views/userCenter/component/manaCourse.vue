<template>
  <div class="wrapper">
    <h3>课程管理</h3>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="课程列表" name="first">
      <mana-course-list ref="courseList"></mana-course-list>
    </el-tab-pane>
    <el-tab-pane label="课程文件" name="second">
      <mana-course-file ref="courseResource"></mana-course-file>
    </el-tab-pane>
    <el-tab-pane label="上传资料" name="third">
      <mana-upload-course-file ref="uploadCourseFile"></mana-upload-course-file>
    </el-tab-pane>
    <el-tab-pane label="新建课程" name="fourth">
      <user-new-course></user-new-course>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import manaCourseList from './course/manaCourseList'
import manaCourseFile from './course/manaCourseFile'
import manaUploadCourseFile from './course/manaUploadCourseFile'
import userNewCourse from './course/userNewCourse'

export default {
  name: 'ManaCourse',
  components: {
    manaCourseList,
    manaCourseFile,
    manaUploadCourseFile,
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
