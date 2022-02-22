Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        ui: {
            type: String,
            value: ''
        },
        progress: {
            type: Number,
            optionalTypes: String,
            value: 0
        },
        progressArray: {
            type: Array,
            value: []
        },
        bg: {
            type: String,
            optionalTypes: Array,
            value: 'ui-BG-Main'
        },
        bgArray: {
            type: Array,
            value: ['ui-BG-Main', 'ui-BG-Main-1', 'ui-BG-Main-2', 'ui-BG-Main-3']
        },
        active: {
            type: Boolean,
            value: false
        },
        striped: {
            type: Boolean,
            value: false
        },
        radius: {
            type: Boolean,
            value: true
        },
        round: {
            type: Boolean,
            value: false
        },
        border: {
            type: Boolean,
            value: false
        },
        lg: {
            type: Boolean,
            value: false
        },
        sm: {
            type: Boolean,
            value: false
        },
        shadow: {
            type: String,
            optionalTypes: Boolean,
            value: ''
        }
    },
    methods: {

    }
})