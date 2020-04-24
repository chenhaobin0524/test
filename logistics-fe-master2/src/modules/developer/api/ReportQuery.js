import request from '@/utils/http';

const ReportQuery = {
    get(uid) {
        return request({
            url: 'http://10.16.40.192:19021/yhReportConfigs/' + uid,
            method: 'get'
        }).then(res => res);
    }
};
export default ReportQuery;