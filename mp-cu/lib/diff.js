/**
 * diff库
 * @author Leisure
 * @update 2019.11.27
 * @param {object} current - 当前状态
 * @param {object} prev - 之前状态
 */
const diff = function diff(current = {}, prev = {}) {
    let result = {};
    updateDiff(current, prev, "", result);
    nullDiff(current, prev, "", result);
    return result;
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

const updateDiff = function updateDiff(current = {}, prev = {}, root = "", result = {}) {
    if(ifArray(current) && ((ifArray(prev) && current.length !== prev.length) || !ifArray(prev))){
        result[root] = current
        return;
    }
    Object.entries(current).forEach(item => {
        let key = item[0], value = item[1], path = root === "" ? key : root + "." + key;
        if (ifArray(current)) {
            path = root === "" ? key : root + "[" + key + "]";
        }
        if (!prev.hasOwnProperty(key)) {
            result[path] = value;
        } else if ((ifObject(prev[key]) && ifObject(current[key])) || (ifArray(prev[key]) && ifArray(current[key]))) {
            updateDiff(current[key], prev[key], path, result);
        } else if (prev[key] !== current[key]) {
            result[path] = value;
        }
    });
    return result;
};

const nullDiff = function nullDiff(current = {}, prev = {}, root = "", result = {}) {
    if(ifArray(current) && ((ifArray(prev) && current.length !== prev.length) || !ifArray(prev))){
        return;
    }
    Object.entries(prev).forEach(item => {
        let key = item[0], path = root === "" ? key : root + "." + key;
        if (ifArray(current)) {
            path = root === "" ? key : root + "[" + key + "]";
        }
        if (!current.hasOwnProperty(key)) {
            result[path] = null;
        } else if ((ifObject(prev[key]) && ifObject(current[key])) || (ifArray(prev[key]) && ifArray(current[key]))) {
            nullDiff(current[key], prev[key], path, result);
        }
    });
    return result;
};

export default diff;