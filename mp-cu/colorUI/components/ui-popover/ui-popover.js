let button = {}
Component({
    name : 'UiPopover',
    data: {
        popover: false,
        BoxStyle: '',
        contentStyle: '',
        arrowStyle: '',
        content: {},
        _uid: 0,
        sys_layer: 0
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        ui: {
            type: String,
            value: ''
        },
        tips: {
            type: String,
            value: ''
        },
        bg: {
            type: String,
            value: 'ui-BG'
        },
        mask: {
            type: Boolean,
            value: false
        },
        show: {
            type: Boolean,
            optionalTypes: String,
            value: 'change'
        },
        hover: {
            type: Boolean,
            value: false
        },
        index: {
            type: Number,
            value: 0
        },
        time: {
            type: Number,
            value: 0
        },
        bottom: {
            type: Boolean,
            value: false
        },
        isChange: {
            type: Boolean,
            value: false
        },
        zIndex: {
            type: Number,
            optionalTypes: String,
            value: 0
        },
    },

    lifetimes: {
        attached() {
            this.setData({
                _uid: this.__wxWebviewId__
            })
            wx.nextTick(() => {
                this._computedQuery(wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowHeight);
            })
        },
    },
    observers: {
        'popover'(val) {
            this._computedQuery(wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowHeight);
            if (val) {
                if (this.data.tips != '' || this.data.time > 0) {
                    setTimeout(
                        () => {
                            this.setData({
                                popover: false
                            })
                        },
                        this.data.time == 0 ? 3000 : this.data.time
                    );
                }
                this.setData({
                    zIndex : this.data.zIndex + 600
                })
            }else{
                this.setData({
                    zIndex : this.data.zIndex + 600
                })
            }
            // this.$emit('update:show', val);
        },
        'show'(val) {
            this.setData({
                popover : val
            })
        }
    },
    methods: {
        closePopover(){
            this.setData({
                popover : false
            })
        },
        _computedQuery(w, h) {
            wx.createSelectorQuery()
                .in(this)
                .select('#popover-button-' + this.data._uid)
                .boundingClientRect(res => {
                    if (res != null) {
                        button = res;
                    } else {
                        console.log('popover-button-' + this.data._uid + ' data error');
                    }
                })
                .select('#popover-content-' + this.data._uid)
                .boundingClientRect(
                    content => {
                        if (content != null) {
                            this.setData({
                                content: content
                            })
                            let contentStyle = '';
                            let arrowStyle = '';
                            this.setData({
                                BoxStyle: `width:${w}px; left:-${button.left}px;z-index: ${this.data.zIndex  + 102}`
                            })
                            // 判断气泡在上面还是下面
                            if (button.bottom < h / 2 || this.data.bottom) {
                                // '下';
                                contentStyle = contentStyle + `top:10px;`;
                                arrowStyle = arrowStyle + `top:${-5}px;`;
                            } else {
                                // '上';
                                contentStyle = contentStyle + `bottom:${button.height + 10}px;`;
                                arrowStyle = arrowStyle + `bottom:${-5}px;`;
                            }

                            // 判断气泡箭头在左中右
                            let btnCenter = button.right - button.width / 2;
                            let contentCenter = content.right - content.width / 2;
                            if ((btnCenter < w / 3 && content.width > btnCenter) || (content.width > w / 2 &&
                                btnCenter < w / 2)) {
                                // '左';
                                contentStyle = contentStyle + `left:10px;`;
                                arrowStyle = arrowStyle + `left:${btnCenter - 17}px;`;
                            } else if ((btnCenter > (w / 6) * 4 && content.width > w - btnCenter) || (content.width >
                                w / 2 && btnCenter > w / 2)) {
                                // '右';
                                contentStyle = contentStyle + `right:10px;`;
                                arrowStyle = arrowStyle + `right:${w - btnCenter - 17}px;`;
                            } else {
                                // '中';
                                contentStyle = contentStyle +
                                    `left:${button.left - content.width / 2 + button.width / 2}px;`;
                                arrowStyle = arrowStyle + `left:0px;right:0px;margin:auto;`;
                            }
                            this.setData({
                                arrowStyle: arrowStyle + `z-index:${this.data.zIndex  + 1};`,
                                contentStyle: contentStyle + `z-index:${this.data.zIndex + 2};`
                            })
                        } else {
                            console.log('popover-content-' + this.data._uid + ' data error');
                        }
                    }
                )
                .exec()
        },
        popoverClick() {
            if (this.data.isChange) {
                return false
            }
            if (this.data.tips == '') {
                this.setData({
                    popover: !this.data.popover
                })
            } else {
                this.setData({
                    popover: true
                })
            }
        },
    }
})