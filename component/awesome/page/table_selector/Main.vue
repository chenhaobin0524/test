<template>
    <div>
        <el-input v-model="value" suffix-icon="el-icon-search" :style="{width: width+'px'}" @on-click="handleClick" />
        <el-dialog :visible.sync="showTable" title="表格选择输入框" width="800" @on-ok="handleOk">
            <el-table border :data="data" :highlight-row="single" @on-current-change="onCurrentChange" @on-selection-change="onSelectionChange">
                <div v-for="(item, index) in columns" :key="'row_'+ index">
                    <el-table-column :prop="item.key"></el-table-column>
                </div>
                <div slot="header" :style="{margin: '10px auto auto 10px', height: '42px'}">
                    <el-input v-model="queryValue" :style="{width: '400px'}">
                    <el-select v-model="queryKey" slot="prepend" style="width: 80px">
                        <el-option v-for="type in queryTypeOptions" :value="type.value" :key="type.value">{{type.label}}</el-option>
                    </el-select>
                    <el-button slot="append" icon="ios-search" @click="onSearch"></el-button>
                    </el-input>
                </div>
            </el-table>
            <Page v-if="showPage" :total="total" size="small" show-total @on-page-size-change="onPageSizeChange" @on-change="onPageChange"></Page>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'mTableSelector',
    data() {
        return {
            queryKey: this.queryTypeOptions.length > 0 ? this.queryTypeOptions[0].value : '',
            queryValue: '',
            selection: [],
            value: '',
            showTable: false
        };
    },
    props: {
        width: {
            type: Number,
            default: 200
        },
        selectKey: String, // 要显示的文本所在选中项的key
        showPage: {
            type: Boolean,
            default: false
        }, // 是否显示分页栏，默认false
        queryTypeOptions: Array, // 查询类型（下拉框选项）
        columns: Array, // 表格列配置
        data: Array, // 表格数据
        total: Number, // 总数
        single: {
            type: Boolean,
            default: true
        } // 是否单选，默认true
    },
    methods: {
        onSearch() {
            this.$emit('on-search', this.queryKey, this.queryValue);
        },
        onCurrentChange(row) {
            this.selection = [];
            this.selection.push(row);
        },
        onSelectionChange(selection) {
            this.selection = selection;
        },
        onPageChange(page) {
            this.$emit('on-page-change', page);
        },
        onPageSizeChange(pageSize) {
            this.$emit('on-page-size-change', pageSize);
        },
        handleClick() {
            this.showTable = true;
        },
        handleOk() {
            let returnValue = '';
            this.selection.forEach(item => {
                returnValue += item[this.selectKey] + ',';
            });
            if (returnValue !== '') {
                returnValue = returnValue.substring(0, returnValue.length - 1);
            }
            this.value = returnValue;
            this.showTable = false;
        }
    }
};
</script>