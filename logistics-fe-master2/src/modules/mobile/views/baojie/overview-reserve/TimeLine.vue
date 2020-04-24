<template>
    <div class="time-line">
        <div class="legend">
            <div class="select-time">
                <span>时间：</span>
                <el-date-picker
                    @change='change'
                    v-model="selectDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :clearable='false'
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="legend-items">
                <div class="legend-square load"></div>
                <span>装车预约</span>
                <div class="legend-square unload"></div>
                <span>卸车预约</span>
                <div class="legend-square true-time"></div>
                <span>实际用时</span>
            </div>
        </div>

        <div class="battlements-chart">

            <DataChart :occupyData='crenelTimes' title='垛口' :crenelCode='crenelCode'></DataChart>

            <div class="chart-axis-x">
                <div class="chart-axis-x-point-first-box">
                    <div class="chart-axis-x-point-first"></div>
                </div>
                <div class="chart-axis-x-point-center-box">
                    <div class="chart-axis-x-point-box" v-for="i in 12" :key="i">
                        <div class="chart-axis-x-point">
                            <span class="chart-axis-x-value">{{( (i*2-2) > 9 ? (i*2-2) : '0' + (i*2-2) ) +':00'}}</span>
                        </div>
                    </div>

                    <el-tooltip effect="dark" placement="left" v-if='currentTimeShow'>
                        <div class="current-time">
                            <div class="current-time-point point-top"></div>
                            <div class="current-time-point point-bottom"></div>
                        </div>
                        <div slot="content" class="baojie-current-time-tooltip">最近刷新时间<br/>{{serverDate}}</div>
                    </el-tooltip>
                </div>
                <div class="chart-axis-x-point-last-box">
                    <div class="chart-axis-x-point">
                        <span class="chart-axis-x-value">24:00</span>
                    </div>
                    <div class="chart-axis-x-point-last"></div>
                </div>
            </div>

            <DataChart v-for="(item,index) in locList" :key="index" :occupyData='item' title='备货区' :crenelCode='crenelCode'></DataChart>

            <div class="slitLine" v-if='otherLocList.length'>
                <div class="topLine"></div>
                <div class="bottomLine"></div>
                <!-- <div class="lineTitle">以下为占用备货区明细</div> -->
            </div>

            <DataChart v-for="(item,index) in otherLocList" :key="index + 100000" :occupyData='item' title='备货区' :crenelCode='crenelCode'></DataChart>

        </div>
    </div>
</template>
<script>
import DataChart from './DataChart.vue';
import api from '@/modules/mobile/api/njdc/njdc.js';
import common from '@/utils/common.js';

export default {
    name: 'overviewReserve',
    components: { DataChart },
    props: {
        crenel: Object,
        currentDate: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            crenelCode: '',
            currentTimeShow: false,
            timeNum: 0, // 定时器标识
            cancelRequest: () => {}, // 调用 取消上一次发送的未响应的异步请求
            serverDate: '',
            selectDate: '',
            initDate: 0,
            crenelTimes: [{}],
            locList: [],
            otherLocList: []
        };
    },
    methods: {
        change(date) {
            // 发送请求获取数据
            clearTimeout(this.timeNum);
            this.cancelRequest(); // 取消上一次发送的未响应的异步请求
            this.getDetailData();
        },
        handleWidth(startTime, endTime) {
            const dValue = startTime.getTime() - endTime.getTime();
            const titleWidth = document.getElementsByClassName('chart-axis-y')[0].offsetWidth;
            const totalWidth = document.getElementsByClassName('plan-time')[0].offsetWidth;
            const Proportion = dValue / (3600 * 1000 * 24);
            return totalWidth * Proportion + titleWidth + 'px';
        },
        handleLeft(refreshTime) {
            const millisecond = (new Date(refreshTime).getTime() + 28800000) % 86400000;
            return (millisecond / 86400000) * 100 + '%';
        },
        // 判断选择的日期是否是今天
        isCurrentDay() {
            // 当前数据停留的时间
            const intervalTime = new Date().getTime() - this.initDate;

            // 获取服务器返回的时间毫秒值
            const serverTime = new Date(this.serverDate).getTime();

            // 获取服务器的日期
            const current = new Date(serverTime + intervalTime);

            // 获取选择器的日期
            const select = new Date(this.selectDate);

            return common.formatDate(current) === common.formatDate(select);
        },
        // 定时获取新数据
        sendRequest() {
            this.timeNum = setTimeout(() => {
                if (this.isCurrentDay()) { // 如果服务器的日期等于 页面时间选择组件 的日期 则刷新数据
                    this.getDetailData();
                }
            }, 20000);
        },
        getDetailData() {
            const params = {
                crenelCode: this.crenel.crenelCode,
                startTime: this.selectDate
            };

            api.crenelsTime(params, (c) => { this.cancelRequest = c; }).then(res => {
                if (res) {
                    this.crenelCode = this.crenel.crenelCode;
                    this.currentTimeShow = true;
                    this.serverDate = common.formatDateTime(res.timestamp);
                    this.initDate = new Date().getTime();

                    if (res.data.crenelTimes) {
                        res.data.crenelTimes[0].titleName = res.data.crenelTimes[0].crenelName;
                    } else {
                        res.data.crenelTimes = [{ titleName: this.crenel.crenelName }];
                    }

                    this.crenelTimes = this.getStartDate(res.data.crenelTimes);

                    // 获取本垛口的所有备货区
                    const locCodeArr = this.crenel.locList.map(item => item.locCode);

                    this.otherLocList = [];
                    let locListArr = [];
                    if (res.data.parkLocTimes) {
                        locListArr = res.data.parkLocTimes.filter(item => {
                            item[0].titleName = item[0].locCode;

                            if (locCodeArr.includes(item[0].locCode)) {
                                return this.getStartDate(item);
                            }
                            this.otherLocList.push(this.getStartDate(item));
                        });
                    }

                    this.locList = locCodeArr.map(item1 => {
                        return locListArr.find(item2 => item2[0].locCode === item1) || [ { titleName: item1 } ];
                    });

                    this.$nextTick(() => {
                        // 竖时间线样式相关
                        const currentTime = document.querySelector('.current-time');
                        const battlementsChart = document.querySelector('.battlements-chart');
                        currentTime.style.left = this.handleLeft(this.serverDate);
                        currentTime.style.height = battlementsChart.offsetHeight + 20 + 'px';
                    });
                    // 定时获取新数据
                    this.sendRequest();
                }
            }).catch(() => {
            });
        },
        getStartDate(occupyData) {
            occupyData.forEach(item => {
                if (item.startTime) {
                    const selectDate = common.formatDate(this.selectDate);
                    const startDate = common.formatDate(item.startTime);
                    item.startDate = startDate < selectDate ? selectDate + ' 00:00:00' : item.startTime;
                }
            });
            return occupyData;
        }
    },
    watch: {
        currentDate(newVal) {
            if (this.serverDate === '') {
                // 保存首次进入页面服务端的时间
                this.serverDate = newVal;
                // 将服务端返回的时间回写到时间选择组件
                this.selectDate = newVal;
                // 初始化一个时间，用于计算时间间隔
                this.initDate = new Date().getTime();
            }
        },
        crenel(newVal) {
            if (Object.keys(newVal).length) {
                // 发送请求获取数据
                clearTimeout(this.timeNum);
                this.cancelRequest(); // 取消上一次发送的未响应的异步请求
                this.getDetailData();
            }
        }
    }
};
</script>
<style lang='less'>
.time-line {
    margin-top: 10px;
    padding: 20px;
    background: #ffffff;
    height: calc(100vh - 295px);
    overflow-y: auto;

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 150px;
    }
    .select-time {
        display: inline-block;
    }
    .legend-items {
        float: right;
        .legend-square+span {
            vertical-align: middle;
            font-size: 14px;
            color: #333333;
            margin-left: 10px;
        }
        span+.legend-square {
            margin-left: 30px;
        }
    }
    .legend-square {
        display: inline-block;
        height: 14px;
        width: 14px;
        vertical-align: middle;
    }
    .load {
        background: #BFEAEB;
    }
    .unload {
        background: #FFE4BA;
    }
    .true-time {
        background: linear-gradient(135deg, #00BCBF 50%, #FF8800 50%);
    }
    .battlements-chart {
        margin: 20px 10px;
        position: relative;
    }
    .chart-axis-x {
        height: 2px;
        background-color: #979797;
        display: flex;
        justify-content: space-between;
        margin: 43px 0 30px 0;
    }
    .chart-axis-x-point {
        display: inline-block;
        height: 16px;
        width: 16px;
        border: 2px solid #979797;
        border-radius: 50%;
        position: relative;
        top: -10px;
        left: -10px;
        background: #ffffff;
    }
    .chart-axis-x-point-first,
    .chart-axis-x-point-last {
        display: inline-block;
        height: 10px;
        width: 10px;
        border: 2px solid #979797;
        border-radius: 50%;
        background: #E8E8E8;
        position: relative;
        top: -7px;
    }
    .chart-axis-x-point-last {
        float: right;
    }
    .chart-axis-x-point-box {
        flex: 5
    }
    .chart-axis-x-point-center-box {
        position: relative;
        display: flex;
        flex: 60;

        .baojie-current-time-tooltip {
            text-align: center;
        }
    }
    .chart-axis-x-point-first-box,
    .chart-axis-x-point-last-box {
        flex: 3;
    }
    .chart-axis-x-value {
        position: relative;
        bottom: 25px;
        left: -9px;
        color: #333333;
        font-size: 14px;
    }
    .current-time {
        height: 0;
        width: 0;
        border-left: 2px dashed #FF6600;
        margin-left: -1px;
        position: absolute;
        top: -115px;
        z-index: 50;
    }
    .current-time:hover {
        border-left: 2px dashed red;

        .current-time-point {
            background-color: red;
        }
    }
    .current-time-point {
        height: 10px;
        width: 10px;
        background-color: #FF6600;
        border-radius: 50%;
        position: absolute;
        left: -6px;
    }
    .point-top {
        top: -10px;
    }
    .point-bottom {
        bottom: -10px
    }
    .slitLine {
        margin-top: 50px;
        margin-bottom: 40px;
        position: relative;

        .topLine {
            height: 1px;
            background-color: #929292;
        }
        .bottomLine {
            height: 1px;
            background-color: #c8d2f3;
        }
        .lineTitle {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            background-color: #fff;
            padding: 0 10px;
            color: #c16a6a;
        }
    }
}
</style>
