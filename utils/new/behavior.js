module.exports = Behavior({
  data: {},
  // 方法
  methods: {
    // 提交邀请信息
    submitInviteInfo(invitecode) {
      // #if MP
      wx.login({
        success: async (res) => {
          if (!res.code) return
          const app = getApp()
          const oRes = await app.$api.getOpenid({ js_code: res.code })
          if (oRes.openid && oRes.openid.openid) {
            app.$api.submitInviteInfo({
              invitecode,
              openid: oRes.openid.openid
            })
          }
        }
      })
      // #endif
    }
  },

  ready: function() {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    const { invitecode, from } = page.options
    if (invitecode && from !== 'detail') {
      this.submitInviteInfo(invitecode)
    }
  }
})