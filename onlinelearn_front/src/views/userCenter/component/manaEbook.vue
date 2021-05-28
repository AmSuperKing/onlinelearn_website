<template>
  <div class="wrapper">
    <h3>电子书籍管理</h3>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="电子书籍列表" name="first">
      <mana-ebook-list ref="ebookList"></mana-ebook-list>
    </el-tab-pane>
    <el-tab-pane label="上传电子书" name="second">
      <upload-ebook-file ref="uploadEbookFile"></upload-ebook-file>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import manaEbookList from './ebook/manaEbookList'
import uploadEbookFile from './ebook/uploadEbookFile'

export default {
  name: 'ManaEbook',
  components: {
    manaEbookList,
    uploadEbookFile
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
        this.$refs.ebookList.initListData()
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
