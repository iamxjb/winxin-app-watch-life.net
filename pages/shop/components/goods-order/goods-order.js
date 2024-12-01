Component({
  properties: {
    tabList: {
      type: Array,
      value: []
    },
    active: {
      type: String,
      value: ''
    },
    orderList: {
      type: Array,
      value: []
    },
    empty: {
      type: Boolean,
      value: false
    },
    showOrderDetail: {
      type: Boolean,
      value: false
    },
    curOrder: {
      type: Object,
      value: {}
    },
  },
  data: {},

  methods: {
    onTabChange(e) {
      this.triggerEvent('onTabChange', e.detail.name)
    },

    onOpenOrderDetail(e) {
      const { info } = e.currentTarget.dataset
      this.triggerEvent('onOpenOrderDetail', info)
    },

    onCloseOrderDetail() {
      this.triggerEvent('onCloseOrderDetail')
    }
  }
})