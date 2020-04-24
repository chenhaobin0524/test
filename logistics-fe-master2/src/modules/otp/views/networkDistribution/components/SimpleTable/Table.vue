<template>
    <el-table :data="tableData" border style="width: 100%" :height="tableConf.height">
        <el-table-column v-for="(item, key) in tableColumns" :key="key"
            :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    props: {
        tableConf: {
            type: Object,
            default() {
                return {};
            }
        },
        tableColumns: {
            type: Array,
            default() {
                return [];
            }
        },
        tableData: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {};
    }
};
</script>