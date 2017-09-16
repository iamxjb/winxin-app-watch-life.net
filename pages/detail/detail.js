/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 *  *Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 * 
 */


import config from '../../utils/config.js'

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../es6-promise/utils/wxApi.js')
var wxRequest = require('../../es6-promise/utils/wxRequest.js')
var app = getApp();

Page({
    data: {
        title: '文章内容',
        detail: {},
        commentsList: [],
        ChildrenCommentsList: [],
        commentCount: '',
        detailDate: '',
        commentValue: '',
        wxParseData: [],
        display: 'none',
        page: 1,
        isLastPage: false,
        parentID: "0",
        focus: false,
        placeholder: "输入评论",
        postID: null,
        scrollHeight: 0,
        postList: [],
        link: '',        
        dialog: {
            title: '',
            content: '',
            hidden: true
        },
        content: '',      

        isShow: false,//控制menubox是否显示
        isLoad: true,//解决menubox执行一次  
        menuBackgroup: false,       
        likeImag:"like.png",
        likeList:[],
        likeCount:0,
        displayLike: 'none'
    },
    onLoad: function (options) {
        this.fetchDetailData(options.id);
        var self = this;
              
        //获取屏幕的高度
        var wxGetSystemInfo = wxApi.wxGetSystemInfo();
        wxGetSystemInfo().then(response=>{
          self.setData({
            scrollHeight: response.windowHeight

          })
        })
    },
    //获取用户信息和openid
    getUsreInfo:function(){      
      var self = this;
      var wxLogin = wxApi.wxLogin();
      var jscode='';
      wxLogin().then(response => {
          jscode = response.code
          var wxGetUserInfo = wxApi.wxGetUserInfo()
          return wxGetUserInfo()
        }).
        //获取用户信息
        then(response => {
          console.log(response.userInfo);
          app.globalData.userInfo=response.userInfo;
          app.globalData.isGetUserInfo=true;
          var url = Api.getOpenidUrl();
          var data = {
            js_code: jscode,
            encryptedData: response.encryptedData,
            iv: response.iv,
            avatarUrl: response.userInfo.avatarUrl
          }
          var postOpenidRequest = wxRequest.postRequest(url, data);
          postOpenidRequest.then(response => {
            if (response.data.status == '201') {
              console.log(response.data.openid);
              app.globalData.openid = response.data.openid;
              app.globalData.isGetOpenid = true;             

            }
            else {
              console.log(response.data.message);
            }
          }).then(response =>
          {
            self.getIslike();
          })
        })
    },
    showLikeImg:function(){
      var self=this;
      var flag = false;
      var likes = self.data.detail.avatarurls;
      self.setData({
        likeList: self.data.detail.avatarurls
      });
      
    },
    onShareAppMessage: function () {
      this.ShowHideMenu();
        return {
            title: '分享"守望轩"的文章：' + this.data.detail.title.rendered,
            path: 'pages/detail/detail?id=' + this.data.detail.id,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }

            
        }
    },
    copyLink: function () {
      this.ShowHideMenu();
        wx.setClipboardData({
            data: this.data.link,
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
    clickLike:function(e){
      var id =e.target.id;
      var self=this; 
      if (id =='likebottom')  
      {
        this.ShowHideMenu();
      } 
       
      if (app.globalData.isGetOpenid)
      { 
        var data = {
          openid: app.globalData.openid,         
          postid: self.data.postID          
        };
        var url = Api.postLikeUrl();
        var postLikeRequest = wxRequest.postRequest(url, data);
        postLikeRequest
          .then(response => {
            if (response.data.status == '201') {
              var _likeList = []
              var _like = { "avatarurl": app.globalData.userInfo.avatarUrl, "openid": app.globalData.openid }

              _likeList.push(_like);
              var tempLikeList = _likeList.concat(self.data.likeList);
              var _likeCount = parseInt(self.data.likeCount) + 1;
              self.setData({
                likeList: tempLikeList,
                likeCount: _likeCount,
                displayLike: 'block'
              });
              wx.showToast({
                title: '谢谢点赞',
                icon: 'success',
                duration: 900,
                success: function () {
                }
              }) 
            }
            else if (response.data.status == '501')
            {
              console.log(response.data.message);
              wx.showToast({
                title: '谢谢，已赞过',
                icon: 'success',
                duration: 900,
                success: function () {
                }
              })
            }
            else{
              console.log(response.data.message);

            }
            self.setData({
              likeImag: "like-on.png"
            });  
          })
      }
      else
      {
        self.userAuthorization();
      }
    },
    getIslike: function () { //判断当前用户是否点赞
      var self=this;
      if (app.globalData.isGetOpenid) {
        var data = {
          openid: app.globalData.openid,
          postid: self.data.postID
        };
        var url = Api.postIsLikeUrl();
        var postIsLikeRequest = wxRequest.postRequest(url, data);
        postIsLikeRequest
          .then(response => {

            if (response.data.status == '201') {

              self.setData({
                likeImag: "like-on.png"
              });
            }


          })

      }
    },    
   
    goHome:function()
    {
        wx.switchTab({
            url: '../index/index'
        })
    },
    praise:function(){
      this.ShowHideMenu();      
      var self = this;
      if (app.globalData.isGetOpenid) {

        wx.navigateTo({
          url: '../pay/pay?openid=' + app.globalData.openid+'&postid=' + self.data.postID 
        })
      }
      else {
        self.userAuthorization();
      }
    },

    //获取文章内容
    fetchDetailData: function (id) {
        var self = this;
        var getPostDetailRequest = wxRequest.getRequest(Api.getPostByID(id));
        var res;
        var _displayLike='none';
        
        getPostDetailRequest
            .then(response => {
                res = response;
                if (response.data.total_comments != null && response.data.total_comments != '') {
                    self.setData({
                        commentCount: "有" + response.data.total_comments + "条评论"
                    });
                };
                var _likeCount = response.data.like_count;
                if (response.data.like_count !='0')  
                {
                   _displayLike="block"
                }
                             
                self.setData({
                    detail: response.data,
                    likeCount: _likeCount ,
                    postID: id,
                    link: response.data.link,
                    detailDate: util.cutstr(response.data.date, 10, 1),
                    //wxParseData: WxParse('md',response.data.content.rendered)
                    wxParseData: WxParse.wxParse('article', 'html', response.data.content.rendered, self, 5),
                    display: 'block',
                    displayLike: _displayLike
                    
                });

            })
            .then(response => {
                wx.setNavigationBarTitle({
                    title: res.data.title.rendered
                });

            })
            .then(response => {
                var tagsArr = [];
                tagsArr = res.data.tags
                var tags = "";
                for (var i = 0; i < tagsArr.length; i++) {
                    if (i == 0) {
                        tags += tagsArr[i];
                    }
                    else {
                        tags += "," + tagsArr[i];

                    }
                }
                if (tags != "") {
                    var getPostTagsRequest = wxRequest.getRequest(Api.getPostsByTags(id, tags));
                    getPostTagsRequest
                        .then(response => {
                            self.setData({
                                postList: response.data
                            });

                        })

                }
            }).then(response =>{
                var updatePageviewsRequest = wxRequest.getRequest(Api.updatePageviews(id));
                updatePageviewsRequest
                    .then(result => {
                        console.log(result.data.message);                       

                    })
                
          }).then(response => {//获取点赞记录
            self.showLikeImg();
          }).then(response => {
                self.fetchCommentData(self.data, '0');
            }).then(resonse =>{
              if (!app.globalData.isGetOpenid) {
                self.getUsreInfo();
              }

          }).then(response => {
            self.getIslike();
          })                       
            .catch(function (response) {

            }).finally(function (response) {

            });


    },
    //给a标签添加跳转和复制链接事件
    wxParseTagATap: function (e) {
        var self = this;
        var href = e.currentTarget.dataset.src;
        console.log(href);
        var domain = config.getDomain;
        //可以在这里进行一些路由处理
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
    //获取评论
    fetchCommentData: function (data, flag) {
        var self = this;
        if (!data) data = {};
        if (!data.page) data.page = 1;

        self.setData({
            commentsList: [],
            ChildrenCommentsList: []
        });

        var getCommentsRequest = wxRequest.getRequest(Api.getComments(data));

        getCommentsRequest
            .then(response => {
                if (response.data.length < 100) {
                    self.setData({
                        isLastPage: true
                    });
                }
                if (response.data) {
                    self.setData({
                        //commentsList: response.data, 
                        commentsList: self.data.commentsList.concat(response.data.map(function (item) {
                            var strSummary = util.removeHTML(item.content.rendered);
                            var strdate = item.date
                            item.summary = strSummary;

                            item.date = util.formatDateTime(strdate);
                            if (item.author_url.indexOf('wx.qlogo.cn') != -1) {
                                if (item.author_url.indexOf('https') == -1) {
                                    item.author_url = item.author_url.replace("http", "https");
                                }
                            }
                            else {
                                item.author_url = "../../images/gravatar.png";
                            }
                            return item;
                        }))

                    });
                }
            })
            .then(response => {
                if (data.page === 1) {
                    self.fetchChildrenCommentData(data, flag);
                }
            })

    },

    //获取回复
    fetchChildrenCommentData: function (data, flag) {
        var self = this;
        var getChildrenCommentsRequest = wxRequest.getRequest(Api.getChildrenComments(data));
        getChildrenCommentsRequest
            .then(response => {
                if (response.data) {
                    self.setData({
                        ChildrenCommentsList: self.data.ChildrenCommentsList.concat(response.data.map(function (item) {
                            var strSummary = util.removeHTML(item.content.rendered);
                            var strdate = item.date
                            item.summary = strSummary;

                            item.date = util.formatDateTime(strdate);
                            if (item.author_url.indexOf('wx.qlogo.cn') != -1) {
                                if (item.author_url.indexOf('https') == -1) {
                                    item.author_url = item.author_url.replace("http", "https");
                                }
                            }
                            else {
                                item.author_url = "../../images/gravatar.png";
                            }
                            return item;
                        }))

                    });

                }
                setTimeout(function () {
                    //wx.hideLoading();
                    if (flag == '1') {
                        wx.showToast({
                            title: '评论发布成功。',
                            icon: 'success',
                            duration: 900,
                            success: function () {

                            }
                        })
                    }
                }, 900);
            })
    },
    //显示或隐藏功能菜单
    ShowHideMenu: function () {
        this.setData({
            isShow: !this.data.isShow,
            isLoad: false,
            menuBackgroup: !this.data.false
        })
    },
    //点击非评论区隐藏功能菜单
    hiddenMenubox: function () {
        this.setData({
            isShow: false,
            menuBackgroup: false
        })
    },
    //底部刷新
    loadMore: function (e) {
        var self = this;
        if (!self.data.isLastPage) {
            self.setData({
                page: self.data.page + 1
            });
            console.log('当前页' + self.data.page);
            this.fetchCommentData(self.data, '0');
        }
        else {
            wx.showToast({
                title: '没有更多内容',
                mask: false,
                duration: 1000
            });
        }
    },
    replay: function (e) {
        var self = this;
        var id = e.target.dataset.id;
        var name = e.target.dataset.name;
        self.setData({
            parentID: id,
            content: "@" + name + ":",
            focus: true
        });
    },
    //提交评论
    formSubmit: function (e) {
        var self = this;
        var name = app.globalData.userInfo.nickName;        
        var comment = e.detail.value.inputComment;
        var author_url = app.globalData.userInfo.avatarUrl;
        var parent = self.data.parentID;
        var postID = e.detail.value.inputPostID;
        if (comment.indexOf('@') == -1 && comment.indexOf(':') == -1) {
            parent = 0;
        }
        else {
            var temp = comment.split(":");
            if (temp.length == 2 && temp[temp.length - 1].length != 0) {
                comment = temp[temp.length - 1];
            }
            else {
                comment = "";
            }
        }
        if (comment.length === 0) {
            self.setData({
                'dialog.hidden': false,
                'dialog.title': '提示',
                'dialog.content': '没有填写评论内容。'

            });
        }
        else {
          if (app.globalData.isGetOpenid) {
            var email = app.globalData.openid+"@wx.qq.com";
                var data = {
                    post: postID,
                    author_name: name,
                    author_email: email,
                    content: comment,
                    author_url: author_url,
                    parent: parent
                };
                var url = Api.postComment();
                var postCommentRequest = wxRequest.postRequest(url,data);
                postCommentRequest
                    .then(res => {
                        if (res.statusCode == 201 || res.statusCode == 200) {
                            self.setData({
                                content: '',
                                parent: "0",
                                placeholder: "输入评论",
                                focus: false,
                                commentsList: [],
                                ChildrenCommentsList: []

                            });
                            self.fetchCommentData(self.data, '1');
                        }
                        else {

                            if (res.data.code == 'rest_comment_login_required') {
                                self.setData({
                                    'dialog.hidden': false,
                                    'dialog.title': '提示',
                                    'dialog.content': '需要开启在WordPress rest api 的匿名评论功能！'

                                });
                            }
                            else if (res.data.code == 'rest_invalid_param' && res.data.message.indexOf('author_email') > 0) {
                                self.setData({
                                    'dialog.hidden': false,
                                    'dialog.title': '提示',
                                    'dialog.content': 'email填写错误！'

                                });
                            }
                            else {
                                self.setData({
                                    'dialog.hidden': false,
                                    'dialog.title': '提示',
                                    'dialog.content': '评论失败,' + res.data.message

                                });
                            }
                        }
                    })

            }
            else
            {
               self.userAuthorization();
              
            }

        }

    },
    userAuthorization:function(){
      var self=this;
      wx.showModal({
        title: '未授权',
        content: '如需正常使用评论的功能需授权获取用户信息。是否在授权管理中选中“用户信息”?',
        showCancel: true,
        cancelColor: '#296fd0',
        confirmColor: '#296fd0',
        confirmText: '设置权限',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.openSetting({
              success: function success(res) {
                console.log('openSetting success', res.authSetting);
                var scopeUserInfo = res.authSetting["scope.userInfo"];
                if (scopeUserInfo) {
                  self.getUsreInfo();
                }
              }
            });
          }
        }
      })
    },
       
    confirm: function () {
        this.setData({
            'dialog.hidden': true,
            'dialog.title': '',
            'dialog.content': ''
        })
    } 
})
