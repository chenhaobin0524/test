<template>
    <div class="data-chart">

        <div class="plan-time-box data-chart-background">
            <div class="chart-axis-y">
                <h2>{{occupyData[0].titleName}}</h2>
                <h3>{{title}}</h3>
            </div>
            <div v-for="i in 12" :key="i" class="color-box flex"></div>
            <div class="blank-chart"></div>
        </div>

        <div class="plan-time-box data-chart-data">
            <div class="chart-axis-y"></div>

            <div class="plan-time">
                <div v-for='(item, index) in occupyData' :key='index'>
                    <div v-if='item.id !== undefined'>
                        <el-tooltip effect="dark" placement="right" v-if='item.timeType === 0'>
                            <div slot="content">
                                <!-- <h4 v-if='title === "垛口"'>备货区：{{item.locCode}}</h4> -->
                                <!-- <h4 v-else>垛口：{{item.crenelName}}</h4> -->
                                <h4 v-if='title === "备货区"'>垛口：{{item.crenelName}}</h4>
                                <p class="deliveryNo" v-if='title === "备货区"'>交货号：{{item.deliveryNo}}</p>
                                <p>{{item.carrierName}}<br/>
                                <!-- {{item.driverInfoHash}}&nbsp;&nbsp;&nbsp;&nbsp; -->
                                {{item.vehicleNo}}</p>
                                <p>预约时间<br/>{{item.startTime}} - {{item.finishTime}}</p>
                                <p>收货信息<br/>{{item.receiveSite}} {{item.customerSite}}</p>
                            </div>
                            <div class="data-value data-top"
                                :class="{'load-state': item.queueType===0, 'unload-state': item.queueType===10}"
                                :style='"width:" + handleWidth(item) + "%;left:" + handleLeft(item) + "%"'>
                                <div class="crenelName" v-if='crenelCode !== item.crenelCode'>{{item.crenelName}}</div>
                                <div class="companyInfo">
                                    <h4>{{item.carrierName}}</h4>
                                    <h4>{{item.vehicleNo}}</h4>
                                </div>
                            </div>
                        </el-tooltip>

                        <el-tooltip effect="dark" placement="bottom" v-else>
                            <div slot="content" style="text-align: center;">
                                <div>
                                    实际用时
                                    <div style="margin-top: 5px;">{{formatTime(item.startTime)}} - {{formatTime(item.finishTime) || '当前'}}</div>
                                </div>
                            </div>
                            <!-- eslint-disable-next-line -->
                            <div :style='"width:" + handleWidth(item) + "%;left:" + handleLeft(item) + "%"'
                                class="data-value data-bottom"
                                :class="{'load-state-bottom': item.queueType===0, 'unload-state-bottom': item.queueType===10}">
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </div>

            <div class="blank-chart"></div>
        </div>

   </div>
</template>
<script>
export default {
    props: {
        occupyData: Array,
        title: String,
        crenelCode: String
    },
    methods: {
        handleLeft(item) {
            const millisecond = (new Date(item.startDate).getTime() + 28800000) % 86400000;
            return (millisecond / 86400000) * 100;
        },
        handleWidth(item) {
            const time = new Date(item.finishTime || new Date()).getTime() - new Date(item.startDate).getTime();
            const ratio = time / 86400000;
            const restRatio = (100 - this.handleLeft(item)) / 100;
            return (ratio > restRatio ? restRatio : ratio) * 100;
        },
        formatTime(newDate) {
            if (newDate) {
                const date = new Date(newDate);
                const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
                const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
                const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
                return hours + ':' + minutes + ':' + seconds;
            }
        }
    }
};
</script>

<style lang="less">
.deliveryNo {
    max-width: 560px;
}
.data-chart {
    position: relative;
    margin-bottom: 10px;

    .plan-time-box {
        display: flex;
        .flex {
            flex: 5;
        }
        .blank-chart {
            flex: 3;
        }
    }
    .data-chart-background {
        .color-box {
            height: 60px;
            border: 1px solid #E3E3E3;
        }
        .color-box+.color-box {
            border-left: 0;
        }
    }
    .data-chart-data {
        position: absolute;
        z-index: 20;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
    .chart-axis-y {
        padding-top: 10px;
        flex: 3;
        text-align: center;
        h2 {
            font-size: 16px;
            color: #333333;
            margin: 0;
            font-weight: normal;
        }
        h3 {
            font-size: 14px;
            color: #666666;
            margin: 0;
            font-weight: normal;
        }
    }
    .plan-time {
        flex: 60;
        position: relative;
        overflow: hidden;
        .load-state {
            background-color: #BFEAEB;
        }
        .unload-state {
            background-color: #FFE4BA;
        }
        .load-state-bottom {
            background-color: #00BCBF;
        }
        .unload-state-bottom {
            background-color: #FF8800;
        }
    }
    .data-value:hover {
        filter: brightness(0.7);
    }
    .data-value {
        height: 100%;
        position: absolute;
        bottom: 0;
        font-size: 14px;
        color: #333333;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .companyInfo {
        flex: 1;
        overflow: hidden;
    }
    .companyInfo h4 {
        font-weight: normal;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }
    .crenelName {
        margin: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 700;
    }
    .data-bottom {
        height: 10px;
        z-index: 30;
    }
}
</style>
