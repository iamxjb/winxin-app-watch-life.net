const app = getApp()

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "",
    list: [
      {
        "pagePath": "/pages/index/index",
   
        "text": "首页"
      },
      {
        "pagePath": "/pages/topic/topic", 
        "text": "专题"
      },{
        "pagePath": "/pages/hot/hot", 
        "text": "排行"
      },
      {
        "pagePath": "/pages/my/my", 
        "text": "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
  
    }, 
  },

  
})