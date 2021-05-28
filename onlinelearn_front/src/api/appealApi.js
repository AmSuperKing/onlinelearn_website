import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const appealApi = {
  submitAppeal (params) {
    return axios.post(v1 + '/api/addAppeal', params)
      .then(res => Promise.resolve(res.data))
  },
  getQuestion (param) {
    return axios.get(v1 + `/api/getQuestion?user_name=${param}`)
      .then(res => Promise.resolve(res.data))
  },
  confirmAnswer (params) {
    return axios.post(v1 + '/api/confirmAnswer', params)
      .then(res => Promise.resolve(res.data))
  }
}
