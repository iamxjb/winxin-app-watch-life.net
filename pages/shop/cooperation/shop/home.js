import { getCooperationShopProductList } from '../../lib/api'

Page({
  data: {},

  onLoad(options) {
    const { storeAppId, nickname } = options
    wx.setNavigationBarTitle({
      title: nickname + '的商品'
    })
    this.setData({
      storeAppId
    })

    this.getCooperationShopProductList()
  },

  async getCooperationShopProductList(){
    const res = await getCooperationShopProductList({
      storeappid: this.data.storeAppId
    })
    if (res.errcode == 0) {
      this.setData({
        productList: res.products || []
      })
    }
  },
})