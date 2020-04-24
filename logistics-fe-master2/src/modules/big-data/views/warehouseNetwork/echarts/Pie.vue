<template>
    <div class="warehouse-pie-chart">
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
    name: 'pie',
    props: {
        pieData: {
            type: Number,
            default() {
                return 0;
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
        return {
            warning: 1
        };
    },
    methods: {
        initChart() {
            const that = this;
            this.chart = echarts.init(this.$refs.myEchart);
            this.chart.setOption({
                series: [{
                    name: 'bg',
                    type: 'pie',
                    hoverAnimation: false,
                    animation: false,
                    silent: true,
                    radius: ['75%', '85%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    data: [{
                        value: 100,
                        name: '',
                        label: {
                            normal: {
                                family: 'founder-lanting',
                                color: '#fff',
                                fontSize: Math.floor(that.htmlWidth / 1920) < 1 ? 17 : 23 * (Math.floor(that.htmlWidth / 1920)),
                                fontWeight: '400',
                                formatter() {
                                    if ((that.pieData * 100).toString().split('.').length === 1) {
                                        return (that.pieData * 100) + '.0' + '%';
                                    } else {
                                        return (that.pieData * 100).toFixed(1) + '%';
                                    }
                                },
                                position: 'center',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgba(255, 255, 255, 0.15)'
                            }
                        }
                    }]
                }, {
                    name: 'fg',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    animation: true,
                    silent: true,
                    radius: ['68%', '88%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    data: [{
                        value: that.pieData * 100,
                        name: 'v1',
                        itemStyle: {
                            normal: {
                                color: (this.pieData >= this.warning ? this.color : '#FF5956')
                            }
                        }
                    }, {
                        value: 100 - that.pieData * 100,
                        name: 'v2',
                        itemStyle: {
                            normal: {
                                opacity: 0
                            }
                        }
                    }]
                },
                {
                    name: 'vb',
                    type: 'pie',
                    hoverAnimation: false,
                    animation: false,
                    silent: true,
                    radius: ['75%', '100%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    data: [{
                        value: 100,
                        name: '',
                        itemStyle: {
                            normal: {
                                color: 'rgba(255, 255, 255, .05)'
                            }
                        }
                    }]
                }]
            });
        },
        handlePieInit() {
            // 初始化标红指标值
            if (this.id === 'pieOne') {
                this.warning = 1;
            }
            if (this.id === 'pieTwo' || this.id === 'pieThree' || this.id === 'pieFour') {
                this.warning = 0.98;
            }
            if (this.id === 'pieFive') {
                this.warning = 0.985;
            }
            this.initChart();
        }
    },
    mounted() {
        this.handlePieInit();
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    watch: {
        pieData() {
            this.handlePieInit();
        }
    }
};
</script>

<style lang="less">
.warehouse-pie-chart {
    width: 100%;
    height: 64%;
    margin-bottom: 0.6rem;
}
</style>
