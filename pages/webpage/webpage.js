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


Page({

  /**
   * 页面的初始数据
   */
  data: {
     url: 'https://'+config.getDomain
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var self= this;
      console.log(options.url);
      console.log(decodeURIComponent(options.url));
      var url = decodeURIComponent(options.url);
      
      if (options.url !=null)
      {
          self.setData({
              url: url
          });
      }
      

  },
  onShareAppMessage :function (res){
        var self =this;
        console.log(res.target);
        return {
            title: '分享"' + config.getWebsiteName + '"的文章',
            path: self.data.url,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }


        }
        
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})