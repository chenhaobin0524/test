const debounce = (fn, wait = 300) => {
    let timeout = null;
    return function() {
        if (timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    };
};
export default {
    name: 'Debounce',
    functional: true, // 静态组件 当不声明functional时该组件同样拥有上下文以及生命周期函数
    render(createElement, context) {
        const delay = context.props.delay;
        const vnodeList = context.slots().default;
        if (vnodeList === undefined) {
            // eslint-disable-next-line no-console
            console.warn('<throttle> 组件必须要有子元素');
            return null;
        }
        const vnode = vnodeList[0] || null; // 获取子元素虚拟dom
        if (vnode.componentOptions && vnode.componentOptions.tag === 'el-button') {
            const defaultFun = vnode.componentOptions.listeners.click;
            const debounceFun = debounce(defaultFun, delay); // 获取防抖函数
            vnode.componentOptions.listeners.click = debounceFun;
        } else {
            // eslint-disable-next-line no-console
            console.warn('<throttle> 组件内目前只支持el-button按钮防抖，其他');
            return vnode;
        }
        return vnode;
    }
};