<template>
    <el-dialog
        title="明细"
        :visible="true"
        :before-close="beforeClose"
        width="700px">
        <el-table
            style="width: 100%"
            :data="tableData"
            border
            tooltip-effect="dark"
            v-loading='loading'
            max-height="260">
            <el-table-column :show-overflow-tooltip='true' prop="overdueTypeText" label="逾期类型"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="overdueReasonText" label="逾期一级原因"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="overdueReasDetailText" label="逾期二级原因"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="overdueDesc" label="逾期描述"></el-table-column>
        </el-table>
        <div slot="footer">
            <el-button @click="beforeClose">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { receiptSearchoverdue } from '../../../api/receiptSign';
export default {
    props: {
        overdueCauseTypeOptions: {
            type: Object,
            default() {
                return {};
            }
        },
        listOverdueShow: {
            type: Boolean,
            default() {
                return false;
            }
        },
        overdueTypeOptions: {
            type: Array,
            default() {
                return [];
            }
        },
        rowData: {
            type: Object,
            default() {
                return {};
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
            this.$emit('update:listOverdueShow', false);
        },
        getData() {
            this.loading = true;
            receiptSearchoverdue(this.rowData.taskNo).then(res => {
                if (res) {
                    res.data.list.forEach(item => {
                        this.overdueTypeOptions.find(item2 => {
                            if (item2.value === item.overdueType) {
                                item.overdueTypeText = item2.label;
                                return true;
                            }
                        });
                        this.overdueCauseTypeOptions[item.overdueType].find(item2 => {
                            if (item2.value === item.overdueReason) {
                                item.overdueReasonText = item2.label;
                                item2.children.find(item3 => {
                                    if (item3.value === item.overdueReasDetail) {
                                        item.overdueReasDetailText = item3.label;
                                        return true;
                                    }
                                });
                                return true;
                            }
                        });
                    });
                    this.tableData = res.data.list || [];
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    created () {
        this.getData();
    }
};
</script>
