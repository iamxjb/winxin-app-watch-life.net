// posts.js
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');


Page({
  data: {
    title: '话题列表',
    postsList: {},
    pagesList: {},
    hidden: false,
    page: 1,
    scrollHeight:0
  },
  onLoad: function () {
    this.fetchData();
    this.fetchPagesData();
    var that = this; 
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

  },
 
  fetchData: function (data) {
    var self = this;
    self.setData({
      hidden: false
    });
    if (!data) data = {};
    if (!data.page) data.page = 1;
    if (data.page === 1) {
      self.setData({
        postsList: []
      });
    };
     console.log(Api.getTopics(data));
    wx.request({
      url: Api.getTopics(data),
      success: function (response) {
        self.setData({
          //postsList: response.data
          postsList: self.data.postsList.concat(response.data.map(function (item) {
            var str = util.removeHTML(item.content.rendered);
            item.summary = util.cutstr(str, 200);
            return item;
          }))
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
  },
  redictDetail: function (e) {
    console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  lower: function (e) {
    var self = this;
    self.setData({
      page: self.data.page + 1
    });
     console.log('当前页'+ self.data.page);
    this.fetchData({page:self.data.page});
  }
})
