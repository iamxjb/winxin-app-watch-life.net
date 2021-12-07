const app = getApp()
import config from '../../utils/config.js';
const pro_API = require('../../utils/api.js')
var wxRequest = require('../../utils/wxRequest.js');
var freeplus_Api = require('../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '扫码登录WordPress'
    },
    source: {
      type: String,
      value: config.minapperSource // pro 专业版 plus 增强版 free  开源版
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: config.enableScanLogin
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转
    scanQRCodeLogin(e) {
      var sessionId = "";
      var source=this.data.source;
      if (source == 'pro') {
        let userInfo = wx.getStorageSync('userSession');
        if (!userInfo.userId || !userInfo.sessionId) {
          wx.showToast({
            icon: 'none',
            title: '没有登录无法使用'
          })
          return;
        } else {
          sessionId = userInfo.sessionId;
        }
      } else if (source == 'free' || source == 'plus') {
        var openid = wx.getStorageSync('openid');
        if (!openid) {
          wx.showToast({
            icon: 'none',
            title: '没有登录无法使用'
          })
          return;
        } else {
          sessionId = openid;
        }
      }

      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: res => {
          var qrcode = res.result;
          if (qrcode.length != 16) {
            wx.showToast({
              icon: 'none',
              title: '无效的二维码'
            })
            return;
          }
          let params = {
            sessionid: sessionId,
            qrcode: qrcode,
            action: 'scan'
          }
          console.log(params);
          if (source== 'pro') {
            pro_API.scanQrcode(params).then(res => {
              if (res.success == true) {
                wx.showModal({
                  title: '提示',
                  content: '确认使用当前账号登录网站？',
                  success(res) {
                    if (res.confirm) {
                      params = {
                        sessionid: sessionId,
                        qrcode: qrcode,
                        action: 'confirm'
                      }
                      pro_API.scanQrcode(params).then(res => {
                        if (res.success == true) {
                          wx.showToast({
                            title: '已登录',
                            icon: 'none',
                          })
                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            });
          } else if (source == 'free' || source == 'plus') {
            var url = freeplus_Api.scanQrcode();
            var postScanQrcode = wxRequest.postRequest(url, params);
            postScanQrcode.then(res => {
              if (res.data.success == true) {
                console.log(res.data);
                wx.showModal({
                  title: '提示',
                  content: '确认使用当前账号登录网站？',
                  success(res) {
                    if (res.confirm) {
                      params = {
                        sessionid: sessionId,
                        qrcode: qrcode,
                        action: 'confirm'
                      }
                      postScanQrcode = wxRequest.postRequest(url, params);
                      postScanQrcode.then(res => {
                        console.log(res.data);
                        if (res.data.success == true) {
                          wx.showToast({
                            title: '已登录',
                            icon: 'none',
                          })
                        }
                      })

                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
  }
})