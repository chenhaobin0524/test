<template>
    <div id="expand-table-Cont">
        <el-table :data="tableData" :max-height="120">
            <el-table-column show-overflow-tooltip v-for="(item, index) in columnsList" :key="index"
                :prop="item.prop" :label="item.label" :width="item.width">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getTabelExpandDetail } from '../../../../api/dispatchCenter.js';
export default {
    props: {
        columnsList: {
            type: Array,
            default() {
                return [];
            }
        },
        contentTableData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            tableData: []
        };
    },
    created() {
        const params = {
            taskNo: this.contentTableData.taskNo
        };
        getTabelExpandDetail(params).then(res => {
            if (res && res.data) {
                this.tableData = [].concat(res.data.list);
                this.tableData.map(item => {
                    if (item.volume) {
                        item.volume = '' + item.volume + 'm³';
                    }
                    if (item.weight) {
                        item.weight = '' + item.weight + 'Kg';
                    }
                    if (item.unit) {
                        item.unitQty = '' + item.planQty + item.unit;
                    } else {
                        item.unitQty = '' + item.planQty;
                    }
                });
            }
        });
    }
};
</script>
<style lang="less">
    // 同时设置:show-header="false"，:max-height="120" 会有issue https://github.com/ElemeFE/element/pull/16956
    #expand-table-Cont {
        thead {
            display: none;
        }
    }
</style>