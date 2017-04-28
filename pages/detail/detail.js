// posts.js
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    title: '文章内容',
    detail: {},
    pagesList: {},
    hidden: false,
    wxParseData:[]
  },
  onLoad: function (options) {
    this.fetchData(options.id),
    this.fetchPagesData()
  },
  fetchData: function (id) {
    var self = this;
    self.setData({
      hidden: false
    });
    wx.request({
      url: Api.getTopicByID(id, { mdrender: false }),
      success: function (response) {
        console.log(response);
        self.setData({
         detail:response.data,
         wxParseData: WxParse('md',response.data.content.rendered)
       });
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);
      }
    });   
  },
  fetchPagesData: function () {
    var self = this;       
    wx.request({
      url: Api.getPages(),
      success: function (response) {
        self.setData({
              pagesList: response.data 
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
