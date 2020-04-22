import request from '@/utils/http';
const origin = window.location.origin;

export const getCertBySDK = (params) => {
    return request({
        url: `/api-file/oos/certification`,
        method: 'GET',
        params: params
    });
};

export const upload = (data, params) => {
    return request({
        url: `${origin}/oss-upload/oss/object/upload/${params.appid}/${params.bucket}/${params.object}`,
        method: 'put',
        data: data,
        headers: {
            certification: params.certification,
            'x-amz-date': (new Date()).toGMTString()
        }
    });
};

export const saveUserUpload = (params) => {
    return request({
        url: `/api-otp/ttx/uploadInboundOrder`,
        method: 'POST',
        data: params
    });
};

export const getDataList = (params) => {
    return request({
        url: `/api-otp/ttx/searchInboundOrder`,
        method: 'post',
        data: params
    });
};

export const getModifyTime = () => {
    return request({
        url: `/api-otp/ttx/downloadInboundOrderTemplate`,
        method: 'get'
    });
};

export const repost = (params) => {
    return request({
        url: `/api-otp/ttx/reCheckIsShelf/${params.id}`,
        method: 'get'
    });
};