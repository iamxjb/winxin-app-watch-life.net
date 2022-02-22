Component({
    data: {
        statusCur: '',
        capsuleStyle: {},
        capsuleBack: {},
        opacityVal: 0,
        isFirstPage: true
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        back: {
            //是否返回上一页
            type: Boolean,
            value: true
        },
        backtext: {
            //返回文本
            type: String,
            value: ''
        },
        ui: {
            type: String,
            value: ''
        },
        bg: {
            type: String,
            value: 'bg-blur'
        },
        status: {
            //状态栏颜色 可以选择light dark/其他字符串视为黑色
            type: String,
            value: ''
        },
        opacity: {
            //是否开启滑动渐变
            type: Boolean,
            value: false
        },
        opacityChange: {
            //开启滑动渐变后 文本样式是否翻转
            type: Boolean,
            value: false
        },
        opacityBg: {
            //开启滑动渐变后 返回按钮是否添加背景
            type: Boolean,
            value: false
        },
        noFixed: {
            //是否浮动
            type: Boolean,
            value: false
        },
        capsule: {
            //是否开启胶囊返回
            type: Boolean,
            value: false
        },
        stopBack: {
            type: Boolean,
            value: false
        },
        placeholder: {
            type: Boolean,
            value: true
        },
        isSlot: {
            type: Boolean,
            value: false
        },
        isCenter: {
            type: Boolean,
            value: false
        },
        isRight: {
            type: Boolean,
            value: false
        },
        scrollTop: {
            type: Number,
            value: 0
        },
    },
    lifetimes: {
        ready() {
            const page = this.sys_isFirstPage();
            this.setData({isFirstPage: page});
            this.opacityStatus();
        },
    },
    observers: {
        'scrollTop'() {
            this.opacityStatus();
        },
    },
    methods: {
        opacityStatus() {
            let {scrollTop, sys_navBar} = this.data;
            let val = scrollTop > sys_navBar ? 1 : scrollTop * 0.01;
            this.setData({opacityVal: val})
        },
        _navBack() {
            if (this.data.stopBack) {
                this.triggerEvent("navBack");
            } else {
                this._backPage();
            }
        },
        _navHome() {
            this._toHome();
        },
    }
})