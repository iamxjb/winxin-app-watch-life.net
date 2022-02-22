Component({
    data: {
        cur: 0,
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        circular: {
            type: Boolean,
            value: true
        },
        autoplay: {
            type: Boolean,
            value: true
        },
        interval: {
            type: Number,
            value: 3000
        },
        duration: {
            type: Number,
            value: 800
        },
        info: {
            type: Array,
            value: []
        },
        swiperCss: {
            type: String,
            value: 'bg-none'
        },
        mode: {
            type: String,
            value: 'default'
        },
        dotStyle: {
            type: String,
            value: 'default'
        },
        dotCur: {
            type: String,
            value: 'bg-black'
        },
        height: {
            type: String,
            value: '272rpx'
        },
        imgHeight: {
            type: String,
            value: '272rpx'
        },
        imgName: {
            type: String,
            value: 'img'
        }
    },
    methods: {
        swiperChange(e) {
            this.setData({
                cur: e.detail.current
            })
            this.triggerEvent("change",e.detail.current);
        },
        redictAppDetail: function (e) {
            let {
              type,
              appid,
              url,
              path
            } = e.currentTarget.dataset
        
            if (type === 'apppage') { // 小程序页面         
              wx.navigateTo({
                url: path
              })
            }
            if (type === 'webpage') { // web-view页面
              url = '../webpage/webpage?url=' + encodeURIComponent(url)
              wx.navigateTo({
                url: url
              })
            }
            if (type === 'miniapp') { // 其他小程序
              wx.navigateToMiniProgram({
                appId: appid,
                path: path
              })
            }
          },
        toTap(e) {
            let item = e.currentTarget.dataset.item;
            //如果类型、url为空，或者类型为eve时，以事件返回。
            if (!item.type || !item.url || item.type === 'eve') {
                this.triggerEvent("uiTap", item);
            } else {
                this._toPath(item.url,item.type);
            }
        },
    }
})