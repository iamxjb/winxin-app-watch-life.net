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
// 打开地图
openMap() {
  var self = this
  wx.getFuzzyLocation({
    type: 'gcj02',
    success(res) {
      const latitude = parseFloat(self.data.shopInfo.latitude)
      const longitude = parseFloat(self.data.shopInfo.longitude)
      const name= self.data.shopInfo.location;
      const address = self.data.shopInfo.address;
      wx.openLocation({
        latitude,
        longitude,
        name,
        address,
        scale: 17
      })
    }
  })
},
  async getCooperationShopProductList(){
    const res = await getCooperationShopProductList({
      storeappid: this.data.storeAppId
    })
    if (res.errcode == 0) {
      const shopInfo = res.shopInfo
      var marker = {};
      var markers = [];
      if(shopInfo)
        {
          marker.latitude = parseFloat(shopInfo.latitude);
          marker.longitude = parseFloat(shopInfo.longitude);
          marker.id = 1
          marker.height = 50;
          marker.width = 40;
          marker.title = shopInfo.address;
          marker.display = "ALWAYS";
          markers.push(marker);
        }
      this.setData({
        productList: res.products || [],
        shopInfo: res.shopInfo|| {},
        markers: markers
      })
    }
  },
})