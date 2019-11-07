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
var Auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js');
var app = getApp();
var webSiteName= config.getWebsiteName;
var domain =config.getDomain

Page({

  data: {    
    readLogs: [],
    topBarItems: [
        // id name selected 选中状态
        { id: '1', name: '浏览', selected: true },
        { id: '2', name: '评论', selected: false},
        { id: '3', name: '点赞', selected: false },
        { id: '4', name: '鼓励', selected: false },
        { id: '5', name: '订阅', selected: false },
        // { id: '6', name: '言论', selected: false }
    ],
    tab: '1',
    showerror: "none",
    shownodata:"none",
    subscription:"",
    userInfo:{},
    userLevel:{},
    openid:'',
    isLoginPopup: false ,
    webSiteName:webSiteName,
    domain:domain 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    var self = this;     
    self.fetchPostsData('1');
    Auth.setUserInfoData(self); 
    Auth.checkLogin(self);
    
  },

  onReady: function () {
    var self = this;   
    Auth.checkSession(self,'isLoginNow');
  },
  agreeGetUser:function(e)
  {
    let self= this;
    Auth.checkAgreeGetUser(e,app,self,'0');        
        
  }, 

  refresh:function(e)
  {
    var self=this;
    if (self.data.openid) {
        var args={};
        var userInfo=e.detail.userInfo;
        args.openid=self.data.openid;
        args.avatarUrl=userInfo.avatarUrl;
        args.nickname =userInfo.nickName;
        var url = Api.getUpdateUserInfo();        
        var postUpdateUserInfoRequest = wxRequest.postRequest(url, args);
        postUpdateUserInfoRequest.then(res => {
            if (res.data.status == '200') {
                    var userLevel= res.data.userLevel;                            
                    wx.setStorageSync('userInfo',userInfo);                           
                    wx.setStorageSync('userLevel',userLevel);                            
                    self.setData({userInfo:userInfo});
                    self.setData({userLevel:userLevel});
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 900,
                        success: function () {
                        }
                    })   
            }
            else{               
                wx.showToast({
                    title: res.data.message,
                    icon: 'success',
                    duration: 900,
                    success: function () {
                    }
                })
            }
        });
    }
    else {
        Auth.checkSession(self,'isLoginNow');
        
    }
           
  },

  exit:function(e)
  {

    Auth.logout(this);
    wx.reLaunch({
        url: '../index/index'
      })
  },
  clear:function(e)
  {

    Auth.logout(this); 

  },

  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id;
    var itemtype = e.currentTarget.dataset.itemtype;
    var url ="";
    if (itemtype=="1")
    {
        url = '../list/list?categoryID=' + id;
    }
    else
    {
        url = '../detail/detail?id=' + id;

    }
      
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
  onShareAppMessage: function () {
      var title = "分享我在“" + config.getWebsiteName + "浏览、评论、点赞、鼓励的文章";
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
      self.setData({
          showerror: 'none',
          shownodata:'none'
      }); 
     var count =0;
     var openid = "";
     if(tab !='1')
      {
        if (self.data.openid) {
          var openid = self.data.openid;
        }
        else
        {
           Auth.checkSession(self,'isLoginNow');
           return;
        }


      }
      if (tab == '1')
      {
          self.setData({
              readLogs: (wx.getStorageSync('readLogs') || []).map(function (log) {
                  count++;
                  return log;
              })
          });
          if (count == 0) {
              self.setData({
                  shownodata: 'block'
              });
          }
      }
      else if (tab == '2')
       {
          self.setData({
              readLogs: []
          });
          var getMyCommentsPosts = wxRequest.getRequest(Api.getWeixinComment(openid));
              getMyCommentsPosts.then(response => {
                  if (response.statusCode == 200) {
                      self.setData({
                          readLogs: self.data.readLogs.concat(response.data.data.map(function (item) {
                              count++;
                              item[0] = item.post_id;
                              item[1] = item.post_title;
                              return item;
                          }))
                      });
                      if (count == 0) {
                          self.setData({
                              shownodata: 'block'
                          });
                      }
                  }
                  else {
                      console.log(response);
                      self.setData({
                          showerror: 'block'
                      });

                  }
              })
      }
      else if (tab == '3') {
          self.setData({
              readLogs: []
          });
          var getMylikePosts = wxRequest.getRequest(Api.getMyLikeUrl(openid));
          getMylikePosts.then(response => {
              if (response.statusCode == 200) {
                  self.setData({
                      readLogs: self.data.readLogs.concat(response.data.data.map(function (item) {
                          count++;
                          item[0] = item.post_id;
                          item[1] = item.post_title;
                          item[2] = "0";
                          return item;
                      }))
                  });

                  if (count == 0) {
                      self.setData({
                          shownodata: 'block'
                      });
                  } 
              }
              else {
                  console.log(response);
                  self.setData({
                      showerror: 'block'
                  });

              }
          })

      }
        else if (tab == '4') {
          self.setData({
            readLogs: []
        });
        
        var getMyPraisePosts = wxRequest.getRequest(Api.getMyPraiseUrl(openid));
          getMyPraisePosts.then(response => {
              if (response.statusCode == 200) {
                  self.setData({
                      readLogs: self.data.readLogs.concat(response.data.data.map(function (item) {
                          count++;
                          item[0] = item.post_id;
                          item[1] = item.post_title;
                          item[2] = "0";
                          return item;
                      }))
                  });
                  if (count == 0) {
                      self.setData({
                          shownodata: 'block'
                      });
                  } 
              }
              else {
                  console.log(response);
                  this.setData({
                      showerror: 'block'
                  });
              }
          })
    }
      else if (tab == '5') {
          self.setData({
              readLogs: []
          });
          var url = Api.getSubscription() + '?openid=' + openid;
          var getMysubPost = wxRequest.getRequest(url);              
          getMysubPost.then(response => {
              if (response.statusCode == 200) {
                  var usermetaList = response.data.usermetaList;
                  if (usermetaList)
                  {
                      self.setData({
                          readLogs: self.data.readLogs.concat(usermetaList.map(function (item) {
                              count++;
                              item[0] = item.ID;
                              item[1] = item.post_title;
                              item[2] = "0";
                              return item;
                          }))
                      });
                  }
                  if (count == 0) {
                      self.setData({
                          shownodata: 'block'
                      });
                  }
              }
              else {
                  console.log(response);
                  this.setData({
                      showerror: 'block'
                  });
              }
          })

          
      }
      else if (tab == '6'){
          self.setData({
              readLogs: []
          });
          var getNewComments = wxRequest.getRequest(Api.getNewComments());
          getNewComments.then(response => {
              if (response.statusCode == 200) {
                  self.setData({
                      readLogs: self.data.readLogs.concat(response.data.map(function (item) {
                          count++;
                          item[0] = item.post;
                          item[1] = util.removeHTML(item.content.rendered + '(' + item.author_name + ')');
                          item[2] = "0";
                          return item;
                      }))
                  });
                  if (count == 0) {
                      self.setData({
                          shownodata: 'block'
                      });
                  }

              }
              else {
                  console.log(response);
                  self.setData({
                      showerror: 'block'
                  });

              }
          }).catch(function () {
              console.log(response);
              self.setData({
                  showerror: 'block'
              });

          })
      }
  },  
  closeLoginPopup() {
      this.setData({ isLoginPopup: false });
  },
  openLoginPopup() {
      this.setData({ isLoginPopup: true });
  }
  ,
  confirm: function () {
        this.setData({
            'dialog.hidden': true,
            'dialog.title': '',
            'dialog.content': ''
        })
    } 
})