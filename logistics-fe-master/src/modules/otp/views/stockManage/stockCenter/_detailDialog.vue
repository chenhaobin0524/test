<template>
    <div>
        <el-dialog
            title="查看库存预占记录"
            :visible.sync="dialogVisible"
            width="800px">
            <el-table
                :data="tableData"
                border
                height="400"
                style="width: 100%">
                <el-table-column
                    align="center"
                    v-for="(header, index) in tableHeader"
                    :key="header.prop + index"
                    :prop="header.prop"
                    :label="header.label"
                    :width="header.width">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="header.type === 'link'" @click="goTaskDetail(scope.row[header.prop])">{{scope.row[header.prop]}}</el-button>
                        <span v-else style="color: #999;">
                            {{scope.row[header.prop]}}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import moment from 'moment';
// import _ from '@/components/lots/utils';
import config from './_detailDialogConfig';
import { lmsCenterStockQuery } from '../../../api/stockManage';
export default {
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            tableHeader: config.table.header
        };
    },
    methods: {
        async show(status = true, data) {
            this._dataReset();
            const { ownerCode, siteCode, whCode, itemCode, custItemCode, itemStatus } = data;
            const res = await lmsCenterStockQuery({
                customerCode: ownerCode,
                siteCode,
                whCode,
                itemCode,
                customerItemCode: custItemCode,
                itemStatus
            });
            if (res.code === '0') {
                this.tableData = res.data.items ? res.data.items.map(val => {
                    val.createTime = moment(val.createTime).format('YYYY-MM-DD  HH:mm:ss');
                    return val;
                }) : [];
            }
            this.dialogVisible = status;
        },
        goTaskDetail(orderNo) {
            this.dialogVisible = false;
            this.$router.push({
                query: { orderNo, apartStatus: '' },
                path: '/order-manage/order-detail'
            });
        },
        _dataReset() {
            this.tableData = [];
        }
    }
};
</script>
<style lang="less">
.comp-container{
    .stock-adjust_detail_form {
        .el-form-item{
            margin-bottom: 15px;
            &.view {
                margin-bottom: 0;
            }
        }
        .el-form-item__content {
            .el-input-group {
                vertical-align: middle;
            }
        }
    }
    .el-table {
        .cell {
            >.el-input {
                overflow: initial;
            }
        }
    }
}
</style>