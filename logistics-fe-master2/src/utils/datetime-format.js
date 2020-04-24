export default function formatDateTime(dateTime, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (dateTime.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    const o = {
        'M+': dateTime.getMonth() + 1,
        'd+': dateTime.getDate(),
        'H+': dateTime.getHours(),
        'm+': dateTime.getMinutes(),
        's+': dateTime.getSeconds()
    };
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            const str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
