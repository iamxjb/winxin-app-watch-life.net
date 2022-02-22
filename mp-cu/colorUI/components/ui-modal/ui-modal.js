Component({
    data: {
        touch: false,
        showKey: false
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        noNav: {
            type: Boolean,
            value: false
        },
        target: {
            type: String,
            value: ''
        },
        ui: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        content: {
            type: String,
            value: ''
        },
        iconCancel: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        showCancel: {
            type: Boolean,
            optionalTypes: String,
            value: true
        },
        option: {
            type: Boolean,
            optionalTypes: String,
            value: true
        },
        cancelText: {
            type: String,
            value: '取消'
        },
        confirmText: {
            type: String,
            value: '确定'
        },
        name: {
            type: String,
            value: ''
        },
        align: {
            type: String,
            value: ''
        },
        dialog: {
            type: String,
            value: ''
        },
        tpl: {
            type: String,
            value: 'default'
        },
        transparent: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        mask: {
            type: Boolean,
            optionalTypes: String,
            value: true
        },
        duration: {
            type: Number,
            value: 0
        },
        top: {
            type: Number,
            value: 0
        }
    },
    lifetimes: {
        created() {
            //this.opacityStatus();

        },
        attached() {
            /*this.setData({
                isFristPage: app.cu_tools.sys_isFirstPage()
            });*/
        },
        ready() {

        },
    },
    observers: {
        show(res) {
            if (res) {
                this.setData({
                    showKey : true
                })
                if (this.data.duration != 0) {
                    setTimeout(() => {
                        this.hide();
                    }, this.data.duration);
                }
                setTimeout(() => {
                    this.setData({
                        touch: true,
                    })
                }, 500);
            }else{
                this.setData({
                    showKey : false
                })
            }
        },
    },
    methods: {
        hide() {
            if (this.data.touch) {
                this.setData({
                    showKey : false
                })
                this.closeModal()
            }
        },
        _cancel() {
            this.hide();
            if(typeof this.successBack == 'function') this.successBack( { 'cancel': true,'confirm': false})
            this.triggerEvent("success", { 'cancel': true,'confirm': false });
        },
        _confirm() {
            this.hide();
            if(typeof this.successBack == 'function')   this.successBack( { 'confirm': true ,'cancel': false})
            this.triggerEvent("success", { 'confirm': true ,'cancel': false});
        },
        _catchTap() {
            //this.hide();
        }
        /*opacityStatus() {
            let top = this.data.scrollTop;
            let val = top > this.data.sys_navBar ? 1 : top * 0.01;
            this.setData({
                opacityVal: val
            })
        },
        _navBack() {
            if (this.stopBack) {
                this.triggerEvent("navback");
            } else {
                app.cu_tools._backPage();
            }
        },
        _navHome() {
            app.cu_tools._toHome();
        },*/
    }
})