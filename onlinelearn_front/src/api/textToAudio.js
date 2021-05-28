import axios from 'axios'
export const textToAudio = {
  // 文字转语音接口
  textToAudio (text) {
    return axios.get(`https://api.vvhan.com/api/song?txt=${text}`, { responseType: 'blob' })
      .then(res => Promise.resolve(res.data))
  }
}
