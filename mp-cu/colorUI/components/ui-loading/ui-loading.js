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
        size: {
            type: String,
            value: ''
        },
        img: {
            type: String,
            value: ''
        },
        color: {
            type: String,
            optionalTypes: Boolean,
            value: ''
        },
        isSlot: {
            type: Boolean,
            value: false
        },
    },
    methods: {

    }
})