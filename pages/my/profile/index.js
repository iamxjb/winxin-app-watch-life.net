const app = getApp();
import config from '../../../utils/config.js'
Page({
  data: {
    userInfo: {},
    showModal: false,
    modalTitle:'',
    modalContent:'',
    ext: '',
    minapperName:config.minapperName
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title:'登录授权',
      success: function (res) {
        // success
      }
    }); 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  //获取用户信息
  getUserProfile() {
    this.login();
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          showModal: true,
          modalTitle: '授权成功',
          modalContent: '获取用户信息成功，点击下方按钮返回',
          ext: JSON.stringify({
            userInfo: res.userInfo,
            code: this.data.code
          })
        })
      },
      fail: (err) => {
        console.log(err.errMsg, "获取用户信息失败！");
        this.setData({
          showModal: true,
          modalTitle: '授权失败',
          modalContent: '获取用户信息失败，点击下方按钮返回',
          ext: JSON.stringify({
            errMsg: err.errMsg
          })
        })
      }
    });
  },
  //调用wx.login接口
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          this.setData({
            code: res.code,
          })
          console.log("请求wx.login成功！")
          console.log(this.data.code);
        } else {
          console.log('请求wx.login失败！' + res.errMsg)
        }
      }
    })
  },
  //隐藏弹窗
  hideModal() {
    this.setData({
      showModal: false
    })
  },
  //截断touchMove事件
  preventTouchMove() {},
  launchAppError(e)
  {
    console.log(e.detail.errMsg)
  },
  clickBtn() {
    this.setData({
      showModal: false
    })
  }
})