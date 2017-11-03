/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * 
 *  *Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 */
import config from '../../utils/config.js'
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js');
var app = getApp();
Page({

  data: {
    userInfo: {},
    readLogs: [],
    topBarItems: [
        // id name selected 选中状态
        { id: '1', name: '浏览', selected: true },
        { id: '2', name: '评论', selected: false},
        { id: '3', name: '点赞', selected: false },
        { id: '4', name: '赞赏', selected: false },
    ],
    tab: '1',
    showerror: "none",
    shownodate:"none"
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    var self = this;
    if (!app.globalData.isGetOpenid) {
        auth.getUsreInfo();
    }
    
  },

  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  onTapTag: function (e) {
      var self = this;
      var tab = e.currentTarget.id;
      var topBarItems = self.data.topBarItems;
      // 切换topBarItem 
      for (var i = 0; i < topBarItems.length; i++) {
          if (tab == topBarItems[i].id) {
              topBarItems[i].selected = true;
          } else {
              topBarItems[i].selected = false;
          }
      }
      self.setData({
          topBarItems: topBarItems,
          tab: tab

      })
      if (tab !== 0) {
          this.fetchPostsData(tab);
      } else {
          this.fetchPostsData("1");
      }
  },  
  onShow: function ()
  {
      self=this;
      self.fetchPostsData('1');
  },
  onShareAppMessage: function () {
      var title = "分享我在“" + config.getWebsiteName + "浏览、评论、点赞、赞赏的文章";
      var path = "pages/readlog/readlog";
      return {
          title: title,
          path: path,
          success: function (res) {
              // 转发成功
          },
          fail: function (res) {
              // 转发失败
          }
      }
  },
  fetchPostsData: function (tab) {
      self = this;
      var asdf = app.globalData.userInfo;
      
      self.setData({
          showerror: 'none',
          shownodate:'none',
          userInfo: app.globalData.userInfo
      });  

        
      if (tab == '1')
      {
          self.setData({
              readLogs: (wx.getStorageSync('readLogs') || []).map(function (log) {
                  return log;
              })
          });

          
      }
      else if (tab == '2')
       {
          self.setData({
              readLogs: []
          });
          if (app.globalData.isGetOpenid) {
              var openid = app.globalData.openid;
              var getMyCommentsPosts = wxRequest.getRequest(Api.getWeixinComment(openid));
              getMyCommentsPosts.then(response=>{

                  if (response.statusCode == 200) { 
                      self.setData({
                          readLogs: self.data.readLogs.concat(response.data.data.map(function (item) {
                              item[0] = item.post_id;
                              item[1] = item.post_title;
                              return item;
                          }))
                      });
                  }
                  else
                  {
                      console.log(response);
                      self.setData({
                          showerror: 'block' 
                      });
                      
                  }
              })

          }
          else
          {
              self.userAuthorization
          }          

       } 

      else if (tab == '3') {
          this.setData({
              readLogs: []
          });
          if (app.globalData.isGetOpenid) {
              var openid = app.globalData.openid;
              var getMylikePosts = wxRequest.getRequest(Api.getMyLikeUrl(openid));
              getMylikePosts.then(response => {

                  if (response.statusCode == 200) {
                      this.setData({
                          readLogs: self.data.readLogs.concat(response.data.data.map(function (item) {
                              item[0] = item.post_id;
                              item[1] = item.post_title;
                              return item;
                          }))
                      });
                  }
                  else {
                      console.log(response);
                      this.setData({
                          showerror: 'block'
                      });

                  }
              })

          }
          else {
              self.userAuthorization
          }

      }
    else if (tab == '4') {
      this.setData({
          readLogs: []
      });
      if (app.globalData.isGetOpenid) {
          var openid = app.globalData.openid;
          var getMyPraisePosts = wxRequest.getRequest(Api.getMyPraiseUrl(openid));
          getMyPraisePosts.then(response => {
              if (response.statusCode == 200) {
                  this.setData({
                      readLogs: self.data.readLogs.concat(response.data.data.map(function (item) {
                          item[0] = item.post_id;
                          item[1] = item.post_title;
                          return item;
                      }))
                  });
              }
              else {
                  console.log(response);
                  this.setData({
                      showerror: 'block'
                  });

              }
          })

      }
      else {
          self.userAuthorization
      }

      if (self.data.readLogs.length == 0) {
          self.setData({
              shownodate: 'block'
          });
      }

  }   

  },
  userAuthorization: function () {
      var self = this;
      // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
      wx.getSetting({
          success: function success(res) {
              console.log(res.authSetting);
              var authSetting = res.authSetting;
              if (util.isEmptyObject(authSetting)) {
                  console.log('第一次授权');
              } else {
                  console.log('不是第一次授权', authSetting);
                  // 没有授权的提醒
                  if (authSetting['scope.userInfo'] === false) {
                      wx.showModal({
                          title: '用户未授权',
                          content: '如需正常使用评论、点赞、赞赏等功能需授权获取用户信息。是否在授权管理中选中“用户信息”?',
                          showCancel: true,
                          cancelColor: '#296fd0',
                          confirmColor: '#296fd0',
                          confirmText: '设置权限',
                          success: function (res) {
                              if (res.confirm) {
                                  console.log('用户点击确定')
                                  wx.openSetting({
                                      success: function success(res) {
                                          console.log('打开设置', res.authSetting);
                                          var scopeUserInfo = res.authSetting["scope.userInfo"];
                                          if (scopeUserInfo) {
                                              auth.getUsreInfo();
                                          }
                                      }
                                  });
                              }
                          }
                      })
                  }
              }
          }
      });
  },
})