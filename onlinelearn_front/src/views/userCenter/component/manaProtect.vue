<template>
  <div class="wrapper">
    <h3>用户维权管理</h3>
    <el-divider></el-divider>
    <el-table
      v-loading="stationLoading"
      :data="tableData"
      height="480"
      border
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
          :span="3"
          type="index"
        >
          <template
            slot="header"
            slot-scope="{}"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="模块标题"
        header-align="center"
      >
        <el-table-column
          prop="protectTitle"
         :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.protectTitle"
              clearable
              size="mini"
              placeholder="模块标题"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="章节"
        header-align="center"
      >
        <el-table-column
          prop="protectSection"
         :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.protectSection"
              clearable
              size="mini"
              placeholder="章节"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="描述"
        header-align="center"
      >
        <el-table-column
          prop="protectContent"
          :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.protectContent"
              clearable
              size="mini"
              placeholder="描述"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="反馈联系方式"
        header-align="center"
      >
        <el-table-column
          prop="protectContact"
          :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.protectContact"
              clearable
              disabled
              size="mini"
              placeholder="反馈联系方式"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="操作"
        width="120"
      >
        <el-table-column
          align="center"
          width="120"
          type="index"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="confirmDelete(scope.row)"
            ><span style="color: #ff0000;">删除</span></el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-row class="pagination-wrapper">
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
import { userCenterApi } from '@/api/userCenterApi'

export default {
  name: 'Manaprotect',
  data () {
    return {
      stationLoading: false,
      tableData: [],
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        protectTitle: '',
        protectSection: '',
        protectContent: '',
        protectContact: '',
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.initListData()
  },
  methods: {
    changeSearchData () {
      this.total = 0
      this.pageParams.currentPage = 1
      this.search()
    },
    initListData () {
      this.stationLoading = true
      const userId = this.$cookie.get('userId')
      if (userId) {
        userCenterApi
          .allUserProtect(this.pageParams)
          .then(res => {
            // console.log('数据列表', res)
            if (res.data.data.length) {
              this.tableData = res.data.data
              this.total = res.data.total
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
          .finally(() => {
            this.stationLoading = false
          })
      } else {
        this.$message.warning('请先登录')
      }
    },
    confirmDelete (val) {
      // console.log('confirmDelete', val)
      this.$confirm(
        '确认删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.deleteCurr(val)
        })
        .catch(() => {})
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageParams.pageSize = val
      this.initListData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pageParams.currentPage = val
      this.initListData()
    },
    search () {
      if (this.pageParams.protectTitle ||
      this.pageParams.protectSection ||
      this.pageParams.protectContent) {
        this.pageParams.user = this.$cookie.get('userId')
        userCenterApi
          .searchProtectByKey(this.pageParams)
          .then(res => {
            // console.log('搜索结果：', res.data)
            if (res.data.length) {
              this.tableData = []
              this.tableData = res.data
              this.total = res.data.length
            } else {
              this.tableData = []
              this.total = 0
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      } else {
        this.initListData()
      }
    },
    deleteCurr (row) {
      userCenterApi
        .delProtect(row)
        .then(res => {
          // console.log('delProtect', res)
          if (res.code) {
            this.initListData()
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 90vh;
  padding-right: 10px;
  background-color: #fff;
  h3 {
    padding-left: 10px;
  }
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
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
