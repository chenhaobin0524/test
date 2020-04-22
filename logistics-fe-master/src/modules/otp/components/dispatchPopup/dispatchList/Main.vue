<template>
    <el-dialog :width="tableWidth" :title="title" :visible.sync="visible" :before-close="handleClose" class='content'>
        <el-table :data="tableData" border :max-height="400" >
            <el-table-column
                type="index"
                label="序号"
                width="80"
                header-align="center"
                align="center"
            ></el-table-column>
            <el-table-column
                v-for="(item, index) in items" :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :show-overflow-tooltip="true"
                align="center"></el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array
        },
        items: {
            type: Array
        },
        title: {
            type: String
        },
        tableWidth: {
            type: [Number, String],
            default() {
                return '60%';
            }
        }
    },
    data() {
        return {
            data: []
        };
    },
    methods: {
        handleClose() {
            // this.visible = false;
            this.$emit('handleClose', '');
        }
    },
    mounted() {
        this.data = this.tableData;
    }
};
</script>

<style lang="less">
.content .el-dialog__body{
// padding:none;
 padding: 0 0 22px 0 !important;
}
</style>