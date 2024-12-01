import http from './http'
import config from '../config.js'

const domain = config.getDomain
const wp = `https://${domain}/wp-json/wp/v2/`
const wm = `https://${domain}/wp-json/minapper/v1/`

// ===================================================== 微信小店
// 获取扩展设置|get
export const getWechatShopExtOptions = params => http.get(`${wm}wechatshop/extoptions`, params)

// 获取商品详情
export const getWechatGoodsDetail = id => http.get(`${wm}wechatshop/product/${id}`)

// 获取商品列表
export const getWechatGoodsList = params => http.get(`${wm}wechatshop/product/getlist`, params)

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

// 获取微信小店店铺信息|get
export const getWechatShopInfo = params => http.get(`${wm}wechatshop/basicsinfo`, params)

// 获取微信小店精选展示位|get
export const getWechatShopBanner = params => http.get(`${wm}wechatshop/homepage/banner`, params)