Component({
    data: {
        touch: false,
    },
    options: {
        addGlobalClass: true,
        //multipleSlots: true
    },
    properties: {
        title: {
            type: String,
            value: ''
        },
        icon: {
            type: String,
            value: ''
        },
        position: {
            type: String,
            value: ''
        },
        duration: {
            type: Number,
            value: 1500
        },
        mask: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        isLoading: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
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
        title(val) {
            let _this = this;
			if (val && !_this.data.isLoading) {
                setTimeout(() => {
                    _this.hide();
                }, _this.data.duration);
            }
		}
    },
    methods: {
        hide(){
            this.setState({
                '$toast.title':'', 
                '$toast.icon':'',
                '$toast.image':'',
                '$toast.duration': 0,
                '$toast.mask': false,
                '$toast.isLoading': false,
            })
        }
    }
})