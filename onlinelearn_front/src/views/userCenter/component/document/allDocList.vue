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
        label="名称"
        header-align="center"
      >
        <el-table-column
          prop="name"
         :span="6"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.name"
              clearable
              size="mini"
              placeholder="名称"
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
          prop="describe_text"
          :span="6"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.describe_text"
              clearable
              size="mini"
              placeholder="描述"
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
          :span="6"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.count_num"
              clearable
              size="mini"
              placeholder="点击量"
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
              @click="modifyDoc(scope.row)"
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
      title="修改文档教程信息"
      :visible.sync="dialogVisible"
      width="370px"
      :before-close="handleClose">
      <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="教程名称" prop="name">
          <el-input v-model="changeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="教程描述" prop="desc">
          <el-input
            type="textarea"
            v-model="changeForm.desc"
            maxlength="120"
            show-word-limit
            :autosize="{ minRows: 5, maxRows: 7}">
          </el-input>
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
  name: 'AllDocList',
  data () {
    return {
      stationLoading: false,
      tableData: [],
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        user: '',
        name: '',
        describe_text: '',
        count_num: null,
        newTime: '',
        currentPage: 1,
        pageSize: 10
      },
      dialogVisible: false,
      changeForm: {
        path: '',
        name: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
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
      this.searchDoc()
    },
    initListData () {
      this.stationLoading = true
      const userId = this.$cookie.get('userId')
      if (userId) {
        getDocumentApi
          .getAllDocList(this.pageParams)
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
    modifyDoc (val) {
      // console.log('modifyDoc', val)
      this.changeForm.path = val.path
      this.changeForm.name = val.name
      this.changeForm.desc = val.describe_text
      this.dialogVisible = true
    },
    confirmDelete (val) {
      // console.log('confirmDelete', val)
      this.$confirm(
        '确认删除该文档?',
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
      if (this.changeForm.name && this.changeForm.desc) {
        if (this.changeForm.path) {
          getDocumentApi
            .updateDocInfo(this.changeForm)
            .then(res => {
              // console.log('updateDocInfo', res.data)
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
          this.$message.error('获取参数出错')
        }
      } else {
        this.$message.warning('请填写完整表单')
      }
    },
    searchDoc () {
      if (this.pageParams.name ||
        this.pageParams.describe_text ||
        this.pageParams.count_num) {
        this.pageParams.user = this.$cookie.get('userId')
        getDocumentApi
          .searchDocByKey(this.pageParams)
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
        .delDoc(row)
        .then(res => {
          // console.log('delDoc', res.data)
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
