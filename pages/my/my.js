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
    isShow: false,
    subscription: "",
    userInfo: {},
    userLevel: {},
    openid: '',
    target: '',
    curField: '',
    isLoginPopup: false,
    webSiteName: webSiteName,
    domain: domain,
    wechat: wechat,
    nickName: '',
    inFinChat:false,
    uploadImageSize: config.uploadImageSize,
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
  onLoad: function(options) {
    var self = this; 
    wx.getSystemInfo({
      success (res) {
        if(res.inFinChat)
        {          
          self.setData({inFinChat:res.inFinChat})          
        }
        else{          
          Auth.setUserInfoData(self);
          Auth.checkLogin(self);
          self.setData({copyright: getApp().globalData.copyright})
          Auth.checkSession(self, 'isLoginNow');
        }
      }
    })
    
  },  
  bindgetuserinfo()
  {
    Auth.loginType(this)
    
  },
  agreeGetUser: function(e) {
    let self = this;
    Auth.checkAgreeGetUser(e, app, self, '0');

  },

  refresh: function(e) {
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
            success: function() { }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 900,
            success: function() { }
          })
        }
      });
    } else {
      Auth.loginType(this)

    }

  },
  exit: function(e) {

    Auth.logout(this);
    wx.reLaunch({
      url: '../index/index'
    })
  },
  clear: function(e) {

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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  confirm: function() {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    console.log(e)
    console.log(avatarUrl)
    this.uploadImg(avatarUrl)
  },


  uploadImg(tempFilePath) {
    const that = this
    Auth.wxLogin().then(res => {
      var js_code = res.js_code;
      let formData = {
        'js_code': js_code,
        'imagestype': "updateAvatar",
        'fileName': ""
      }

      var data = {};
      data.imgfile = tempFilePath
      data.formData = formData

      // 上传loading
      wx.showLoading({
        title: "正在上传...",
        mask: true
      })
      let url = Api.uploadFile();
      var uploadFile = wxRequest.uploadFile(url, data);
      uploadFile.then(res => {
        var res = JSON.parse(res.data.trim())
        if (res.success) {
          wx.showToast({
            title: res.message,
            mask: false,
            icon: "none",
            duration: 2000
          })
          let userInfo = that.data.userInfo
          userInfo.avatarUrl = res.avatarUrl
          userInfo.enableUpdateAvatarCount=res.enableUpdateAvatarCount;
          that.setData({
            userInfo
          })

        } else {
          wx.showToast({
            title: res.message,
            mask: false,
            icon: "none",
            duration: 2000
          })
        }
        wx.hideLoading()
      }).catch(err => {
        wx.showToast({
          icon: 'none',
          title: err.errMsg || '上传失败...'
        })

        wx.hideLoading()
      })



    })

  },
  showModal(e) {
    this.setData({
      target: e.currentTarget.dataset.key
    })
  },
  onEdit(e) {
    let key = e.currentTarget.dataset.key
    if (this.data.userInfo.despending == '2' && key === 'description') {
      wx.showToast({
        title: '正在审核中,无法编辑',
        icon: 'none'
      })
      return
    }

    this.setData({
      showPop: true
    })
  },
  onClose() {
    this.setData({
      target: false
    })
  },
  onSave() {

    this.editNickName()

  },

  // 修改个人简介
  editNickName() {
    const self = this
    let nickname = this.data.nickName
    if (!nickname) {
      wx.showToast({
        title: '请输入昵称！',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '正在更新...',
    })
 
    Auth.wxLogin().then(res => {
      var js_code = res.js_code;
      var args={};
      args.js_code =js_code;
      args.nickname = nickname;
      var url = Api.updateNickname();
      var postupdateNicknameRequest = wxRequest.postRequest(url, args);
      postupdateNicknameRequest.then(res => {
        if (res.data.status == '200') {
          wx.hideLoading()
          var nickname = res.data.nickname;
          var userInfo=self.data.userInfo;
          userInfo.nickName =nickname;
          wx.setStorageSync('userInfo', userInfo);        
          self.setData({
            userInfo: userInfo,
            target:false
          });          
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 900,
            success: function() { }
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 900,
            success: function() { }
          })
        }
      });

    });
   
  }
})