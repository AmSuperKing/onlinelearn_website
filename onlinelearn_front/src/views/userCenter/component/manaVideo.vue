<template>
  <div class="wrapper">
    <h3>视频教程管理</h3>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="视频教程列表" name="first">
      <mana-video-list ref="videoList"></mana-video-list>
    </el-tab-pane>
    <el-tab-pane label="视频教程文件" name="second">
      <mana-video-file ref="videoResource"></mana-video-file>
    </el-tab-pane>
    <el-tab-pane label="上传资料" name="third">
      <mana-upload-video-file ref="uploadVideoFile"></mana-upload-video-file>
    </el-tab-pane>
    <el-tab-pane label="新建视频教程" name="fourth">
      <mana-new-video></mana-new-video>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import manaVideoList from './video/manaVideoList'
import manaVideoFile from './video/manaVideoFile'
import manaUploadVideoFile from './video/manaUploadVideoFile'
import manaNewVideo from './video/manaNewVideo'

export default {
  name: 'ManaVideo',
  components: {
    manaVideoList,
    manaVideoFile,
    manaUploadVideoFile,
    manaNewVideo
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
        this.$refs.uploadVideoFile.getUserAllVideo()
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
