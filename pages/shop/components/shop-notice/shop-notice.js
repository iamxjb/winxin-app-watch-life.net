import { getWechatShopNotice, getWechatShopNoticeDetail  } from '../../lib/api'

Component({
  options: {
    addGlobalClass: false
  },
  properties: {},
  data: {
    list: [],
    noticeInfo: {},
    showNoticeDetail: false
  },

  lifetimes: {
    attached: function() {
      this.getData()
    },
  },

  methods: {
    async getData() {
      const res = await getWechatShopNotice({
        page: 1,
        per_page: 99
      })

      const list = res || []
      this.setData({
        list,
      })
    },

    async goNoticeDetail(e) {
      const { id } = e.currentTarget.dataset
      const res = await getWechatShopNoticeDetail({ id })
      this.setData({
        noticeInfo: res || {},
        showNoticeDetail: true,
      })
    },

    onCloseNoticeDetail() {
      this.setData({
        showNoticeDetail: false
      })
    },
  }
})
