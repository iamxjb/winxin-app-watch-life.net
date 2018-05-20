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
var auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')

//const Zan = require('../../vendor/ZanUI/index')

var app = getApp();
let isFocusing = false
const pageCount = config.getPageCount;

import { ModalView } from '../../templates/modal-view/modal-view.js'

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
        userInfo:app.globalData.userInfo,
        isLoginPopup:false

    },
    onLoad: function (options) {
        this.getEnableComment();
        this.fetchDetailData(options.id);
        new ModalView;

    },
    showLikeImg: function () {
        var self = this;
        var flag = false;
        var _likes = self.data.detail.avatarurls;
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
        // else {
        //     wx.showToast({
        //         title: '没有更多内容',
        //         mask: false,
        //         duration: 1000
        //     });
        // }
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
            url = '../webpage/webpage';
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

        if (app.globalData.isGetOpenid) {
            var data = {
                openid: app.globalData.openid,
                postid: self.data.postID
            };
            var url = Api.postLikeUrl();
            var postLikeRequest = wxRequest.postRequest(url, data);
            postLikeRequest
                .then(response => {
                    if (response.data.status == '200') {
                        var _likeList = []
                        //var _like = { "avatarurl": app.globalData.userInfo.avatarUrl, "openid": app.globalData.openid }
                        var _like = app.globalData.userInfo.avatarUrl;
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
            self.userAuthorization('1');
        }
    },
    getIslike: function () { //判断当前用户是否点赞
        var self = this;
        if (app.globalData.isGetOpenid) {
            var data = {
                openid: app.globalData.openid,
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
        if (minAppType == "0") {
            if (app.globalData.isGetOpenid) {

                wx.navigateTo({
                    url: '../pay/pay?flag=1&openid=' + app.globalData.openid + '&postid=' + self.data.postID
                })
            }
            else {
                self.userAuthorization('1');
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
                    total_comments: response.data.total_comments

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
                wx.setNavigationBarTitle({
                    title: res.data.title.rendered
                });

            })
            .then(response => {
                var tagsArr = [];
                tagsArr = res.data.tags
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
            }).then(response => {
                var updatePageviewsRequest = wxRequest.getRequest(Api.updatePageviews(id));
                updatePageviewsRequest
                    .then(result => {
                        console.log(result.data.message);

                    })

            }).then(response => {//获取点赞记录
                self.showLikeImg();
            }).then(response => {//获取评论
               // self.fetchCommentData(self.data);
            }).then(resonse => {
                if (!app.globalData.isGetOpenid) {
                    self.userAuthorization('0');
                }

            }).then(response => {//获取是否已经点赞
                if (app.globalData.isGetOpenid) {
                    self.getIslike();
                }
            })
            .catch(function (response) {

            })
            // .finally(function (response) {

            // });


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

            }).then(response => {
                

            }) 
            .catch(response => {
                console.log(response.data.message);
                
            }).finally(function () {

                self.setData({
                    isLoading: false
                });

            });     
    },

    //获取回复
    fetchChildrenCommentData: function (data, flag) {
        var self = this;
        var getChildrenCommentsRequest = wxRequest.getRequest(Api.getChildrenComments(data));
        getChildrenCommentsRequest
            .then(response => {
                if (response.data) {
                    self.setData({
                        ChildrenCommentsList: self.data.ChildrenCommentsList.concat(response.data.map(function (item) {
                            var strSummary = util.removeHTML(item.content.rendered);
                            var strdate = item.date
                            item.summary = strSummary;

                            item.date = util.formatDateTime(strdate);
                            if (item.author_url.indexOf('wx.qlogo.cn') != -1) {
                                if (item.author_url.indexOf('https') == -1) {
                                    item.author_url = item.author_url.replace("http", "https");
                                }
                            }
                            else {
                                item.author_url = "../../images/gravatar.png";
                            }
                            return item;
                        }))

                    });

                }
                setTimeout(function () {
                    //wx.hideLoading();
                    if (flag == '1') {
                        wx.showToast({
                            title: '评论发布成功',
                            icon: 'success',
                            duration: 900,
                            success: function () {

                            }
                        })
                    }
                }, 900);
            })
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
        console.log('toFromId', toFromId);
        console.log('replay', isFocusing);
    },
    onReplyBlur: function (e) {
        var self = this;
        console.log('onReplyBlur', isFocusing);
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
        console.log(isFocusing);
    },
    onRepleyFocus: function (e) {
        var self = this;
        isFocusing = false;
        console.log('onRepleyFocus', isFocusing);
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
            if (app.globalData.isGetOpenid) {
                var name = app.globalData.userInfo.nickName;
                var author_url = app.globalData.userInfo.avatarUrl;
                var email = app.globalData.openid + "@qq.com";
                var openid = app.globalData.openid;
                var fromUser = app.globalData.userInfo.nickName;                
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
                postCommentRequest
                    .then(res => {
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
                                console.log(res.data.message);
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
                                            console.log(response.data.message);
                                            // wx.navigateBack({
                                            //     delta: 1
                                            // })

                                        }
                                        else {
                                            console.log(response.data.message);

                                        }

                                    });

                                }
                                console.log(res.data.code);
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
                                console.log(res.data.code)
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
                                title: '评论发布成功',
                                icon: 'success',
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
                self.userAuthorization('1');

            }

        }

    },
    userAuthorization: function (flag) {
        var self = this;
        // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
        wx.getSetting({
            success: function success(res) {
                console.log(res.authSetting);
                var authSetting = res.authSetting;
                if (!('scope.userInfo' in authSetting)) {
                //if (util.isEmptyObject(authSetting)) {
                    console.log('第一次授权');
                    if(flag=='1')
                    {
                        self.setData({ isLoginPopup: true })
                    }
                    

                } else {
                    console.log('不是第一次授权', authSetting);
                    // 没有授权的提醒
                    if (authSetting['scope.userInfo'] === false) {
                        if(flag=='1')
                        {
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
                                                    auth.getUsreInfo(null);
                                                }
                                            }
                                        });
                                    }
                                }
                            })
                        }
                        
                    }
                    else
                    {
                        auth.getUsreInfo(null);

                    }
                }
            }
        });
    },
    agreeGetUser:function(e)
    {
       var userInfo = e.detail.userInfo;
       var self=this;
        if (userInfo)
        {
            auth.getUsreInfo(e.detail);
            self.setData({ userInfo: userInfo});            
        }       
        setTimeout(function () {
            self.setData({ isLoginPopup: false })
        }, 1200);
        
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

        var fristImage = self.data.detail.content_first_image; 

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
        if (app.globalData.isGetOpenid) {
            var openid = app.globalData.openid;
            var data = {
                postid: postid,                
                path: path,               
                openid: openid
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
        }

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
        context.drawImage(qrcodeLoal, 90, 720, 180, 180);//绘制二维码
        context.drawImage(that.data.logo, 350, 740, 130, 130);//画logo
        //const grd = context.createLinearGradient(30, 690, 570, 690)//定义一个线性渐变的颜色
        //grd.addColorStop(0, 'black')
        //grd.addColorStop(1, '#118fff')
        //context.setFillStyle(grd)
        context.setFillStyle("#000000");
        context.setFontSize(20);
        context.setTextAlign('center');
        context.fillText("阅读文章,请长按识别二维码", 300, 940);
        //context.setStrokeStyle(grd)
        context.setFillStyle("#000000");
        context.beginPath()//分割线
        context.moveTo(30, 690)
        context.lineTo(570, 690)
        context.stroke();
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
    creatPoster: function () {

        /////////////////
        var self = this;
        self.ShowHideMenu();
        if (self.data.posterImageUrl) {
            url = '../poster/poster?posterImageUrl=' + posterImageUrl;
            wx.navigateTo({
                url: url
            })
            return true;
        }
        var postid = self.data.detail.id;
        var title = self.data.detail.title.rendered;
        var path = "pages/detail/detail?id=" + postid;
        var postImageUrl = "";
        if (self.data.detail.content_first_image) {
            postImageUrl = self.data.detail.content_first_image;
        }
        wx.showLoading({
            title: "正在生成图片",
            mask: false,
        });

        if (app.globalData.isGetOpenid) {
            var openid = app.globalData.openid;
            var data = {
                postid: postid,
                title: title,
                path: path,
                postImageUrl: postImageUrl,
                openid: openid
            };
            var url = Api.creatPoster();
            var posterImageUrl = Api.getPosterUrl() + "poster-" + postid + ".jpg";
            var creatPosterRequest = wxRequest.postRequest(url, data);
            creatPosterRequest.then(response => {
                if (response.statusCode == 200) {
                    if (response.data.status == '200') {
                        url = '../poster/poster?posterImageUrl=' + posterImageUrl;
                        wx.navigateTo({
                            url: url
                        })

                    } else {
                        console.log(response);

                    }
                }
                else {
                    console.log(response);
                }

            }).catch(response => {
                console.log(response);
            }).finally(function (response) {
                wx.hideLoading();
            });

        }

        ////////

    }

})