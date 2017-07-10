// readlog.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
 
  data: {
    userInfo: {},
    readLogs: []
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });


   


  },

  // 跳转至查看文章详情
  redictDetail: function (e) {
    // console.log('查看文章');
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  
  onShow:function(options)
  {
    this.setData({
      readLogs: (wx.getStorageSync('readLogs') || []).map(function (log) {
        return log;
      })
    });
  }
})