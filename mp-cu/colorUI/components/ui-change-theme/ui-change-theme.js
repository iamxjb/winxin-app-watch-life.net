Component({
    data: {
        color: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown', 'grey'],
        target: '',
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true,
    },
    properties: {
        ui: {
            type: String,
            value: ''
        },
    },
    lifetimes: {
        created() {

        },
        attached() {
            
        },
        ready() {

        },
    },
    methods: {
        tapAutoThemeChange(e) {
            let val = e.currentTarget.dataset.value;
            this.setTheme( val === 'auto'?'light':'auto')
        },
        tapThemeChange(e) {
            this.setTheme(e.currentTarget.dataset.value)
        },
        tapColorPicker() {
            this.setData({
                target: 'colorPicker'
            })
        },
        tapChooseColor(e) {
            this.setMain(e.currentTarget.dataset.value)
        },
    }
})