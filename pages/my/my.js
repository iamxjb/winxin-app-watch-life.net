/*
 * 
 * 微慕小程序开源版
 * author: jianbo
 * organization: 微慕  www.minapper.com
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * 
 *  *Copyright (c) 2017 https://www.minapper.com All rights reserved.
 */
import config from '../../utils/config.js'
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var Auth = require('../../utils/auth.js');

var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js');
var app = getApp();
var webSiteName = config.getWebsiteName;
var domain = config.getDomain;
var wechat = config.getWecat

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subscription: "",
    userInfo: {},
    userLevel: {},
    openid: '',
    isLoginPopup: false,
    webSiteName: webSiteName,
    domain: domain,
    wechat: wechat,
    list: [{
        name: "浏览",
        icon: "cicon-eye",
        color: "#9DCA06",
        path: "/pages/readlog/readlog?key=1"
      },
      {
        name: "评论",
        icon: "cicon-popover",
        color: "#FFB300",
        path: "/pages/readlog/readlog?key=2"
      },
      {
        name: "点赞",
        icon: "cicon-favorite",
        color: "#53bcf5",
        path: "/pages/readlog/readlog?key=3"
      },
      {
        name: "订阅",
        color: "#F37D7D",
        icon: "cicon-notice-active",
        path: "/pages/readlog/readlog?key=5"
      },

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    Auth.setUserInfoData(self);
    Auth.checkLogin(self);
    Auth.checkSession(self, 'isLoginNow');
  },
  onReady: function () {
    var self = this;
    Auth.checkSession(self, 'isLoginNow');
  },
  agreeGetUser: function (e) {
    let self = this;
    Auth.checkAgreeGetUser(e, app, self, '0');

  },

  refresh: function (e) {
    var self = this;
    if (self.data.openid) {
      var args = {};
      var userInfo = e.detail.userInfo;
      args.openid = self.data.openid;
      args.avatarUrl = userInfo.avatarUrl;
      args.nickname = userInfo.nickName;
      var url = Api.getUpdateUserInfo();
      var postUpdateUserInfoRequest = wxRequest.postRequest(url, args);
      postUpdateUserInfoRequest.then(res => {
        if (res.data.status == '200') {
          var userLevel = res.data.userLevel;
          wx.setStorageSync('userInfo', userInfo);
          wx.setStorageSync('userLevel', userLevel);
          self.setData({
            userInfo: userInfo
          });
          self.setData({
            userLevel: userLevel
          });
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 900,
            success: function () {}
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 900,
            success: function () {}
          })
        }
      });
    } else {
      Auth.checkSession(self, 'isLoginNow');

    }

  },
  exit: function (e) {

    Auth.logout(this);
    wx.reLaunch({
      url: '../index/index'
    })
  },
  clear: function (e) {

    Auth.logout(this);

  },
  closeLoginPopup() {
    this.setData({
      isLoginPopup: false
    });
  },
  openLoginPopup() {
    this.setData({
      isLoginPopup: true
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
  },
  tapToUrl(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  tapCopy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.value,
      success() {
        wx.showToast({
          title: '复制成功！',
          icon: 'none'
        })
      },
      fail() {
        wx.showToast({
          title: '复制失败！',
          icon: 'none'
        })
      },
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  },
  

})