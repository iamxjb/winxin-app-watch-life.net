Component({
    data: {
        _uid: '',
        curValue: 0,
        tabNodeList: [],
        scrollLeft: 0,
        markLeft: 0,
        markWidth: 0,
        content: {
            width: 100
        },
        over: false,
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        value: {
            type: Number,
            value: 0
        },
        ui: {
            type: String,
            value: ''
        },
        bg: {
            type: String,
            value: 'ui-BG'
        },
        tab: {
            type: Array,
            value: []
        },
        // line dot long
        tpl: {
            type: String,
            value: 'line'
        },
        mark: {
            type: String,
            value: ''
        },
        align: {
            type: String,
            value: ''
        },
        curColor: {
            type: String,
            value: 'ui-TC'
        },
        scroll: {
            type: Boolean,
            value: false
        },
        inline: {
            type: Boolean,
            value: false
        }
    },
    lifetimes: {
        attached() {
            let _uid = this.getRandom(8);
            this.setData({_uid: _uid})
        },
        ready() {
            this._computedQuery();
        },
    },
    observers: {
        'tab'() {
            this._computedChildQuery();
        },
        'value'(val) {
            if (val === this.data.curValue) {
                return false;
            } else {
                this._setCurValue(val);
            }
        },
    },
    methods: {
        //生成随机字符串
        getRandom(num) {
            let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let maxPos = chars.length, value = '';
            for (let i = 0; i < num; i++) {
                value += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return value;
        },
        _computedQuery() {
            let _this = this, _uid = this.data._uid;
            wx.createSelectorQuery().in(this).select('#ui-tab-' + _uid).boundingClientRect(data => {
                if (data != null) {
                    if (data.left === 0 && data.right === 0) {
                        _this._computedQuery();
                    } else {
                        _this.setData({content: data})
                        _this._computedChildQuery();
                        setTimeout(() => {
                            _this.setData({over: true})
                        }, 300);
                    }
                }
            }).exec();
        },
        _computedChildQuery() {
            let _this = this,  {tab, _uid, tabNodeList, curValue} = this.data;
            for (let i = 0; i < tab.length; i++) {
                let item = '#ui-tab-item-' + _uid + '-' + i;
                wx.createSelectorQuery().in(this).select(item).boundingClientRect(data => {
                    if (data != null) {
                        tabNodeList[i] = data;
                        _this.setData({
                            tabNodeList: tabNodeList
                        })
                        if (i === curValue) {
                            _this._computedMark();
                        }
                    }
                }).exec();
            }
        },
        _setCurValue(value) {
            let curValue = this.data.curValue;
            if (value === curValue) {
                return false;
            } else {
                this.setData({curValue: value})
                this._computedMark();
            }
        },
        _click(e) {
            let {index, item} = e.currentTarget.dataset;
            this._setCurValue(index);
            this.triggerEvent('input', index);
            this.triggerEvent('change', { index: index, data: item });
        },
        _computedMark() {
            let {tabNodeList, curValue, content} = this.data;
            if (tabNodeList.length === 0) return;
            let list = tabNodeList, cur = curValue;
            let markLeft = list[cur].left - content.left;
            let markWidth = list[cur].width;
            this.setData({
                markLeft: markLeft,
                markWidth: markWidth
            })
        },
        _computedScroll() {
            let {tabNodeList, curValue} = this.data;
            if (curValue === 0 || curValue === tabNodeList.length - 1) {
                return false;
            } else {
                let i = 0, left = 0, list = tabNodeList;
                for (i in list) {
                    if (i === curValue && i !== 0) {
                        left = left - list[i - 1].width;
                        break;
                    }
                    left = left + list[i].width;
                }
                this.setData({
                    scrollLeft: left
                })
            }
        }
    }
})