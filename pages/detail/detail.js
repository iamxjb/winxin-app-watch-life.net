/*
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 *  *Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 */


import config from '../../utils/config.js'
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var Auth = require('../../utils/auth.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')

const innerAudioContext = wx.createInnerAudioContext();
let ctx = wx.createCanvasContext('mycanvas');  

var app = getApp();
let isFocusing = false
const pageCount = config.getPageCount;

var webSiteName= config.getWebsiteName;
var domain =config.getDomain

import { ModalView } from '../../templates/modal-view/modal-view.js'
import Poster from '../../templates/components/wxa-plugin-canvas-poster/poster/poster';
let rewardedVideoAd = null


Page({
  data: {
    title: '文章内容',
    webSiteName:webSiteName,
    detail: {},
    commentsList: [],
    ChildrenCommentsList: [],
    commentCount: '',
    detailDate: '',
    commentValue: '',
    wxParseData: {},
    display: 'none',
    showerror: 'none',
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
    isLoading: false,
    total_comments: 0,
    isLoginPopup: false,
    openid: "",
    userInfo: {},
    system: '',
    downloadFileDomain: config.getDownloadFileDomain,

    isPlayAudio: false,
    audioSeek: 0,
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
    audioTime: 0,
    displayAudio: 'none',
    shareImagePath: '',
    detailSummaryHeight: '',
    detailAdsuccess: true,
    fristOpen: false,
    domain:domain,
    detailSummaryHeight: '',
    platform: ''

  },
  onLoad: function (options) {
    var self = this;
    self.getEnableComment();
    self.fetchDetailData(options.id);
    Auth.setUserInfoData(self);
    Auth.checkLogin(self);
    wx.getSystemInfo({
      success: function (t) {
        var system = t.system.indexOf('iOS') != -1 ? 'iOS' : 'Android';
        self.setData({ system: system ,platform: t.platform});
      }
    })
    new ModalView;
  },
  onUnload: function () {
    //卸载页面，清除计步器
    clearInterval(this.data.durationIntval);
    if (rewardedVideoAd && rewardedVideoAd.destroy) { 
      rewardedVideoAd.destroy() 
    }
    innerAudioContext.destroy()
    ctx=null;


  },
  showLikeImg: function () {
    var self = this;
    var flag = false;
    var _likes = self.data.detail.avatarurls;
    if (!_likes) {
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
    else {
      console.log('评论已经是最后一页了');
    }

  },
  onShareAppMessage: function (res) {
    this.ShowHideMenu();
    console.log(res);
    return {
      title: '分享"' + webSiteName + '"的文章：' + this.data.detail.title.rendered,
      path: 'pages/detail/detail?id=' + this.data.detail.id,
      imageUrl: this.data.detail.post_full_image,
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
    var enterpriseMinapp = self.data.detail.enterpriseMinapp;
    var url = '';
    if (enterpriseMinapp == "1") {
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
      Auth.checkSession(self, 'isLoginNow');

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
    var enterpriseMinapp = self.data.detail.enterpriseMinapp;
    var system = self.data.system;
    var praiseWord=self.data.detail.praiseWord;
    if (enterpriseMinapp == "1" && system == 'Android') {
      if (self.data.openid) {
        wx.navigateTo({
          url: '../pay/pay?flag=1&openid=' + self.data.openid + '&postid=' + self.data.postID+'&praiseWord='+praiseWord
        })
      }
      else {
        Auth.checkSession(self, 'isLoginNow');
      }
    }
    else if(enterpriseMinapp == "0" || system=='iOS'){

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
        if (response.data.code && (response.data.data.status == "404")) {
          self.setData({
            showerror: 'block',
            display: 'none',
            detailAdsuccess:true,
            errMessage: response.data.message
          });
          return false;
        }
        // 设置页面标题：文章分类
        wx.setNavigationBarTitle({
          // title: res.data.title.rendered
          title: res.data.category_name
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

        var openAdLogs = wx.getStorageSync('openAdLogs') || [];
        var openAded = res.data.excitationAd == '1' ? false : true;
        if (openAdLogs.length > 19) {
          openAded = true;
        } else if (openAdLogs.length > 0 && res.data.excitationAd == '1') {
          for (var i = 0; i < openAdLogs.length; i++) {
            if (openAdLogs[i].id == res.data.id) {
              openAded = true;
              break;
            }


          }
        }

        if (res.data.excitationAd == '1') {
          self.loadInterstitialAd(res.data.rewardedVideoAdId);
        }

        self.setData({
          detail: response.data,
          likeCount: _likeCount,
          postID: id,
          link: response.data.link,
          detailDate: util.cutstr(response.data.date, 10, 1),
          display: 'block',
          displayLike: _displayLike,
          total_comments: response.data.total_comments,
          postImageUrl: response.data.postImageUrl,
          detailSummaryHeight: openAded ? '' : '400rpx'

        });

        return response.data
      })
      .then(response => {

        if(response.audios.length>0  && response.audios[0].src !='' )
        {
          self.InitializationAudio( response.audios[0].src);
          self.loadAudio();
          self.setData({
            displayAudio: "block"
          });
        }


      })
      .then(response => {
        var tagsArr = [];
        tagsArr = res.data.tags
        if (!tagsArr) {
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
          Auth.checkSession(self, 'isLoginLater');
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
  //拖动进度条事件
  sliderChange:function(e) {
    var that = this;
    innerAudioContext.src = this.data.detail.audios[0].src;
    //获取进度条百分比
    var value = e.detail.value;
    this.setData({ audioTime: value });
    var duration = this.data.audioDuration;
    //根据进度条百分比及歌曲总时间，计算拖动位置的时间
    value = parseInt(value * duration / 100);
    //更改状态
    this.setData({ audioSeek: value, isPlayAudio: true });
    //调用seek方法跳转歌曲时间
    innerAudioContext.seek(value);
    //播放歌曲
    innerAudioContext.play();
  },

  
  //初始化播放器，获取duration
 InitializationAudio:function (audiosrc) {
  var self = this;
  //设置src
  innerAudioContext.src = audiosrc;
  //运行一次
  //innerAudioContext.play();
  innerAudioContext.autoplay = false;
  innerAudioContext.pause();
  innerAudioContext.onCanplay(() => {
    //初始化duration
    innerAudioContext.duration
    setTimeout(function() {
      //延时获取音频真正的duration
      var duration = innerAudioContext.duration;
      var min = parseInt(duration / 60);
      var sec = parseInt(duration % 60);
      if (min.toString().length == 1) {
        min = `0${min}`;
      }
      if (sec.toString().length == 1) {
        sec = `0${sec}`;
      }
      self.setData({
        audioDuration: innerAudioContext.duration,
        showTime2: `${min}:${sec}`
      });
    }, 1000)
  })

},

 loadAudio :function() {
  var that = this;
  //设置一个计步器
  that.data.durationIntval = setInterval(function() {
    //当歌曲在播放时执行
    if (that.data.isPlayAudio == true) {
      //获取歌曲的播放时间，进度百分比
      var seek = that.data.audioSeek;
      var duration = innerAudioContext.duration;
      var time = that.data.audioTime;
      time = parseInt(100 * seek / duration);
      //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
      var min = parseInt((seek + 1) / 60);
      var sec = parseInt((seek + 1) % 60);
      //填充字符串，使3:1这种呈现出 03：01 的样式
      if (min.toString().length == 1) {
        min = `0${min}`;
      }
      if (sec.toString().length == 1) {
        sec = `0${sec}`;
      }
      var min1 = parseInt(duration / 60);
      var sec1 = parseInt(duration % 60);
      if (min1.toString().length == 1) {
        min1 = `0${min1}`;
      }
      if (sec1.toString().length == 1) {
        sec1 = `0${sec1}`;
      }
      //当进度条完成，停止播放，并重设播放时间和进度条
      if (time >= 100) {
        innerAudioContext.stop();
        that.setData({
          audioSeek: 0,
          audioTime: 0,
          audioDuration: duration,
          isPlayAudio: false,
          showTime1: `00:00`
        });
        return false;
      }
      //正常播放，更改进度信息，更改播放时间信息
      that.setData({
        audioSeek: seek + 1,
        audioTime: time,
        audioDuration: duration,
        showTime1: `${min}:${sec}`,
        showTime2: `${min1}:${sec1}`
      });
    }
  }, 1000);
},

 playAudio :function() {
  //获取播放状态和当前播放时间  
  var  self=this;
  var isPlayAudio = self.data.isPlayAudio;
  var seek = self.data.audioSeek;
  innerAudioContext.pause();
  //更改播放状态
  self.setData({
    isPlayAudio: !isPlayAudio
  })
  if (isPlayAudio) {
    //如果在播放则记录播放的时间seek，暂停
    self.setData({
      audioSeek: innerAudioContext.currentTime
    });
  } else {
    //如果在暂停，获取播放时间并继续播放
    innerAudioContext.src = self.data.detail.audios[0].src;
    if (innerAudioContext.duration != 0) {
      self.setData({
        audioDuration: innerAudioContext.duration
      });
    }
    //跳转到指定时间播放
    innerAudioContext.seek(seek);
    innerAudioContext.play();
  }
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
                var enterpriseMinapp = self.data.detail.enterpriseMinapp;
                var url = '../webpage/webpage'
                if (enterpriseMinapp == "1") {
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
    var self = this;
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
    if (self.data.enableComment == "1") {
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
    if (formId == "the formId is a mock one") {
      formId = "";

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
        var postCommentMessage = "";
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
                postCommentMessage = res.data.message;
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
                var commentCounts = parseInt(self.data.total_comments) + 1;
                self.setData({
                  total_comments: commentCounts,
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
          }).then(response => {
            //self.fetchCommentData(self.data); 
            self.setData(
              {
                page: 1,
                commentsList: [],
                isLastPage: false

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
        Auth.checkSession(self, 'isLoginNow');

      }

    }

  },
  agreeGetUser: function (e) {
    let self = this;
    Auth.checkAgreeGetUser(e, app, self, '0');;

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

  onCreatePoster: function () {
    var self = this;
    this.ShowHideMenu();
    if (self.data.openid) {
      self.creatArticlePoster(self, Api, util, self.modalView, Poster);
    }
    else {
      Auth.checkSession(self, 'isLoginNow');

    }

  },

  showModal: function (posterPath) {
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

  creatArticlePoster: function (appPage, api, util, modalView, poster) {
    var postId = appPage.data.detail.id;
    var title = appPage.data.detail.title.rendered;
    var excerpt = appPage.data.detail.excerpt.rendered ? appPage.data.detail.excerpt.rendered : '';
    if (excerpt && excerpt.length != 0 && excerpt != '') {
      excerpt = util.removeHTML(excerpt);
    }
    var postImageUrl = "";//海报图片地址
    var posterImagePath = "";
    var qrcodeImagePath = "";//二维码图片的地址
    var flag = false;
    var imageInlocalFlag = false;
    var downloadFileDomain = appPage.data.downloadFileDomain;
    var logo = appPage.data.logo;
    var defaultPostImageUrl = appPage.data.detail.postImageUrl;
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
    var blocks = [
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
    var texts = [];
    texts = [
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
        lineHeight: 50
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
        lineHeight: 50
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


    posterConfig.blocks = blocks;//海报内图片的外框
    posterConfig.texts = texts; //海报的文字
    var url = Api.creatPoster();
    var path = "pages/detail/detail?id=" + postId;
    var data = {
      postid: postId,
      path: path

    };
    var creatPosterRequest = wxRequest.postRequest(url, data);
    creatPosterRequest.then(res => {
      if (res.data.code == 'success') {
        qrcodeImagePath = res.data.qrcodeimgUrl;


        var images = [
          {
            width: 62,
            height: 62,
            x: 32,
            y: 30,
            borderRadius: 62,
            url: appPage.data.userInfo.avatarUrl, //用户头像
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

        posterConfig.images = images;//海报内的图片
        appPage.setData({ posterConfig: posterConfig }, () => {
          poster.create(true);    //生成海报图片
        });

      }
      else {
        wx.showToast({
          title: res.message,
          mask: true,
          duration: 2000
        });
      }
    });
  },
  detailAdbinderror: function (e) {
    var self = this;
    if (e.errCode) {
      self.setData({ detailAdsuccess: false })

    }
  },

  loadInterstitialAd: function (excitationAdId) {
    var self = this;
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: excitationAdId })
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      rewardedVideoAd.onError((err) => {
        console.log(err);
        this.setData({
          detailSummaryHeight: ''
        })
      })
      rewardedVideoAd.onClose((res) => {

        var id = self.data.detail.id;
        if (res && res.isEnded) {

          var nowDate = new Date();
          nowDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();

          var openAdLogs = wx.getStorageSync('openAdLogs') || [];
          // 过滤重复值
          if (openAdLogs.length > 0) {
            openAdLogs = openAdLogs.filter(function (log) {
              return log["id"] !== id;
            });
          }
          // 如果超过指定数量不再记录
          if (openAdLogs.length < 21) {
            var log = {
              "id": id,
              "date": nowDate
            }
            openAdLogs.unshift(log);
            wx.setStorageSync('openAdLogs', openAdLogs);
            console.log(openAdLogs);

          }
          this.setData({
            detailSummaryHeight: ''
          })
        } else {

          wx.showToast({
            title: "你中途关闭了视频",
            icon: "none",
            duration: 3000
          });

          
        }
      })
    }

  },

  // 阅读更多
  readMore: function () {
    var self = this;

    var platform = self.data.platform
    if (platform == 'devtools') {

      wx.showToast({
        title: "开发工具无法显示激励视频",
        icon: "none",
        duration: 2000
      });

      self.setData({
        detailSummaryHeight: ''
      })
    }
    else {

      rewardedVideoAd.show()
        .catch(() => {
          rewardedVideoAd.load()
            .then(() => rewardedVideoAd.show())
            .catch(err => {
              console.log('激励视频 广告显示失败');
              self.setData({
                detailSummaryHeight: ''
              })
            })
        })

    }

  }

})