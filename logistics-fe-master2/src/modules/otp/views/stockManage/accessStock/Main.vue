<template>
    <paper id="agingProduct">
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :loading="loading"
            :initSearchInfo="initSearchInfo"
            @saveData="saveData"
            @row-db-click="rowDBclick"
            @check-btn="checkBtn"
            @edit-btn="editBtn"
            @switch-change="switchChange"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            searchId="test"
            pageID="test"
            class="accessStock"
        >
         <div slot="page-module-btn">
                <span v-has="'02010003'"><el-button type="primary" @click="rePush">重 推</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { getOrderConfirms, orderConfirmList } from '../../../api/stockManage';
import formatTime from '@/utils/common.js';
export default {
    components: { mPane, paper },
    data() {
        return {
            config: config,
            totalData: [],
            loading: false,
            pageTotal: 10,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            initSearchInfo: {}
        };
    },
    methods: {
        async getList() {
            getOrderConfirms(this.searchParams).then(res => {
                if (res) {
                    if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                        this.searchParams.pageNo = res.data.totalPage;
                        this.getList();
                    } else {
                        this.totalData = res.data.list || [];
                        this.pageTotal = res.data.totalCount;
                    }
                } else {
                    this.totalData = [];
                }
            });
        },
        rowDBclick(row) {
            // 表格内双击事件
            this.$router.push({
                query: { orderNo: row.orderNo, apartStatus: row.apartStatus },
                path: '/order-manage/order-detail'
            });
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
            this.visible = true;
        },
        editBtn(data) {
            // 表格内按钮修改事件;
        },
        selectChange(data) {
            // 表格内选择变化
            this.selectRow = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            if (!data.customerOrderNo && !data.createTime) {
                this.$message.warning('客户订单号 或 时间不可为空！');
                return;
            }
            if (data.createTime && data.createTime.length > 0) {
                data.beginTimeDate = formatTime.formatDateTime(data.createTime[0]);
                data.endTimeDate = formatTime.formatDateTime(data.createTime[1]);
            } else if (!data.createTime) {
                data.beginTimeDate = '';
                data.endTimeDate = '';
            }
            delete data.createTime;
            this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
            this.getList();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.getList();
        },
        addData() {
            // 表格新增方法
        },
        saveData(data) {
            // 表格新增修改后返回数据
        },
        redomet(data) {
            // 这是删除方法
        },
        refresh() {
            // 表格内刷新按钮
        },
        // 重推
        rePush() {
            if (!this.selectRow) {
                this.$message.error('请先选择数据！');
                return;
            }
            const status = {
                orderStatus: '10'
            };
            const list = this.selectRow.map(item => {
                return { ...status, id: item.id, processCount: 0 };
            });
            orderConfirmList(list).then(res => {
                if (res.code === '0') {
                    this.$message.success('重推成功！');
                    this.getList();
                }
            });
        }
    },
    beforeRouteEnter (to, from, next) {
        if (from.path === '/order-manage/order-center' || from.path === '/order-manage/order-detail') {
            next(vm => {
                if (vm.$route.params.customerOrderNo) {
                    vm.initSearchInfo = { ...vm.$route.params };
                    vm.searchParams = { ...vm.searchParams, ...vm.initSearchInfo, pageNo: 1 };
                    vm.getList();
                }
            });
        } else {
            next();
        }
    }
};
</script>
<style lang="less">
#gridData {
    .el-dialog__body {
        padding: 10px 20px;
    }

    .table-btn {
        margin: 0 5px;
        color: #00a9ac;
        cursor: pointer;
    }
}
.accessStock {
    .el-pager {
        & > .number {
            display: none;
            &.active {
                display: inline-block;
            }
        }
        & > .more {
            display: none;
        }
    }
}
</style>