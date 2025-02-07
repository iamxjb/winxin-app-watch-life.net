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

import { postWechatShopInfo } from '../shop/lib/api'

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
    enableWeixinOpen:config.enableWeixinOpen,
    enableWechatshop:config.enableWechatshop,
    storeappid: '',
    storename: '',
    location: "",
    latitude: "",
    longitude: "",
    address: "",
    isOPenlocation: false,    
    scopeUserLocation: 'undefined', 
    appid:'',
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
    }  

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

    wx.getSetting({
      success(res) {
        if (typeof(res.authSetting['scope.userLocation']) == 'undefined') {
          self.setData({
            scopeUserLocation: "undefined"
          });
        } else {
          self.setData({
            scopeUserLocation: res.authSetting['scope.userLocation'] ? 'true' : 'false'
          });

        }
      }
    })

    let  appid=wx.getStorageSync('appid');
    this.setData({
      appid:appid
    })

    const {storeinfo } =this.data.userInfo;
    if(storeinfo &&　storeinfo.storelocation){
      this.setData({
        location: storeinfo.storelocation,
        address: storeinfo.storeaddress,
        latitude: storeinfo.storelatitude,
        longitude: storeinfo.storelongitude,
        isOPenlocation: true
      });
    }
    
  },  
  bindgetuserinfo()
  {
    Auth.loginType(this)
    
  },
  agreeGetUser: function(e) {
    let self = this;
    Auth.checkAgreeGetUser(e, app, self, '0');

  },
  copyStoreappid:function(e){
    let self = this;
    wx.setClipboardData({
      data: self.data.appid,
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

  openUserLocation: function(e) {
    var self = this;
    if (!e.detail.value) {
      self.setData({
        location: '',
        address: '',
        latitude: '',
        longitude: '',
        isOPenlocation: false
      });
      return;
    }
    wx.chooseLocation({
      success: function(res) {
        // let map = '[minappermap latitude="'+res.latitude+'" longitude="'+res.longitude+'" title="'+res.name+'"]';
        // let content = self.data.content + map
    
        self.setData({
          location: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
          isOPenlocation: true,
          // content
        });
      },
      fail: function(err) {
        if (err.errMsg == 'chooseLocation:fail:auth denied' || err.errMsg == 'chooseLocation:fail auth deny') {
          wx.showToast({
            title: "请开启微信定位服务和小程序位置授权",
            mask: false,
            icon: "none",
            duration: 3000
          });

          self.setData({
            isOPenlocation: false,
            scopeUserLocation: 'false'
          });
        }else if(err.errMsg == 'chooseLocation:fail api scope is not declared in the privacy agreement')
        {
          wx.showToast({
            title: "未在用户隐私保护指引里设置位置授权",
            mask: false,
            icon: "none",
            duration: 3000
          })
          self.setData({
            isOPenlocation: false,
            scopeUserLocation: 'false'
          });
        }
         else if (err.errMsg == 'chooseLocation:fail cancel') {
          self.setData({
            isOPenlocation: false,
            scopeUserLocation: 'true'
          });

        }


      }
    })


  },

  openUserLocationBtn: function(e) {
    var self = this;
    wx.openSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          wx.chooseLocation({
            success: function(res) {
              // let map = '[minappermap latitude="'+res.latitude+'" longitude="'+res.longitude+'" title="'+res.name+'"]';
              // let content = self.data.content + map;
              self.setData({
                location: res.name,
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude,
                isOPenlocation: true,
                scopeUserLocation: 'true',
                // content
              });
            },
            fail: function(err) {
              if (err.errMsg == 'chooseLocation:fail cancel') {
                self.setData({
                  isOPenlocation: false,
                  scopeUserLocation: 'true'
                });

              }

            }

          })
        } else {
          wx.showToast({
            title: "用户未授权使用位置信息",
            mask: false,
            icon: "none",
            duration: 3000,
            isOPenlocation: false,
            scopeUserLocation: 'false'
          });

        }
      }
    })
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

  tapWechatOrder(e) {  
    let url= e.currentTarget.dataset.url+"?ordertype=my"
    wx.navigateTo({
      url:url
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
    let key = e.currentTarget.dataset.key
    this.setData({
      target: key,
      [key]: this.data.userInfo[key],
    })
  },
 
  
  onClose() {
    this.setData({
      target: false
    })
  },
  onSave() {

    const t = this.data.target
    
    if (t === 'nickName') {
      this.editNickName()
    }
    if (t === 'storeappid') {
      this.postWechatShopInfo()
    }   

  },

  // 绑定合作小店
  async postWechatShopInfo() {
    let storeappid = this.data.storeappid
    if (!storeappid) {
      wx.showToast({
        title: '请输入微信小店appid！',
        icon: 'none'
      })
      return
    }

    var storelocation = this.data.location;
    var storeaddress = this.data.address;
    var storelatitude = this.data.latitude;
    var storelongitude = this.data.longitude;
    let params = {
      openid: this.data.openid,
      userid: this.data.userId,
      storeappid,
      storelocation,
      storeaddress,
      storelatitude,
      storelongitude
    }
    wx.showLoading({
      title: '正在更新...',
    })
    const res= await postWechatShopInfo(params)
      if (res.code !== 'error') {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })

        let userInfo = this.data.userInfo        
        userInfo.storeappid = res.storeappid
        userInfo.storename = res.storename
        userInfo.storeinfo = res.storeinfo
        this.setData({
          userInfo
        })
        wx.setStorageSync('userInfo', userInfo) 
        this.onClose()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
      wx.hideLoading()
   
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