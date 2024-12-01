import config from '../config'

export default {
  // 配置
  config: {
    baseUrl: `https://${config.domain}/`,
    header: {    
      // 'Source': config.source,
      // 'Version': config.version
      // 'Content-Type':'application/json;charset=UTF-8',
      // 'Content-Type':'application/x-www-form-urlencoded'
    },
    data: {},
    method: 'GET',
    // dataType: 'json',
    // responseType: 'text',
    fail(err) {
      // Tips.loaded()
      // Tips.toast(`抱歉，加载出错[${err}]，请稍后重试`)
    }
  },

  // 拦截器
  interceptor: {
    // 请求前拦截
    request: (config) => {
      config.header = {
        ...config.header,
        "MINAPPER-DEVICE":wx.DEVICE,     
        "MINAPPER-VERSION":config.minapperVersion
        // 'Token': storage('token') || ''
      }
    },

    // 请求后拦截
    response: (response) => {
      const res = response.data || {}

      // 判断返回状态，执行相应操作
      // if (response.statusCode !== 200) {
      //   Tips.toast(`网络异常[${response.errMsg}]`)
      //   report(`网络异常[${response.errMsg}]`)
      // }

      // 未登录清除登录态并转到登录页
      // if (res.code === 'user_parameter_error' || res.message === '用户参数错误') {
      //   Tips.loaded()
      //   Tips.toast('请先登录')
      //   clearLogin()
      //   login()
      // }

      return res
    }
  },

  request(options = {}) {
    options.baseUrl = options.baseUrl || this.config.baseUrl
    options.dataType = options.dataType || this.config.dataType
    options.url = /^https?:\/\//.test(options.url) ? options.url : options.baseUrl + options.url
    options.data = options.data || {}
    options.method = options.method || this.config.method

    return new Promise((resolve, reject) => {
      let _config = null

      options.complete = response => {
        let statusCode = response.statusCode
        response.config = _config

        if (this.interceptor.response) {
          let newResponse = this.interceptor.response(response)
          if (newResponse) {
            response = newResponse
          }
        }

        // 成功
        // if (statusCode === 200) {
        //   resolve(response)
        // } else {
        //   reject(response)
        // }
        resolve(response)
      }

      _config = Object.assign({}, this.config, options)
      _config.requestId = new Date().getTime()

      if (this.interceptor.request) {
        this.interceptor.request(_config)
      }

      wx.request(_config)
    })
  },

  get(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  },

  post(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  },

  put(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'PUT'
    return this.request(options)
  },

  delete(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'DELETE'
    return this.request(options)
  }
}