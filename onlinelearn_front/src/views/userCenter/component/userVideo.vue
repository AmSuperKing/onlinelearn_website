<template>
  <div class="wrapper">
    <h3>视频教程管理</h3>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="视频教程列表" name="first">
      <user-video-list ref="videoList"></user-video-list>
    </el-tab-pane>
    <el-tab-pane label="视频教程文件" name="second">
      <user-video-file ref="videoResource"></user-video-file>
    </el-tab-pane>
    <el-tab-pane label="上传资料" name="third">
      <upload-video-file ref="uploadVideoFile"></upload-video-file>
    </el-tab-pane>
    <el-tab-pane label="新建视频教程" name="fourth">
      <user-new-video></user-new-video>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import userVideoList from './video/userVideoList'
import userVideoFile from './video/userVideoFile'
import uploadVideoFile from './video/uploadVideoFile'
import userNewVideo from './video/userNewVideo'

export default {
  name: 'UserVideo',
  components: {
    userVideoList,
    userVideoFile,
    uploadVideoFile,
    userNewVideo
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
        this.$refs.videoList.initListData()
      } else if (tab.name === 'second') {
        this.$refs.videoResource.initListData()
      } else if (tab.name === 'third') {
        this.$refs.uploadVideoFile.getMyAllVideo()
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
