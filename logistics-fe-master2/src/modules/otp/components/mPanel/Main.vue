<template>
    <div id="mPanel4" style="height:100%">
        <m-search-list :popPrefix="popPrefix" ref="searchList" :searchId="searchId" :list="config.searchList" :searchTotalTitle="searchTotalTitle" :optionNum="optionNum"
                       :configurationUrl="configurationUrl" :longPrefix="longPrefix" :advancePrefix="advancePrefix" :searchSetTitle="searchSetTitle"
                       @onSearchChange="searchChange" @tableAdvance="tableAdvance">
          <div slot="table-module-btn" class="btn-box">
            <slot name="table-module-btn"></slot>
            <el-tooltip v-if="config.configuration?false: true" class="item allocation-box" effect="dark" content="列配置" placement="bottom">
              <el-button size="mini" class="el-icon-setting" @click="getTitleList"></el-button>
            </el-tooltip>
            <el-dialog :visible.sync="showModal" title="列配置" @close="dialogClose">
              <configuration :checkedList="checkedList" :selectAllColumns="config.table.columns" ref="dialog"
                             @getTableConfigList="getTableConfigList" @tableConfigClose="tableConfigClose" :columnNum='columnNum'></configuration>
            </el-dialog>
          </div>
        </m-search-list>
        <div class="flex-table">
            <div class='table-title' v-if="config.table.seperateTree">{{sourceTitle}}
                <ul class='table-lists'><el-main v-loading="sourceTreeLoading">
                    <el-scrollbar>
                    <li class="list-details" v-for="(item, index) in sourceRootData" :key="index"
                        :class="{ 'active': mulSourceSel ? item.isActive : 'source'+index == sourceCurrent}"
                        @click="rootListClick(item, 'source', index)">{{item.textLeft}}</li>
                    </el-scrollbar>
                </el-main></ul>
            </div>
            <!-- <el-scrollbar> -->
                <m-table
                    ref="table"
                    class="source-table"
                    :popPrefix="popPrefix"
                    :longPrefix="longPrefix"
                    :verification="verification"
                    :tableConfig="config.table"
                    :tableData="totalData"
                    :tableList="tableList"
                    :loading="sourceLoading"
                    @tab-advanced-search="tabAdvancedSearch"
                    @row-db-click="rowDBClick"
                    @save-data="saveData"
                    @btnView="checkTable"
                    @btnEdit="editTable"
                    @btnPrint="printTable"
                    @btnDelete="delTable"
                    @btnAllocate="allocateTable"
                    @btnCancleAllocate="cancleAllocateTable"
                    @onSelectionChange="sourceSelectChange"
                    @switch-change="switchChange"
                    @column-filter-search="columnFilterSearch"
                    @moreAction="moreAction"
                    @onCellDblclick="sourceCellDblclick"
                >
                    <div slot="expand-table-content" slot-scope="{expandProps}"><slot name="expand-table-cont" :expandTable="expandProps"></slot></div>
                </m-table>
            <!-- </el-scrollbar> -->
        </div>
        <div class="flex-table table-header" v-if="config.tableTarget">
            <div class='table-title' v-if="config.tableTarget.seperateTree"><span :class="isRefreshTarget ? 'target-list' : ''" @click="refreshTarget">{{targetTitle}}</span><span class="table-input">
                <el-input v-show="isCondition" @keyup.enter.native="searchInput" v-model="input" clearable :placeholder="config.tableTarget.funnelPlaceholder"
                @clear="searchInput" class="funnel-placeholder"></el-input>
                <img v-show="isShowImg" @click="showInput" class="table-img" src="@/assets/漏斗@2x.png" alt="">
            </span>
                <ul class='table-lists'>
                    <el-scrollbar>
                        <li class="list-details" v-for="(item, index) in targetRootData" :key="index"
                            :class="{ 'active': 'target'+index == targetCurrent, 'toBeConfirm': (item.intelligentStatus == '10' || (item.intelligentStatus == '30' && item.intelligentFlag == '10')) }"
                            @click="rootListClick(item, 'target', index)"
                            v-html="item.html"></li>
                    </el-scrollbar>
                </ul>
            </div>
            <slot name="target-table-header"></slot>
            <!-- <el-scrollbar> -->
                <m-table
                    ref="targetTable"
                    class="target-table"
                    :popPrefix="popPrefix"
                    :longPrefix="longPrefix"
                    :verification="verification"
                    :tableConfig="config.tableTarget"
                    :tableData=totalTargetData
                    :tableList="tableList"
                    :loading="targetLoading"
                    @tab-advanced-search="tabAdvancedSearch"
                    @row-db-click="rowDBClick"
                    @save-data="saveData"
                    @btnView="checkTable"
                    @btnEdit="editTable"
                    @btnPrint="printTable"
                    @btnDelete="delTable"
                    @onSelectionChange="targetSelectChange"
                    @switch-change="switchChange"
                    @column-filter-search="columnFilterSearch"
                    @moreAction="moreAction"
                    @onCellDblclick="targetCellDblclick"
                >
                    <div slot="expand-table-content" slot-scope="{expandProps}"><slot name="expand-table-cont" :expandTable="expandProps"></slot></div>
                </m-table>
            <!-- </el-scrollbar> -->
            <slot class="target" name="target-table-right"></slot>
        </div>
        <el-row type="flex" class="row-bg" justify="space-between" v-if="!config.transferTables">
          <el-col :span="12" class="page-text">
              <div v-if="config.table.selectBtn">
                已选<span class="text-color">&nbsp;&nbsp;{{checkedNum}}&nbsp;&nbsp;</span>项
              </div>
              <slot name="page-module-btn"></slot>
          </el-col>
          <el-col :span="12" v-if="!config.transferTables">
            <m-page ref="page" :pageData="config.page" :total="pageTotal" @on-page-change="pageChange" @on-size-change="sizeChange"></m-page>
          </el-col>
        </el-row>
    </div>
</template>
<script>
import mSearchList from '@/components/otpPanel/mSearchList';
import mTable from '@/components/otpPanel/mTable';
import mPage from '@/components/awesome/page/mPanel3/mPage';
import configuration from '@/components/awesome/page/mPanel3/configuration-list';
import getList from '@/components/awesome/page/mPanel3/api';
import { mapGetters } from 'vuex';

export default {
    name: 'mPanel',
    components: { mTable, mSearchList, mPage, configuration },
    computed: {
        ...mapGetters(['menus'])
    },
    data() {
        return {
            isCondition: false,
            isShowImg: true,
            input: '',
            sourceCurrent: '',
            targetCurrent: '',
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
            targetLoading: false,
            sourceLoading: false,
            sourceTreeLoading: false
        };
    },
    props: {
        config: Object,
        totalData: Array,
        totalTargetData: Array,
        sourceRootData: Array,
        targetRootData: Array,
        pageTotal: Number,
        sourceTitle: String,
        targetTitle: String,
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
        },
        endMoveHeight: {
            type: Number,
            default() {
                return 0;
            }
        },
        columnNum: Number,
        mulSourceSel: Boolean,
        isRefreshTarget: {
            type: Boolean,
            default: false
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
        showInput() {
            this.isShowImg = false;
            this.isCondition = true;
        },
        // 漏斗切换搜索事件
        searchInput(ev) {
            this.$emit('search-input', this.input, ev);
        },
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
        allocateTable(data) {
            this.$emit('allocate-btn', data);
        },
        cancleAllocateTable(data) {
            this.$emit('cancleAllocate-btn', data);
        },
        saveData(data) {
            this.$emit('saveData', data);
        },
        // 表单选项变化
        sourceSelectChange(data) {
            this.$emit('source-select-change', data);
            this.checkedNum = data.length;
        },
        targetSelectChange(data) {
            this.$emit('target-select-change', data);
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
            // this.$refs.page.pageState = false;
            this.$emit('searchChange', data);
            // this.$nextTick(() => {
            //     this.$refs.page.pageState = true;
            // });
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
                this.config.table.columns.map((item, index) => {
                    if (this.columnNum && index >= this.columnNum) {
                    } else {
                        allColumns.push(item.label);
                        allColumnsprop.push(item.prop);
                    }
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
                        this.checkedList = this.config.table.initTableLabels ? this.config.table.initTableLabels : allColumns;
                    }
                }).catch(() => {
                    this.checkedList = this.config.table.initTableLabels ? this.config.table.initTableLabels : allColumns;
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
        rootListClick(item, to, index) {
            this.$emit('root-click', item, to);
            if (to === 'source') {
                this.sourceCurrent = to + index;
            } else if (to === 'target') {
                this.targetCurrent = to + index;
            }
        },
        targetTableEndMove(moveHeight) {
            const targetTabelEl = document.getElementById('mPanel4').getElementsByClassName('flex-table');
            const targetTabelE2 = document.getElementById('mPanel4').getElementsByClassName('table-header');
            targetTabelEl[0].style.height = `calc((100% - 50px)/2 - ${this.endMoveHeight}px - ${moveHeight}px)`;
            targetTabelE2[0].style.height = `calc((100% - 50px)/2 + ${this.endMoveHeight}px + ${moveHeight}px)`;
        },
        initActiveChange() {
            this.sourceCurrent = '';
            this.targetCurrent = '';
            this.input = '';
        },
        sourceCellDblclick(row, column, cell, event) {
            this.$emit('sourceCellDblclick', row, column, cell, event);
        },
        targetCellDblclick(row, column, cell, event) {
            this.$emit('targetCellDblclick', row, column, cell, event);
        },
        refreshTarget() {
            this.$emit('refreshTarget');
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
        height: 100% !important;
    }

    .flex-table{
        display: flex;
        height: calc((100% - 50px) /2);
        // height: calc(50vh - 0px);
        .funnel-placeholder {
            .el-input__inner {
                padding-right: 4px;
            }
        }
        .el-scrollbar {
            width: 100%;
            height: 100%;
        }
        .source-table, .target-table {
            width: 100%;
        }
        .table-title{
            height:100%;
            // height:38px;
            line-height: 35px;
            font-size:14px;
            text-indent: 10px;
            color:#333;
            background-color: #f0f0f0;

            .table-lists{
                width:198px;
                // height: calc(50vh - 0px);
                border:1px solid #f0f0f0;
                overflow: auto;
                height: calc(100% - 38px);
                // height: 273px;
                background: #fff;
                color: #333;
                .list-details{
                    cursor: pointer;
                }
                .el-main {
                    height: 100%;
                }
                .el-scrollbar {
                    height: 100%;
                    .el-scrollbar__wrap {
                        overflow-x: hidden;
                    }
                    .el-scrollbar__bar.is-vertical {
                        width: 10px;
                        border-radius: 5px;
                    }
                    .el-scrollbar__bar.is-horizontal {
                        height: 10px;
                        border-radius: 5px;
                    }
                }
            }
            .target-list {
                cursor: pointer;
                color: #00bcbf;
            }
        }

        .table-input{
            height: 35px;
            line-height: 35px;
            width: 100px;
            display: flex;
            position: absolute;
            top: 0px;
            left: 76px;
            .table-img{
                width: 16px;
                height: 16px;
                margin-top: 12px;
                position: absolute;
                right: 0;
                cursor: pointer;
            }
            .el-input__icon{
                width:25px !important;
            }
        }

        .otp-table {
            overflow-x: hidden;
            overflow-y: scroll;
        }
    }

    .table-header{
        position: relative;
    }

    .target-table-header{
        display: block;
        position: absolute;
        left: 200px;
        z-index: 100;
        width: calc(100% - 254px);
        height: 34px;
        padding: 0 0 0 5px;
        margin-left: 40px;
        line-height: 34px;
        background: #f2f2f2;
        .flex{
            display: flex;
            justify-content: space-between;
        }
        .right {
            margin-right: 22px;
        }
    }

    .target{
        z-index: 999;
    }

    .active{
        color:#00BCBF;
    }
    .toBeConfirm {
        color: red;
    }
    .toBeConfirm.active {
        color: #ee6773;
    }
}
</style>
