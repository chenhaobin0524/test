<template>
    <paper id="mPanel">
        <m-title :title="config.title.title" :tips="config.title.tips" class="margin-bottom-20"></m-title>
        <hr class="margin-bottom-20" style="height:1px;border:none;border-top:1px solid #dddddd" />
        <el-row>
            <el-col v-if="config.searchLeft" :span="6" style="padding-right: 20px">
                <slot name="search-left"></slot>
            </el-col>
            <el-col :span="config.searchLeft ? 18 : 24">
                <m-query v-if="(!config.toolbar || !config.toolbar.miniSearch || config.toolbar.miniSearch.length===0) && config.query"
                        :config="config.query" @on-submit="handleSubmit" class="margin-bottom-10" @input-event-bus="handleInputEvent"
                        @input-number-event-bus="handleInputNumberEvent" @radio-group-event-bus="handleRadioGroupEvent"
                        @checkbox-group-event-bus="handleCheckboxGroupEvent" @date-picker-event-bus="handleDatePickerEvent"
                        @time-picker-event-bus="handleTimePickerEvent" @select-event-bus="handleSelectEvent"></m-query>
                <m-toolbar v-if="config.toolbar" :show-search="config.toolbar&&config.toolbar.miniSearch!=undefined"
                        :config="config.toolbar" @on-submit="handleSubmit" @select-event-bus="handleSelectEvent"
                        @on-button-click="handleButtonClick" class="margin-bottom-10"></m-toolbar>
                <!-- <tree-table ref="treeTable" v-if="config.treeTable" :expand-type="config.treeTable.expand"
                        :data="data" :columns="config.treeTable.columns" :stripe="config.treeTable.stripe"
                        :tree-type="true" :selection-type="true" class="margin-bottom-20" @checkbox-click="handleSelectChange">
                </tree-table> -->
                <m-table v-if="config.table" :loading="loading" :show-selection="config.table.showSelection"
                        :show-index="config.table.showIndex" :columns="config.table.columns" :data="data"
                        :action="config.table.action" class="margin-bottom-20" @on-select="handleSelect"
                        @on-selection-change="handleSelectionChange" @on-select-all="handleSelectAll"
                        @on-current-change="handleCurrentChange" @on-opr-click="handleOprClick"></m-table>
                <el-pagination :total="total" :current="page" :page-size="pageSize"
                        :page-size-opts="(config.table&&config.table.pageSizeOpts)||(config.treeTable&&config.treeTable.pageSizeOpts)"
                        @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange"></el-pagination>
            </el-col>
        </el-row>
    </paper>
</template>
<script>
import axios from 'axios';
import paper from '../../../core/paper/Paper';
import mTitle from './mTitle';
import mQuery from './mQuery';
import mToolbar from './mToolbar';
import mTable from './mTable';
// import treeTable from 'vue-table-with-tree-grid';
import cookie from 'js-cookie';

export default {
    name: 'mPanel',
    components: { paper, mTitle, mQuery, mToolbar, mTable },
    data() {
        return {
            data: [],
            page: 1,
            pageSize: (this.config.table && this.config.table.pageSize) || (this.config.treeTable && this.config.treeTable.pageSize) || 5,
            total: 0,
            condition: {},
            loading: false
        };
    },
    props: {
        config: Object,
        dataSourceUrl: String,
        method: {
            type: String,
            default: 'get'
        }
    },
    methods: {
        reload() {
            this.getData(this.page, this.pageSize, this.condition);
        },
        getCookie(name) {
            var threadTransFdUserId = '1034013127318544384';
            if (cookie.get(name) !== undefined) {
                threadTransFdUserId = cookie.get(name);
            }
            return threadTransFdUserId;
        },
        getData(page, pageSize, condition) {
            const vm = this;
            vm.loading = true;
            axios({
                method: vm.method,
                url: vm.dataSourceUrl,
                data: { page: page, pageSize: pageSize, dto: condition },
                headers: { 'threadTransFdUserId': this.getCookie('fd_tenant_id') }
            }).then(res => {
                vm.data = res.data.list;
                vm.page = res.data.page;
                vm.total = res.data.totalCount;
                vm.loading = false;
            }).catch(() => {
                vm.loading = false;
            });
        },
        handleSubmit(condition) {
            this.condition = condition;
            this.getData(1, this.pageSize, this.condition);
        },
        handleButtonClick(event) {
            this.$emit(event);
        },
        handleSelect(selection, row) {
            this.$emit('on-select', selection, row);
        },
        handleSelectionChange(selection) {
            this.$emit('on-selection-change', selection);
        },
        handleSelectAll(selection) {
            this.$emit('on-select-all', selection);
        },
        handleCurrentChange(currentRow, oldCurrentRow) {
            this.$emit('on-current-change', currentRow, oldCurrentRow);
        },
        handlePageChange(page) {
            this.page = page;
            this.getData(this.page, this.pageSize, this.condition);
        },
        handlePageSizeChange(pageSize) {
            this.page = 1;
            this.pageSize = pageSize;
            this.getData(this.page, this.pageSize, this.condition);
        },
        handleInputEvent(on, item, event) {
            this.$emit('on-input-event', on, item, event);
        },
        handleInputNumberEvent(on, item, event) {
            this.$emit('on-input-number-event', on, item, event);
        },
        handleRadioGroupEvent(on, item, param) {
            this.$emit('on-radio-group-event', on, item, param);
        },
        handleCheckboxGroupEvent(on, item, param) {
            this.$emit('on-checkbox-group-event', on, item, param);
        },
        handleDatePickerEvent(on, item, param1, param2) {
            this.$emit('on-date-picker-event', on, item, param1, param2);
        },
        handleTimePickerEvent(on, item, param) {
            this.$emit('on-time-picker-event', on, item, param);
        },
        handleSelectEvent(on, item, param) {
            this.$emit(on, item, param);
        },
        handleSelectChange() {
            const selectKey = this.$refs['treeTable'].getCheckedProp(this.config.treeTable.key);
            const selection = [];
            this.config.treeTable.data.forEach(item => {
                if (selectKey.indexOf(item[this.config.treeTable.key]) > -1) {
                    selection.push(item);
                }
                if (item.children && item.children.length > 0) {
                    selection.push(this.pushChildren(item.children, selectKey));
                }
            });
            this.$emit('on-select-change', selection);
        },
        handleOprClick(event, params) {
            this.$emit(event, params);
        },
        pushChildren(item, selectKey) {
            const selection = [];
            item.forEach(child => {
                if (selectKey.indexOf(child[this.config.treeTable.key]) > -1) {
                    selection.push(child);
                }
                if (child.children && child.children.length > 0) {
                    selection.push(this.pushChildren(child.children, selectKey));
                }
            });
            return selection;
        }
    },
    mounted() {
        this.getData(this.page, this.pageSize, this.condition);
    }
};
</script>
<style lang="less">
#mPanel {
    .margin-bottom-20 {
        margin-bottom: 20px;
    }

    .margin-bottom-10 {
        margin-bottom: 10px;
    }

    .m-table-wrapper {
        border: 0;
    }

    .m-table:after {
        width: 0;
    }

    .m-table:before {
        height: 0;
    }

    .m-table td,
    .m-table th {
        border-bottom: 0;
    }

    .zk-table {
        border: 0;
    }

    .zk-table__body,
    .zk-table__footer,
    .zk-table__header {
        border-collapse: initial;
    }
}
</style>
