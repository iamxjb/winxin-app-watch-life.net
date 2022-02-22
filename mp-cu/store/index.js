import diff from '../lib/diff'

/***
 * @author  bypanghu@163.com (https://github.com/bypanghu)
 * @author iZaiZaiA (https://github.com/iZaiZaiA)
 * 此处参考 https://github.com/xiaoyao96/wxMiniStore
 */

/**
 * 数组或对象深拷贝
 * @param data
 * @returns {any}
 */
const nextArr = (data) => {
    return JSON.parse(JSON.stringify(data));
};

/**
 * 判断是否为数组
 * @param value
 * @returns {boolean}
 */
const ifArray = (value) => {
    return value instanceof Array || Object.prototype.toString.call(value) === '[object Array]';
};

/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
const ifObject = (value) => {
    return Object.prototype.toString.call(value) === '[object Object]';
};

const setData = (obj, data) => {
    let result = nextArr(data), origin = nextArr(obj);
    Object.keys(origin).forEach((key) => {
        dataHandler(key, origin[key], result);
    });
    return result;
};
const dataHandler =  (key, result, data) => {
    let arr = pathHandler(key),d = data;
    for (let i = 0; i < arr.length - 1; i++) {
        keyToData(arr[i], arr[i + 1], d);
        d = d[arr[i]];
    }
    d[arr[arr.length - 1]] = result;
};

const pathHandler =  (key) => {
    let current = "", keyArr = [];
    for (let i = 0, len = key.length; i < len; i++) {
        if (key[0] === "[") {
            throw new Error("key值不能以[]开头");
        }
        if (key[i].match(/\.|\[/g)) {
            cleanAndPush(current, keyArr);
            current = "";
        }
        current += key[i];
    }
    cleanAndPush(current, keyArr);
    return keyArr;
};

const cleanAndPush =  (key, arr) => {
    let r = cleanKey(key);
    if (r !== "") {
        arr.push(r);
    }
};

const keyToData =  (prev, current, data) => {
    if (prev === "") {
        return;
    }
    if (typeof current === "number" && !ifArray(data[prev])) {
        data[prev] = [];
    } else if (typeof current === "string" && !ifObject(data[prev])) {
        data[prev] = {};
    }
};

const cleanKey =  (key) => {
    if (key.match(/\[\S+\]/g)) {
        let result = key.replace(/\[|\]/g, "");
        if (!Number.isNaN(parseInt(result))) {
            return +result;
        } else {
            throw new Error(`[]中必须为数字`);
        }
    }
    return key.replace(/\[|\.|\]| /g, "");
};

export const CUStoreInit = (config) => {
    let $store = {
        state: {},
        $p: [],
        setState(obj, fn = () => { }) {
            if (!ifObject(obj)) {
                throw new Error("setState的第一个参数须为object!");
            }
            let prev = $store.state;
            let current = setData(obj, prev);
            $store.state = current;
            //如果有组件
            if ($store.$p.length > 0) {
                let diffObj = diff(current, prev);
                let keys = Object.keys(diffObj);
                if (keys.length > 0) {
                    const newObj = {};
                    keys.forEach((key) => {
                        newObj["$cuStore." + key] = diffObj[key];
                    });
                    let pros = $store.$p.map((r) => {
                        if (r.$cuStore.hasOwnProperty("useProp")) {
                            let useProps = _filterKey(newObj, r.$cuStore.useProp,
                                (key, useKey) => key === "$cuStore." + useKey ||
                                !!key.match(new RegExp("^[$]cuStore." + useKey + "[.|[]", "g"))
                            );
                            if (Object.keys(useProps).length > 0) {
                                return new Promise((resolve) => {
                                    r.setData(useProps, resolve);
                                });
                            } else {
                                return Promise.resolve();
                            }
                        }
                        return new Promise((resolve) => {
                            r.setData(newObj, resolve);
                        });
                    });
                    Promise.all(pros).then(fn);
                } else {
                    fn();
                }
            } else {
                fn();
            }
        }
    }
    $store.state.sys_theme = wx.getStorageSync('sys_theme') ? wx.getStorageSync('sys_theme') : config.theme
    $store.state.sys_main = wx.getStorageSync('sys_main') ? wx.getStorageSync('sys_main') : config.main
    $store.state.sys_text = wx.getStorageSync('sys_text') ? wx.getStorageSync('sys_text') : config.text
    $store.state.sys_home_page = config.homePath
    const modal = {
        show: false,
        dialog: {title:'', content:'', showCancel:true, cancelText:'取消', cancelColor:'', confirmText:'确定', confirmColor:'', success : ()=>{}},
        toast: {title:'', icon:'', image:'', duration:1500, mask:false, isLoading:false, success:()=>{}},
    }
    $store.state.$Modal = modal
    $store.state.$dialog = modal.dialog
    $store.state.$toast  = modal.toast
    return $store
}
