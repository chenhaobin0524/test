import request from '@/utils/http';
import axios from 'axios';

const origin = window.location.origin;
// 查询 bucket 列表
export const getLists = (params) => {
    return request({
        url: `${origin}/oss-api/appmanager/bucket/list`,
        method: 'post',
        data: params
    });
};
// 查询文件列表
export const getFiles = (params) => {
    return request({
        url: `${origin}/oss-api/appmanager/object/list`,
        method: 'post',
        data: params
    });
};

export const getCert = (params, cancelToken = () => {}) => {
    return request({
        url: `${origin}/oss-api/appmanager/certification/create`,
        method: 'post',
        data: params,
        cancelToken: new axios.CancelToken(cancelToken)
    });
};

export const getDownloadUrl = (params) => {
    return request({
        url: `${origin}/oss-download/userDownload/${params.appid}/${params.bucket}/${params.object}?certification=${params.certification}`,
        method: 'get'
    });
};

export const upload = (data, params, onUploadProgress = () => {}) => {
    return request({
        url: `${origin}/oss-upload/oss/object/upload/${params.appid}/${params.bucket}/${params.object}`,
        method: 'put',
        data: data,
        onUploadProgress,
        headers: {
            certification: params.certification,
            'x-amz-date': (new Date()).toGMTString()
        }
    });
};

export const getUploadId = (params) => {
    return request({
        url: `${origin}/oss-api/appmanager/multiupload/init`,
        method: 'post',
        data: params,
        headers: {
            certification: params.certification,
            'x-amz-date': (new Date()).toGMTString(),
            'x-amz-acl': 'private'
        }
    });
};

export const multiUpload = (data, params) => {
    return request({
        url: `${origin}/oss-upload/oss/object/uploadpart/${params.appid}/${params.bucket}/${params.object}?partNumber=${params.index}&uploadId=${params.uploadid}`,
        method: 'put',
        data: data,
        headers: {
            certification: params.certification,
            'x-amz-date': (new Date()).toGMTString(),
            'x-amz-acl': 'private'
        }
    });
};

export const getMultiUploadList = (params) => {
    return request({
        url: `${origin}/oss-api/appmanager/multiupload/list`,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

export const completeMultiUpload = (params) => {
    return request({
        url: `${origin}/oss-api/appmanager/multiupload/complete`,
        method: 'POST',
        data: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

export const getCertBySDK = (params, cancelToken = () => {}) => {
    return request({
        url: `/api-file/oos/certification`,
        method: 'GET',
        params: params,
        cancelToken: new axios.CancelToken(cancelToken)
    });
};

export const getUserFileList = (params) => {
    return request({
        url: `/api-file/mdmFileInfos`,
        method: 'get',
        params: params
    });
};

export const getUserFile = (params) => {
    return request({
        url: `/api-file/mdmFileInfo/${params.id}`,
        method: 'GET'
    });
};

export const saveUserUpload = (params) => {
    return request({
        url: `/api-file/mdmFileInfo`,
        method: 'POST',
        data: params,
        /* 转换成formData */
        transformRequest: [function (data) {
            let ret = '';
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
                }
            }
            return ret;
        }]
    });
};

export const uploadBySDK = (data, bucket, onUploadProgress = () => {}) => {
    return request({
        url: `/api-file/mdmFileStorage/upload/${bucket}`,
        method: 'post',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data: data,
        onUploadProgress
    });
};