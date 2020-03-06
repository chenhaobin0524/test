<template>
    <div>
        <div class="process-head">审批记录</div>
        <m-table
        ref="table"
        :totalDate="config.table"
        :tableData="totalData"
        :loading="false"
        :tableList='tableList'
        @onSelectionChange="selectChange"
        @row-db-click="rowDBclick"
        @column-filter-search="columnFilterSearch"
        ></m-table>
    </div>
</template>
<script>
import mTable from '@/components/awesome/page/mPanel3/mTable';

export default {
    components: { mTable },
    props: {
        infoConfig: {
            type: Object,
            default() {
                return {};
            }
        },
        tableData: {
            type: Array,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            config: this.infoConfig,
            totalData: this.tableData,
            tableList: ''
        };
    },
    methods: {
        getTableTitle() {
            let laberString = [];
            this.config.table.columns.map(data => {
                laberString.push(data.label);
            });
            laberString = laberString.join(',');
            this.tableList = laberString;
        },
        selectChange(selection) {
            this.$emit('selectChange', selection);
        },
        rowDBclick(row) {
            this.$emit('rowDBclick', row);
        },
        columnFilterSearch(data) {
            this.$emit('columnFilterSearch', data);
        }
    },
    mounted() {
        this.getTableTitle();
    },
    watch: {
        tableData(newVal) {
            this.totalData = newVal;
        }
    }
};
</script>
<style lang="less">
.process-head{
    font-size: 15px;
    font-weight:bold;
    margin: 10px 0;
}
</style>
