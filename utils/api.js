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

var HOST_URI = 'https://www.watch-life.net/wp-json/wp/v2/';


module.exports = {
  // 获取文章列表数据
  getPosts: function (obj) {
    var url = HOST_URI + 'posts?per_page=8&page=' + obj.page;
    
    if (obj.categories != 0) {
      url += '&categories=' + obj.categories;
    }
    if (obj.search != '') {
      url += '&search=' + encodeURIComponent(obj.search);
    }   
    return url;

  },
  // 获取特定id的文章列表
  getPostsByIDs: function (obj) {
    var url = HOST_URI + 'posts?include=' + obj;

    return url;

  },
  // 获取内容页数据
  getPostByID: function (id, obj) {
    
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
    return HOST_URI + 'categories?per_page=50&orderby=count&order=desc'
  },
  //获取评论
  getComments: function (id, obj) {
    return HOST_URI + 'comments?orderby=date&order=asc&post=' + id
  },

  //获取最近的50个评论
  getRecentfiftyComments:function(){
    return HOST_URI + 'comments?per_page=30&orderby=date&order=desc'
  },

  //获取最近的50个评论
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
  }

};