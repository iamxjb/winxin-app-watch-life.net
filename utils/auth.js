/*
 * 
 * 微慕小程序开源版
 * author: jianbo
 * organization: 微慕  www.minapper.com
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 * Copyright (c) 2017  微慕 https://www.minapper.com All rights reserved.
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
                    if (res.errcode ==""){                    
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
                        wx.showModal({
                            title: '提示',
                            content: '登录失败,清除缓存重新登录?',
                            success (res) {
                              if (res.confirm) {
                                Auth.logout(appPage);            
                                Auth.checkLogin(appPage); 
                              
                              } else if (res.cancel) {
                                
                              }
                            }
                          })
                    
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
       wx.showLoading({
        title: "正在登录...",
        mask: true
       })
       wx.getUserProfile({
        lang: 'zh_CN',
        desc: '登录后信息展示',
        success: (res) => {
          let _userInfo = res.userInfo || {}
          //wx.setStorageSync('userInfo', userInfo)
  
          //userInfo.isLogin =true;
          args.avatarUrl=_userInfo.avatarUrl;
          args.nickname=_userInfo.nickName;
          //args.userInfo =userInfo;         
          var url = Api.webchatuserlogin();  
          var postOpenidRequest = wxRequest.postRequest(url, args);
            //获取openid
            wx.hideLoading();  
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
                    var userInfo={};
                    userInfo.isLogin =true;
                    userInfo.nickName=response.data.nickname
                    userInfo.avatarUrl=response.data.avatarurl
                    userInfo.enableUpdateAvatarCount=response.data.enableUpdateAvatarCount;
                    data.userInfo=userInfo;
                    data.userLevel=userLevel;
                    data.errcode="";
                    data.userId=  response.data.userId;                      
                    resolve(data);

                }
                else {
                    data.errcode = response.code;
                    data.message=  response.message;
                    resolve(args);
                }
            })
        },
        fail: (err) => {
            wx.hideLoading(); 
          if(authFlag=='0'  &&  err.errMsg=='getUserProfile:fail auth deny')
          {
             err.errMsg="用户拒绝了授权";
          }
            args.errcode=err.errMsg;
            args.userInfo={isLogin:false}
            args.userSession="";   
            wx.showToast({
                icon: 'none',
                title: err.errMsg || '登录错误，请稍后再试',
              })
            resolve(args);
          
        }
      });   
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