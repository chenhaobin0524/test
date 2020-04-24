<template>
  <div id="advanced-search">
    <el-dialog
        :modal-append-to-body="shadeState"
        :title="advanceLabel"
        append-to-body
        :visible.sync="showState"
        width="50%">
        <el-select v-model="selectData" class="select-box">
            <el-option
            v-for="(val, index) in advanceConfig"
            :key=index
            :label="val.value"
            :value="val.prop">
            </el-option>
        </el-select>
        <el-input style="width: 200px; margin: 0 10px;" placeholder="请输入" v-model="searchDate" @keyup.enter.native="() =>clickInquire(advanceUrl)"></el-input>
        <el-button @click="() =>clickInquire(advanceUrl)" type="primary">查 询</el-button>
        <el-button @click="reset">重 置</el-button>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-table :data="tableData" class="table-box" height="300" highlight-current-row @row-click="selectionRow" @row-dblclick="dblrow">
                    <el-table-column v-for="(val, index) in tableConfig" :key=index  :prop="val.prop" :label="val.value"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div style="overflow: auto; margin-top: 10px;">
            <div v-if="mPageState" style="float: left;">
                <m-page :pageData="pageConfig" :current-page="currentPage" :total="pageTotal" @on-page-change="pageChange" @on-size-change="sizeChange"></m-page>
            </div>
            <span style="float: right;">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { popSit } from './api';
import mPage from '../mPage';
export default {
    components: { mPage },
    data() {
        return {
            searchDate: '',
            searchName: '',
            searchCode: '',
            name: '',
            selectData: '',
            showState: false,
            currentPage: 1,
            tableData: [],
            pageSize: 10,
            pageTotal: 0,
            mPageState: true,
            pageConfig: {
                layout: 'total, prev, pager, next',
                pageSize: 10,
                pageSizes: [10, 20, 30, 50, 100]
            },
            selectCode: [],
            advanceConfig: [],
            tableConfig: [],
            advanceList: [],
            advanceUrl: '',
            shadeState: false,
            cusAdvancePrefix: '/api-mdm'
        };
    },
    props: {
        advanceLabel: {
            type: String,
            default() {
                return '';
            }
        },
        advancePrefix: String
    },
    methods: {
        cancel() {
            this.showState = false;
            this.$emit('detali-search-cel');
            this.reset();
        },
        confirm() {
            this.showState = false;
            const result = {};
            this.cbParams.forEach(prop => {
                // eslint-disable-next-line prefer-const
                let { 0: sourceProp, 1: destProp } = prop.split('#');
                if (!destProp) {
                    destProp = sourceProp;
                }
                result[destProp] = this.advanceList[sourceProp] || '';
            });
            // this.$emit('detali-search-sure', this.searchName, this.searchCode, this.advanceList);
            this.$emit('detali-search-sure', result);
            this.tableData = [];
            this.reset();
        },
        reset() {
            this.searchDate = '';
            this.selectData = '';
            this.searchName = '';
            this.searchCode = '';
            this.advanceList = [];
        },
        clickInquire(url) {
            this.currentPage = 1;
            this.mPageState = false;
            this.inquire(url);
            this.$nextTick(() => {
                this.mPageState = true;
            });
        },
        inquire(url, value, item, type, code, advanceCascade) {
            if (url) {
                this.advanceUrl = url;
            }
            if (item && item.advancePrefix) {
                this.cusAdvancePrefix = item.advancePrefix;
            }
            if (item && item.cbParams) {
                this.cbParams = item.cbParams;
            }
            if (item && item.tableConfig) {
                this.advanceConfig = item.advanceConfig || item.tableConfig;
                this.tableConfig = item.tableConfig;
                this.name = this.tableConfig[1];
                this.selectData = (item.advanceConfig || item.tableConfig)[0].prop;
            }
            if (item && item.advanceTable) {
                this.tableConfig = item.advanceTable;
            }
            if (value || value === '') {
                this.searchDate = value;
            }
            const params = {
                pageSize: this.pageSize,
                pageNo: this.currentPage
            };
            this.searchDate = this.searchDate.replace(/\s*/g, '');
            if (this.selectData !== '') {
                params[this.selectData] = this.searchDate;
            }
            // 高级搜索级联时使用
            if (advanceCascade) {
                Object.assign(params, advanceCascade);
            }
            const advancePrefix = this.cusAdvancePrefix ? this.cusAdvancePrefix : this.advancePrefix;
            popSit(advancePrefix, this.advanceUrl, params).then(res => {
                this.tableData = res.data.list;
                this.pageTotal = res.data.totalCount;
            });
        },
        sizeChange(val) {
            this.pageSize = val;
            this.inquire();
        },
        pageChange(val) {
            this.currentPage = val;
            this.inquire();
        },
        deleteDate(index) {
            this.advanceList.splice(index, 1);
        },
        dblrow(currentRow) {
            this.advanceList = currentRow;
            this.confirm();
        },
        selectionRow(currentRow) {
            this.advanceList = currentRow;
        }
    },
    watch: {
        showState(val) {
            if (val) {
                this.currentPage = 1;
                this.inquire();
            }
        }
    }
};
</script>

<style lang="less">
  #advanced-search{
    .select-box{
        width: 140px;
        margin-right: 10px;
    }
    .table-box{
        width: 100%;
        margin: 10px 0;
    }
    .el-table {
        min-height: 300px !important;
        max-height: 300px !important;
    }
    .deleteBtn{
        padding: 0;
    }
    .el-dialog__body {
        padding-bottom: 50px;
        padding-top: 10px;
    }
    .el-dialog__header {
        padding: 10px 20px;
    }
    .el-dialog__headerbtn {
        top: 15px;
    }
  }
</style>
