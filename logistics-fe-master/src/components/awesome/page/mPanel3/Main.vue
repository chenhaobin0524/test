<template>
    <div id="mPane3">
        <m-search-list :popPrefix="popPrefix" id="searchList" ref="searchList" :searchId="searchId" :list="config.searchList" :searchTotalTitle="searchTotalTitle" :optionNum="optionNum"
                       :configurationUrl="configurationUrl" :longPrefix="longPrefix" :advancePrefix="advancePrefix"
                       @onSearchChange="searchChange" @tableAdvance="tableAdvance" :pickerOptionsCustom='pickerOptionsCustom' :loading="loading" :autocomplete='config.searchList.autocomplete'>
          <div slot="table-module-btn" class="btn-box">
            <slot name="table-module-btn"></slot>
            <el-tooltip v-if="config.configuration?false: true" class="item allocation-box" effect="dark" content="配置列" placement="bottom">
              <el-button size="mini" class="el-icon-setting" @click="getTitleList"></el-button>
            </el-tooltip>
            <el-dialog :visible.sync="showModal" @close="dialogClose">
                <div slot="title" class="column-config-title">
                    列配置<small>请选择要显示的列(可拖拽排序)</small>
                </div>
                <configuration :checkedList="checkedList" :selectAllColumns="config.table.columns" ref="dialog"
                    @getTableConfigList="getTableConfigList" @tableConfigClose="tableConfigClose"></configuration>
            </el-dialog>
          </div>
        </m-search-list>
        <m-table
          ref="table"
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
          @btnSeparate="separateTable"
          @btnPrint="printTable"
          @btnDelete="delTable"
          @onSelectionChange="selectChange"
          @switch-change="switchChange"
          @column-filter-search="columnFilterSearch"
          @moreAction="moreAction"
          @celllick="celllick"
        >
        <template slot-scope="props" :slot="'custom-table-column-'+item.prop" v-for="item in customList">
            <slot :name="'custom-table-column-'+item.prop" :value="props"></slot>
        </template>
        </m-table>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12" class="page-text">
              <div v-if="config.table.selectBtn">
                已选<span class="text-color">&nbsp;&nbsp;{{checkedNum}}&nbsp;&nbsp;</span>项
              </div>
              <slot name="page-module-btn"></slot>
          </el-col>
          <el-col :span="12">
            <m-page ref="page" id="paging" :pageData="config.page" :total="pageTotal" @on-page-change="pageChange" @on-size-change="sizeChange"></m-page>
          </el-col>
        </el-row>
    </div>
</template>
<script>
import mSearchList from './mSearchList';
import mTable from './mTable';
import mPage from './mPage';
import configuration from './configuration-list';
import getList from './api';
import { mapGetters } from 'vuex';

export default {
    name: 'mPanel',
    components: { mTable, mSearchList, mPage, configuration },
    computed: {
        ...mapGetters(['menus'])
    },
    data() {
        return {
            checkedNum: 0,
            showModal: false,
            tableList: '',
            settingColumns: this.config.table.columns,
            checkedList: '',
            pageState: true,
            popPrefix: this.config.popPrefix ? this.config.popPrefix : '/api-mdm/dictionaryDetail/dict',
            advancePrefix: this.config.advancePrefix ? this.config.advancePrefix : '/api-mdm',
            longPrefix: this.config.longPrefix ? this.config.longPrefix : '/api-gwms/es/comboBox',
            configurationUrl: this.config.configurationUrl ? this.config.configurationUrl : '/api-auth',
            resourceCode: '',
            customList: []

        };
    },
    props: {
        config: Object,
        totalData: Array,
        pageTotal: Number,
        pageID: String,
        searchId: String,
        optionNum: String,
        loading: {
            type: Boolean,
            default() {
                return null;
            }
        },
        verification: {
            type: Object,
            default() {
                return {};
            }
        },
        searchTotalTitle: {
            type: Array,
            default() {
                return [];
            }
        },
        pickerOptionsCustom: {
            type: Array,
            default() {
                return null;
            }
        }
    },
    methods: {
        deepMenu(node) {
            const nodes = [];
            if (node) {
                nodes.push(node);
                const childrens = node.subResources;
                if (childrens) {
                    for (let i = 0; i < childrens.length; i++) {
                        if (childrens[i].frontUrl === this.$route.path) {
                            this.resourceCode = childrens[i].resourceCode;
                        } else {
                            this.deepMenu(childrens[i]);
                        }
                    }
                }
            }
        },
        // 表格中按钮触发事件
        checkTable(data) {
            this.$emit('check-btn', data);
        },
        editTable(data) {
            this.$emit('edit-btn', data);
        },
        separateTable(data) {
            this.$emit('separate-btn', data);
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
        rowDBClick(row, orow) {
            this.$emit('row-db-click', row, orow);
        },
        // 搜索内容变化
        searchChange(data) {
            this.$refs.page.pageState = false;
            this.$emit('searchChange', data);
            this.$nextTick(() => {
                this.$refs.page.pageState = true;
            });
        },
        // 分页器改变触发事件
        pageChange(page) {
            this.$emit('pageChange', page);
        },
        sizeChange(size) {
            this.$emit('sizeChange', size);
        },
        getTableConfigList(tabelConfigList, tabelConfigName) {
            if (this.config.configuration) {
            } else {
                this.showModal = false;
                const pramas = {
                    'configName': tabelConfigName,
                    'configNameCn': tabelConfigList,
                    'subjectType': this.pageID,
                    'moduleCode': this.resourceCode
                };
                getList.post(this.configurationUrl, pramas).then(() => {});
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
        async getTableTitle() {
            if (this.config.configuration) {
                return new Promise((resolve) => {
                    resolve(() => {
                        this.checkedList = '';
                    });
                });
            } else {
                const menu = { subResources: JSON.parse(JSON.stringify(this.menus)) };
                await this.deepMenu(menu);
                let allColumns = [];
                let allColumnsprop = [];
                this.config.table.columns.map(item => {
                    allColumns.push(item.label);
                    allColumnsprop.push(item.prop);
                });
                allColumns = allColumns.join(',');
                allColumnsprop = allColumnsprop.join(',');
                const pramas = {
                    'configName': allColumnsprop,
                    'configNameCn': allColumns,
                    'moduleCode': this.resourceCode,
                    'subjectType': this.pageID
                };
                return getList.get(this.configurationUrl, pramas).then(data => {
                    if (data.data.configNameCn) {
                        this.checkedList = data.data.configNameCn;
                    } else {
                        this.checkedList = allColumns;
                    }
                }).catch(() => {
                    this.checkedList = allColumns;
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
        changeLoading(status) {
            this.$refs.searchList.changeLoading(status);
        },
        moreAction(selection, index) {
            this.$emit('moreAction', selection, index);
        },
        celllick(column) {
            this.$emit('celllick', column);
        }
    },
    mounted() {
        this.getTableTitle().then(() => {
            this.initTitleList();
        });
        this.customList = this.config.table.columns.filter(item => { return item.type === 'custom'; });
    },
    watch: {
        totalData(newValue) {
            if (newValue.length) {
                const el = this.$refs.table.$el;
                const elTb = el.querySelector('.el-table');
                const elTbHeight = elTb.getBoundingClientRect().height;
                if (elTb.querySelector('.el-table__fixed-right')) {
                    elTb.querySelector('.el-table__fixed-right').style.height = (elTbHeight - 7) + 'px';
                }
                if (elTb.querySelector('.el-table__fixed-body-wrapper')) {
                    elTb.querySelector('.el-table__fixed-body-wrapper').style.height = (elTbHeight - 7 - 40) + 'px';
                }
            }
        }
    }
};
</script>
<style lang="less">
#mPane3 {
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
        height: calc(~ '100vh - 168px') !important;
    }
    .column-config-title small{
        margin-left: 25px;
    }
}
</style>
