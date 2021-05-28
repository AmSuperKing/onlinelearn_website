import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const userCenterApi = {
  // 获取权限菜单
  getRole (param) {
    return axios.post(v1 + '/api/getRole', param)
      .then(res => Promise.resolve(res.data))
  },
  // 获取权限菜单
  getRoleMenu (param) {
    return axios.get(v1 + `/api/getRoleMenu?role=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  initCourseData (params) {
    return axios.post(v1 + '/api/getCourseData', params)
      .then(res => Promise.resolve(res.data))
  },
  getCourseFileList (param) {
    return axios.post(v1 + '/api/getCourseFileList', param)
      .then(res => Promise.resolve(res.data))
  },
  getAllCourseFileList (param) {
    return axios.post(v1 + '/api/getAllCourseFileList', param)
      .then(res => Promise.resolve(res.data))
  },
  searchFileByKey (params) {
    return axios.post(v1 + '/api/searchFileByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  searchAllFileByKey (params) {
    return axios.post(v1 + '/api/searchAllFileByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delCourseFile (params) {
    return axios.post(v1 + '/api/delCourseFile', params)
      .then(res => Promise.resolve(res.data))
  },
  getVideoFileList (param) {
    return axios.post(v1 + '/api/getVideoFileList', param)
      .then(res => Promise.resolve(res.data))
  },
  getAllVideoFileList (param) {
    return axios.post(v1 + '/api/getAllVideoFileList', param)
      .then(res => Promise.resolve(res.data))
  },
  searchVideoFileByKey (params) {
    return axios.post(v1 + '/api/searchVideoFileByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  searchAllVideoFileByKey (params) {
    return axios.post(v1 + '/api/searchAllVideoFileByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delVideoFile (params) {
    return axios.post(v1 + '/api/delVideoFile', params)
      .then(res => Promise.resolve(res.data))
  },
  delAllVideoFile (params) {
    return axios.post(v1 + '/api/delAllVideoFile', params)
      .then(res => Promise.resolve(res.data))
  },
  getQueList (params) {
    return axios.post(v1 + '/api/getQueList', params)
      .then(res => Promise.resolve(res.data))
  },
  getAllQueList (params) {
    return axios.post(v1 + '/api/getAllQueList', params)
      .then(res => Promise.resolve(res.data))
  },
  searchQueByKey (params) {
    return axios.post(v1 + '/api/searchQueByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delQue (params) {
    return axios.post(v1 + '/api/delQue', params)
      .then(res => Promise.resolve(res.data))
  },
  getAnsList (params) {
    return axios.post(v1 + '/api/getAnsList', params)
      .then(res => Promise.resolve(res.data))
  },
  getAllAnsList (params) {
    return axios.post(v1 + '/api/getAllAnsList', params)
      .then(res => Promise.resolve(res.data))
  },
  searchAnsByKey (params) {
    return axios.post(v1 + '/api/searchAnsByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delAns (params) {
    return axios.post(v1 + '/api/delAns', params)
      .then(res => Promise.resolve(res.data))
  },
  allAppeal (params) {
    return axios.post(v1 + '/api/allAppeal', params)
      .then(res => Promise.resolve(res.data))
  },
  searchAppealByKey (params) {
    return axios.post(v1 + '/api/searchAppealByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delAppeal (params) {
    return axios.post(v1 + '/api/delAppeal', params)
      .then(res => Promise.resolve(res.data))
  },
  allUserHistory (params) {
    return axios.post(v1 + '/api/allUserHistory', params)
      .then(res => Promise.resolve(res.data))
  },
  searchHistoryByKey (params) {
    return axios.post(v1 + '/api/searchHistoryByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delAllHis (params) {
    return axios.post(v1 + '/api/delAllHis', params)
      .then(res => Promise.resolve(res.data))
  },
  allUserAdvice (params) {
    return axios.post(v1 + '/api/allUserAdvice', params)
      .then(res => Promise.resolve(res.data))
  },
  searchAdviceByKey (params) {
    return axios.post(v1 + '/api/searchAdviceByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delAdvice (params) {
    return axios.post(v1 + '/api/delAdvice', params)
      .then(res => Promise.resolve(res.data))
  },
  allUserCorrect (params) {
    return axios.post(v1 + '/api/allUserCorrect', params)
      .then(res => Promise.resolve(res.data))
  },
  searchCorrectByKey (params) {
    return axios.post(v1 + '/api/searchCorrectByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delCorrect (params) {
    return axios.post(v1 + '/api/delCorrect', params)
      .then(res => Promise.resolve(res.data))
  },
  allUserProtect (params) {
    return axios.post(v1 + '/api/allUserProtect', params)
      .then(res => Promise.resolve(res.data))
  },
  searchProtectByKey (params) {
    return axios.post(v1 + '/api/searchProtectByKey', params)
      .then(res => Promise.resolve(res.data))
  },
  delProtect (params) {
    return axios.post(v1 + '/api/delProtect', params)
      .then(res => Promise.resolve(res.data))
  }
}
