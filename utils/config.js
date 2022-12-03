/*
 * 
 * 微慕小程序开源版
 * author: jianbo
 * organization: 微慕  www.minapper.com
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * Copyright (c) 2017  微慕 https://www.minapper.com All rights reserved.
 */



//配置域名,域名只修改此处。
//如果wordpress没有安装在网站根目录请加上目录路径,例如："www.watch-life.net/blog"
var DOMAIN = "www.watch-life.net";
var WEBSITENAME="守望轩"; //网站名称
var PAGECOUNT='10'; //每页文章数目
var WECHAT='微信号：iamxjb'; //客服联系方式,如 微信号：iamxjb 或 邮箱：iamxjb@sina.com

//是否启用小程序扫描二维码登录网站,  true 启用  false  不启用
//未安装微慕登录插件不要启用,插件下载地址：https://shops.minapper.com/2167.html
const enableScanLogin =false 
//////////////////////////////////////////////////////

//是否启用微慕视频号插件,  true 启用  false  不启用
//未安装微慕视频号插件不要启用,插件下载地址：https://shops.minapper.com/2192.html
const enableChannels =false 
//////////////////////////////////////////////////////

// 上传图片的最大文件大小,单位是m,必须填整数,
// 同时必须修改php.ini文件 post_max_size 和 upload_max_filesize 具体修改请自行搜索
const uploadImageSize=1

//小程序原始id
const appghId ='gh_e49213784fae'
//////////////////////////////////////////////////////

//微慕小程序端版本,请勿修改
const minapperVersion=4.61
const minapperSource="free"
//////////////////////////////////////////////////////

export default {
  getDomain: DOMAIN,
  getWebsiteName: WEBSITENAME,  
  getPageCount: PAGECOUNT,
  getWecat: WECHAT,
  enableScanLogin,
  minapperVersion,
  minapperSource,
  enableChannels,
  appghId
}