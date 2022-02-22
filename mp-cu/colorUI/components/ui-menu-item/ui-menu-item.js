Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        ui: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        icon: {
            type: String,
            value: ''
        },
        arrow: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        isIcon: {
            type: Boolean,
            value: false
        },
        isAction: {
            type: Boolean,
            value: false
        }
    },
    methods: {

    }
})