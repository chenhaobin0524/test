<template>
    <el-dialog :width="tableWidth" :title="title" v-if="visible" :visible.sync="visible" :before-close="handleClose" class='order-filter-log'>
        <div class="filter-list">
            <div class="filter-list-title">
                <span class="title">订单号</span>
                <ul class="table-lists">
                    <li class="filter-list-details" v-for="(item, index) in filterList" :key="index"
                    @click="fliterListClick(item, index)" @dblclick="dblclick(item)"
                    :class="{'active' : clickIndex === index ? true : false}">{{item}}</li>
                </ul>
            </div>
            <el-table class="filter-table" :data="data" border :height="400" highlight-current-row
                :row-class-name="tableRowClassName" :row-key="getRowKeys" ref='moduleTable'
                @cell-dblclick="cellDBlclick" @selection-change="handleSelectionChange"
                @row-click='rowClick'>
                <!-- <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orderNo" label="订单号" show-overflow-tooltip
                    width="180" align="center"></el-table-column> -->
                <el-table-column prop="taskNo" label="任务号" show-overflow-tooltip
                    width="180" align="center"></el-table-column>
                <el-table-column prop="operateName" label="操作类型" show-overflow-tooltip
                    width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                            size="mini" v-if="scope.row.operateType === 'APART' || scope.row.operateType === 'OUTINCONFIRM'"
                            @click.stop="logJumpBtn(scope.row.operateType)">
                            {{scope.row.operateName}}
                        </el-button>
                        <template v-else>{{scope.row.operateName}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="operateContent" label="操作内容" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="createUserCode" label="创建人" show-overflow-tooltip
                    width="180" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip
                    width="180" align="center"></el-table-column>
            </el-table>
        </div>
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
        },
        logJumpParams: {
            type: Object,
            default() {
                return {};
            }
        },
        logOrderNo: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            data: this.tableData,
            headerFilterNames: {},
            tableHeaders: [
                { prop: 'orderNo', label: '订单号' },
                { prop: 'taskNo', label: '任务号' },
                { prop: 'operateName', label: '操作类型' },
                { prop: 'operateContent', label: '操作内容' },
                { prop: 'createUserCode', label: '创建人' },
                { prop: 'createTime', label: '创建时间' }
            ],
            orderNoFilters: [],
            filterList: ['全部'],
            selectedRowsData: [],
            clickIndex: 0
        };
    },
    methods: {
        rowClick(rows) {
            rows.checked = !rows.checked;
            this.$refs.moduleTable.toggleRowSelection(rows, rows.checked);
        },
        handleSelectionChange(selection) {
            this.selectedRowsData = selection;
        },
        tableRowClassName({ row }) {
            if (this.selectedRowsData && this.selectedRowsData.map(item => item.id).includes(row.id)) {
                // return 'highlight-row';
            }
        },
        getRowKeys(row) {
            if (!row.expandsRandomKey) row.expandsRandomKey = row.id + Math.random().toString().substr(-10);
            return row.expandsRandomKey;
        },
        handleClose() {
            // this.visible = false;
            this.clickIndex = 0;
            this.$emit('handleClose', '');
        },
        resetDateFilter() {
            this.$refs.filterTable.clearFilter('date');
        },
        clearFilter() {
            this.$refs.filterTable.clearFilter();
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        renderHeader(h, data) {
            const header = this.tableHeaders[data.$index - 1] || {};
            return (
                <span class="log-header">
                    <el-input value={this.headerFilterNames[header.prop]}
                        on-input={ (val) => { this.fetch(header.prop, val); } }
                        on-keydown={ (val) => { this.fetch(header.prop, val); } }
                        on-change={(val) => this.fetch(header.prop, val)}
                        clearable></el-input>
                    <br/>
                    <span>{data.column.label}</span>
                </span>
            );
        },
        fetch(name, val) {
            let tableDataTemp = this.tableData;
            this.$set(this.headerFilterNames, name, val);
            const tempFilter = {};
            Object.keys(this.headerFilterNames).forEach(key => {
                if (this.headerFilterNames[key]) {
                    tempFilter[key] = this.headerFilterNames[key];
                }
            });
            for (const key in tempFilter) {
                if (tempFilter.hasOwnProperty(key)) {
                    tableDataTemp = tableDataTemp.filter(item => {
                        if (item[key].indexOf(tempFilter[key].trim()) >= 0) {
                            return item;
                        }
                    });
                }
            }
            this.data = tableDataTemp;
        },
        logJumpBtn(operateType) {
            this.$emit('handleClose', '');
            const { customerOrderNo, ...params } = { ...this.logJumpParams };
            if (operateType === 'APART') {
                this.$router.push({
                    name: 'stockCenter',
                    params: { ...params }
                });
            } else if (operateType === 'OUTINCONFIRM') {
                this.$router.push({
                    name: 'accessStock',
                    params: { customerOrderNo }
                });
            }
        },
        unique(arr) {
            const res = new Map();
            return arr.filter((a) => !res.has(a) && res.set(a, 1));
        },
        copyText(cellEl, copyText) {
            var input = document.createElement('input');
            input.type = 'text';
            input.value = copyText.trim();
            cellEl.appendChild(input);
            input.select();
            document.execCommand('copy');
            cellEl.removeChild(input);
            this.$message.success(`‘${input.value}’复制成功`);
        },
        cellDBlclick(row, column, cell, event) {
            if (column.property === 'operateContent') {
                this.copyText(cell.children[0], cell.children[0].innerHTML);
            }
        },
        fliterListClick(item, index) {
            this.clickIndex = index;
            if (item === '全部') {
                this.data = this.tableData;
            } else if (item === this.logOrderNo) {
                this.data = this.tableData.filter(data => !data.orderNo || data.orderNo === item);
            } else {
                this.data = this.tableData.filter(data => data.orderNo === item);
            }
        },
        dblclick(val) {
            this.copyText(document.querySelector('.order-filter-log .filter-list-details'), val);
        }
    },
    watch: {
        tableData(newVal) {
            this.orderNoFilters = [];
            this.filterList = ['全部'];
            newVal.map(item => {
                this.tableHeaders.forEach(header => {
                    if (item[header.prop] === undefined) {
                        item[header.prop] = '';
                    }
                });
            });
            this.data = newVal;
            const orderNos = this.data.map(item => item.orderNo);
            orderNos.unshift(this.logOrderNo);
            const newArr = this.unique(orderNos);
            newArr.map(item => {
                if (item) {
                    this.orderNoFilters.push(item);
                }
            });
            this.filterList = ['全部'].concat(this.orderNoFilters);
        }
    }
};
</script>

<style lang="less">
.order-filter-log {
    .el-dialog__body {
        padding: 0 0 22px 0 ;
    }
    .log-header {
        .el-input__suffix {
            right: 10px;
        }
    }
    .filter-list {
        display: flex;
    }
    .filter-list-title {
        // height:100%;
        max-height: 400px;
        line-height: 33px;
        font-size:14px;
        text-align: center;
        color:#333;
        .title {
            line-height: 35px;
            width: 100%;
            display: inline-block;
            background-color: #F6F6F7;
        }
        .table-lists {
            width:198px;
            overflow: auto;
            height: 365px;
            background: #fff;
            color: #333;
            .filter-list-details{
                cursor: pointer;
                border-left: 1px solid #EBEEF5;
                border-bottom: 1px solid #EBEEF5;
            }
            .active {
                background: #e1e9ef;
            }
        }
        .filter-table {
            width: 100%;
        }
    }
}
</style>