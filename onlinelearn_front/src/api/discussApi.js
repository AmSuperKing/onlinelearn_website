import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const discussApi = {
  getQuestionList (params) {
    return axios.post(v1 + '/api/getQuestionList', params)
      .then(res => Promise.resolve(res.data))
  },
  getAnswerList (param) {
    return axios.post(v1 + '/api/getAnswerList', param)
      .then(res => Promise.resolve(res.data))
  },
  addQuestion (params) {
    return axios.post(v1 + '/api/addQuestion', params)
      .then(res => Promise.resolve(res.data))
  },
  addAnswer (params) {
    return axios.post(v1 + '/api/addAnswer', params)
      .then(res => Promise.resolve(res.data))
  },
  searchQuestion (param) {
    return axios.post(v1 + '/api/searchQuestion', param)
      .then(res => Promise.resolve(res.data))
  }
}
