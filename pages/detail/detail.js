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

Page({
  data: {
    title: '文章内容',
    detail: {},
    commentsList:{},
    commentCount:'',
    detailDate:'',
    hidden: false,
    wxParseData:[],
    display:'none',
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
  },
  onShareAppMessage: function () {
    return {
      title: '分享文章：' + this.data.detail.title.rendered,
      path: 'pages/detail/detail?id=' + this.data.detail.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //获取文章内容
  fetchDetailData: function (id) {
    var self = this;
    self.setData({
      hidden: false

    });
    wx.request({
      url: Api.getPostByID(id, { mdrender: false }),
      success: function (response) {
        //console.log(response);
        self.setData({
          detail: response.data,
          detailDate: util.cutstr(response.data.date, 10, 1),
          //wxParseData: WxParse('md',response.data.content.rendered)
          wxParseData: WxParse.wxParse('article', 'html', response.data.content.rendered, self, 5),
          display: 'block'

        });

        self.fetchCommentData(id);

        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);
      }
    });
  },
  //获取评论
  fetchCommentData: function (id) {
    var self = this;
    self.setData({
      hidden: false,
      commentsList: []
    });

    var dd = wx.getStorageSync("userInfo");
    wx.request({
      url: Api.getComments(id, { mdrender: false }),
      success: function (response) {
        self.data.commentsList;
        self.setData({
          //commentsList: response.data,
          commentsList: self.data.commentsList.concat(response.data.map(function (item) {
            var strSummary = util.removeHTML(item.content.rendered);
            var strdate = item.date
            item.summary = strSummary;
            item.date = util.formatDateTime(strdate);
            return item;
          })),
          commentCount: "有" + response.data.length + "条评论",
          userInfo: wx.getStorageSync("userInfo")
        });
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);
      }
    });
  },
  //提交评论
  formSubmit: function (e) { 
    var self = this;   
    var name = e.detail.value.inputName;
    var email = e.detail.value.inputEmail;
    var comment = e.detail.value.inputComment;
    var postID = e.detail.value.inputPostID;
    if (name.length === 0 || email.length === 0 || comment.length===0 )
    {
      self.setData({
        'dialog.hidden': false,
        'dialog.title': '提示',
        'dialog.content': '有需要填写的内容没有填写'

      });

    }
    else
    {
      
      wx.request({
        url: Api.postComment(), 
        method:'post',
        data: {
          post: postID,
          author_name: name,
          author_email: email,
          content: comment
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //console.log(res.data)
          if (res.statusCode==201)
          {
            self.setData({
              'dialog.hidden': false,
              'dialog.title': '提示',
              'dialog.content': '评论成功',
              content:''

            });

            self.fetchCommentData(postID);            

          }
          else
          {

            if (res.data.code == 'rest_comment_login_required') {
              self.setData({
                'dialog.hidden': false,
                'dialog.title': '提示',
                'dialog.content': '需要开启在WordPress rest api 的匿名评论功能！'

              });
            }
            else if (res.data.code == 'rest_invalid_param' && res.data.message.indexOf('author_email' > 0)) {
              self.setData({
                'dialog.hidden': false,
                'dialog.title': '提示',
                'dialog.content': 'email填写错误！'

              });
            }
            else
            {
              self.setData({
                'dialog.hidden': false,
                'dialog.title': '提示',
                'dialog.content':'评论失败,错误原因:' +res.data.message

              });
            }

          } 
          
        },
        fail: function(res)
        {
          //console.log(res.data) 
        }
      });

    }
   
  },
  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  }
  

})
