/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 */

var DOMAIN = "www.watch-life.net";
var HOST_URI = 'https://' + DOMAIN+'/wp-json/wp/v2/';
var HOST_URI_WATCH_LIFE_JSON = 'https://' + DOMAIN + '/wp-json/watch-life-net/v1/';



module.exports = {

  getDomain:function()
  {
      return DOMAIN;
  },
  // 获取文章列表数据
  getPosts: function (obj) {
    var url = HOST_URI + 'posts?per_page=6&page=' + obj.page;
    
    if (obj.categories != 0) {
      url += '&categories=' + obj.categories;
    }
    if (obj.search != '') {
      url += '&search=' + encodeURIComponent(obj.search);
    }   
    return url;

  },

// 获取置顶的文章
  getStickyPosts: function () {
    var url = HOST_URI + 'posts?sticky=true&per_page=5&page=1';
    return url;

  },

  // 获取tag相关的文章列表
  getPostsByTags: function (id,tags) {
      var url = HOST_URI + 'posts?per_page=5&&page=1&exclude=' + id + "&tags=" + tags;

      return url;

  },


  // 获取特定id的文章列表
  getPostsByIDs: function (obj) {
    var url = HOST_URI + 'posts?include=' + obj;

    return url;

  },
  // 获取特定slug的文章内容
  getPostBySlug: function (obj) {
      var url = HOST_URI + 'posts?slug=' + obj;

      return url;

  },
  // 获取内容页数据
  getPostByID: function (id) {
    
    return HOST_URI + 'posts/' + id;
  },
  // 获取页面列表数据
  getPages: function () {
    
    return HOST_URI + 'pages';
  },

  // 获取页面列表数据
  getPageByID: function (id, obj) {
    return HOST_URI + 'pages/' + id;
  },
  //获取分类列表
  getCategories: function () {
    var url =HOST_URI + 'categories?per_page=100&orderby=count&order=desc';
    //var url = HOST_URI + 'categories?include=1,1059,98,416,189,374,6&orderby=count&order=desc';
    return url

  },
  //获取某个分类信息
  getCategoryByID: function (id) {
    var dd = HOST_URI + 'categories/' + id;
    return HOST_URI + 'categories/'+id;
  },
  //获取评论
  getComments: function (obj) {
    return HOST_URI + 'comments?parent=0&per_page=100&orderby=date&order=desc&post=' + obj.postID + '&page=' + obj.page
  },

  //获取回复
  getChildrenComments: function (obj) {
    var url= HOST_URI + 'comments?parent_exclude=0&per_page=100&orderby=date&order=desc&post=' + obj.postID
     return url;
  },


  //获取最近的30个评论
  getRecentfiftyComments:function(){
    return HOST_URI + 'comments?per_page=30&orderby=date&order=desc'
  },

  //提交评论
  postComment: function () {
    return HOST_URI + 'comments'
  },   

  //获取文章的第一个图片地址,如果没有给出默认图片
  getContentFirstImage: function (content){
    var regex = /<img.*?src=[\'"](.*?)[\'"].*?>/i;
    var arrReg = regex.exec(content);
    var src ="../../images/watch-life-logo-128.jpg";
    if(arrReg){   
      src=arrReg[1];
    }
    return src;  
  },

 //获取热点文章
  getTopHotPosts(flag){      
      var url = HOST_URI_WATCH_LIFE_JSON;
      if(flag ==1)
      {
          url +="post/hotpostthisyear"
      }
      else if(flag==2)
      {
          url += "post/hotpost"
      }

      return url;
  }
};