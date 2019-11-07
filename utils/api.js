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


import config from 'config.js';
var domain = config.getDomain;
var pageCount = config.getPageCount;
var categoriesID = config.getCategoriesID;

var HOST_URI = 'https://' + domain+'/wp-json/wp/v2/';
var HOST_URI_WATCH_LIFE_JSON = 'https://' + domain + '/wp-json/watch-life-net/v1/';
   
module.exports = {  
  // 获取文章列表数据
  getPosts: function (obj) {
      var url = HOST_URI + 'posts?per_page=' + pageCount+'&orderby=date&order=desc&page=' + obj.page;
    
    if (obj.categories != 0) {
      url += '&categories=' + obj.categories;
    }
    else if (obj.search != '') {
      url += '&search=' + encodeURIComponent(obj.search);
    }
        
    return url;

  },
  // 获取多个分类文章列表数据
  getPostsByCategories: function (categories) {
      var url = HOST_URI + 'posts?per_page=20&orderby=date&order=desc&page=1&categories=' + categories;
      return url;
  },
// 获取置顶的文章
  getStickyPosts: function () {
    var url = HOST_URI + 'posts?sticky=true&per_page=5&page=1';
    return url;

  },
 
  
  //获取首页滑动文章
  getSwiperPosts: function () {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url +='post/swipe';
      return url;
  },

  //获取是否开启评论的设置
  getEnableComment: function () {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += 'options/enableComment';
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
  getCategories: function (ids,openid) {
      var url ='';
      if (ids ==''){
          
          url = HOST_URI + 'categories?per_page=100&orderby=count&order=desc&openid='+openid;
      }
      else
      {
          url = HOST_URI + 'categories?include=' + ids+'&orderby=count&order=desc&openid='+openid;
 
      }
   
    return url
  },
  //获取某个分类信息
  getCategoryByID: function (id) {
    var dd = HOST_URI + 'categories/' + id;
    return HOST_URI + 'categories/'+id;
  },
  //获取某文章评论
  getComments: function (obj) {
    var url = HOST_URI + 'comments?per_page=100&orderby=date&order=asc&post=' + obj.postID + '&page=' + obj.page;
    return url;
  },

  //获取文章评论及其回复
  getCommentsReplay: function (obj) {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += 'comment/getcomments?postid=' + obj.postId + '&limit=' + obj.limit + '&page=' + obj.page + '&order=desc';
      return url;
  },
  //获取网站的最新20条评论
  getNewComments: function () {
      return HOST_URI + 'comments?parent=0&per_page=20&orderby=date&order=desc';
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

  //提交微信评论
  postWeixinComment: function () {
    var url = HOST_URI_WATCH_LIFE_JSON;
    return url + 'comment/add'
  }, 

  //获取微信评论
  getWeixinComment: function (openid) {
      var url = HOST_URI_WATCH_LIFE_JSON;
      return url + 'comment/get?openid=' + openid;
  },    

  //获取文章的第一个图片地址,如果没有给出默认图片
  getContentFirstImage: function (content){
    var regex = /<img.*?src=[\'"](.*?)[\'"].*?>/i;
    var arrReg = regex.exec(content);
    var src ="../../images/logo700.png";
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
          url += "post/pageviewsthisyear"
      }
      else if (flag == 3) {
          url += "post/likethisyear"
      }
      else if (flag == 4) {
          url += "post/praisethisyear"
      }

      return url;
  },

  //更新文章浏览数
  updatePageviews(id) {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "post/addpageview/"+id;
      return url;
  },
  //获取用户openid
  getOpenidUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "weixin/getopenid";
    return url;
  },

   //获取用户信息
   getUpdateUserInfo() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "weixin/updateuserinfo";
    return url;
  },

  //点赞
  postLikeUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/like";
    return url;
  },

  //判断当前用户是否点赞
  postIsLikeUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/islike";
    return url;
  },

  //获取我的点赞
  getMyLikeUrl(openid) {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "post/mylike?openid=" + openid;
      return url;
  },

  //鼓励,获取支付密钥
  postPraiseUrl() { 
    var url = HOST_URI_WATCH_LIFE_JSON;  
    url += "payment";
    return url;
  },

  //更新鼓励数据
  updatePraiseUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/praise";
    return url;
  },

  //获取我的鼓励数据
  getMyPraiseUrl(openid) {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "post/mypraise?openid=" + openid;
      return url;
  },

  //获取所有的鼓励数据
  getAllPraiseUrl() {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "post/allpraise";
      return url;
  },

  //发送模版消息
  sendMessagesUrl() {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "weixin/sendmessage";
      return url;
  },
  //获取订阅的分类
  getSubscription() {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "category/getsubscription";
      return url;
  },

  //订阅的分类
  postSubscription() {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "category/postsubscription";
      return url;
  },

  //删除订阅的分类
  delSubscription() {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "category/delSubscription";
      return url;
  },

  //生成海报
  creatPoster() {
      var url = HOST_URI_WATCH_LIFE_JSON;
      url += "weixin/qrcodeimg";
      return url;
  },
  //获取海报
  getPosterUrl() {
      var url = 'https://' + domain + "/wp-content/plugins/rest-api-to-miniprogram/poster/";
      return url;
  },
  //获取二维码
  getPosterQrcodeUrl() {
      var url = 'https://' + domain + "/wp-content/plugins/rest-api-to-miniprogram/qrcode/";
      return url;
  },
  getAboutPage(){
    var url = HOST_URI_WATCH_LIFE_JSON;
      url += "post/about";
      return url;

  },
  getCategoriesIds(){
    var url = HOST_URI_WATCH_LIFE_JSON;
      url += "category/ids";
      return url;

  }
};