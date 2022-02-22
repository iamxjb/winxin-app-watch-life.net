Component({
    data: {
        slots: {},
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
        contentui: {
            type: String,
            value: ''
        },
        icon: {
            type: String,
            value: ''
        },
        disabled: {
            type: Boolean,
            value: false
        },
        required: {
            type: Boolean,
            value: false
        },
        titleTop: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: ''
        },
        isAction: {
            type: Boolean,
            value: false
        },
    },
    lifetimes: {
        attached() {

        },
        ready() {

        },
    },
    observers: {

    },
    methods: {

    }
})