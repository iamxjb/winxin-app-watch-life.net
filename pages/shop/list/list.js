import { getTalentProductList } from '../lib/api'
Page({
  data: {
    type: '', // 1-小店商品列表 2-带货助手商品列表 3-跳转商品详情中间页（因为目前没有api直接跳转小店商品详情）
    storeAppId:'',
    productList: [],
    pageIndex: 1,
    hasMore: true
  },

 onLoad(options) {
    const { productId, storeAppId, type } = options
    if (productId) {
      this.setData({
        type: '3',
        productList: productId.split(','),
        storeAppId: storeAppId
      })
      return
    }

    this.setData({
      type
    })
    this.getList()
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      productList: [],
      pageIndex: 1,
      hasMore: true
    })
    this.getList()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    if (this.data.type === '2') {
      if (!this.data.hasMore) return
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getList()
    }
  },

  // 自定义分享给好友
  onShareAppMessage: function () {
    return {
      title: '带货助手商品列表',
      path: '/pages/shop/list/list?type=2'
    }
  },

  async getList() {
    wx.showLoading({
      title: '加载中...'
    })
    const res = await getTalentProductList({
      showdetail: 1,
      page_index: this.data.pageIndex,
      page_size: 10
    })
    wx.hideLoading()
    if (res.errcode !== 0) {
      wx.showToast({
        title: res.errmsg || '获取商品列表失败',
        icon: 'none'
      })
      return
    }

    const productList = res.productList || []
    this.setData({
      productList: [
        ...this.data.productList,
        ...productList
      ],
      hasMore: res.has_more
    })
  }

})