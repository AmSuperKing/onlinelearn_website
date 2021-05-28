import axios from 'axios'
import { baseUrl } from './serverConfig'

const v1 = baseUrl.v1

export const uploadApi = {
  uploadFile (params, config) {
    return axios.post(v1 + '/upload/uploadFile', params, config)
      .then(res => Promise.resolve(res.data))
  }
}
