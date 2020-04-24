<template>
    <div class="data-plan">
        <div id="plan-echarts" ref="planChart">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            option: {}
        };
    },
    props: {
        library: {
            default: () => []
        },
        crenelNum: {
            default: () => []
        }
    },
    watch: {
        library(val) {
            this.$echarts.init(this.$refs.planChart);
            this.handleLibrary();
            // 利用一个新的数组push的时候控制渲染顺序
            const list = [];
            for (let i = 0; i < this.library.length; i++) {
                list.push(this.library[i]);
                this.getviewbystation(list);
            }
        }
    },
    mounted() {
        this.getviewbystation(this.library);
    },
    methods: {
        /** 冒泡排序 将时间段短的排在后，后渲染，让短的浮在上方方便点击 **/
        handleLibrary() {
            for (let i = 0; i < this.library.length - 1; i++) {
                for (let j = 0; j < this.library.length - 1 - i; j++) {
                    if (this.compareTime(this.library[j].value[2], this.library[j].value[1]) < this.compareTime(this.library[j + 1].value[2], this.library[j + 1].value[1])) {
                        const tem = this.library[j];
                        this.library[j] = this.library[j + 1];
                        this.library[j + 1] = tem;
                    }
                }
            }
        },
        /** 比较时间段的大小 **/
        compareTime(time1, time2) {
            return new Date(time1).getTime() - new Date(time2).getTime();
        },
        renderItem(params, api) {
            // 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
            var categoryIndex = api.value(0);
            // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
            var start = api.coord([api.value(1), categoryIndex]);
            var end = api.coord([api.value(2), categoryIndex]);
            var height = 20; // 柱体宽度
            return {
                type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: this.$echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                }, { // 当前坐标系的包围盒。
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                }),
                style: api.style()
            };
        },
        // Echarts绘图
        getviewbystation(data) {
            const myChart = this.$echarts.init(this.$refs.planChart);// 加载图形的div
            this.option = {
                // color: colors,
                tooltip: {// 提示框
                    formatter: function (params) {
                        //
                        function myGetHour(data) {
                            const num = (data.split(':')).length - 1;
                            if (num === 1) return data;
                            if (num === 2) return data.substring(0, data.toString().lastIndexOf(':'));
                        }
                        const startTime = myGetHour(params.value[1].split(' ')[1].split('.')[0]);
                        const finishTime = myGetHour(params.value[2].split(' ')[1].split('.')[0]);
                        const html = params.value[5] === '空闲' ? '' : `
                            <div style="margin:0 auto;">
                                <div style="display:flex;justify-content:space-between;align-items:center">
                                    <div style="font-size:0.9rem;">${params.name ? params.name : '——'}</div>
                                    <div style="color:#2AC9BB;margin-left:10px;font-size: 0.9rem">
                                        ${params.value[5] === '卸货任务' ? '卸货' : (params.value[5] === '备货任务' ? '备货' : '空闲')}
                                    </div>
                                </div>
                                <div style="font-size:.8rem;opacity:0.8;">${params.value[3]}</div>
                                <div style="font-size:.8rem;opacity:0.8;">${startTime}&nbsp;-&nbsp;${finishTime}</div>
                                <div style="font-size:.8rem;opacity:0.8;">${params.value[4]}</div>
                            </div>
                        `;
                        return html;
                    }, // 数据的值
                    extraCssText: 'height:80px;background:rgba(0,0,0,.8);'
                },
                grid: {// 绘图网格
                    left: '3%',
                    right: '3%',
                    top: '1%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'time',
                    interval: 3600 * 2 * 1000,
                    axisLabel: {
                        formatter: function (value) {
                            const date = new Date(value);
                            return getzf(date.getHours()) + ':' + getzf(date.getMinutes());
                            // +'\n' + date.getDate() + '/' + (date.getMonth() + 1) + ' ';
                            function getzf(num) {
                                if (parseInt(num) < 10) {
                                    num = '0' + num;
                                }
                                return num;
                            }
                            // return date.getHours() + ':' + date.getMinutes();
                        },
                        textStyle: {
                            color: '#2AC9BB'
                        }
                    },
                    axisTick: {
                        inside: true,
                        length: 3
                    },
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#2AC9BB',
                            opacity: 0.7
                            // width:8,//这里是为了突出显示加上的
                        }
                    }
                },
                yAxis: {
                    data: this.crenelNum,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                series: [
                    // 用空bar来显示四个图例
                    // { name: state[0], type: 'bar', data: [] },
                    // { name: state[1], type: 'bar', data: [] },
                    {
                        type: 'custom',
                        // 开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
                        renderItem: this.renderItem,
                        // legendHoverLink: false,
                        silent: false,
                        encode: {
                            x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
                            y: 0 // data 中『维度0』对应到 Y 轴
                        },
                        // data: [ // 维度0 维度1 维度2
                        //     {
                        //         itemStyle: { normal: { color: colors[0] }}, // 条形颜色
                        //         name: '安得物流',
                        //         // 0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
                        //         value: [0, '2009/6/2 0:00', '2009/6/2 2:00', '粤A 00888', '计划件数:34,567']
                        //     },

                        //     {
                        //         itemStyle: { normal: { color: colors[0] } },
                        //         name: '安得物流',
                        //         value: [0, '2009/6/2 2:00', '2009/6/2 6:00', '粤A 00888', '计划件数:34,567']
                        //     },
                        // ],
                        //     itemStyle:{
                        //         emphasis:{
                        //             show:false
                        //         }
                        //     },
                        data: data
                    }
                ]
            };
            myChart.setOption(this.option);
            const _this = this;
            // const lastClickIndex = null;
            // let color = '';
            myChart.on('mouseover', function (params) {
                myChart.dispatchAction({
                    type: 'downplay'
                });
            });
            // 离开鼠标时还原
            myChart.on('mouseout', function (params) {
                _this.option.series[0].data.forEach(e => {
                    if (e.value[5] === '空闲') e.itemStyle.normal.color = '#1D4797';
                    if (e.value[5] === '卸货任务') {
                        e.itemStyle.normal.color = 'rgba(27, 226, 208, .6)';
                        e.itemStyle.normal.borderWidth = 0;
                    }
                    if (e.value[5] === '备货任务') {
                        e.itemStyle.normal.color = 'rgba(30, 87, 255, .75)';
                        e.itemStyle.normal.borderWidth = 0;
                    }
                });
                myChart.setOption(_this.option);
            });
            // 点击时更改颜色(高亮)
            myChart.on('click', function (params) {
                // 点击空闲部分不高亮
                if (_this.option.series[0].data[params.dataIndex].value[5] === '空闲') return;
                myChart.dispatchAction({
                    type: 'highlight',
                    dataIndex: params.dataIndex
                });
                if (_this.option.series[0].data[params.dataIndex].value[5] === '卸货任务') {
                    _this.option.series[0].data[params.dataIndex].itemStyle.normal.color = '#0ff4df';
                    _this.option.series[0].data[params.dataIndex].itemStyle.normal.borderWidth = 3;
                    _this.option.series[0].data[params.dataIndex].itemStyle.normal.borderColor = '#0ff4df';
                }
                if (_this.option.series[0].data[params.dataIndex].value[5] === '备货任务') {
                    _this.option.series[0].data[params.dataIndex].itemStyle.normal.color = '#0094F8';
                    _this.option.series[0].data[params.dataIndex].itemStyle.normal.borderWidth = 3;
                    _this.option.series[0].data[params.dataIndex].itemStyle.normal.borderColor = '#0094F8';
                }
                myChart.setOption(_this.option);
            });
            window.onresize = () => {
                // 窗口尺寸改变时，销毁echarts实例，重新绘图
                let myChart = this.$echarts.init(this.$refs.planChart);
                myChart.dispose();
                myChart = this.$echarts.init(this.$refs.planChart);
                // 绘制图表
                myChart.setOption(this.option);
            };
        }
    }
};
</script>

<style lang="less">
@import './style/style.less';
</style>
