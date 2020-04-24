<template>
    <div class="item-body" v-resize="resizeEcharts">
        <div class="body-head">
            <div v-if="item.prop !== '01000005'">{{item.label}}</div>
            <el-popover placement="bottom" trigger="hover">
                <div class="popover-css" @click="closeUp(item.prop)">关闭</div>
                <i slot="reference" class="el-icon-more i-style"></i>
            </el-popover>
        </div>
        <div class="item-content" id="OrderTrend"  v-if="item.prop === '01000002'"></div>
    </div>
</template>
<script>
import { OrderQuantity } from '../../../api/manaDesk.js';
export default {
    props: {
        item: {
            type: Object
        },
        isalluserData: {
            type: Boolean
        },
        sitecodestr: {
            type: String
        }
    },
    data() {
        return {
            sitecodestr1: '',
            myChart: null,
            options: {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: []
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                xAxis: [{
                    data: []
                }],
                yAxis: [{
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#EDEDED'
                        }
                    }
                }],
                series: [
                    {
                        name: '订单',
                        type: 'line',
                        smooth: true,
                        stack: '总量',
                        symbol: 'circle',
                        showSymbol: false,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#00BCBF'
                                },
                                color: new this.$echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [{
                                        offset: 0,
                                        color: '#d7f4f8'
                                    }, {
                                        offset: 0.5,
                                        color: '#eefcfd'
                                    }, {
                                        offset: 1,
                                        color: '#fff'
                                    }]
                                )
                            }
                        },
                        areaStyle: {},
                        data: []
                    }
                ]
            }
        };
    },
    mounted() {
        this.sitecodestr1 = /\[/.test(this.sitecodestr) ? JSON.parse(this.sitecodestr) : this.sitecodestr;
    },
    methods: {
        closeUp(e) {
            this.$emit('closeUp', e);
        },
        renderChart() {
            if (document.getElementById('OrderTrend') === null) return;
            this.myChart = this.$echarts.init(
                document.getElementById('OrderTrend')
            );
            this.myChart.setOption(this.options);
        },
        getPreMonthDate() {
            const times = new Date();
            const Y = times.getFullYear();
            let M = times.getMonth() + 1;
            const D = times.getDate();
            let MD = '';
            const dateArr = [];
            for (let i = 0; i <= 30; i++) {
                if (D - i > 0) {
                    MD = M + '/' + (D - i);
                    dateArr[i] = MD;
                } else {
                    M = times.getMonth();
                    if (M === 1 || M === 3 || M === 5 || M === 7 || M === 8 || M === 10 || M === 12) {
                        MD = M + '/' + (D - i + 31);
                    } else if (M === 4 || M === 6 || M === 9 || M === 11) {
                        MD = M + '/' + (D - i + 30);
                    } else {
                        if ((((Y % 4) === 0) && ((Y % 100) !== 0)) || ((Y % 400) === 0)) { // 闰年
                            MD = M + '/' + (D - i + 29);
                        } else {
                            MD = M + '/' + (D - i + 28);
                        }
                    }
                    dateArr[i] = MD;
                }
            }
            return dateArr;
        },
        orderquanFn() {
            OrderQuantity({
                type: 'OrderQuantity',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null && res.data.count && res.data.count.dt_aggs && res.data.count.dt_aggs.buckets.length > 0) {
                        const monthlist = res.data.count.dt_aggs.buckets.map(el => {
                            return el.key_as_string;
                        });
                        const resultadd = res.data.count.dt_aggs.buckets.map(el => {
                            return el.total.value;
                        });
                        this.options.xAxis[0].data = monthlist;
                        this.options.series[0].data = resultadd;
                        this.renderChart();
                    } else {
                        this.options.xAxis[0].data = this.getPreMonthDate();
                        const arr = [];
                        for (let i = 0; i < 31; i++) {
                            arr.push(0);
                        }
                        this.options.series[0].data = arr;
                        this.renderChart();
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        },
        resizeEcharts() {
            if (this.myChart === null) return;
            this.myChart.resize();
            this.myChart.setOption(this.options);
        }
    },
    watch: {
        sitecodestr1() {
            if (this.myChart) this.myChart.dispose();
            setTimeout(() => {
                this.orderquanFn(); // 30天订单
            }, 500);
        }
    },
    directives: {
        resize: {
            bind: function (el, binding) {
                let width = '';
                let height = '';
                function get() {
                    const style = document.defaultView.getComputedStyle(el);
                    if (width !== style.width || height !== style.height) {
                        binding.value({ width, height });
                    }
                    width = style.width;
                    height = style.height;
                }
                el.__vueReize__ = setInterval(get, 200);
            },
            unbind: function (el) {
                clearInterval(el.__vueReize__);
            }
        }
    }
};
</script>
<style lang="less">
.item-body {
    width: 100%;
    background:#fff;
    height: 100%;
    border-radius: 2px;
    display: flex;
    flex-flow: column;
    .body-head {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #F2F2F2;
        padding: 0 12px;
        font-size: 14px;
        color: #333;
        flex-shrink: 0;
    }
    .item-content{
        width: 100%;
        height: 100%;
        padding: 12px;
        box-sizing: border-box;
    }
}
.completion-quantity {
    height: 70px;
    width: 100%;
    background: #F9F9F9;
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    box-sizing: border-box;
    font-size: 12px;
    color: #333;
    margin-bottom: 12px;
    .completion-quantity-img {
        width: 38px;
        height: 38px;
        margin-right: 12px;
    }
    .completion-quantity-left {
        display:flex;
        align-items: center;
    }
    .completion-quantity-right{
        color: #474747;
        font-size: 20px;
    }
}
.el-popover {
    min-width: inherit;
    padding: 6px 0;
}
.popover-css {
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    min-width: inherit;
    width: 80px;
    text-align: center;
    cursor: pointer;
    &:hover {
        background: #ebfafa;
    }
}
.el-popper .popper__arrow {
    display: block;
}
.i-style {
    color: #D8D8D8;
}
</style>