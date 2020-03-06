<template>
    <div id="transTable">
        <el-dialog title="穿梭表格" :visible.sync="visible" width="80%" :before-close="handleClose">
            <div class="tableList">
                <div class="leftTable">
                    <Table ref="leftTable" :leftColumns="leftColumns" :tableData="leftTableData" :tableType="'left'" @selectChange="selectChange"></Table>
                </div>
                <div class="rightTable">
                    <Table :leftColumns="leftColumns" :tableData="rightTableData" :tableType="'right'" @deleteRow="deleteRow"></Table>
                </div>
            </div>
             <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveData">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Table from './table.vue';
export default {
    data() {
        return {
            visible: false,
            rightTableData: []
        };
    },
    props: {
        leftColumns: Array,
        leftTableData: Array,
        sign: String
    },
    components: { Table },
    methods: {
        handleClose() {
            this.visible = false;
        },
        showDialog() {
            this.visible = true;
        },
        selectChange(data) {
            this.rightTableData = data.selection;
        },
        deleteRow(row) {
            this.rightTableData.map((item, index) => {
                if (item[this.sign] === row[this.sign]) {
                    this.rightTableData.splice(index, 1);
                }
            });
            this.leftTableData.map((item, index) => {
                if (item[this.sign] === row[this.sign]) {
                    this.$refs.leftTable.$refs.table.toggleRowSelection(this.leftTableData[index]);
                }
            });
        },
        saveData() {
            this.$emit('addDialogTableData', this.rightTableData);
            this.rightTableData = [];
            this.leftTableData.map((item, index) => {
                this.$refs.leftTable.$refs.table.toggleRowSelection(this.leftTableData[index], false);
            });
            this.handleClose();
        },
        cancel() {
            this.handleClose();
        }
    }
};
</script>

<style lang="less">
    #transTable{
        .tableList{
            display: flex;
        }
        .leftTable{
            width:50%;
            border-right:1px solid #eee;
            box-sizing: border-box;
            padding:0 16px;
        }
        .rightTable{
            width:50%;
            padding:0 16px;
        }
    }
</style>
