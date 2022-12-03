/*
 * 
 * 微慕Plus微信小程序
 * author: jianbo
 * organization: 微慕Plus  www.minapper.com
 
 * 技术支持微信号：iamxjb
 
 *Copyright (c) 2019 https://www.minapper.com All rights reserved.
 */

var util = require('util.js');
var wxApi = require('wxApi.js')
var wxRequest = require('wxRequest.js')
var Api = require('api.js');
var app = getApp();

const Auth = {}

Auth.checkSession = function(appPage, flag) {
    let openid = wx.getStorageSync('openid');
    if (!openid) {
        if ('isLoginNow' == flag) {
            var userInfo = { avatarUrl: "../../images/gravatar.png", nickName: "登录", isLogin: false }
            appPage.setData({ isLoginPopup: true, userInfo: userInfo });
        }

    }
}
Auth.checkLogin = function(appPage) {
    let wxLoginInfo = wx.getStorageSync('wxLoginInfo');
    wx.checkSession({
        success: function() {
            if (!wxLoginInfo.js_code) {
                Auth.wxLogin().then(res => {
                    appPage.setData({ wxLoginInfo: res });
                    wx.setStorageSync('wxLoginInfo', res);
                    console.log('checkSession_success_wxLogins');
                })
            }
        },
        fail: function() {
            Auth.wxLogin().then(res => {
                appPage.setData({ wxLoginInfo: res });
                wx.setStorageSync('wxLoginInfo', res);
                console.log('checkSession_fail_wxLoginfo');
            })
        }
    })
}
Auth.checkAgreeGetUser = function(e, app, appPage, authFlag) {
    let wxLoginInfo = wx.getStorageSync('wxLoginInfo');
    if (wxLoginInfo.js_code) {
        Auth.agreeGetUser(e, wxLoginInfo, authFlag).then(res => {
            if (res.errcode == "") {
                wx.setStorageSync('userInfo', res.userInfo);
                wx.setStorageSync('openid', res.openid);
                wx.setStorageSync('userLevel', res.userLevel);
                wx.setStorageSync('userId', res.userId);
                appPage.setData({ openid: res.openid });
                appPage.setData({ userInfo: res.userInfo });
                appPage.setData({ userLevel: res.userLevel });
                appPage.setData({ userId: res.userId });

            }
            else {
                var userInfo = { avatarUrl: "../images/gravatar.png", nickName: "点击登录", isLogin: false }
                appPage.setData({ userInfo: userInfo });
                console.log("用户拒绝了授权");
            }
            appPage.setData({ isLoginPopup: false });

        })
    }
    else {
        console.log("登录失败");
        wx.showToast({
            title: '登录失败',
            mask: false,
            duration: 1000
        });

    }
}

Auth.agreeGetUser = function(e, wxLoginInfo, authFlag) {
    return new Promise(function(resolve, reject) {
        var js_code = wxLoginInfo.js_code;
        wx.showLoading({
            title: "正在登录...",
            mask: true
        })
        wx.getUserProfile({
            lang: 'zh_CN',
            desc: '登录后信息展示',
            success: (res) => {
                let wxUserInfo = res.userInfo || {}
                Auth.getUserInfo(wxUserInfo, js_code).then(resdata => {
                    resolve(resdata);
                    return;
                });
            },
            fail: (err) => {
                wx.hideLoading();
                if (authFlag == '0' && err.errMsg == 'getUserProfile:fail auth deny') {
                    args.errcode = e.detail.errMsg;
                    args.userInfo = { isLogin: false }
                    args.userSession = "";
                    resolve(args);
                    return;
                }

            }
        });

    })
}
Auth.getUserInfo = function(wxUserInfo, js_code) {
    return new Promise(function(resolve, reject) {
        var UserInfoData = {};
        var args = {};
        args.js_code = js_code;
        args.avatarUrl = wxUserInfo.avatarUrl;
        args.nickname = wxUserInfo.nickName;
        var url = Api.getOpenidUrl();
        var postOpenidRequest = wxRequest.postRequest(url, args);
        wx.hideLoading();
        postOpenidRequest.then(response => {
            if (response.data.status == '200') {
                console.log("授权登录获取成功");
                UserInfoData.openid = response.data.openid;
                var userLevel = {};
                if (response.data.userLevel) {
                    userLevel = response.data.userLevel;
                }
                else {
                    userLevel.level = "0";
                    userLevel.levelName = "订阅者";
                }
                var userInfo = {};
                userInfo.isLogin = true;
                userInfo.nickName = response.data.nickname
                userInfo.avatarUrl = response.data.avatarurl
                userInfo.enableUpdateAvatarCount = response.data.enableUpdateAvatarCount;
                UserInfoData.userInfo = userInfo;
                UserInfoData.userLevel = userLevel;
                UserInfoData.errcode = "";
                UserInfoData.userId = response.data.userId;
                resolve(UserInfoData);
                return;
            }
            else {
                UserInfoData.errcode = "error"
                resolve(UserInfoData);
                return;
            }

        })
    })
}


Auth.setUserInfoData = function(appPage) {
    if (!appPage.data.openid) {
        appPage.setData({
            userInfo: wx.getStorageSync('userInfo'),
            openid: wx.getStorageSync('openid'),
            userLevel: wx.getStorageSync('userLevel'),
            userId: wx.getStorageSync('userId')
        })

    }

}
Auth.wxLogin = function() {
    return new Promise(function(resolve, reject) {
        wx.login({
            success: function(res) {
                let args = {};
                args.js_code = res.code;
                resolve(args);
            },
            fail: function(err) {
                console.log(err);
                reject(err);
            }
        });
    })

}

Auth.logout = function(appPage) {
    appPage.setData({
        openid: '',
        userLevel: {},
        userInfo: {},
        wxLoginInfo: {}
    }
    )
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('openid');
    wx.removeStorageSync('userLevel');
    wx.removeStorageSync('wxLoginInfo');
}

Auth.loginType = function(appPage) {
    if (!appPage.data.inFinChat) {
        Auth.checkSession(appPage, 'isLoginNow');
    }
    else {
        wx.login({
            success: function(res) {
                let args = {};
                Auth.getFinChatUserInfo(res.userInfo,res.code,appPage)   
            },
            fail: function(err) {
                console.log(err);

            }
        });
    }
}

Auth.getFinChatUserInfo = function(wxUserInfo, js_code,appPage) {    
        var UserInfoData = {};
        var args = {};
        args.js_code = js_code;
        args.avatarUrl = wxUserInfo.avatarUrl;
        args.nickname = wxUserInfo.nickName;
        var url = Api.getOpenidUrl();
        var postOpenidRequest = wxRequest.postRequest(url, args);
        wx.hideLoading();
        postOpenidRequest.then(response => {
            if (response.data.status == '200') {
                console.log("授权登录获取成功");
                UserInfoData.openid = response.data.openid;
                var userLevel = {};
                if (response.data.userLevel) {
                    userLevel = response.data.userLevel;
                }
                else {
                    userLevel.level = "0";
                    userLevel.levelName = "订阅者";
                }
                var userInfo = {};
                userInfo.isLogin = true;
                userInfo.nickName = response.data.nickname
                userInfo.avatarUrl = response.data.avatarurl
                userInfo.enableUpdateAvatarCount = response.data.enableUpdateAvatarCount;             
                wx.setStorageSync('userInfo',userInfo);
                wx.setStorageSync('openid', response.data.openid);
                wx.setStorageSync('userLevel', userLevel);
                wx.setStorageSync('userId', response.data.userId);
                appPage.setData({ openid: response.data.openid });
                appPage.setData({ userInfo:userInfo });
                appPage.setData({ userLevel: userLevel });
                appPage.setData({ userId: response.data.userId });
                
            }
            else {
            
                
            }

        })


    
}



module.exports = Auth;