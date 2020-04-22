export const messageBox = (vue, tip = '是否确认删除数据?') => {
    return new Promise(resolve => {
        vue.$confirm(tip, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            resolve();
        }).catch(() => {});
    });
};