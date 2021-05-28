<template>
  <div class="wrapper">
    <h3>书签历史记录管理</h3>
    <el-divider></el-divider>
    <el-table
      :data="historyList"
      border
      stripe
      v-loading="historyLoding"
      height="480"
    >
      <template slot="empty">
        <div style="height: 300px">
          <span style="line-height: 300px">暂无数据</span>
        </div>
      </template>
      <el-table-column
        label="序号"
        align="center"
        header-align="center"
      >
        <el-table-column
          align="center"
          :span="6"
          type="index"
        >
          <template
            slot="header"
            slot-scope="{}"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="书签项"
        header-align="center"
      >
        <el-table-column
          prop="history_title"
          :span="6"
        >
          <template slot-scope="scope">
            <a
              :href="'/#'+scope.row.history_path"
              target="_blank"
              class="buttonText"
            >{{ scope.row.history_title }}</a>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="添加时间"
        header-align="center"
      >
        <el-table-column
          prop="history_time"
          :span="6"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="操作"
        width="80"
      >
        <el-table-column
          align="center"
          width="80"
          type="index"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              class="del-history-btn"
              @click="confirmDelete(scope.row)"
            ><span style="color: #ff0000;">删除</span></el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { userApi } from '@/api/userApi'

export default {
  name: 'UserHistory',
  data () {
    return {
      historyLoding: false,
      historyList: []
    }
  },
  mounted () {
    this.openHistoryList()
  },
  methods: {
    // 打开书签历史
    openHistoryList () {
      const currUserId = this.$cookie.get('userId')
      // console.log('currUserId:', currUserId)
      if (currUserId) {
        this.getUserHistory(currUserId)
      } else {
        this.$message.warning('请先登录')
      }
    },
    // 获取书签历史列表
    getUserHistory (userId) {
      this.historyLoding = true
      userApi
        .getUserHistory(userId)
        .then(res => {
          if (res.code === 200) {
            // console.log('historyList:', res.data)
            if (res.data.length) {
              this.historyList = res.data
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(e => {
          this.$message.error(e)
        })
        .finally(() => {
          this.historyLoding = false
        })
    },
    confirmDelete (val) {
      // console.log('confirmDelete', val)
      this.$confirm(
        '确认删除该记录?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.delCurrHistory(val)
        })
        .catch(() => {})
    },
    // 删除书签历史列表
    delCurrHistory (row) {
      // console.log('del row:', row)
      userApi
        .delHistory(row)
        .then(res => {
          if (res.code === 200) {
            // console.log('del res:', res)
            const currUserId = this.$cookie.get('userId')
            if (currUserId) {
              this.historyList = []
              this.getUserHistory(currUserId)
              this.historyLoding = !this.historyLoding
            } else {
              this.$message.warning('请先登录')
            }
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin-bottom: 30px;
  padding-right: 10px;
  background-color: #fff;
  h3 {
    padding-left: 10px;
  }
}
.del-history-btn {
  color: rgba(255, 0, 0, .6);
}
.buttonText {
  color: #3cb371;
  font-size: 14px;
  text-decoration: none;
}
.buttonText:hover {
  text-decoration: underline;
  color: rgb(252, 85, 49);
}
</style>
