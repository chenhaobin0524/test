<template>
    <Paper>
        <div class="transpont-details">
            <el-main v-loading="loading">
                <div class="content">
                     <speed :process="process"></speed>
                </div>
                <Vehicle
                :infoData='infoData'
                 :merchant="true"
                 @titleClick='dblclickMassage(info.dispatchNo)'
                 class="vehicle">
                 </Vehicle>
                    <div class="box-card-title" >
                        <div class="box-card-left">
                            <span>
                                &nbsp;&nbsp;商品信息（ 合同号：<span class="orders">{{contractNo}}</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                                总数量：{{totalQty}}&nbsp;&nbsp;/&nbsp;&nbsp; 总方量：{{totalVolume}} m³&nbsp;&nbsp;/&nbsp;&nbsp;总重量：{{totalGrossWeight}} Kg）
                            </span>
                        </div>
                    </div>
                    <template class="table">
                        <el-table :data="tableDataLists" border max-height="110" @cell-dblclick="celldblclick"
                        row-key="senderDetailAddr" label="Drag" ref="dragTable">
                            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
                            </el-table-column>
                            <el-table-column
                            show-overflow-tooltip
                            :prop="item.prop"
                            :label="item.label"
                            :width="item.width"
                            v-for="(item, index) in tableDataItems" :key="index">
                            </el-table-column>
                        </el-table>
                    </template>
                    <dialogTable
                        :tableData="logDataLists"
                        :dialogTable="logTableDate"
                        ref="dialogTable">
                        <div slot="myHeader" class="logtitle">日志信息</div>
                    </dialogTable>
            </el-main>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import Speed from '../../../../components/speed/speed.vue';
import Vehicle from './Vehicle';
import dialogTable from '../../../../components/dialog/dialogTable';
import data from './data.js';
import _ from '@/components/lots/utils';
import { getStep, getAllMassage, goodsDetails, transportLogs } from '../../../../api/transportDetails';
export default {
    name: 'transportDetails',
    components: { Paper, Speed, Vehicle, dialogTable },
    data() {
        return {
            process: {},
            infoData: {},
            tableDataItems: [],
            logTableDate: [],
            logDataLists: [],
            info: {},
            tableDataLists: [ { editing: 'Astern' } ],
            data,
            loading: false,
            contractNo: '',
            totalQty: '',
            totalVolume: '',
            totalGrossWeight: '',
            params: ''

        };
    },
    methods: {
        formatNull(val) {
            return val || '--';
        },
        getFilterAddress(arr, sign = ' / ') {
            return arr.filter(item => item).join(sign);
        },
        load() {
            this.params = this.$route.query.taskNo;
            const that = this;
            const git = function(num) {
                return that.infoData[num].subItems;
            };
            this.loading = true;
            // 顶部步骤接口
            getStep(this.params).then(res => {
                if (+res.code === 0) {
                    this.process.title = res.data.taskStatusName;
                    this.process.speedName = res.data.taskNo;
                    this.process.orderNo = res.data.createTime;
                    res.data.dispatchstatus.list.map((item, index) => {
                        this.process.step[index].id = String(item.isShow);
                        this.process.step[index].carName = item.dispatchStatusName;
                        this.process.step[index].carTimes = item.createTime;
                    });
                }
            }).catch(() => {
            });
            // 中间信息接口
            getAllMassage(this.params).then(res => {
                this.loading = false;
                if (res && res.code === '0') {
                    const info = this.info = res.data;
                    info.dpFlag = info.dpFlag === 'Y' ? '是' : '否';
                    info.ifUpStairs = info.ifUpStairs === 'Y' ? '是' : '否';
                    info.serviceType = info.serviceType === 'Y' ? '是' : '否';
                    info.scPosFlag = +info.scPosFlag === 1 ? '是' : '否';
                    info.intercepStatusCode = info.intercepStatusCode === 'Y' ? '是' : '否';
                    info.distributionWhName = info.distributionWhName ? info.distributionWhName : '无';
                    info.distributionFlag = info.distributionFlag === 'Y' ? '是' : '否';
                    info.distributionLastFlag = info.distributionLastFlag === 'Y' ? '是' : '否';
                    git(0)[0].value = this.formatNull(this.getFilterAddress([
                        info.orderType, info.taskType, info.businessMode], ' - '));
                    git(0)[1].value = this.formatNull(this.getFilterAddress([
                        info.companyName, info.siteName, info.fuseSiteName], ' - '));
                    git(0)[2].value = this.formatNull(info.deliveryType);
                    git(0)[3].value = this.formatNull(info.sourceSystem);
                    git(0)[4].value = this.formatNull(info.businessType);
                    git(1)[0].value = this.formatNull(info.customerOrderNo);
                    git(1)[1].value = this.formatNull(info.customerName);
                    git(1)[2].value = this.formatNull(this.getFilterAddress([
                        info.dpFlag,
                        info.ifUpStairs,
                        info.serviceType,
                        info.scPosFlag
                    ], ' - '));
                    git(2)[0].value = this.formatNull(info.whName);
                    git(2)[0].value = this.formatNull(this.getFilterAddress([
                        info.whName, info.zoonName], ' - '));
                    git(2)[1].value = this.formatNull(info.networkName);
                    git(2)[2].value = this.formatNull(this.getFilterAddress([
                        info.distributionFlag,
                        info.distributionWhName,
                        info.distributionNum,
                        info.distributionLastFlag
                    ], ' - '));
                    git(2)[3].value = this.formatNull(info.intercepStatusCode);
                    git(2)[4].value = this.formatNull(info.remark);
                    git(3)[0].message[0].value = this.formatNull(info.senderName);
                    git(3)[0].message[1].value = this.formatNull(this.getFilterAddress([info.senderMobile, info.senderTel]));
                    git(3)[1].value = this.formatNull(info.upperSenderName);
                    git(3)[2].value = this.formatNull(this.getFilterAddress([
                        info.senderProvinceName,
                        info.senderCityName,
                        info.senderDistrictName,
                        info.senderTownName,
                        info.senderDetailAddr
                    ])) + ' ( ' + this.formatNull(info.startLng) + ' / ' + this.formatNull(info.startLat) + ' ) ';
                    if (info.deliveryType !== 'ZT') {
                        this.dispatchNo = this.formatNull((info['dispatchNo'])) === '-' ? '' : info['dispatchNo'];
                        this.infoData[3].subTitle = this.dispatchNo ? `( 发车单 ：` + this.formatNull((info['dispatchNo'])) + `)` : '';
                    } else {
                        this.infoData[3].subTitle = ``;
                    };
                    git(4)[0].message[0].value = this.formatNull(info.receiverName);
                    git(4)[0].message[1].value = this.formatNull(this.getFilterAddress([info.receiverMobile, info.receiverTel]));
                    git(4)[1].value = this.formatNull(info.upperReceiverName);
                    git(4)[2].value = this.formatNull(this.getFilterAddress([
                        info.receiverProvinceName,
                        info.receiverCityName,
                        info.receiverDistrictName,
                        info.receiverTownName,
                        info.receiverDetailAddr
                    ])) + ' ( ' + this.formatNull(info.endLng) + ' / ' + this.formatNull(info.endLat) + ' ) ';
                    git(5)[0].value = this.formatNull(info.appointmentTime);
                    git(5)[1].value = this.formatNull(info.requireDepartTime);
                    git(5)[2].value = this.formatNull(info.requireArriveTime);
                    git(5)[3].value = this.formatNull(info.expectstartTime) + ' ~ ' + this.formatNull(info.expectendtime);
                    git(5)[4].value = this.formatNull(info.requestFileDate);
                    git(5)[4].value = this.formatNull(info.requestSignDate);
                }
            }).catch(() => {
                this.loading = false;
            });
            // 商品信息
            goodsDetails(this.params).then(res => {
                if (res && res.code === '0') {
                    this.tableDataLists = res.data;
                    this.tableDataLists.map(item => {
                        item.actQty = item.actQty ? item.actQty : 0;
                        item.realReceiveCount = item.realReceiveCount ? item.realReceiveCount : 0;
                        item.planQty = item.planQty + ' / ' + item.actQty + ' / ' + item.realReceiveCount;
                    });
                    this.contractNo = res.data[0].contractNo;
                    this.totalQty = res.data[0].totalQty;
                    this.totalVolume = res.data[0].totalVolume;
                    this.totalGrossWeight = res.data[0].totalGrossWeight;
                }
            }).catch(() => {});
            // 日志信息
            transportLogs(this.params).then(res => {
                this.logDataLists = res.data.list || [];
            });
        },
        copyText(className, i) {
            var clickContent = document.querySelectorAll(className)[i].innerText;
            this.dblclickMassage(clickContent);
        },
        celldblclick(row, column, cell, event) {
            if (row[column.property] === undefined) return;
            var clickTabContent = row[column.property];
            this.dblclickMassage(clickTabContent);
        },
        dblclickMassage(clickContent) {
            var input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', clickContent);
            input.setAttribute('readonly', 'readonly');
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            this.$message.success(`‘${input.value}’复制成功`);
        }
    },
    created() {
        this.process = _.clone(data.process);
        this.infoData = _.clone(data.infoData);
        this.tableDataItems = _.clone(data.tableDataItems);
        this.logTableDate = _.clone(data.logTableDate);
    },
    mounted() {
        this.load();
        this.$nextTick(() => {
            const dblclicks = document.querySelectorAll('.transpont-details .orders');
            for (let i = 0; i < dblclicks.length; i++) {
                dblclicks[i].addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    this.copyText('.transpont-details .orders', i);
                });
            }
        });
    },
    activated() {
        this.load();
    }
};
</script>
<style lang="less">
.transpont-details{
    .box-card-title{
       text-align: right;
       line-height: 40px;
       margin-right: 10px;
       display: flex;
       color: rgb(102, 98, 90);
       font-size: 16px;
       .box-card-left{
           flex:1;
           height: 40px;
           line-height: 40px;
           text-align: left;
       }
       .el-table {
           height: 200px;
           overflow-y:auto;
       }
    }
     .logtitle{
        font-size: 16px;
        padding: 8px;
        color: rgb(102, 98, 90);
        font-weight: 580
       }
       .vehicle{
        .circular{
         display: none;
       }
       }
    .departure{
         text-align: center;
        .orders{
            font-size: 16px;
            color: rgb(102, 98, 90);
        }
        .departureHead-stop{
            font-size: 18px;
        }
       .departureHead .departureHead-left .departureHead-start{
        .orders{
            font-size: 16px;
            color: rgb(102, 98, 90);
        }
        .numbers{
            color: rgb(102, 98, 90);
            text-align: center;
        }
        }

    }
 }
</style>