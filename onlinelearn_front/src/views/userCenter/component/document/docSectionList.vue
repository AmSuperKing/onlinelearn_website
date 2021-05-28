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
          :span="4"
          type="index"
        >
          <template
            slot="header"
            slot-scope="{}"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="文档教程名称"
        header-align="center"
      >
        <el-table-column
          prop="document_name"
          :span="6"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.document_name"
              clearable
              size="mini"
              placeholder="文档教程名称"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="章节名称"
        header-align="center"
      >
        <el-table-column
          prop="section_title"
          :span="6"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.section_title"
              clearable
              size="mini"
              placeholder="章节名称"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="章节id"
        header-align="center"
      >
        <el-table-column
          prop="section_id"
          :span="6"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.section_id"
              clearable
              size="mini"
              placeholder="章节id"
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
              @click="modifyDocSec(scope.row)"
            >修改</el-button>
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
    <el-dialog
      title="修改章节标题"
      :visible.sync="dialogVisible"
      width="370px"
      :before-close="handleClose">
      <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="章节标题" prop="name">
          <el-input v-model="changeForm.section_title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDocumentApi } from '@/api/getDocumentApi'

export default {
  name: 'AllDocSecList',
  data () {
    return {
      stationLoading: false,
      tableData: [],
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        user: '',
        document_name: '',
        section_title: '',
        section_id: '',
        newTime: '',
        currentPage: 1,
        pageSize: 10
      },
      dialogVisible: false,
      changeForm: {
        section_key: '',
        document_name: '',
        section_title: ''
      },
      rules: {
        section_title: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ]
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
      this.searchDocSec()
    },
    initListData () {
      this.stationLoading = true
      const userId = this.$cookie.get('userId')
      if (userId) {
        this.pageParams.user = userId
        getDocumentApi
          .getAllDocSecList(this.pageParams)
          .then(res => {
            // console.log('数据列表', res.data.data)
            if (res.data.data.data.length) {
              this.tableData = res.data.data.data
              this.total = res.data.data.total
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
    modifyDocSec (val) {
      // console.log('modifyDocSec', val)
      this.changeForm.section_key = val.section_key
      this.changeForm.document_name = val.document_name
      this.changeForm.section_title = val.section_title
      this.dialogVisible = true
    },
    confirmDelete (val) {
      // console.log('confirmDelete', val)
      this.$confirm(
        '确认删除该章节?',
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
    handleClose () {
      this.$confirm('确认取消？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dialogVisible = false
        })
        .catch(() => {})
    },
    commitChange () {
      if (this.changeForm.document_name && this.changeForm.section_title) {
        getDocumentApi
          .updateDocSecInfo(this.changeForm)
          .then(res => {
            // console.log('updateDocSecInfo', res.data)
            if (res.data.code === 200) {
              this.$refs.changeForm.resetFields()
              this.dialogVisible = false
              this.initListData()
              this.$message.success(res.data.message)
            } else {
              this.$message.success(res.data.message)
            }
          })
          .catch((e) => {
            this.$message.error(e)
          })
      } else {
        this.$message.warning('请填写完整表单')
      }
    },
    searchDocSec () {
      if (this.pageParams.document_name ||
        this.pageParams.section_title ||
        this.pageParams.section_id) {
        this.pageParams.user = this.$cookie.get('userId')
        getDocumentApi
          .searchDocSecByKey(this.pageParams)
          .then(res => {
            // console.log('搜索结果：', res.data)
            if (res.data.data.length) {
              this.tableData = []
              this.tableData = res.data.data
              this.total = res.data.data.length
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
      getDocumentApi
        .delDocSec(row)
        .then(res => {
          // console.log('delDocSec', res.data)
          if (res.data.code) {
            this.initListData()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
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
