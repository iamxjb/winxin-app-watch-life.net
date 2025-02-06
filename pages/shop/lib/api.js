import http from '../../../utils/new/http'
import config from '../../../utils/config.js'
const wm = `https://${config.getDomain}/wp-json/minapper/v1/`
const wh = `https://${config.getDomain}/wp-json/watch-life-net/v1/`

// ===================================================== 微信小店
// 获取微信小店店铺信息
export const getWechatShopInfo = params => http.get(`${wm}wechatshop/basicsinfo`, params)

// 获取微信小店公告
export const getWechatShopNotice = params => http.get(`${wm}wechatshop/posts/announcement`, params)

// 获取微信小店公告详情
export const getWechatShopNoticeDetail = params => http.get(`${wm}wechatshop/posts/${params.id}`)

// 获取扩展设置
export const getWechatShopExtOptions = params => http.get(`${wm}wechatshop/extoptions`, params)

// 获取微信小店精选展示位
export const getWechatShopBanner = params => http.get(`${wm}wechatshop/homepage/banner`, params)

// 获取商品列表
export const getWechatGoodsList = params => http.get(`${wm}wechatshop/product/getlist`, params)

// 获取商品详情
export const getWechatGoodsDetail = id => http.get(`${wm}wechatshop/product/${id}`)

// 获取商品分类
export const getWechatGoodsCategory = () => http.get(`${wm}wechatshop/classificationtree`)

// 获取分类对应的商品列表
export const getWechatCategoryGoodsList = params => http.get(`${wm}wechatshop/classificationtree/product`, params)

// 获取精选商品和热销商品
export const getWechatHotGoodsList = params => http.get(`${wm}wechatshop/extptions`, params)

// 获取订单列表
export const getWechatOrderList = params => http.get(`${wm}wechatshop/order/list`, params)

// 获取我的订单列表
export const getWechatMyOrderList = params => http.get(`${wm}wechatshop/order/my`, params)

// 添加或修改微信小店|post
export const postWechatShopInfo = params => http.post(`${wh}weixin/updatewechatshopinfo`, params)

// ===================================================== 合作微信小店
// 获取合作小店的商品|get
export const getCooperationShopProductList = params => http.get(`${wm}miniprogram/cooperation/shop/product/list`, params)

// 获取合作小店的列表|get
export const getCooperationShopList = params => http.get(`${wm}miniprogram/cooperation/shop/list`, params)


// 获取合作小店的订单|get
export const getCooperationShopOrderList = params => http.get(`${wm}miniprogram/cooperation/shop/order/list`, params)

// 获取合作小店的用户订单|get
export const getCooperationShopMyOrderList = params => http.get(`${wm}miniprogram/cooperation/shop/order/my`, params)
