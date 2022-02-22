Component({
    data: {
        //cur: 0
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        datas: {
            type: Array,
            value: []
        },
        cur: {
            type: Number,
            value: 0
        },
        tpl: {
            type: String,
            value: ''
        },
        icon: {
            type: String,
            value: ''
        },
        bg: {
            type: String,
            value: 'bg-blur'
        },
        ui: {
            type: String,
            value: ''
        },
        curText: {
            type: String,
            value: 'ui-TC-Main'
        },
        text: {
            type: String,
            value: 'text-c'
        },
        noFixed: {
            type: Boolean,
            value: false
        },
        main: {     //主色
            type: String,
            value: 'blur'
        },
    },
    lifetimes: {
        created() {

        },
        attached() {

        },
        ready() {

        },
    },
    methods: {
        clickItem(e) {
            let item = e.currentTarget.dataset.item;
            if (item.type === 'tab') {
                wx.switchTab({
                    url: item.url
                });
                this.setState({
                    sys_home_page : item.url
                })
            } else if (item.type === 'nav') {
                wx.navigateTo({
                    url: item.url
                });
            } else if (item.type === 'tap') {
                this.triggerEvent("tap",item);
            }
        }
    }
})