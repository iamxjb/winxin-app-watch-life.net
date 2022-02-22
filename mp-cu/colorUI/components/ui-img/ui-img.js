Component({
    data: {
        _uid: '',
        isLoad: true,
        error: false,
        detail: {},
        imgW: '',
        imgH: ''
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        src: {
            type: String,
            value: ''
        },
        ui: {
            type: String,
            value: ''
        },
        mode: {
            type: String,
            value: 'cover' //width cover self
        },
        width: {
            type: String,
            value: ''
        },
        height: {
            type: String,
            value: ''
        },
        preview: {
            type: Boolean,
            value: false
        },
        urls: {
            type: Array,
            value: []
        },
        current: {
            type: Number,
            value: -1
        },
        //加载本地图片
        local: {
            type: Boolean,
            value: false
        },
    },
    lifetimes: {
        ready() {
            let _uid = this.getRandom(8);
            this.setData({_uid: _uid})
            this._computed(this.data.detail);
        },
    },
    observers: {
        'width'(val) {
            this.setData({imgW: val})
        },
        'height'(val) {
            this.setData({imgH: val})
        }
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
        _computed({ is_width, is_height }) {
            let _this = this, {width, height} = this.data;
            if (width==='' && height==='') {
                wx.createSelectorQuery()
                    .in(this)
                    .select('#image-' + _this.data._uid)
                    .boundingClientRect(data => {
                        if (data != null) {
                            //let imgH = (data.width * is_height) / is_width + 'px';
                            //console.log(data.height,is_height,is_width)
                            _this.setData({imgH: data.height + 'px'})
                        } else {
                            console.log('image-' + _this.data._uid + ' data error');
                        }
                    })
                    .exec();
                return false;
            }
            if (width!=='' && height==='') {
                let imgH = (width * is_height) / is_width + 'px';
                _this.setData({imgH: imgH})
                return false;
            }
            if (width==='' && height!=='') {
                let imgW = (height * is_width) / is_height + 'px';
                _this.setData({imgW: imgW})
                return false;
            }
        },
        _computedWidth(width) {
            return width + 'px';
        },
        _computedHeight(height) {
            return height + 'px';
        },
        _load(e) {
            this.setData({
                detail: e.detail,
                isLoad: false
            })
            this._computed(e.detail);
        },
        _error(e) {
            this.setData({error: true})
        },
        _preview() {
            if (this.data.preview) {
                let _this = this;
                wx.previewImage({
                    urls: _this.data.urls.length<1?[_this.data.src]:_this.data.urls,
                    current: _this.data.current,
                    longPressActions: {
                        itemList: ['发送给朋友', '保存图片', '收藏'],
                        success(data) {
                            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
                        },
                        fail(err) {
                            console.log(err.errMsg);
                        }
                    }
                });
            }
        },
    }
})