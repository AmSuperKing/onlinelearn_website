import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const userApi = {
  // 登录
  login (params) {
    return axios.post(v1 + '/api/userLogin', params)
      .then(res => Promise.resolve(res.data))
  },
  // 注册
  register (params) {
    return axios.post(v1 + '/api/userRegister', params)
      .then(res => Promise.resolve(res.data))
  },
  // 获取用户名称
  getUserName (param1, param2) {
    return axios.post(v1 + '/api/getUserName', { user_id: param1 }, { headers: { Authorization: 'Bearer ' + param2 } })
      .then(res => Promise.resolve(res.data))
  },
  searchName (param) {
    return axios.post(v1 + '/api/searchName', param)
      .then(res => Promise.resolve(res.data))
  },
  searchRole (param) {
    return axios.post(v1 + '/api/searchRole', param)
      .then(res => Promise.resolve(res.data))
  },
  // 获取用户书签列表
  getUserHistory (param) {
    return axios.post(v1 + '/api/userHistory', { user_id: param })
      .then(res => Promise.resolve(res.data))
  },
  resetPwd (param) {
    return axios.post(v1 + '/api/resetPwd', param)
      .then(res => Promise.resolve(res.data))
  },
  // 删除书签
  delHistory (params) {
    return axios.post(v1 + '/api/delHistory', params)
      .then(res => Promise.resolve(res.data))
  },
  confirmPwd (params) {
    return axios.post(v1 + '/api/confirmPwd', params)
      .then(res => Promise.resolve(res.data))
  },
  changePwd (params) {
    return axios.post(v1 + '/api/changePwd', params)
      .then(res => Promise.resolve(res.data))
  },
  getQuesAns (param) {
    return axios.post(v1 + '/api/getQuesAns', param)
      .then(res => Promise.resolve(res.data))
  },
  updateEncry (params) {
    return axios.post(v1 + '/api/updateEncry', params)
      .then(res => Promise.resolve(res.data))
  },
  userDestory (params) {
    return axios.post(v1 + '/api/userDestory', params)
      .then(res => Promise.resolve(res.data))
  },
  getUserList (params) {
    return axios.post(v1 + '/api/getUserList', params)
      .then(res => Promise.resolve(res.data))
  },
  searchUserByKey (params) {
    return axios.post(v1 + '/api/searchUserByKey', params)
      .then(res => Promise.resolve(res))
  },
  updateUserInfo (params) {
    return axios.post(v1 + '/api/updateUserInfo', params)
      .then(res => Promise.resolve(res))
  },
  delUser (params) {
    return axios.post(v1 + '/api/delUser', params)
      .then(res => Promise.resolve(res))
  }
}
