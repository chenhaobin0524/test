const utils = {
    formatYear(date) {
        return date.getFullYear().toString();
    },
    formatMonth(date) {
        return this.formatDateNumber(date.getMonth() + 1);
    },
    formatDay(date) {
        return this.formatDateNumber(date.getDate());
    },
    formatHour(date) {
        return this.formatDateNumber(date.getHours());
    },
    formatMinutes(date) {
        return this.formatDateNumber(date.getMinutes());
    },
    formatSeconds(date) {
        return this.formatDateNumber(date.getSeconds());
    },
    formatDateNumber(num) {
        return num >= 10 ? num.toString() : '0' + num;
    },
    formatDate(date) {
        const newDate = new Date(date);
        return this.formatYear(newDate) + '-' + this.formatMonth(newDate) + '-' + this.formatDay(newDate);
    },
    formatDateTime(date) {
        if (date) {
            const newDate = new Date(date);
            return this.formatYear(newDate) + '-' + this.formatMonth(newDate) + '-' + this.formatDay(newDate) +
                ' ' + this.formatHour(newDate) + ':' + this.formatMinutes(newDate) + ':' + this.formatSeconds(newDate);
        } else {
            return null;
        }
    },
    formatShortDateTime() {
        const newDate = new Date();
        return this.formatYear(newDate) + this.formatMonth(newDate) + this.formatDay(newDate) +
            this.formatHour(newDate) + this.formatMinutes(newDate) + this.formatSeconds(newDate);
    },
    getMenus(routes = []) {
        if (routes.length === 0) {
            return [];
        }
        return this.filterRoute(this.filterRoute(routes)[0].children);
    },
    filterRoute(routes) {
        return routes.filter(item => item.fdId && item.fdId !== null);
    },
    judgeArray(firstArr, seconArr) {
        return firstArr.every(item => {
            return seconArr.indexOf(item) !== -1;
        });
    },
    ArrMove(arr, index, tindex) { // 数组移动，arr目标数组，index当前下标，tindex目标下标
        if (index > tindex) {
            arr.splice(tindex, 0, arr[index]);
            arr.splice(index + 1, 1);
        } else {
            arr.splice(tindex + 1, 0, arr[index]);
            arr.splice(index, 1);
        }
        return arr;
    },
    getResourceIds(v) {
        const tempArr = [];
        getId(v);

        function getId(v) {
            v.forEach(item => {
                if (+item.resourceType === 3 && item.resourceId) {
                    tempArr.push(item.resourceId);
                } else if (item.subResources) {
                    getId(item.subResources);
                }
            });
        }
        return tempArr;
    },
    loadMore(el, binding, vnode, oldVnode) {
        // 设置默认溢出显示数量
        const spillDataNum = 20;

        // 设置隐藏函数
        let timeout = false;
        const setRowDisableNone = function (topNum, showRowNum, binding) {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                binding.value.call(null, topNum, topNum + showRowNum + spillDataNum);
            });
        };

        function listenScroll() {
            let topPx = this.scrollTop - spillDataNum * rowHeight;
            let topNum = Math.round(topPx / rowHeight);
            const minTopNum = dataSize - spillDataNum - showRowNum;
            if (topNum > minTopNum) {
                topNum = minTopNum;
            }
            if (topNum < 0) {
                topNum = 0;
                topPx = 0;
            }
            if (flag) {
                selectTbody.setAttribute('style', `transform: translateY(${topPx}px)`);
                if (fixedTbody) {
                    fixedTbody.setAttribute('style', `transform: translateY(${topPx}px)`);
                }
                if (fixedTbodyRight) {
                    fixedTbodyRight.setAttribute('style', `transform: translateY(${topPx}px)`);
                }
            } else {
                selectTbody.setAttribute('style', `transform: none`);
                if (fixedTbody) {
                    fixedTbody.setAttribute('style', `transform: none`);
                }
                if (fixedTbodyRight) {
                    fixedTbodyRight.setAttribute('style', `transform: none`);
                }
            }
            createElementTR.setAttribute('style', `height: ${createElementTRHeight - topPx > 0 ? createElementTRHeight - topPx : 0}px;`);
            createElementTR1.setAttribute('style', `height: ${createElementTRHeight - topPx > 0 ? createElementTRHeight - topPx : 0}px;`);
            setRowDisableNone(topNum, showRowNum, binding);
        };
        const dataSize = vnode.data.attrs['data-size'];
        const oldDataSize = oldVnode.data.attrs['data-size'];
        if (dataSize === oldDataSize) {
            return;
        }
        const selectWrap = el.querySelector('.el-table__body-wrapper');
        const selectTbody = selectWrap.querySelector('table tbody');
        const selectRow = selectWrap.querySelector('table tr');
        let fixedRight = null;
        let fixedWrap = null;
        let fixedTbody = null;
        let fixedTbodyRight = null;
        if (el.querySelector('.el-table__fixed-right')) {
            fixedRight = el.querySelector('.el-table__fixed-right');
            fixedWrap = fixedRight.querySelector('.el-table__fixed-body-wrapper');
            fixedTbody = fixedWrap.querySelector('table tbody');
        }
        if (el.querySelector('.el-table__fixed')) {
            const fixedRight = el.querySelector('.el-table__fixed');
            const fixedWrap = fixedRight.querySelector('.el-table__fixed-body-wrapper');
            fixedTbodyRight = fixedWrap.querySelector('table tbody');
        }
        if (!selectRow) {
            return;
        }
        const rowHeight = selectRow.clientHeight;
        const showRowNum = Math.round(selectWrap.clientHeight / rowHeight);
        const createElementTR = document.createElement('tr');
        const createElementTR1 = document.createElement('tr');
        const createElementTR2 = document.createElement('tr');
        const createElementTRHeight = (dataSize - showRowNum - spillDataNum) * rowHeight;
        createElementTR.setAttribute('style', `height: ${createElementTRHeight}px;`);
        createElementTR.setAttribute('id', `selectWrap`);
        createElementTR1.setAttribute('style', `height: ${createElementTRHeight}px;`);
        createElementTR1.setAttribute('id', `fixedWrap`);
        createElementTR2.setAttribute('style', `height: ${createElementTRHeight}px;`);
        createElementTR2.setAttribute('id', `fixedWrap2`);
        selectWrap.scrollTop = 0; // 滚动条重置回顶部
        if (fixedWrap) {
            fixedWrap.scrollTop = 0; // 滚动条重置回顶部
        }
        if (+dataSize >= 200) {
            flag = true;
            selectTbody.append(createElementTR);
            if (fixedTbody) {
                fixedTbody.append(createElementTR1);
            }
            if (fixedTbodyRight) {
                fixedTbodyRight.append(createElementTR2);
            }
            selectWrap.addEventListener('scroll', listenScroll);
        } else {
            flag = false;
            if (el.querySelector('#selectWrap')) {
                el.querySelector('#selectWrap').parentNode.removeChild(el.querySelector('#selectWrap'));
            }
            if (el.querySelector('#fixedWrap')) {
                el.querySelector('#fixedWrap').parentNode.removeChild(el.querySelector('#fixedWrap'));
            }
            if (el.querySelector('#fixedWrap2')) {
                el.querySelector('#fixedWrap2').parentNode.removeChild(el.querySelector('#fixedWrap2'));
            }
            selectWrap.removeEventListener('scroll', listenScroll);
        }
    },
    IE11RouterFix() {
        return {
            methods: {
                _hashChangeHandler: function () {
                    this.$router.push(window.location.hash.substring(1, window.location.hash.length));
                },
                _isIE11: function () {
                    return !!window.MSInputMethodContext && !!document.documentMode;
                },
                _paqClick: function (e) { // 按钮点击事件，发起统计请求,传递点击参数e
                    if (window._paq) {
                        window._paq.push(['trackEvent', `${location.pathname}${this.$route.path}` || 'button', 'Click', e.target.innerText || '']);
                    }
                }
            },
            mounted: function () {
                if (this._isIE11()) {
                    window.addEventListener('hashchange', this._hashChangeHandler);
                }
            },
            destroyed: function () {
                if (this._isIE11()) {
                    window.removeEventListener('hashchange', this._hashChangeHandler);
                }
            }
        };
    },
    validateEnableForm(formData, callback) {
        const enableFields = formData.fields.filter(item => !item.$children[0].disabled && (item.$children[1] && !item.$children[1].disabled));
        const enableFieldStrings = enableFields.map(item => item.prop);
        Promise.all(enableFieldStrings.map(item => {
            const p = new Promise(function (resolve, reject) {
                formData.validateField(item, (error) => {
                    resolve(error);
                });
            });
            return p;
        })).then((data) => {
            let successFlag = true;
            data.forEach(item => {
                if (item && item !== '') {
                    successFlag = false;
                }
            });
            callback(successFlag);
        });
    },
    // 异步请求，不使用 axios，因为此请求不应阻碍项目的其他请求。
    ajax(options) {
        options = options || {};
        options.type = (options.type || 'GET').toUpperCase();
        options.dataType = options.dataType || 'json';
        const params = this.formatAjaxParams(options.data);
        let xhr;

        // 创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else { // IE6及其以下版本浏览器
            xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
        }

        // 接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                const status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        };

        // 连接 和 发送 - 第二步
        if (options.type === 'GET') {
            xhr.open('GET', options.url + '?' + params, true);
            xhr.send(null);
        } else if (options.type === 'POST') {
            xhr.open('POST', options.url, true);
            // 设置表单提交时的内容类型
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(params);
        }
    },
    // 格式化参数
    formatAjaxParams(data) {
        var arr = [];
        for (var name in data) {
            if (data.hasOwnProperty(name)) {
                arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            }
        }
        arr.push(('v=' + Math.random()).replace('.', ''));
        return arr.join('&');
    }
};
let flag;
export default utils;
