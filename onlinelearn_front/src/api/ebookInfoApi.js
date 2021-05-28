import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const ebookInfoApi = {
  // 获取电子书数据列表
  getEbookList (params) {
    return axios.post(v1 + '/api/getEbookList', params)
      .then(res => Promise.resolve(res.data))
  },
  // 搜索电子书
  searchEbook (param) {
    return axios.get(v1 + `/api/searchEbook?search=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  getEbookInfo (param) {
    return axios.get(v1 + `/api/getEbookInfo?search=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  // 获取Ebook文件
  getEbookUrl (param) {
    return axios.post(v1 + '/api/getEbookUrl', { params: { fileKey: param } })
      .then(res => Promise.resolve(res))
  },
  getSourceByType (params) {
    return axios.post(v1 + '/api/getSourceByType', params)
      .then(res => Promise.resolve(res))
  },
  updateCountNum (params) {
    return axios.post(v1 + '/api/updateEbookCountNum', params)
      .then(res => Promise.resolve(res))
  },
  // 获取我创建的课程数据列表
  getMyEbookList (params) {
    return axios.post(v1 + '/api/getMyEbookList', params)
      .then(res => Promise.resolve(res.data))
  },
  getAllEbookList (params) {
    return axios.post(v1 + '/api/getAllEbookList', params)
      .then(res => Promise.resolve(res.data))
  },
  updateEbookInfo (params) {
    return axios.post(v1 + '/api/updateEbookInfo', params)
      .then(res => Promise.resolve(res))
  },
  delEbook (params) {
    return axios.post(v1 + '/api/delEbook', params)
      .then(res => Promise.resolve(res))
  },
  delAllEbook (params) {
    return axios.post(v1 + '/api/delAllEbook', params)
      .then(res => Promise.resolve(res))
  },
  searchEbookByKey (params) {
    return axios.post(v1 + '/api/searchEbookByKey', params)
      .then(res => Promise.resolve(res))
  },
  searchAllEbookByKey (params) {
    return axios.post(v1 + '/api/searchAllEbookByKey', params)
      .then(res => Promise.resolve(res))
  },
  newEbook (params) {
    return axios.post(v1 + '/api/newEbook', params)
      .then(res => Promise.resolve(res))
  }
}
