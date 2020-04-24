// 对象（数组）深复制
export const clone = (obj) => {
    return obj ? JSON.parse(JSON.stringify(obj)) : null;
};

// 过滤特殊字符(不过滤中文A-Za-z0-9_-.)
export const filterSpecChar = (val) => {
    return val.replace(/[^\u4e00-\u9fa5\w-.]/g, '');
};

export const isString = val => {
    return Object.prototype.toString.call(val) === '[object String]';
};

export const isNumber = val => {
    return Object.prototype.toString.call(val) === '[object Number]';
};

export const isArray = val => {
    return Object.prototype.toString.call(val) === '[object Array]';
};

export const isObject = val => {
    return Object.prototype.toString.call(val) === '[object Object]';
};

export const isEmptyObject = val => {
    return isObject(val) && Reflect.ownKeys(val).length === 0;
};

export const isDate = val => {
    return Object.prototype.toString.call(val) === '[object Date]';
};

export const isUndefined = val => {
    return Object.prototype.toString.call(val) === '[object Undefined]';
};

export const isNull = val => {
    return Number.isNaN(val);
};

export const isNaN = val => {
    // eslint-disable-next-line no-self-compare
    return Object.prototype.toString.call(val) === '[object Number]' && (val !== val);
};

export const isValid = val => {
    return !isUndefined(val) && !isNull(val) && !isNaN(val);
};

export const isSymbol = val => {
    return typeof val === 'symbol' || Object.prototype.toString.call(val) === '[object Symbol]';
};

/*
*   lodash 实用函数移植
*/
const INFINITY = 1 / 0;
const reEscapeChar = /\\(\\)?/g;
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

const symbolProto = Symbol ? Symbol.prototype : undefined;
const symbolToString = symbolProto ? symbolProto.toString : undefined;

function arrayMap(array, iteratee) {
    var index = -1;
    var length = array === null ? 0 : array.length;
    var result = Array(length);

    while (++index < length) {
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}

function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value === 'string') {
        return value;
    }
    if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result === '0' && (1 / value) === -INFINITY) ? '-0' : result;
}
function toString(value) {
    return value == null ? '' : baseToString(value);
}
function stringToPath(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
        result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
}
function castPath(value, object) {
    if (isArray(value)) {
        return value;
    }
    return Reflect.has(object, value) ? [value] : stringToPath(toString(value));
}
function toKey(value) {
    if (typeof value === 'string' || isSymbol(value)) {
        return value;
    }
    var result = (value + '');
    return (result === '0' && (1 / value) === -INFINITY) ? '-0' : result;
}
function baseGet(object, path) {
    path = castPath(path, object);

    var index = 0;
    var length = path.length;

    while (object != null && index < length) {
        object = object[toKey(path[index++])];
    }
    return (index && index === length) ? object : undefined;
}

export const get = (object, path, defaultValue) => {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
};

export default {
    clone,
    filterSpecChar,
    isString,
    isNumber,
    isArray,
    isObject,
    isEmptyObject,
    isDate,
    isUndefined,
    isNull,
    isNaN,
    isValid,
    isSymbol,
    get
};