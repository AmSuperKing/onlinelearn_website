<template>
  <div class="wrapper">
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
          width="120"
          type="index"
        >
          <template
            slot="header"
            slot-scope="{}"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="文件名称"
        header-align="center"
      >
        <el-table-column
          prop="source_name"
          width="250"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.source_name"
              clearable
              size="mini"
              placeholder="文件名称"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="文件类型"
        header-align="center"
      >
        <el-table-column
          prop="source_type"
          width="250"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.source_type"
              clearable
              size="mini"
              placeholder="文件类型"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="上传时间"
        header-align="center"
      >
        <el-table-column
          prop="add_time"
          width="250"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.add_time"
              disabled
              clearable
              size="mini"
              placeholder="上传时间"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="点击量"
        header-align="center"
      >
        <el-table-column
          prop="count_num"
          width="250"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.count_num"
              disabled
              clearable
              size="mini"
              placeholder="点击量"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="key"
        header-align="center"
      >
        <el-table-column
          prop="name"
          width="200"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.key"
              clearable
              size="mini"
              placeholder="key"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        fixed="right"
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
  name: 'UserCourseFile',
  data () {
    return {
      stationLoading: false,
      tableData: [],
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        user: '',
        userId: '',
        key: '',
        source_name: '',
        source_type: '',
        count_num: null,
        creator: '',
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    // this.initListData()
  },
  methods: {
    changeSearchData () {
      this.total = 0
      this.pageParams.currentPage = 1
      this.searchFile()
    },
    initListData () {
      this.stationLoading = true
      const userId = this.$cookie.get('userId')
      if (userId) {
        this.pageParams.userId = userId
        userCenterApi
          .getCourseFileList(this.pageParams)
          .then(res => {
            // console.log('getCourseFileList数据列表', res.data)
            if (res.data.length) {
              this.tableData = res.data
              this.total = res.data.length
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
        '确认删除该文件?',
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
        .catch(() => { })
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
    searchFile () {
      if (this.pageParams.source_name ||
        this.pageParams.source_type ||
        this.pageParams.key) {
        this.pageParams.user = this.$cookie.get('userId')
        userCenterApi
          .searchFileByKey(this.pageParams)
          .then(res => {
            // console.log('搜索结果：', res)
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
        .delCourseFile(row)
        .then(res => {
          // console.log('delCourseFile', res)
          if (res.code === 200) {
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
  background-color: #fff;
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
