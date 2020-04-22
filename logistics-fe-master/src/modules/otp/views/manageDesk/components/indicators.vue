<template>
    <div class="item-body">
        <div class="body-head">
            <div>{{item.label}}</div>
            <el-popover placement="bottom" trigger="hover">
                <div class="popover-css" @click="tomoreFn">更多</div>
                <div class="popover-css" @click="closeUp(item.prop)">关闭</div>
                <i slot="reference" class="el-icon-more i-style"></i>
            </el-popover>
        </div>
        <div class="item-content" v-if="item.prop === '01000007'">
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !oneFlag}"
                    type="dashboard"
                    :percentage="+oneValue"
                    :color="oneColor">
                </el-progress>
                <span class="pro-text">卸货及时率（2B）</span>
            </div>
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !twoFlag}"
                    type="dashboard"
                    :percentage="+twoValue"
                    :color="twoColor">
                </el-progress>
                <span class="pro-text">出库及时率（2B）</span>
            </div>
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !threeFlag}"
                    type="dashboard"
                    :percentage="+threeValue"
                    :color="threeColor">
                </el-progress>
                <span class="pro-text">出库及时率（2C）</span>
            </div>
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !fourFlag}"
                    type="dashboard"
                    :percentage="+fourValue"
                    :color="fourColor">
                </el-progress>
                <span class="pro-text">退货及时率（2C）</span>
            </div>
        </div>
        <div class="item-content"  v-if="item.prop === '01000008'">
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !oneFlag}"
                    type="dashboard"
                    :percentage="+oneValue"
                    :color="oneColor">
                </el-progress>
                <span class="pro-text">配送及时率</span>
            </div>
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !twoFlag}"
                    type="dashboard"
                    :percentage="+twoValue"
                    :color="twoColor">
                </el-progress>
                <span class="pro-text">回单及时率</span>
            </div>
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !threeFlag}"
                    type="dashboard"
                    :percentage="+threeValue"
                    :color="threeColor">
                </el-progress>
                <span class="pro-text">退货及时率</span>
            </div>
        </div>
        <div class="item-content"  v-if="item.prop === '01000009'">
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !oneFlag}"
                    type="dashboard"
                    :percentage="+oneValue"
                    :color="oneColor">
                </el-progress>
                <span class="pro-text">支线及时率</span>
            </div>
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': !twoFlag}"
                    type="dashboard"
                    :percentage="+twoValue"
                    :color="twoColor">
                </el-progress>
                <span class="pro-text">全链路签收及时率</span>
            </div>
            <div class="porgress-indicator">
                <el-progress
                    :class="{'notup-standard': threeFlag}"
                    type="dashboard"
                    :percentage="+threeValue"
                    :color="threeColor">
                </el-progress>
                <span class="pro-text">工单及时率</span>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="showDialog" @close="showDialog=false" width="30%">
            <div>跳转至【鲲鹏2】https://kunp.midea.com/kunp2/<span>查看更多指标内容。</span></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog=false">留此页面</el-button>
                <el-button type="primary" @click="updataShowBtn">跳 转</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    TimelyDischargeCargoRate2B,
    TimelyWorkOrderRate2C,
    TimelyOutRate2B,
    TimelyOutRate2C,
    TimelyReturnGoodsRate2C,
    TimelyDeliveryRate,
    TimelyReceiptRate,
    TimelyReturnGoodsRate2B,
    TimelyFeederLineRate2C,
    TimelyFullLinkRate2C
} from '../../../api/manaDesk.js';
export default {
    props: {
        item: {
            type: Object,
            default() {
                return {};
            }
        },
        isalluserData: {
            type: Boolean
        },
        sitecodestr: {
            type: String
        },
        refresh: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data() {
        return {
            sitecodestr1: '',
            showDialog: false,
            oneFlag: false,
            oneColor: [{ color: '#F96C5F', percentage: 100 }],
            oneValue: 0,
            twoFlag: false,
            twoColor: [{ color: '#F96C5F', percentage: 100 }],
            twoValue: 0,
            threeFlag: false,
            threeColor: [{ color: '#F96C5F', percentage: 100 }],
            threeValue: 0,
            fourFlag: false,
            fourColor: [{ color: '#F96C5F', percentage: 100 }],
            fourValue: 0
        };
    },
    mounted() {
        this.sitecodestr1 = /\[/.test(this.sitecodestr) ? JSON.parse(this.sitecodestr) : this.sitecodestr;
    },
    watch: {
        sitecodestr1() {
            this.warehousingIndex();
        },
        refresh(val) {
            if (val) { this.warehousingIndex(); }
        }
    },
    components: {},
    methods: {
        warehousingIndex() {
            const myDate = new Date();
            const Year = myDate.getFullYear();
            const Month = myDate.getMonth() + 1;
            const lastMonth = myDate.getMonth();
            const day = myDate.getDate();
            let startTime = '';
            let endtime = '';
            if (day === 1) {
                myDate.setMonth(lastMonth);
                myDate.setDate(0);
                const lastMonthday = myDate.getDate();
                startTime = Year + '-' + lastMonth + '-1 00:00:00';
                endtime = Year + '-' + lastMonth + '-' + lastMonthday + ' 23:59:59';
            } else {
                startTime = Year + '-' + Month + '-1 00:00:00';
                endtime = Year + '-' + Month + '-' + (day - 1) + ' 23:59:59';
            }
            if (this.item.prop === '01000007') {
                this.one(startTime, endtime);
            } else if (this.item.prop === '01000008') {
                this.two(startTime, endtime);
            } else if (this.item.prop === '01000009') {
                this.three(startTime, endtime);
            }
        },
        three(startTime, endtime) {
            // 支线及时率（2C）
            TimelyFeederLineRate2C({
                type: 'TimelyFeederLineRate2C',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.oneFlag = truevalue > targetvalue;
                        this.oneColor[0].color = !this.oneFlag ? '#F96C5F' : '#00BCBF';
                        this.oneValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.oneColor[0].color = '#00BCBF';
                        this.oneValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 全链路签收及时率（2C）
            TimelyFullLinkRate2C({
                type: 'TimelyFullLinkRate2C',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.twoFlag = truevalue > targetvalue;
                        this.twoColor[0].color = !this.twoFlag ? '#F96C5F' : '#00BCBF';
                        this.twoValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.twoColor[0].color = '#00BCBF';
                        this.twoValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 工单及时率（2C）
            TimelyWorkOrderRate2C({
                type: 'TimelyWorkOrderRate2C',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.threeFlag = truevalue > targetvalue;
                        this.threeColor[0].color = this.threeFlag ? '#F96C5F' : '#00BCBF';
                        this.threeValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.threeColor[0].color = '#00BCBF';
                        this.threeValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        },
        two(startTime, endtime) {
            // 配送及时率（2B）
            TimelyDeliveryRate({
                type: 'TimelyDeliveryRate',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.oneFlag = truevalue > targetvalue;
                        this.oneColor[0].color = !this.oneFlag ? '#F96C5F' : '#00BCBF';
                        this.oneValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.oneColor[0].color = '#00BCBF';
                        this.oneValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 回单及时率（2B）
            TimelyReceiptRate({
                type: 'TimelyReceiptRate',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.twoFlag = truevalue > targetvalue;
                        this.twoColor[0].color = !this.twoFlag ? '#F96C5F' : '#00BCBF';
                        this.twoValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.twoColor[0].color = '#00BCBF';
                        this.twoValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 退货及时率（2B）
            TimelyReturnGoodsRate2B({
                type: 'TimelyReturnGoodsRate2B',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.threeFlag = truevalue > targetvalue;
                        this.threeColor[0].color = !this.threeFlag ? '#F96C5F' : '#00BCBF';
                        this.threeValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.threeColor[0].color = '#00BCBF';
                        this.threeValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        },
        one(startTime, endtime) {
            // 卸货及时率（2B）
            TimelyDischargeCargoRate2B({
                type: 'TimelyDischargeCargoRate2B',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.oneFlag = truevalue > targetvalue;
                        this.oneColor[0].color = !this.oneFlag ? '#F96C5F' : '#00BCBF';
                        this.oneValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.oneColor[0].color = '#00BCBF';
                        this.oneValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            TimelyOutRate2B({
                type: 'TimelyOutRate2B',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.twoFlag = truevalue > targetvalue;
                        this.twoColor[0].color = !this.twoFlag ? '#F96C5F' : '#00BCBF';
                        this.twoValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.twoColor[0].color = '#00BCBF';
                        this.twoValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            TimelyOutRate2C({
                type: 'TimelyOutRate2C',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.threeFlag = truevalue > targetvalue;
                        this.threeColor[0].color = !this.threeFlag ? '#F96C5F' : '#00BCBF';
                        this.threeValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.threeColor[0].color = '#00BCBF';
                        this.threeValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 退货及时率（2C）
            TimelyReturnGoodsRate2C({
                type: 'TimelyReturnGoodsRate2C',
                start_time: startTime,
                end_time: endtime,
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data !== null) {
                        const count = res.data.count;
                        const buckets = count.dim_time.buckets;
                        const truevalue = buckets.length > 0 ? (+buckets[0].total.value === 0 ? 0 : (buckets[0].target.value / buckets[0].total.value) * 100) : 0;
                        const targetvalue = buckets.length > 0 ? (+count.doc_count === 0 ? 0 : (buckets[0].rate.value / count.doc_count) * 100) : 0;
                        this.fourFlag = truevalue > targetvalue;
                        this.fourColor[0].color = !this.fourFlag ? '#F96C5F' : '#00BCBF';
                        this.fourValue = truevalue.toFixed(2) === '0.00' ? 0 : truevalue.toFixed(2);
                    } else {
                        this.fourColor[0].color = '#00BCBF';
                        this.fourValue = 0;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        },
        tomoreFn() {
            this.showDialog = true;
        },
        updataShowBtn() {
            this.showDialog = false;
            window.open('https://kunp.midea.com/kunp2/', '_blank');
        },
        closeUp(e) {
            this.$emit('closeUp', e);
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
.porgress-indicator {
    position: relative;
    display: inline-block;
    width: 50%;
    text-align: center;
    margin-bottom: 20px;
    .el-progress {
        display: inline-block;
    }
    .el-progress__text{
        position: absolute;
        top: 50%;
        transform: translate(-50% ,-50%);
        left: 50%;
        margin-left: inherit;
        font-size: 20px !important;
        color: #4D4D4D;
    }
    .notup-standard .el-progress__text{
        color: #F96C5F;
    }
    .el-progress-circle {
        width: 100px !important;
        height: 100px !important;
    }
    .pro-text {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align:center;
        left: 0;
        font-size: 12px;
        color:#898C8C;
    }
}
</style>