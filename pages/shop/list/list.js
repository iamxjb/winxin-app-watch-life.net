Page({
  data: {
    productList: [],
    storeAppId:''
  },

  onLoad(options) {
    const { productId, storeAppId} = options
    if (productId) {
      this.setData({
        productList: productId.split(','),
        storeAppId: storeAppId
      })
    }
  },
})