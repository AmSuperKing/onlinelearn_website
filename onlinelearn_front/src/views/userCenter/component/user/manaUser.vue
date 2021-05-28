<template>
  <div class="wrapper">
    <h3>用户管理</h3>
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
        label="用户id"
        header-align="center"
      >
        <el-table-column
          prop="user_id"
          width="200"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.user_id"
              clearable
              size="mini"
              placeholder="用户id"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="用户名称"
        header-align="center"
      >
        <el-table-column
          prop="user_name"
          width="200"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.user_name"
              clearable
              size="mini"
              placeholder="用户名称"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="密码"
        header-align="center"
      >
        <el-table-column
          prop="password"
          width="200"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.password"
              clearable
              size="mini"
              placeholder="密码"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="用户角色"
        header-align="center"
      >
        <el-table-column
          prop="user_role"
          width="150"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.user_role"
              disabled
              clearable
              size="mini"
              placeholder="用户角色"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="密保问题1"
        header-align="center"
      >
        <el-table-column
          prop="question1"
          width="200"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.question1"
              disabled
              clearable
              size="mini"
              placeholder="密保问题1"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="密保答案1"
        header-align="center"
      >
        <el-table-column
          prop="answer1"
          width="200"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.answer1"
              disabled
              clearable
              size="mini"
              placeholder="密保答案1"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="密保问题2"
        header-align="center"
      >
        <el-table-column
          prop="question1"
          width="200"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.question2"
              disabled
              clearable
              size="mini"
              placeholder="密保问题2"
              @change="changeSearchData"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="密保答案2"
        header-align="center"
      >
        <el-table-column
          prop="answer2"
          width="200"
        >
          <template
            slot="header"
            slot-scope="{}"
          >
            <el-input
              v-model.trim="pageParams.answer2"
              disabled
              clearable
              size="mini"
              placeholder="密保答案2"
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
        width="150"
      >
        <el-table-column
          align="center"
          width="150"
          type="index"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="modifyUser(scope.row)"
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
      title="修改用户信息"
      :visible.sync="dialogVisible"
      width="370px"
      :before-close="handleClose">
      <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="账号名称" prop="user_name">
          <el-input v-model="changeForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="changeForm.password"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="user_role">
          <el-input v-model="changeForm.user_role"></el-input>
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
import { userApi } from '@/api/userApi'

export default {
  name: 'ManaUser',
  data () {
    return {
      stationLoading: false,
      tableData: [],
      pageSizes: [10, 20, 30],
      total: 0,
      pageParams: {
        user_id: '',
        user: '',
        name: '',
        user_name: '',
        password: '',
        user_role: '',
        question1: '',
        question2: '',
        answer1: '',
        answer2: '',
        currentPage: 1,
        pageSize: 10
      },
      dialogVisible: false,
      changeForm: {
        user_id: '',
        user_name: '',
        password: '',
        user_role: ''
      },
      rules: {
        user_name: [
          { required: true, message: '请输入用户账号名称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        user_role: [
          { required: true, message: '请输入用户角色', trigger: 'blur' },
          { min: 5, max: 5, message: '长度为5 个字符usual或admin', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.initUserData()
  },
  methods: {
    changeSearchData () {
      this.total = 0
      this.pageParams.currentPage = 1
      this.searchUser()
    },
    initUserData () {
      this.stationLoading = true
      const userId = this.$cookie.get('userId')
      if (userId) {
        userApi
          .getUserList(this.pageParams)
          .then(res => {
            // console.log('数据列表', res.data)
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
    modifyUser (val) {
      // console.log('modifyUser', val)
      this.changeForm.user_id = val.user_id
      this.changeForm.user_role = val.user_role
      this.changeForm.password = val.password
      this.changeForm.user_name = val.user_name
      this.dialogVisible = true
    },
    confirmDelete (val) {
      // console.log('confirmDelete', val)
      this.$confirm(
        '确认删除该用户?',
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
      this.initUserData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pageParams.currentPage = val
      this.initUserData()
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
      if (this.changeForm.user_name && this.changeForm.password && this.changeForm.user_role) {
        userApi
          .updateUserInfo(this.changeForm)
          .then(res => {
            // console.log('updateUserInfo', res.data)
            if (res.data.code === 200) {
              this.$refs.changeForm.resetFields()
              this.dialogVisible = false
              this.initUserData()
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
    searchUser () {
      if (this.pageParams.user_id ||
        this.pageParams.user_name ||
        this.pageParams.password) {
        this.pageParams.user = this.$cookie.get('userId')
        userApi
          .searchUserByKey(this.pageParams)
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
        this.initUserData()
      }
    },
    deleteCurr (row) {
      // console.log(row)
      userApi
        .delUser(row)
        .then(res => {
          // console.log('delUser', res.data)
          if (res.data.code === 200) {
            this.initUserData()
            this.$message.success('删除用户成功')
          } else {
            this.$message.error('删除用户失败')
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
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
}
</style>
