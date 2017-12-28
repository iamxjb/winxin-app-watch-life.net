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


import config from '../../utils/config.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
     url: null
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var self = this;
      console.log(decodeURIComponent(options.url));
      var url = decodeURIComponent(options.url);
      if (options.url != null) {

          self.setData({
              url: url
          });
      }
      else
      {
          self.setData({
              url: 'https://' + config.getDomain
          });

      }

  },
  onShow:function(options)
  {
  },
  onReady:function()
  {
      var self=this;
      var url = self.data.url;
      self.setData({
          url: url
      });


  },
  
  onShareAppMessage: function (options){
        var self =this;
        console.log(options.webViewUrl);
        var url = 'pages/webpage/webpage?url=' + options.webViewUrl;       
        return {
            title: '分享"' + config.getWebsiteName + '"的文章',
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