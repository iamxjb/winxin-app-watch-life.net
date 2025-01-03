Component({
  properties: {
    shopInfo: {
      type: Object,
      value: {}
    },
    storeAppId: {
      type: String,
      value: ''
    },
    productList: {
      type: Array,
      value: []
    },
    hostProductList: {
      type: Array,
      value: []
    },
    tabList: {
      type: Array,
      value: []
    },
    activeTab: {
      type: Number,
      value: 0
    },
  },
  data: {},

  methods: {
    onTabChange(e) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent('onTabChange', index)
    },
  }
})