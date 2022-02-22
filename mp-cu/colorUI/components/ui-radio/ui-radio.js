Component({
    relations: {
        '../ui-radio-group/ui-radio-group': {
            type: 'parent'
        }
    },
    data: {
        currentValue: null,
        isGroup: null,
        isDisabled: null,
        isClearable: null,
        isChecked: null,
        hasUiCard: null
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
        unbg: {
            type: String,
            value: 'borderss'
        },
        src: {
            type: String,
            value: ''
        },
        clearable: {
            type: Boolean,
            value: false
        },
        none: {
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
            this._setValue(val);
        }
    },
    methods: {
        _nodesSetValue() {
            let radioNodes = this.getRelationNodes('../ui-radio-group/ui-radio-group');
            if (Array.isArray(radioNodes) && radioNodes.length > 0) {
                return radioNodes[0];
            } else {
                return false;
            }
        },
        isComputed() {
            let {disabled, clearable, label, currentValue, ui} = this.data;
            let parent = this._nodesSetValue();
            let isGroup = !!parent;
            //isDisabled
            let isDisabled = isGroup?parent.data.disabled:disabled;
            //isClearable
            let isClearable = isGroup?parent.data.clearable:clearable;
            //isChecked
            let isChecked = (isGroup && parent.data.value == label) || (!isGroup && currentValue == label);
            //_has
            let hasUiCard = ui.indexOf('card') !== -1;
            //设置数据
            this.setData({
                isGroup: isGroup,
                isDisabled: isDisabled,
                isClearable: isClearable,
                isChecked: isChecked,
                hasUiCard: hasUiCard
            });
        },
        _onRadioClick() {
            let {isGroup, isDisabled, label} = this.data;
            if (isGroup && !isDisabled) {
                this._choose();
            }
            if (!isGroup && !isDisabled) {
                this.triggerEvent('input', label);
                this.triggerEvent('change', label);
            }
        },
        _choose() {
            let {currentValue, label, isGroup, isClearable} = this.data;
            if (currentValue != label) {
                this.setData({currentValue: label});
                this.triggerEvent('input', label);
                this.triggerEvent('change', label);
                if (isGroup) {
                    let parent = this._nodesSetValue();
                    parent._onRadioChange(label);
                }
            } else if (isClearable) {
                this.setData({currentValue: null});
                this.triggerEvent('input', null);
                this.triggerEvent('change', null);
                if (isGroup) {
                    let parent = this._nodesSetValue();
                    parent._onRadioChange(null);
                }
            }
        },
        _setValue(groupValue) {
            this.setData({
                currentValue: groupValue
            });
            this.isComputed();
        },
    }
})