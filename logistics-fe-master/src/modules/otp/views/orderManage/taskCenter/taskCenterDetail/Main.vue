<template>
    <Paper class="example" id="taskCenterDetail">
        <div class="departure" id="taskDetail">
            <div class="content">
                <top-progress :taskNo="taskNo" :progress="taskProgress"></top-progress>
            </div>
            <Vehicle
                :infoData="infoData"
                @operation="operation"
                :merchant="true"
                :emergenceFlag="emergenceFlag"
                :scPosFlag="scPosFlag"
                :specimenType="specimenType"
                @showDispatchInfo="showDispatchInfo"
                ></Vehicle>
            <div class='tab1'>
                <div class="tab1_title">商品信息
                    <strong>
                        （总件数：{{info.totalQty}}&nbsp;&nbsp;&nbsp;&nbsp;总体积：{{info.totalVolume + 'm³'}}{{info.orderValue ? '&nbsp;&nbsp;&nbsp;&nbsp;货值：'+info.orderValue : ''}}）
                    </strong>
                </div>
                <dialogTable
                    :tableData="tableData"
                    :dialogTable="dialogTable"
                    ref="dialogTable">
                </dialogTable>
            </div>
            <Log
                :visible.sync="visible"
                :tableData="logData"
                :items="logTable"
                :tableWidth="'60%'"
                title="操作日志"
                @handleClose="handleClose"
            ></Log>
            <el-dialog title="发货单信息" :visible.sync="dispatchShow">
                <el-form>
                    <el-form-item :label="dispatchInfoCN[key]" v-for="(item, key) in dispatchInfo" :key="key">
                        <span v-text="item"></span>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import Vehicle from '../../../../components/speed/Vehicle';
import dialogTable from '../../../../components/dialog/dialogTable';
import topProgress from './_topProgress';
import data from './data.js';
import _ from '@/components/lots/utils';
import { taskDetailInfoApi, getTaskLogApi, getDetailTraces, getOrderAgings } from '../../../../api/taskCenter';
import Log from '../../../../components/dispatchPopup/dispatchList/Main';
export default {
    name: 'taskCenterDetail',
    data() {
        return {
            info: {},
            dispatchInfo: {
                dispatchNo: '',
                driver: '',
                driverContactWay: '',
                vehicleCard: '',
                carrierName: '',
                companyName: ''
            },
            dispatchInfoCN: {
                driver: '司机名称',
                driverContactWay: '司机号码',
                vehicleCard: '车牌号',
                carrierName: '承运商',
                companyName: '公司名称',
                dispatchNo: '发车单号'
            },
            dispatchShow: false,
            process: {},
            infoData: [],
            emergenceFlag: 0,
            scPosFlag: 0,
            specimenType: 0,
            title: '操作日志',
            tableData: [],
            logData: [],
            tabItems: [
                {
                    prop: 'operateName',
                    label: '操作类型',
                    type: 'normal'
                },
                {
                    prop: 'operateContent',
                    label: '操作内容',
                    type: 'normal'
                },
                {
                    prop: 'createUserCode',
                    label: '创建人',
                    type: 'normal'
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    type: 'normal'
                }
            ],
            taskNo: '',
            visible: false,
            dialogTable: {
                'width': '',
                'border': true,
                'selection': false,
                'isPagination': false,
                'columns': data.tableDataItems
            },
            logTable: [
                {
                    prop: 'operateName',
                    label: '操作类型',
                    type: 'normal'
                },
                {
                    prop: 'operateContent',
                    label: '操作内容',
                    type: 'normal'
                },
                {
                    prop: 'createUserCode',
                    label: '创建人',
                    type: 'normal'
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    type: 'normal'
                }
            ],
            hide: true,
            initTaskAddress: data.initData,
            taskProgress: []
        };
    },
    props: {
        detailData: {
            type: Object
        }
    },
    created() {
        this.process = data.process;
        this.infoData = data.infoData.map(item => { return JSON.parse(JSON.stringify(item)); });
        this.tableData = data.tableData;
    },
    mounted() {
        this.taskNo = this.$route.query.taskNo;
        this.getDetailInfo(this.taskNo);
        this.getDetailLog(this.taskNo);
        this.$nextTick(() => {
            document.querySelector('.departure .deliver').addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.copyText('.departure .deliver');
            });
            document.querySelector('.departure .infor .adds').addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.copyText('.departure .infor .adds');
            });
            document.querySelector('.departure .infor .address').addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.copyText('.departure .infor .address');
            });
            document.querySelector('.departure .taskNo').addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.copyText('.departure .taskNo');
            });
        });
    },
    methods: {
        copyText(className) {
            var clickContent = document.querySelector(className).innerText;
            var input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', clickContent);
            input.setAttribute('readonly', 'readonly');
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            this.$message.success(`‘${input.value}’复制成功`);
        },
        operation() {
            this.visible = true;
        },
        handleClose() {
            this.visible = false;
        },
        async getOrderAgings(orderNo) {
            const res = await getOrderAgings({ orderNo });
            if (res) {
                var resData = res.data.list;
                var compare = function(pro) {
                    return function(a, b) {
                        var value1 = a[pro];
                        var value2 = b[pro];
                        return value1 - value2;
                    };
                };
                this.taskProgress = resData.sort(compare('orderStatus'));
            }
        },
        async getDetailInfo(taskNo) {
            const detailData = await taskDetailInfoApi({ taskNo: taskNo });
            const tracesData = await getDetailTraces({ taskNo: taskNo });
            if (detailData) {
                this.setOtherData(detailData.data, 2);
                const git = (num) => {
                    return this.infoData[num].subItems;
                };
                const taskAddress = detailData.data.taskAddress || {};
                const info = this.info = detailData.data;
                // 获取时效列表
                this.getOrderAgings(info.orderNo);

                git(0)[0].value = this.handleNull(info.orderTypeName) + '-' + this.handleNull(info.taskTypeName) + '-' + this.handleNull(info.businessMode);
                git(0)[1].value = this.handleNull([_.get(info, 'siteCode', info.upperWhCode), _.get(info, 'siteName', info.upperWhName), _.get(info, 'whName', null)].filter(val => !!val).join(' - '));
                git(0)[2].value = this.handleNull(info.orderSiteName) + '-' + this.handleNull(info.orderWhName);
                if (info.taskType === 'DI' || info.taskType === 'DO' || (info.deliveryType === 'NET' && +info.distributionFlag === 1 && +info.distributionLastFlag === 1)) {
                    git(0)[2].label = '始发平台';
                } else if (info.taskType === 'RDI' || info.taskType === 'RDO' || (info.deliveryType === 'NET' && +info.distributionFlag === 1 && +info.distributionLastFlag === 1)) {
                    git(0)[2].label = '入库平台';
                } else {
                    git(0)[2].noShow = true;
                }
                git(0)[3].value = this.handleNull(info.businessTypeName);
                git(1)[0].value = this.handleNull(info.customerOrderNo);
                git(1)[1].value = this.handleNull([_.get(info, 'customerCode', info.upperCustomerCode), _.get(info, 'customerName', info.upperCustomerName)].join(' - '));
                git(1)[2].value = this.handleNull(info.expectArriveEndTime
                    ? `${info.expectArriveStartTime}~${info.expectArriveEndTime}`
                    : info.expectArriveStartTime);
                git(2)[0].value = this.handleNull(info.appointmentTime);
                git(2)[1].value = this.handleNull(info.agingProductName);
                git(2)[2].value = this.handleNull(info.remark);
                git(3)[0].message[0].value = this.handleNull(taskAddress.senderName);
                git(3)[0].message[1].value = this.handleNull(this.getFilterAddress([taskAddress.senderMobile, taskAddress.senderTel]));
                git(3)[1].value = this.handleNull(info.upperSenderCode) + '-' + this.handleNull(info.upperSenderName);
                if (info.inOutType === 'IN' && (info.targetSiteCode || info.targetCustomerCode)) {
                    git(3)[1].value = this.handleNull([info.targetSiteName, info.targetCustomerName].filter(item => item).join(' / '));
                }
                git(3)[2].value = this.handleNull(this.getFilterAddress([
                    taskAddress.senderProvinceName,
                    taskAddress.senderCityName,
                    taskAddress.senderDistrictName,
                    taskAddress.senderTownName,
                    taskAddress.senderDetailAddr
                ]));
                if (info.deliveryType !== 'ZT') {
                    this.dispatchNo = this.handleNull((info['dispatchNo'])) === '-' ? '' : info['dispatchNo'];
                    this.infoData[3].subTitle = this.dispatchNo ? `( 发车单 ` + this.handleNull((info['dispatchNo'])) + `)` : '';
                } else {
                    this.infoData[3].subTitle = ``;
                }
                // 网点显示隐藏判断(国苏发网点（upperOrderType=PO-GS-01）||宅配订单(deliveryType=DOT、NET)要展示网点地址)
                if (!(info.upperOrderType === 'PO-GS-01' || info.deliveryType === 'DOT' || info.deliveryType === 'NET')) {
                    // showItem = true为隐藏（切记）
                    this.infoData[4].showItem = true;
                    this.infoData = this.infoData.concat([]);
                }
                git(4)[0].message[0].value = this.handleNull(taskAddress.networkContact);
                git(4)[0].message[1].value = this.handleNull(taskAddress.networkPhone);
                git(4)[1].value = this.handleNull(taskAddress.networkName);
                git(4)[2].value = this.handleNull(taskAddress.networkAddr);
                // 分拨出库的宅配订单收货信息取final
                if ((info.taskType === 'DO' && info.businessType === '10') || +info.distributionLastFlag === 1) {
                    git(5)[0].message[0].value = this.handleNull(taskAddress.finalName);
                    git(5)[0].message[1].value = this.handleNull(taskAddress.finalMobile);
                    git(5)[1].value = this.handleNull([info.upperReceiverCode, info.upperReceiverName].filter(item => item).join(' / '));
                    if (info.inOutType !== 'IN' && (info.targetSiteCode || info.targetCustomerCode)) {
                        git(5)[1].value = this.handleNull([info.targetSiteName, info.targetCustomerName].filter(item => item).join(' / '));
                    }
                    git(5)[2].value = this.handleNull(this.getFilterAddress([
                        taskAddress.finalProvinceName,
                        taskAddress.finalCityName,
                        taskAddress.finalDistrictName,
                        taskAddress.finalTownName,
                        taskAddress.finalDetailAddr
                    ]));
                } else {
                    git(5)[0].message[0].value = this.handleNull(taskAddress.receiverName);
                    git(5)[0].message[1].value = this.handleNull(this.getFilterAddress([taskAddress.receiverMobile, taskAddress.receiverTel]));
                    git(5)[1].value = this.handleNull([info.upperReceiverCode, info.upperReceiverName].filter(item => item).join(' / '));
                    if (info.inOutType !== 'IN' && (info.targetSiteCode || info.targetCustomerCode)) {
                        git(5)[1].value = this.handleNull([info.targetSiteName, info.targetCustomerName].filter(item => item).join(' / '));
                    }
                    git(5)[2].value = this.handleNull(this.getFilterAddress([
                        taskAddress.receiverProvinceName,
                        taskAddress.receiverCityName,
                        taskAddress.receiverDistrictName,
                        taskAddress.receiverTownName,
                        taskAddress.receiverDetailAddr
                    ]));
                }
                const pushItem = (type) => {
                    const idx = type === 'OUT' ? 5 : 3;
                    this.infoData[idx].subItems.push({
                        label: '配送方式',
                        value: info.deliveryTypeName
                    });
                };
                pushItem(info.inOutType);
                this.process.orderNo = this.taskNo;
                this.tableData = detailData.data.itemList.map(val => {
                    if (val.actQty) {
                        val['planQty/actQty'] = [val.planQty || 0, val.actQty].join(' / ');
                    } else {
                        val['planQty/actQty'] = val.planQty;
                    }
                    // 判断是否存在目标状态
                    if (val.itemStatusToName) {
                        val.itemStatusName += ` >>> ${val.itemStatusToName}`;
                    }
                    val['whName'] = detailData.data.whName;
                    return val;
                });
                const tracesState = this.getTracesStatus(detailData.data.deliveryType, detailData.data.inOutType, detailData.data.orderStatusName);
                const step = this.setTraces(tracesState).map(item => {
                    const orderStatus = +detailData.data.orderStatus;
                    const excuteStatus = +detailData.data.excuteStatus;
                    let isActive = false;
                    // 先判断执行状态，再判断订单状态
                    if (excuteStatus === 880 && tracesState === 'INDELIVERY') {
                        isActive = true;
                    } else if (Array.isArray(item.carStatus)) {
                        isActive = item.carStatus.findIndex(ite => {
                            return ite <= orderStatus;
                        }) > -1;
                    } else {
                        isActive = item.carStatus <= orderStatus;
                        if (orderStatus === 999) {
                            isActive = false;
                        } else if (tracesState === 'OUTDOT' && orderStatus === 680 && item.carName === '已签收') {
                            item.carName = '部分签收';
                            isActive = true;
                        } else if (tracesState === 'OUTDOT' && orderStatus === 610 && item.carName === '抵达网点') {
                            item.carName = '支线到达';
                        }
                    }
                    item.id = isActive ? '1' : '0';

                    // 判断carTimes
                    let isFlag = false;
                    if (Array.isArray(item.carStatus)) {
                        isFlag = tracesData.data.list.find(traceItem => {
                            return item.carStatus.includes(traceItem.orderStatus);
                        });
                    } else {
                        isFlag = tracesData.data.list.find(traceItem => {
                            return traceItem.orderStatus === item.carStatus;
                        });
                    }
                    if (isFlag) {
                        item.carTimes = isFlag.createTime;
                    }
                    return item;
                });
                this.$set(this.process, 'step', step);
            }
        },
        getDetailLog(taskNo) {
            getTaskLogApi({ taskNo: taskNo }).then(res => {
                if (res) {
                    this.logData = res.data;
                }
            });
        },
        getFilterAddress(arr, sign = ' / ') {
            return arr.filter(item => item).join(sign);
        },
        setStep(idx, condition) {
            this.process.step[idx].id = condition ? '1' : '0';
            this.process.step[idx].carTimes = condition ? condition.createTime : '';
        },
        setOtherData(data, idx) {
            this.infoData[idx].subItems[0].value = data['appointmentTime'];
            this.infoData[idx].subItems[1].value = data['agingProductName'];
            this.infoData[idx].subItems[2].value = data['remark'];
            this.emergenceFlag = data['emergenceFlag'] ? 1 : 0;
            this.scPosFlag = data['scPosFlag'] ? 1 : 0;
            this.specimenType = data['specimenType'];
        },
        handleNull(data) {
            if (Object.prototype.toString.call(data) === '[object Null]' || Object.prototype.toString.call(data) === '[object Undefined]' || data === 'null') {
                return '-';
            } else {
                return data;
            }
        },
        showDispatchInfo() {
            this.$router.push({
                params: { dispatchNo: this.dispatchNo },
                name: 'dispatchOrder'
            });
        },
        getTracesStatus(deliveryType, InOutType, orderStatus) {
            let combination;
            switch (`${InOutType}${deliveryType}`) {
            case 'INZT':
                combination = 'INZT';
                break;
            case 'OUTZT':
                combination = 'OUTZT';
                break;
            case 'INDELIVERY':
                combination = 'INDELIVERY';
                break;
            case 'OUTDELIVERY':
                combination = 'OUTDELIVERY';
                break;
            case 'OUTDOT':
                combination = 'OUTDOT';
                break;
            case 'INDOT':
                combination = 'INDOT';
                break;
            case 'OUTEXPRESS':
                combination = 'OUTZT';
                break;
            case 'INEXPRESS':
                combination = 'INZT';
                break;
            case 'OUTWAREHOUSEMATCHING':
                combination = 'OUTZT';
                break;
            case 'INWAREHOUSEMATCHING':
                combination = 'INZT';
                break;
            case 'ADJUSTZT':
                combination = 'Adjusted';
                break;
            }
            if (!InOutType) {
                combination = 'Adjusted';
            } else if (InOutType === 'YS') {
                combination = 'YS';
            }
            return combination;
        },
        setTraces(data) {
            let traces = [];
            switch (data) {
            // 已测试
            case 'INZT':
                traces = this.factoryTraces([{ name: 'EXAMINE', state: 0 }, { name: 'ISSUED', state: 0 }, { name: 'STORED', state: 0 }]);
                break;
            // 已测试
            case 'OUTZT':
                traces = this.factoryTraces([{ name: 'EXAMINE', state: 0 }, { name: 'ISSUED', state: 0 }, { name: 'SENT', state: 0 }]);
                break;
                // 已测试
            case 'INDELIVERY':
                traces = this.factoryTraces([{ name: 'EXAMINE', state: 0 }, { name: 'SCHEDULED', state: 0 }, { name: 'SENT', state: 0 }, { name: 'STORED', state: 0 }]);
                break;
                // 已测试
            case 'OUTDELIVERY':
                traces = this.factoryTraces([
                    { name: 'EXAMINE', state: 0 }, { name: 'SHUNTING', state: 0 }, { name: 'SENT', state: 0 }, { name: 'LAUNCHED', state: 0 }, { name: 'SIGNED', state: 0 }
                ]);
                break;
            // 已测试
            case 'Adjusted':
                traces = this.factoryTraces([{ name: 'EXAMINE', state: 0 }, { name: 'ADJUSTED', state: 0 }]);
                break;
            // 已测试
            case 'OUTDOT':
                traces = this.factoryTraces([
                    { name: 'EXAMINE', state: 0 }, { name: 'SHUNTING', state: 0 }, { name: 'SENT', state: 0 },
                    { name: 'LAUNCHED', state: 0 }, { name: 'POINT', state: 0 }, { name: 'SIGNED', state: 0 }
                ]);
                break;
            case 'INDOT':
                traces = this.factoryTraces([
                    { name: 'EXAMINE', state: 0 }, { name: 'ISSUED', state: 0 }, { name: 'SHUNTING', state: 0 },
                    { name: 'STORED', state: 0 }
                ]);
                break;
            // 已测试
            case 'YS':
                traces = this.factoryTraces([
                    { name: 'EXAMINE', state: 0 }, { name: 'SHUNTING', state: 0 }, { name: 'LAUNCHED', state: 0 }, { name: 'SIGNED', state: 0 }
                ]);
                break;
            }
            return traces;
        },
        factoryTraces(tracesList) {
            const stepObj = [];
            const status = {
                EXAMINE: 100,
                ISSUED: [240, 250, 255],
                SENT: [350, 430, 530],
                INSTOCK: 860,
                STORED: [400, 500, 785, 815, 860, 870],
                LAUNCHED: [370, 450, 550],
                SHUNTING: [300, 410, 510],
                SIGNED: 690,
                halfSIGNED: 680,
                SCHEDULED: 300,
                ADJUSTED: 210,
                POINT: [610, 620, 625, 630]
            };
            const dic = {
                EXAMINE: '新建',
                ISSUED: ['待下发', '已下发'],
                STORED: ['待入库', '已入库'],
                INSTOCK: ['待入货', '已入货'],
                SCHEDULED: ['待调度', '已调度'],
                SENT: ['待发货', '已发货'],
                LAUNCHED: ['待发车', '已发车'],
                POINT: '抵达网点',
                SHUNTING: ['待调车', '已调车'],
                ADJUSTED: '已调整',
                SIGNED: ['待签收', '已签收'],
                halfSIGNED: '部分签收'
            };
            // 610 625 抵达网点
            tracesList.forEach((item, idx) => {
                stepObj.push({
                    id: item.state,
                    images: {
                        active: require('@/assets/carActive.png'),
                        notActive: require('@/assets/carNotActive.png')
                    },
                    carName: dic[item.name],
                    carTimes: '',
                    carStatus: status[item.name]
                });
            });
            return stepObj;
        }
    },
    components: { Paper, Vehicle, dialogTable, topProgress, Log }
};
</script>
<style lang='less'>
#taskCenterDetail{
    .tab1 {
        margin: 0;
        .tab1_title {
            height: 42px;
            line-height: 42px;
            font-size: 14px;
            strong {
                color: rgb(86, 213, 214);
            }
        }
    }
    .table-btn {
        margin: 0 5px;
        color: #00a9ac;
        cursor: pointer;
    }
    .displayFlex{
    display: flex;
    }

    .flex1{
    flex: 1;
    }

    .flexDirection{
    flex-direction:row;
    }

    .justifyContent{
    justify-content: center;
    align-items: center;
    }

    .flexShrink{
    flex-shrink: 1;
    }

    .flexDirection{
    flex-direction:column;
    }

    .textAlign{
    text-align: center;
    }
}
.dialogTable {
    overflow: hidden;
    .dialogTablePagination{
        position:relative;
    }
}
#taskDetail {
    .departureHead-start{
            position: relative;
            .numbers {
                display: inline-block;
            }
    }
    .speedIcon{
        position: absolute;
        left: -35px;
    }
    .infor-title{
        span{
             text-decoration: underline;
        }
    }
    .carTimes{width: 145px;}
}

</style>