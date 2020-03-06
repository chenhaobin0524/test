<template>
    <div id="module-table">
        <m-new-table class="el-table-box"  ref="mNewTable" :popPrefix="popPrefix" :tableData="tableData" @btn-event="btnEvent" :tableList="tableList" @tab-advanced-search="detaliSearch"
            @onSelectionChange='handleSelectionChange' :totalDate="totalDate" :loading="loading" v-if="totalDate.tableCut?totalDate.tableCut:false"
            @switch-change="switchChange"></m-new-table>
        <el-table class="el-table-box" v-loadmore="handelLoadmore" v-else ref='moduleTable'
        :data-size="tableData.length" :data="tableData.length >= 500 ? filteredData : tableData" border tooltip-effect='dark' v-loading="loading"
                  @selection-change="handleSelectionChange" :height="totalDate.height" @row-click='rowClick' @row-dblclick="rowDBclick">
            <el-table-column type="selection" width="40" :fixed="totalDate.fixedSeletionColumn?totalDate.fixedSeletionColumn:true" v-if="totalDate.selectBtn"></el-table-column>
            <el-table-column type="index" width="50" label="行号" v-if="totalDate.rowNo"></el-table-column>
            <el-table-column v-for="(item, index) in columnsList"
                             :key='index' :prop='item.prop' :label='item.label' :sortable="item.sort" :min-width="item.width?item.width : ''" :show-overflow-tooltip="true"
                             :fixed="item.fixedColumn==undefined ? false : (item.fixedColumn=='left' ? 'left' : false || item.fixedColumn=='right' ? 'right' : false) ">
                <template slot="header" slot-scope="scope">
                    <span>
                        <span v-if="item.columnFilter">
                            <el-select
                                clearable
                                class="filter-input"
                                v-model="headerFilterKV[item.prop]"
                                v-if="item.type === 'select'"
                                placeholder=''
                                :multiple="item.multiple?item.multiple:false"
                                @keyup.enter.native="filterSearch"
                                @keyup.113.native="filterSearch"
                                @change='filterSearch'
                                collapse-tags>
                                <el-option
                                    v-for="(val, index) in item.options"
                                    :key=index
                                    :label="val.label"
                                    :value="val.value">
                                </el-option>
                            </el-select>
                            <el-input
                                class="filter-input"
                                clearable
                                @clear="filterSearch"
                                v-else
                                v-model="headerFilterKV[item.prop]"
                                @keyup.enter.native="filterSearch"
                                @keyup.113.native="filterSearch"
                            ></el-input>
                        </span>
                        <div v-if="!item.columnFilter && hasColFilter" class="filter-box"></div>
                        <span class="table-header-mustFill" v-if="item.mustFill">* </span>
                        {{scope.column.label}}
                    </span>
                </template>
                <template slot-scope="{row}">
                    <slot v-if="item.type==='custom'" :name="'custom-table-column-'+item.prop" :value="row[item.prop]" :row="row"></slot>
                    <span v-else>{{row[item.prop]}}</span>
                </template>
            </el-table-column>
            <el-table-column :width="totalDate.leftWidth?totalDate.leftWidth : ''" v-if="totalDate.leftOperation&&hasAuth" fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <div class="action">
                        <div class="action-button" v-for="(item, index) in totalDate.action" :key="index" v-has='item.resourceId||""'>
                            <el-button
                                @click.stop=btnEvent(scope.row,item.event)
                                :type=item.type
                                v-show="!item.isHidden">
                                {{item.label}}
                            </el-button>
                        </div>
                        <el-dropdown v-if="totalDate.hasMoreAction&&hasMoreAuth">
                            <span class="el-dropdown-link mainColor">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item, index) in totalDate.MoreAction" :key="index" v-show="isShow(index, scope.row.showIndex)?true:false" v-has='item.resourceId||""'>
                                    <el-button @click='moreEvent(scope.row,index)' :type=item.type>{{item.label}}</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :closeOnClickModal=dialogClose
            :title="dialogText"
            :visible.sync="dialogVisible"
            width="60%">
            <el-form :model="ruleForm" :rules="verification" ref="ruleForm" label-width="100px" class="row-box">
                <el-form-item class="select-box" :label="item.label" :prop="item.prop" v-for="(item, index) in selectColumns" :key="index">
                    <div v-if="item.amendState && amendState">
                        <el-select v-model="ruleForm[item.prop]" v-if="item.type === 'select'" disabled>
                            <el-option v-for="(val, index) in item.options" :key='index' :label="val.label" :value="val.value"></el-option>
                        </el-select>
                        <el-checkbox v-else-if="item.type === 'checkbox'" v-model="ruleForm[item.prop]"></el-checkbox>
                        <el-input v-else v-model.number="ruleForm[item.prop]" disabled></el-input>
                    </div>
                    <div v-else>
                        <el-select :clearable="clearable" v-model="ruleForm[item.prop]" v-if="item.type === 'select'"
                                   :multiple="item.multiple?item.multiple:false">
                            <el-option v-for="(val, index) in item.options" :key=index :label="val.label" :value="item.ganged?(val.value+','+val.label):val.value"></el-option>
                        </el-select>
                        <el-select
                            v-else-if="item.type === 'autocomplete'"
                            v-model="ruleForm[item.prop]"
                            filterable
                            remote
                            clearable
                            :multiple="item.multiple?item.multiple:false"
                            reserve-keyword
                            :remote-method="remoteMethod"
                            @change="autocompleteSure"
                            @focus="searchDateChange(item)"
                            :loading="searchLoading">
                            <el-option
                                v-for="(item, optIndex) in options"
                                :key="optIndex"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-switch v-else-if="item.type === 'switch'" v-model="ruleForm[item.prop]" class="demo"
                                   :active-value="item.activeValue?item.activeValue:'Y'" :inactive-value="item.inactiveValue?item.inactiveValue:'N'" active-text="启用" inactive-text="停用">
                        </el-switch>
                        <el-input v-model="ruleForm[item.prop]" clearable
                                  @keyup.113.native="detaliSearch(item.prop, item, 2, ruleForm)"
                                  @keyup.enter.native="detaliSearch(item.prop, item, 2, ruleForm)"
                                  @blur="detaliSearchBlur(item.prop, item, 2, ruleForm)"
                                  @input="advanceCodeChange(item)"
                                  @clear="advanceCodeChange(item)"
                                  v-else-if="item.type === 'advance'">
                            <el-button slot="append" @click="detaliSearch(item.prop, item, 2, ruleForm)"
                                       icon="el-icon-search"></el-button>
                        </el-input>
                        <el-checkbox v-else-if="item.type === 'checkbox'" v-model="ruleForm[item.prop]" disabled></el-checkbox>
                        <el-input v-else-if="item.type === 'number'" v-model.number="ruleForm[item.prop]" clearable></el-input>
                        <el-date-picker
                            class='text-box'
                            v-else-if="item.type === 'time'"
                            v-model="ruleForm[item.prop]"
                            :type='item.timeType||"datetimerange"'
                            size='mini'
                            :clearable="timeClearable"
                            :format="item.format||'yyyy-MM-dd HH:mm:ss'"
                            :value-format="item.format||'yyyy-MM-dd HH:mm:ss'"
                            :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '开始日期'"
                            :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '结束日期'">
                        </el-date-picker>
                        <el-input v-else v-model="ruleForm[item.prop]" clearable></el-input>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="default" @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dataSure" :loading='saveLoading'>保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { dict, longRange } from '../mSearchList/api';
import mNewTable from '../mNewTable';
import { mapGetters } from 'vuex';
import utils from '@/utils/common';
import Vue from 'vue';

export default {
    directives: { // 自定义指令
        loadmore: {
            componentUpdated: utils.loadMore
        }
    },
    components: { mNewTable },
    name: 'mTable',
    data() {
        return {
            selectedRowsData: [],
            columnsList: [],
            // 远程搜索
            clearable: true,
            selectItem: [],
            options: [],
            searchLoading: false,
            headerFilterKV: {},
            dialogVisible: false,
            dialogClose: false,
            dialogText: '新建',
            amendState: false,
            rowData: {},
            ruleForm: {},
            selectColumns: [],
            initTableColumns: this.totalDate.columns,
            multipleSelection: [],
            hasColFilter: false,
            originData: [],
            currentStartIndex: 0,
            currentEndIndex: 20,
            timeClearable: true,
            saveLoading: false,
            hasAuth: false,
            hasMoreAuth: false
        };
    },
    props: {
        totalDate: Object,
        popPrefix: String,
        longPrefix: String,
        tableData: {
            type: Array
        },
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
        tableList: {
            type: String,
            default() {
                return '';
            }
        }
    },
    methods: {
        handelLoadmore (currentStartIndex, currentEndIndex) {
            this.currentStartIndex = currentStartIndex;
            this.currentEndIndex = currentEndIndex;
        },
        addRow() {
            // 新增一行，并进入行内编辑模式
            this.tableData.map(item => {
                delete item.editRow;
            });
            const obj = {};
            this.columnsList.map(item => {
                obj[item.prop] = '';
            });
            obj.editRow = true;
            this.tableData.unshift(obj);
        },
        handleSelectionChange(selection) {
            if (this.totalDate.isSingleSelect && selection.length >= 2) {
                const removeItem = selection[0];
                this.$refs.moduleTable.toggleRowSelection(removeItem);
                this.selectedRowsData = selection.splice(0, 1);
            } else {
                this.selectedRowsData = selection;
            }
            this.$emit('onSelectionChange', selection);
        },
        switchChange(data) {
            this.$emit('switch-change', data);
        },
        rowDBclick(row, column) {
            let originRow = {};
            if (row.id) {
                this.originData.map((item, index) => {
                    if (item.id === row.id) {
                        originRow = item;
                    }
                });
            }
            this.$emit('row-db-click', row, originRow);
        },
        btnEvent(selection, event) {
            const self = this;
            if (event === 'view') {
                self.$emit('btnView', selection);
            } else if (event === 'edit') {
                self.$emit('btnEdit', selection);
            } else if (event === 'delete') {
                self.$emit('btnDelete', selection);
            } else if (event === 'print') {
                self.$emit('btnPrint', selection);
            } else if (event === 'separate') {
                self.$emit('btnSeparate', selection);
            } else if (event === 'amend') {
                if (this.totalDate.name === 'stockInvTasks' && selection.status === '10') {
                    return;
                }
                const form = JSON.stringify(selection);
                this.ruleForm = JSON.parse(form);
                this.selectColumns.map(item => {
                    if (item.options) {
                        item.options.map(data => {
                            if (data.label === this.ruleForm[item.prop]) {
                                this.ruleForm[item.prop] = data.value;
                            }
                        });
                    }
                    if (item.type === 'checkbox') {
                        if (this.ruleForm[item.prop] === 'Y') {
                            this.ruleForm[item.prop] = true;
                        } else {
                            this.ruleForm[item.prop] = false;
                        }
                    }
                });
                this.dialogText = '修改';
                this.amendState = true;
                this.dialogVisible = true;
            }
        },
        moreEvent(selection, index) {
            this.$emit('moreAction', selection, index);
        },
        isShow(index, showIndexs) {
            if (typeof showIndexs === 'object') {
                if (showIndexs.length > 0) {
                    let temp = false;
                    showIndexs.forEach(sIndex => {
                        if (sIndex === index) {
                            temp = true;
                        }
                    });
                    return temp;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        rowClick(rows) {
            this.rowData = rows;
            let checked = false;
            this.selectedRowsData.map(item => {
                if (item === rows) {
                    checked = true;
                }
            });
            if (rows) {
                rows = [rows];
                rows.forEach(row => {
                    if (checked) {
                        this.$refs.moduleTable.toggleRowSelection(row, false);
                    } else {
                        this.$refs.moduleTable.toggleRowSelection(row, true);
                    }
                });
            }
            this.$emit('rowClick', rows);
        },
        addData() {
            this.initRuleForm();
            this.dialogText = '新建';
            this.dialogVisible = true;
            this.amendState = false;
        },
        dataSure() {
            this.saveLoading = true;
            const that = this;
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    const data = JSON.parse(JSON.stringify(this.ruleForm));
                    for (var a in data) {
                        if (typeof data[a] === 'string') {
                            data[a] = data[a].replace(/(^\s*)|(\s*$)/g, '');
                        }
                    }
                    this.selectColumns.map(item => {
                        if (item.type === 'checkbox') {
                            if (data[item.prop] === true) {
                                data[item.prop] = 'Y';
                            } else {
                                data[item.prop] = 'N';
                            }
                        }
                        if (item.type === 'select' && item.ganged) {
                            const gangedData = data[item.prop].split(',');
                            data[item.ganged] = gangedData[1];
                            data[item.prop] = gangedData[0];
                        }
                    });
                    this.$emit('save-data', data);
                } else {
                    this.$refs.moduleTable.toggleRowSelection(valid, true);
                    this.saveLoading = false;
                }
            });
            setTimeout(() => {
                that.saveLoading = false;
            }, 2000);
        },
        // 远程搜索
        remoteMethod(query) {
            this.options = [];
            let searchData;
            if (query) {
                searchData = query.replace(/\s*/g, '');
            } else {
                searchData = '';
            }
            const params = {
                [this.selectItem.tableName]: {
                    [this.selectItem.prop]: searchData,
                    [this.selectItem.ganged]: searchData
                }
            };
            if (this.selectItem.relevanceOne) {
                params[this.selectItem.tableName][this.selectItem.relevanceOne] = this.ruleForm[this.selectItem.relevanceOne];
            }
            if (this.selectItem.relevanceTwo) {
                params[this.selectItem.tableName][this.selectItem.relevanceTwo] = this.ruleForm[this.selectItem.relevanceTwo];
            }
            longRange(this.longPrefix, params).then(data => {
                const restaurants = [];
                data.data[this.selectItem.tableName].map(search => {
                    if (this.selectItem.gangeds) {
                        const gangedsMap = {
                            value: search[this.selectItem.ganged],
                            label: search[this.selectItem.prop]
                        };
                        this.selectItem.gangeds.map(item => {
                            gangedsMap[item] = search[item];
                        });
                        restaurants.push(gangedsMap);
                    } else {
                        restaurants.push({ 'value': search[this.selectItem.ganged], 'label': search[this.selectItem.prop] });
                    }
                });
                this.searchLoading = true;
                setTimeout(() => {
                    this.searchLoading = false;
                    this.options = restaurants.filter(item => {
                        return item.label.toLowerCase()
                            .indexOf(searchData.toLowerCase()) > -1;
                    });
                }, 20);
            });
        },
        searchDateChange(item) {
            this.selectItem = item;
            this.remoteMethod();
        },
        autocompleteSure(data) {
            let selectName = '';
            let selectCode = '';
            let gangeds1 = '';
            let gangeds2 = '';
            const nameList = [];
            const codeList = [];
            if (this.selectItem.relevanceClear) {
                this.selectItem.relevanceClear.map(item => {
                    this.ruleForm[item] = '';
                });
            }
            if (typeof (data) === 'string') {
                this.options.map(item => {
                    if (item.value === data) {
                        selectName = item.label;
                        selectCode = item.value;
                        if (this.selectItem.gangeds) {
                            gangeds1 = item[this.selectItem.gangeds[0]];
                            gangeds2 = item[this.selectItem.gangeds[1]];
                        }
                    }
                });
            } else {
                this.options.map(item => {
                    data.map(selectList => {
                        if (item.value === selectList) {
                            nameList.push(item.label);
                            codeList.push(item.value);
                        }
                    });
                });
                selectName = nameList.join(',');
                selectCode = codeList.join(',');
            }
            this.ruleForm[this.selectItem.ganged] = selectCode;
            this.ruleForm[this.selectItem.prop] = selectName;
            if (this.selectItem.gangeds) {
                this.ruleForm[this.selectItem.gangeds[0]] = gangeds1;
                this.ruleForm[this.selectItem.gangeds[1]] = gangeds2;
            }
        },
        // 下拉框字典查询
        getOptionList() {
            const optionList = [];
            const optiondata = [];
            let optionString = '';
            const numList = [];
            this.initTableColumns.map((columns, index) => {
                if (columns.optionNum) {
                    optionList.push(columns.optionNum);
                    numList.push(index);
                }
            });
            if (optionList.length !== 0) {
                optionString = optionList.join(',');
                const params = {};
                params.dictCodes = optionString;
                if (window.location.pathname !== '/gwms.html') {
                    params.tenantCode = this.currentTenant.tenantCode;
                };
                dict(this.popPrefix, params).then(list => {
                    optionList.map(num => {
                        const option = [];
                        for (const key in list.data[num]) {
                            if (list.data[num].hasOwnProperty(key)) {
                                option.push({ 'value': key, 'label': list.data[num][key] });
                            }
                        }
                        optiondata.push(option);
                    });
                    numList.map((data, index) => {
                        this.initTableColumns[data].options = optiondata[index];
                    });
                    this.getColumnsList();
                }).then(() => {
                    this.initSelectColumns();
                    this.dataInit();
                });
            } else {
                this.initSelectColumns();
                this.dataInit();
            }
        },
        // 高级搜索
        advanceCodeChange(index) {
            this.ruleForm[index.advanceCode] = '';
        },
        detaliSearchBlur(data, item, type, searchData) {
            const detaliData = this.ruleForm[data].replace(/\s*/g, '');
            if (detaliData !== '') {
                this.detaliSearch(data, item, type, searchData);
            }
        },
        detaliSearch(data, item, type, searchData) {
            if (!searchData) {
                searchData = '';
            }
            this.$emit('tab-advanced-search', data, item, type, searchData);
        },
        initSelectColumns() {
            this.selectColumns = [];
            this.initTableColumns.map(item => {
                if (item.require) {
                    this.selectColumns.push(item);
                }
            });
        },
        initRuleForm() {
            this.ruleForm = {};
            this.selectColumns.map(data => {
                if (data.multiple) {
                    this.$set(this.ruleForm, data.prop, []);
                } else if (data.type === 'switch') {
                    this.$set(this.ruleForm, data.prop, data.default ? data.default : 'Y');
                } else {
                    if (data.data) {
                        this.$set(this.ruleForm, data.prop, data.data);
                    } else {
                        this.$set(this.ruleForm, data.prop, '');
                    }
                }
            });
        },
        dataInit() {
            this.originData = JSON.parse(JSON.stringify(this.tableData));
            if (this.totalDate.tableCut) {
            } else {
                this.tableData.map(item => {
                    this.initTableColumns.map(columns => {
                        if (columns.options) {
                            columns.options.map(option => {
                                if (option.value === item[columns.prop]) {
                                    item[columns.prop] = option.label;
                                }
                            });
                        }
                    });
                });
                this.originData.map(item => {
                    this.initTableColumns.map(columns => {
                        if (columns.options) {
                            columns.options.map(option => {
                                if (option.value === item[columns.prop] || option.label === item[columns.prop]) {
                                    item[columns.prop] = {
                                        name: option.label,
                                        value: option.value
                                    };
                                }
                            });
                        }
                    });
                });
            }
        },
        filterSearch() {
            this.$emit('column-filter-search', this.headerFilterKV);
        },
        changeStatu(status) {
            this.dialogVisible = status;
            this.$message.success('保存成功！');
        },
        getOriginData(id) {
            let data = {};
            this.originData.map(item => {
                if (id === item.id) {
                    data = item;
                }
            });
            return data;
        },
        getColumnsList() {
            const datas = this.tableList.split(',');
            const columnsList = [];
            this.headerFilterKV = {};
            datas.map(title => {
                this.initTableColumns.map(data => {
                    if (data.label === title) {
                        columnsList.push(data);
                        this.$set(this.headerFilterKV, data.prop, '');
                        if (data.columnFilter) this.hasColFilter = true;
                    }
                });
            });
            this.columnsList = columnsList;
        }
    },
    mounted() {
        if (this.totalDate.action) {
            const actions = this.totalDate.action.concat(this.totalDate.MoreAction || []);
            const mvue = Vue.prototype;
            actions.map(item => {
                const auth = mvue.$_has(item.resourceId);
                if (auth || item.resourceId === undefined) {
                    this.hasAuth = true;
                }
            });
            if (this.hasAuth === true) {
                if (this.totalDate.MoreAction) {
                    this.totalDate.MoreAction.map(item => {
                        const auth = mvue.$_has(item.resourceId);
                        if (auth || item.resourceId === undefined) {
                            this.hasMoreAuth = true;
                        }
                    });
                }
            } else {
                this.hasMoreAuth = true;
            }
        }
    },
    created() {
        this.getOptionList();
    },
    watch: {
        tableList: function () {
            this.getColumnsList();
        },
        tableData: function() {
            this.dataInit();
        },
        dialogVisible: function() {
            if (this.dialogVisible === false) {
                this.$refs.ruleForm.resetFields();
                this.saveLoading = false;
            }
        }
    },
    computed: {
        filteredData () {
            return this.tableData.filter((item, index) => {
                if (index < this.currentStartIndex) {
                    return false;
                } else if (index > this.currentEndIndex) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        ...mapGetters(['currentTenant'])
    }
};
</script>
<style lang="less">
    #module-table {
        .el-table-box{
            border-bottom: solid 1px #EBEEF5;
        }
        .module-table {
            margin: 12px 0;
        }
        .action{
            .el-button{
                flex: 1;
            }
        }
        .el-table__body tr.selected-row>td {
            background: #F1F8FA !important;
        }
        .error-active input{
            border-color: red;
        }
        .demo .el-switch__label {
            position: absolute;
            display: none;
            color: #fff;
        }
        /*打开时文字位置设置*/
        .demo .el-switch__label--right {
            z-index: 1;
            right: -10px;
        }
        /*关闭时文字位置设置*/
        .demo .el-switch__label--left {
            z-index: 1;
            left: 26px;
        }
        /*显示文字*/
        .demo .el-switch__label.is-active {
            display: block;
        }
        .demo.el-switch .el-switch__core,
        .el-switch .el-switch__label {
            width: 60px !important;
        }
        // 弹框
        .row-box{
            margin: 12px 0;
            display: flex;
            flex-wrap: wrap;
            .select-box{
                width: 100% / 3;
            }
            .name-box{
                display: inline-block;
                text-align: right;
                width: 16%;
                padding-right: 4%;
            }
            .el-form-item__error {
                top: 80%;
            }
        }
        .el-dialog__body{
            padding: 0 16px!important;
        }
        th .cell .el-input {
            display: block;
            line-height: 28px;
            padding: 0;
            margin-top: 6px;
        }
        th .cell .el-select {
            display: block;
            line-height: 28px;
            padding: 0;
        }
        th .cell .filter-input{
            line-height: 24px;
            .el-input__inner{
                height: 24px;
                line-height: 24px;
            }
        }
        .row-box-end{
            margin: 0;
        }
        .el-form-item{
            margin-bottom: 4px;
        }

        .self-define-input{
            display: block
        }
        .filter-box{
            height: 28px;
            display: block;
            border-bottom: 1px solid #EBEEF5;
        }
        .mainColor{
            color: #00bcbf
        }
        .action {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .el-date-editor.el-input {
            width: 180px;
        }
        .action-button {
            display: inline-block;
            flex: 1;
        }
        .el-form-item__content .el-input-group {
            vertical-align: middle;
        }
    }
</style>
