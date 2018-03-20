/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 * 
 */

// var Api = require('../../utils/api.js');
// var util = require('../../utils/util.js');
// var WxParse = require('../../wxParse/wxParse.js');
// var wxApi = require('../../utils/wxApi.js')
// var wxRequest = require('../../utils/wxRequest.js')
// var auth = require('../../utils/auth.js');
// import config from '../../utils/config.js'
// var app = getApp();

// Page({
//     data: {
//         posterImageUrl:"",
//         dialog: {
//             title: '',
//             content: '',
//             hidden: true
//         },



//     },
//     onLoad: function (options) {
//         var self = this;
        
//         wx.setNavigationBarTitle({
//             title: '海报',
//             success: function (res) {
//                 // success
//             }
//         });
//         self.setData({
//             posterImageUrl: options.posterImageUrl
//         });
        
        
//     }, 
//     savePosterImage:function()
//     {
//         var self=this;
//         wx.downloadFile({
//             url: self.data.posterImageUrl,
//             success: function (res) {
//                 wx.saveImageToPhotosAlbum({
//                     filePath: res.tempFilePath,
//                     success(result) {
//                         console.log(result)
//                         wx.showModal({
//                             title: '提示',
//                             content: '二维码海报已存入手机相册，赶快分享到朋友圈吧',
//                             showCancel: false,
//                             success: function (res) {
//                                 if (res.confirm) {
                                    
//                                     wx.navigateBack({
//                                         delta: 1
//                                     })
//                                 }
//                             }
//                         })
//                     }
//                 });
//             }, fail: function (res) {
//                 console.log(res)
//             }
//         });
//     },
//     posterImageClick:function(e){
//         var src = e.currentTarget.dataset.src;
//         wx.previewImage({
//             urls: [src],
//         });
//     },
//     userAuthorization: function () {
//         var self = this;
//         // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
//         wx.getSetting({
//             success: function success(res) {
//                 console.log(res.authSetting);
//                 var authSetting = res.authSetting;
//                 if (util.isEmptyObject(authSetting)) {
//                     console.log('第一次授权');
//                 } else {
//                     console.log('不是第一次授权', authSetting);
//                     // 没有授权的提醒
//                     if (authSetting['scope.userInfo'] === false) {
//                         wx.showModal({
//                             title: '用户未授权',
//                             content: '如需正常使用评论、点赞、赞赏等功能需授权获取用户信息。是否在授权管理中选中“用户信息”?',
//                             showCancel: true,
//                             cancelColor: '#296fd0',
//                             confirmColor: '#296fd0',
//                             confirmText: '设置权限',
//                             success: function (res) {
//                                 if (res.confirm) {
//                                     console.log('用户点击确定')
//                                     wx.openSetting({
//                                         success: function success(res) {
//                                             console.log('打开设置', res.authSetting);
//                                             var scopeUserInfo = res.authSetting["scope.userInfo"];
//                                             if (scopeUserInfo) {
//                                                 auth.getUsreInfo();
//                                             }
//                                         }
//                                     });
//                                 }
//                             }
//                         })
//                     }
//                 }
//             }
//         });
//     }
// })


var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')
var auth = require('../../utils/auth.js');
import config from '../../utils/config.js'
var app = getApp();

Page({
  data: {
    imagePath: "",
    logo: '../../images/logo-icon.png',
    dialog: {
      title: '',
      content: '',
      hidden: true
    }
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '海报',
      success: function (res) {
        // success
      }
    });
    this.createNewImg();//绘制图片

  },

  //将用户信息绘制到canvas
  setUserInfo: function (context) {
    var userName = "by " + app.globalData.userInfo.nickName;
    context.setFontSize(23);
    context.setFillStyle("#000000");
    context.setTextAlign('center');
    context.fillText(userName, 595, 800);
    this.circleImg(context, app.globalData.userInfo.avatarUrl, 550, 680, 45);//绘制用户圆角头像
    context.stroke();
  },

  //绘制圆角头像
  circleImg: function (ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
  },

  //绘制文字：文章题目、摘要、扫码阅读
  setTitle: function (context) {

    var Title = app.globalData.posterData.title;
    var Excerpt = app.globalData.posterData.excerpt;
    context.setFillStyle("#000000");
    context.setTextAlign('left');

    if (Title.length <= 14) {
      //14字以内绘制成一行，美观一点
      context.setFontSize(37);
      context.fillText(Title, 40, 430);
    }
    else {
      //题目字数很多的，只绘制前36个字（如果题目字数在15到18个字则也是一行，不怎么好看）
      context.setFontSize(29);
      context.fillText(Title.substring(0, 18), 40, 400);
      context.fillText(Title.substring(19, 36), 40, 450);
    }

    context.setFontSize(26);
    context.setTextAlign('left');
    context.setGlobalAlpha(0.7);

    for (var i = 0; i <= 80; i += 20) {
      //摘要只绘制前80个字，这里是用截取字符串
      context.fillText(Excerpt.substring(i, i + 20), 40, 510 + i * 2);
    }

    context.stroke();
    context.save();
  },


  //将canvas转换为图片保存到本地，然后将路径传给image图片的src
  createNewImg: function () {

    var that = this;
    var context = wx.createCanvasContext('mycanvas');

    context.setFillStyle('#ffffff');//填充背景色
    context.fillRect(0, 0, 600, 970);

    context.drawImage(app.globalData.posterData.firstImage, 0, 0, 600, 340);//绘制首图
    context.drawImage(app.globalData.posterData.qrcode, 90, 720, 180, 180);//绘制二维码
    context.drawImage(that.data.logo, 330, 720, 180, 180);//画logo

    const grd = context.createLinearGradient(30, 690, 570, 690)//定义一个线性渐变的颜色
    grd.addColorStop(0, 'black')
    grd.addColorStop(1, '#118fff')

    context.setFillStyle(grd)
    context.setFontSize(24);
    context.setTextAlign('center');
    context.fillText("长按小程序码阅读原文", 300, 940);

    context.setStrokeStyle(grd)
    context.beginPath()//分割线
    context.moveTo(30, 690)
    context.lineTo(570, 690)

    context.stroke();


    // this.setUserInfo(context);//用户信息

    this.setTitle(context);//文章标题

    context.draw();

    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          // console.log("临时图片：" + tempFilePath);

          that.setData({
            imagePath: tempFilePath,
            maskHidden: "none"
          });

        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 400);
  },

  savePosterImage: function () {
    var self = this;
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success(result) {
        console.log(result)
        wx.showModal({
          title: '提示',
          content: '二维码海报已存入手机相册，赶快分享到朋友圈吧',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    });
  },

  //预览图片有个bug,安卓手机二次预览本地图片会黑屏，因此我没用图片预览，采用点击图片保存到相册
  //反馈给腾讯依然没有解决，具体可以看下这个帖子： https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=167987449&docid=000862deb50f50463046e502054c00
  posterImageClick: function (e) {
    wx.previewImage({
      urls: [this.data.imagePath],
    });
  },

  userAuthorization: function () {
    var self = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (util.isEmptyObject(authSetting)) {
          console.log('第一次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用评论、点赞、赞赏等功能需授权获取用户信息。是否在授权管理中选中“用户信息”?',
              showCancel: true,
              cancelColor: '#296fd0',
              confirmColor: '#296fd0',
              confirmText: '设置权限',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('打开设置', res.authSetting);
                      var scopeUserInfo = res.authSetting["scope.userInfo"];
                      if (scopeUserInfo) {
                        auth.getUsreInfo();
                      }
                    }
                  });
                }
              }
            })
          }
        }
      }
    });
  }
})