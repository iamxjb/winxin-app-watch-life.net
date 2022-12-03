Page({
  data: {
    code: '',
    ext: '',
    showModal: false,
  },

  handleTap(e) {
    this.setData({
      code: e.detail.code,
      modalTitle: '授权成功',
      modalContent: '手机号授权成功，点击下方按钮返回',
      showModal: true,
      ext: JSON.stringify({
        code: e.detail.code
      })
    })
  },
  //隐藏弹窗
  hideModal() {
    this.setData({
      showModal: false
    })
  },
  //截断touchMove事件
  preventTouchMove() {},
  clickBtn() {
    this.setData({
      showModal: false
    })
  }
})