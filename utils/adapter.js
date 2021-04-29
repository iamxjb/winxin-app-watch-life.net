var wxRequest = require('wxRequest.js')
var Api = require('api.js');
// 获取小程序插屏广告
function setInterstitialAd(pagetype) {
    var getOptionsRequest = wxRequest.getRequest(Api.getOptions());
    getOptionsRequest.then(res => {

      // 获取广告id，创建插屏广告组件
      var adUnitId=res.data.interstitialAdId;

      var enableAd=false;

      var enable_index_interstitial_ad=res.data.enable_index_interstitial_ad;
      var enable_detail_interstitial_ad=res.data.enable_detail_interstitial_ad;
      var enable_topic_interstitial_ad=res.data.enable_topic_interstitial_ad;
      var enable_list_interstitial_ad=res.data.enable_list_interstitial_ad;
      var enable_hot_interstitial_ad=res.data.enable_hot_interstitial_ad;
      var enable_comments_interstitial_ad=res.data.enable_comments_interstitial_ad;
      var enable_live_interstitial_ad=res.data.enable_live_interstitial_ad;
      if(!res.interstitialAdId) return;
      let interstitialAd = wx.createInterstitialAd({
        adUnitId: adUnitId
      })
      // 监听插屏错误事件
      interstitialAd.onError((err) => {
        console.error(err)
      })
      // 显示广告
      if (interstitialAd) {
        switch(pagetype)
        {
          case 'enable_index_interstitial_ad':
            if(enable_index_interstitial_ad=="1")
            {
              enableAd=true;
            }
            break;

            case 'enable_detail_interstitial_ad':
            if(enable_detail_interstitial_ad=="1")
            {
              enableAd=true;
            }
            break;

            case 'enable_topic_interstitial_ad':
            if(enable_topic_interstitial_ad=="1")
            {
              enableAd=true;
            }
            break;

            case 'enable_list_interstitial_ad':
            if(enable_list_interstitial_ad=="1")
            {
              enableAd=true;
            }
            break;

            case 'enable_hot_interstitial_ad':
            if(enable_hot_interstitial_ad=="1")
            {
              enableAd=true;
            }
            break;

            case 'enable_comments_interstitial_ad':
            if(enable_comments_interstitial_ad=="1")
            {
              enableAd=true;
            }
            break;

            case 'enable_live_interstitial_ad':
            if(enable_live_interstitial_ad=="1")
            {
              enableAd=true;
            }
            break;

        }
        if(enableAd)
        {
          interstitialAd.show().catch((err) => {
            console.error(err)
          })
        }
        
      }
    })
  }

module.exports = {
    setInterstitialAd: setInterstitialAd,
}
