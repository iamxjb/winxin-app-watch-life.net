Component({
    options: {
        addGlobalClass: true,
        //multipleSlots: true
    },
    properties: {
        bg: {
            type: String,
            value: 'ui-BG'
        },
        ui: {
            type: String,
            value: ''
        },
        src: {
            type: String,
            value: ''
        },
        srcs: {
            type: Array,
            value: []
        },
        icon: {
            type: String,
            value: ''
        },
        stack: {
            type: Boolean,
            value: false
        },
        reverse: {
            type: Boolean,
            value: false
        },
        first: {
            type: Boolean,
            value: false
        },
    },
    methods: {

    }
})