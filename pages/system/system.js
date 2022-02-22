const app = getApp();
Page({
    data: {
        title: '系统', bg: '', bgImg: '', navBg: 'bg-blur', loading: 'auto', tabbar: false, footer: true,
        isBg: false, isNavBg: false, code: '<ui-sys></ui-sys>'
    },
    //启用背景图
    isBgChange(e) {
        let title = '系统', bg = '', bgImg = '';
        if (e.detail) {
            title = '';
            bg = 'bg-img';
            bgImg = '/static/img/4put2.png';
        }
        this.setData({
            isBg: e.detail,
            bg: bg,
            title: title,
            bgImg: bgImg
        })
    },
    // 标题栏背景色
    isNavBgChange(e) {
        let navBg = 'bg-blur';
        if (e.detail) {
            navBg = 'bg-red';
        }
        this.setData({
            isNavBg: e.detail,
            navBg: navBg
        })
    },
    //开启TabBar
    isTabBarChange(e) {
        this.setData({
            tabbar: e.detail
        })
    },
    //开启底部版权
    isFooterChange(e) {
        this.setData({
            footer: e.detail
        })
    },
    //加载
    isLoader() {
        let _this = this;
        _this.setData({
            loading: true
        })
        setTimeout(() => {
            _this.setData({
                loading: false
            })
        }, 30000);
    },
})