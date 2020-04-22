<template>
    <div class="echarts-bar">
        <div class="bar-title">
            {{locCode}}
        </div>
        <div class="bar-chart">
            <div id="barId" ref="barId">
            </div>
        </div>
        <div class="bar-occupancy">
            <div class="text">
                <span class="num">{{ parseInt(stNews * 100) }}</span>
                <span class="precent">%</span>
            </div>
            <div>占用率</div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import 'echarts-liquidfill/src/liquidFill.js';
export default {
    props: {
        stNews: {
            type: Number,
            default() {
                return 0;
            }
        },
        locCode: {
            type: String,
            default() {
                return '';
            }
        },
        color: {
            type: String,
            default: '#0058F4'
        }
    },
    watch: {
        stNews(val) {
            this.drawEcharts();
        }
    },
    mounted() {
        this.drawEcharts();
    },
    data() {
        return {
            listVal: {},
            dataNum: 0
        };
    },
    methods: {
        drawEcharts() {
            this.myChart = echarts.init(this.$refs.barId);
            this.myChart.setOption({
                series: [{
                    type: 'liquidFill', // 类型
                    data: this.stNews < 1 ? [this.stNews] : [2], // 数据是个数组 数组的每一项的值是0-1, 取2的意图是为了100%的时候显示满的
                    label: {
                        show: false
                    },
                    outline: {
                        show: false, // 是否显示轮廓 布尔值
                        borderDistance: 0, // 外部轮廓与图表的距离 数字
                        itemStyle: {
                            borderWidth: 0 // 边框的宽度
                        }
                    },
                    backgroundStyle: {
                        color: '#1D4797', // 图表的背景颜色
                        itemStyle: {
                            shadowBlur: 100, // 设置无用
                            shadowColor: '#f60', // 设置无用
                            opacity: 1 // 设置无用
                        }
                    },
                    color: [this.color], // 水波的颜色 对应的是data里面值
                    // 水填充图的形状 circle默认圆形  rect圆角矩形  triangle三角形  diamond菱形  pin水滴状 arrow箭头状  还可以是svg的path
                    shape: 'rect',
                    // 图表相对于盒子的位置 第一个是水平的位置 第二个是垂直的值 默认是[50%,50%]是在水平和垂直方向居中 可以设置百分比 也可以设置具体值
                    center: ['50%', '50%'],
                    // 图表的大小 值是圆的直径 可以是百分比 也可以是具体值 100%则占满整个盒子 默认是40%; 百分比下是根据宽高最小的一个为参照依据
                    radius: '100%',
                    // 振幅 是波浪的震荡幅度 可以取具体的值 也可以是百分比 百分比下是按图标的直径来算
                    amplitude: Number(this.stNews.rateNum) >= 1 || Number(this.stNews.rateNum) <= 0 ? 0 : 4,
                    // 波的长度 可以是百分比也可以是具体的像素值  百分比下是相对于直径的 取得越大波浪的起伏越小
                    waveLength: '30%',
                    // phase: 0, // 波的相位弧度 默认情况下是自动
                    period: (value, index) => {
                        // 控制波的移动速度 可以是函数 也可以是数字 两个参数  value 是data数据里面的值 index 是data值的索引
                        return index * 2000;
                    },
                    direction: 'left', // 波移动的速度 两个参数  left 从右往左 right 从左往右
                    waveAnimation: false // 控制波动画的开关  值是布尔值 false 是关闭动画 true 是开启动画 也是默认值
                }]
            });
        }
    },
    beforeDestroy() {
        if (!this.myChart) {
            return;
        }
        this.myChart.dispose();
        this.myChart = null;
    }
};
</script>

<style lang="less">
@import "./style/style.less";
</style>
