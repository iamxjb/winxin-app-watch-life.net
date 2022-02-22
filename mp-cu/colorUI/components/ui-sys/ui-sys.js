Component({
    data: {
        isLoading: false,
        tabBarIndex: 0,
        isFooter: false,
    },
    options: {
        addGlobalClass: true,
    },
    properties: {
        bg: {       //背景颜色
            type: String,
            value: 'ui-BG-2'
        },
        ui: {       //其他class
            type: String,
            value: ''
        },
        img: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        navBg: {
            type: String,
            value: 'bg-blur'
        },
        styles: {   //样式
            type: String,
            value: ''
        },
        loading: {  //是否加载
            type: String,
            optionalTypes: Boolean,
            value: 'auto'
        },
        tabbar: {
            type: Boolean,
            value: false
        },
        footer: {
            type: Boolean,
            value: ''
        },
        loadingIcon: {
            type: String,
            value: '_icon-loading'
        },
    },
    lifetimes: {
        created() {
            this.setLoading();
        },
        attached() {
            let loading = this.data.loading;
            this.setData({isLoading: loading});
        },
        ready() {
            this.setTabBar();
            this.setFooterShow();
        },
    },
    observers: {
        'tabbar'() {
            this.setTabBar();
        },
        'loading'(val) {
            this.setData({isLoading: val})
            this.setLoading();
        },
        'footer'() {
            this.setFooterShow();
        },
    },
    methods: {
        setTabBar() {
            let tabBar = this.data.tabbar;
            if (tabBar) {
                wx.hideTabBar();
                this._onPage();
            }
        },
        setFooterShow() {
            let footer = this.data.footer;
            let cuFooter = this.data.$cuConfig.footer;
            let isFooter = cuFooter;
            if (footer === '') {
                isFooter = cuFooter;
            } else {
                isFooter = footer;
            }
            this.setData({isFooter: isFooter})
        },
        _onPage() {
            let page = getCurrentPages();
            if (page.length > 0) {
                let _this = this, tabBar = this.data.$cuConfig.tabBar;
                let url = page[page.length - 1].route
                tabBar.map((item,index)=>{
                    if(item.url === '/' + url) {
                        _this.setData({tabBarIndex: index})
                    }
                })
            } else {
                this.setData({tabBarIndex: 0})
            }
        },
        setLoading() {
            let _this = this, loading = this.data.loading;
            setTimeout(() => {
                if (loading === 'auto') {
                    _this.setData({isLoading: false})
                }
            }, 800);
        },
        modalSuccess() {
           return this.data.$cuStore.$Modal
        },
    },
})