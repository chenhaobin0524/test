export default function loadBMap(ak) {
    return new Promise(function(resolve, reject) {
        if (typeof BMap !== 'undefined') {
            // eslint-disable-next-line
            resolve(BMap);
            return true;
        }
        window.onBMapCallback = function() {
            // eslint-disable-next-line
            resolve(BMap);
        };
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src =
        'https://api.map.baidu.com/api?v=2.0&ak=' + 'uXRnW5KnsRHsIseRVNRrAvtnBWd2sVHR' + '&s=1&callback=onBMapCallback';
        script.onerror = reject;
        document.head.appendChild(script);
    });
}