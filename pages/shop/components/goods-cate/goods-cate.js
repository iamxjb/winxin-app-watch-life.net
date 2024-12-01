import { getWechatGoodsCategory, getWechatCategoryGoodsList } from '../../lib/api'

Component({
  properties: {
  },
  data: {
    storeAppId:'',
    curCateId: '',
    cateList: [],
    activeIndex: 0, // 选中的一级菜单序号
    subActiveIndex: -1, // 选中的二级菜单序号
    goodsList: [],
    hasMore: true,
    pageContext: '', // 微信接口要求的分页参数
  },

  lifetimes: {
    ready: function () {
      this.getGoodsCate()
    },
  },

  methods: {
    // 左边分类菜单切换
    changeCate(e) {
      let activeIndex = e.currentTarget.dataset.index
      const item = this.data.cateList[activeIndex]
      this.setData({
        activeIndex,
        goodsList: [],
        hasMore: true,
        pageContext: '',
        curCateId: item.levelId
      })
      this.getGoodsList()
    },

    // 切换二级分类
    changeSubCate(e) {
      const { index, id } = e.currentTarget.dataset
      const item = this.data.cateList[this.data.activeIndex]

      this.setData({
        subActiveIndex: index,
        goodsList: [],
        hasMore: true,
        pageContext: '',
        curCateId: index === -1 ? item.levelId : id // 全部 index === -1
      })
      this.getGoodsList()
    },

    // 获取商品列表
    async getGoodsList(isLoadMore) {
      const levelId = this.data.curCateId
      if (!levelId) return

      let params = {
        showdetail: 1,
      }
      const ids = (levelId + '').split('_')
      params.level1id = ids[0]
      params.level2id = ids[1] || 0

      const { hasMore, pageContext } = this.data
      const loadMore = pageContext && hasMore
      if (isLoadMore && loadMore) {
        params.page_context = context
      }

      const res = await getWechatCategoryGoodsList(params)
      if (res.errcode === 0) {
        const list = res?.resp?.product_ids || []
        const goodsList = loadMore ? this.data.goodsList.push(...list) : list
        this.setData({
          storeAppId: res?.resp?.storeAppId || '',
          goodsList,
          hasMore: goodsList.length < res?.resp?.total_count
        })
      }
    },

    // 获取商品分类列表
    async getGoodsCate() {
      const res = await getWechatGoodsCategory()
      const list = this.fmtCateTree(res?.resp?.tree?.level_1 || [])

      this.setData({
        cateList: list,
        activeIndex: 0,
        subActiveIndex: -1,
        goodsList: [],
        hasMore: true,
        pageContext: '',
        curCateId: list?.[0]?.levelId
      })
      this.getGoodsList()
    },

    /**
     * 格式化分类树数据
     *
     * @param {*} arr
     * @param {*} parentId
     */
    fmtCateTree(arr, parentId) {
      return arr.map(m => {
        // 查询分类对应的商品列表时需要父级 id
        m.levelId = parentId ? `${parentId}_${m.id}` : m.id
        const childrenKey = Object.keys(m).find(k => k.startsWith('level_'))
        const children = m[childrenKey]
        if (children && children.length) {
          m.children = this.fmtCateTree(children, m.levelId)
        }

        return m
      })
    }
  }
})
