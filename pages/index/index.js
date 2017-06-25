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


Page({
  data: {
    title: '文章列表',
    postsList: {},
    pagesList: {},
    categoriesList: {},
    postsShowSwiperList: {},


    isLastPage:false,
    
    page: 1,
    search: '',
    categories: 0,

    scrollHeight: 0,

    displayHeader:"none",
    displaySwiper: "block",
    floatDisplay: "none",


    //  侧滑菜单
    maskDisplay: 'none',
    slideHeight: 0,
    slideRight: 0,
    slideWidth: 0,
    slideDisplay: 'block',
    screenHeight: 0,
    screenWidth: 0,
    slideAnimation: {}


  },
  formSubmit: function (e) {
    var url = '../list/list'
    if (e.detail.value.input != '') {
      url = url + '?search=' + e.detail.value.input;
    }
    wx.navigateTo({
      url: url
    })
  },
  onShareAppMessage: function () {
    return {
      title: '“守望轩”网站微信小程序',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onReachBottom: function () {

    //console.log("xialajiazai");  
   
  },
  onLoad: function (options) {
    var self = this;
    if (options.categoryID && options.categoryID != 0) {
      self.setData({
        categories: options.categoryID
      })
    }
    if (options.search && options.search != '') {
      self.setData({
        search: options.search

      })
    }

    this.fetchTopFivePosts();
    

    wx.getSystemInfo({
      success: function (res) {
        //console.info(res.windowHeight);
        self.setData({
          scrollHeight: res.windowHeight,
          //screenWidth: res.windowWidth,
          slideHeight: res.windowHeight,
          slideRight: res.windowWidth,
          slideWidth: res.windowWidth * 0.7
        });
      }
    });
  },

  
  fetchTopFivePosts: function () {
    var self = this;
    self.setData({
      postsShowSwiperList: []
    });


    //先优先获取置顶的文章
    wx.request({
      url: Api.getStickyPosts(),
      success: function (response) {
        if (response.data.length > 0) {

          self.setData({
            postsShowSwiperList: self.data.postsShowSwiperList.concat(response.data.map(function (item) {
              item.firstImage = Api.getContentFirstImage(item.content.rendered);
              return item;
            }))
          });

          self.fetchPostsData(self.data);
        }

        else {
          self.setData({
            displaySwiper: "none",
            displayHeader:"block"

          });

          self.fetchPostsData(self.data);

        }


      },
      fail: function (response) {
        //var temp = response.data;

      }
    });





  },

  //获取文章列表数据
  fetchPostsData: function (data) {
    var self = this;

    
    if (!data) data = {};
    if (!data.page) data.page = 1;
    if (!data.categories) data.categories = 0;
    if (!data.search) data.search = '';
    if (data.page === 1) {
      self.setData({
        postsList: []
      });
    };

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: Api.getPosts(data),
      success: function (response) {

        if (response.statusCode === 200) {

          if (response.data.length<6)
          {
            self.setData({
              isLastPage: true
            });
          }

          //console.log(response);       
          self.setData({
            //postsList: response.data
           
            floatDisplay: "block",
            postsList: self.data.postsList.concat(response.data.map(function (item) {
              //var strSummary = util.removeHTML(item.content.rendered);
              // item.summary = util.cutstr(strSummary, 200, 0);
              var strdate = item.date
              item.firstImage = Api.getContentFirstImage(item.content.rendered);
              item.date = util.cutstr(strdate, 10, 1);
              return item;
            })),

          });


          if (data.page == 1) {
            
            self.fetchCategoriesData();
          }


          setTimeout(function () {
            wx.hideLoading();
            wx.showToast({
              title: '加载完毕',
              icon: 'success',
              duration: 900
            })
          }, 900)
         

        }
        else
        {

        
          if (response.data.code =="rest_post_invalid_page_number")
          {

            self.setData({
              isLastPage:true
            });
            wx.showToast({
              title: '没有更多内容',
              mask:false,
              duration: 1500
            });
          }
          else
          {
            wx.showToast({
              title: response.data.message,
              duration: 1500
            })
          }

          

        }



      }
    });
  },
  //底部刷新
  loadMore: function (e) {
    
    var self = this;
    if (!self.data.isLastPage)
    {
      self.setData({
        page: self.data.page + 1
      });
      console.log('当前页' + self.data.page);
      this.fetchPostsData(self.data);
    }
    else
    {
      wx.showToast({
        title: '没有更多内容',
        mask: false,
        duration: 1000
      });
    }
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
      }
    });
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

  //跳转至某分类下的文章列表
  redictIndex: function (e) {
    //console.log('查看某类别下的文章');  
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.item;
    var url = '../list/list?categoryID=' + id + '&categoryName=' + name;
    wx.navigateTo({
      url: url
    });
  },

  //跳转至某分类下的文章列表
  redictHome: function (e) {
    //console.log('查看某类别下的文章');  
    var id = e.currentTarget.dataset.id,
      url = '/pages/index/index';

    wx.switchTab({
      url: url
    });
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

