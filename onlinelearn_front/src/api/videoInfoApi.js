import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const videoInfoApi = {
  // 获取视频数据列表
  getVideoList (params) {
    return axios.post(v1 + '/api/getVideoList', params)
      .then(res => Promise.resolve(res.data))
  },
  // 搜索视频
  searchVideo (param) {
    return axios.get(v1 + `/api/searchVideo?search=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  getVideoInfo (param) {
    return axios.get(v1 + `/api/getVideoInfo?search=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  // 获取我创建的课程数据列表
  getMyVideoList (params) {
    return axios.post(v1 + '/api/getMyVideoList', params)
      .then(res => Promise.resolve(res.data))
  },
  getAllVideoList (params) {
    return axios.post(v1 + '/api/getAllVideoList', params)
      .then(res => Promise.resolve(res.data))
  },
  // 获取视频目录
  getVideoSectionList (param) {
    return axios.post(v1 + '/api/getVideoSectionList', { video_name: param })
      .then(res => Promise.resolve(res))
  },
  // 获取当前播放视频信息
  getCurrVideoInfo (params) {
    return axios.post(v1 + '/api/getCurrVideoInfo', params)
      .then(res => Promise.resolve(res))
  },
  // 下载视频文件
  downloadVideo (param) {
    return axios.post(v1 + '/api/downloadVideo', param)
      .then(res => Promise.resolve(res))
  },
  updateCountNum (params) {
    return axios.post(v1 + '/api/updateVideoCountNum', params)
      .then(res => Promise.resolve(res))
  },
  updateVideoInfo (params) {
    return axios.post(v1 + '/api/updateVideoInfo', params)
      .then(res => Promise.resolve(res))
  },
  updateAllVideoInfo (params) {
    return axios.post(v1 + '/api/updateAllVideoInfo', params)
      .then(res => Promise.resolve(res))
  },
  searchVideoByKey (params) {
    return axios.post(v1 + '/api/searchVideoByKey', params)
      .then(res => Promise.resolve(res))
  },
  searchAllVideoByKey (params) {
    return axios.post(v1 + '/api/searchAllVideoByKey', params)
      .then(res => Promise.resolve(res))
  },
  delVideo (params) {
    return axios.post(v1 + '/api/delVideo', params)
      .then(res => Promise.resolve(res))
  },
  delAllVideo (params) {
    return axios.post(v1 + '/api/delAllVideo', params)
      .then(res => Promise.resolve(res))
  },
  // 获取用户创建的课程数据列表，不分页
  getMyAllVideo (param) {
    return axios.post(v1 + '/api/getMyAllVideo', param)
      .then(res => Promise.resolve(res.data))
  },
  getUserAllVideo (param) {
    return axios.post(v1 + '/api/getUserAllVideo', param)
      .then(res => Promise.resolve(res.data))
  },
  uploadVideoFile (params) {
    return axios.post(v1 + '/api/uploadVideoFile', params)
      .then(res => Promise.resolve(res))
  },
  newVideo (params) {
    return axios.post(v1 + '/api/newVideo', params)
      .then(res => Promise.resolve(res))
  }
}
