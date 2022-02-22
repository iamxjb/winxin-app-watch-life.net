Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true,
        //sys_navBar: getApp().ColorUi.sys_navBar
    },
    properties: {
        ui: {
            type: String,
            value: ''
        },
        bg: {
            type: String,
            value: 'bg-none'
        },
        title: {
            type: String,
            value: ''
        },
        desc: {
            type: String,
            value: ''
        },
        titleUi: {
            type: String,
            value: 'ui-TC'
        },
        descUi: {
            type: String,
            value: 'ui-TC-3'
        },
        depth: {
            type: Number,
            optionalTypes: String,
            value: 0
        },
        dot: {
            type: String,
            value: 'ui-BG-Main'
        },
        line: {
            type: String,
            value: 'ui-BG-Main'
        },
        isIcon: {
            type: Boolean,
            value: false
        },
        hasDot: {
            type: Boolean,
            value: false
        },
        hasLine: {
            type: Boolean,
            value: false
        },
        align: {
            type: String,
            value: 'left'
        },
        tpl: {
            type: String,
            value: 'default'
        },
        inLine: {
            type: Boolean,
            value: false
        }
    }
})