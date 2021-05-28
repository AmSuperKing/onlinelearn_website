<template>
  <div class="wrapper">
    <h3>文档教程管理</h3>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="文档教程列表" name="first">
      <all-doc-list ref="docList"></all-doc-list>
    </el-tab-pane>
    <el-tab-pane label="文档教程章节" name="second">
      <doc-section-list ref="docSeclist"></doc-section-list>
    </el-tab-pane>
    <el-tab-pane label="上传资料" name="third">
      <upload-doc-section ref="uploadDocSection"></upload-doc-section>
    </el-tab-pane>
    <el-tab-pane label="新建文档教程" name="forth">
      <new-doc ref="newDoc"></new-doc>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import allDocList from './allDocList'
import docSectionList from './docSectionList'
import uploadDocSection from './uploadDocSection'
import newDoc from './newDoc'

export default {
  name: 'ManaDoc',
  components: {
    allDocList,
    docSectionList,
    uploadDocSection,
    newDoc
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
        this.$refs.docList.initListData()
      } else if (tab.name === 'second') {
        this.$refs.docSeclist.initListData()
      } else if (tab.name === 'third') {
        this.$refs.uploadDocSection.getAllDoc()
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
