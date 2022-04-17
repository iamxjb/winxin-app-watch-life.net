const util = require("../../utils/util.js");
var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
const regDate = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/

Component({
  data: {
    info: {},
    activeTab: 0,
    list: []
  },

  lifetimes: {
    attached: function () { },
  },

  methods: {
    onLoad: function () {
      this.init()
    },

    onPullDownRefresh: function () {
      this.init()
      wx.stopPullDownRefresh()
    },

    init() {
      this.setData({activeTab:0});
      this.getChannelsInfo()
      this.getChannelsActivity()
    },

    getChannelsInfo() {
      var self = this
      const res =  wxRequest.getRequest(Api.getChannelsInfo()).then(res => {
        const channelsId = res.data.channelsId;
        self.setData({
          info: res.data || {}
        })
        var channelsLiveInfo = '';
        wx.getChannelsLiveInfo({
          finderUserName: channelsId,
          success(resLive) {
            channelsLiveInfo = resLive;
            self.setData({ channelsLiveInfo });
          }
        })
        var channelsLiveNoticeInfo = ''
        wx.getChannelsLiveNoticeInfo({
          finderUserName: channelsId,
          success(resLiveNotice) {
            channelsLiveNoticeInfo = resLiveNotice;
            channelsLiveNoticeInfo.startTime = util.datefomate(
              channelsLiveNoticeInfo.startTime,
              "MM-dd HH:mm"
            )
            self.setData({ channelsLiveNoticeInfo });
          }
        })

      })


    },
    //预约直播
    reserveChannelsLive(e) {
      var noticeId = e.currentTarget.dataset.noticeid;
      wx.reserveChannelsLive({
        noticeId: noticeId
      })

    },

    // 跳转视频号直播
    redictChannelsLive(e) {      
      var channelsId = e.currentTarget.dataset.channelsid;
      wx.openChannelsLive({
        finderUserName: channelsId
      })
    },

    getChannelsActivity() {
      let self = this
      wxRequest.getRequest(Api.getChannelsActivity()).then(res=>{
        let list = res.data || []
        if (list.length) list = list.map(m => {
            if (m.creatdate) {
              m.creatdateName = regDate.test(m.creatdate)
                ?
                m.creatdate.replace(regDate, '$2-$3 $4:$5')
                :
                m.creatdate
            }

            return m
          })

        self.setData({ list })
      }) 
    },

    getChannelsEvent() {
      let self = this
      wxRequest.getRequest(Api.getChannelsEvent()).then(res=>{
        let list = res.data || []
        if (list.length) list = list.map(m => {
          if (m.enddate) {
            m.enddateName = regDate.test(m.enddate)
              ?
              m.enddate.replace(regDate, '$2-$3 $4:$5')
              :
              m.enddate
          }

          return m
        })

        self.setData({ list })
      })
    },

    switchTab(e) {
      let activeTab = e.currentTarget.dataset.idx
      let dataName = activeTab === 0 ? 'getChannelsActivity' : 'getChannelsEvent'
      this[dataName]()

      this.setData({
        activeTab
      })
    },

    openUserProfile(e) {
      let channelsId = e.currentTarget.dataset.channelsid;
      wx.openChannelsUserProfile({
        finderUserName: channelsId
      })
    },

    goto(e) {
      let channelsId = e.currentTarget.dataset.channelsid;
      let feedId = e.currentTarget.dataset.feedid;
      let eventId = e.currentTarget.dataset.eventid;


      // 视频
      if (this.data.activeTab === 0) {
        wx.openChannelsActivity({
          finderUserName: channelsId,
          feedId: feedId
        })
      }

      // 活动
      if (this.data.activeTab === 1) {
        wx.openChannelsEvent({
          finderUserName: channelsId,
          eventId: eventId
        })
      }
    },
  }
})