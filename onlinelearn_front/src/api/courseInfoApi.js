import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const courseInfoApi = {
  // 获取课程数据列表
  getCourseList (params) {
    return axios.post(v1 + '/api/getCourseList', params)
      .then(res => Promise.resolve(res.data))
  },
  // 获取加入课程数据列表
  getJoinCourseList (params) {
    return axios.post(v1 + '/api/getJoinCourseList', params)
      .then(res => Promise.resolve(res.data))
  },
  // 获取我创建的课程数据列表
  getMyCourseList (params) {
    return axios.post(v1 + '/api/getMyCourseList', params)
      .then(res => Promise.resolve(res.data))
  },
  getAllCourseList (params) {
    return axios.post(v1 + '/api/getAllCourseList', params)
      .then(res => Promise.resolve(res.data))
  },
  // 获取用户创建的课程数据列表，不分页
  getMyAllCourse (param) {
    return axios.post(v1 + '/api/getMyAllCourse', param)
      .then(res => Promise.resolve(res.data))
  },
  getUserAllCourse (param) {
    return axios.post(v1 + '/api/getUserAllCourse', param)
      .then(res => Promise.resolve(res.data))
  },
  // 搜索课程
  searchCourse (param) {
    return axios.get(v1 + `/api/searchCourse?search=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  // 搜索我加入的课程
  searchJoinCourse (param1, param2) {
    return axios.get(v1 + `/api/searchJoinCourse?user=${param1}&search=${param2}`)
      .then(res => Promise.resolve(res.data))
  },
  // 搜索我创建的课程
  searchCreateCourse (param1, param2) {
    return axios.get(v1 + `/api/searchCreateCourse?user=${param1}&search=${param2}`)
      .then(res => Promise.resolve(res.data))
  },
  // 获取课程信息
  getCourseInfo (param) {
    return axios.get(v1 + `/api/getCourseInfo?search=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  // 获取当前课程加入人数
  getJoinNum (param) {
    return axios.get(v1 + `/api/getJoinNum?course=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  // 判断是否已经加入课程
  judeJoin (params) {
    return axios.post(v1 + '/api/judeJoin', params)
      .then(res => Promise.resolve(res))
  },
  // 加入课程
  joinCourse (params) {
    return axios.post(v1 + '/api/joinCourse', params)
      .then(res => Promise.resolve(res))
  },
  // 退出课程
  exitCourse (params) {
    return axios.post(v1 + '/api/exitCourse', params)
      .then(res => Promise.resolve(res))
  },
  // 获取课程资源目录
  getCourseResource (param) {
    return axios.post(v1 + '/api/getCourseResource', param)
      .then(res => Promise.resolve(res))
  },
  updateCountNum (params) {
    return axios.post(v1 + '/api/updateCourseCountNum', params)
      .then(res => Promise.resolve(res))
  },
  // 获取当前打开课程资源文件信息
  getCurrFileInfo (params) {
    return axios.post(v1 + '/api/getCurrFileInfo', params)
      .then(res => Promise.resolve(res))
  },
  updateFileCountNum (params) {
    return axios.post(v1 + '/api/updateFileCountNum', params)
      .then(res => Promise.resolve(res))
  },
  updateCourseInfo (params) {
    return axios.post(v1 + '/api/updateCourseInfo', params)
      .then(res => Promise.resolve(res))
  },
  searchCourseByKey (params) {
    return axios.post(v1 + '/api/searchCourseByKey', params)
      .then(res => Promise.resolve(res))
  },
  searchAllCourseByKey (params) {
    return axios.post(v1 + '/api/searchAllCourseByKey', params)
      .then(res => Promise.resolve(res))
  },
  newCourse (params) {
    return axios.post(v1 + '/api/newCourse', params)
      .then(res => Promise.resolve(res))
  },
  delCourse (params) {
    return axios.post(v1 + '/api/delCourse', params)
      .then(res => Promise.resolve(res))
  },
  uploadCourseFile (params) {
    return axios.post(v1 + '/api/uploadCourseFile', params)
      .then(res => Promise.resolve(res))
  }
}
