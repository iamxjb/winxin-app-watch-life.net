Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        img: {
            type: String
        },
        imgHeight: {
            type: String,
            value: 'auto'
        },
        title: {
            type: String
        },
        fixedTitle: {
            type: Boolean,
            value: false
        },
        desc: {
            type: String
        },
        ui: {
            type: String
        },
        imgUi: {
            type: String
        },
        isTitle: {
            type: Boolean,
            value: true
        },
        isTag: {
            type: Boolean,
            value: false
        },
    },
    methods: {

    }
})