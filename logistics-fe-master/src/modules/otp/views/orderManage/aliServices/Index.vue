<template>
    <Paper class="outbound-manage">
        <m-panel
        ref="tablePage"
        :config="config"
        :totalData="totalData"
        :pageTotal="pageTotal"
        :loading="tableLoading"
        :searchTotalTitle="searchTotalTitle"
        @check-btn="editBtn"
        @selectChange="selectChange"
        @searchChange="searchChange"
        @edit-btn="editBtn"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
        pageID="gw_out_order"
        searchId="gw_out_order_query"
        optionNum="SYS_GW_CUST_ORDER_TPYE_OUT,SYS_WM_SO_STATUS">
            <div slot="table-module-btn">
                <el-tooltip effect='dark' content='导出' placement='bottom'>
                    <el-button icon='el-icon-upload2' size='mini'></el-button>
                </el-tooltip>
                <!-- <el-tooltip effect='dark' content='刷新' placement='bottom'>
                    <el-button icon='el-icon-refresh' size='mini'></el-button>
                </el-tooltip> -->
            </div>
        </m-panel>
    </Paper>
</template>

<script>
import Paper from '@/components/core/paper/Paper';
import mPanel from '@/components/otpPanel';
import config from './config.json';
import { getValueAddedServices } from '../../../api/orderManage';
import { outbound } from './outbound.js';
import pickingConfig from './pickingConfig.json';
import { dateTimes } from '../../../judge/configCenter';

export default {
    name: 'alibabaServices',
    components: { mPanel, Paper },
    data() {
        return {
            config: config,
            totalData: [], // tb数据
            pageTotal: 0, // total
            searchQuery: {
                pageSize: config.page.pageSize,
                pageNo: config.page.pageNo
            },
            searchParams: {
                pageNo: 1,
                pageSize: 10
            },
            tableLoading: false,
            refreshLoading: false,
            searchTotalTitle: outbound.searchTotalTitle,
            selected: [],
            orderStatus: [],
            review: {},
            pickingConfig: pickingConfig,
            pickingInfoTableData: [],
            pickingCheckedNum: 0,
            pickingVisible: false,
            soNos: '',
            RelationOrderVisible: false,
            formRelationOrder: {
                relationOderNo: '',
                status: ''
            }
        };
    },
    methods: {
        checkBtn(data) {},
        selectChange(data) {
            this.selected = [].concat(data);
        },
        // 修改的回调
        editBtn(data) {
            this.$router.push({ path: `/order-manage/alibaba-services/edit/${data.vdOrderNo}`, query: { status: data.orderStatus } });
        },
        // 查询回调
        searchChange(data) {
            let createStartTime, createEndTime;
            if (data.createTime && data.createTime.length) {
                createStartTime = dateTimes(data.createTime[0]);
                createEndTime = dateTimes(data.createTime[1]);
                delete data.createTime;
            }
            this.searchParams = { pageNo: 1, pageSize: 10 };
            this.searchParams = { ...this.searchParams, ...data, createStartTime, createEndTime };
            this.getList();
        },
        pageChange(data) {
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            this.searchParams.pageSize = data;
            this.getList();
        },
        getList() {
            getValueAddedServices(this.searchParams).then(res => {
                if (res.code === '0') {
                    res.data.list.map(item => {
                        item.hiddenEvent = ['view'];
                        if (item.orderStatus + '') {
                            item.orderStatus = item.orderStatus + '';
                            // if (item.orderStatus === '50' || item.orderStatus === '60') {
                            //     item.hiddenEvent = ['edit'];
                            // }
                            if (item.orderStatus !== '10') {
                                item.hiddenEvent = ['edit'];
                            }
                        }
                        if (item.contracterPhone && item.contracterName) {
                            item.contracterName = item.contracterName + ' / ' + item.contracterPhone;
                        }
                    });
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
            });
        },
        handlePicking() {
            if (this.selected.length !== 1) {
                this.$message.warning('只能选中一条数据');
                return;
            };
            this.pickingVisible = true;
            const soNos = [];
            this.selected.map(item => {
                soNos.push(item.soNo);
            });
            this.soNos = soNos.join(',');
        }
    },
    created() {
        this.getList();
    }
};
</script>
<style lang="less">
    .outbound-manage {
        .more-dropdown {
            margin-left: 10px;
        }
        .review {
            margin-right: 60px;
        }
        .el-dialog__body {
            padding-bottom: 2px;
            padding-top: 0;
        }
        .el-dialog__header {
            padding: 16px 20px;
        }
    }
</style>
