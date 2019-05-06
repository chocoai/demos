import Fly from 'flyio'
import Vue from 'vue'
const request = new Fly()

// TODO: 存在初始化顺序问题
request.interceptors.request.use((request) => {
  console.log('interceptors')
  request.headers['Authorization'] = wx.getStorageSync(Vue.iGbal.vars.token) || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqd3QiLCJpYXQiOjE1NDQ1MjE2NzUsInN1YiI6IntcInVzZXJOYW1lXCI6bnVsbCxcInVzZXJJZFwiOm51bGwsXCJ1dWlkXCI6bnVsbCxcIm5pY2tOYW1lXCI6bnVsbCxcInJvbGVzXCI6W10sXCJ0b2tlblwiOm51bGwsXCJlbnRlcnBDb2RlXCI6XCIxMDAwMVwiLFwiYXBwSWRcIjpcInd4OGY4MWI3YmY3ZGM5ZTM0OFwiLFwiY29kZVwiOm51bGwsXCJvcGVuSWRcIjpcIm9Ocmg4MXBZSUxQMzlEc05KanhzdXFfTktvQW9cIixcInNjb3BlXCI6XCJzbnNhcGlfYmFzZVwiLFwibG9nb1wiOm51bGx9IiwiZXhwIjoxNTQ0NjA4MDc1fQ.rTKXsHnFsn3URgP73kQeDFjfp0qMLaSU7zxXLQP4yhs'
  request.headers['content-type'] = 'application/x-www-form-urlencoded'
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    // 获取 Authorization
    wx.setStorageSync(Vue.iGbal.vars.token, response.headers.Authorization)
    return promise.resolve(response.data)
  },
  (err, promise) => {
    return promise.reject(err)
  }
)
export default request
