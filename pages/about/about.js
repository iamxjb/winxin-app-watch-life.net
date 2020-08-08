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

var webSiteName=config.getWebsiteName;
var domain =config.getDomain


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
    system:"",
    webSiteName:webSiteName,
    domain:domain,
    downloadFileDomain: config.getDownloadFileDomain,
    businessDomain:config.getBusinessDomain,
   
    
  },
  onLoad: function (options) {
    var self = this;    
    Auth.setUserInfoData(self); 
    Auth.checkLogin(self);
    this.fetchData();
    wx.getSystemInfo({
          success: function (t) {
          var system = t.system.indexOf('iOS') != -1 ? 'iOS' : 'Android';
          self.setData({ system: system });

        }
      })
    // 设置系统分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
 
  praise: function () {     
      
      var self = this;
      var enterpriseMinapp = self.data.pageData.enterpriseMinapp;
      var system  =self.data.system;
      var praiseWord=self.data.pageData.praiseWord;
      var postid=self.data.pageData.id;
      if (enterpriseMinapp == "1"  && system=='Android') {
          if (self.data.openid) {
              wx.navigateTo({
                  url: '../pay/pay?flag=2&openid=' + self.data.openid + '&postid=' + postid +'&praiseWord='+praiseWord
              })
          }
          else {
                Auth.checkSession(self,'isLoginNow');
            }
      }
      else if(enterpriseMinapp == "0" || system=='iOS') {

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

      this.fetchData();
      //消除下刷新出现空白矩形的问题。
      wx.stopPullDownRefresh()

  },  
  onShareAppMessage: function () {
    return {
      title: '关于“' + config.getWebsiteName +'”小程序',
      path: 'pages/about/about',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
   // 自定义分享朋友圈
   onShareTimeline: function() {
    return {
      title: '关于“' + config.getWebsiteName +'”小程序',
      path: 'pages/about/about'      
    }
  },

  gotowebpage:function()
  {
      var self=this;
      var enterpriseMinapp = self.data.pageData.enterpriseMinapp;
      var url = '';
      if (enterpriseMinapp == "1") {
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
    let appid = e.currentTarget.dataset.appid;
    let redirectype = e.currentTarget.dataset.redirectype;
    let path = e.currentTarget.dataset.path;


    // 判断a标签src里是不是插入的文档链接
    let isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(href)

    if (isDoc) {
      this.openLinkDoc(e)
      return
    }

    if(redirectype) {
      if (redirectype == 'apppage') { //跳转到小程序内部页面         
        wx.navigateTo({
          url: path
        })
      } else if (redirectype == 'webpage') //跳转到web-view内嵌的页面
      {
        href = '../webpage/webpage?url=' + href;
        wx.navigateTo({
          url: href
        })
      }
      else if (redirectype == 'miniapp') //跳转其他小程序
       {
        wx.navigateToMiniProgram({
          appId: appid,
          path: path
        })
      }
      return;
    }


    var enterpriseMinapp = self.data.pageData.enterpriseMinapp;
    var domain = config.getDomain;
    //可以在这里进行一些路由处理
    if (href.indexOf(domain) == -1) {

      var n=0;
      for (var i = 0; i < self.data.businessDomain.length; i++) {
  
        if (href.indexOf(self.data.businessDomain[i].domain) != -1) {
          n++;
          break;
        }
      }

      if(n>0)
      {
        var url = '../webpage/webpage'
        if (enterpriseMinapp == "1") {
          url = '../webpage/webpage';
          wx.navigateTo({
            url: url + '?url=' + href
          })
        }
        else {
          self.copyLink(href);
        }
      }
      else
      {
        self.copyLink(href);

      }


      // wx.setClipboardData({
      //   data: href,
      //   success: function (res) {
      //     wx.getClipboardData({
      //       success: function (res) {
      //         wx.showToast({
      //           title: '链接已复制',
      //           //icon: 'success',
      //           image: '../../images/link.png',
      //           duration: 2000
      //         })
      //       }
      //     })
      //   }
      // })
    }
    else {
      var slug = util.GetUrlFileName(href, domain);
      if(slug=="")
      {
          var url = '../webpage/webpage'
          if (enterpriseMinapp == "1") {
            url = '../webpage/webpage';
            wx.navigateTo({
              url: url + '?url=' + href
            })
          }
          else {
            self.copyLink(href);
          }
        return;

      }
      if (slug == 'index') {
        wx.switchTab({
          url: '../index/index'
        })
      }
      else {
        var getPostSlugRequest = wxRequest.getRequest(Api.getPostBySlug(slug));
        getPostSlugRequest
          .then(res => {
            if (res.statusCode == 200) {
              if (res.data.length != 0) {
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
              }
              else {
                
                var url = '../webpage/webpage'
                if (enterpriseMinapp == "1") {
                  url = '../webpage/webpage';
                  wx.navigateTo({
                    url: url + '?url=' + href
                  })
                }
                else {
                  self.copyLink(href);
                }


              }

            }

          }).catch(res => {
            console.log(response.data.message);
          })
      }
    }

  },

   // 打开文档
   openLinkDoc(e) {
    let self = this
    let url
    let fileType
    
    // 如果是a标签href中插入的文档
    let src = e.currentTarget.dataset.src
    var n=0;
    for (var i = 0; i < self.data.downloadFileDomain.length; i++) {

      if (src.indexOf(self.data.downloadFileDomain[i].domain) != -1) {
        n++;
        break;
      }
    }

    if(n==0)
    {
      self.copyLink(src);
      return;
    }

    let docType
    let isDoc = /\.(doc|docx|xls|xlsx|ppt|pptx|pdf)$/.test(src)

    if (src && isDoc){
      url = src
      fileType = /doc|docx|xls|xlsx|ppt|pptx|pdf$/.exec(src)[0]
    } else {
      url = e.currentTarget.dataset.filelink
      fileType = e.currentTarget.dataset.filetype
    }

    wx.downloadFile({
      url: url,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fieldType: fileType
        })
      },
      fail: function (error) {
        console.log('下载文档失败:' + error)
      }
    })
  },
  copyLink: function (url) {
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
  agreeGetUser: function (e) {
  
    let self= this;
    Auth.checkAgreeGetUser(e,app,self,'0');;
  },
  closeLoginPopup() {
      this.setData({ isLoginPopup: false });
  },
  openLoginPopup() {
      this.setData({ isLoginPopup: true });
  }
    ,
  fetchData: function () {
    var self = this; 
    var getPageRequest = wxRequest.getRequest(Api.getAboutPage());
    getPageRequest.then(response =>{
        console.log(response);
        wx.setNavigationBarTitle({
            title: response.data.post_title,
            success: function (res) {
              // success
            }
          });
        WxParse.wxParse('article', 'html', response.data.post_content, self, 5);

        self.setData({
            pageData: response.data,
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
           
        }

    })
  }
})