/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 *  *Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 * 
 */


import config from '../../utils/config.js'
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js');
var wxRequest = require('../../utils/wxRequest.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: null,
        title: "",

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        //console.log(decodeURIComponent(options.url));
        console.log(options);
        if (options.url != null) {
            var url = decodeURIComponent(options.url);
            if (url.indexOf('*') != -1) {
                url = url.replace("*", "?");
            }
            self.setData({
                url: url
            });
            //   var slug = util.GetUrlFileName(options.url, domain);
            //   var domain = config.getDomain;
            //   var title = "";
            //   if (slug != 'index') {
            //       var getPostSlugRequest = wxRequest.getRequest(Api.getPostBySlug(slug));
            //       getPostSlugRequest
            //           .then(res => {
            //               if (res.statusCode == 200) {
            //                   if (res.data.length != 0) {
            //                       if (res.data[0].title.rendered) {
            //                           title = ':' + res.data[0].title.rendered;
            //                           self.setData({
            //                               title: title
            //                           });
            //                           console.log(title);
            //                       }
            //                   }
            //               }

            //           }) 
            //   }
        }
        else {
            self.setData({
                url: 'https://' + config.getDomain
            });
        }

    },
    onShareAppMessage: function (options) {
        var self = this;
        var url = options.webViewUrl;
        if (url.indexOf("?") != -1) {
            url = url.replace("?", "*");
        }
        url = 'pages/webpage/webpage?url=' + url;
        console.log(options.webViewUrl);
        return {
            title: '分享"' + config.getWebsiteName + '"的文章' + self.data.title,
            path: url,
            success: function (res) {
                // 转发成功
                console.log(url);
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})