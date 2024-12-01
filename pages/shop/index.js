const app = getApp()
import config from '../../utils/config.js'
import { getWechatShopInfo, getWechatGoodsList } from './lib/api'
let COMPONENT_CATE

Page({
  data: {
    shopInfo: {},
    storeAppId: '',
    productList: [],
    shareTitle: '小店',
    memberUserInfo: {},
    hasMore: true,
    tabList: [
      { name: '商品' },
      { name: '分类' },
    ],
    activeTab: 0,
    nextKey: '',
  },

  onLoad: function (option) {
    this.getShopInfo()
    this.getShopProducts()

    // 设置系统分享菜单
    wx.showShareMenu({
      withShareTicket: false,
      menus: ['shareAppMessage']
    })
  },

  // 自定义分享朋友圈
  // onShareTimeline: function () {
  //   let name = app.globalData.appName
  //   let shareTitle = name + '-' + this.data.shareTitle
  //   return {
  //     title: shareTitle
  //   }
  // },
  // 自定义分享给好友
  onShareAppMessage: function () {
    let name = ''
    const source = config.minapperSource
    if (source === 'pro') {
      name = app.globalData.appName
    } else if (source === 'free') {
      name = config.getWebsiteName
    }

    return {
      title: name + '-' + this.data.shareTitle,
      path: '/pages/shop/index'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      productList: [],
      page: 1,
      hasMore: true
    })
    this.getShopProducts()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    const tab = this.data.activeTab
    if (tab === 0) { // 商品
      if (!this.data.hasMore) return
      this.setData({
        page: this.data.page + 1
      })
      this.getShopProducts()
    } else if (tab === 1) {
      if (!COMPONENT_CATE) {
        COMPONENT_CATE = this?.selectComponent('#goods-home')?.selectComponent('#goods-cate')
      }
      COMPONENT_CATE?.getGoodsList(true)
    }
  },

  // 切换商品/分类
  onTabChange(e) {
    this.setData({
      activeTab: e.detail
    })
  },

  // 轮播和热销商品
  async getShopInfo() {
    const res = await getWechatShopInfo()
    this.setData({
      shopInfo: res.info || {}
    })
  },

  // 获取商品列表
  async getShopProducts(isRefresh) {
    let { productList, nextKey } = this.data
    let params = {
      showdetail: 0, // 是否显示商品详情，1-显示，0-不显示
    }
    if (!isRefresh && nextKey) {
      params.next_key = nextKey
    }

    const res = await getWechatGoodsList(params)
    let list = []
    let storeAppId = ''
    if (res.errcode === 0) {
      list = res.product_ids || []
      storeAppId = res.storeAppId || ''
      if (isRefresh) {
        productList = list
      } else {
        productList.push(...list)
      }
    }

    this.setData({
      productList,
      storeAppId,
      hasMore: productList.length < res.total_num
    })
  },
})
