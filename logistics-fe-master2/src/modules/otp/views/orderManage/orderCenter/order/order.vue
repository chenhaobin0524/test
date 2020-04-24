<template>
    <div id="order">
        <div class="order"  v-if="customerOrderInfo.excuteStatus===199">
            <ul class="orderElse">
                <li>订单号：{{orderNo}}</li>
                <!-- <li v-if="customerOrderInfo.deliveryTypeName">配送方式：{{customerOrderInfo.deliveryTypeName}}</li> -->
                <li style="width: 1200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    异常：
                    <el-tooltip class="item" effect="dark" placement="top-start" :content="log">
                        <span style="color: #F56C6C;font-weight: bold;">{{log}}</span>
                    </el-tooltip>
                </li>
            </ul>
        </div>
        <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
                <template slot="title">
                    <span style="font-size: 15px;">
                        商品信息
                         <strong class="selectColor" style="font-size: 14px;">
                            （总件数：{{customerOrderInfo.totalQty}}  &nbsp;&nbsp;&nbsp;&nbsp;总体积：{{customerOrderInfo.totalVolume + 'm³'}}
                            {{customerOrderInfo.orderValue ? '&nbsp;&nbsp;&nbsp;&nbsp;货值：'+customerOrderInfo.orderValue : ''}}）
                        </strong>
                    </span>
                </template>
                <dialogTable v-if="orderInfoItems[0]" :dialogTable="columns" :tableData="orderInfoItems[0].items"></dialogTable>
            </el-collapse-item>
            <el-collapse-item name="2" v-if="mOrderInfoDetails.length > 0">
                <template slot="title">
                    <span style="font-size: 15px;">系统拆分 {{mOrderInfoDetails.length}} 单</span>
                </template>
                <template v-for="(child,index) in mOrderInfoDetails">
                <div class="sheet"
                    :key="index + '1'"
                    v-if="child.orderInfo&&(!child.orderInfo.distributionFlag||child.orderInfo.distributionFlag+''!=='1')">
                    <div class='itemOrderBox' :key="index + '11'">
                        <div class="sign"></div>
                        <div class='itemOrder itemFirst'>子单号：<span class="childOrderNum">{{child.orderInfo.orderNo}}</span></div>
                        <div class='itemOrder'>运单号：<span class="childOrderNum"
                        >{{child.orderInfo.waybillNo}}</span></div>
                        <div class='itemOrder' v-if="child.orderInfo.scPosFlag===1">商超</div>
                        <div class='itemOrder' style="color: #F56C6C;" v-if="child.orderInfo.excuteStatus===998">已拦截</div>
                        <div class='itemOrder' v-else>订单状态：{{child.orderInfo.orderStatusName}}</div>
                        <div class='itemBtn' v-if="child.orderInfo.excuteStatus===199">
                            <el-button type='text' @click="cancelOrder(child.orderInfo, index)">取消分仓</el-button>
                        </div>
                        <div class='itemOrder'>任务号：<span class="childOrderNum">{{child.tasks&&child.tasks.length?child.tasks[0].taskNo:''}}</span></div>
                        <div class='itemOrder' v-if="!child.tasks&&!child.tasks.length">已预约：{{child.tasks&&child.tasks.length?child.tasks[0].appointmentTime:''}}</div>
                        <div class='itemOrder' v-if="child.orderInfo.whName">仓库：{{getFilterAddress(
                            [child.orderInfo.whName,child.orderInfo.distributionWhName,child.orderInfo.nextDistributionWhName],' > ')}}</div>
                    </div>
                    <ul class="order" v-if="child.tasks&&child.tasks.length" :key="index + '12'">
                        <li class="flex-box">
                            <div style="margin-left:10px;">时效：<span class="childOrderNum">{{agingProductName}}</span></div>
                            <div style="padding-right:20px;box-sizing:border-box;" v-if="child.orderInfo.networkName">
                                <span>网点：</span>
                                <el-tooltip class="item" effect="dark"
                                    :content="child.orderInfo.networkName+'/'+
                                    (child.orderInfo.networkContact?child.orderInfo.networkContact+' '+child.orderInfo.networkTel:'')+
                                    (child.orderInfo.networkAddr?'/'+child.orderInfo.networkAddr:'')"
                                    placement="bottom">
                                    <span>
                                        {{child.orderInfo.networkName}}
                                        <span v-if="child.orderInfo.networkContact">/</span>
                                        {{child.orderInfo.networkContact}} {{child.orderInfo.networkTel}}
                                        <span v-if="child.orderInfo.networkAddr">/</span>
                                        {{child.orderInfo.networkAddr}}
                                    </span>
                                </el-tooltip>
                            </div>
                            <!-- <div>状态：{{child.tasks.length?child.tasks[0].orderStatusName:''}}</div> -->
                            <div style="text-align:right">
                                <img src="@/assets/gps.png" v-if="child.tasks.length&&child.tasks[0].pickFlag+''==='0'"/>
                            </div>
                        </li>
                        <li class="flex_end">
                            <span class="detail" @click.stop="jumpDetail(child.tasks.length?child.tasks[0].taskNo:'')">详情</span>
                        </li>
                    </ul>
                </div>
                <div class="distributionOrder" v-if="child.orderInfo&&child.orderInfo.distributionFlag+''==='1'" :key="index + '2'">
                    <div class='itemOrderBox'>
                        <div class="sign"></div>
                        <div class='itemOrder itemFirst'>子单号：<span class="childOrderNum">{{child.orderInfo.orderNo}}</span></div>
                        <div class='itemOrder'>运单号：<span class="childOrderNum">{{child.orderInfo.waybillNo}}</span></div>
                        <div class='itemOrder' v-if="child.orderInfo.scPosFlag===1">商超</div>
                        <div class='itemOrder' style="color: #F56C6C;" v-if="child.orderInfo.excuteStatus===998">已拦截</div>
                        <div class='itemOrder' v-if="child.orderInfo.orderType === 'PO'">
                            订单已分拨，途径：{{getFilterAddress([child.orderInfo.whName,child.orderInfo.distributionWhName,child.orderInfo.nextDistributionWhName],' > ')}}
                        </div>
                        <div class='itemOrder' v-else>
                            订单已分拨，途径：{{getFilterAddress([child.orderInfo.nextDistributionWhName,child.orderInfo.distributionWhName,child.orderInfo.whName],' > ')}}
                        </div>
                        <div class='itemOrder'>{{child.orderInfo.oppintmentStatus===1?'已预约':'未预约'}}{{child.orderInfo.appointmentTime}}</div>
                    </div>
                    <ul>
                        <li style="margin-left:10px;">时效：<span class="childOrderNum">{{agingProductName}}</span></li>
                        <el-tooltip class="item" effect="dark"
                            :content="child.orderInfo.networkName+'/'+
                            (child.orderInfo.networkContact?child.orderInfo.networkContact+' '+child.orderInfo.networkTel:'')+
                            (child.orderInfo.networkAddr?'/'+child.orderInfo.networkAddr:'')"
                            placement="bottom">
                            <li class="text-ellipse">
                                网点：{{child.orderInfo.networkName}}
                                <span v-if="child.orderInfo.networkContact">/</span>
                                {{child.orderInfo.networkContact}} {{child.orderInfo.networkTel}}
                                <span v-if="child.orderInfo.networkAddr">/</span>
                                {{child.orderInfo.networkAddr}}
                            </li>
                        </el-tooltip>
                    </ul>
                </div>
                <div class="progress" :key="index + '3'">
                    <div v-if="child.orderInfo&&((child.orderInfo.distributionFlag&&child.orderInfo.distributionFlag+''==='1')|| child.orderInfo.orderType === 'DO')" class="marb">
                        <div v-for="(item,i) in child.tasks" :key="index + '31' +i">
                            <div>
                                <div class="progress_bar">
                                    <ul class="order" style="display: flex;" @click="clickEvent(item.taskNo,i,index)">
                                        <li>
                                            <div class="speed-box">
                                                <div class="line" :class="{opa:i === 0}"></div>
                                                <div class="speed" :class="{speedSelect:i===child.selectIndex}">
                                                    <p>{{i + 1}}</p>
                                                </div>
                                                <div class="line" :class="{opa:i === child.tasks.length-1}"></div>
                                            </div>
                                        </li>
                                        <li>{{item.taskTypeName}}：<span :class="{selectColor:i===child.selectIndex}">{{item.taskNo}}</span></li>
                                        <li>仓库：<span :class="{dark:i===child.selectIndex}">{{item.whName || '--'}}</span></li>
                                        <li :class="{yin:item.taskTypeName === '分拨入库'}">目的地：
                                            <el-tooltip effect="dark" :content="item.receiverDetailAddr" placement="bottom">
                                                <span :class="{dark:i===child.selectIndex}">{{item.receiverDetailAddr}}</span>
                                            </el-tooltip>
                                        </li>
                                        <li>
                                            <span>任务状态：<span :class="{dark:i===child.selectIndex}">{{item.orderStatusName}}</span></span>
                                            <!-- <img src="@/assets/accomplish.png"  /> -->
                                        </li>
                                        <li style="text-align:right;width:100px;"><img src="@/assets/gps.png" v-if="item.pickFlag+''==='0'"/></li>
                                        <li class="flex_end"><span class="detail" @click.stop="jumpDetail(item.taskNo)">详情</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <dialogTable :dialogTable="goodsColumns" :tableData="child.items"  :dbclick="true"></dialogTable>
                </div>
                </template>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import _ from '@/components/lots/utils';
import dialogTable from '../../../../components/dialog/dialogTable';
import { getTaskList, getLog, separateWarehouseCancel } from '../../../../api/orderCenter';

export default {
    data() {
        return {
            visible: false,
            mOrderInfoDetails: [],
            activeNames: ['2'],
            log: ''
        };
    },
    created() {
        this.mOrderInfoDetails = this.orderInfoDetails;
        this.getLog();
    },
    methods: {
        copyText(className, i) {
            var clickContent = document.querySelectorAll(className)[i].innerText;
            var input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', clickContent);
            input.setAttribute('readonly', 'readonly');
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            this.$message.success(`‘${input.value}’复制成功`);
        },
        showDialog() {
            this.$refs.dialog.setDayHeight('60px');
            this.visible = true;
        },
        getLog() {
            getLog({ orderNo: this.orderNo }).then(res => {
                if (res.code === '0') {
                    if (res.data.length) {
                        this.log = res.data[0].operateContent;
                    }
                }
            });
        },
        closeDialog(value) {
            // 点击确认或取消关闭弹框，返回的布尔值为：value.done
            this.visible = value.visible;
        },
        clickEvent(taskNo, i, index) {
            this.mOrderInfoDetails[index].selectIndex = i;
            getTaskList({ taskNo }).then(res => {
                if (res && res.code === '0') {
                    const task = this.mOrderInfoDetails[index].tasks.find(item => item.taskNo === taskNo);
                    res.data.list.forEach(item => {
                        item.whName = task.whName;
                    });
                    this.mOrderInfoDetails[index].items = res.data.list || [];
                }
            });
        },
        getFilterAddress(arr, sign = ' / ') {
            return arr.filter(item => item).join(sign);
        },
        jumpDetail(taskNo) {
            if (taskNo) {
                this.$router.push({
                    path: '/order-manage/task-detail',
                    query: { taskNo }
                });
            } else {
                this.$message.error('任务号为空，无法跳转详情');
            }
        },
        // 取消分仓
        async cancelOrder(orderInfo, index) {
            const res = await separateWarehouseCancel([orderInfo.orderNo]);
            if (res && res.code === '0') {
                this.$message.success('取消成功');
                this.mOrderInfoDetails.splice(index, 1);
            } else {
                this.$message.error(res.msg);
            }
        },
        sortByKey(array, key) { // (数组、排序的列)
            return array.sort(function(a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
    },
    props: {
        columns: Object,
        orderInfoDetails: {
            type: Array,
            default() {
                return [];
            }
        },
        orderInfoItems: {
            type: Array,
            default() {
                return [];
            }
        },
        customerOrderInfo: Object,
        orderNo: String,
        agingProductName: String
    },
    computed: {
        goodsColumns() {
            const temp = _.clone(this.columns);
            // temp.columns = [{
            //     label: '上游商品编码',
            //     prop: 'upperItemCode',
            //     width: '150'
            // }, ...this.columns.columns];
            temp.columns.splice(1, 1);
            return temp;
        }
    },
    watch: {
        orderInfoDetails(val) {
            if (val[0] && val[0].tasks && val[0].tasks.length >= 2) {
                // 对tasks，按id进行重新排序
                val[0].tasks = this.sortByKey(val[0].tasks, 'id');
            }
            if (val.length) {
                val.map(item => {
                    if (item.tasks && item.tasks.length) {
                        item.selectIndex = item.tasks.length;
                    } else {
                        item.tasks = [];
                    }
                });
            }
            this.mOrderInfoDetails = val;
            if (val[0] && this.mOrderInfoDetails.length > 0) {
                this.$nextTick(() => {
                    const childOrderNums = document.querySelectorAll('#order .childOrderNum');
                    for (let i = 0; i < childOrderNums.length; i++) {
                        childOrderNums[i].addEventListener('dblclick', (e) => {
                            e.stopPropagation();
                            this.copyText('#order .childOrderNum', i);
                        });
                    }
                });
            }
        }
    },
    components: { dialogTable }
};
</script>

<style lang="less">
#order {
    // margin: 0 12px;
    .marb{
        margin-bottom:8px;
    }
    .itemOrderBox{
        display: flex;
        align-items: center;
        .sign,.itemOrder{
            height:100%;
            display: inline-block;
        }
        .sign{
            width:4px;
            background:#56d5d6;
            margin-top:5px;
            height:14px;
        }
        .itemOrder{
            font-size: 14px;
            margin:5px 0 0 24px;
        }
        .itemFirst{
             margin:5px 0 0 6px;
        }
        .itemBtn{
            flex:1;
            display: flex;
            justify-content: flex-end;
            margin:5px 0 0 24px;
        }
    }
    .childOrderNum{
        cursor: pointer;
    }
    .dark {
        color: #000;
    }
    .selectColor {
        color: #56d5d6;
        font-weight: 600;
    }
    .order .flex-box{
        justify-content: flex-start;
        display: flex;
    }
    .order .flex-box > div{
        padding-right:24px;
        box-sizing: border-box;
    }

    .line {
        border-left: 2px solid #56d5d6;
        height: 11px;
        margin-left: 10px;
    }

    .progress {
        border: 1px solid #f2f2f2;
        margin-bottom: 25px;
    }

    // .sheet {
    //     margin: 10px 0;
    // }

    .speed-box {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        // align-items: center;
        height: 100%;
        box-sizing: border-box;

        .speed {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #29cacb;
            text-align: center;
            background-color: #e5f8f8;

            p {
                line-height: 20px;
                margin: 0;
            }
        }
        .speedSelect {
            background-color: #29cacb;
            p {
                color: #fff;
            }
        }
    }

    .sheet img {
        width: 15px;
        height: 15px;
    }
    .sheet .order{
        display: flex;
        justify-content: space-between;
    }
    .sheet .order li {
        list-style: none;
        font-size: 14px;
        color: #9a9a9a;
        white-space:nowrap;
        overflow:hidden;
        text-overflow: ellipsis;

        &:first-child {
            width: 85%;
            border-bottom: none;
        }
        &:last-child {
            width: 15%;
            color: #3dcecf;
            text-align:right;
        }
    }
    .orderElse{
        padding-left: 12px;
        display: flex;
        justify-content: flex-start;
    }
    .orderElse li{
        list-style: none;
        min-width: 180px;
        font-size: 12px;
        display: inline-block;
        color: #9a9a9a;
        border-bottom: 1px solid #f2f2f2;
        box-sizing: border-box;
        white-space:nowrap;
        overflow:hidden;
        &:nth-child(2){
            padding-left:30px;
        }
    }
    .progress_bar img {
        width: 15px;
        height: 15px;
    }
    .distributionOrder {
        padding-bottom:12px;
        ul{
            display: flex;
            justify-content: flex-start;
            font-size: 14px;
            color:#9a9a9a;
            li{
                padding-right: 24px;
                box-sizing: border-box;
            }
        }
    }
    .progress_bar .order li {
        list-style: none;
        font-size: 12px;
        display: inline-block;
        color: #9a9a9a;
        border-bottom: 1px solid #f2f2f2;
        box-sizing: border-box;
        white-space:nowrap;
        overflow:hidden;
        &:first-child {
            width: 3%;
            border-bottom: none;
            min-width: 25PX;
        }

        &:nth-child(2) {
            width: 210px;
            min-width: 200PX;
        }

        &:nth-child(3) {
            min-width: 120px;
            width: 150px;
        }

        &:nth-child(4) {
            width: 550px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &:nth-child(5) {
            width: 15%;
        }

        &:nth-child(6) {
            width: 10%;
        }

        &:last-child {
            width: 16%;
            color: #3dcecf;
            display:flex;
        }
    }
    .progress_bar .order .yin{
       font-size: 0px;
    }
   .flex_end{
        display:flex;
        justify-content: flex-end;
    }
    .detail {
        padding: 0px 25px;
        cursor: pointer;
    }

    .opa {
        opacity: 0;
    }

    .order,.orderElse {
        height: 32px;
        line-height: 32px;
    }
    .el-collapse-item__header {
        height: 42px;
        line-height: 42px;
    }
    .text-ellipse {
        width: 450px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>