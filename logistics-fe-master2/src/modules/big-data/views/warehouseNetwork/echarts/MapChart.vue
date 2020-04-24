<template>
    <div class='warehouse-map-chart'>
        <div :style="{height:'100%',width:'100%'}" ref='myEchart'></div>
        <div class="map-zoom-in" @click="mapZoomIn"><i class="el-icon-plus"></i></div>
        <div class="map-zoom-out" @click="mapZoomOut"><span>-</span></div>
    </div>
</template>
<script>
import echarts from 'echarts';
import 'echarts/map/js/china.js'; // 引入中国地图数据
// import { starSVG } from '../images/starSVG';
import 'echarts/extension/bmap/bmap.js';
import mapArea from './MapArea.json';
export default {
    name: 'MapChart',
    props: {
        mapPoints: {
            type: Array,
            default() {
                return [];
            }
        },
        normalCar: {
            type: Array,
            default() {
                return [];
            }
        },
        lossCar: {
            type: Array,
            default() {
                return [];
            }
        },
        riskCar: {
            type: Array,
            default() {
                return [];
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
            chart: null,
            geoCoordMap: mapArea,
            zoomNum: 8
        };
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        initEchartMap() {
            const that = this;
            const myChart = echarts.init(this.$refs.myEchart);
            window.onresize = myChart.resize;
            const normalCarData = this.normalCar;
            const riskCarData = this.riskCar;
            const lossCarData = this.lossCar;
            // [[{ name: '南京' }, { name: '镇江', value: '安得物流' + '<br />' + '粤A8J1214' + '<br />' + '某某某客户' }]];
            const convertData = (data) => {
                const res = [];
                for (let i = 0; i < data.length; i++) {
                    const dataItem = data[i];
                    const fromCoord = that.geoCoordMap[dataItem[0].name];
                    const toCoord = that.geoCoordMap[dataItem[1].name];
                    if (fromCoord && toCoord) {
                        res.push({
                            fromName: dataItem[0].name,
                            toName: dataItem[1].name,
                            coords: [fromCoord, toCoord],
                            value: dataItem[1].value
                        });
                    }
                }
                return res;
            };
            const color = ['#FF5956', '#2AC9BB', '#EAB43B']; // 航线的颜色
            const series = [];
            if (riskCarData.length !== 0) {
                [['南京', riskCarData]].forEach(function (item, index) {
                    series.push({
                        name: item[0] + ' Top3',
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0,
                            symbol: 'scatter',
                            symbolSize: Math.floor(that.htmlWidth / 1920) < 1 ? 2.5 : 5 * (Math.floor(that.htmlWidth / 1920))
                        },
                        lineStyle: {
                            normal: {
                                color: color[0],
                                width: Math.floor(that.htmlWidth / 1920) < 1 ? 1.5 : 1.5 * (Math.floor(that.htmlWidth / 1920)),
                                opacity: 0.6,
                                curveness: 0.2
                            }
                        },
                        data: convertData(item[1])
                    },
                    {
                        name: item[0] + ' Top3',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        label: {
                            normal: {
                                color: '#fff',
                                show: false,
                                fontSize: 0,
                                // fontSize: Math.floor(that.htmlWidth / 1920) < 1 ? 12 : 12 * (Math.floor(that.htmlWidth / 1920)),
                                position: 'right',
                                formatter: '{b}'
                            }
                        },
                        symbolSize: Math.floor(that.htmlWidth / 1920) < 1 ? 5 : 10 * (Math.floor(that.htmlWidth / 1920)),
                        itemStyle: {
                            normal: {
                                color: color[0]
                            },
                            emphasis: {
                                areaColor: '#2B91B7'
                            }
                        },
                        data: item[1].map((dataItem) => {
                            if (that.geoCoordMap[dataItem[1].name]) {
                                return {
                                    name: dataItem[1].name,
                                    value: that.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                                };
                            }
                        })
                    });
                });
            }
            if (normalCarData.length !== 0) {
                [['南京', normalCarData]].forEach(function (item, index) {
                    series.push({
                        name: item[0] + ' Top3',
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0,
                            symbol: 'scatter',
                            symbolSize: Math.floor(that.htmlWidth / 1920) < 1 ? 2.5 : 5 * (Math.floor(that.htmlWidth / 1920))
                        },
                        lineStyle: {
                            normal: {
                                color: color[1],
                                width: Math.floor(that.htmlWidth / 1920) < 1 ? 1.5 : 1.5 * (Math.floor(that.htmlWidth / 1920)),
                                opacity: 0.6,
                                curveness: 0.2
                            }
                        },
                        data: convertData(item[1])
                    },
                    {
                        name: item[0] + ' Top3',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        label: {
                            normal: {
                                color: '#fff',
                                show: false,
                                fontSize: 0,
                                // fontSize: Math.floor(that.htmlWidth / 1920) < 1 ? 12 : 12 * (Math.floor(that.htmlWidth / 1920)),
                                position: 'right',
                                formatter: '{b}'
                            }
                        },
                        symbolSize: Math.floor(that.htmlWidth / 1920) < 1 ? 5 : 10 * (Math.floor(that.htmlWidth / 1920)),
                        itemStyle: {
                            normal: {
                                color: color[1]
                            },
                            emphasis: {
                                areaColor: '#2B91B7'
                            }
                        },
                        data: item[1].map(function (dataItem) {
                            if (that.geoCoordMap[dataItem[1].name]) {
                                return {
                                    name: dataItem[1].name,
                                    value: that.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                                };
                            }
                        })
                    });
                });
            }
            if (lossCarData.length !== 0) {
                [['南京', lossCarData]].forEach(function (item, index) {
                    series.push({
                        name: item[0] + ' Top3',
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0,
                            symbol: 'scatter',
                            symbolSize: Math.floor(that.htmlWidth / 1920) < 1 ? 2.5 : 5 * (Math.floor(that.htmlWidth / 1920))
                        },
                        lineStyle: {
                            normal: {
                                color: color[2],
                                width: Math.floor(that.htmlWidth / 1920) < 1 ? 1.5 : 1.5 * (Math.floor(that.htmlWidth / 1920)),
                                opacity: 0.6,
                                curveness: 0.2
                            }
                        },
                        data: convertData(item[1])
                    },
                    {
                        name: item[0] + ' Top3',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        label: {
                            normal: {
                                color: '#fff',
                                show: false,
                                fontSize: 0,
                                // fontSize: Math.floor(that.htmlWidth / 1920) < 1 ? 12 : 12 * (Math.floor(that.htmlWidth / 1920)),
                                position: 'right',
                                formatter: '{b}'
                            }
                        },
                        symbolSize: Math.floor(that.htmlWidth / 1920) < 1 ? 5 : 10 * (Math.floor(that.htmlWidth / 1920)),
                        itemStyle: {
                            normal: {
                                color: color[2]
                            },
                            emphasis: {
                                areaColor: '#2B91B7'
                            }
                        },
                        data: item[1].map(function (dataItem) {
                            if (that.geoCoordMap[dataItem[1].name]) {
                                return {
                                    name: dataItem[1].name,
                                    value: that.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                                };
                            }
                        })
                    });
                });
            }
            myChart.setOption({
                backgroundColor: '#223B72 ',
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        if (params.seriesType === 'effectScatter') {
                            return params.value[2];
                        }
                        // if (params.seriesType === 'lines') {
                        //     return params.data.fromName + '>' + params.data.toName;
                        // }
                    },
                    position: 'top',
                    textStyle: {
                        fontSize: Math.floor(that.htmlWidth / 1920) < 1 ? 12 : 20 * (Math.floor(that.htmlWidth / 1920))
                    }
                },
                geo: {
                    map: 'china',
                    selectedMode: 'multiple',
                    label: {
                        normal: {
                            show: true,
                            fontSize: Math.floor(that.htmlWidth / 1920) < 1 ? 8 : 16 * (Math.floor(that.htmlWidth / 1920)),
                            color: 'rgba(255, 255, 255, .4)'
                        },
                        emphasis: {
                            show: false,
                            color: 'rgba(255, 255, 255, .4)'
                        }
                    },
                    roam: true,
                    center: [117.15, 32.19],
                    aspectScale: 0.75, // 长宽比
                    zoom: that.zoomNum,
                    itemStyle: {
                        normal: {
                            areaColor: '#1544A6',
                            borderColor: '#2A333D',
                            borderWidth: 1
                        },
                        emphasis: {
                            areaColor: '#0051F8',
                            fontSize: 0
                        }
                    }
                },
                series: series
            });
            // 江苏省高亮
            myChart.dispatchAction({
                type: 'geoSelect',
                name: ['江苏']
            });
            // 安徽省高亮
            myChart.dispatchAction({
                type: 'geoSelect',
                name: ['安徽']
            });
        },
        mapZoomIn() {
            this.zoomNum += 4;
            this.initEchartMap();
        },
        mapZoomOut() {
            if (this.zoomNum > 4) {
                this.zoomNum -= 4;
                this.initEchartMap();
            }
        }
    },
    mounted() {
        // this.initEchartMap();
        // const c = [];
        // const d = 'ab';
        // const b = [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1]];
        // for (let a = 0; a < b.length; a++) {
        //     c.push({ [d]: b[a] });
        // }
    },
    watch: {
        normalCar() {
            this.initEchartMap();
        },
        riskCar() {
            this.initEchartMap();
        },
        lossCar() {
            this.initEchartMap();
        },
        mapPoints(newVal) {
            newVal.forEach(e => {
                this.geoCoordMap[e[0]] = e[1];
            });
            this.initEchartMap();
        }
    }
};
</script>

<style lang="less">
    .warehouse-map-chart {
        width: 100%;
        height: 100%;
        .map-zoom-in,
        .map-zoom-out {
            position: absolute;
            right: 0.2rem;
            width: 2rem;
            height: 2rem;
            line-height: 2.1rem;
            border-radius: 0.2rem;
            text-align: center;
            color: #c3c3c3;
            background-color: rgba(255, 255, 255, .1);
            z-index: 999;
            &:hover {
                cursor: pointer;
            }
        }
        .map-zoom-in {
            bottom: 2.5rem;
        }
        .map-zoom-out {
            bottom: 0.1rem;
        }
    }
</style>
