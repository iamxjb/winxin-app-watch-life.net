// 文章列表组件
import config from '../../utils/config.js'
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    // 1 左图 2 右图 3 大图 4 多图 5 瀑布流 6 无图
    type: {
      type: Number,
      value: null
    },

    system: {
      type: String,
      value: null
    },

    showAction: {
      type: Boolean,
      value: false
    },
    isWppage: { // wp页面
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showAd: true,
    articleStyle: config.articleStyle || 3,
    enableCommentCount:config.enableCommentCount,
    enablePageviewsCount:config.enablePageviewsCount,
    enableLikeCount:config.enableLikeCount
  },

  lifetimes: {
    attached: function() {
      this.getArtileStyle()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getArtileStyle() {
      if (!this.data.type) {
        const articleStyle = wx.getStorageSync('articleStyle') || config.articleStyle || 1
        this.setData({
          articleStyle: +articleStyle,
        })
      }
    },

    // 跳转
    goto(e) {
      // wp页面跳转
      if (this.data.isWppage) {
        this.triggerEvent('click', e)
        return
      }

      let { id } = e.currentTarget
      let type = e.currentTarget.dataset.posttype || 'post'
      let format = e.currentTarget.dataset.format || ''
      let url = ''
      let channelsFeedId = e.currentTarget.dataset.channelsfeedid || ''
      let channelsId = e.currentTarget.dataset.channelsid || ''
      let mpPostLink = e.currentTarget.dataset.mppostlink || ''
    //   if (channelsFeedId) {
    //     if ((type == "post" && format == 'video') || type == "topic") {

    //       wx.openChannelsActivity({
    //         finderUserName: channelsId,
    //         feedId: channelsFeedId,
    //         success(res) {
    //           let params = {
    //             id: id
    //           }
    //           app.$api.updatePageviews(params).then(res => {
    //             console.log(res);
    //           })
    //         }
    //       })

    //       return;
    //     }

    //   }
      if (mpPostLink) {
        if ((type == "post" && format == 'link') || type == "topic") {
          let url = "/pages/webview/webview?url=" + encodeURIComponent(mpPostLink);
          wx.navigateTo({
            url:url,
            success(res)
            {
              let params = {
                id: id
              }
              app.$api.updatePageviews(params).then(res => {
                console.log(res);
              })
            }
          })

          return;
        }
      }
      if (type === 'post') {
        url = `../detail/detail?format=${format}&id=${id}`
      } else if (type === 'topic' || type === 'reply') {
        url = '../socialdetail/socialdetail?id=' + id
      }

      wx.navigateTo({
        url
      })
    },

    // 广告错误
    onError(e) {
      if (e.detail.errCode) {
        this.setData({
          showAd: false
        })
      }
    },

    submitPage(e) {
      this.triggerEvent('submitPage', e)
    },
    submitContent(e) {
      this.triggerEvent('submitContent', e)
    },

    deleteTopic(e) {
      this.triggerEvent('deleteTopic', e)
    },

    // 发送订阅消息
    sendSubscribeMessage(e) {
      this.triggerEvent('sendSubscribeMessage', e)
    }
  }
})
