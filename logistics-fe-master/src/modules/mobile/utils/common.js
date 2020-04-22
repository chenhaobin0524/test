// 数据字典转换回显
export const dictDataName = (options, data, prop, propName) => {
    if (propName) {
        options.map(status => {
            if (data && status.value === data[prop]) {
                data[propName] = status.label;
            }
        });
    } else {
        options.map(status => {
            if (data && status.value === data[prop]) {
                data[prop] = status.label;
            }
        });
    }
    return data;
};
// 每个数据字典数组
export const oneDictDataArr = (dictObj) => {
    const dictArr = [];
    for (const i in dictObj) {
        if (dictObj.hasOwnProperty(i)) {
            dictArr.push({
                label: dictObj[i],
                value: Number(i)
            });
        }
    }
    return dictArr;
};