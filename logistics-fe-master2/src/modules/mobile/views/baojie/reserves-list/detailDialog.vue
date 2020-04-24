<template>
    <!-- 编辑弹框 -->
    <el-dialog
        :closeOnClickModal='false'
        :before-close="beforeClose"
        title="详情"
        :visible.sync="visible"
        width="70%">
        <div style="font-size: 13px; margin-bottom: 10px;">
            预约ID：
            {{currentRow.bookingId}}
        </div>
        <el-table
            :data="tableData"
            style="width: 100%;"
            v-loading='loading'
            border>
            <el-table-column prop="deliveryNo" label="交货号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalVolume" label="总体积m³" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalWeight" label="总重量kg" show-overflow-tooltip></el-table-column>
            <el-table-column prop="numberOfUnits" label="总数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="requirArrivTime" label="要求送货时间" show-overflow-tooltip></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="beforeClose">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import api from '@/modules/mobile/api/njdc/njdc.js';

export default {
    props: {
        currentRow: {
            type: Object,
            default: () => {
                return {};
            }
        },
        visible: {
            type: Boolean,
            default: () => {
                return false;
            }
        }
    },
    data() {
        return {
            tableData: [],
            loading: false
        };
    },
    methods: {
        beforeClose() {
            this.$emit('update:visible', false);
        },
        getDataList() {
            this.loading = true;
            api.bookingDetails(this.currentRow.bookingId).then(res => {
                if (res) {
                    this.tableData = res.data;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
                this.beforeClose();
            });
        }
    },
    created () {
        this.getDataList();
    }
};
</script>

<style lang="less">

</style>