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

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()

Page({
  data: {
    title: '文章内容',
    detail: {},
    commentsList:[],
    ChildrenCommentsList: [],
    commentCount:'',
    detailDate:'',
    commentValue:'',
   
    wxParseData:[],
    display:'none',
    page: 1,
    isLastPage:false,

    parentID:"0",
    focus:false,    
    placeholder:"输入评论",

    postID:null,
    scrollHeight: 0,
    link:'',



    isGetUserInfo:false,
    dialog: {
      title: '',
      content: '',
      hidden: true
    },
    content:'',
    userInfo:[]
  },
  onLoad: function (options) {
    this.fetchDetailData(options.id);
    var self = this;
    wx.getSystemInfo({
      
      success: function (res) {
        //console.info(res.windowHeight);
        self.setData({
          scrollHeight: res.windowHeight,
          
        });
      }
    });

    //获取用户信息
    app.getUserInfo(function (userInfo) {
      //更新数据
      self.setData({
        userInfo: userInfo,
        isGetUserInfo:true
      })
    });
  },
  onShareAppMessage: function () {
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
  copyLink:function()
  {
    wx.setClipboardData({
      data: this.data.link,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '完成复制',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  //获取文章内容
  fetchDetailData: function (id) {
    var self = this;
   
    wx.request({
      url: Api.getPostByID(id, { mdrender: false }),
      success: function (response) {

        if (response.data.total_comments != null && response.data.total_comments !='' )
        {
          self.setData({            
            commentCount: "有" + response.data.total_comments + "条评论"
          });
         
        }        
        self.setData({
          detail: response.data,
          postID: id,
          link: response.data.link,
         
          detailDate: util.cutstr(response.data.date, 10, 1),
          //wxParseData: WxParse('md',response.data.content.rendered)
          wxParseData: WxParse.wxParse('article', 'html', response.data.content.rendered, self, 5),
          display: 'block'

        });

        wx.setNavigationBarTitle({
          title: response.data.title.rendered,
          success: function (res) {
            // success
          }
        });


        // 调用API从本地缓存中获取阅读记录并记录
        var logs = wx.getStorageSync('readLogs') || [];
        // 过滤重复值
        if (logs.length > 0) {
          logs = logs.filter(function (log) {
            return log[0] !== id;
          });
        }
        // 如果超过指定数量
        if (logs.length > 19) {
          logs.pop();//去除最后一个
        }
        logs.unshift([id, response.data.title.rendered]);
        wx.setStorageSync('readLogs', logs);
        //end 

        self.fetchCommentData(self.data,'0');       
      }
    });
  },
  //获取评论
  fetchCommentData: function (data,flag) {
    var self = this; 


    wx.showLoading({
      title: '正在加载',
      mask: true
    }) 
    
    if (!data) data = {};
    if (!data.page) data.page = 1;

    self.setData({
      commentsList: [],
      ChildrenCommentsList: []
    });

    wx.request({
      url: Api.getComments(data),
      success: function (response) {
        if (response.data.length < 100) {
          self.setData({
            isLastPage: true
          });
        }
       // self.data.commentsList;

        if (response.data) {

       
        self.setData({
          //commentsList: response.data, 
          commentsList: self.data.commentsList.concat(response.data.map(function (item) {
            var strSummary = util.removeHTML(item.content.rendered);
            var strdate = item.date
            item.summary = strSummary;
           
            item.date = util.formatDateTime(strdate);
             if (item.author_url.indexOf('wx.qlogo.cn') !=-1 )
            {
              if (item.author_url.indexOf('https') ==-1 )
              {
                item.author_url = item.author_url.replace("http", "https");
              }

              
            }
            else
            {
              item.author_url ="../../images/gravatar.png";
            }
            
             
            return item;
           
          }))
          
          
        });

      }
        if (data.page === 1){
          self.fetchChildrenCommentData(data, flag);
      }
        
      }
    });
  },

  //获取回复
  fetchChildrenCommentData: function (data,flag) {
  var self = this;
    wx.request({
      url: Api.getChildrenComments(data),
      success: function (response) {

        if (response.data)
        {         
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
          wx.hideLoading();
          if(flag=='1')
          {
            wx.showToast({
              title: '评论发布成功。',
              icon: 'success',
              duration: 900,
              success: function () {

              }
            })
          }
        }, 900);
      }
    });


  
  },
  //底部刷新
  loadMore: function (e) {

    var self = this;
    if (!self.data.isLastPage) {
      self.setData({
        page: self.data.page + 1
      });
      console.log('当前页' + self.data.page);
      this.fetchCommentData(self.data,'0');
    }
    else {
      wx.showToast({
        title: '没有更多内容',
        mask: false,
        duration: 1000
      });
    }
  },
  replay:function(e)
  {
    var self = this;
    var id = e.target.dataset.id;
    var name = e.target.dataset.name;
    self.setData({
      parentID: id,
      placeholder: "回复："+name,
      focus:true
    });
    

  },
  //提交评论
  formSubmit: function (e) { 
    var self = this;   
    var name = self.data.userInfo.nickName;
    var email = "test@test.com";
    var comment = e.detail.value.inputComment;
    var author_url =  self.data.userInfo.avatarUrl;
    var parent  = self.data.parentID;
    
    var postID = e.detail.value.inputPostID;
    if (comment.length===0 )
    {
      self.setData({
        'dialog.hidden': false,
        'dialog.title': '提示',
        'dialog.content': '没有填写评论内容。'

      });

    }
    else
    {
      //检测授权
      self.checkSettingStatu();
      
      if (self.data.isGetUserInfo)
      {


        wx.request({
          url: Api.postComment(),
          method: 'post',
          data: {
            post: postID,
            author_name: name,
            author_email: email,
            content: comment,
            author_url: author_url,
            parent: parent
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            //console.log(res.data)
            if (res.statusCode == 201) {
              self.setData({                
                content: '',
                parent:"0",
                placeholder:"输入评论",
                focus:false,
                commentsList: [],
                ChildrenCommentsList: []

              });             

              self.fetchCommentData(self.data,'1');
              
              
              

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

          },
          fail: function (res) {
            //console.log(res.data) 
          }
        });

      }

    }
   
  },
  // 检测授权状态
  checkSettingStatu: function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (util.isEmptyObject(authSetting)) {
          console.log('首次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用评论的功能，请授权管理中选中“用户信息”，然后点按确定后再次提交评论。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                      var as = res.authSetting;
                      for (var i in as) {
                        
                        if(as[i])
                        {
                          //获取用户信息
                          app.getUserInfo(function (userInfo)                             {
                            //更新数据
                            that.setData({
                              userInfo: userInfo,
                              isGetUserInfo: true
                            })
                          });
                        }
                        
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
  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  }
  

})
