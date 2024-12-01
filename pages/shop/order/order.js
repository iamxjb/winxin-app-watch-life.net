import { getWechatOrderList, getWechatMyOrderList } from '../lib/api'

Page({
  data: {
    tabList: [
      { title: '待付款', status: '10' },
      { title: '待发货', status: '20' },
      { title: '待收货', status: '30' },
      { title: '已完成', status: '100' },
      // { title: '已售完', status: '200' },
      { title: '已取消', status: '250' },
    ],
    active: '10',
    page: 1,
    pageSize: 10,
    orderList: [],
    empty: false,
    showOrderDetail: false,
    curOrder: {},
    ordertype: ''
  },

  onLoad: function (options) {
    this.setData({
      ordertype: options.ordertype
    })
    this.getOrderList(options.isRefresh)
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      orderList: []
    })
    this.getOrderList()
  },
  
  // 获取订单列表
  async getOrderList(isRefresh) {
    if (isRefresh) this.setData({
      page: 1,
      orderList: []
    })

    let openid = wx.getStorageSync('openid')
    let status = this.data.active
    let params = {
      status,
      openid,
    }

    wx.showLoading({
      title: '加载中',
    })
    let res
    const ordertype = this.data.ordertype
    if (ordertype === 'all') {
        res = await getWechatOrderList(params);
    } else if (ordertype === 'my' || !ordertype) {
      res = await getWechatMyOrderList(params);
    }
    wx.hideLoading()

    let list = res || []
    let orderList = this.data.orderList
    orderList.push(...list)
    let empty = !orderList.length

    this.setData({
      orderList,
      empty
    })
  },

  // 切换tab
  async onTabChange(e) {
    this.setData({
      active: e.detail,
      orderList: [],
      empty: false,
      page: 1
    })

    await this.getOrderList()
  },

  // 打开订单详情
  onOpenOrderDetail(e) {
    this.setData({
      curOrder: e.detail,
      showOrderDetail: true
    })
  },

  // 关闭订单详情
  onCloseOrderDetail() {
    this.setData({
      showOrderDetail: false
    })
  }
})