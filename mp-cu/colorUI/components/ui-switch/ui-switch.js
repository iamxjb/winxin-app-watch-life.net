Component({
    data: {
        tempChecked: false
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        ui: {
            type: String,
            value: ''
        },
        bg: {
            type: String,
            value: 'ui-BG-Main'
        },
        text: {
            type: String,
            value: ''
        },
        checked: {
            type: Boolean,
            value: false
        },
        size: {
            type: String,
            value: 'sm'
        },
        disabled: {
            type: Boolean,
            value: false
        }
    },
    lifetimes: {
        created() {
            let checked = this.data.checked;
            this.setData({
                tempChecked: checked
            });
        },
        attached() {

        },
        ready() {

        },
    },
    observers: {
        'checked'(res) {
            this.setData({
                tempChecked: res
            });
        }
    },
    methods: {
        clickSwitch() {
            let val = !this.data.tempChecked;
            this.setData({
                tempChecked: val
            });
            this.triggerEvent('change', val);
        }
    }
})