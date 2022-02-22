Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        direction: {
            type: String,
            value: 'row'
        },
        ui: {
            type: String,
            value: ''
        },
        arrow: {
            type: Boolean,
            value: false
        },
        number: {
            type: Boolean,
            value: false
        },
        column: {
            type: Boolean,
            value: false
        },
        cur: {
            type: Number,
            value: 0
        },
        curStyle: {
            type: String,
            value: 'ui-TC-Main'
        },
        err: {
            type: Number,
            value: 0
        },
        info: {
            type: Array,
            value: []
        }
    }
})