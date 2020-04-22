/**
 ** 前端性能统计代码
 ** 向 piwik 发送 DNS 查询耗时、TCP 链接耗时、request 请求耗时、解析 dom 树耗时、白屏时间、domready 时间、onload 时间。
 **/
setTimeout(function () {
    if (window._paq) {
        sendPiwikData();
    }
}, 3000);

function sendPiwikData() {
    const {
        domainLookupEnd,
        domainLookupStart,
        connectEnd,
        connectStart,
        responseEnd,
        responseStart,
        domComplete,
        domInteractive,
        navigationStart,
        domContentLoadedEventEnd,
        loadEventEnd
    } = window.performance.timing;
    if (loadEventEnd && loadEventEnd > 0) {
        const DNSTime = domainLookupEnd - domainLookupStart;
        const TCPTime = connectEnd - connectStart;
        const requestTime = responseEnd - responseStart;
        const DomTreeTime = domComplete - domInteractive;
        const whiteScreenTime = responseStart - navigationStart;
        const domreadyTime = domContentLoadedEventEnd - navigationStart;
        const onloadTime = loadEventEnd - navigationStart;
        window._paq.push(['trackEvent', 'Performance', 'load', 'DNS 查询耗时', DNSTime]);
        window._paq.push(['trackEvent', 'Performance', 'load', 'TCP 链接耗时', TCPTime]);
        window._paq.push(['trackEvent', 'Performance', 'load', 'request 请求耗时', requestTime]);
        window._paq.push(['trackEvent', 'Performance', 'load', '解析 dom 树耗时', DomTreeTime]);
        window._paq.push(['trackEvent', 'Performance', 'load', '白屏时间', whiteScreenTime]);
        window._paq.push(['trackEvent', 'Performance', 'load', 'domready 时间', domreadyTime]);
        window._paq.push(['trackEvent', 'Performance', 'load', 'onload 时间', onloadTime]);
    } else {
        setTimeout(sendPiwikData, 3000);
    }
}