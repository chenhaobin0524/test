<template>
    <div class="warehouse-gauge-chart">
        <div :class="className"
             :id="id"
             style="height: 100%; width: 100%"
             ref="myEchart">
        </div>
        <div v-if="this.gaugeData < 100" class="ipp-label-lt">{{this.gaugeData}}%</div>
        <div v-else class="ipp-label-gt">{{this.gaugeData}}%</div>
        <div class="total">总库存量&nbsp;&nbsp;&nbsp;{{this.gaugeTotalStock}}</div>
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'gauge',
    props: {
        gaugeData: {
            type: String,
            default() {
                return '0';
            }
        },
        gaugeTotalStock: {
            type: String,
            default() {
                return '0';
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
            const n = Math.floor(this.htmlWidth / 1920);
            let ValuePaddingTop = 0;
            let IppPaddingTop = 0;
            if (n < 1) {
                ValuePaddingTop = 40;
                IppPaddingTop = 18;
            } else {
                ValuePaddingTop = n * 50;
                IppPaddingTop = n * 20;
            }
            this.chart = echarts.init(this.$refs.myEchart);
            this.chart.setOption({
                series: [{// 外围刻度
                    type: 'gauge',
                    center: ['53%', '40%'],
                    min: 0,
                    max: 100,
                    startAngle: 225,
                    endAngle: -45,
                    splitNumber: 5,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            width: 0,
                            shadowBlur: 0,
                            color: [
                                [1, '#ff0000']
                            ],
                            opacity: 0.3
                        }
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: '#2067B2',
                            width: Math.floor(this.htmlWidth / 1920) < 1 ? 1 : (Math.floor(this.htmlWidth / 1920))
                        },
                        length: -5,
                        splitNumber: 20
                    },
                    splitLine: {
                        show: true,
                        length: -14,
                        lineStyle: {
                            color: '#2067B2'
                        }
                    },
                    axisLabel: {
                        distance: 20,
                        textStyle: {
                            color: '#fff',
                            fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 8 : 8 * (Math.floor(this.htmlWidth / 1920)),
                            fontWeight: '400'
                        }
                    },
                    pointer: {
                        show: 0
                    },
                    detail: {
                        show: 0
                    }
                },
                // 内侧指针、数值显示
                {
                    name: 'IPP%',
                    type: 'gauge',
                    center: ['53%', '40%'],
                    startAngle: 225,
                    endAngle: -45,
                    min: 0,
                    max: 100,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            width: 0,
                            color: [
                                [1, 'rgba(255,255,255,.1)']
                            ]
                        }
                    },
                    axisTick: {
                        show: 0
                    },
                    splitLine: {
                        show: 0
                    },
                    axisLabel: {
                        show: 0
                    },
                    pointer: {
                        show: false,
                        width: 2,
                        length: '60%'
                    },
                    detail: {
                        show: true,
                        offsetCenter: [0, '100%'],
                        textStyle: {
                            fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 13 : 24 * (Math.floor(this.htmlWidth / 1920)),
                            color: '#fff'
                        },
                        formatter: ['{name|' + 'IPP%' + '}'].join('\n'),
                        // formatter: [
                        //     '{val|{value}' + '%' + '}',
                        //     '{name|' + 'IPP%' + '}'
                        // ].join('\n'),
                        rich: {
                            val: {
                                fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 13 : 29 * (Math.floor(this.htmlWidth / 1920)),
                                lineHeight: 30,
                                color: '#ddd',
                                padding: [ValuePaddingTop, 0, 0, 0]
                            },
                            name: {
                                fontSize: Math.floor(this.htmlWidth / 1920) < 1 ? 17 : 23 * (Math.floor(this.htmlWidth / 1920)),
                                lineHeight: 30,
                                color: '#ddd',
                                padding: [IppPaddingTop, 0, 0, 0]
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#FF5956'
                        }
                    },
                    data: [{
                        value: this.gaugeData
                    }]
                },
                // {
                //     name: '内圈',
                //     type: 'pie',
                //     center: ['53%', '40%'],
                //     hoverAnimation: false,
                //     tooltip: {
                //
                //     },
                //     radius: Math.floor(this.htmlWidth / 1920) < 1 ? [0, '35%'] : [0, '42%'],
                //     label: {
                //         normal: {
                //             show: false,
                //             position: 'center',
                //             color: '#fff',
                //             formatter: () => {
                //                 return this.gaugeData;
                //             }
                //         }
                //     },
                //     labelLine: {
                //         normal: {
                //             show: false
                //         }
                //     },
                //     data: [{
                //         value: 100,
                //         itemStyle: {
                //             normal: {
                //                 color: 'rgba(24, 67, 152)'
                //             }
                //         }
                //     }]
                // },
                {
                    name: '数据',
                    type: 'pie',
                    startAngle: 303,
                    center: ['53%', '40%'],
                    radius: Math.floor(this.htmlWidth / 1920) < 1 ? ['45%', '55%'] : ['50%', '60%'],
                    legendHoverLink: false,
                    hoverAnimation: false,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: 25,
                        itemStyle: {
                            normal: {
                                color: 'rgba(0,0,0,0)'
                            }
                        }
                    },
                    {
                        value: Number(this.gaugeData) >= 100 ? (100).toString() : this.gaugeData,
                        itemStyle: {
                            normal: {
                                color: Number(this.gaugeData) >= 85 ? '#FF7777' : '#01D1FB'
                            }
                        }

                    },
                    {
                        value: Number(this.gaugeData) >= 100 ? (0).toString() : (100 - this.gaugeData),
                        itemStyle: {
                            normal: {
                                color: 'rgba(24, 67, 152, .5)'
                            }
                        }
                    }]
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
        gaugeData() {
            this.initChart();
        }
    }
};
</script>
<style lang="less">
    .warehouse-gauge-chart {
        position: relative;
        width: 100%;
        height: 100%;
        .ipp-label-lt {
            position: absolute;
            font-size: 1.4rem;
            color: #fff;
            top: 35.5%;
            left: 50%;
            transform: translateX(-39%);
        }
        .ipp-label-gt {
            position: absolute;
            font-size: 1.6rem;
            color: #fff;
            top: 35.5%;
            left: 50%;
            transform: translateX(-39%);
        }
        .total {
            font-size: 1.3rem;
            color: #fff;
            position: absolute;
            left: 15%;
            top: 80%;
        }
    }
</style>
