<template>
    <div>
        <div class="detaliButton">
            <div><slot name="header-module-btn"></slot></div>
        </div>
        <m-table
        ref="table"
        :popPrefix="popPrefix"
        :totalDate="config.table"
        :tableData="totalData"
        :loading="false"
        :tableList='tableList'
        @onSelectionChange="selectChange"
        @row-db-click="rowDBclick"
        @column-filter-search="columnFilterSearch"
        @save-data="saveData"
        @tab-advanced-search="tabAdvancedSearch"
    ></m-table>
        <div class="detail-footer">
            <div class="detail-footer-left">
                <span class="page-text" v-if="isShowPagination">已选<span class="text-color">{{checkedNum}}</span>项</span>
                <div class="page-module-btn"><slot name="page-module-btn"></slot></div>
            </div>
            <div class="detail-footer-right" v-if="isShowPagination">
                <m-page :pageData="config.page" :total="pageTotal" @on-page-change="pageChange" @on-size-change="sizeChange"></m-page>
            </div>
        </div>
        <m-advanced-search ref="detaliTable"
            @detali-search-sure="detaliSearchSure"
            :advanceUrl="advanceUrl"
            :advancePrefix="advancePrefix"
            :advanceLabel="advanceLabel"
            :advanceCascade='advanceCascade'></m-advanced-search>
    </div>
</template>
<script>
import mTable from '@/components/awesome/page/mPanel3/mTable';
import mPage from '@/components/awesome/page/mPanel3/mPage';
import mAdvancedSearch from '../mAdvancedSearch';

export default {
    components: { mTable, mPage, mAdvancedSearch },
    props: {
        infoConfig: {
            type: Object,
            default() {
                return {};
            }
        },
        pageTotal: {
            type: Number,
            default() {
                return 0;
            }
        },
        tableData: {
            type: Array,
            default() {
                return {};
            }
        },
        isShowPagination: {
            type: Boolean,
            default() {
                return true;
            }
        }
    },
    data() {
        return {
            config: this.infoConfig,
            totalData: this.tableData,
            tableList: '',
            checkedNum: 0,
            popPrefix: this.infoConfig.popPrefix ? this.infoConfig.popPrefix : '/api-mdm/dictionaryDetail/dict',
            advanceUrl: '',
            advanceLabel: '',
            advanceType: true,
            advanceCode: '',
            searchTypeNum: '',
            advanceCascade: {},
            advancePrefix: '/api-mdm',
            ajaxType: '',
            acceptParams: {}
        };
    },
    methods: {
        getTableTitle() {
            const laberArray = [];
            this.config.table.columns.map(data => {
                laberArray.push(data.label);
            });
            this.tableList = laberArray.join(',');
        },
        selectChange(selection) {
            this.$emit('selectChange', selection);
            this.checkedNum = selection.length;
        },
        pageChange(data) {
            this.$emit('pageChange', data);
        },
        sizeChange(data) {
            this.$emit('sizeChange', data);
        },
        rowDBclick(row) {
            this.$emit('rowDBclick', row);
        },
        columnFilterSearch(data) {
            this.$emit('columnFilterSearch', data);
        },
        saveData(data) {
            this.$emit('saveData', data);
        },
        // 表格内高级搜索
        tabAdvancedSearch(data, item, type, searchData) {
            this.detaliSearch(data, item, type, searchData);
        },
        detaliSearch(index, current, satusid) {
            this.acceptParams = {};
            if (current.preSetValue) {
                this.$emit('onBeforeOpen', current.prop);
            }
            const value = null;
            const code = null;
            this.advanceUrl = current.advanceUrl;
            this.ajaxType = current.ajaxType;
            current.advancePrefix = current.advancePrefix === undefined ? this.advancePrefix : current.advancePrefix;
            this.advanceLabel = current.lable ? current.lable : current.name;
            this.advanceCode = current.advanceCode;
            this.advanceProp = current.prop;
            if (satusid === 1) {
                this.$refs.detaliTable.showState = true;
                this.$refs.detaliTable.inquire(this.advanceUrl, value, current, true, code, this.ajaxType, this.acceptParams);
            } else {
                this.$refs.detaliTable.showState = true;
                this.$refs.detaliTable.inquire(this.advanceUrl, value, current, true, code, this.ajaxType, this.acceptParams);
            }
        },
        detaliSearchSure(data, code) {
            if (this.advanceCode) {
                if (data !== '' && code !== '') {
                    this.$set(this.$refs.table.ruleForm, this.advanceCode, code);
                    this.$set(this.$refs.table.ruleForm, this.advanceProp, data);
                }
            } else {
                // this.formData[this.advanceProp] = data;
            }
        },
        tableAdvance(prop, advanceCode, data, code) {
            this.$refs.table.ruleForm[prop] = data;
            this.$refs.table.ruleForm[advanceCode] = code;
        }
    },
    mounted() {
        this.getTableTitle();
    },
    watch: {
        tableData(newVal) {
            this.totalData = newVal;
        }
    }
};
</script>
<style lang="less">
    .page-text{
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      .text-color{
        color: #00BCBF;
      }
    }
    .row-bg{
        margin-top: 10px;
    }
    .detaliButton {
        background-color: #FFFBF2;
        border: 1px solid #FFFBF2;
        .el-button--text {
            color: #999999;
            padding: 7px 3px;
            margin-left: 7px;
        }
    }
    .detail-footer {
        margin-top: 10px;
        overflow: hidden;
        .detail-footer-left {
            float: left;
            .page-module-btn {
                display: inline-block;
                margin-left: 10px;
            }
        }
        .detail-footer-right {
            float: right;
        }
    }
</style>
