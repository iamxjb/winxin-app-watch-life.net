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




var DOMAIN = "www.watch-life.net";//配置域名,域名只修改此处
var WEBSITENAME="守望轩"; //网站名称
var ABOUTID= 1136; //wordpress网站关于页面的id
var PAGECOUNT='10'; //每页文章数目
var CATEGORIESID='all'  //显示全部的分类
//var CATEGORIESID = '1,1059,98,416,189,374,6,463';//指定显示的分类的id
var TEMPPLATEID = 'hzKpxuPF2rw7O-qTElkeoE0lMwr0O4t9PJkLyt6v8rk';//消息模版id


export default {
  getDomain: DOMAIN,
  getWebsiteName: WEBSITENAME,
  getAboutId: ABOUTID,
  getTemplateId: TEMPPLATEID,
  getPageCount: PAGECOUNT,
  getCategoriesID :CATEGORIESID

}