import config from '../../utils/config.js';
Component({
  options: {
    addGlobalClass: false
  },
  /**
   * 组件的属性列表
   */
  properties: {
    type: { // 1 专业版  2 增强版 3 开源版
      type: String,
      value: '1'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {isShow: config.enableChannels},

  /**
   * 组件的方法列表
   */
  methods: {
    goto() {
      wx.navigateTo({
        url: '/pages/channels/channels'
      })
    }
  }
})
