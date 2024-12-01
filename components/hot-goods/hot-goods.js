const app = getApp()

Component({
  options: {
    addGlobalClass: false
  },
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: Array,
    title: {
      type: String,
      value: '热销商品'
    },
    padding: {
      type: String,
      value: '0 24rpx'
    },
    from: { // 引用页面
      type: String,
      value: ''
    },
    listType: {
      type: String, // 1 横向左滑列表（商品上图下文布局） 2 横向左滑列表（商品左图右文布局） 3 纵向列表布局
      value: '1'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    // onLoad: function() {
    //  var pagetype= this.data.pagetype;
    //  var teset="dd";
     
    // },
    // 跳转
    toDetail(e) {
      var pagetype =this.data.pagetype;     
      let { type,redirecttype, appid,url, path,jumptype } = e.currentTarget.dataset
      if(pagetype=="detail")
      {
        if (type === 'minishopGoods') { //小商店         
          wx.navigateTo({
            url: path
          })
        }

        if (type === 'miniappGoods') { //小程序商品
          if(jumptype=='embedded' && appid)
          {
            // #if MP
            wx.openEmbeddedMiniProgram({
              appId: appid,
              path: path,
              allowFullScreen:true
            })
            // #elif NATIVE
            wx.showToast({
              title: '暂不支持，请在微信小程序中使用此功能！',
              icon: "none"
            })
            // #endif
          }
          else if(jumptype=='redirect' && appid)
          {
            // #if MP
            wx.navigateToMiniProgram({
              appId: appid,
              path: path
            })
            // #elif NATIVE
            wx.showToast({
              title: '暂不支持，请在微信小程序中使用此功能！',
              icon: "none"
            })
            // #endif
          }
          else if(!appid)
          {
            wx.navigateTo({
              url:path,
            })
          }
        }
      }
      else{
        if (type === 'apppage') { // 小程序页面
          wx.navigateTo({
            url: path
          })
        }
        if (type === 'webpage') { // web-view页面
          url = '/pages/webview/webview?url=' + encodeURIComponent(url)
          wx.navigateTo({
            url
          })
        }
        if (type === 'miniapp') { // 其他小程序
          if(jumptype=='embedded')
          {
            // #if MP
            wx.openEmbeddedMiniProgram({
              appId: appid,
              path: path,
              allowFullScreen:true
            })
            // #endif
          }
          else
          {
            // #if MP
            wx.navigateToMiniProgram({
              appId: appid,
              path: path
            })
            // #endif
          }
        }
      }
    }
  }
})
