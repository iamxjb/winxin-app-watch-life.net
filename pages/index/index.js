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

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()

Page({
  data: {
    title: '文章列表',
    postsList: {},
    pagesList: {},
    categoriesList: {},
    hidden: false,
    page: 1,
    

    scrollHeight: 0,
    
    category: 0,
    //  侧滑菜单
    maskDisplay: 'none',
    slideHeight: 0,
    slideRight: 0,
    slideWidth: 0,
    slideDisplay: 'block',
    screenHeight: 0,
    screenWidth: 0,
    slideAnimation: {}
    //

  },

  onLoad: function (options) {
    this.fetchTopicData(options.id);
    this.fetchPagesData();
    this.fetchCategoriesData();
    var that = this;
    console.log('onLoad')
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    wx.getSystemInfo({
      success: function (res) {
        //console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight,
          //screenWidth: res.windowWidth,
          slideHeight: res.windowHeight,
          slideRight: res.windowWidth,
          slideWidth: res.windowWidth * 0.7
        });
      }
    });    
  },

  //获取文章列表数据
  fetchTopicData: function (categoryid,data) {
    var self = this;
    
    self.setData({
      hidden: false
    });
    if (!data) data = {};
    if (!data.page) data.page = 1;
    if (!data.category && !categoryid ) 
    {
      data.category = 0;
    }
    else
    {
      if (categoryid != 0) data.category = categoryid;
    }

    self.setData({
      category: data.category
    });
    
    if (data.page === 1) {
      self.setData({
        postsList: []
      });
    };
    //console.log(Api.getTopics(data));
    wx.request({
      url: Api.getTopics(data),
      success: function (response) {
        console.log(response);
        self.data.postsList;
        self.setData({
          //postsList: response.data
          postsList: self.data.postsList.concat(response.data.map(function (item) {
            var strSummary = util.removeHTML(item.content.rendered);
            var strdate = item.date
            item.summary = util.cutstr(strSummary, 200, 0);
            item.date = util.cutstr(strdate, 10, 1);
            return item;
          }))
        });
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 1200);
      }
    });
  },
  //获取页面列表
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
        }, 1200);
      }
    });
  },

  //获取分类列表
  fetchCategoriesData: function () {
    var self = this;
    wx.request({
      url: Api.getCategories(),
      success: function (response) {
        self.setData({
          categoriesList: response.data
        });
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 1200);        
      }
    });
  },

 // 跳转至查看文章详情
  redictDetail: function (e) {
    console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },

  //跳转至某分类下的文章列表
  redictIndex: function (e) {
    console.log('查看某类别下的文章');  
    var id = e.currentTarget.dataset.id,
      url = '../index/index?id=' + id;
    wx.navigateTo({
      url: url
    })
  },


  //浮动球移动事件
  ballMoveEvent: function (e) {
    var touchs = e.touches[0];
    var pageX = touchs.pageX;
    var pageY = touchs.pageY;
    if (pageX < 25) return;
    if (pageX > this.data.screenWidth - 25) return;
    if (this.data.screenHeight - pageY <= 25) return;
    if (pageY <= 25) return;
    var x = this.data.screenWidth - pageX - 25;
    var y = this.data.screenHeight - pageY - 25;
    this.setData({
      ballBottom: y,
      ballRight: x
    });
  },

  //浮动球点击 侧栏展开
  ballClickEvent: function () {
    slideUp.call(this);
  },

  //遮罩点击  侧栏关闭
  slideCloseEvent: function () {
    slideDown.call(this);
  },

  //底部刷新
  lower: function (e) {
    var self = this;
    self.setData({
      page: self.data.page + 1
    });
    console.log('当前页' + self.data.page);
    this.fetchTopicData(self.data.category, self.data);
  }


})

//侧栏展开
function slideUp() {
  var animation = wx.createAnimation({
    duration: 600
  });
  this.setData({ maskDisplay: 'block' });
  animation.translateX('100%').step();
  this.setData({
    slideAnimation: animation.export()
  });
}

//侧栏关闭
function slideDown() {
  var animation = wx.createAnimation({
    duration: 800
  });
  animation.translateX('-100%').step();
  this.setData({
    slideAnimation: animation.export()
  });
  this.setData({ maskDisplay: 'none' });
}

