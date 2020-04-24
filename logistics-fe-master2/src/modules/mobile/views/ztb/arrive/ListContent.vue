<template>
    <div class="list-content" v-loading='timeLoading'>
        <el-collapse v-model="activeList" @change="handleListChange" class="list-collapse">
            <el-collapse-item :name="index" v-for="(warehouse,index) in dispatchs" :key="index">
                <template slot="title">
                    <span class="list-content-title-location">{{warehouse[0].whName}}&nbsp;&nbsp;&nbsp;{{warehouse[0].queueTypeValue}}</span>
                    <span class="list-content-title-sit">{{warehouse[0].companyName}}/{{warehouse[0].siteName}}</span>
                </template>
                <div :class="['car-list',{'car-item-active':currentItem.id === vehcile.id}]" @click="handleCarItem(vehcile)" v-for="(vehcile,vid) in warehouse" :key="vid">
                    <div class="car-icon">
                        <div class="car-index">{{vid + 1}}</div>
                        <i v-if="vehcile.flag === 1" class="icon-Preferred"></i>
                        <i v-else-if="vehcile.flag !== 0 && vehcile.flag !== undefined && vehcile.flag !== null" class="icon-pass"></i>
                        <span v-else></span>
                    </div>
                    <div class="car-info">
                        <p>{{vehcile.carNo}}&nbsp;&nbsp;&nbsp;{{vehcile.driverMobile}}</p>
                        <p>排队时间&nbsp;&nbsp;{{vehcile.createTime}}</p>
                    </div>
                    <div class="car-status">
                        <p>
                            <span class="car-status-error" v-if="vehcile.artificialFinish === 1">异常排队</span>
                            <span class="car-status-primary" v-else>{{vehcile.queueStatusName}}</span>
                        </p>
                        <p>等待时间&nbsp;&nbsp;{{vehcile.diffTime}}h</p>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <mPage ref="page" :pageData="pageConfig" :total="driverTotal" @on-page-change="pageChange" @on-size-change="sizeChange"></mPage>
    </div>
</template>
<script>
import mPage from '@/components/awesome/page/mPanel3/mPage';
import api from '../../../api/ztb/arrive.js';
import formatTime from '@/utils/common.js';
import { dictDataName, oneDictDataArr } from '../../../utils/common.js';

export default {
    components: { mPage },
    data() {
        return {
            activeList: [0],
            pageConfig: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSize: 10,
                pageSizes: [10, 20, 30, 50, 100]
            },
            pageNo: 1,
            pageSize: 10,
            driverQueue: [],
            driverTotal: 0,
            timeLoading: false,
            dispatchs: [],
            currentPage: 1,
            forceUpdate: null,
            currentItem: {},
            detailLoading: false,
            recordList: []
        };
    },
    props: {
        searchItem: {
            type: Object,
            default () {
                return {};
            }
        },
        dictData: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    methods: {
        pageChange(data) {
            this.pageNo = data;
            this.getVehicleList(this.searchItem);
        },
        sizeChange(data) {
            this.pageSize = data;
            this.getVehicleList(this.searchItem);
        },
        handleListChange(val) {
            this.$emit('handleListChange', val);
        },
        handleCarItem(value) {
            const params = {
                code: value.code
            };
            api.recordList(params).then(res => {
                this.recordList = res.data.list;
                this.recordList.map(item => {
                    item.createTime = formatTime.formatDateTime(item.createTime);
                });
                this.$emit('handleCarItem', value, this.recordList);
            });
            this.currentItem = value;
        },
        getVehicleList(searchItem) {
            this.timeLoading = true;
            const params = {
                ...searchItem,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            };
            api.vehicleList(params).then(res => {
                this.driverQueue = res.data.list;
                this.driverTotal = res.data.totalCount;
                const rows = this.driverQueue || [];
                this.timeLoading = false;
                const hash = {};
                rows.forEach((item) => {
                    const hashVP = hash[item.whCode];
                    if (!hashVP) {
                        hash[item.whCode] = [];
                        hash[item.whCode].push(item);
                    } else {
                        hashVP.push(item);
                    }
                });
                const total = this.driverTotal;
                const warehouses = Object.values(hash);
                warehouses.map((warehouse) => {
                    warehouse.sort(this.compare('currentQueue', false, parseInt));
                    warehouse[0].queueTypeValue = this.getPanelHeader(warehouse);
                    warehouse.map(item => {
                        item.createTime = formatTime.formatDateTime(item.createTime);
                        item.diffTime = this.getHours(item);
                        const queueObj = [].concat(oneDictDataArr(this.dictData.QUEUE_STATUS));
                        dictDataName(queueObj, item, 'queueStatus', 'queueStatusName');
                        const typeObj = [].concat(oneDictDataArr(this.dictData.QUEUE_TYPE));
                        dictDataName(typeObj, item, 'queueType', 'queueTypeName');
                    });
                });
                this.updateDispatch(warehouses, total, this.pageNo);
            }).catch(() => {
                this.timeLoading = false;
            });
        },
        compare(filed, rev, primer) {
            rev = (rev) ? -1 : 1;
            return function (c, d) {
                let a = c[filed];
                let b = d[filed];
                if (typeof (primer) !== 'undefined') {
                    a = primer(a);
                    b = primer(b);
                }
                if (a < b) { return rev * -1; }
                if (a > b) { return rev * 1; }
                if (a === b) {
                    if (c.createtime > d.createtime) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
                return 1;
            };
        },
        getHours(item) {
            let etime;
            const stime = new Date(item.createTime).getTime();
            if (item.finishTime && item.queueStatus === 20) {
                etime = new Date(item.finishTime).getTime();
            } else {
                etime = Date.parse(new Date());
            }
            const usedTime = etime - stime; // 两个时间戳相差的毫秒数
            const days = Math.floor(usedTime / (24 * 3600 * 1000));
            // 计算出小时数
            const leave1 = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
            const hours = Math.floor(leave1 / (3600 * 1000));
            const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
            const minutes = Math.floor(leave2 / (60 * 1000));
            const time = (days * 24 + hours + minutes / 60).toFixed(2);
            return time;
        },
        updateDispatch(dispatchs, total, page) {
            if (dispatchs.length > 0) {
                this.dispatchs = dispatchs;
                this.driverTotal = total;
                this.forceUpdate = null;
                this.currentPage = page;
                if (!this.forceUpdate) {
                    this.currentItem = dispatchs[0][0];
                }
            } else {
                this.dispatchs = [];
                this.currentItem = null;
                this.driverTotal = 0;
                this.forceUpdate = null;
            }
            this.handleCarItem(this.currentItem);
        },
        getPanelHeader(warehouse) {
            const item = warehouse[0];
            const hasDiff = warehouse.find(el => el.queueType !== warehouse[0].queueType);
            const queueTypeValue = item.queueType === 0 ? '装车排队' : '卸车排队';
            return hasDiff ? '装/卸车排队' : queueTypeValue;
        }
    },
    watch: {
        dictData() {
            this.getVehicleList();
        }
    }
};
</script>

<style lang='less'>
.list-content {
    padding-right: 5px;
    .el-collapse-item__arrow {
        position: absolute;
        left: 0;
        margin-left: 10px;
    }
    .el-collapse-item__header {
        position: relative;
        padding-left: 25px;
        background-color: #fafafa;
        line-height: 22px;
        padding: 9px 0 9px 40px;
        color: rgba(0,0,0,.85);
        cursor: pointer;
        -webkit-transition: all .3s;
        -o-transition: all .3s;
        transition: all .3s;
        height: 22px;
        font-weight: normal;
        border: 0;
        border-top: 1px solid #f0f0f0;
        border-right: 1px solid #EBEEF5;
    }
    .el-collapse-item__wrap {
        border-bottom: 0;
        border-right: 1px solid #EBEEF5;
    }
    .el-collapse-item__content {
        padding-bottom: 0;
    }
    .el-collapse {
        border: 0;
    }
    .list-content-title {
        display: flex;
        justify-content: space-between;
    }
    .list-content-title-location {
        color: rgba(0,0,0,.85);
    }
    .list-content-title-sit {
        color: #999;
        position: absolute;
        right: 10px;
    }
    // 列表样式
    .car-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #EBEEF5;
        padding: 10px 16px;
        cursor: pointer;
        p {
            margin: 5px 0;
        }
    }
    .car-index {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background-color: #505050;
        line-height: 20px;
        text-align: center;
        color: #ffffff;
        margin-right: 8px;
    }
    .car-icon {
        flex: 1;
        display: flex;
    }
    .car-info {
        flex: 10
    }
    .car-status {
        flex: 3;
        p {
            text-align: right;
        }
    }
    .list-collapse {
        overflow-y: auto;
        height: calc(~ '100vh - 165px');
    }
    .table-pagination {
        margin: 10px;
    }
    .car-item-active {
        background: #e6fdff;
    }
    .car-status-error {
        color: #ff0000;
    }
    .car-status-primary {
        color: #00BCBF
    }
    .icon-Preferred {
        font-size: 18px;
        color: #00bcbf;
        line-height: 20px;
    }
    .icon-pass {
        font-size: 18px;
        color: #ff8800;
        line-height: 20px;
    }
}
</style>
