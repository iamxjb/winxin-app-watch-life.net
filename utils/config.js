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



//配置域名,域名只修改此处。
//如果wordpress没有安装在网站根目录请加上目录路径,例如："www.watch-life.net/blog"
var DOMAIN = "www.watch-life.net";
var WEBSITENAME="守望轩"; //网站名称
var ABOUTID = 1136; //wordpress网站"页面"的id,注意这个"页面"是wordpress的"页面"，不是"文章"
var PAGECOUNT='10'; //每页文章数目
var CATEGORIESID='all'  //显示全部的分类
//var CATEGORIESID = '1,1059,98,416,189,374,6,463';//指定显示的分类的id
var PAYTEMPPLATEID = 'hzKpxuPF2rw7O-qTElkeoE0lMwr0O4t9PJkLyt6v8rk';//赞赏消息模版id
var REPLAYTEMPPLATEID = 'IiAVoBWP34u1uwt801rI_Crgen7Xl2lvAGP67ofJLo8';//回复评论消息模版id
var INDEXNAV = [ //首页图标导航，'id' 为导航的Id，可以自定义，name'为名称，'image'为图标路径，'redirect'为跳转的页面
    { id: '1', name: '排行', image: '../../images/ranking.png', redirect: '../hot/hot' },
    {id: '2',name: '专题', image: '../../images/tar-topic.png', redirect: '../topic/topic'},
    
]

export default {
  getDomain: DOMAIN,
  getWebsiteName: WEBSITENAME,
  getAboutId: ABOUTID,
  getPayTemplateId: PAYTEMPPLATEID,
  getPageCount: PAGECOUNT,
  getCategoriesID :CATEGORIESID,
  getIndexNav: INDEXNAV,
  getReplayTemplateId: REPLAYTEMPPLATEID
}