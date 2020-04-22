<template>
    <div class="warehouse-network">
        <div class="left-menu">
            <div class="menu-desc">
                <span>仓</span>
                <span>配</span>
                <span>网</span>
                <span>络</span>
                <span>监</span>
                <span>控</span>
                <span>中</span>
                <span>心</span>
            </div>
            <img class="menu-img" src="./images/menu.png" width="100%" height="100%" alt="仓配网络监控中心">
        </div>
        <div class="right-content">
            <div class="warehouse">
                <div class="title">
                    <img class="title-logo" src="./images/house.png" width="auto" height="90%" alt="仓库图标">
                    <span class="title-desc">仓库</span>
                </div>
                <div class="warehouse-up">
                    <div class="warehouse-up-left bgc-blue">
                        <div class="amount-cs">
                            <div class="amount-cs-up">
                                <div class="amount-num" :style="{color: qtyRisk === '高' ? '#ff7777' : qtyRisk === '中' ? '#ffce6d' : '#03fdfd'}"> {{ qtyRisk }}</div>
                                <span class="amount-desc">质量风险</span>
                            </div>
                            <div class="amount-cs-down">
                                <div class="amount-num">{{ bos}}</div>
                                <span class="amount-desc">BOS异常#</span>
                            </div>
                        </div>
                        <div class="amount-truck">
                            <div class="amount-truck-up">
                                <div class="amount-num"> {{ pastNm }}</div>
                                <span class="amount-desc">过去24hr/1M NM#</span>
                            </div>
                            <div class="amount-truck-down">
                                <div class="amount-num">{{ retAc }}</div>
                                <span class="amount-desc">过去24hr/1M 红灯行为#</span>
                            </div>
                        </div>
                    </div>
                    <div class="warehouse-up-right bgc-blue">
                        <div class="pie-one">
                            <pie-chart :htmlWidth="htmlWidth"
                                       :pieData="pieDataOne"
                                       :className="'pieOne'"
                                       :id="'pieOne'"
                                       :color="'#03FDFD'">
                            </pie-chart>
                            <span class="pie-desc">库存比对<br />Inv. Recon</span>
                        </div>
                        <div class="pie-two">
                            <pie-chart :htmlWidth="htmlWidth"
                                       :pieData="pieDataTwo"
                                       :className="'pieTwo'"
                                       :id="'pieTwo'"
                                       :color="'#3591FC'">
                            </pie-chart>
                            <span class="pie-desc">准时发货率<br />SOT</span>
                        </div>
                        <div class="pie-three">
                            <pie-chart :htmlWidth="htmlWidth"
                                       :pieData="pieDataThree"
                                       :className="'pieThree'"
                                       :id="'pieThree'"
                                       :color="'#00CAFF'">
                            </pie-chart>
                            <span class="pie-desc">准时收货率<br />ATR</span>
                        </div>
                    </div>
                </div>
                <div class="warehouse-middle">
                    <div class="warehouse-middle-left bgc-blue">
                        <div class="amount-cs">
                            <div class="amount-cs-up">
                                <div class="amount-num"> {{ prePickCs }}</div>
                                <span class="amount-desc">过去24hr提货量cs</span>
                            </div>
                            <div class="amount-cs-down">
                                <div class="amount-num">{{ preUnloadCs }}</div>
                                <span class="amount-desc">过去24hr卸货量cs</span>
                            </div>
                        </div>
                        <div class="amount-truck">
                            <div class="amount-truck-up">
                                <div class="amount-num"> {{ prePickTruck }}</div>
                                <span class="amount-desc">过去24hr提货量truck</span>
                            </div>
                            <div class="amount-truck-down">
                                <div class="amount-num">{{ preUnloadTruck }}</div>
                                <span class="amount-desc">过去24hr卸货量truck</span>
                            </div>
                        </div>
                    </div>
                    <!--<div class="warehouse-middle-right bgc-blue">-->
                        <!--<horizontal-bar :htmlWidth="htmlWidth"-->
                                        <!--:horizontalBarData="horizontalBarData">-->
                        <!--</horizontal-bar>-->
                    <!--</div>-->
                    <div class="warehouse-middle-right bgc-blue">
                        <div class="amount-cs">
                            <div class="amount-cs-up">
                                <div class="amount-num"> {{ futPickCs }}</div>
                                <span class="amount-desc">未来24hr提货量cs</span>
                            </div>
                            <div class="amount-cs-down">
                                <div class="amount-num">{{ futUnloadCs}}</div>
                                <span class="amount-desc">未来24hr卸货量cs</span>
                            </div>
                        </div>
                        <div class="amount-truck">
                            <div class="amount-truck-up">
                                <div class="amount-num"> {{ futPickTruck }}</div>
                                <span class="amount-desc">未来24hr提货量truck</span>
                            </div>
                            <div class="amount-truck-down">
                                <div class="amount-num">{{ futUnloadTruck }}</div>
                                <span class="amount-desc">未来24hr卸货量truck</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="warehouse-down">
                    <div class="warehouse-down-left">
                        <div class="gauge-title"><span>库存</span></div>
                        <div class="gauge1">
                            <gauge-chart :htmlWidth="htmlWidth"
                                         :gaugeTotalStock="gaugeTotalStock"
                                         :gaugeData="gaugeData">
                            </gauge-chart>
                        </div>
                    </div>
                    <div class="warehouse-down-right">
                        <vertical-bar :htmlWidth="htmlWidth"
                                      :verticalBarData="verticalBarData">
                        </vertical-bar>
                    </div>
                </div>
            </div>
            <div class="transport">
                <div class="title"><img class="title-logo" src="./images/car.png" width="auto" height="90%" alt="运输图标">
                    <span class="title-desc">运输</span>
                </div>
                <div class="transport-up">
                    <div class="transport-up-left">
                        <div class="pie-four">
                            <pie-chart style="margin-bottom: 1.2rem"
                                       :htmlWidth="htmlWidth"
                                       :pieData="pieDataFour"
                                       :className="'pieFour'"
                                       :id="'pieFour'"
                                       :color="'#03FDFD'">
                            </pie-chart>
                            <span class="pie-desc">准时到车率(AOT)</span>
                        </div>
                        <div class="pie-five">
                            <pie-chart style="margin-bottom: 1.2rem"
                                       :htmlWidth="htmlWidth"
                                       :pieData="pieDataFive"
                                       :className="'pieFive'"
                                       :id="'pieFive'"
                                       :color="'#00CAFF'">
                            </pie-chart>
                            <span class="pie-desc">准时到货率(DOT)</span>
                        </div>
                    </div>
                    <div class="transport-up-right">
                        <div class="liquidFill-one">
                            <liquid-chart :color="liquidColorOne"
                                          :id="'liquidOne'"
                                          :liquidData="liquidDataOne">
                            </liquid-chart>
                            <span class="liquid-desc">GPS有效率</span>
                        </div>
                        <div class="liquidFill-two">
                            <liquid-chart :color="liquidColorTwo"
                                          :id="'liquidTwo'"
                                          :liquidData="liquidDataTwo">
                            </liquid-chart>
                            <span class="liquid-desc">电子锁有效率</span>
                        </div>
                        <div class="liquidFill-three">
                            <liquid-chart :color="liquidColorThree"
                                          :id="'liquidThree'"
                                          :liquidData="liquidDataThree">
                            </liquid-chart>
                            <span class="liquid-desc">仓库扫码率</span>
                        </div>
                        <div class="liquidFill-four">
                            <liquid-chart :color="liquidColorFour"
                                          :id="'liquidFour'"
                                          :liquidData="liquidDataFour">
                            </liquid-chart>
                            <span class="liquid-desc">运输扫码率</span>
                        </div>
                    </div>
                </div>
                <div class="transport-middle">
                    <div class="first">
                        <div class="transport-num">
                            <!--<span :style="{'color': rejectWarning > 0.001 ? '#FF5956' : '#03FDFD'}">-->
                                <!--{{ transportReject }}-->
                            <!--</span>-->
                            <span>
                                {{ transportReject }}
                            </span>
                        </div>
                        <span class="transport-desc">Reject#</span>
                    </div>
                    <div class="second">
                        <div class="transport-num">
                            <span>
                                {{ transportOrder }}
                            </span>
                        </div>
                        <span class="transport-desc">系统未发货量<br />Non GI</span>
                    </div>
                    <div class="third">
                        <div class="transport-num">
                            <span :style="{'color': latePodWarning > 0 ? '#FF5956' : '#03FDFD'}">
                                {{ transportLatePod }}
                            </span>
                        </div>
                        <span class="transport-desc">回单延迟<br />Late POD</span>
                    </div>
                    <div class="forth">
                        <div class="transport-num">
                             <span :style="{'color': reorderWarning < 0.99 ? '#FF5956' : '#03FDFD'}">
                                {{ transportReorder }}
                            </span>
                        </div>
                        <span class="transport-desc">返单及时率<br />PS return</span>
                    </div>
                </div>
                <div class="transport-down">
                    <map-chart
                        :htmlWidth="htmlWidth"
                        :mapPoints="mapPoints"
                        :lossCar="lossCar"
                        :normalCar="normalCar"
                        :riskCar="riskCar">
                    </map-chart>
                    <!--<iframe src="https://pgtvsstest.e6yun.com/Login/Index?&rurl=%2f" frameborder="0" width="100%" height="100%" style="position: absolute;left: 0;top: 0;z-index: 999"></iframe>-->
                    <div class="warning-text">
                        <span class="warning-text-title">车辆在途监控</span>
                        <span class="warning-text-num">{{ riskCarNum }}</span>
                        <span class="warning-text-desc">有迟到风险车辆</span>
                    </div>
                    <div class="map-legend1"><div class="map-legend1-color"></div><span>有迟到风险</span></div>
                    <div class="map-legend2"><div class="map-legend2-color"></div><span>正常</span></div>
                    <div class="map-legend3"><div class="map-legend3-color"></div><span>信号丢失</span></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import pieChart from './echarts/Pie';
// import horizontalBar from './echarts/HorizontalBar';
import gaugeChart from './echarts/Gauge';
import verticalBar from './echarts/VerticalBar';
import liquidChart from './echarts/LiquidFill';
import mapChart from './echarts/MapChart';
import { getPast, getNext, getRate, getIPP, getAot, getGps, getEfficiency, getReject, getLate, getLoss } from '../../api/WarehouseNetworkApi';
const liquidWarningColor = '#FE5955';
const liquidGreenColor = '#2AC9BB';
const liquidBlueColor = '#0058F4';

export default {
    name: 'warehouseNetwork',
    components: { pieChart, gaugeChart, verticalBar, liquidChart, mapChart },
    data() {
        return {
            htmlWidth: document.documentElement.clientWidth || document.body.clientWidth,
            qtyRisk: '-',
            bos: '0',
            pastNm: '0/0',
            retAc: '0/0',
            // 过去
            prePickCs: 0,
            preUnloadCs: 0,
            prePickTruck: 0,
            preUnloadTruck: 0,
            // 未来
            futPickCs: 0,
            futUnloadCs: 0,
            futPickTruck: 0,
            futUnloadTruck: 0,
            pieDataOne: 0,
            pieDataTwo: 0,
            pieDataThree: 0,
            pieDataFour: 0,
            pieDataFive: 0,
            horizontalBarData: [],
            gaugeData: '0',
            gaugeTotalStock: '',
            verticalBarData: [],
            transportReject: '0/0',
            transportOrder: 0,
            transportLatePod: '0',
            transportReorder: '0%',
            liquidColorOne: liquidGreenColor,
            liquidColorTwo: liquidBlueColor,
            liquidColorThree: liquidGreenColor,
            liquidColorFour: liquidBlueColor,
            liquidDataOne: 0,
            liquidDataTwo: 0,
            liquidDataThree: 0,
            liquidDataFour: 0,
            riskCarNum: 0,
            normalCar: [],
            riskCar: [],
            lossCar: [],
            mapPoints: [],
            // 判断文字标红
            rejectWarning: 0,
            orderWarning: 0,
            latePodWarning: 0,
            reorderWarning: 0
        };
    },
    methods: {
        /** 每三个数字加一个',' **/
        format_number(n) {
            if (n !== null) {
                const b = parseInt(n).toString();
                const len = b.length;
                if (len <= 3) return b;
                const r = len % 3;
                return r > 0 ? b.slice(0, r) + ',' + b.slice(r, len).match(/\d{3}/g).join(',') : b.slice(r, len).match(/\d{3}/g).join(',');
            } else {
                return 0;
            }
        },
        /** 补够一位小数 **/
        // saveOneZero(data) {
        //     const num  = String(data).split('.').length;
        //     if (num === 1) {
        //         return data + '.0';
        //     }
        // },
        /** 准时到车率 **/
        handleGetAot() {
            getPast().then(res => {
                if (res && +res.code === 0) {
                    this.prePickCs = this.format_number(res.data[0].csPickupQty);
                    this.preUnloadCs = this.format_number(res.data[0].csUnloadQty);
                    this.prePickTruck = this.format_number(res.data[0].tkPickupQty);
                    this.preUnloadTruck = this.format_number(res.data[0].tkUnloadQty);
                }
            });
            getNext().then(res => {
                if (res && +res.code === 0) {
                    this.futPickCs = this.format_number(res.data[0].csPickupQty);
                    this.futUnloadCs = this.format_number(res.data[0].csUnloadQty);
                    this.futPickTruck = this.format_number(res.data[0].tkPickupQty);
                    this.futUnloadTruck = this.format_number(res.data[0].tkUnloadQty);
                }
            });
            getRate().then(res => {
                if (res && +res.code === 0) {
                    this.pieDataTwo = parseFloat(res.data[0].shipRate.toFixed(3));
                    this.pieDataThree = parseFloat(res.data[0].recvRate.toFixed(3));
                }
            });
            getEfficiency().then(res => {
                if (res && +res.code === 0) {
                    // 效率数据
                    // this.horizontalBarData.push(parseFloat(res.data[0].pickEfcy.toFixed(1)));
                    // this.horizontalBarData.push(parseFloat(res.data[0].loadEfcy.toFixed(1)));
                    // this.horizontalBarData.push(parseFloat(res.data[0].unloadEfcy.toFixed(1)));
                    // IPP数据
                    this.gaugeData = (res.data[0].ippRate * 100).toFixed(2);
                }
            });
            getIPP().then(res => {
                if (res && +res.code === 0) {
                    const ipp = [];
                    const real = [];
                    const axis = [];
                    res.data.forEach(e => {
                        e.prdIPP = parseFloat((e.prdIPP * 100).toFixed(0));
                        ipp.push(e.prdIPP);
                        e.realQty = parseFloat(e.realQty.toFixed(0));
                        real.push(e.realQty);
                        axis.push(e.prdType);
                    });
                    // 总的实际库存量
                    if (real.length > 0) {
                        let _gaugeTotalStock = 0;
                        real.forEach(el => {
                            _gaugeTotalStock += el;
                        });
                        this.gaugeTotalStock = this.format_number(_gaugeTotalStock);
                    }
                    this.verticalBarData.push(ipp);
                    this.verticalBarData.push(real);
                    this.verticalBarData.push(axis);
                }
            });
            // getGoods().then(res => {
            //     if (res && +res.code === 0) {
            //         this.pieDataFive = parseFloat((Number(res.data[0].rate)).toFixed(3));
            //     }
            // });
            getAot().then(res => {
                if (res && +res.code === 0) {
                    this.pieDataFour = parseFloat(Number(res.data[0].rate).toFixed(3));
                }
            });
            // getNewGps().then(res => {
            //     if (res && +res.code === 0) {
            //         this.liquidDataOne = parseFloat((Number(res.data[0].gpsRate.split('%')[0]) / 100).toFixed(3));
            //     }
            // });
            // getLock().then(res => {
            //     if (res && +res.code === 0) {
            //         this.liquidDataTwo = parseFloat((Number(res.data[0].lockRate.split('%')[0]) / 100).toFixed(3));
            //     }
            // });
            getGps().then(res => {
                if (res && +res.code === 0) {
                    if (res.data[0].qtyRisk) this.qtyRisk = res.data[0].qtyRisk;
                    this.bos = res.data[0].bos;
                    this.pastNm = res.data[0].pastNm.toString() + '/' + res.data[0].nm.toString();
                    this.retAc = res.data[0].pastAc.toString() + '/' + res.data[0].retAc.toString();
                    if (res.data[0].invRate !== null) {
                        this.pieDataOne = parseFloat((Number(res.data[0].invRate.split('%')[0]) / 100).toFixed(3));
                    }
                    if (res.data[0].gpsRate !== null) {
                        this.liquidDataOne = parseFloat((Number(res.data[0].gpsRate.split('%')[0]) / 100).toFixed(3));
                    }
                    if (res.data[0].lockRate !== null) {
                        this.liquidDataTwo = parseFloat((Number(res.data[0].lockRate.split('%')[0]) / 100).toFixed(3));
                    }
                    if (res.data[0].whRate !== null) {
                        this.liquidDataThree = parseFloat((Number(res.data[0].whRate.split('%')[0]) / 100).toFixed(3));
                    }
                    if (res.data[0].tsRate !== null) {
                        this.liquidDataFour = parseFloat((Number(res.data[0].tsRate.split('%')[0]) / 100).toFixed(3));
                    }
                    if (res.data[0].goodsRate !== null) {
                        this.pieDataFive = parseFloat((Number(res.data[0].goodsRate.split('%')[0]) / 100).toFixed(3));
                    }
                    this.transportOrder = this.format_number(res.data[0].orderQty);
                    this.transportLatePod = parseFloat(Number(res.data[0].returnQty).toFixed(2));
                    this.transportReject = res.data[0].dsQtyDay.toString() + '/' + res.data[0].dsQty.toString();
                    // 数字标红
                    this.latePodWarning = Number(res.data[0].returnQty);
                    const noBackQty = res.data[0].noBackQty;
                    getReject().then(res => {
                        if (res && +res.code === 0) {
                            if (Number(res.data[0].orderCnt) === 0) {
                                this.transportReorder = '0.0%';
                                this.reorderWarning = 0;
                            } else {
                                this.transportReorder = ((1 - Number(noBackQty) / Number(res.data[0].orderCnt)) * 100).toFixed(1) + '%';
                                this.reorderWarning = (1 - Number(noBackQty) / Number(res.data[0].orderCnt));
                            }
                        }
                    });
                }
            });
            getLate().then(res => {
                if (res && +res.code === 0) {
                    const mapPoints = [];
                    const normal = [];
                    const risk = [];
                    let riskNum = 0;
                    const lateLength = res.data.length; // 拿到数据的个数
                    if (lateLength > 0) {
                        res.data.forEach(e => {
                            const site = [];
                            const point = [];
                            // 截取起点城市
                            const item = [];
                            const index = e.fromCityName.indexOf('市');
                            item[0] = { name: e.fromCityName.slice(0, index) };
                            // 在途地点 以及 具体信息
                            item[1] = { name: e.etisLocation };
                            item[1].value = e.customebcuName + '<br />' + e.etisLocation + '<br />' + e.car;
                            if (e.type === '迟到') {
                                riskNum += 1;
                                risk.push(item);
                            }
                            if (e.type === '正常' || e.type === '到达') {
                                normal.push(item);
                            }
                            point.push(e.etisLongitude);
                            point.push(e.etisLatitude);
                            site.push(e.etisLocation);
                            site.push(point);
                            mapPoints.push(site);
                        });
                    }
                    getLoss().then(res => {
                        if (res && +res.code === 0) {
                            const loss = [];
                            const lossLength = res.data.length;
                            if (lossLength > 0) {
                                res.data.forEach(e => {
                                    const item = [];
                                    const index = e.fromCityName.indexOf('市');
                                    const index1 = e.toCityName.indexOf('市');
                                    // 起点城市
                                    item[0] = { name: e.fromCityName.slice(0, index) };
                                    // 终点城市
                                    item[1] = {};
                                    item[1].name = e.toCityName.slice(0, index1);
                                    item[1].value = e.customebcuName + '<br />' + '信号丢失，无位置信息' + '<br />' + e.car;
                                    loss.push(item);
                                });
                            }
                            this.lossCar = lossLength ? loss : []; // 信号丢失
                            this.normalCar = lateLength ? normal : []; // 正常车辆
                            this.riskCar = lateLength ? risk : []; // 有迟到风险车辆
                            this.riskCarNum = lateLength ? riskNum : 0;
                            this.mapPoints = lateLength ? mapPoints : [];
                        }
                    });
                }
            });
        }
    },
    created() {
        /** 5分钟刷新一次数据 **/
        this.handleGetAot();
        setInterval(() => {
            this.handleGetAot();
        }, 1000 * 60 * 5);
    },
    watch: {
        /** 水球图数值 判断数字大小，标红 **/
        liquidDataOne(newVal) {
            if (newVal < 0.95) {
                this.liquidColorOne = liquidWarningColor;
            } else {
                this.liquidColorOne = liquidGreenColor;
            }
        },
        liquidDataTwo(newVal) {
            if (newVal < 1) {
                this.liquidColorTwo = liquidWarningColor;
            } else {
                this.liquidColorTwo = liquidBlueColor;
            }
        },
        liquidDataThree(newVal) {
            if (newVal < 0.95) {
                this.liquidColorThree = liquidWarningColor;
            } else {
                this.liquidColorThree = liquidGreenColor;
            }
        },
        liquidDataFour(newVal) {
            if (newVal < 0.95) {
                this.liquidColorFour = liquidWarningColor;
            } else {
                this.liquidColorFour = liquidBlueColor;
            }
        }
    }
};
</script>
<style lang="less" src="./IndexStyle.less">
</style>
