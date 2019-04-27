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
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var Auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')

//const Zan = require('../../vendor/ZanUI/index')

var app = getApp();
let isFocusing = false
const pageCount = config.getPageCount;

import { ModalView } from '../../templates/modal-view/modal-view.js'
import Poster from '../../templates/components/wxa-plugin-canvas-poster/poster/poster';


Page({
    data: {
        title: '文章内容',
        detail: {},
        commentsList: [],
        ChildrenCommentsList: [],
        commentCount: '',
        detailDate: '',
        commentValue: '',
        wxParseData: {},
        display: 'none',
        showerror:'none',
        page: 1,
        isLastPage: false,
        parentID: "0",
        focus: false,
        placeholder: "评论...",
        postID: null,
        scrollHeight: 0,
        postList: [],
        link: '',
        dialog: {
            title: '',
            content: '',
            hidden: true
        },
        content: '',
        isShow: false,//控制menubox是否显示
        isLoad: true,//解决menubox执行一次  
        menuBackgroup: false,
        likeImag: "like.png",
        likeList: [],
        likeCount: 0,
        displayLike: 'none',
        replayTemplateId: config.getReplayTemplateId,
        userid: "",
        toFromId: "",
        commentdate: "",
        flag: 1,
        logo: config.getLogo,
        enableComment: true,
        isLoading:false,
        total_comments:0,        
        isLoginPopup:false,
        openid:"",
        userInfo:{},
        system:'',
        downloadFileDomain:config.getDownloadFileDomain

    },
    onLoad: function (options) {
        var self=this;
        self.getEnableComment();
        self.fetchDetailData(options.id);        
        Auth.setUserInfoData(self); 
        Auth.checkLogin(self);
        wx.getSystemInfo({
            success: function (t) {           
            var system = t.system.indexOf('iOS') != -1 ? 'iOS' : 'Android';
            self.setData({ system: system });
          }
        })

        
        new ModalView;

    },
    showLikeImg: function () {
        var self = this;
        var flag = false;
        var _likes = self.data.detail.avatarurls;
        if(!_likes){
            return;
        }
        
        var likes = [];
        for (var i = 0; i < _likes.length; i++) {
            var avatarurl = "../../images/gravatar.png";
            if (_likes[i].avatarurl.indexOf('wx.qlogo.cn') != -1) {
                avatarurl = _likes[i].avatarurl;
            }
            likes[i] = avatarurl;
        }
        var temp = likes;
        self.setData({
            likeList: likes
        });
    },
    onReachBottom: function () { 
        var self = this;
        if (!self.data.isLastPage) {            
            console.log('当前页' + self.data.page);            
            self.fetchCommentData();
            self.setData({
                page: self.data.page + 1,                
            });            
        }
        else
        {            
            console.log('评论已经是最后一页了');
        }
      
    },
    onShareAppMessage: function (res) {
        this.ShowHideMenu();
        console.log(res);
        return {
            title: '分享"' + config.getWebsiteName + '"的文章：' + this.data.detail.title.rendered,
            path: 'pages/detail/detail?id=' + this.data.detail.id,
            imageUrl: this.data.detail.post_thumbnail_image,
            success: function (res) {
                // 转发成功
                console.log(res);
            },
            fail: function (res) {
                console.log(res);
                // 转发失败
            }
        }
    },
    gotowebpage: function () {
        var self = this;
        self.ShowHideMenu();
        var minAppType = config.getMinAppType;
        var url = '';
        if (minAppType == "0") {
            var url = '../webpage/webpage';
            wx.navigateTo({
                url: url + '?url=' + self.data.link
            })
        }
        else {
            self.copyLink(self.data.link);
        }

    },
    copyLink: function (url) {
        //this.ShowHideMenu();
        wx.setClipboardData({
            data: url,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '链接已复制',
                            image: '../../images/link.png',
                            duration: 2000
                        })
                    }
                })
            }
        })
    },
    clickLike: function (e) {
        var id = e.target.id;
        var self = this;
        if (id == 'likebottom') {
            this.ShowHideMenu();
        }

        if (self.data.openid) {
            var data = {
                openid: self.data.openid,
                postid: self.data.postID
            };
            var url = Api.postLikeUrl();
            var postLikeRequest = wxRequest.postRequest(url, data);
            postLikeRequest
                .then(response => {
                    if (response.data.status == '200') {
                        var _likeList = []
                         var _like = self.data.userInfo.avatarUrl;
                        _likeList.push(_like);
                        var tempLikeList = _likeList.concat(self.data.likeList);
                        var _likeCount = parseInt(self.data.likeCount) + 1;
                        self.setData({
                            likeList: tempLikeList,
                            likeCount: _likeCount,
                            displayLike: 'block'
                        });
                        wx.showToast({
                            title: '谢谢点赞',
                            icon: 'success',
                            duration: 900,
                            success: function () {
                            }
                        })
                    }
                    else if (response.data.status == '501') {
                        console.log(response.data.message);
                        wx.showToast({
                            title: '谢谢，已赞过',
                            icon: 'success',
                            duration: 900,
                            success: function () {
                            }
                        })
                    }
                    else {
                        console.log(response.data.message);

                    }
                    self.setData({
                        likeImag: "like-on.png"
                    });
                })
        }
        else {
            Auth.checkSession(self,'isLoginNow');
            
        }
    },
    getIslike: function () { //判断当前用户是否点赞
        var self = this;
        if (self.data.openid) {
            var data = {
                openid: self.data.openid,
                postid: self.data.postID
            };
            var url = Api.postIsLikeUrl();
            var postIsLikeRequest = wxRequest.postRequest(url, data);
            postIsLikeRequest
                .then(response => {
                    if (response.data.status == '200') {
                        self.setData({
                            likeImag: "like-on.png"
                        });

                        console.log("已赞过");
                    }

                })

        }
    },

    goHome: function () {
        wx.switchTab({
            url: '../index/index'
        })
    },
    praise: function () {
        this.ShowHideMenu();
        var self = this;
        var minAppType = config.getMinAppType;
        var system  =self.data.system;
        if (minAppType == "0" && system=='Android') {
            if (self.data.openid) {

                wx.navigateTo({
                    url: '../pay/pay?flag=1&openid=' + self.data.openid + '&postid=' + self.data.postID
                })
            }
            else {
                Auth.checkSession(self,'isLoginNow');
            }
        }
        else {

            var src = config.getZanImageUrl;
            wx.previewImage({
                urls: [src],
            });

        }
    },

    //获取是否开启评论设置
    getEnableComment: function (id) {
        var self = this;
        var getEnableCommentRequest = wxRequest.getRequest(Api.getEnableComment());
        getEnableCommentRequest
            .then(response => {
                if (response.data.enableComment != null && response.data.enableComment != '') {
                    if (response.data.enableComment === "1") {
                        self.setData({
                            enableComment: true
                        });
                    }
                    else {
                        self.setData({
                            enableComment: false
                        });
                    }

                };

            });
    },
    //获取文章内容
    fetchDetailData: function (id) {
        var self = this;
        var getPostDetailRequest = wxRequest.getRequest(Api.getPostByID(id));
        var res;
        var _displayLike = 'none';
        getPostDetailRequest
            .then(response => {
                res = response;
                if(response.data.code  && (response.data.data.status=="404"))
                {
                    self.setData({
                        showerror:'block',
                        display: 'none',
                        errMessage:response.data.message   
                    });

                    return false;

                }
                wx.setNavigationBarTitle({
                    title: res.data.title.rendered
                });
                WxParse.wxParse('article', 'html', response.data.content.rendered, self, 5);
                if (response.data.total_comments != null && response.data.total_comments != '') {
                    self.setData({
                        commentCount: "有" + response.data.total_comments + "条评论"
                    });
                };
                var _likeCount = response.data.like_count;
                if (response.data.like_count != '0') {
                    _displayLike = "block"
                }
                
                self.setData({
                    detail: response.data,
                    likeCount: _likeCount,
                    postID: id,
                    link: response.data.link,
                    detailDate: util.cutstr(response.data.date, 10, 1),
                    //wxParseData: WxParse('md',response.data.content.rendered)
                    //wxParseData: WxParse.wxParse('article', 'html', response.data.content.rendered, self, 5),
                    display: 'block',
                    displayLike: _displayLike,
                    total_comments: response.data.total_comments,
                    postImageUrl:response.data.postImageUrl

                });
                // 调用API从本地缓存中获取阅读记录并记录
                var logs = wx.getStorageSync('readLogs') || [];
                // 过滤重复值
                if (logs.length > 0) {
                    logs = logs.filter(function (log) {
                        return log[0] !== id;
                    });
                }
                // 如果超过指定数量
                if (logs.length > 19) {
                    logs.pop();//去除最后一个
                }
                logs.unshift([id, response.data.title.rendered]);
                wx.setStorageSync('readLogs', logs);
                //end 

            })
            .then(response => {
                

            })
            .then(response => {
                var tagsArr = [];
                tagsArr = res.data.tags
                if(!tagsArr)
                {
                    return false;
                }
                var tags = "";
                for (var i = 0; i < tagsArr.length; i++) {
                    if (i == 0) {
                        tags += tagsArr[i];
                    }
                    else {
                        tags += "," + tagsArr[i];

                    }
                }
                if (tags != "") {
                    var getPostTagsRequest = wxRequest.getRequest(Api.getPostsByTags(id, tags));
                    getPostTagsRequest
                        .then(response => {
                            self.setData({
                                postList: response.data
                            });

                        })

                }
            }).then(response => {//获取点赞记录
                self.showLikeImg();
            }).then(resonse => {
                if (self.data.openid) {
                   Auth.checkSession(self,'isLoginLater');
                }

            }).then(response => {//获取是否已经点赞
                if (self.data.openid) {
                    self.getIslike();
                }
            })
            .catch(function (error) {
               console.log('error: ' + error);

            })
            


    },
    //给a标签添加跳转和复制链接事件
    wxParseTagATap: function (e) {
        var self = this;
        var href = e.currentTarget.dataset.src;
        console.log(href);
        var domain = config.getDomain;
        //可以在这里进行一些路由处理
        if (href.indexOf(domain) == -1) {
            wx.setClipboardData({
                data: href,
                success: function (res) {
                    wx.getClipboardData({
                        success: function (res) {
                            wx.showToast({
                                title: '链接已复制',
                                //icon: 'success',
                                image: '../../images/link.png',
                                duration: 2000
                            })
                        }
                    })
                }
            })
        }
        else {
            var slug = util.GetUrlFileName(href, domain);
            if (slug == 'index') {
                wx.switchTab({
                    url: '../index/index'
                })
            }
            else {
                var getPostSlugRequest = wxRequest.getRequest(Api.getPostBySlug(slug));
                getPostSlugRequest
                    .then(res => {
                        if (res.statusCode == 200) {
                            if (res.data.length != 0) {
                                var postID = res.data[0].id;
                                var openLinkCount = wx.getStorageSync('openLinkCount') || 0;
                                if (openLinkCount > 4) {
                                    wx.redirectTo({
                                        url: '../detail/detail?id=' + postID
                                    })
                                }
                                else {
                                    wx.navigateTo({
                                        url: '../detail/detail?id=' + postID
                                    })
                                    openLinkCount++;
                                    wx.setStorageSync('openLinkCount', openLinkCount);
                                }
                            }
                            else {
                                var minAppType = config.getMinAppType;
                                var url = '../webpage/webpage'
                                if (minAppType == "0") {
                                    url = '../webpage/webpage';
                                    wx.navigateTo({
                                        url: url + '?url=' + href
                                    })
                                }
                                else {
                                    self.copyLink(href);
                                }


                            }

                        }

                    }).catch(res => {
                        console.log(response.data.message);
                    })
            }
        }

    },
    //获取评论
    fetchCommentData: function () {
        var self=this;
        let args = {};
        args.postId = self.data.postID;
        args.limit = pageCount;
        args.page = self.data.page;
        self.setData({ isLoading: true })
        var getCommentsRequest = wxRequest.getRequest(Api.getCommentsReplay(args));
        getCommentsRequest
            .then(response => {
                if (response.statusCode == 200) {
                    if (response.data.data.length < pageCount) {
                        self.setData({
                            isLastPage: true
                        });
                    }
                    if (response.data) {
                        self.setData({                            
                            commentsList: [].concat(self.data.commentsList, response.data.data)
                        });
                    }

                }

            }) 
            .catch(response => {
                console.log(response.data.message);
                
            }).finally(function () {

                self.setData({
                    isLoading: false
                });

            });     
    },
    //显示或隐藏功能菜单
    ShowHideMenu: function () {
        this.setData({
            isShow: !this.data.isShow,
            isLoad: false,
            menuBackgroup: !this.data.false
        })
    },
    //点击非评论区隐藏功能菜单
    hiddenMenubox: function () {
        this.setData({
            isShow: false,
            menuBackgroup: false
        })
    },
    //底部刷新
    loadMore: function (e) {
        var self = this;
        if (!self.data.isLastPage) {
            self.setData({
                page: self.data.page + 1
            });
            console.log('当前页' + self.data.page);
            this.fetchCommentData();
        }
        else {
            wx.showToast({
                title: '没有更多内容',
                mask: false,
                duration: 1000
            });
        }
    },
    replay: function (e) {
        var self = this;
        var id = e.target.dataset.id;
        var name = e.target.dataset.name;
        var userid = e.target.dataset.userid;
        var toFromId = e.target.dataset.formid;
        var commentdate = e.target.dataset.commentdate;
        isFocusing = true;
        if (self.data.enableComment=="1")
        {
            self.setData({
                parentID: id,
                placeholder: "回复" + name + ":",
                focus: true,
                userid: userid,
                toFromId: toFromId,
                commentdate: commentdate
            });

        }        
       // console.log('toFromId', toFromId);
       // console.log('replay', isFocusing);
    },
    onReplyBlur: function (e) {
        var self = this;
       // console.log('onReplyBlur', isFocusing);
        if (!isFocusing) {
            {
                const text = e.detail.value.trim();
                if (text === '') {
                    self.setData({
                        parentID: "0",
                        placeholder: "评论...",
                        userid: "",
                        toFromId: "",
                        commentdate: ""
                    });
                }

            }
        }
       // console.log(isFocusing);
    },
    onRepleyFocus: function (e) {
        var self = this;
        isFocusing = false;
        //console.log('onRepleyFocus', isFocusing);
        if (!self.data.focus) {
            self.setData({ focus: true })
        }


    },
    //提交评论
    formSubmit: function (e) {
        var self = this;
        var comment = e.detail.value.inputComment;
        var parent = self.data.parentID;
        var postID = e.detail.value.inputPostID;
        var formId = e.detail.formId;
        if(formId =="the formId is a mock one")
        {
            formId="";

        }
        var userid = self.data.userid;
        var toFromId = self.data.toFromId;
        var commentdate = self.data.commentdate;
        if (comment.length === 0) {
            self.setData({
                'dialog.hidden': false,
                'dialog.title': '提示',
                'dialog.content': '没有填写评论内容。'

            });
        }
        else {
            if (self.data.openid) {
                var name = self.data.userInfo.nickName;
                var author_url = self.data.userInfo.avatarUrl;
                var email = self.data.openid + "@qq.com";
                var openid = self.data.openid;
                var fromUser = self.data.userInfo.nickName;                
                var data = {
                    post: postID,
                    author_name: name,
                    author_email: email,
                    content: comment,
                    author_url: author_url,
                    parent: parent,
                    openid: openid,
                    userid: userid,
                    formId: formId
                };
                var url = Api.postWeixinComment();
                var postCommentRequest = wxRequest.postRequest(url, data);
                var postCommentMessage="";
                postCommentRequest
                    .then(res => {
                        console.log(res)
                        if (res.statusCode == 200) {
                            if (res.data.status == '200') {
                                self.setData({
                                    content: '',
                                    parentID: "0",
                                    userid: 0,
                                    placeholder: "评论...",
                                    focus: false,
                                    commentsList: []

                                });                                
                                postCommentMessage=res.data.message;
                                if (parent != "0" && !util.getDateOut(commentdate) && toFromId != "") {
                                    var useropenid = res.data.useropenid;                                    
                                    var data =
                                        {
                                            openid: useropenid,
                                            postid: postID,
                                            template_id: self.data.replayTemplateId,
                                            form_id: toFromId,
                                            total_fee: comment,
                                            fromUser: fromUser,
                                            flag: 3,
                                            parent: parent
                                        };

                                    url = Api.sendMessagesUrl();
                                    var sendMessageRequest = wxRequest.postRequest(url, data);
                                    sendMessageRequest.then(response => {
                                        if (response.data.status == '200') {
                                            //console.log(response.data.message);
                                        }
                                        else {
                                            console.log(response.data.message);

                                        }

                                    });

                                }                               
                                var commentCounts = parseInt(self.data.total_comments)+1;                                
                                self.setData({
                                    total_comments:commentCounts,                                   
                                    commentCount: "有" + commentCounts + "条评论"                                   
                                    
                                    });                                                              
                            }
                            else if (res.data.status == '500') {
                                self.setData({
                                    'dialog.hidden': false,
                                    'dialog.title': '提示',
                                    'dialog.content': '评论失败，请稍后重试。'

                                });
                            }
                        }
                        else {

                            if (res.data.code == 'rest_comment_login_required') {
                                self.setData({
                                    'dialog.hidden': false,
                                    'dialog.title': '提示',
                                    'dialog.content': '需要开启在WordPress rest api 的匿名评论功能！'

                                });
                            }
                            else if (res.data.code == 'rest_invalid_param' && res.data.message.indexOf('author_email') > 0) {
                                self.setData({
                                    'dialog.hidden': false,
                                    'dialog.title': '提示',
                                    'dialog.content': 'email填写错误！'

                                });
                            }
                            else {
                                console.log(res)
                                self.setData({
                                    'dialog.hidden': false,
                                    'dialog.title': '提示',
                                    'dialog.content': '评论失败,' + res.data.message

                                });
                            }
                        }
                    }).then(response =>{                    
                        //self.fetchCommentData(self.data); 
                        self.setData(
                            {
                                page:1,
                                commentsList:[],
                                isLastPage:false

                            }
                        )
                        self.onReachBottom();
                        //self.fetchCommentData();
                        setTimeout(function () {                           
                            wx.showToast({
                                title: postCommentMessage,
                                icon: 'none',
                                duration: 900,
                                success: function () {
                                }
                            })                            
                        }, 900); 
                    }).catch(response => {
                        console.log(response)
                        self.setData({
                            'dialog.hidden': false,
                            'dialog.title': '提示',
                            'dialog.content': '评论失败,' + response

                        });
                    })
            }
            else {
                Auth.checkSession(self,'isLoginNow');                

            }

        }

    },    
    agreeGetUser:function(e)
    {
       let self= this;
        Auth.checkAgreeGetUser(e,app,self,'0');;
        
    },
    closeLoginPopup() {
        this.setData({ isLoginPopup: false });
    },
    openLoginPopup() {
        this.setData({ isLoginPopup: true });
    },
    confirm: function () {
        this.setData({
            'dialog.hidden': true,
            'dialog.title': '',
            'dialog.content': ''
        })
    },    
    downimageTolocal: function () {
        var self = this;
        self.ShowHideMenu();
        // wx.showLoading({
        //     title: "正在生成海报",
        //     mask: true,
        // });
        var postid = self.data.detail.id;
        var title = self.data.detail.title.rendered;
        var path = "pages/detail/detail?id=" + postid;
        var excerpt = util.removeHTML(self.data.detail.excerpt.rendered);
        var postImageUrl = "";
        var posterImagePath = "";
        var qrcodeImagePath = "";
        var flag = false;
        var imageInlocalFlag = false;
        var domain = config.getDomain;
        var downloadFileDomain = config.getDownloadFileDomain;

        var fristImage = self.data.detail.post_medium_image; 

        //获取文章首图临时地址，若没有就用默认的图片,如果图片不是request域名，使用本地图片
        if (fristImage) {
            var n = 0;
            for (var i = 0; i < downloadFileDomain.length;i++)
            {
                
                if(fristImage.indexOf(downloadFileDomain[i].domain) != -1)
                {
                    n++;                   
                    break;
                }
            }
            if(n>0)
            {
                imageInlocalFlag = false;
                postImageUrl = fristImage;

            }
            else{
                postImageUrl = config.getPostImageUrl;
                posterImagePath = postImageUrl;
                imageInlocalFlag = true;
            }
            
        }
        else {
            postImageUrl = config.getPostImageUrl;
            posterImagePath = postImageUrl;
            imageInlocalFlag=true;
        }

        console.log(postImageUrl);                   
        var data = {
            postid: postid,                
            path: path               
            
        };
        var url = Api.creatPoster();
        var qrcodeUrl = "";
        var posterQrcodeUrl = Api.getPosterQrcodeUrl() + "qrcode-" + postid + ".png";
        //生成二维码
        var creatPosterRequest = wxRequest.postRequest(url, data);
        creatPosterRequest.then(response => {
            if (response.statusCode == 200) {
                if (response.data.status == '200') {
                    const downloadTaskQrcodeImage = wx.downloadFile({
                        url: posterQrcodeUrl,
                        success: res => {
                            if (res.statusCode === 200) {
                                qrcodeImagePath = res.tempFilePath;
                                console.log("二维码图片本地位置：" + res.tempFilePath);
                                if (!imageInlocalFlag) {
                                    const downloadTaskForPostImage = wx.downloadFile({
                                        url: postImageUrl,
                                        success: res => {
                                            if (res.statusCode === 200) {
                                                posterImagePath = res.tempFilePath;
                                                console.log("文章图片本地位置：" + res.tempFilePath);
                                                flag = true;
                                                if (posterImagePath && qrcodeImagePath) {
                                                    self.createPosterLocal(posterImagePath, qrcodeImagePath, title, excerpt);
                                                }
                                            }
                                            else {
                                                console.log(res);
                                                wx.hideLoading();
                                                wx.showToast({
                                                    title: "生成海报失败...",
                                                    mask: true,
                                                    duration: 2000
                                                });
                                                return false;


                                            }
                                        }
                                    });
                                    downloadTaskForPostImage.onProgressUpdate((res) => {
                                        console.log('下载文章图片进度：' + res.progress)

                                    })
                                }
                                else {
                                    if (posterImagePath && qrcodeImagePath) {
                                        self.createPosterLocal(posterImagePath, qrcodeImagePath, title, excerpt);
                                    }
                                }
                            }
                            else {
                                console.log(res);
                                //wx.hideLoading();
                                flag = false;
                                wx.showToast({
                                    title: "生成海报失败...",
                                    mask: true,
                                    duration: 2000
                                });
                                return false;
                            }
                        }
                    });
                    downloadTaskQrcodeImage.onProgressUpdate((res) => {
                        console.log('下载二维码进度', res.progress)
                    })
                }
                else {
                    console.log(response);
                    //wx.hideLoading();
                    flag = false;
                    wx.showToast({
                        title: "生成海报失败...",
                        mask: true,
                        duration: 2000
                    });
                    return false;
                }
            }
            else {
                console.log(response);
                //wx.hideLoading();
                flag = false;
                wx.showToast({
                    title: "生成海报失败...",
                    mask: true,
                    duration: 2000
                });
                return false;
            }

        });
        

    },
    //将canvas转换为图片保存到本地，然后将路径传给image图片的src
    createPosterLocal: function (postImageLocal, qrcodeLoal, title, excerpt) {
        var that = this;
        wx.showLoading({
            title: "正在生成海报",
            mask: true,
        });
        var context = wx.createCanvasContext('mycanvas');
        context.setFillStyle('#ffffff');//填充背景色
        context.fillRect(0, 0, 600, 970);
        context.drawImage(postImageLocal, 0, 0, 600, 400);//绘制首图
        context.drawImage(qrcodeLoal, 210, 670, 180, 180);//绘制二维码
        //context.drawImage(that.data.logo, 350, 740, 130, 130);//画logo
        //const grd = context.createLinearGradient(30, 690, 570, 690)//定义一个线性渐变的颜色
        //grd.addColorStop(0, 'black')
        //grd.addColorStop(1, '#118fff')
        //context.setFillStyle(grd)
        context.setFillStyle("#959595");
        context.setFontSize(20);
        context.setTextAlign('center');
        context.fillText("阅读文章，请长按识别二维码", 300, 900);
        //context.setStrokeStyle(grd)
        context.setFillStyle("#959595");
        // context.beginPath()//分割线
        // context.moveTo(30, 690)
        // context.lineTo(570, 690)
        // context.stroke();
        // this.setUserInfo(context);//用户信息        
        util.drawTitleExcerpt(context, title, excerpt);//文章标题
        context.draw();
        //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(function () {
            wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function (res) {
                    var tempFilePath = res.tempFilePath;
                    // that.setData({
                    //     imagePath: tempFilePath,
                    //     maskHidden: "none"
                    // });
                    wx.hideLoading();
                    console.log("海报图片路径：" + res.tempFilePath);                    
                    that.modalView.showModal({
                        title: '保存至相册可以分享到朋友圈',
                        confirmation: false,
                        confirmationText: '',
                        inputFields: [{
                            fieldName: 'posterImage',
                            fieldType: 'Image',
                            fieldPlaceHolder: '',
                            fieldDatasource: res.tempFilePath,
                            isRequired: false,
                        }],
                        confirm: function (res) {
                            console.log(res)
                            //用户按确定按钮以后会回到这里，并且对输入的表单数据会带回
                        }
                    })


                },
                fail: function (res) {
                    console.log(res);
                }
            });
        }, 900);
    },
    onPosterSuccess(e) {
        const { detail } = e;        
        this.showModal(detail);
      },
      onPosterFail(err) {  
        wx.showToast({
            title: err,
            mask: true,
            duration: 2000
        });
      },

    onCreatePoster:function() {      
        var self = this;    
        this.ShowHideMenu();     
        if (self.data.openid) {
            self.creatArticlePoster(self,Api,util,self.modalView,Poster);
        }
        else {
            Auth.checkSession(self,'isLoginNow');
                    
        }
        
    },

    showModal:function(posterPath){
        this.modalView.showModal({
                    title: '保存至相册可以分享给好友',
                    confirmation: false,
                    confirmationText: '',
                    inputFields: [{
                        fieldName: 'posterImage',
                        fieldType: 'Image',
                        fieldPlaceHolder: '',
                        fieldDatasource: posterPath,
                        isRequired: false,
                    }],
                    confirm: function (res) {
                        console.log(res)
                              }
                })
    },
    
     creatArticlePoster:function(appPage, api, util, modalView,poster)
    {

        var postId = appPage.data.detail.id;
        var title =appPage.data.detail.title.rendered;        
        var excerpt = appPage.data.detail.excerpt.rendered?appPage.data.detail.excerpt.rendered:'';
        if(excerpt && excerpt.length !=0 &&  excerpt !='' )
        {
            excerpt = util.removeHTML(excerpt);
        } 


        var postImageUrl = "";//海报图片地址
        var posterImagePath = "";
        var qrcodeImagePath = "";//二维码图片的地址
        var flag = false;
        var imageInlocalFlag = false;  
        var downloadFileDomain = appPage.data.downloadFileDomain;
        var logo = appPage.data.logo;
        var defaultPostImageUrl = appPage.data.postImageUrl;
        var postImageUrl = appPage.data.detail.post_full_image;


        //获取文章首图临时地址，若没有就用默认的图片,如果图片不是request域名，使用本地图片
        if (postImageUrl) {
            var n = 0;
            for (var i = 0; i < downloadFileDomain.length; i++) {

            if (postImageUrl.indexOf(downloadFileDomain[i].domain) != -1) {
                n++;
                break;
            }
            }
            if (n == 0) {
            imageInlocalFlag = true;
            postImageUrl = defaultPostImageUrl;

            }

        } else {
            postImageUrl = defaultPostImageUrl;
        }
        var posterConfig = {
            width: 750,
            height: 1200,
            backgroundColor: '#fff',
            debug: false
            
        }
        var blocks= [
            {
                width: 690,
                height: 808,
                x: 30,
                y: 183,
                borderWidth: 2,
                borderColor: '#f0c2a0',
                borderRadius: 20,
            },
            {
                width: 634,
                height: 74,
                x: 59,
                y: 680,
                backgroundColor: '#fff',
                opacity: 0.5,
                zIndex: 100,
            }
        ]
        var texts=[];
        texts= [
            {
                x: 113,
                y: 61,
                baseLine: 'middle',
                text: appPage.data.userInfo.nickName,
                fontSize: 32,
                color: '#8d8d8d',
                width: 570,
                lineNum: 1
            },
            {
                x: 32,
                y: 113,
                baseLine: 'top',
                text: '发现不错的文章推荐给你',
                fontSize: 38,
                color: '#080808',
            },            
            {
                x: 59,
                y: 770,
                baseLine: 'middle',
                text: title,
                fontSize: 38,
                color: '#080808',
                marginLeft: 30,
                width: 570,
                lineNum: 2,
                lineHeight:50
            },    
            {
                x: 59,
                y: 875,
                baseLine: 'middle',
                text: excerpt,
                fontSize: 28,
                color: '#929292',
                width: 560,
                lineNum: 2,
                lineHeight:50
            },
            {
                x: 350,
                y: 1130,
                baseLine: 'top',
                text: '长按识别小程序码,立即阅读',
                fontSize: 30,
                color: '#080808',
            }
        ];
        
    
        posterConfig.blocks=blocks;//海报内图片的外框
        posterConfig.texts=texts; //海报的文字
        var url = Api.creatPoster();
        var path = "pages/detail/detail?id=" + postId;
        var data = {
            postid: postId,                
            path: path               
            
        };
        var creatPosterRequest = wxRequest.postRequest(url, data);
        creatPosterRequest.then(res => {
            if (res.data.code=='success') {
            qrcodeImagePath=res.data.qrcodeimgUrl;


            var images= [
                {
                    width: 62,
                    height: 62,
                    x: 32,
                    y: 30,
                    borderRadius: 62,
                    url:appPage.data.userInfo.avatarUrl, //用户头像
                },
                {
                    width: 634,
                    height: 475,
                    x: 59,
                    y: 210,
                    url: postImageUrl,//海报主图
                },
                {
                    width: 220,
                    height: 220,
                    x: 92,
                    y: 1020,
                    url: qrcodeImagePath,//二维码的图
                }
            ];

            posterConfig.images=images;//海报内的图片
                appPage.setData({ posterConfig: posterConfig }, () => {
                poster.create(true);    //生成海报图片
            });
            
            }
            else{            
                wx.showToast({
                    title: res.message,
                    mask: true,
                    duration: 2000
                });
            }
        });
    }

})