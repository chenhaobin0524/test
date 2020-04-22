import failure from '../../public/images/failure.svg';
// 添加图片异常监听
window.addEventListener('error', function(e) {
    const target = e.target;
    const tagName = target.tagName;
    // 当前异常是由图片加载异常引起的
    if (tagName.toUpperCase() === 'IMG') {
        // 如果else里的默认图片加载失败，则加载base64图片，防止无限抛异常
        if (target.dataset.error) {
            target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        } else {
            target.dataset.error = true;
            target.src = failure;
        }
    }
}, true);