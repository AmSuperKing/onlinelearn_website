import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const getDocumentApi = {
  // 获取文档数据列表
  getDocumentList (params) {
    return axios.post(v1 + '/api/getDocumentList', params)
      .then(res => Promise.resolve(res.data))
  },
  getAllDoc () {
    return axios.get(v1 + '/api/getAllDoc')
      .then(res => Promise.resolve(res.data))
  },
  // 搜索文档
  searchDocument (param) {
    return axios.get(v1 + `/api/searchDocument?search=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  getDocInfo (param) {
    return axios.get(v1 + `/api/getDocInfo?search=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  // 获取文档目录
  getDocSectionList (param) {
    return axios.post(v1 + '/api/getDocSectionList', { document_name: param })
      .then(res => Promise.resolve(res))
  },
  // 获取章节文件
  getDocumentSection (param) {
    return axios.post(v1 + '/api/getDocumentSection', { params: { fileKey: param } })
      .then(res => Promise.resolve(res))
  },
  // 获取当前章节信息
  getCurrSectionInfo (params) {
    return axios.post(v1 + '/api/getCurrSectionInfo', params)
      .then(res => Promise.resolve(res))
  },
  updateCountNum (params) {
    return axios.post(v1 + '/api/updateCountNum', params)
      .then(res => Promise.resolve(res))
  },
  getAllDocList (params) {
    return axios.post(v1 + '/api/getAllDocList', params)
      .then(res => Promise.resolve(res))
  },
  searchDocByKey (params) {
    return axios.post(v1 + '/api/searchDocByKey', params)
      .then(res => Promise.resolve(res))
  },
  updateDocInfo (params) {
    return axios.post(v1 + '/api/updateDocInfo', params)
      .then(res => Promise.resolve(res))
  },
  delDoc (param) {
    return axios.post(v1 + '/api/delDoc', param)
      .then(res => Promise.resolve(res))
  },
  getAllDocSecList (params) {
    return axios.post(v1 + '/api/getAllDocSecList', params)
      .then(res => Promise.resolve(res))
  },
  searchDocSecByKey (params) {
    return axios.post(v1 + '/api/searchDocSecByKey', params)
      .then(res => Promise.resolve(res))
  },
  updateDocSecInfo (params) {
    return axios.post(v1 + '/api/updateDocSecInfo', params)
      .then(res => Promise.resolve(res))
  },
  delDocSec (params) {
    return axios.post(v1 + '/api/delDocSec', params)
      .then(res => Promise.resolve(res))
  },
  uploadDocSection (params) {
    return axios.post(v1 + '/api/uploadDocSection', params)
      .then(res => Promise.resolve(res))
  },
  newDoc (params) {
    return axios.post(v1 + '/api/newDoc', params)
      .then(res => Promise.resolve(res))
  }
}
