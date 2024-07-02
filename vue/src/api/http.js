import axios from 'axios'

// 获取动态子路径并构建 base URL
const getBaseURL = () => {
  let pathname = window.location.pathname;
  pathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return `${pathname}/${import.meta.env.VITE_BASE_URL}`; // 根据实际情况调整
}

// axios对象实例
const http = axios.create({
  // baseURL不设置，会自动使用当前域名
  baseURL: getBaseURL(),
  timeout: 60000
})

// 请求拦截器
http.interceptors.request.use(
  async (req) => {
    console.log('[request] ', req.method, req.url, req.data || req.params || '')

    return req
  },
  (error) => {
    console.log('[request error] ', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  // 成功拦截
  (resp) => {
    // 打印响应信息
    console.log('[response] ', resp.config.url, resp.data)
    const data = resp.data
    return data
  },
  // 失败拦截
  (error) => {
    // 判断连接是否超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      console.log('[response error] ', 'timeout')
    } else console.log('[response error] ', error.response?.status, error.response?.data, error)
    return Promise.reject(error.response)
  }
)

export default http
