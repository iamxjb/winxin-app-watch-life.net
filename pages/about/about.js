/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 * 
 */

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')
var Auth = require('../../utils/auth.js');
import config from '../../utils/config.js'
var app = getApp();


Page({
  data: {
    title: '页面内容',
    pageData: {},
    pagesList: {},
    display: 'none',
    wxParseData: [],
    praiseList:[],
    dialog: {
        title: '',
        content: '',
        hidden: true
    },
    userInfo: {},
    isLoginPopup: false,
    openid:"",
    system:""
   
    
  },
  onLoad: function (options) {
    var self = this;
    wx.setNavigationBarTitle({
      title: '关于太牛旅行小程序',
      success: function (res) {
        // success
      }
    });
    Auth.setUserInfoData(self); 
    Auth.checkLogin(self);
    this.fetchData(config.getAboutId);
    wx.getSystemInfo({
          success: function (t) {
          var system = t.system.indexOf('iOS') != -1 ? 'iOS' : 'Android';
          self.setData({ system: system });

        }
      })
  },
  praise: function () {     
      
      var self = this;
      var minAppType = config.getMinAppType;
      var system  =self.data.system;
      if (minAppType == "0"  && system=='Android') {
          if (self.data.openid) {
              wx.navigateTo({
                  url: '../pay/pay?flag=2&openid=' + self.data.openid + '&postid=' + config.getAboutId
              })
          }
          else {
                Auth.checkSession(self,'isLoginNow');
            }
      }
      else {

          var src = config.getZanImageUrl;
          wx.previewImage({
              urls: [src],
          });

      } 
      
  },
  onPullDownRefresh: function () {
      var self = this;
      self.setData({
          display:'none' ,
          pageData:{},
          wxParseData:{},

      });

      this.fetchData(config.getAboutId);
      //消除下刷新出现空白矩形的问题。
      wx.stopPullDownRefresh()

  },  
  onShareAppMessage: function () {
    return {
      title: '关于“' + config.getWebsiteName +'”官方小程序',
      path: 'pages/about/about',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  gotowebpage:function()
  {
      var self=this;
      var minAppType = config.getMinAppType;
      var url = '';
      if (minAppType == "0") {
          url = '../webpage/webpage?';
          wx.navigateTo({
              url: url
          })
      }
      else {
          self.copyLink(config.getDomain);
      } 

  },
    copyLink: function (url) {
        //this.ShowHideMenu();
        wx.setClipboardData({
            data: url,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '链接已复制',
                            image: '../../images/link.png',
                            duration: 2000
                        })
                    }
                })
            }
        })
    },
  //给a标签添加跳转和复制链接事件
  wxParseTagATap: function (e) {
      var self = this;
      var href = e.currentTarget.dataset.src;
      console.log(href);
      var domain = config.getDomain;
      //我们可以在这里进行一些路由处理
      if (href.indexOf(domain) == -1) {
          wx.setClipboardData({
              data: href,
              success: function (res) {
                  wx.getClipboardData({
                      success: function (res) {
                          wx.showToast({
                              title: '链接已复制',
                              //icon: 'success',
                              image: '../../images/link.png',
                              duration: 2000
                          })
                      }
                  })
              }
          })
      }
      else {

          var slug = util.GetUrlFileName(href, domain);
          if (slug == 'index') {
              wx.switchTab({
                  url: '../index/index'
              })
          }
          else {
              var getPostSlugRequest = wxRequest.getRequest(Api.getPostBySlug(slug));
              getPostSlugRequest
                  .then(res => {
                      var postID = res.data[0].id;
                      var openLinkCount = wx.getStorageSync('openLinkCount') || 0;
                      if (openLinkCount > 4) {
                          wx.redirectTo({
                              url: '../detail/detail?id=' + postID
                          })
                      }
                      else {
                          wx.navigateTo({
                              url: '../detail/detail?id=' + postID
                          })
                          openLinkCount++;
                          wx.setStorageSync('openLinkCount', openLinkCount);
                      }

                  })

          }

      }

  },
  agreeGetUser: function (e) {
      var userInfo = e.detail.userInfo;
      var self = this;
      if (userInfo) {
          auth.getUsreInfo(e.detail);
          self.setData({ userInfo: userInfo });
      }
      setTimeout(function () {
          self.setData({ isLoginPopup: false })
      }, 1200);
  },
  closeLoginPopup() {
      this.setData({ isLoginPopup: false });
  },
  openLoginPopup() {
      this.setData({ isLoginPopup: true });
  }
    ,
  fetchData: function (id) {
    var self = this; 
    var getPageRequest = wxRequest.getRequest(Api.getPageByID(id));
    getPageRequest.then(response =>{
        console.log(response);
        WxParse.wxParse('article', 'html', response.data.content.rendered, self, 5);

        self.setData({
            pageData: response.data,
            // wxParseData: WxParse('md',response.data.content.rendered)
            //wxParseData: WxParse.wxParse('article', 'html', response.data.content.rendered, self, 5)
        });
        self.setData({
            display: 'block'
        });
        
        
    }).then(res =>{        
        var getAllPraiseRequest = wxRequest.getRequest(Api.getAllPraiseUrl());
        getAllPraiseRequest.then(response =>{

            if (response.data.status == '200') {

                var _avatarurls = response.data.avatarurls;
                var avatarurls = [];
                for (var i = 0; i < _avatarurls.length; i++) {
                    var avatarurl = "../../images/gravatar.png";
                    if (_avatarurls[i].avatarurl.indexOf('wx.qlogo.cn') != -1) {
                        avatarurl = _avatarurls[i].avatarurl;
                    }
                    avatarurls[i] = avatarurl;
                }
                
                self.setData({
                    praiseList: avatarurls
                });

            }
            else {
                console.log(response);
            }


        })

    })    
    .then(res =>{
        if (!app.globalData.isGetOpenid) {
           // auth.getUsreInfo();
        }

    })
  }
})