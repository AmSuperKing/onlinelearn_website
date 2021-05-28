import axios from 'axios'
export const recWord = {
  // 首页获取一言
  getRecWord () {
    return axios.get('https://www.mxnzp.com/api/daily_word/recommend?count=10&app_id=hiriqumornqhsevl&app_secret=WWt2RkR6WDY1TWM4WTZXTXJDWG5pUT09')
      .then(res => Promise.resolve(res.data))
  }
}
