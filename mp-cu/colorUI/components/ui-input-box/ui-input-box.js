Component({
    data: {
        isVisible: false
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
        isType: {
            type: String,
            value: 'text'
        },
        value: {
            type: String,
            optionalTypes: Number,
            value: ''
        },
        showTag: {
            type: Boolean,
            value: false
        },
        maxlength: {
            type: Number,
            optionalTypes: String,
            value: 140
        },
        clear: {
            type: Boolean,
            value: false
        },
        isDisabled: {
            type: Boolean,
            value: false
        },
    },
    lifetimes: {
        attached() {
            //let _uid = this.getRandom(8);
            //this.setData({_uid: _uid})
        },
        ready() {
            //this._computedQuery();
        },
    },
    observers: {
        /*'value'(val) {
            this._setCurValue(val);
        },*/
    },
    methods: {
        _clear() {
            this.triggerEvent('clear');
        },
        _toggleVisible() {
            let isVisible = this.data.isVisible;
            this.triggerEvent('visible',!isVisible);
            this.setData({
                isVisible: !isVisible
            })
        },
    }
})