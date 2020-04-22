import request from '@/utils/http';

export const serviceUserHeaderQuery = {
    save(formKey, configContent) {
        return request({
            url: '/formconfig/sysFormConfig/saveOrUpdate',
            method: 'post',
            data: { formKey: formKey, configContent: configContent }
        }).then(res => res);
    },
    update(fdId, formKey, configContent) {
        return request({
            url: '/formconfig/sysFormConfig/saveOrUpdate',
            method: 'post',
            data: { fdId: fdId, formKey: formKey, configContent: configContent }
        }).then(res => res);
    },
    get(formKey) {
        return request({
            url: '/formconfig/sysFormConfig/findByFormKey?formKey=' + formKey,
            method: 'get'
        }).then(res => res);
    }
};