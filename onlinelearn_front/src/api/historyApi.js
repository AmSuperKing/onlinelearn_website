import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const historyApi = {
  addHistory (params) {
    return axios.post(v1 + '/api/addHistory', params)
      .then(res => Promise.resolve(res))
  }
}
