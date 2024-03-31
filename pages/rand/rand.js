/*
 * 
 * 微慕小程序开源版
 * author: jianbo
 * organization: 微慕  www.minapper.com
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * 
 *  *Copyright (c) 2017 https://www.minapper.com All rights reserved.
 */

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')
const Adapter = require('../../utils/adapter.js')
var webSiteName= config.getWebsiteName;
var domain =config.getDomain
import config from '../../utils/config.js'

Page({
  data: {
    title: '文章列表',
    postsList: {},  
    page: 1,
    search: '', 
    showerror:"none", 
    showallDisplay: "block",
    displaySwiper: "block",
    floatDisplay: "none",    
    webSiteName:webSiteName,
    domain:domain,
    articleStyle: config.articleStyle || 1
  },
  getArticleStyle() {
    const articleStyle = wx.getStorageSync('articleStyle') || config.articleStyle || 1
    this.setData({
      articleStyle: +articleStyle,
    })
  },
  onShow: function() {
    this.getArticleStyle()
  },
  
 
  onShareAppMessage: function () {
    var title = "分享“"+ webSiteName +"”的发现。";
    var path ="pages/rand/rand";
    return {
      title: title,
      path: path,
      appInfo:{
        'appId':config.appghId
      },
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
   // 自定义分享朋友圈
   onShareTimeline: function() {   
    return {
      title:  "“"+ webSiteName +"”的发现",
      path: 'pages/rand/rand' ,
      
    }
  }, 
  onShow: function() {
    this.fetchPostsData();
  },
  onLoad: function (options) {
    var self = this;
    wx.showShareMenu({
      withShareTicket: false,
      menus:['shareAppMessage','shareTimeline'],
            success:function(e)
            {
              //console.log(e);
            }
      })
    //this.fetchPostsData();
    Adapter.setInterstitialAd("enable_hot_interstitial_ad");
        
  },
  //获取文章列表数据
  fetchPostsData: function () {
    var self = this;  
    self.setData({
        postsList: []
    });
    
  
    var getRandPostsRequest = wxRequest.getRequest(Api.getRandPosts());
    getRandPostsRequest.then(response =>{
        if (response.statusCode === 200) {
            self.setData({
                showallDisplay: "block",
                floatDisplay: "block",
                postsList: self.data.postsList.concat(response.data.map(function (item) {
                    var strdate = item.post_date
                    if (item.post_thumbnail_image == null || item.post_thumbnail_image == '') {
                        item.post_thumbnail_image = '../../images/logo700.png';
                    }
                    item.post_date = util.cutstr(strdate, 10, 1);
                    return item;
                })),

            });

        } else if (response.statusCode === 404) { 

            // wx.showModal({
            //     title: '加载失败',
            //     content: '加载数据失败,可能缺少相应的数据',
            //     showCancel: false,
            // });

            console.log('加载数据失败,可能缺少相应的数据'); 
        }
    })
    .catch(function () {
        wx.hideLoading();
        if (data.page == 1) {

            self.setData({
                showerror: "block",
                floatDisplay: "block"
            });

        }
        else {
            // wx.showModal({
            //     title: '加载失败',
            //     content: '加载数据失败,请重试.',
            //     showCancel: false,
            // });
        }
    })
    .finally(function () {

        setTimeout(function () {
            wx.hideLoading();

        }, 1500);

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


})



