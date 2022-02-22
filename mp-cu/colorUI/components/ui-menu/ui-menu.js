Component({
    options: {
        addGlobalClass: true,
        //multipleSlots: true
    },
    properties: {
        ui:{
            type: String,
            value: ''
        },
        bg: {
            type: String,
            value: 'ui-BG'
        },
        border: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        smBorder: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        shadow: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
        radius: {
            type: Boolean,
            optionalTypes: String,
            value: false
        },
    },
    methods: {

    }
})