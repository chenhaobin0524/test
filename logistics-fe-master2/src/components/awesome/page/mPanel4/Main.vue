<template>
    <div id="mPanel4">
        <m-search-list :popPrefix="popPrefix" ref="searchList" :searchId="searchId" :list="config.searchList" :searchTotalTitle="searchTotalTitle" :optionNum="optionNum"
                       :longPrefix="longPrefix" :advancePrefix="advancePrefix" :searchSetTitle="searchSetTitle" @onSearchChange="searchChange" @tableAdvance="tableAdvance">
          <div slot="table-module-btn" class="btn-box">
            <slot name="table-module-btn"></slot>
            <el-tooltip v-if="config.configuration?false: true" class="item allocation-box" effect="dark" content="配置列" placement="bottom">
              <el-button size="mini" class="el-icon-setting" @click="getTitleList"></el-button>
            </el-tooltip>
            <el-dialog :visible.sync="showModal" title="列配置" @close="dialogClose">
              <configuration :checkedList="checkedList" :selectAllColumns="config.table.columns" ref="dialog"
                             @getTableConfigList="getTableConfigList" @tableConfigClose="tableConfigClose"></configuration>
            </el-dialog>
          </div>
        </m-search-list>
        <div class="flex-table">
            <div v-if="config.table.seperateTree">待调车
                <ul>
                    <li v-for="(item, index) in sourceRootData" :key="index" @click="rootListClick(item, 'source')">{{item.textLeft}}</li>
                </ul>
            </div>
            <m-table
                ref="table"
                class="source-table"
                :popPrefix="popPrefix"
                :longPrefix="longPrefix"
                :verification="verification"
                :totalDate="config.table"
                :tableData=totalData
                :tableList="tableList"
                :loading="loading"
                @tab-advanced-search="tabAdvancedSearch"
                @row-db-click="rowDBClick"
                @save-data="saveData"
                @btnView="checkTable"
                @btnEdit="editTable"
                @btnPrint="printTable"
                @btnDelete="delTable"
                @onSelectionChange="selectChange"
                @switch-change="switchChange"
                @column-filter-search="columnFilterSearch"
                @moreAction="moreAction"
            ></m-table>
        </div>
        <div class="flex-table" v-if="config.tableTarget">
            <div v-if="config.tableTarget.seperateTree">待发车(20)
                <ul>
                    <li v-for="(item, index) in targetRootData" :key="index" @click="rootListClick(item, 'source')">{{item.textLeft}}</li>
                </ul>
            </div>
            <slot name="target-table-header"></slot>
            <m-table
                ref="targetTable"
                class="target-table"
                :popPrefix="popPrefix"
                :longPrefix="longPrefix"
                :verification="verification"
                :totalDate="config.tableTarget"
                :tableData=totalTargetData
                :tableList="tableList"
                :loading="loading"
                @tab-advanced-search="tabAdvancedSearch"
                @row-db-click="rowDBClick"
                @save-data="saveData"
                @btnView="checkTable"
                @btnEdit="editTable"
                @btnPrint="printTable"
                @btnDelete="delTable"
                @onSelectionChange="selectChange"
                @switch-change="switchChange"
                @column-filter-search="columnFilterSearch"
                @moreAction="moreAction"
            ></m-table>
        </div>
        <el-row type="flex" class="row-bg" justify="space-between" v-if="!config.transferTables">
          <el-col :span="12" class="page-text">
              <div v-if="config.table.selectBtn">
                已选<span class="text-color">&nbsp;&nbsp;{{checkedNum}}&nbsp;&nbsp;</span>项
              </div>
              <slot name="page-module-btn"></slot>
          </el-col>
          <el-col :span="12" v-if="!config.transferTables">
            <m-page :pageData="config.page" :total="pageTotal" @on-page-change="pageChange" @on-size-change="sizeChange"></m-page>
          </el-col>
        </el-row>
    </div>
</template>
<script>
import mSearchList from '../mPanel3/mSearchList';
import mTable from '../mPanel3/mTable';
import mPage from '../mPanel3/mPage';
import configuration from '../mPanel3/configuration-list';
import getList from '../mPanel3/api';

export default {
    name: 'mPanel',
    components: { mTable, mSearchList, mPage, configuration },
    data() {
        return {
            checkedNum: 0,
            showModal: false,
            tableList: '',
            settingColumns: this.config.table.columns,
            checkedList: '',
            popPrefix: this.config.popPrefix ? this.config.popPrefix : '/api-mdm/dictionaryDetail/dict',
            advancePrefix: this.config.advancePrefix ? this.config.advancePrefix : '/api-mdm',
            longPrefix: this.config.longPrefix ? this.config.longPrefix : '/api-gwms/es/comboBox'
        };
    },
    props: {
        config: Object,
        totalData: Array,
        totalTargetData: Array,
        sourceRootData: Array,
        targetRootData: Array,
        pageTotal: Number,
        dataSourceUrl: String,
        pageID: String,
        searchId: String,
        optionNum: String,
        loading: {
            type: Boolean,
            default() {
                return true;
            }
        },
        verification: {
            type: Object,
            default() {
                return {};
            }
        },
        method: {
            type: String,
            default: 'get'
        },
        searchTotalTitle: {
            type: Array,
            default() {
                return [];
            }
        },
        searchSetTitle: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    methods: {
        // 表格中按钮触发事件
        checkTable(data) {
            this.$emit('check-btn', data);
        },
        editTable(data) {
            this.$emit('edit-btn', data);
        },
        printTable(data) {
            this.$emit('print-btn', data);
        },
        delTable(data) {
            this.$emit('del-btn', data);
        },
        saveData(data) {
            this.$emit('saveData', data);
        },
        // 表单选项变化
        selectChange(data) {
            this.$emit('selectChange', data);
            this.checkedNum = data.length;
        },
        switchChange(data) {
            this.$emit('switch-change', data);
        //  表格内switch切换
        },
        rowDBClick(row) {
            this.$emit('row-db-click', row);
        },
        // 搜索内容变化
        searchChange(data) {
            this.$emit('searchChange', data);
        },
        // 分页器改变触发事件
        pageChange(page) {
            this.$emit('pageChange', page);
        },
        sizeChange(size) {
            this.$emit('sizeChange', size);
        },
        getTableConfigList(tabelConfigList) {
            if (this.config.configuration) {
            } else {
                this.showModal = false;
                let pramas = {
                    'configString': tabelConfigList,
                    'subjectType': this.pageID
                };
                getList.post(pramas).then(() => {});
                this.tableList = tabelConfigList;
            }
        },
        tableConfigClose() {
            this.showModal = false;
        },
        dialogClose() {
            this.$refs.dialog.initData();
        },
        // 获取表格头保存参数
        getTableTitle() {
            if (this.config.configuration) {
                return new Promise((resolve) => {
                    resolve(() => {
                        this.checkedList = '';
                    });
                });
            } else {
                let pramas = {
                    subjectType: this.pageID
                };
                return getList.get(pramas).then(data => {
                    if (data.data) {
                        this.checkedList = data.data.configString;
                    } else {
                        this.checkedList = '';
                    }
                }).catch(() => {
                    this.checkedList = '';
                });
            }
        },
        initTitleList() {
            let laberString = [];
            if (this.checkedList === '') {
                this.config.table.columns.map(data => {
                    laberString.push(data.label);
                });
                laberString = laberString.join(',');
                this.tableList = laberString;
            } else {
                this.tableList = this.checkedList;
            }
        },
        getTitleList() {
            return this.getTableTitle().then(() => {
                this.showModal = true;
            });
        },
        // 表格内高级搜索
        tabAdvancedSearch(data, item, type, searchData) {
            this.$refs.searchList.detaliSearch(data, item, type, searchData);
        },
        tableAdvance(prop, advanceCode, data, code) {
            this.$refs.table.ruleForm[prop] = data;
            this.$refs.table.ruleForm[advanceCode] = code;
        },
        columnFilterSearch(data) {
            this.$refs.searchList.onSearchChange(data);
        },
        statusChange(status) {
            this.$refs.table.changeStatu(status);
        },
        moreAction(selection, index) {
            this.$emit('moreAction', selection, index);
        },
        rootListClick(item, to) {
            this.$emit('root-click', item, to);
        }
    },
    mounted() {
        this.getTableTitle().then(() => {
            this.initTitleList();
        });
    }
};
</script>
<style lang="less">
#mPanel4 {
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
    .page-text{
      display: flex;
      >div{
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        margin-right: 10px;
        .text-color{
          color: #00BCBF;
        }
      }
    }

    .btn-box{
      display: flex;
      justify-content: flex-end;
    }
    .row-bg{
      margin-top: 10px;
    }
    .allocation-box{
       margin-left: 10px;
    }
    .el-table {
        min-height: calc(~ '100vh - 166px');
        max-height: calc(~ '100vh - 166px');
    }

    .flex-table{
        display: flex;
        height: calc(50vh - 80px);
        #module-table{
            overflow: scroll;
        }
    }
}
</style>
