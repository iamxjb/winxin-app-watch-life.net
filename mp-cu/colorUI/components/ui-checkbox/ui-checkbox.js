Component({
    relations: {
        '../ui-checkbox-group/ui-checkbox-group': {
            type: 'parent'
        }
    },
    data: {
        currentValue: null,
        isIndeterminate:false,
        isGroup: null,
        isDisabled: null,
        isChecked: null,
        hasUiCard: null
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
        unbg: {
            type: String,
            value: 'borderss'
        },
        indeterminate: {
            type: Boolean,
            value: false
        },
        all: {
            type: Boolean,
            value: false
        }
    },
    lifetimes: {
        ready() {
            let parent = this._nodesSetValue();
            if (parent) {
                this._setValue(parent.data.value);
            }
        },
    },
    observers: {
        'value'(val) {
            this.setData({
                currentValue: val
            });
            this.isComputed();
        },
        'indeterminate'(val) {
            this.setData({
                isIndeterminate: val
            });
            this.isComputed();
        }
    },
    methods: {
        _nodesSetValue() {
            let radioNodes = this.getRelationNodes('../ui-checkbox-group/ui-checkbox-group');
            if (Array.isArray(radioNodes) && radioNodes.length > 0) {
                return radioNodes[0];
            } else {
                return false;
            }
        },
        isComputed() {
            let {disabled, currentValue, value, ui} = this.data;
            let parent = this._nodesSetValue();
            //isGroup
            let isGroup = !!parent;
            //isDisabled
            let isDisabled = isGroup?parent.data.disabled:disabled;
            //isChecked
            let isChecked;
            if (typeof currentValue == 'boolean') {
                isChecked = currentValue;
            } else {
                isChecked = isGroup && parent.data.group.indexOf(value) !== -1;
            }
            //_has
            let hasUiCard = ui.indexOf('card') !== -1;

            //isAllChecked="{{isAllChecked}}"
            //isIndeterminate="{{isIndeterminate}}"

            //设置数据
            this.setData({
                isGroup: isGroup,
                isDisabled: isDisabled,
                isChecked: isChecked,
                hasUiCard: hasUiCard
            });
        },
        _onCheckboxClick() {
            let {isGroup, isDisabled, isChecked} = this.data;
            if (isGroup && !isDisabled) {
                this._choose();
            }
            if (!isGroup && !isDisabled) {
                this.triggerEvent('input', !isChecked);
                this.triggerEvent('change', !isChecked);
            }
        },
        _choose() {
            let {isGroup, isChecked, value, all} = this.data;
            this.triggerEvent('input', !isChecked);
            this.triggerEvent('change', !isChecked);
            if (isGroup) {
                let parent = this._nodesSetValue();
                if(all) {
                    parent._onCheckboxAll(!isChecked);
                } else {
                    parent._onCheckboxChange(value);
                }
            } else {
                this.setData({
                    isIndeterminate: false
                });
            }
        },
        _setValue(val) {
            let value = this.data.value;
            this.setData({
                currentValue: val.indexOf(value) !== -1
            });
            this.isComputed();
        },
    }
})