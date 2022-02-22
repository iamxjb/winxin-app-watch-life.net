Component({
    data: {
        searchVal: '', isEmpty: true,
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        barUi: {
            type: String,
            value: ''
        },
        barBg: {
            type: String,
            value: 'bg-white'
        },
        ui: {
            type: String,
            value: 'round'
        },
        bg: {
            type: String,
            value: ''
        },
        //图标
        icon: {
            type: String,
            value: '_icon-search'
        },
        type: {
            type: String,
            value: 'text'
        },
        //内容
        value: {
            type: null,
            value: ''
        },
        //占位内容
        placeholder: {
            type: String,
            value: '搜索'
        },
        //对齐方向 left center right
        align: {
            type: String,
            value: 'left'
        },
        //清空图标
        empty: {
            type: Boolean,
            value: true
        },
        //自定义清空图标
        emptyIcon: {
            type: String,
            value: '_icon-close'
        },
        //左边插槽
        isLeft: {
            type: Boolean,
            value: false
        },
        //右边插槽
        isRight: {
            type: Boolean,
            value: false
        },
        //是否禁用
        disabled: {
            type: Boolean,
            value: false
        }
    },
    lifetimes: {
        ready() {
            this.setSearchVal(this.data.value);
            this.setData({isEmpty: this.data.empty})
        }
    },
    observers: {
        'value'(val) {
            this.setSearchVal(val);
        },
        'empty'(val) {
            this.setData({isEmpty: val})
        },
    },
    methods: {
        //更新输入框内容
        setSearchVal(val) {
            this.setData({searchVal: val})
        },
        //输入时触发
        bindInput(e) {
            let val = e.detail.value;
            this.setSearchVal(val);
            this.triggerEvent('input',val);
        },
        //聚焦时触发
        bindFocus(e) {
            let val = e.detail.value;
            this.setSearchVal(val);
            this.triggerEvent('focus',val);
        },
        //失去焦点时触发
        bindBlur(e) {
            let val = e.detail.value;
            this.setSearchVal(val);
            this.triggerEvent('blur',val);
        },
        //点击完成按钮时触发
        bindConfirm(e) {
            let val = e.detail.value;
            this.setSearchVal(val);
            this.triggerEvent('confirm',val);
        },
        //清空内容
        onTapEmpty() {
            this.setSearchVal('');
            this.triggerEvent('empty');
        },
        //搜索栏被点击
        onTapSearch() {
            //禁用状态下才会生效
            if (this.data.disabled) {
                this.triggerEvent('onTap');
            }
        },
    },
})