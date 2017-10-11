//var Promise = require('../../es6-promise/plugins/es6-promise.js')
function wxPromisify(url,method,data) {
  // return function (obj = {}) {
  //   return new Promise((resolve, reject) => {
  //     obj.success = function (res) {
  //       //成功
  //       resolve(res)
  //     }
  //     obj.fail = function (res) {
  //       //失败
  //       reject(res)
  //     }
  //     fn(obj)
  //   })
  // }

  return new Promise(function (resolve, reject) {    
    wx.request({
      url: url,
      data: data,
      method: method,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        console.log(err);
        reject(err);
      }
    })
  });
}




//无论promise对象最后状态如何都会执行
// Promise.prototype.finally = function (callback) {
//   let P = this.constructor;
//   return this.then(
//     value => P.resolve(callback()).then(() => value),
//     reason => P.resolve(callback()).then(() => { throw reason })
//   );
// };
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url,data) {
  var getRequest = wxPromisify(url,"GET",data)
  return getRequest;
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data) {
  var postRequest = wxPromisify(url,"POST",data)
  return postRequest;
}

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest
}