<template>
  <div class="wrapper">
    <h3>留言讨论管理</h3>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="留言问题列表" name="first">
      <all-que-list ref="queList"></all-que-list>
    </el-tab-pane>
    <el-tab-pane label="留言回答列表" name="second">
      <all-ans ref="ansList"></all-ans>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import allQueList from './questionList'
import allAns from './answerList'

export default {
  name: 'ManaDiscuss',
  components: {
    allQueList,
    allAns
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
        this.$refs.queList.initListData()
      } else if (tab.name === 'second') {
        this.$refs.ansList.initListData()
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
