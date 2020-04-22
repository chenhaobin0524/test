<template>
    <div class="item-body">
        <div class="body-head">
            <div v-if="item.prop !== '01000005'">{{item.label}}</div>
            <el-popover v-if="item.prop === '01000005'" placement="bottom" trigger="hover">
                <div class="popover-css" @click="changeWarning(1)">发货预警(m³)</div>
                <div class="popover-css" @click="changeWarning(2)">发货预警(EA)</div>
                <div slot="reference"><span>{{item.label}}<i class="el-icon-caret-bottom"></i></span></div>
            </el-popover>
            <el-popover placement="bottom" trigger="hover">
                <div class="popover-css" @click="closeUp(item.prop)">关闭</div>
                <i slot="reference" class="el-icon-more i-style"></i>
            </el-popover>
        </div>
        <div class="item-content" style="display: flex;flex-flow: column;">
            <div class="receipt-warning-top">
                <div class="receipt-warning-top-box">
                    <span class="font-gray12">
                        {{item.prop === '01000004' ? '未下发' : item.prop === '01000005' ? '未发货' : '未签收'}}</span><span class="font-gray20">{{Noordersissued_num.toFixed(0)}}
                    </span>
                </div>
                <div class="receipt-warning-top-box ml12">
                    <span class="font-gray12">
                        {{item.prop === '01000004' ? '24H应下' : item.prop === '01000005' ? '24H应发' : '24H应签'}}</span><span class="font-gray20">{{HoursShouldLower_num.toFixed(0)}}
                    </span>
                </div>
            </div>
            <div class="receipt-warning-bottom">
                <div class="warning-bl">
                    <div
                        class="font-pink20"
                        :style="{'color': +day0_result_string_sum>0 ? '#FF8378' : '#4D4D4D'}">
                        {{ day0_result_string_sum }}
                    </div>
                    <div class="font-cyan12" @click="beoverdueFn">逾期</div>
                </div>
                <div class="warning-br">
                    <div class="warning-br-box margin-b20">
                        <div class="br-box-item">
                            <div class="font-pink16" :style="{'color': +day1_result_string_sum>0 ? '#FF8378' : '#4D4D4D'}">
                                {{day1_result_string_sum}}
                            </div>
                            <div class="font-gray12">超1天</div>
                        </div>
                        <div class="br-box-item">
                            <div class="font-pink16" :style="{'color': +day2_result_string_sum>0 ? '#FF8378' : '#4D4D4D'}">
                                {{day2_result_string_sum}}
                            </div>
                            <div class="font-gray12">超2天</div>
                        </div>
                        <div class="br-box-item">
                            <div class="font-pink16" :style="{'color': +day3_result_string_sum>0 ? '#FF8378' : '#4D4D4D'}">
                                {{day3_result_string_sum}}
                            </div>
                            <div class="font-gray12">超3天</div>
                        </div>
                    </div>
                    <div class="warning-br-box">
                        <div class="br-box-item">
                            <div class="font-pink16" :style="{'color': +day4_result_string_sum>0 ? '#FF8378' : '#4D4D4D'}">
                                {{day4_result_string_sum}}
                            </div>
                            <div class="font-gray12">超4天</div>
                        </div>
                        <div class="br-box-item">
                            <div class="font-pink16" :style="{'color': +day5_result_string_sum>0 ? '#FF8378' : '#4D4D4D'}">
                                {{day5_result_string_sum}}
                            </div>
                            <div class="font-gray12">超5天</div>
                        </div>
                        <div class="br-box-item">
                            <div class="font-pink16" :style="{'color': +day6_result_string_sum>0 ? '#FF8378' : '#4D4D4D'}">
                                {{day6_result_string_sum}}
                            </div>
                            <div class="font-gray12">超5天以上</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    ReceiptWarning6Day,
    Noordersissued,
    HoursShouldLower,
    Unshipped6DayCube,
    UnshippedCube,
    HourShouldshippedCube,
    Unshipped6Day,
    Unshipped,
    HourShouldshipped,
    SignAndReceiveWarning6Day,
    Unsigned,
    HourShouldSign
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
            type: Boolean,
            default() {
                return false;
            }
        },
        sitecodestr: {
            type: String,
            default() {
                return '';
            }
        },
        refresh: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    watch: {
        sitecodestr1() {
            this.reData();
        },
        refresh(val) {
            if (val) { this.reData(); }
        }
    },
    data() {
        return {
            sitecodestr1: '',
            changeWarningStatus: 'EA',
            Noordersissued_num: 0, // 接单预警未下发
            HoursShouldLower_num: 0, // 接单预警24H应下
            day0_result_string_sum: 0,
            day1_result_string_sum: 0,
            day2_result_string_sum: 0,
            day3_result_string_sum: 0,
            day4_result_string_sum: 0,
            day5_result_string_sum: 0,
            day6_result_string_sum: 0
        };
    },
    mounted() {
        this.sitecodestr1 = /\[/.test(this.sitecodestr) ? JSON.parse(this.sitecodestr) : this.sitecodestr;
    },
    components: {},
    methods: {
        reData() {
            if (this.item.prop === '01000004') {
                this.orderWarning();
            } else if (this.item.prop === '01000005') {
                this.deliveryWarning();
            } else if (this.item.prop === '01000006') {
                this.receiveWarning();
            }
        },
        beoverdueFn() {
            const createEndTime = this.getcurrentTime();
            const createStartTime = this.getDateStr(-180);
            if (this.item.prop === '01000006') {
                this.$router.push({
                    path: '/distribute/receipt-sign',
                    query: {
                        orderStatusList: '60,70',
                        createEndTime,
                        createStartTime,
                        isRefresh: true
                    }
                });
            } else if (this.item.prop === '01000004') {
                const yesterdaytime = this.getcurrentTime(1);
                this.$router.push({
                    path: '/order-manage/order-center',
                    query: {
                        orderStatusList: '100,150,199,200,210,220,230,240,245,250,255',
                        createEndTime: yesterdaytime,
                        createStartTime,
                        isRefresh: true
                    }
                });
            } else if (this.item.prop === '01000005') {
                this.$router.push({
                    path: '/order-manage/task-center',
                    query: {
                        orderStatusList: '100,150,199,200,210,220,230,240,245,250,255,260,300,310,320,330,340,345',
                        requireOutEndTime: createEndTime,
                        requireOutStartTime: createStartTime,
                        isRefresh: true,
                        taskTypeList: 'OUT'
                    }
                });
            }
        },
        getDateStr(AddDayCount) {
            const dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);// 获取AddDayCount天后的日期
            const y = dd.getFullYear();
            const m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1);// 获取当前月份的日期，不足10补0
            const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();// 获取当前几号，不足10补0
            return y + '-' + m + '-' + d + ' 00:00:00';
        },
        getcurrentTime(type) {
            const date = new Date();
            if (type) { date.setDate(date.getDate() - 1); }
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        },
        closeUp(e) {
            this.$emit('closeUp', e);
        },
        changeWarning(type) {
            if (type === 1) {
                this.item.label = '发货预警(m³)';
                this.changeWarningStatus = 'M3';
                this.deliveryWarningM3();
            } else if (type === 2) {
                this.item.label = '发货预警EA';
                this.changeWarningStatus = 'EA';
                this.deliveryWarning();
            }
        },
        orderWarning() {
            // 逾期数据
            ReceiptWarning6Day({
                type: 'work_management_platform_6day',
                code: 'ReceiptWarning6Day',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data === null) {
                        this.day0_result_string_sum = 0;
                        this.day1_result_string_sum = 0;
                        this.day2_result_string_sum = 0;
                        this.day3_result_string_sum = 0;
                        this.day4_result_string_sum = 0;
                        this.day5_result_string_sum = 0;
                        this.day6_result_string_sum = 0;
                    } else {
                        this.day0_result_string_sum = res.data.day0_result_string_sum.value;
                        this.day1_result_string_sum = res.data.day1_result_string_sum.value;
                        this.day2_result_string_sum = res.data.day2_result_string_sum.value;
                        this.day3_result_string_sum = res.data.day3_result_string_sum.value;
                        this.day4_result_string_sum = res.data.day4_result_string_sum.value;
                        this.day5_result_string_sum = res.data.day5_result_string_sum.value;
                        this.day6_result_string_sum = res.data.day6_result_string_sum.value;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 未下发
            Noordersissued({
                type: 'work_management_platform',
                code: 'Noordersissued',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.Noordersissued_num = res.data !== null ? res.data.result_string_sum.value : 0;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 24H应下
            HoursShouldLower({
                type: 'work_management_platform',
                code: '24HoursShouldLower',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.HoursShouldLower_num = res.data !== null ? res.data.result_string_sum.value : 0;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        },
        deliveryWarningM3() {
            Unshipped6DayCube({
                type: 'work_management_platform_6day',
                code: 'Unshipped6DayCube',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data === null) {
                        this.day0_result_string_sum = 0;
                        this.day1_result_string_sum = 0;
                        this.day2_result_string_sum = 0;
                        this.day3_result_string_sum = 0;
                        this.day4_result_string_sum = 0;
                        this.day5_result_string_sum = 0;
                        this.day6_result_string_sum = 0;
                    } else {
                        this.day0_result_string_sum = res.data.day0_result_string_sum.value.toFixed(2) === '0.00' ? 0 : res.data.day0_result_string_sum.value.toFixed(2);
                        this.day1_result_string_sum = res.data.day1_result_string_sum.value.toFixed(2) === '0.00' ? 0 : res.data.day1_result_string_sum.value.toFixed(2);
                        this.day2_result_string_sum = res.data.day2_result_string_sum.value.toFixed(2) === '0.00' ? 0 : res.data.day2_result_string_sum.value.toFixed(2);
                        this.day3_result_string_sum = res.data.day3_result_string_sum.value.toFixed(2) === '0.00' ? 0 : res.data.day3_result_string_sum.value.toFixed(2);
                        this.day4_result_string_sum = res.data.day4_result_string_sum.value.toFixed(2) === '0.00' ? 0 : res.data.day4_result_string_sum.value.toFixed(2);
                        this.day5_result_string_sum = res.data.day5_result_string_sum.value.toFixed(2) === '0.00' ? 0 : res.data.day5_result_string_sum.value.toFixed(2);
                        this.day6_result_string_sum = res.data.day6_result_string_sum.value.toFixed(2) === '0.00' ? 0 : res.data.day6_result_string_sum.value.toFixed(2);
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 未发货
            UnshippedCube({
                type: 'work_management_platform',
                code: 'UnshippedCube',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.Noordersissued_num = res.data !== null ? res.data.result_string_sum.value : 0;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 24H应下
            HourShouldshippedCube({
                type: 'work_management_platform',
                code: '24HourShouldshippedCube',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.HoursShouldLower_num = res.data !== null ? res.data.result_string_sum.value : 0;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        },
        deliveryWarning() {
            Unshipped6Day({
                type: 'work_management_platform_6day',
                code: 'Unshipped6Day',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data === null) {
                        this.day0_result_string_sum = 0;
                        this.day1_result_string_sum = 0;
                        this.day2_result_string_sum = 0;
                        this.day3_result_string_sum = 0;
                        this.day4_result_string_sum = 0;
                        this.day5_result_string_sum = 0;
                        this.day6_result_string_sum = 0;
                    } else {
                        this.day0_result_string_sum = res.data.day0_result_string_sum.value;
                        this.day1_result_string_sum = res.data.day1_result_string_sum.value;
                        this.day2_result_string_sum = res.data.day2_result_string_sum.value;
                        this.day3_result_string_sum = res.data.day3_result_string_sum.value;
                        this.day4_result_string_sum = res.data.day4_result_string_sum.value;
                        this.day5_result_string_sum = res.data.day5_result_string_sum.value;
                        this.day6_result_string_sum = res.data.day6_result_string_sum.value;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 未发货
            Unshipped({
                type: 'work_management_platform',
                code: 'Unshipped',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.Noordersissued_num = res.data !== null ? res.data.result_string_sum.value : 0;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 24H应下
            HourShouldshipped({
                type: 'work_management_platform',
                code: '24HourShouldshipped',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.HoursShouldLower_num = res.data !== null ? res.data.result_string_sum.value : 0;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        },
        receiveWarning() {
            SignAndReceiveWarning6Day({
                type: 'work_management_platform_6day',
                code: 'SignAndReceiveWarning6Day',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    if (res.data === null) {
                        this.day0_result_string_sum = 0;
                        this.day1_result_string_sum = 0;
                        this.day2_result_string_sum = 0;
                        this.day3_result_string_sum = 0;
                        this.day4_result_string_sum = 0;
                        this.day5_result_string_sum = 0;
                        this.day6_result_string_sum = 0;
                    } else {
                        this.day0_result_string_sum = res.data.day0_result_string_sum.value;
                        this.day1_result_string_sum = res.data.day1_result_string_sum.value;
                        this.day2_result_string_sum = res.data.day2_result_string_sum.value;
                        this.day3_result_string_sum = res.data.day3_result_string_sum.value;
                        this.day4_result_string_sum = res.data.day4_result_string_sum.value;
                        this.day5_result_string_sum = res.data.day5_result_string_sum.value;
                        this.day6_result_string_sum = res.data.day6_result_string_sum.value;
                    }
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 未签收
            Unsigned({
                type: 'work_management_platform',
                code: 'Unsigned',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.Noordersissued_num = res.data !== null ? res.data.result_string_sum.value : 0;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 24H应下
            HourShouldSign({
                type: 'work_management_platform',
                code: '24HourShouldSign',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.HoursShouldLower_num = res.data !== null ? res.data.result_string_sum.value : 0;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
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
</style>