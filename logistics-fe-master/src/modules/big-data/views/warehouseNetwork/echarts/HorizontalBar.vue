<template>
    <div class="warehouse-horizontal-chart">
        <div :class="className"
             :id="id"
             style="height: 100%; width: 100%"
             ref="myEchart">
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'horizontalBar',
    props: {
        horizontalBarData: {
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
            // 计算label的position坐标
            let labelX = 0;
            const n = Math.floor(this.htmlWidth / 1920);
            if (n < 1) {
                labelX = 190;
            } else {
                labelX = 270 * n;
            }
            this.chart = echarts.init(this.$refs.myEchart);
            this.chart.setOption({
                grid: {
                    show: 'true',
                    borderWidth: '0',
                    height: '80%',
                    width: Math.floor(this.htmlWidth / 1920) < 1 ? '50%' : '64%',
                    x: Math.floor(this.htmlWidth / 1920) < 1 ? '23%' : '18%',
                    y: '10%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    textStyle: {
                        fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 12 : 20 * (Math.floor(this.htmlWidth / 1920))
                    },
                    formatter: '{b0}: {c0}'
                },
                xAxis: {
                    show: false, // 是否显示x轴
                    type: 'value'
                },
                yAxis: {
                    width: '100%',
                    type: 'category',
                    inverse: true, // 让y轴数据逆向
                    axisLabel: {
                        show: true,
                        fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 15 : 15 * (Math.floor(this.htmlWidth / 1920)),
                        color: 'rgba(255, 255, 255, .7)', // y轴字体颜色
                        family: 'founder-lanting',
                        padding: [0, 5, 0, 20]
                    },
                    splitLine: { show: false }, // 横向的线
                    axisTick: { show: false }, // y轴的端点
                    axisLine: { show: false }, // y轴的线
                    data: ['拣货效率', '装货效率', '卸货效率']
                },
                series: [
                    {
                        name: '数据内框',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                barBorderRadius: 30,
                                color: '#2AC9BB'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: [labelX, 0],
                                color: 'rgba(255, 255, 255, .7)',
                                family: 'founder-lanting',
                                fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 15 : 15 * (Math.floor(this.htmlWidth / 1920)),
                                formatter: (param) => {
                                    // return 'xx';
                                }
                            }
                        },
                        barGap: '40%',
                        barWidth: Math.floor(this.htmlWidth / 1920) < 1 ? 10 : 10 * (Math.floor(this.htmlWidth / 1920)),
                        data: this.horizontalBarData
                    }
                ]
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
        horizontalBarData() {
            this.initChart();
        }
    }
};
</script>

<style lang="less">
    .warehouse-horizontal-chart {
        width: 100%;
        height: 100%;
    }
</style>
