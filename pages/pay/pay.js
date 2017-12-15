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

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js');
var wxRequest = require('../../utils/wxRequest.js');
import config from '../../utils/config.js'

var app = getApp();
Page({
  data: {    
    prices: [
      6, 8, 18, 66, 88,188
    ],
    openid:'',
    postid:'',
    total_fee:'',
    template_id: config.getPayTemplateId,
    flag:'1'
  },

  /**
   * 进入页面
   */
  onLoad: function (options) { 

    var that=this;

    var openid = options.openid;
    var postid = options.postid;
    var flag = options.flag;

    that.setData({
      openid: openid,
      postid: postid,
      flag:flag
        });

  },
  cancel:function()
  {
    wx.navigateBack({
      delta: 1
    })
  },


  /**
   * 选中赞赏金额
   */
  selectItem: function (event) {
    var total_fee = event.currentTarget.dataset.item;
    var money = total_fee ;
    total_fee = total_fee*100;
    var that = this;    
    var url = Api.postPraiseUrl();
    var data = {
      openid: that.data.openid,
      total_fee: total_fee
    }
    var postLikeRequest = wxRequest.getRequest(url, data);
    postLikeRequest
      .then(response => {
        if (response.data) {
          var temp = response.data;
          wx.requestPayment({
            'timeStamp': response.data.timeStamp,
            'nonceStr': response.data.nonceStr,
            'package': response.data.package,
            'signType': 'MD5',
            'paySign': response.data.paySign,
            'success': function (res) {

              var url = Api.updatePraiseUrl();

              var data ={
                openid: app.globalData.openid,
                postid: that.data.postid,
                orderid: response.data.nonceStr,
                money: total_fee
              }
              var form_id = response.data.package;
              form_id = form_id.substring(10);
              
              var updatePraiseRequest = wxRequest.postRequest(url, data); //更新赞赏数据
              updatePraiseRequest
                .then(response => {
                  console.log(response.data.message);
                }).then(res => {
                  wx.showToast({
                    title: '谢谢赞赏！',
                    uration: 2000,
                    success: function () {
                        data =
                            {
                                openid: app.globalData.openid,
                                postid: that.data.postid,
                                template_id: that.data.template_id,
                                form_id: form_id,
                                total_fee: money,
                                flag: that.data.flag
                            };
                        url = Api.sendMessagesUrl();
                        var sendMessageRequest = wxRequest.postRequest(url, data);
                        sendMessageRequest.then(response => {
                            if (response.data.status == '200') {
                                console.log(response.data.message);
                                wx.navigateBack({
                                    delta: 1
                                })

                            }
                            else {
                                console.log(response.data.message);

                            }

                        });

                    }
                  });
                })            
              
            },
            'fail': function (res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'success'
              });
            },
            complete: function (res) {

              if (res.errMsg =='requestPayment:fail cancel')
              {
                wx.showToast({
                  title: '取消赞赏',
                  icon: 'success'
                });
              }
              
            }
          });
        }
        else {
          console.log(response.data.message);

        }
       })

    
  }
})
