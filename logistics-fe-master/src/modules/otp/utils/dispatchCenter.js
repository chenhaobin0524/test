export const groupPolicyObj = [
    {
        code: 'customerCode',
        name: 'customerName'
    },
    {
        code: 'networkCode',
        name: 'networkName'
    },
    {
        code: 'receiverCityCode',
        name: 'receiverCityName'
    },
    {
        code: 'receiverDistrictCode',
        name: 'receiverDistrictName'
    },
    {
        code: 'receiverProvinceCode',
        name: 'receiverProvinceName'
    },
    {
        code: 'receiverTownCode',
        name: 'receiverTownName'
    },
    {
        code: 'siteCode',
        name: 'siteName'
    }
];
export const smartCarIsShow = true;
// 两数组是否相同
export function judgeResultFun(arrOne, arrTwo) {
    let flag = true;
    if (arrOne.length !== arrTwo.length) {
        flag = false;
    } else {
        arrOne.forEach(item => {
            if (arrTwo.indexOf(item) === -1) {
                flag = false;
            }
        });
    }
    return flag;
};