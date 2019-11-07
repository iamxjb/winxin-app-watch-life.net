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
var Auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js');
var webSiteName= config.getWebsiteName;
var domain =config.getDomain
var app = getApp();
Page({
    data: {
        text: "Page topic",
        categoriesList: {},
        floatDisplay: "none",
        openid:"",
        userInfo:{},
        webSiteName:webSiteName,
    domain:domain        
    },
    onLoad: function (options) {
        Auth.setUserInfoData(this); 
        Auth.checkLogin(this);
        wx.setNavigationBarTitle({
            title: '专题'
        });
        
        this.fetchCategoriesData();
        
    },
    onShow:function(){            

    },
    //获取分类列表
    fetchCategoriesData: function () {
        var self = this;        
        self.setData({
            categoriesList: []
        });
        //console.log(Api.getCategories());
        var getCategoriesIdsRequest = wxRequest.getRequest(Api.getCategoriesIds());
        getCategoriesIdsRequest.then(res=>{
            

            var ids="";
            var openid= self.data.openid
            if(!res.data.Ids=="")
            {
                ids=res.data.Ids;
            }
            var getCategoriesRequest = wxRequest.getRequest(Api.getCategories(ids,openid));
                getCategoriesRequest.then(response => {
                    if (response.statusCode === 200) {
                        self.setData({
                            floatDisplay: "block",
                            categoriesList: self.data.categoriesList.concat(response.data.map(function (item) {
                                if (typeof (item.category_thumbnail_image) == "undefined" || item.category_thumbnail_image == "") {
                                    item.category_thumbnail_image = "../../images/website.png";
                                
                                }
                                // item.subimg = "subscription.png";
                                return item;
                            })),
                        });
                    }
                    else {
                        console.log(response);
                    }

                    })
                    // .then(res=>{
                    //     if (self.data.openid) {                
                    //         setTimeout(function () {
                    //             self.getSubscription();
                    //         }, 500);  
                    //     }
                        
                    // })
                    .catch(function (response) {
                        console.log(response);

                    }).finally(function () {

                    })
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
    postsub: function (e) {
        var self = this;
        if (!self.data.openid) {
            Auth.checkSession(self,'isLoginNow');
        }
        else {
            var categoryid = e.currentTarget.dataset.id;
            var openid = self.data.openid;
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
                if (!('scope.userInfo' in authSetting)) {
                //if (util.isEmptyObject(authSetting)) {
                    console.log('第一次授权');
                    self.setData({ isLoginPopup: true })

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
                                                self.getUsreInfo(null);
                                            }
                                        }
                                    });
                                }
                            }
                        })
                    }
                    else {
                        auth.getUsreInfo(null);
                    }
                }
            }
        });
    },
    agreeGetUser: function (e) {        
        let self= this;
        Auth.checkAgreeGetUser(e,app,self,'0');   

        setTimeout(function () {
            self.fetchCategoriesData();             
        }, 1000);
        
    },
    closeLoginPopup() {
        this.setData({ isLoginPopup: false });
    },
    openLoginPopup() {
        this.setData({ isLoginPopup: true });
    },
    getOpenId(data) {
        var url = Api.getOpenidUrl();
        var self  = this;
        var postOpenidRequest = wxRequest.postRequest(url, data);
        //获取openid
        postOpenidRequest.then(response => {
            if (response.data.status == '200') {
                //console.log(response.data.openid)
                console.log("openid 获取成功");
                app.globalData.openid = response.data.openid;
                app.globalData.isGetOpenid = true;

            }
            else {
                console.log(response);
            }
        }).then(res=>{
            setTimeout(function () {
                self.getSubscription();               
            }, 500);
        })
    },
    confirm: function () {
        this.setData({
            'dialog.hidden': true,
            'dialog.title': '',
            'dialog.content': ''
        })
    } 

})