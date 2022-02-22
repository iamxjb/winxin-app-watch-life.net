Component({
    relations: {
        '../ui-checkbox/ui-checkbox': {
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
    data: {
        group:[],
        all:[],
        isAllChecked:false,
        isIndeterminate:false
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
        value: {
            type: String,
            optionalTypes: Array,
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
            this._deepSetValue()
        },
    },
    observers: {
        'value'(val) {
            this.setData({
                all: [],
                group: val
            });
            this._deepSetValue()
        },
        'group'(val) {
            let {all, group} = this.data;
            this.setData({
                isAllChecked: all.length === group.length,
                isIndeterminate: group.length > 0
            });
        }
    },
    methods: {
        _deepSetValue() {
            let _this = this, all = this.data.all;
            let nodes = this.getRelationNodes('../ui-checkbox/ui-checkbox');
            if (Array.isArray(nodes)) {
                nodes.forEach((child) => {
                    if(!child.data.all) {
                        all.push(child.data.value);
                        _this.setData({
                            all: all
                        });
                    }
                    if (typeof child._setValue == 'function') {
                        child._setValue(_this.data.value)
                    }
                });
            }
        },
        _onCheckboxChange(value) {
            let group = this.data.group;
            let index = group.indexOf(value);
            if(index === -1){
                group.push(value)
            } else {
                group.splice(index,1)
            }
            this.setData({
                group: group
            });
            this._onChangeEvent(group);
        },
        _onCheckboxAll(isAll){
            let {group, all} = this.data;
            if(isAll){
                group = all;
            } else {
                group = [];
            }
            this.setData({
                group: group
            });
            this._onChangeEvent(group);
        },
        _onChangeEvent(val) {
            let {isAllChecked, isIndeterminate} = this.data;
            this.triggerEvent('input', val);
            this.triggerEvent('change', val);
            this.triggerEvent('all', {
                value: isAllChecked,
                indeterminate: isIndeterminate
            });
        },
    }
})