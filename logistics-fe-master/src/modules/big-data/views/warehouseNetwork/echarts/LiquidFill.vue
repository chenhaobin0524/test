<template>
    <div class="warehouse-liquid-chart">
        <div class="liquid-box"
             :id="id"
             style="height: 7.7rem; width: 7.7rem;"
             ref="myEchart">
        </div>
        <div class="text">
            <span class="num">{{ (liquidData*100).toFixed(1) }}</span>
            <span class="precent">%</span>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import 'echarts-liquidfill/src/liquidFill.js';
export default {
    name: 'liquidFill',
    props: {
        liquidData: {
            type: Number,
            default() {
                return 0;
            }
        },
        id: {
            type: String,
            default() {
                return '';
            }
        },
        color: {
            type: String,
            default() {
                return '#1D4797';
            }
        },
        htmlWidth: {
            type: Number,
            default() {
                return 0;
            }
        }
    },
    data() {
        return {};
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.myEchart);
            this.chart.setOption({
                series: [{
                    name: '柱状水球图',
                    type: 'liquidFill',
                    data: [{
                        value: this.liquidData
                    }],
                    radius: '100%',
                    shape: 'rect',
                    phase: 0,
                    center: ['50%', '50%'],
                    outline: {
                        show: false,
                        borderDistance: 0,
                        itemStyle: {
                            borderColor: 'transparent',
                            borderWidth: 0
                        }
                    },
                    backgroundStyle: {
                        color: '#1D4797',
                        itemStyle: {
                            shadowBlur: 100, // 设置无用
                            // shadowColor: '#f60', // 设置无用
                            opacity: 1 // 设置无用
                        }
                    },
                    color: [this.color],
                    itemStyle: {
                        opacity: 1
                    },
                    // 振幅 是波浪的震荡幅度 可以取具体的值 也可以是百分比 百分比下是按图标的直径来算
                    amplitude: this.liquidData >= 1 ? 0 : Math.floor(this.htmlWidth / 1920) < 1 ? 3.5 : 3.5 * Math.floor(this.htmlWidth / 1920),
                    // 波的长度 可以是百分比也可以是具体的像素值  百分比下是相对于直径的 取得越大波浪的起伏越小
                    waveLength: '50%',
                    direction: 'left',
                    waveAnimation: false,
                    label: {
                        show: false,
                        // insideColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: 0,
                        align: 'center',
                        baseline: 'middle',
                        position: 'inside'
                    },
                    emphasis: {
                        itemStyle: {
                            opacity: 0.8
                        }
                    }
                }]
            });
        }
    },
    mounted() {
        this.initChart();
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    watch: {
        liquidData() {
            this.initChart();
        }
    }
};
</script>

<style lang="less">
    .warehouse-liquid-chart {
        position: relative;
        box-sizing: border-box;
        width: 53%;
        margin: 1.3rem auto 1rem;
        height: 60%;
        overflow: hidden;
        border-radius: 0.3rem;
        .liquid-box {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
        }
        .text {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 0.6rem;
            font-size: 1rem;
            color: #fff;
            font-family: "founder-lanting";
        }
        .precent {
            font-size: 0.7rem;
        }
    }
</style>
