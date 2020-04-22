<template>
    <el-dialog width="800px"
        v-dialogDrag
        :visible.sync="dialogVisible"
        :append-to-body="true"
        @close="dialogClose">
        <div slot="title" class="column-config_title">
            {{dialogTitle}}
        </div>
        <div class="component-container">
            <div class="top-search-group">
                <el-form :inline="true" :model="searchObj">
                    <el-form-item>
                        <el-select v-model="searchObj.key" placeholder="请选择">
                            <el-option v-for="option in selectOptions"
                                :key="option.prop"
                                :label="option.value"
                                :value="option.prop"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model.trim="searchObj.keyword" placeholder="请输入" @keyup.enter.native="search" @change="inputChange"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>
                    </el-form>
            </div>
            <el-row :gutter="20">
                <el-col :span="8" v-if="multiple">
                    <el-table :data="advanceList" class="table-box" height="300" highlight-current-row>
                        <el-table-column :prop="config.multipleTableColumn.prop" :label="config.multipleTableColumn.value"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="60">
                            <template slot-scope="scope">
                                <el-button class="deleteBtn" @click="deleteDate(scope.$index)" size="small" type='text'>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="multiple?16:24">
                    <el-table
                        :data="tableData"
                        highlight-current-row
                        v-loading="loading"
                        height="300"
                        @current-change="currentRowChange"
                        @row-dblclick="rowDbClick"
                        @row-click="selectionRow">
                        <el-table-column
                            v-for="column in config.tableConfig"
                            :key="column.prop"
                            :prop="column.prop"
                            :label="column.value">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <div class="config-footer">
                <el-row>
                    <el-col :span="3" style="line-height:30px;">共&nbsp;&nbsp;{{pageTotal}}&nbsp;&nbsp;项</el-col>
                    <el-col :span="16">
                        <el-pagination
                            background
                            class="table-pagination"
                            layout="prev, pager, next"
                            :current-page.sync="page.pageNo"
                            :page-size="page.pageSize"
                            :total="pageTotal"
                            @current-change="currentChange">
                        </el-pagination>
                    </el-col>
                    <el-col :span="5" style="text-align: right;">
                        <el-button type="text" @click="dialogVisible = false;">取消</el-button>
                        <el-button type="primary" @click="confirm" :disabled="disabledCancel">确定</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import request from '@/utils/http';
// import { filterSpecChar } from '../utils';
export default {
    props: {
        disabledDbClick: {
            type: Boolean,
            default: false
        },
        rejectClose: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        selectOptions() {
            return this.config.advanceConfig || this.config.tableConfig;
        },
        dialogTitle() {
            return this.config.advanceLabel || this.config.name || this.config.label;
        }
    },
    data() {
        return {
            disabledCancel: false,
            dialogVisible: false,
            loading: false,
            page: {
                pageSize: 10,
                pageNo: 1
            },
            pageTotal: 0,
            searchObj: {},
            tableData: [],
            config: {},
            multiple: false,
            advanceList: []
        };
    },
    watch: {
        dialogVisible(val) {
            if (!val) {
                this.disabledCancel = false;
            }
        }
    },
    methods: {
        async fetchData() {
            this.loading = true;
            let params = {};
            if (this.searchObj.key === 'ALL') {
                params = { ...this.advanceCascade, ...this.page };
                for (let i = 1; i < this.selectOptions.length; i++) {
                    params[this.selectOptions[i].prop] = this.searchObj.keyword;
                }
            } else {
                params = { ...this.advanceCascade, ...this.page, [this.searchObj.key]: this.searchObj.keyword };
            }
            const res = await request({
                method: 'get',
                url: `${this.prefix}${this.config.advanceUrl}`,
                params
            });
            if (res && res.code === '0') {
                if (res.data.totalPage !== 0 && this.page.pageNo > res.data.totalPage) {
                    this.page.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    this.tableData = res.data.list;
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.tableData = [];
            }
            this.loading = false;
        },
        show(status = true, config, advanceCascade = {}) {
            this.prefix = config.prefix || '/api-mdm/';
            this.dialogVisible = status;
            this.multiple = config.multiple ? config.multiple : false;
            if (status === false) return;
            if (!config) {
                this.$message.error('弹窗配置对象为空！');
                return;
            }
            if (this.multiple) {
                this.advanceList = [];
            }
            this.config = config;
            this.$set(this.searchObj, 'key', this.selectOptions[0].prop);
            this.$set(this.searchObj, 'keyword', '');
            this.advanceCascade = advanceCascade;
            this.fetchData();
        },
        // 页码变化
        currentChange(val) {
            this.page.pageNo = val;
            this.fetchData();
        },
        // 搜索
        search() {
            this.page.pageNo = 1;
            this.fetchData();
        },
        // 重置
        reset() {
            this.searchObj.keyword = '';
            this.advanceList = [];
            this.fetchData();
        },
        // 表格
        currentRowChange(row) {
            this.currentRow = row;
        },
        // 表格双击
        rowDbClick(row) {
            if (this.disabledDbClick) return false;
            this._emitResult(row);
        },
        confirm() {
            if (!this.currentRow) {
                this.$message.warning('没选中数据');
                return;
            }
            this._emitResult(this.currentRow);
        },
        // 返回选中值
        _emitResult(row) {
            const data = {};
            if (!this.config.cbParams) {
                this.$message.error('弹窗没定义cbParams配置!');
                return;
            }
            if (this.multiple) {
                let searchData = {};
                const name = this.config.tableConfig[0].prop;
                const prop = this.config.tableConfig[1].prop;
                searchData[name] = [];
                searchData[prop] = [];
                this.advanceList.map(item => {
                    searchData[name].push(item[name]);
                    searchData[prop].push(item[prop]);
                });
                row[name] = searchData[name].join(',');
                row[prop] = searchData[prop].join(',');
            }
            for (const item of this.config.cbParams) {
                let { 0: sourceProp, 1: destProp } = item.split('#');
                destProp = destProp || sourceProp;
                data[destProp] = row[sourceProp];
            }
            this.$emit('confirm', data);
            if (this.rejectClose) {
                this.disabledCancel = true;
                return false;
            }
            this.dialogVisible = false;
        },
        inputChange(val) { },
        dialogClose() {
            // 重置属性
            this.page = {
                pageSize: 10,
                pageNo: 1
            };
            this.pageTotal = 0;
            this.searchObj = {};
        },
        deleteDate(index) {
            this.advanceList.splice(index, 1);
        },
        selectionRow(currentRow) {
            if (this.multiple) {
                let num = 0;
                if (this.advanceList.length === 10) {
                    this.$message({
                        message: '最多选中10条数据',
                        type: 'warning'
                    });
                } else {
                    this.advanceList.map(item => {
                        if (item[this.config.tableConfig[0].prop] === currentRow[this.config.tableConfig[0].prop]) {
                            num += 1;
                        }
                    });
                    if (num === 0) {
                        this.advanceList.push(currentRow);
                    }
                }
            } else {
                this.advanceList = currentRow;
            }
        }
    }
};

</script>

<style lang="less">
.column-config_title{
    small{
        margin-left: 25px;
    }
}
.component-container {
    .config-footer {
        margin-top: 18px;
    }
    .table-pagination{
        float: left;
        padding: 0;
        .btn-prev, .btn-next, .el-pager li {
            background-color: #ffffff !important;
            border: 1px solid #cccccc;
            border-radius: 4px !important;
        }
        .el-pager li.active + li {
            border-left: 1px solid #cccccc;
        }
        .el-pager li:not(.disabled).active{
            background-color: #00BCBF !important;
            border: 1px solid #00BCBF;
        }
    }
}
</style>