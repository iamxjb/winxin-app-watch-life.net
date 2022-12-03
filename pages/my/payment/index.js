// pages/payment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  onLoad(query) {
    const payment = {}
    Object.keys(query).forEach(o => payment[o] = decodeURIComponent(query[o]))
    this.setData({
      payment
    })
  },

  async onPay() {
    let payment = this.data.payment
    wx.requestPayment({
        ...payment,
        success: (res) => {
          this.setData({
            modalTitle: '支付成功',
            modalContent: '点击下方按钮返回',
            showModal: true,
            ext: JSON.stringify(res)
          })
        },
        fail: (res) => {
          this.setData({
            modalTitle: '支付失败',
            modalContent: '点击下方按钮返回',
            showModal: true,
            ext: JSON.stringify(res)
          })
        }
    })
  },

  preventTouchMove() {},
  clickBtn() {
    this.setData({
      showModal: false
    })
  }

})