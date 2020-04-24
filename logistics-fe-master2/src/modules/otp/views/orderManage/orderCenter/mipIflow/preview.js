import config from '@/config/user.env.js';
export function filePreview (fileObj) {
    const fileArr = fileObj.url.split('.');
    const ext = (fileObj.fileType || fileArr[fileArr.length - 1]);
    let fileName = '';
    if (/\./.test(fileObj.name)) {
        fileName = fileObj.name;
    } else {
        fileName = fileObj.name + '.' + ext;
    }
    const url = config.filePreviewUrl + '/mip-doc-preview/viewer.html?sys=otp' +
    '&sign=' + new Date().getTime() +
    '&ext=' + ext +
    '&fd=' + fileObj.id +
    '&name=' + fileName +
    '&src=' + encodeURIComponent('http:' + fileObj.url);
    window.open(url, '_blank ');
}