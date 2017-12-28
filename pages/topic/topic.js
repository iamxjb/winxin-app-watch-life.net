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
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')




Page({
  data:{
    text:"Page topic",
    categoriesList:{},
    floatDisplay:"none"
  },
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '守望轩-专题',
      success: function (res) {
        // success
      }
    });
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
   

    this.fetchCategoriesData();
  },
  //获取分类列表
  fetchCategoriesData: function () {
    var self = this;
    self.setData({
      categoriesList: []
    });

    //console.log(Api.getCategories());
    var getCategoriesRequest = wxRequest.getRequest(Api.getCategories());

    getCategoriesRequest.then(response =>{
        if (response.statusCode === 200)
        {
            self.setData({
                floatDisplay: "block",
                categoriesList: self.data.categoriesList.concat(response.data.map(function (item) {
                    if (typeof (item.category_thumbnail_image) == "undefined" || item.category_thumbnail_image == "") {
                        item.category_thumbnail_image = "../../images/website.png";

                    }
                    return item;
                })),
            });  
        }
        else
        {
            console.log(response);
        }
             
    }).catch(function (response) {
        console.log(response);

    })
    .finally(function () {
        setTimeout(function () {
            wx.hideLoading();
        }, 900)
        wx.hideNavigationBarLoading();

        })     
  },

  onShareAppMessage: function () {
    return {
        title: '分享“' + config.getWebsiteName +'”的专题栏目.',
      path: 'pages/topic/topic',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //跳转至某分类下的文章列表
  redictIndex: function (e) {
    //console.log('查看某类别下的文章');  
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.item;
    var url = '../list/list?categoryID=' + id;
    wx.navigateTo({
      url: url
    });
  }
  
})