import axios from 'axios'
export const verifyCode = {
  randomCode () {
    return axios.get('https://www.mxnzp.com/api/verifycode/code?len=4&type=0&app_id=hiriqumornqhsevl&app_secret=WWt2RkR6WDY1TWM4WTZXTXJDWG5pUT09')
      .then(res => Promise.resolve(res.data))
  }
}
