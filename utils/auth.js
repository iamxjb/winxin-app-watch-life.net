/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 */

var util = require('util.js');
var wxApi = require('wxApi.js')
var wxRequest = require('wxRequest.js')
var Api = require('api.js');
var app = getApp();
module.exports = {
    //获取用户信息和openid
    getUsreInfo: function (userInfoDetail) {       
        var wxLogin = wxApi.wxLogin();
        var jscode = '';
       
        wxLogin().then(response => {
            jscode = response.code
            if (userInfoDetail ==null)
            {
                var userInfo = wxApi.wxGetUserInfo();
                return userInfo();
            }
            else
            {                
                return userInfoDetail;
            }
            
            
        }).
            //获取用户信息
            then(response => {
                console.log(response.userInfo);
                console.log("成功获取用户信息(公开信息)");
                app.globalData.userInfo = response.userInfo;
                app.globalData.isGetUserInfo = true;

                var data = {
                    js_code: jscode,
                    encryptedData: response.encryptedData,
                    iv: response.iv,
                    avatarUrl: response.userInfo.avatarUrl,
                    nickname: response.userInfo.nickName
                }
                this.getOpenId(data);                              
            }).catch(function (error) {
                console.log('error: ' + error.errMsg);
            })
    },
    getOpenId(data)
    {
        var url = Api.getOpenidUrl();        
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
        }) 
    }

}