// 获取上一页面实例
export function getPrevPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 2] || {}
}

// 刷新上一页面数据
export function refreshtPrevPage(data = {}) {
  // TODO: 测试发现 onLoad 执行后 computed 值还没更新，所以要延迟一下执行 NND
  const prevPage = getPrevPage()
  // const fn = prevPage[method] // 须前置获取方法：todo 还是会出现未定义
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        prevPage.onLoad && prevPage.onLoad(data)
        resolve(data)
      } catch (r) {
        console.warn('刷新上一页面数据出错：' + r)
        reject(r)
      }
    }, 500)
  })
}

/**
 * 防抖
 *
 * @param {Function} func 要执行的函数
 * @param {Number} delay 延时时间
 * @return null
 */
export function debounce(func, delay = 500) {
  let timer
  return function() {
    // 注意区别 ...args剩余参数和arguments对象
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      typeof func === 'function' && func.apply(this, args) // 绑定 this
    }, delay)
  }
}

/**
 * 节流
 *
 * @param {Function} func 要执行的函数
 * @param {Number} delay 延时时间
 * @return null
 */
export function throttle(func, delay = 500) {
  let timer
  return function() {
    const args = arguments
    if (!timer) {
      typeof func === 'function' && func(args)
      timer = setTimeout(() => {
        timer = null
      }, delay)
    }
  }
}

export function appToMiniapp(path) {
  wx.miniapp.launchMiniProgram({
    userName: getApp().globalData.gh_id,
    path,
    miniprogramType: 0, // 0 releae ，1 test, 2 preview
    success: (res) => {}
  })
}