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
          :span="2"
          type="index"
        >
          <template
            slot="header"
            slot-scope="{}"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="所属视频教程"
        header-align="center"
      >
        <el-table-column
          prop="video_name"
          :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.video_name"
              clearable
              size="mini"
              placeholder="所属视频教程"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="文件名称"
        header-align="center"
      >
        <el-table-column
          prop="section_title"
          :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.section_title"
              clearable
              size="mini"
              placeholder="文件名称"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="章节编号"
        header-align="center"
      >
        <el-table-column
          prop="section_id"
          :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.section_id"
              clearable
              size="mini"
              placeholder="章节编号"
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
          prop="newTime"
          :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.newTime"
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
        label="创建用户id"
        header-align="center"
      >
        <el-table-column
          prop="creator"
         :span="4"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.creator"
              clearable
              size="mini"
              disabled
              placeholder="创建用户id"
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
  name: 'ManaVideoFile',
  data () {
    return {
      stationLoading: false,
      tableData: [],
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        user: '',
        video_name: '',
        section_title: '',
        section_id: '',
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
        userCenterApi
          .getAllVideoFileList(this.pageParams)
          .then(res => {
            // console.log('getAllVideoFileList数据列表', res.data)
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
      if (this.pageParams.section_title ||
        this.pageParams.section_id ||
        this.pageParams.video_name) {
        this.pageParams.user = this.$cookie.get('userId')
        // console.log('searchFile', this.pageParams)
        userCenterApi
          .searchAllVideoFileByKey(this.pageParams)
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
      // console.log('row', row)
      userCenterApi
        .delAllVideoFile(row)
        .then(res => {
          // console.log('delAllVideoFile', res)
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
