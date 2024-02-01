import config from '../../utils/config.js'

Page({
    data: {
      articleStyle: config.articleStyle || 1,
    },
    onLoad() {
      this.getArticleStyle()
    },

    getArticleStyle() {
      const articleStyle = wx.getStorageSync('articleStyle') || config.articleStyle || 1
      this.setData({
        articleStyle: +articleStyle,
      })
    },

    changeArticleStyle(e) {
      const articleStyle = e.detail
      this.setData({
        articleStyle,
      })
      wx.setStorageSync('articleStyle', articleStyle)
    }
})
