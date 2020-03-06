<template>
    <div class="dialogTable">
        <slot name="myHeader"></slot>
        <el-table
            border
            style="width:100%;"
            :data="dialogTable.isPagination?paginationTableData[currentPage-1]:tableData"
            @selection-change="selectionChange"
        >
            <el-table-column type="selection" width="36" v-if="dialogTable.selection" fixed="left"></el-table-column>
            <el-table-column
                v-for="(column,index) in dialogTable.columns"
                :key="index"
                :label="column.label"
                :property="column.prop"
                :fixed="column.fixed"
                :width="column.width"
                :show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.editRow">
                        <el-select
                            v-if="column.type==='select'"
                            v-model="scope.row[column.prop]"
                            @change="change(scope,column.prop)"
                            :clearable="true"
                            :class="{showMustFill:scope.row.showMustFill&&column.mustFill&&canShow(scope.row,column)}"
                        >
                            <el-option
                                v-for="(item,index) in column.options"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                        <otpAdvance v-else-if="column.type==='advance'" :params="column"></otpAdvance>
                        <el-input
                            v-model="scope.row[column.prop]"
                            @change="change(scope,column.prop)"
                            :class="{showMustFill:scope.row.showMustFill&&column.mustFill&&canShow(scope.row,column)}"
                            v-else
                        ></el-input>
                    </div>
                    <template v-else>{{dataShow(scope.row[column.prop],column,scope)}}</template>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                :fixed="dialogTable.action.fixed"
                v-if="dialogTable.action && dialogTable.btnActive"
                :width="dialogTable.action.width"
            >
                <template slot-scope="scope">
                    <div>
                        <el-button
                            type="text"
                            v-for="(item,index) in dialogTable.action.list"
                            :key="index"
                            @click="handleTableData(item.event,scope.row,scope.$index+(pageSize*(currentPage-1)))"
                        >{{item.text}}</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <slot name="myFooter"></slot>
        <div class="block dialogTablePagination" v-if="dialogTable.isPagination">
            <el-pagination
                class="table-pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5,10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="tableData.length"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import otpAdvance from '@/components/lots/otpAdvance';
import { dictWithUrl } from '@/components/otpPanel/api';
export default {
    data() {
        return {
            pageSize: 5,
            currentPage: 1,
            paginationTableData: [],
            mTableData: []
        };
    },
    props: {
        tableData: Array,
        dialogTable: Object
    },
    components: { otpAdvance },
    created() {
        this.getDictionary();
        this.dataInit();
        this.mTableData = this.tableData;
    },
    watch: {
        mTableData() {
            this.mTableData = this.tableData;
        },
        tableData() {
            this.dataInit();
        },
        pageSize() {
            this.dataInit();
        }
    },
    methods: {
        canShow(row, column) {
            return !(row[column.prop] || row[column.prop].length || row[column.prop] === 0);
        },
        getDictionary() {
            this.dialogTable.columns.map((item, index) => {
                if (item.type === 'select' && item.optionNum) {
                    const arr = [];
                    dictWithUrl(item.optionNum).then(res => {
                        if (res.code === '0') {
                            for (const key in res.data[item.optionNum]) {
                                if (
                                    res.data[item.optionNum].hasOwnProperty(key)
                                ) {
                                    arr.push({
                                        value: key,
                                        label: res.data[item.optionNum][key]
                                    });
                                }
                            }
                        }
                    });
                    item.options = arr;
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        selectionChange(selection) {
            if (this.dialogTable.selection) {
                this.mTableData = selection;
            }
        },
        change(data, key) {
            if (!this.mTableData[data.$index]) {
                this.mTableData[data.$index] = {};
            }
            if (this.dialogTable.isPagination) {
                this.mTableData[this.pageSize * (this.currentPage - 1) + data.$index][key] = data.row[key];
            } else {
                this.mTableData[data.$index][key] = data.row[key];
            }
        },
        getDialogTableData() {
            return this.tableData;
        },
        tableShowMustFill() {
            let flag = false;
            this.dialogTable.columns.map(child => {
                if (child.mustFill) {
                    this.tableData.map((item, index) => {
                        if (!(item[child.prop] || item[child.prop.length])) {
                            this.tableData[index].showMustFill = true;
                            this.dataInit();
                            flag = true;
                        } else {
                            this.tableData[index].showMustFill = false;
                            this.dataInit();
                        }
                    });
                }
            });
            return flag;
        },
        dataInit() {
            if (this.dialogTable.isPagination) {
                const tableData = [];
                let arr = [];
                this.tableData.map((item, index) => {
                    arr.push(item);
                    if (
                        (index + 1) % this.pageSize === 0 ||
                        index === this.tableData.length - 1
                    ) {
                        tableData.push(arr);
                        arr = [];
                    }
                });
                this.paginationTableData = tableData;
            }
        },
        addRow() {
            let flag = false;
            // this.tableData.map(item => {
            //     delete item.editRow;
            // });
            for (const key in this.tableData[this.tableData.length - 1]) {
                if (this.tableData[this.tableData.length - 1].hasOwnProperty(key)) {
                    if (this.tableData[this.tableData.length - 1][key] && this.tableData[this.tableData.length - 1][key] !== 0) {
                        flag = true;
                    }
                }
            }
            if (!flag && this.tableData.length !== 0) {
                this.$message.error('新增行数据不能为空');
                this.tableData[this.tableData.length - 1].editRow = true;
                return;
            }
            const obj = {};
            this.dialogTable.columns.map((item, index) => {
                obj[item.prop] = '';
            });
            obj.editRow = true;
            this.tableData.push(obj);
            this.currentPage = Math.ceil(this.tableData.length / this.pageSize);
        },
        dataShow(value, column, row) {
            let str = '';
            if (column.type === 'select' && column.options.length) {
                column.options.map(item => {
                    if (item.value === value + '') {
                        str = item.label;
                    }
                });
            } else {
                str = value;
            }
            return str;
        },
        handleTableData(event, row, index) {
            // 按钮事件
            if (event === 'delete') {
                this.$emit('dialogDelRow', row, index, this.tableData);
                this.currentPage = Math.ceil(
                    this.tableData.length / this.pageSize
                );
            } else if (event === 'edit') {
                this.tableData.map(item => {
                    delete item.editRow;
                });
                this.tableData[index].editRow = true;
                this.dataInit();
            }
        }
    }
};
</script>

<style lang="less">
.dialogTable {
    .dialogTablePagination {
        padding-top: 20px;
        position: absolute;
        .table-pagination{
            float: left;
            padding: 0;
            .btn-prev, .btn-next, .el-pager li {
                background-color: #ffffff !important;
                border: 1px solid #cccccc;
                border-radius: 4px !important;
                padding:0;
                min-width: 30px;
                margin-right:4px;
            }
            .el-pager li.active + li {
                border-left: 1px solid #cccccc;
            }
            .el-pager li:not(.disabled).active{
                background-color: #00BCBF !important;
                border: 1px solid #00BCBF;
                color:#ffffff;
            }
        }
    }
    .showMustFill {
        .el-input__inner {
            border: 1px solid #f00;
        }
    }
    .el-table .cell {
        padding-left: 8px;
        padding-right: 8px;
    }
}
</style>
