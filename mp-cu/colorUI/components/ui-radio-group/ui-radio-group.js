Component({
    relations: {
        '../ui-radio/ui-radio': {
            type: 'child', // 关联的目标节点应为子节点
            linked(target) {
                // 每次有子组件被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
            },
            linkChanged(target) {
                // 每次有子组件被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
            },
            unlinked(target) {
                // 每次有子组件被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
            }
        }
    },
    options: {
        addGlobalClass: true
    },
    properties: {
        ui: {
            type: String,
            value: ''
        },
        value: {
            type: String,
            optionalTypes: [Number, Boolean],
            value: ''
        },
        label: {
            type: String,
            optionalTypes: [Number, Boolean],
            value: ''
        },
        disabled: {
            type: Boolean,
            value: false
        },
        bg: {
            type: String,
            value: 'ui-BG-Main'
        },
        clearable: {
            type: Boolean,
            value: false
        }
    },
    lifetimes: {
        ready() {
            //this._deepSetValue()
        },
    },
    observers: {
        'value'(res) {
            this._deepSetValue()
        }
    },
    methods: {
        _deepSetValue() {
            let _this = this;
            let nodes = this.getRelationNodes('../ui-radio/ui-radio');
            if (Array.isArray(nodes)) {
                nodes.forEach((child) => {
                    if (typeof child._setValue == 'function') {
                        child._setValue(_this.data.value)
                    }
                });
            }
        },
        _onRadioChange(label) {
            this.triggerEvent('input', label);
            this.triggerEvent('change', label);
        },
    }
})