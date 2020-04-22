<template>
    <div class="item-body">
        <div class="body-head">
            <div>{{item.label}}</div>
            <el-popover placement="bottom" trigger="hover">
                <div class="popover-css" @click="closeUp(item.prop)">关闭</div>
                <i slot="reference" class="el-icon-more i-style"></i>
            </el-popover>
        </div>
        <div class="item-content">
            <div class="completion-quantity">
                <div class="completion-quantity-left">
                    <img class="completion-quantity-img" src="../images/1.png">
                    <div>
                        <div>今日发车量（辆）</div>
                        <div>同比<span><span v-if="TodayDepartureNumTB_Num>0">+</span>{{TodayDepartureNumTB_Num}}%</span></div>
                    </div>
                </div>
                <div class="completion-quantity-right">{{TodayDeparture_Num.toFixed(2)}}</div>
            </div>
            <div class="completion-quantity">
                <div class="completion-quantity-left">
                    <img class="completion-quantity-img" src="../images/2.png">
                    <div>
                        <div>今日配送量（m³）</div>
                        <div>同比<span><span v-if="DistributionTodayTB_Num>0">+</span>{{DistributionTodayTB_Num}}%</span></div>
                    </div>
                </div>
                <div class="completion-quantity-right">{{DistributionToday_Num.toFixed(2)}}</div>
            </div>
            <div class="completion-quantity">
                <div class="completion-quantity-left">
                    <img class="completion-quantity-img" src="../images/3.png">
                    <div>
                        <div>今日签单量（EA）</div>
                        <div>同比<span><span v-if="SignatureVolumeTodayTB_Num>0">+</span>{{SignatureVolumeTodayTB_Num}}%</span></div>
                    </div>
                </div>
                <div class="completion-quantity-right">{{SignatureVolumeToday_Num.toFixed(2)}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    TodayDepartureNum,
    TodayDepartureNumTB,
    DistributionToday,
    DistributionTodayTB,
    SignatureVolumeToday,
    SignatureVolumeTodayTB
} from '../../../api/manaDesk.js';
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
            TodayDeparture_Num: 0, // 今日发车量
            TodayDepartureNumTB_Num: 0, // 发车量同比
            DistributionToday_Num: 0, // 今日配送量
            DistributionTodayTB_Num: 0, // 配送量同比
            SignatureVolumeToday_Num: 0, // 今日签单量
            SignatureVolumeTodayTB_Num: 0 // 签单量同比
        };
    },
    mounted() {
        this.sitecodestr1 = /\[/.test(this.sitecodestr) ? JSON.parse(this.sitecodestr) : this.sitecodestr;
    },
    watch: {
        sitecodestr1() {
            this.completionQuantity();
        }
    },
    methods: {
        closeUp(e) {
            this.$emit('closeUp', e);
        },
        completionQuantity() {
            // 今日发车量
            TodayDepartureNum({
                type: 'work_management_platform',
                code: 'TodayDepartureNum',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.TodayDeparture_Num = res.data.result_string_sum.value;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 发车量同比
            TodayDepartureNumTB({
                type: 'work_management_platform_tb',
                code: 'TodayDepartureNumTB',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    let pre = ((res.data.today_result_string_sum.value - res.data.yesterday_result_string_sum.value) / res.data.yesterday_result_string_sum.value) * 100;
                    if (+res.data.yesterday_result_string_sum.value === 0) { pre = 0; }
                    this.TodayDepartureNumTB_Num = pre.toFixed(2);
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 今日配送量
            DistributionToday({
                type: 'work_management_platform',
                code: 'DistributionToday',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.DistributionToday_Num = res.data.result_string_sum.value;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 配送量同比
            DistributionTodayTB({
                type: 'work_management_platform_tb',
                code: 'DistributionTodayTB',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    let pre = ((res.data.today_result_string_sum.value - res.data.yesterday_result_string_sum.value) / res.data.yesterday_result_string_sum.value) * 100;
                    if (+res.data.yesterday_result_string_sum.value === 0) { pre = 0; }
                    this.DistributionTodayTB_Num = pre.toFixed(2);
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 今日签单量
            SignatureVolumeToday({
                type: 'work_management_platform',
                code: 'SignatureVolumeToday',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    this.SignatureVolumeToday_Num = res.data.result_string_sum.value;
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
            // 签单量同比
            SignatureVolumeTodayTB({
                type: 'work_management_platform_tb',
                code: 'SignatureVolumeTodayTB',
                site_code: this.isalluserData ? JSON.stringify({ 'match_all': {} }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d') : JSON.stringify({
                    'terms': {
                        'site_code.keyword': this.sitecodestr1
                    }
                }).replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5b').replace(/\]/g, '%5d')
            }).then(res => {
                if (+res.code === 0) {
                    let pre = ((res.data.today_result_string_sum.value - res.data.yesterday_result_string_sum.value) / res.data.yesterday_result_string_sum.value) * 100;
                    if (+res.data.yesterday_result_string_sum.value === 0) { pre = 0; }
                    this.SignatureVolumeTodayTB_Num = pre.toFixed(2);
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