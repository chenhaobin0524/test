import orderTransfer from '../orderTransfer';
import otpAdvance from '@/components/lots/otpAdvance';
import otpSelect from '@/components/lots/otpSelect';
// import otpAllAddressSelect from '@/components/lots/otpAllAddressSelect';
import otpAllAddressSelect from '@/components/lots/otpCascader2';
import { dateTimes, dateValue, dateCurrent } from '../../../../../judge/configCenter';
import { addOrUpdateCustomerOrderInfo, getCustomerOrderInfo, orderVrify } from '../../../../../api/orderCenter';

export default {
    // 是否自提  1 是  0 否
    props: {
        orderTransfer: Array,
        basicData: Object,
        title: String
    },
    components: { orderTransfer, otpAdvance, otpSelect, otpAllAddressSelect },
    data() {
        return {
            deliveryTypes: 'DELIVERY_TYPE',
            config: {
                checkStrictly: true
            },
            verifyBtn: false,
            saveBtn: false,
            orderTypeTo: false,
            tableDataItemStatus: {
                itemStatus: '',
                itemStatusName: ''
            },
            tableDataTargetStatus: {
                itemStatusTo: '',
                itemStatusToName: ''
            },
            senderTownCode: [],
            receiverTownCode: [],
            index: 0,
            orderStatus: 0,
            addressCode: {},
            addressName: {},
            orderData: [],
            multipleSelection: [],
            rowData: [],
            dialogFormVisible: false,
            formData: {
                siteCode: ''
            },
            ruleForm: {
                id: '',
                orderNo: '',
                customerOrderNo: '',
                expectOutTime: '',
                expectArriveStartTime: '',
                orderValue: '',
                relationOrderNo: '',
                originOrderNo: '',
                selfMention: '',
                sourceSystem: 'HANDLE',
                emergenceFlag: 0,
                remark: '',
                items: [],
                orderType: 'DPRI',
                businessMode: 'B2B',
                loadType: 'FLV',
                freightBasis: '',
                address: {},
                upperSenderName: '',
                upperReceiverName: '',
                deliveryType: ''
            },
            indexAddress: {
                senderName: '',
                senderTel: '',
                senderMobile: '',
                receiverName: '',
                receiverTel: '',
                receiverMobile: '',
                senderProvinceCode: '',
                senderProvinceName: '',
                senderCityCode: '',
                senderCityName: '',
                senderDistrictCode: '',
                senderDistrictName: '',
                senderTownCode: '',
                senderTownName: '',
                senderDetailAddr: '',
                receiverCountryCode: '',
                receiverCountryName: '',
                receiverProvinceCode: '',
                receiverProvinceName: '',
                receiverCityCode: '',
                receiverCityName: '',
                receiverDistrictCode: '',
                receiverDistrictName: '',
                receiverTownCode: '',
                receiverTownName: '',
                receiverDetailAddr: ''
            },
            tableData: [],
            rules: {},
            ruleFormUpdate: {
                orderNo: '',
                customerOrderNo: '',
                expectOutTime: '',
                expectArriveStartTime: '',
                orderValue: '',
                relationOrderNo: '',
                selfMention: '',
                emergenceFlag: 0,
                originOrderNo: '',
                sourceSystem: 'HANDLE',
                orderType: 'DPRI',
                businessMode: 'B2B',
                loadType: '',
                freightBasis: '',
                remark: '',
                items: [],
                address: {},
                upperSenderName: '',
                upperReceiverName: '',
                deliveryType: ''
            },
            indexAddressUpdate: {
                senderName: '',
                senderTel: '',
                senderMobile: '',
                receiverName: '',
                receiverTel: '',
                receiverMobile: '',
                senderProvinceCode: '',
                senderProvinceName: '',
                senderCityCode: '',
                senderCityName: '',
                senderDistrictCode: '',
                senderDistrictName: '',
                senderTownCode: '',
                senderTownName: '',
                senderDetailAddr: '',
                receiverCountryCode: '',
                receiverCountryName: '',
                receiverProvinceCode: '',
                receiverProvinceName: '',
                receiverCityCode: '',
                receiverCityName: '',
                receiverDistrictCode: '',
                receiverDistrictName: '',
                receiverTownCode: '',
                receiverTownName: '',
                receiverDetailAddr: ''
            },
            placeholderDic: {
                senderName: '联系人',
                senderMobile: '手机号',
                shippingAddress: '请选择四级',
                senderDetailAddr: '请输入详细地址',
                receiverName: '联系人',
                receiverMobile: '手机号',
                receivingAddress: '请选择四级',
                receiverDetailAddr: '请输入详细地址',
                upperSenderName: '发货单位',
                upperReceiverName: '收货单位'
            },
            tableDataUpdate: [],
            showValidate: false,
            showTargetStatus: false
        };
    },
    watch: {
        receiverTownCode(val) {
            this.addressCode.receivingAddress = val;
        },
        senderTownCode(val) {
            this.addressCode.shippingAddress = val;
        },
        orderType(val) {
            if (val === 'YS') {
                this.showValidate = true;
            } else {
                this.showValidate = false;
            }
        },
        ruleForm(val) {
            this.deliveryTypes = 'DELIVERY_TYPE';
            if (val.selfMention !== '1') {
                if (val.businessMode && val.businessMode === 'B2B') {
                    this.deliveryTypes = 'DELIVERY_TYPE_B2B';
                } else {
                    this.deliveryTypes = 'DELIVERY_TYPE_B2C';
                }
            }
        }
    },
    computed: {
        orderType() {
            if (this.ruleForm.orderType === 'TF') {
                this.showTargetStatus = true;
            } else {
                this.showTargetStatus = false;
            }
            return this.ruleForm.orderType;
        },
        notAnUser() {
            return !['an.midea.com', 'auth.midea.com'].includes(window.location.host);
        }
    },
    methods: {
        show(status = true, id) {
            this.dialogFormVisible = status;
            if (id) {
                this.modify(id);
            } else {
                this.ruleForm = JSON.parse(JSON.stringify(this.ruleFormUpdate));
                this.indexAddress = JSON.parse(JSON.stringify(this.indexAddressUpdate));
                this.tableData = JSON.parse(JSON.stringify(this.tableDataUpdate));
                this.senderTownCode = [];
                this.receiverTownCode = [];
            }
        },
        showCopy(status = true, id) {
            this.dialogFormVisible = status;
            const data = id.address;
            const senderTownCode = [data.senderProvinceCode, data.senderCityCode, data.senderDistrictCode, data.senderTownCode];
            const receiverTownCode = [data.receiverProvinceCode, data.receiverCityCode, data.receiverDistrictCode, data.receiverTownCode];
            for (let i = 0; i < senderTownCode.length; i++) {
                if (senderTownCode[i]) {
                    this.senderTownCode.push(senderTownCode[i]);
                }
            }
            for (let i = 0; i < receiverTownCode.length; i++) {
                if (receiverTownCode[i]) {
                    this.receiverTownCode.push(receiverTownCode[i]);
                }
            }
            this.ruleForm = {
                orderNo: '',
                customerOrderNo: id.customerOrderNo + '_COPY',
                expectOutTime: id.expectOutTime,
                expectArriveStartTime: id.expectArriveStartTime,
                orderValue: id.orderValue,
                relationOrderNo: id.relationOrderNo,
                selfMention: id.selfMention,
                emergenceFlag: id.emergenceFlag,
                remark: id.remark,
                customerName: id.customerName,
                customerCode: id.customerCode,
                siteName: id.siteName,
                siteCode: id.siteCode,
                originOrderNo: id.originOrderNo,
                sourceSystem: 'HANDLE', // 手工建单或复制订单，sourceSystem都是HANDLE（手工单）
                whName: id.whName,
                whCode: id.whCode,
                orderType: id.orderType,
                businessMode: id.businessMode,
                orderStatus: 100,
                deliveryType: id.deliveryType,
                upperSenderName: id.upperSenderName || '',
                upperReceiverName: id.upperReceiverName || ''
            };
            this.indexAddress = {
                senderName: id.address.senderName,
                senderTel: id.address.senderTel,
                senderMobile: id.address.senderMobile,
                receiverName: id.address.receiverName,
                receiverTel: id.address.receiverTel,
                receiverMobile: id.address.receiverMobile,
                senderProvinceCode: id.address.senderProvinceCode,
                senderProvinceName: id.address.senderProvinceName,
                senderCityCode: id.address.senderCityCode,
                senderCityName: id.address.senderCityName,
                senderDistrictCode: id.address.senderDistrictCode,
                senderDistrictName: id.address.senderDistrictName,
                senderTownCode: id.address.senderTownCode,
                senderTownName: id.address.senderTownName,
                senderDetailAddr: id.address.senderDetailAddr,
                receiverCountryCode: id.address.receiverCountryCode,
                receiverCountryName: id.address.receiverCountryName,
                receiverProvinceCode: id.address.receiverProvinceCode,
                receiverProvinceName: id.address.receiverProvinceName,
                receiverCityCode: id.address.receiverCityCode,
                receiverCityName: id.address.receiverCityName,
                receiverDistrictCode: id.address.receiverDistrictCode,
                receiverDistrictName: id.address.receiverDistrictName,
                receiverTownCode: id.address.receiverTownCode,
                receiverTownName: id.address.receiverTownName,
                receiverDetailAddr: id.address.receiverDetailAddr
            };
            for (let i = 0; i < id.items.length; i++) {
                id.items[i].id = '';
            }
            this.tableData = id.items;
        },
        async saveData() {
            this.ruleForm.items = this.tableData;
            this.ruleForm.address = this.indexAddress;
            this.saveBtn = true;
            try {
                // 拆分四级联动发货地址编码
                if (this.addressCode.shippingAddress) {
                    [this.indexAddress.senderProvinceCode, this.indexAddress.senderCityCode,
                        this.indexAddress.senderDistrictCode, this.indexAddress.senderTownCode] =
                        this.addressCode.shippingAddress;
                }
                // 拆分四级联动收货地址编码
                if (this.addressCode.receivingAddress) {
                    [this.indexAddress.receiverProvinceCode, this.indexAddress.receiverCityCode,
                        this.indexAddress.receiverDistrictCode, this.indexAddress.receiverTownCode] =
                        this.addressCode.receivingAddress;
                }
                // 校验手机号码
                const reg = /^1\d{10}$/;
                // 公用校验
                if (!this.ruleForm.customerOrderNo) {
                    this.$message.error('客户订单号不可为空！');
                    return;
                }
                if (!this.ruleForm.customerCode) {
                    this.$message.error('客户不可为空！');
                    return;
                }
                if (!this.ruleForm.siteCode) {
                    this.$message.error('平台不可为空！');
                    return;
                }
                if (!this.ruleForm.orderType) {
                    this.$message.error('订单类型不可为空！');
                    return;
                }
                if (!this.ruleForm.businessMode) {
                    this.$message.error('业务模式不可为空！');
                    return;
                }
                // 纯运输单校验
                if (this.ruleForm.orderType === 'YS' && this.ruleForm.selfMention === '0') {
                    // 发货人信息
                    if (!this.indexAddress.senderName) {
                        this.$message.error('发货联系人不可为空！');
                        return;
                    }
                    if (!reg.test(this.indexAddress.senderMobile)) {
                        this.$message.error('请正确输入发货人手机号码！');
                        return;
                    }
                    if (!this.indexAddress.senderProvinceCode) {
                        this.$message.error('发货地址不可为空！');
                        return;
                    }
                    if (!this.indexAddress.senderDetailAddr || this.indexAddress.senderDetailAddr.length > 80) {
                        this.$message.error('【发货详细地址】不可为空，并控制在 80 字以内！');
                        return;
                    }
                    // 收货人信息
                    if (!this.indexAddress.receiverName) {
                        this.$message.error('收货联系人不可为空！');
                        return;
                    }
                    if (!reg.test(this.indexAddress.receiverMobile)) {
                        this.$message.error('请正确输入收货人手机号码！');
                        return;
                    }
                    if (!this.indexAddress.receiverProvinceCode) {
                        this.$message.error('收货地址不可为空！');
                        return;
                    }
                    if (!this.indexAddress.receiverDetailAddr || this.indexAddress.receiverDetailAddr.length > 80) {
                        this.$message.error('【收货详细地址】不可为空，并控制在 80 字以内！');
                        return;
                    }
                }
                // 状态调整单
                if (this.ruleForm.orderType === 'TF') {
                    for (let i = 0; i < this.ruleForm.items.length; i++) {
                        if (!this.ruleForm.items[i].itemStatus) {
                            this.$message.error('状态不可为空！');
                            return;
                        }
                    }
                    for (let i = 0; i < this.ruleForm.items.length; i++) {
                        if (!this.ruleForm.items[i].itemStatusTo) {
                            this.$message.error('目标状态不可为空！');
                            return;
                        }
                    }
                }
                // 自提入库单
                if (this.ruleForm.selfMention === '1' && (this.ruleForm.orderType === 'AI' || this.ruleForm.orderType === 'PI' || this.ruleForm.orderType === 'TFI' ||
                this.ruleForm.orderType === 'TF' || this.ruleForm.orderType === 'JDPI' || this.ruleForm.orderType === 'RI')) {
                    if (!this.ruleForm.whCode) {
                        this.$message.error('仓库不可为空！');
                        return;
                    }
                }
                // 非自提入库单
                if (this.ruleForm.selfMention === '0' && (this.ruleForm.orderType === 'PI' || this.ruleForm.orderType === 'AI' || this.ruleForm.orderType === 'RI' ||
                this.ruleForm.orderType === 'JDPI')) {
                    if (!this.ruleForm.whCode) {
                        this.$message.error('仓库不可为空！');
                        return;
                    }
                    // if (!this.indexAddress.senderName) {
                    //     this.$message.error('发货联系人不可为空！');
                    //     return;
                    // }
                    // if (!reg.test(this.indexAddress.senderMobile)) {
                    //     this.$message.error('请正确输入发货人手机号码！');
                    //     return;
                    // }
                    // if (!this.indexAddress.senderProvinceCode) {
                    //     this.$message.error('发货地址不可为空！');
                    //     return;
                    // }
                    // // 校验详细地址长度
                    // if (!this.indexAddress.senderDetailAddr || this.indexAddress.senderDetailAddr.length > 80) {
                    //     this.$message.error('【发货详细地址】不可为空，并控制在 80 字以内！');
                    //     return;
                    // }
                }
                // 自提出库单
                if (this.ruleForm.selfMention === '1' && (this.ruleForm.orderType === 'AO' || this.ruleForm.orderType === 'PO' || this.ruleForm.orderType === 'RO')) {
                    if (!this.ruleForm.whCode) {
                        this.$message.error('仓库不可为空！');
                        return;
                    }
                }
                // 非自提出库
                if (this.ruleForm.selfMention === '0' && (this.ruleForm.orderType === 'AO' || this.ruleForm.orderType === 'PO' || this.ruleForm.orderType === 'RO')) {
                    if (!this.ruleForm.whCode) {
                        this.$message.error('仓库不可为空！');
                        return;
                    }
                    if (!this.indexAddress.receiverName) {
                        this.$message.error('收货联系人不可为空！');
                        return;
                    }
                    if (!reg.test(this.indexAddress.receiverMobile)) {
                        this.$message.error('请正确输入收货人手机号码！');
                        return;
                    }
                    if (!this.indexAddress.receiverProvinceCode) {
                        this.$message.error('收货地址不可为空！');
                        return;
                    }
                    if (!this.indexAddress.receiverDetailAddr || this.indexAddress.receiverDetailAddr.length > 80) {
                        this.$message.error('【收货详细地址】不可为空，并控制在 80 字以内！');
                        return;
                    }
                }
                // 校验电话号码
                // if (this.indexAddress.senderTel && !isInt(this.indexAddress.senderTel)) {
                //     this.$message.error('请正确输入发货人电话！');
                //     return;
                // }
                // if (this.indexAddress.receiverTel && !isInt(this.indexAddress.receiverTel)) {
                //     this.$message.error('请正确输入收货人电话！');
                //     return;
                // }
                // 校验货值
                const re = /^[0-9]+.?[0-9]*/;
                if (this.ruleForm.orderValue && !re.test(this.ruleForm.orderValue)) {
                    this.$message.error('【货值】请输入数字,并控制长度小数 3 位, 整数 5 位！');
                    return;
                }
                if (!this.ruleForm.orderValue) {
                    this.ruleForm.orderValue = 0;
                }
                // 把中国标准时间转换成 YYYY-MM-RR hh:mm:ss
                if (this.ruleForm.expectOutTime) {
                    if (dateValue(this.ruleForm.expectOutTime) < dateCurrent()) {
                        this.$message.error('【要求发货时间】不可小于系统当前时间！');
                        return;
                    }
                    this.ruleForm.expectOutTime = dateTimes(this.ruleForm.expectOutTime);
                }
                if (this.ruleForm.expectArriveStartTime) {
                    if (dateValue(this.ruleForm.expectArriveStartTime) < dateCurrent()) {
                        this.$message.error('【要求到达时间】不可小于系统当前时间！');
                        return;
                    }
                    this.ruleForm.expectArriveStartTime = dateTimes(this.ruleForm.expectArriveStartTime);
                }
                if (this.ruleForm.expectOutTime && this.ruleForm.expectArriveStartTime) {
                    if (dateValue(this.ruleForm.expectOutTime) > dateValue(this.ruleForm.expectArriveStartTime)) {
                        this.$message.error('【要求发货时间】不可大于【要求到达时间】！');
                        return;
                    }
                }
                const res = await addOrUpdateCustomerOrderInfo(this.ruleForm);
                if (res.code === '0') {
                    this.$message.success('保存成功');
                    this.index = 1;
                    this.ruleForm.orderNo = res.data.orderNo;
                    this.ruleForm.id = res.data.id;
                }
            } finally {
                this.saveBtn = false;
            }
        },
        // 新增明细
        addDetai() {
            this.$refs.orderTransfer.Add();
        },
        changet(data) {
            for (let i = 0; i < data.length; i++) {
                this.tableData.push(data[i]);
                this.tableData.map((item, index) => {
                    item.index = index;
                });
            }
        },
        // 取消
        closeAdd() {
            this.dialogFormVisible = false;
            this.ruleForm = JSON.parse(JSON.stringify(this.ruleFormUpdate));
            this.indexAddress = JSON.parse(JSON.stringify(this.indexAddressUpdate));
            this.tableData = JSON.parse(JSON.stringify(this.tableDataUpdate));
            this.index = 0;
            this.senderTownCode = [];
            this.receiverTownCode = [];
            // this.$emit('reflashList', true);
        },
        handleSelectionChange(selection) {
            this.rowData = selection;
        },
        selectAll(selection) {
            this.rowData = selection;
        },
        // 表格删除事件
        tableDelete() {
            const rowData = this.rowData || [];
            if (rowData.length === 0) {
                this.$message.error('请优先选择需要删除的商品！');
                return;
            }
            for (let i = 0; i < this.tableData.length; i++) {
                for (let j = 0; j < rowData.length; j++) {
                    if ((this.tableData[i].itemCode === rowData[j].itemCode) && (this.tableData[i].index === rowData[j].index)) {
                        this.tableData.splice(i, 1);
                    }
                }
            }
            this.tableData.map((item, index) => {
                item.index = index;
            });
        },
        // 基础数据弹窗，data为双击弹窗表格行返回的数据
        getAdvanceValue(data) {
            this.ruleForm = { ...this.ruleForm, ...data };
            if (data.siteCode) {
                this.formData.siteCode = data.siteCode;
            }
        },
        // 基础数据下拉
        getSelectValue(data) {
            this.ruleForm.orderType = data.orderType;
            if (data.orderType && data.orderType === 'TF') {
                this.showTargetStatus = true;
            } else {
                this.showTargetStatus = false;
                this.tableData.forEach(item => {
                    delete item.itemStatusTo;
                    delete item.itemStatusToName;
                });
            }
            if (data.orderType && (data.orderType === 'ADI' || data.orderType === 'ADO' || data.orderType === 'TFI' || data.orderType === 'TFO')) {
                this.orderTypeTo = true;
                this.ruleForm.selfMention = '1';
            } else if (data.orderType && data.orderType === 'YS') {
                this.orderTypeTo = true;
                this.ruleForm.selfMention = '0';
            } else {
                this.orderTypeTo = false;
            }
        },
        getSelectBusinessMode(data) {
            this.ruleForm = { ...this.ruleForm, ...data };
        },
        getSelectBusinessModes(data) {
            this.ruleForm = { ...this.ruleForm, ...data };
            if (this.ruleForm.selfMention !== '1') {
                if (data.businessMode && data.businessMode === 'B2B') {
                    this.deliveryTypes = 'DELIVERY_TYPE_B2B';
                    if (!JSON.parse(window.sessionStorage.DELIVERY_TYPE_B2B)[this.ruleForm.deliveryType]) {
                        this.ruleForm.deliveryType = '';
                    }
                } else {
                    this.deliveryTypes = 'DELIVERY_TYPE_B2C';
                    if (!JSON.parse(window.sessionStorage.DELIVERY_TYPE_B2C)[this.ruleForm.deliveryType]) {
                        this.ruleForm.deliveryType = '';
                    }
                }
            }
        },
        // 修改查询
        modify(orderId) {
            getCustomerOrderInfo({}, orderId).then(res => {
                if (res.code === '0') {
                    this.orderStatus = res.data.orderStatus;
                    this.ruleForm = Object.assign({}, this.ruleFormUpdate, res.data);
                    this.indexAddress = Object.assign({}, this.indexAddressUpdate, res.data.address);
                    this.tableData = res.data.items;
                    this.tableData.map((item, index) => {
                        item.index = index;
                    });
                    const data = res.data.address;
                    const senderTownCode = [data.senderProvinceCode, data.senderCityCode, data.senderDistrictCode, data.senderTownCode];
                    const receiverTownCode = [data.receiverProvinceCode, data.receiverCityCode, data.receiverDistrictCode, data.receiverTownCode];
                    for (let i = 0; i < senderTownCode.length; i++) {
                        if (senderTownCode[i]) {
                            this.senderTownCode.push(senderTownCode[i]);
                        }
                    }
                    for (let i = 0; i < receiverTownCode.length; i++) {
                        if (receiverTownCode[i]) {
                            this.receiverTownCode.push(receiverTownCode[i]);
                        }
                    }
                }
            });
        },
        // 滑块
        selfMentionChange(data) {
            this.ruleForm.selfMention = data;
            if (this.ruleForm.selfMention === '1') {
                this.ruleForm.deliveryType = 'ZT';
            } else {
                this.ruleForm.deliveryType = '';
            }
        },
        emergenceFlagChange(data) {
            this.ruleForm.emergenceFlag = data;
        },
        // 订单审核
        async verify() {
            this.verifyBtn = true;
            try {
                if (!this.ruleForm.orderNo) {
                    this.$message.error('订单号为空,不可审核,请先保存！');
                    return;
                }
                const order = [this.ruleForm.orderNo];
                const res = await orderVrify(order);
                if (res.code === '0') {
                    this.$message.success('正在审核，请在订单日志中查看结果！');
                    this.dialogFormVisible = false;
                    this.$emit('reflashList', true);
                }
            } finally {
                this.verifyBtn = false;
            }
        },
        // 基础数据下拉
        getItemsSelectValue(data, label) {
            // data为一个对象（key是传入的prop，value是选择后的options的value），label为选中项的label
            this.tableDataItemStatus.itemStatus = data.itemStatus;
            this.tableDataItemStatus.itemStatusName = label;
        },
        getSelectTargetValue (data, label) {
            this.tableDataTargetStatus.itemStatusTo = data.itemStatusTo;
            this.tableDataTargetStatus.itemStatusToName = label;
        },
        changer(row) {
            const itemStatusName = this.tableDataItemStatus.itemStatusName;
            const itemStatus = this.tableDataItemStatus.itemStatus;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].itemCode === row.itemCode) {
                    this.tableData[i].itemStatusName = itemStatusName;
                    this.tableData[i].itemStatus = itemStatus;
                }
            }
        },
        changer2(row) {
            const itemStatusToName = this.tableDataTargetStatus.itemStatusToName;
            const itemStatusTo = this.tableDataTargetStatus.itemStatusTo;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].itemCode === row.itemCode) {
                    this.tableData[i].itemStatusToName = itemStatusToName;
                    this.tableData[i].itemStatusTo = itemStatusTo;
                }
            }
        }
    }
};
