export default {
    customerOrderNoCode: {
        'name': '请输入承运商',
        'advanceLabel': '承运商',
        'value': 'carrierName',
        'advanceConfig': [
            { 'prop': 'suppliersNameCn', 'value': '承运商名称' },
            { 'prop': 'suppliersCode', 'value': '承运商编码' },
            { 'prop': 'tranName', 'value': '采购渠道' }
        ],
        'tableConfig': [
            { 'prop': 'suppliersNameCn', 'value': '承运商名称' },
            { 'prop': 'suppliersCode', 'value': '承运商编码' },
            { 'prop': 'tranName', 'value': '采购渠道' }
        ],
        'advanceUrl': 'ebSupplier/searchBySupplier',
        'cbParams': [
            'suppliersNameCn#carrierName', 'suppliersCode#carrierCode', 'transType', 'tranName'
        ],
        'advanceCascade': 'suppliersCode#carrierCode'
    },
    // 车牌
    vehicleCardLists: {
        'name': '请输入车牌号',
        'advanceLabel': '车牌号',
        'value': 'vehicleCard',
        'advanceConfig': [
            { 'prop': 'licensePlateNumber', 'value': '车牌' },
            { 'prop': 'cargoVolumeStr', 'value': '载货体积' },
            { 'prop': 'cdegNameCn', 'value': '车型' }
        ],
        'tableConfig': [
            { 'prop': 'licensePlateNumber', 'value': '车牌' },
            { 'prop': 'cargoVolume', 'value': '载货体积' },
            { 'prop': 'cdegNameCn', 'value': '车型' }
        ],
        'advanceUrl': 'suCar/searchByConditions',
        'cbParams': [
            'licensePlateNumber#vehicleCard', 'cargoVolumeStr', 'cdegNameCn#equipmentName', 'carrierCode#suppliersCode', 'etveType#equipmentType'
        ],
        'advanceCascade': 'carrierCode#suppliersCode'
    },
    // 司机
    driverLists: {
        'name': '请输入司机',
        'advanceLabel': '司机',
        'value': 'driver',
        'advanceConfig': [
            { 'prop': 'name', 'value': '司机' },
            { 'prop': 'encuMobile', 'value': '电话' }

        ],
        'tableConfig': [
            { 'prop': 'name', 'value': '司机' },
            { 'prop': 'encuMobile', 'value': '电话' }
        ],
        'advanceUrl': 'suDriver/searchByConditions',
        'cbParams': [
            'name#driver', 'encuMobile#driverContactWay', 'cardId#driverIdentity', 'suppliersCode'
        ],
        'advanceCascade': 'carrierCode#suppliersCode'
    },
    // 税率
    taxRateLists: {
        'name': '请输入税率',
        'advanceLabel': '税率',
        'value': 'taxRate',
        'advanceConfig': [
            { 'prop': 'percentageRateStr', 'value': '税率百分比' },
            { 'prop': 'taxRateCode', 'value': '税率代码' }

        ],
        'tableConfig': [
            { 'prop': 'percentageRate', 'value': '税率百分比' },
            { 'prop': 'taxRateCode', 'value': '税率代码' }
        ],
        'advanceUrl': 'efTaxRate/popTaxRate/in',
        'cbParams': [
            'percentageRate#taxRate'
        ]
    },
    AdmittRules: {
        carrierName: [
            {
                required: true,
                message: '承运商不能为空',
                trigger: ['blur', 'change']
            }
        ],
        vehicleCard: [
            {
                required: true,
                message: '车牌不能为空',
                trigger: ['blur', 'change']
            }
        ],
        conveniently: [
            {
                required: true,
                message: '是否顺路带回不能为空',
                trigger: 'blur'
            }
        ],
        procurementChannel: [
            {
                required: true,
                message: '采购渠道不能为空',
                trigger: ['blur', 'change']
            }
        ],
        besArriveDate: [
            {
                required: true,
                message: '预计到车时间不能为空',
                trigger: 'blur'
            }
        ],
        driver: [
            {
                required: true,
                message: '司机不能为空',
                trigger: ['blur', 'change']
            }
        ],
        transportationCost: [
            {
                required: true,
                message: '运输成本不能为空',
                trigger: 'blur'
            },
            {
                pattern: /^(([1-9][0-9]{0,4})([.][0-9]{0,2})?|100000|100000.0|100000.00|!0.0|!0.00|!0)$/,
                message:
                    '仅可输入数字，不能为0，支持小数点后2位；包含小数点共9位',
                trigger: 'blur'
            }
        ],
        taxRate: [
            {
                required: true,
                message: '税率不能为空',
                trigger: 'blur'
            }
        ]
    }
};