import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const infoApi = {
  // 获取文档推荐列表
  getDocumnetRec () {
    return axios.get(v1 + '/api/getDocumentRec')
      .then(res => Promise.resolve(res.data))
  },
  // 获取视频推荐列表
  getVideoRec () {
    return axios.get(v1 + '/api/getVideoRec')
      .then(res => Promise.resolve(res.data))
  },
  // 获取电子书推荐列表
  getEbookRec () {
    return axios.get(v1 + '/api/getEbookRec')
      .then(res => Promise.resolve(res.data))
  },
  // 获取课程推荐列表
  getCourseRec () {
    return axios.get(v1 + '/api/getCourseRec')
      .then(res => Promise.resolve(res.data))
  },
  // 获取轮播推荐列表
  getCarouselRec () {
    return axios.get(v1 + '/api/getCarouselRec')
      .then(res => Promise.resolve(res.data))
  }
}
