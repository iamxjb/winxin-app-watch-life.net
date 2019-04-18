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

const Auth = {}

Auth.checkSession=function(appPage,flag)
    {
        let  openid =wx.getStorageSync('openid');
        if(!openid){
           if ('isLoginNow'==flag) {             
                var userInfo ={avatarUrl:"../../images/gravatar.png",nickName:"登录",isLogin:false}          
                appPage.setData({isLoginPopup: true,userInfo:userInfo});
            }
            
        }
    }
Auth.checkLogin=function(appPage){
        let wxLoginInfo =wx.getStorageSync('wxLoginInfo');    
        wx.checkSession({
              success: function(){
                if(!wxLoginInfo.js_code)
                {
                    Auth.wxLogin().then(res=>{              
                        appPage.setData({wxLoginInfo:res});
                        wx.setStorageSync('wxLoginInfo',res);                    
                        console.log('checkSession_success_wxLogins');
                    })  
                }
              },
              fail: function(){
                 Auth.wxLogin().then(res=>{              
                        appPage.setData({wxLoginInfo:res});
                        wx.setStorageSync('wxLoginInfo',res);
                        console.log('checkSession_fail_wxLoginfo');
                })
              }
        })
    }
Auth.checkAgreeGetUser=function(e,app,appPage,authFlag)
    {   
        let wxLoginInfo =wx.getStorageSync('wxLoginInfo');
        if(wxLoginInfo.js_code)
            {
                Auth.agreeGetUser(e,wxLoginInfo,authFlag).then(res=>{
                if (res.errcode==""){                    
                    wx.setStorageSync('userInfo',res.userInfo);
                    wx.setStorageSync('openid',res.openid);
                    wx.setStorageSync('userLevel',res.userLevel);
                    appPage.setData({openid:res.openid});
                    appPage.setData({userInfo:res.userInfo});
                    appPage.setData({userLevel:res.userLevel});                 
                   
                }
                else
                {
                    var userInfo ={avatarUrl:"../../images/gravatar.png",nickName:"点击登录",isLogin:false}
                    appPage.setData({userInfo:userInfo});
                    console.log("用户拒绝了授权");
                }
                appPage.setData({ isLoginPopup: false });

                })
            }
            else
            {
                console.log("登录失败");
                wx.showToast({
                    title: '登录失败',
                    mask: false,
                    duration: 1000
                });

            }
    }

Auth.agreeGetUser=function(e,wxLoginInfo,authFlag){
        return new Promise(function(resolve, reject) {
           let args={};
           let data={};        
           args.js_code =wxLoginInfo.js_code;
           if(authFlag=='0'  && e.detail.errMsg=='getUserInfo:fail auth deny'){
                args.errcode=e.detail.errMsg;
                args.userInfo={isLogin:false}
                args.userSession="";            
                resolve(args);
                return;
           } 
            var userInfoDetail = {};
            if(authFlag=='0')//未授权过,通过按钮授权
             {
                userInfoDetail = e.detail;
             }
            else if(authFlag=='1')//已经授权过，直接通过wx.getUserInfo获取
            {
              userInfoDetail = e;
            }
            if (userInfoDetail && userInfoDetail.userInfo){
                args.iv = userInfoDetail.iv;
                args.encryptedData = userInfoDetail.encryptedData;
                let userInfo =  userInfoDetail.userInfo;
                userInfo.isLogin =true;
                args.avatarUrl=userInfo.avatarUrl;
                args.nickname=userInfo.nickName;
                data.userInfo =userInfo;
                var url = Api.getOpenidUrl();        
                var postOpenidRequest = wxRequest.postRequest(url, args);
                //获取openid
                postOpenidRequest.then(response => {
                    if (response.data.status == '200') {
                        //console.log(response.data.openid)
                        console.log("授权登录获取成功");
                        data.openid= response.data.openid;
                        var userLevel={};
                        if(response.data.userLevel)
                        {
                            userLevel=response.data.userLevel;
                        }
                        else 
                        {
                            userLevel.level="0";
                            userLevel.levelName="订阅者";
                        }
                        data.userLevel=userLevel;
                        data.errcode="";                        
                        resolve(data);

                    }
                    else {
                        console.log(response);
                        reject(response);
                    }
                }).catch(function (error) {
                    console.log('error: ' + error);                        
                    reject(error);
                })

                // Auth.userLogin(args,api).then(userSession=>{
                //     args.userSession=userSession;
                //     args.errcode ="";
                //     resolve(args);
                // }).catch(function (error) {
                //     console.log('error: ' + error);                        
                //     reject(error);
                // })
            }
            else
            {
               args.errcode="error";
               args.userInfo={isLogin:false};
               args.userSession="";            
               resolve(args);
            }
        }) 
}
Auth.setUserInfoData = function(appPage)
{    
    if(!appPage.data.openid){
          appPage.setData({
            userInfo: wx.getStorageSync('userInfo'),
            openid:wx.getStorageSync('openid'),
            userLevel:wx.getStorageSync('userLevel')
        })
      
    }
    
}
Auth.wxLogin=function(){
        return new Promise(function (resolve, reject) {
            wx.login({
                success: function (res) {               
                    let args = {};
                    args.js_code = res.code;                                
                    resolve(args);                
                },
                fail: function (err) {
                    console.log(err);
                    reject(err);
                }
            });
        })

    }

Auth.logout=function(appPage){
    appPage.setData({
        openid:'',
        userLevel:{},
        userInfo:{},
        wxLoginInfo:{}
        }
    )
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('openid');
    wx.removeStorageSync('userLevel');
    wx.removeStorageSync('wxLoginInfo');
}

module.exports = Auth;