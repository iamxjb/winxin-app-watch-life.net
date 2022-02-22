Component({
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
            value: 'ui-BG-3'
        },
        info: {
            type: String,
            value: ''
        },
        src: {
            type: String,
            value: ''
        },
        badge: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        icon: {
            type: Boolean,
            value: false
        },
        isSlot: {
            type: Boolean,
            value: false
        },
    }
})