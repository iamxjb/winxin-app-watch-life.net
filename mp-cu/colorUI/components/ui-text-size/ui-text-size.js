Component({
    data: {
        textSizeSet: false,
        size: ['sm', 'df', 'lg', 'xl', 'xxl']
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        ui: {
            type: String,
            value: ''
        }
    },
    lifetimes: {
        ready() {

        },
    },
    methods: {
        textSizeSetShow() {
            this.setData({
                textSizeSet: true
            })
        },
        sliderChange(e) {
            this.setText(e.detail.value)
        },
    }
})