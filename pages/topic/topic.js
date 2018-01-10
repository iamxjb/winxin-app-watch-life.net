/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * 
 *  *Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 */
import config from '../../utils/config.js'
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js');
var app = getApp();
Page({
    data: {
        text: "Page topic",
        categoriesList: {},
        floatDisplay: "none"
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: config.getWebsiteName+'-专题',
            success: function (res) {
                // success
            }
        });
        wx.showLoading({
            title: '正在加载',
            mask: true
        })
        this.fetchCategoriesData();
    },
    //获取分类列表
    fetchCategoriesData: function () {
        var self = this;
        self.setData({
            categoriesList: []
        });
        //console.log(Api.getCategories());
        var getCategoriesRequest = wxRequest.getRequest(Api.getCategories());
        getCategoriesRequest.then(response => {
            if (response.statusCode === 200) {
                self.setData({
                    floatDisplay: "block",
                    categoriesList: self.data.categoriesList.concat(response.data.map(function (item) {
                        if (typeof (item.category_thumbnail_image) == "undefined" || item.category_thumbnail_image == "") {
                            item.category_thumbnail_image = "../../images/website.png";
                        
                        }
                        item.subimg = "subscription.png";
                        return item;
                    })),
                });
            }
            else {
                console.log(response);
            }

        })
        .then(res=>{
            if (!app.globalData.isGetOpenid) {
                self.getUsreInfo();
            }
            else
            {
                setTimeout(function () {
                    self.getSubscription();
                }, 500);

               

            }
        })
        .catch(function (response) {
            console.log(response);

        }).finally(function () {

            })
    },
    onShareAppMessage: function () {
        return {
            title: '分享“' + config.getWebsiteName + '”的专题栏目.',
            path: 'pages/topic/topic',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },    
    getUsreInfo: function () {
        var self = this;
        var wxLogin = wxApi.wxLogin();
        var jscode = '';
        wxLogin().then(response => {
            jscode = response.code
            var wxGetUserInfo = wxApi.wxGetUserInfo();
            return wxGetUserInfo()
        }).
            //获取用户信息
            then(response => {
                console.log(response.userInfo);
                console.log("成功获取用户信息(公开信息)");
                app.globalData.userInfo = response.userInfo;
                app.globalData.isGetUserInfo = true;
                var url = Api.getOpenidUrl();
                var data = {
                    js_code: jscode,
                    encryptedData: response.encryptedData,
                    iv: response.iv,
                    avatarUrl: response.userInfo.avatarUrl
                }
                var postOpenidRequest = wxRequest.postRequest(url, data);
                //获取openid
                postOpenidRequest.then(response => {
                    if (response.data.status == '200') {
                        //console.log(response.data.openid)
                        console.log("openid 获取成功");
                        app.globalData.openid = response.data.openid;
                        app.globalData.isGetOpenid = true;

                        setTimeout(function () {                            
                            self.getSubscription();
                        }, 500);
                       
                        
                    }
                    else {
                        console.log(response.data.message);
                    }
                })
            })
            .catch(function (error) {
                console.log('error: ' + error.errMsg);                
            })
    },
    getSubscription: function () {
        var self= this;
        if (app.globalData.isGetOpenid) {
            var url = Api.getSubscription() + '?openid=' + app.globalData.openid;
            var getSubscriptionRequest = wxRequest.getRequest(url);
            getSubscriptionRequest.then(res => {
                var catList = res.data.subscription;
                var categoriesList = self.data.categoriesList;
                var newCategoriesList = [];
                if (categoriesList)
                {
                    for (var i = 0; i < categoriesList.length; i++) {
                        var subimg = "subscription.png";
                        var subflag = "0";

                        for (var j = 0; j < catList.length; j++) {
                            if (categoriesList[i].id == catList[j]) {
                                subimg = "subscription-on.png";
                                subflag = "1";
                            }
                            var category_thumbnail_image = "";
                            if (typeof (categoriesList[i].category_thumbnail_image) == "undefined" || categoriesList[i].category_thumbnail_image == "") {
                                category_thumbnail_image = "../../images/website.png";
                            }
                            else {
                                category_thumbnail_image = categoriesList[i].category_thumbnail_image;
                            }

                        }
                        var cat = {
                            "category_thumbnail_image": category_thumbnail_image,
                            "description": categoriesList[i].description,
                            "name": categoriesList[i].name,
                            "id": categoriesList[i].id,
                            "subimg": subimg,
                            "subflag": subflag
                        }
                        newCategoriesList.push(cat);
                    }
                    if (newCategoriesList.length > 0) {
                        self.setData({
                            floatDisplay: "block",
                            categoriesList: newCategoriesList
                        });
                    }
                }
            }).finally(function () {
                setTimeout(function () {
                    wx.hideLoading();
                }, 500)
                wx.hideNavigationBarLoading();

            })
            
        }

    },
    postsub: function (e) {
        var self = this;
        if (!app.globalData.isGetOpenid) {
            self.userAuthorization();
        }
        else {
            var categoryid = e.currentTarget.dataset.id;
            var openid = app.globalData.openid;
            var url = Api.postSubscription();
            var subflag = e.currentTarget.dataset.subflag;
            var data = {
                categoryid: categoryid,
                openid: openid
            };

            var postSubscriptionRequest = wxRequest.postRequest(url, data);
            postSubscriptionRequest.then(response => {
                if (response.statusCode === 200) {
                    if (response.data.status == '200') {
                        setTimeout(function () {
                            wx.showToast({
                                title: '订阅成功',
                                icon: 'success',
                                duration: 900,
                                success: function () {

                                }
                            });
                        }, 900);
                        var subimg = "";
                        if (subflag == "0") {
                            subflag = "1";
                            subimg = "subscription-on.png"
                        }
                        else {
                            subflag = "0";
                            subimg = "subscription.png"
                        }
                        self.reloadData(categoryid, subflag, subimg);

                    }
                    else if (response.data.status == '201') {
                        setTimeout(function () {
                            wx.showToast({
                                title: '取消订阅成功',
                                icon: 'success',
                                duration: 900,
                                success: function () {
                                }
                            });
                        }, 900);
                        var subimg = "";
                        if (subflag == "0") {
                            subflag = "1";
                            subimg = "subscription-on.png"
                        }
                        else {
                            subflag = "0";
                            subimg = "subscription.png"
                        }
                        self.reloadData(categoryid, subflag, subimg);

                    }
                    else if (response.data.status == '501' || response.data.status == '501') {
                        console.log(response);
                    }


                }
                else {
                    setTimeout(function () {
                        wx.showToast({
                            title: '操作失败,请稍后重试',
                            icon: 'success',
                            duration: 900,
                            success: function () {

                            }
                        });
                    }, 900);
                    console.log(response);
                }

            }).catch(function (response) {
                setTimeout(function () {
                    wx.showToast({
                        title: '操作失败,请稍后重试',
                        icon: 'success',
                        duration: 900,
                        success: function () {
                        }
                    });
                }, 900);
                console.log(response);
            })
        }
    },
    reloadData: function (id, subflag, subimg) {
        var self = this;
        var newCategoriesList = [];
        var categoriesList = self.data.categoriesList;
        for (var i = 0; i < categoriesList.length; i++) {
            if (categoriesList[i].id == id) {
                categoriesList[i].subflag = subflag;
                categoriesList[i].subimg = subimg;
            }
            newCategoriesList.push(categoriesList[i]);
        }

        if (newCategoriesList.length > 0) {
            self.setData({
                categoriesList: newCategoriesList
            });

        }

    },

    //跳转至某分类下的文章列表
    redictIndex: function (e) {
        //console.log('查看某类别下的文章');  
        var id = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.item;
        var url = '../list/list?categoryID=' + id;
        wx.navigateTo({
            url: url
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
                                                self.getUsreInfo();
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
    },
    confirm: function () {
        this.setData({
            'dialog.hidden': true,
            'dialog.title': '',
            'dialog.content': ''
        })
    } 

})