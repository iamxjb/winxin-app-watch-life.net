/*
 * 
 * 微慕小程序
 * author: jianbo
 * organization:  微慕 www.minapper.com 
 * 技术支持微信号：Jianbo
 * Copyright (c) 2018 https://www.minapper.com All rights reserved.
 */


var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')
import config from '../../utils/config.js'
var pageCount = config.getPageCount;
var webSiteName= config.getWebsiteName;
var domain =config.getDomain
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isArticlesList: true,
    listStyle: config.getListStyle,
    shareTitle: config.getWebsiteName,
    pageTitle: '搜索',
    articlesList: [],
    postype:"post",
    webSiteName:webSiteName,
    domain:domain
    
  
  },
  onShow:function()
  {
    this.setData({listStyle:wx.getStorageSync('listStyle')});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postype = 'post';
    if(options.postype)
    {

      postype =options.postype;

    }

    this.setData({postype:postype});
   
  
  },
  onReady:function(){
        wx.setNavigationBarTitle({ title: this.data.pageTitle })
    },


  onPullDownRefresh: function () {
        this.setData({
            isPull: true,
            isError: false,            
            isArticlesList: false,          
            articlesList: []
        })
        let args = {};
        args.page = 1;
        args.pageCount =pageCount;
        if (this.data.isSearch) {
            args.isSearch = true;
            args.isCategory = false;
            args.isTag=false;
            args.searchKey = this.data.searchKey;
        }
        if (this.data.isCategory) {
            args.isSearch = false;
            args.isCategory = true;
            args.isTag=false;
            args.categoryIds = this.data.categoryIds;
        }
        if (this.data.isTag) {
            args.isSearch = false;
            args.isCategory = false;
            args.isTag=true;
            args.tag = this.data.tag;
        }           
        Adapter.loadArticles(args, this, API,true);
    },
    onReachBottom: function () {
        let args = {};
        args.pageCount =pageCount;
        if (!this.data.isLastPage) {
            args.page = this.data.page + 1;
            if (this.data.isSearch) {
                args.isSearch = true;
                args.isCategory = false;
                args.isTag=false;
                args.searchKey = this.data.searchKey;
            }
            if (this.data.isCategory)
            {
                args.isSearch = false;
                args.isCategory = true;
                args.isTag=false;
                args.categoryIds = this.data.categoryIds;
            }
            if (this.data.isTag)
            {
                args.isSearch = false;
                args.isCategory = false;
                args.isTag=true
                args.tag = this.data.tag;
            }
            this.setData({
                page: args.page
            });
            Adapter.loadArticles(args, this, API);
        }
        else {
            console.log("最后一页了");
            // wx.showToast({
            //     title: '没有更多内容',
            //     mask: false,
            //     duration: 1000
            // });
        }
    },

    formSubmit: function (e) {
        var url = '../list/list'
        var key = '';
        if (e.currentTarget.id == "search-input") {
          key = e.detail.value;
        } else {
    
          key = e.detail.value.input;
    
        }
        if (key != '') {
          url = url + '?search=' + key;
          wx.navigateTo({
            url: url
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请输入内容',
            showCancel: false,
          });
        }
      },

//   formSubmit: function (e) {
//         var url = '../list/list'
//         var key = '';
//         if (e.currentTarget.id == "search-input") {
//             key = e.detail.value;
//         }
//         else {
//             key = e.detail.value.input;
//         }

//         var postype = this.data.postype;


//         var args={};
//         if (key != '') {

//         if(postype=="topic")
//         {
//             var url = '../sociallist/sociallist?searchKey='+key;
//             wx.navigateTo({
//               url: url
//             })

//         }else{

//             args.isSearch=true;
//             args.page=1;
//             args.pageCount=pageCount;
//             args.isCategory=false;
//             args.searchKey = key;            
//             this.setData({
//                 searchKey: key,
//                 isSearch:true,
//                 isCategory:false,
//                 isTag:false,
//                 articlesList:[]
                
//             }); 


//             Adapter.loadArticles(args, this, API); 
            
//         }



            
            
//         }
//         else {
//             wx.showModal({
//                 title: '提示',
//                 content: '请输入搜索内容',
//                 showCancel: false,
//             });
//         }
//     },

    // 跳转至查看文章详情
    redictDetail: function (e) {
        Adapter.redictDetail(e,"post");
    },

})