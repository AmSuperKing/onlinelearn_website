import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const aboutApi = {
  addCorrect (params) {
    return axios.post(v1 + '/api/addCorrect', params)
      .then(res => Promise.resolve(res.data))
  },
  addProtect (params) {
    return axios.post(v1 + '/api/addProtect', params)
      .then(res => Promise.resolve(res.data))
  },
  addAdvice (params) {
    return axios.post(v1 + '/api/addAdvice', params)
      .then(res => Promise.resolve(res.data))
  }
}
