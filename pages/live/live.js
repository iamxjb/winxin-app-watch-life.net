/*
 * 微慕小程序
 * author: jianbo
 * organization:  微慕 www.minapper.com
 * 技术支持微信号：Jianbo
 * Copyright (c) 2018 https://www.minapper.com All rights reserved.
 */
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var wxRequest = require('../../utils/wxRequest.js')
import config from '../../utils/config.js'
var webSiteName = config.getWebsiteName;
const Adapter = require('../../utils/adapter.js')

Page({
  data: {
    room_info: [],
    getliveinfo: {},
    shareTitle: webSiteName + "-直播"
  },

  onLoad: function(options) {
    // 设置系统分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    })

    Adapter.setInterstitialAd("enable_live_interstitial_ad");
  },

  // 自定义分享朋友圈
  onShareTimeline: function() {
    return {
      title: this.data.shareTitle
    }
  },

  // 分享
  onShareAppMessage: function() {
    return {
      title: this.data.shareTitle,
      path: '/pages/live/live'
    }
  },

  onShow: function() {
    var self = this;
    self.setData({ room_info: [], getliveinfo: {} });
    var getLiveRequest = wxRequest.getRequest(Api.getliveinfo());
    getLiveRequest.then(res => {
      var room_info = res.data.room_info;
      var getliveinfo = res.data;
      self.setData({
        getliveinfo: getliveinfo,
        room_info: self.data.room_info.concat(
          room_info.map(function(item) {
            switch (item.live_status) {
              case 101:
                item.live_status_name = "直播中";
                break;
              case 102:
                item.live_status_name = "未开始";
                break;
              case 103:
                item.live_status_name = "已结束";
                break;
              case 104:
                item.live_status_name = "禁播";
                break;
              case 105:
                item.live_status_name = "暂停中";
                break;
              case 106:
                item.live_status_name = "异常";
                break;
              case 107:
                item.live_status_name = "已过期";
                break;
            }
            item.start_time_name = util.datefomate(
              item.start_time,
              "yyyy-MM-dd HH:mm:ss"
            );
            item.end_time_name = util.datefomate(
              item.end_time,
              "yyyy-MM-dd HH:mm:ss"
            );
            return item;
          })
        )
      });
    });
  },

  // 跳转
  redictLive(e) {
    var live_status = e.currentTarget.dataset.livestatus;
    var roomid = e.currentTarget.dataset.roomid;
    var livestatusname = e.currentTarget.dataset.livestatusname;
    //../../__plugin__/wx2b03c6e691cd7370/pages/live-player-plugin
    if (live_status == "101" || live_status == "102" || live_status == "103") {
      var url =
        "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=" +
        roomid;
      wx.navigateTo({
        url: url
      });
    } else {
      wx.showToast({
        title: "直播" + livestatusname,
        mask: false,
        icon: "none",
        duration: 1e3
      });
    }
  }
});
