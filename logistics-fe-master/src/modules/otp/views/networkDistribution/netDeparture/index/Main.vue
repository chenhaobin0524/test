<template>
    <paper class="net-departure">
        <m-pane
            ref="tablePage"
            :config="config"
            :pageTotal="pageTotal"
            :loading="loading"
            :totalData="totalData"
            :searchTotalTitle="config.searchTotalTitle"
            searchId="netDepartureQuery"
            pageID="netDeparture"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            @check-btn="checkBtn"
            @row-db-click="rowDBclick"
        >
            <div slot="page-module-btn">
                <span v-has="'10040001'"><el-button type="primary" @click="handlePush">推 送</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import config from './config.js';
import mPane from '@/components/otpPanel';
import paper from '@/components/core/paper/Paper';
import { getLists, push } from '../../../../api/netDeparture.js';
import formatTime from '@/utils/common.js';
export default {
    name: 'netDeparture',
    components: { mPane, paper },
    data() {
        return {
            config,
            loading: false,
            pageTotal: 0,
            totalData: [],
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            inOutType: '',
            selectRow: []
        };
    },
    methods: {
        selectChange(data) {
            this.selectRow = data;
        },
        load() {
            this.getList();
        },
        getList() {
            this.loading = true;
            getLists(this.searchParams).then(res => {
                this.loading = false;
                if (res && +res.code === 0) {
                    this.totalData = res.data.list || [];
                    this.totalData.map(item => {
                        if (+item.pushBmsStatus === 0) {
                            item.pushBmsStatusName = '未推送';
                        } else if (+item.pushBmsStatus === 1) {
                            item.pushBmsStatusName = '成功';
                        } else if (+item.pushBmsStatus === 2) {
                            item.pushBmsStatusName = '失败';
                        } else {
                            item.pushBmsStatusName = item.pushBmsStatus;
                        }
                        if (item.inOutType === 'IN') {
                            item.inOutTypeName = '入库单';
                        } else if (item.inOutType === 'OUT') {
                            item.inOutTypeName = '出库单';
                        } else {
                            item.inOutTypeName = item.inOutType;
                        }
                    });
                    this.pageTotal = res.data.totalCount;
                }
            }).catch(() => {
                this.loading = false;
            });
        },
        searchChange(data) {
            if (data.createTime && data.createTime.length > 0) {
                data.startCreateTime = formatTime.formatDateTime(data.createTime[0]);
                data.endCreateTime = formatTime.formatDateTime(data.createTime[1]);
            } else if (!data.createTime) {
                data.startCreateTime = '';
                data.endCreateTime = '';
            }
            delete data.createTime;
            this.searchParams = {
                ...this.searchParams,
                ...data
            };
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
        checkBtn() {},
        rowDBclick(row) {
            this.$router.push({
                query: {
                    dispatchInventedNo: row.dispatchInventedNo,
                    inOutType: row.inOutType,
                    pushBmsStatus: row.pushBmsStatus
                },
                path: '/net-departure-details'
            });
        },
        handlePush() {
            const data = this.selectRow;
            if (!data.length) {
                this.$message.warning('请至少选择一项');
                return;
            }
            const dispatchInventedNoList = [];
            data.map(item => {
                if (item.dispatchInventedNo) {
                    dispatchInventedNoList.push(item.dispatchInventedNo);
                }
            });
            if (dispatchInventedNoList.length === 0) {
                this.getList();
                return;
            }
            push(dispatchInventedNoList).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '推送成功',
                        type: 'success'
                    });
                    this.getList();
                }
            });
        }
    },
    mounted() {
        this.load();
    },
    activated() {
        this.load();
    }
};
</script>
<style lang="less">
</style>