<template>
    <el-dialog :width="width"  :title='titlename' :visible.sync="visible" :before-close="closeAdd">
        <div class="add-white">
            <div class="add-white-list">
                <list-layout>
                    <div slot="header-search">
                        <slot name="left-header"></slot>
                    </div>
                    <el-table slot="list" v-loading="leftLoading" :row-key="rowKey" stripe border @selection-change="selectionChange" :data='leftList' ref="multipleTable">
                        <slot name="left-list"></slot>
                        <el-table-column type="selection" fixed='right' width="50" label='操作' reserve-selection>
                        </el-table-column>
                    </el-table>
                    <div slot="footer">
                        <slot name="left-footer"></slot>
                    </div>
                </list-layout>
            </div>
            <div class="add-white-seleted">
                <list-layout>
                    <div slot="header-search">
                        <slot name="right-header"></slot>
                    </div>
                    <el-table slot="list" stripe :data='totalList.slice((RightCurrentPage - 1) * RightPageSize, RightCurrentPage * RightPageSize)'>
                        <slot name="right-list"></slot>
                        <el-table-column fixed='right' width="50" label='操作' >
                            <template slot-scope='scope'>
                                <el-button @click='delSelect(scope.row)' type='text' size='mini'>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div slot="footer">
                        <el-pagination
                            @size-change="rightHandleSizeChange"
                            @current-change="rightHandleCurrentChange"
                            :current-page="RightCurrentPage"
                            :page-sizes="[10, 20, 30, 50, 100]"
                            :page-size='RightPageSize'
                            size="small"
                            layout='total, prev, pager, next'
                            :total='totalList.length'
                        ></el-pagination>
                    </div>
                </list-layout>
            </div>
        </div>
        <span slot='footer' class='text-right'>
            <el-button @click='closeAdd'>取 消</el-button>
            <el-button type='primary' @click="save">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import listLayout from '@/components/lots/listLayout/Index';
export default {
    components: { listLayout },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '80%'
        },
        titlename: {
            type: String,
            default: ''
        },
        rowKey: {
            type: String,
            default: 'id'
        },
        leftLoading: {
            type: Boolean,
            default: false
        },
        leftList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        rightList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            totalList: [],
            RightCurrentPage: 1,
            RightPageSize: 10,
            isClearSelection: false
        };
    },
    methods: {
        closeAdd() {
            if (!this.isClearSelection) {
                this.$refs.multipleTable.clearSelection();
            }
            this.$emit('closeAdd');
        },
        selectionChange(selection) {
            this.totalList = selection;
        },
        rightHandleSizeChange(val) {
            this.RightPageSize = val;
        },
        rightHandleCurrentChange(val) {
            this.RightCurrentPage = val;
        },
        delSelect(row) {
            for (let i = 0; i < this.leftList.length; i++) {
                if (this.leftList[i][this.rowKey] === row[this.rowKey]) {
                    this.$refs.multipleTable.toggleRowSelection(this.leftList[i]);
                    return;
                }
            }
            this.$refs.multipleTable.toggleRowSelection(row, false);
        },
        save() {
            if (!this.totalList.length) {
                this.$message({ type: 'error', message: '请选中最少一项!' });
                return false;
            }
            this.$emit('saveWhiteList', this.totalList);
            this.totalList = [];
            this.$refs.multipleTable.clearSelection();
        }
    },
    watch: {
        totalList(value) {
            if (value.length <= this.RightPageSize) {
                this.RightCurrentPage = 1;
            }
        },
        rightList(arr) {
            if (arr) {
                this.isClearSelection = true;
                this.totalList = arr;
                for (let i = 0; i < this.leftList.length; i++) {
                    for (let j = 0; j < arr.length; j++) {
                        if (this.leftList[i][this.rowKey] === arr[j][this.rowKey]) {
                            this.$refs.multipleTable.toggleRowSelection(this.leftList[i]);
                        }
                    }
                }
            }
        }
    }
};
</script>
<style lang="less">
.add-white {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    border: 1px solid #dbdbdb;
    .add-white-list,
    .add-white-seleted {
        width: 50%;
        padding: 15px;
    }
    .add-white-list {
        border-right: 1px solid #dbdbdb;
    }
}
</style>