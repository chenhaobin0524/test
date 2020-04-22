<template>
    <div class="warehouse-vertical-chart">
        <div :class="className"
             :id="id"
             style="height: 100%; width: 100%"
             ref="myEchart">
        </div>
        <div class="legend-box">
            <div class="legend-reality"><div class="legend-reality-color"></div><span>实际库存量</span></div>
            <div class="legend-ipp"><div class="legend-ipp-color"></div><span>IPP%</span></div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'verticalBar',
    props: {
        verticalBarData: {
            type: Array,
            default() {
                return [];
            }
        },
        className: {
            type: String,
            default() {
                return '';
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
                return '';
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
            // 计算bar圆角
            const n = Math.floor(this.htmlWidth / 1920);
            let bbradius = 0;
            if (n <= 1) {
                bbradius = 5;
            } else {
                bbradius = 5 * n;
            }
            this.chart = echarts.init(this.$refs.myEchart);
            this.chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    textStyle: {
                        fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 12 : 20 * (Math.floor(this.htmlWidth / 1920))
                    },
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    top: Math.floor(this.htmlWidth / 1920) < 1 ? 90 : 90 * (Math.floor(this.htmlWidth / 1920)),
                    right: '3%',
                    bottom: Math.floor(this.htmlWidth / 1920) < 1 ? 40 : 40 * (Math.floor(this.htmlWidth / 1920)),
                    width: 'auto',
                    height: 'auto'
                },
                legend: {
                    show: false,
                    data: ['IPP%', '实际库存量'],
                    top: Math.floor(this.htmlWidth / 1920) < 1 ? 20 : 20 * (Math.floor(this.htmlWidth / 1920)),
                    right: Math.floor(this.htmlWidth / 1920) < 1 ? 20 : 20 * (Math.floor(this.htmlWidth / 1920)),
                    itemGap: Math.floor(this.htmlWidth / 1920) < 1 ? 40 : 40 * (Math.floor(this.htmlWidth / 1920)),
                    textStyle: {
                        color: '#fff',
                        fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 12 : 18 * (Math.floor(this.htmlWidth / 1920))
                    }
                },
                xAxis: [{
                    data: this.verticalBarData[2],
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        // rotate: 30,
                        interval: 0,
                        family: 'founder-lanting',
                        color: 'rgba(255, 255, 255, .7)',
                        fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 10 : 16 * (Math.floor(this.htmlWidth / 1920))
                        // margin: Math.floor(this.htmlWidth / 1920) < 1 ? 6 : 15 * (Math.floor(this.htmlWidth / 1920))
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: Math.floor(this.htmlWidth / 1920) < 1 ? 1 : (Math.floor(this.htmlWidth / 1920)),
                            color: 'rgba(255, 255, 255, .1)'
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name: 'IPP%',
                    nameLocation: 'center',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    show: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                {
                    type: 'value',
                    name: '实际库存量',
                    nameLocation: 'center',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    show: false,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                }],
                series: [{
                    type: 'bar',
                    barWidth: '15%',
                    barGap: '150%', // 多个并排柱子设置柱子之间的间距
                    barCategoryGap: '10%', // 多个并排柱子设置柱子之间的间距
                    name: 'IPP%',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            show: true,
                            color: (params) => {
                                if (+params.value >= 100) {
                                    return '#FF7777';
                                }
                                if (+params.value >= 90 && +params.value < 100) {
                                    return '#FFCE6D';
                                }
                                if (+params.value < 90) {
                                    return '#2AC9BB';
                                }
                            },
                            barBorderRadius: [bbradius, bbradius, 0, 0],
                            borderWidth: 0
                        }
                    },
                    data: this.verticalBarData[0],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            family: 'founder-lanting',
                            fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 9 : 14 * (Math.floor(this.htmlWidth / 1920)),
                            formatter: (param) => {
                                return param.value + '%';
                            }
                        }
                    }
                }, {
                    type: 'bar',
                    barWidth: '15%',
                    name: '实际库存量',
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#0058F4',
                            barBorderRadius: [bbradius, bbradius, 0, 0],
                            borderWidth: 0
                        }
                    },
                    data: this.verticalBarData[1],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            family: 'founder-lanting',
                            color: '#fff',
                            fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 9 : 14 * (Math.floor(this.htmlWidth / 1920)),
                            formatter: (param) => {}
                        }
                    }
                }]
            });
        }
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    watch: {
        verticalBarData() {
            this.initChart();
        }
    }
};
</script>

<style lang="less">
    .warehouse-vertical-chart {
        position: relative;
        width: 100%;
        height: 100%;
        .legend-box {
            box-sizing: border-box;
            position: absolute;
            width: 18rem;
            height: 1.6rem;
            right: 0;
            top: 5%;
            line-height: 0.9rem;
            font-family: "founder-lanting";
            font-size: 0.8rem;
            color: #fff;
        }
        .legend-ipp,
        .legend-reality {
            float: right;
        }
        .legend-reality {
            margin-left: 2.2rem;
        }
        .legend-ipp-color,
        .legend-reality-color {
            width: 0.8rem;
            height: 0.8rem;
            float: left;
            margin-right: 0.5rem;
            border-radius: 0.2rem;
        }
        .legend-ipp-color {
            background-color: #2AC9BB;
        }
        .legend-reality-color {
            background-color: #0058F4;
        }
    }
</style>
