/*
 * 
 * 微慕小程序开源版
 * author: jianbo
 * organization: 微慕  www.minapper.com
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * Copyright (c) 2017  微慕 https://www.minapper.com All rights reserved.
 * 
 */
import * as api from '/pages/shop/lib/api.js'
import * as util from 'utils/new/util.js'

import { colorUI } from './utils/uiconfig'
App({
    
  colorUI, 
  onLaunch: function () {
        this.updateManager();
    // wx.setEnableDebug({
    //   enableDebug: true
    // })

    
  },  
  /*小程序主动更新
    */
  updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '有新版本',
        content: '新版本已经准备好，即将重启',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  },
  globalData: {
    userInfo: null,
    openid: '',
    isGetUserInfo: false,
    isGetOpenid: false
  },
   // 新封装的wx.request
   $api: api,
   $util: util
})