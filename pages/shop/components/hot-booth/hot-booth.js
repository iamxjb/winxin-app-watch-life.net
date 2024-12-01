import { getWechatShopBanner } from '../../lib/api'

Component({
  options: {
    addGlobalClass: false
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    padding: {
      type: String,
      value: '0 24rpx'
    },
  },
  data: {
    list: []
  },

  lifetimes: {
    attached: function() {
      this.getData()
    },
  },

  methods: {
    async getData() {
      const res = await getWechatShopBanner()
      this.setData({
        list: res?.banner?.banner || []
      })
    },

    // 跳转
    goto(e) {
      const { type, product, finder, official_account, storeAppId, post} = e.currentTarget.dataset.item

      // 1-商品 3-视频号 4-公众号 9-展位扩展
      if (type === 1) {
        wx.navigateTo({
          url: `/pages/shop/list/list?productId=${product.product_id}&storeAppId=${storeAppId}`
        })
      }
      if (type === 3) {
        wx.openChannelsActivity({
          finderUserName: finder.finder_user_name,
          feedId: finder.feed_id
        })
      }
      if (type === 4) {
        wx.openOfficialAccountArticle({
          url: official_account.url
        })
      }
      if (type === 9) {
        const { type, appid, url, path, jumptype, unassociated } = post
        if (type === 'apppage') { // 小程序页面
          wx.navigateTo({
            url: path
          })
        }
        if (type === 'webpage') { // web-view页面
          if (unassociated==='yes') {
            wx.openOfficialAccountArticle({
              url, // 公众号文章连接
              success: res => {
                console.log(res)
              },
              fail: res => {
                console.log(res)
              }
            })
          } else {
            url = '/pages/webview/webview?url=' +  encodeURIComponent(url)
            wx.navigateTo({
              url
            })
          }
        }
        if (type === 'miniapp') { // 其他小程序
          // #if MP
          if (jumptype=='embedded') {
            wx.openEmbeddedMiniProgram({
              appId: appid,
              path: path,
              allowFullScreen:true
            })
          } else {
            wx.navigateToMiniProgram({
              appId: appid,
              path: path
            })
          }
          // #elif NATIVE
          wx.showToast({
            title: '暂不支持，请在微信小程序中使用此功能！',
            icon: "none"
          })
          // #endif
        }
      }
    }
  }
})
