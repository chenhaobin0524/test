import moment from 'moment';
// 保存时判断数组是否为空
export const saveArr = (arr) => {
    if (arr.length === 0) {
        return false;
    } else {
        return true;
    }
};

// 保存时判断是否未输入
export const empty = (arr) => {
    if (!arr) {
        return false;
    } else {
        return true;
    }
};

// 判断 double 类型，整数保留4位，保留小数点2位
export const doubleDate = (arr) => {
    const num = /^\d+(\.\d*)?$/;
    // var re = /^\d+(\.\d{2})?$/;
    if (num.test(arr)) {
        return false;
    } else {
        return true;
    }
};

// 判断 double 类型，保留小数点后2位；arr 参数， index位数
export const doubleDateDecimal = (arr, index) => {
    const decimal = String(arr).indexOf('.') + 1;
    if (decimal > 0) {
        if (arr.split('.')[1].length > index) {
            return arr.split('.')[1].length;
        } else {
            return true;
        }
    }
};

// 判断 double 类型,整数；arr 参数， index位数
export const doubleDateInteger = (arr, index) => {
    if (arr.split('.')[0].length > index) {
        return arr.split('.')[0].length;
    } else {
        return true;
    }
};

// 转换时间格式
export const dateTimes = (startTimes) => {
    // 时间转换
    return moment(startTimes).format('YYYY-MM-DD HH:mm:ss');
};

// 时间判断取值
export const dateValue = (startTimes) => {
    return new Date(startTimes).getTime();
};

export const dateCurrent = () => {
    return new Date().getTime();
};

// 获取当前系统时间'2019/05/20 15:30:29'
export const dateTime = () => {
    const myDate = new Date();
    const date = myDate.getFullYear() + '/' +
        (myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1) + '/' +
        (myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()) + ' ' +
        (myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()) + ':' +
    (myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()) + ':' +
        (myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds());
    return date;
};

// 判断整数
export const isInt = (val) => {
    const reg = /^0$|^([1-9][0-9]*)$/;
    return reg.test(val + '');
};

// 非负浮点数
export const isFloat = (val) => {
    const reg = /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/;
    return reg.test(val);
};

// 校验手机号
export const isMobile = (Mobile) => {
    const reg = /^1\d{10}$/;
    if (reg.test(Mobile)) {
        return true;
    } else {
        return false;
    }
};

// 校验电话号码格式
export const isTel = (tel) => {
    const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    if (reg.test(tel)) {
        return false;
    } else {
        return true;
    }
};

// 校验BigDecimal
export const isBigDecimal = (val, i, j) => {
    const arr = val.split('.');
    if (arr[0].length > i || (arr[1] && arr[1].length > j)) {
        return false;
    } else {
        if (Number(arr[0]) && (!arr[1] || Number(arr[1]))) {
            return true;
        } else {
            return false;
        }
    }
};

// 校验字符串长度
export const maxLength = (val, i) => {
    return val.length < i;
};

// 过滤特殊字符
export const filterSpecChar = (val) => {
    return val.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g, '');
};
