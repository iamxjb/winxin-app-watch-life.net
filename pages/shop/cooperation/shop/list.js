import { getCooperationShopList } from '../../lib/api'

Page({
  data: {
    shopList:{}
  },

  onLoad() {
    this.getShopList()
  },

  async getShopList() {
    const res = await getCooperationShopList()
    if (res.errcode == 0) {
      const shopList = res.shop_list || []
      this.setData({
        shopList
      })      
    }
  },

  openStoreProduct(e) {
    const { item } = e.currentTarget.dataset
    const storeAppId = item.appid
    const nickname = item.nickname
    wx.navigateTo({
      url: '/pages/shop/cooperation/shop/home?storeAppId=' + storeAppId + '&nickname=' + nickname,
      fail: (err) => {
        console.log(err)
      }
    })
  },
})