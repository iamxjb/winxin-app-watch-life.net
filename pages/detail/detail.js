/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
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
    commentCount:0,
    detailDate:'',
    hidden: false,
    wxParseData:[]
  },
  onLoad: function (options) {
    this.fetchDetailData(options.id);
    this.fetchCommentData(options.id);
    
    
  },
  fetchDetailData: function (id) {
    var self = this;
    self.setData({
      hidden: false

    });
    wx.request({
      url: Api.getTopicByID(id, { mdrender: false }),
      success: function (response) {
        console.log(response);
        self.setData({ 
          detail: response.data, 
          detailDate: util.cutstr(response.data.date , 10, 1),           
         //wxParseData: WxParse('md',response.data.content.rendered)
          wxParseData: WxParse.wxParse('article', 'html', response.data.content.rendered, self, 5) 
       });
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);
      }
    });   
  },
  fetchCommentData: function (id) {
    var self = this;
    self.setData({
      hidden: false,
      commentsList: []
    });
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
          commentCount: response.data.length
        });
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);
      }
    });
  }

})
