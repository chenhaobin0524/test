<template>
    <div class="otp-table">
        <m-new-table class="el-table-box"  ref="mNewTable"
            v-if="tableConfig.tableCut?tableConfig.tableCut:false"
            :tableConfig="tableConfig" :loading="loading"
            :popPrefix="popPrefix" :tableData="tableData"
            :tableList="tableList"
            @element-change="(data) => $emit('element-change', data)"
            @btn-event="btnEvent"
            @onSelectionChange='handleSelectionChange'></m-new-table>
        <el-table class="el-table-box" v-else ref='moduleTable' :data="tableData2" border tooltip-effect='dark' v-loading="loading"
                @selection-change="handleSelectionChange" :height="tableConfig.height" @row-click='rowClick' @row-dblclick="rowDBclick"
                @expand-change="handleExpandChange" :row-key="getRowKeys" :expand-row-keys="expandsRowkeys"
                :row-class-name="tableRowClassName"
                @cell-dblclick="handleCellDblclick">
            <el-table-column type="selection" width="40" :fixed="tableConfig.fixedSeletionColumn?true:false" v-if="tableConfig.selectBtn"></el-table-column>
            <el-table-column v-if="tableConfig.expandTable" type="expand">
                <template slot-scope="props">
                    <slot name="expand-table-content" :expandProps="props.row"></slot>
                </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in columnsList"
                             :key='index' :prop='item.prop' :label='item.label' :sortable="item.sort" :min-width="item.width?item.width : ''" :show-overflow-tooltip="true"
                             :fixed="item.fixedColumn==undefined ? false : (item.fixedColumn=='left' ? 'left' : false || item.fixedColumn=='right' ? 'right' : false) ">
                <template slot="header" slot-scope="scope">
                    <span class="table-header-mustFill" v-if="item.mustFill">* </span>
                    {{scope.column.label}}
                </template>
                <template slot-scope="scope">
                    <div v-if='item.type === "photos"'>
                        <div v-if='scope.row.showPhotos' style="line-height: 0px;">
                            <img src="@/assets/photos.png" @click.stop='$emit("btnEvent", "photos", scope.row)' @dblclick.stop="" style="width: 20px; cursor: pointer;">
                        </div>
                        <div v-else-if="scope.row.noShowPhotos"></div>
                        <div v-else>
                            <el-button size="mini" type='text' @click.stop='$emit("btnEvent", "upload", scope.row)' @dblclick.stop="" v-if='item.ifHas' v-has='item.ifHas'>上传</el-button>
                            <el-button size="mini" type='text' @click.stop='$emit("btnEvent", "upload", scope.row)' @dblclick.stop="" v-else>上传</el-button>
                        </div>
                    </div>
                    <div v-else-if='item.type === "trajectory"'>
                         <div style="line-height: 0px;">
                            <img src="@/assets/gps.png" @click.stop='$emit("btnEvent", "trajectory", scope.row)' @dblclick.stop="" style="width: 20px; cursor: pointer;">
                        </div>
                    </div>
                    <div v-else-if="item.type==='button'">
                        <el-button type="text"
                            size="mini"
                            @click.stop='$emit("btnClick",scope.row[item.prop],scope.$index,scope.row)'>
                            {{scope.row[item.prop]}}
                        </el-button>
                    </div>
                    <div v-else-if='item.type === "detail"'>
                        <el-button size="mini" type='text' @click.stop='$emit("btnEvent", "detail", scope.row)' @dblclick.stop="">{{item.buttonName ? item.buttonName : '明细'}}</el-button>
                    </div>
                    <template v-else>
                        {{item.type!=='select'&&item.type!=='cascader'?scope.row[item.prop]:selectToNormal(item, scope.row)}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column :width="tableConfig.leftWidth?tableConfig.leftWidth : ''" v-if="tableConfig.leftOperation" fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <div class="action">
                        <span v-if="!tableConfig.customBtn">
                            <span
                                v-for="(item, index) in tableConfig.action"
                                :key="index">
                                <span v-if="item.ifHas" v-has="item.ifHas" :class="{pad:!([].concat(scope.row.hiddenEvent).includes(item.event))}">
                                    <el-button
                                        size="mini"
                                        @click.stop=btnEvent(scope.row,item.event) :type=item.type
                                        v-if="!([].concat(scope.row.hiddenEvent).includes(item.event))">
                                        {{item.label}}
                                    </el-button>
                                </span>
                                <span v-else :class="{pad:!([].concat(scope.row.hiddenEvent).includes(item.event))}">
                                    <el-button
                                        size="mini"
                                        @click.stop=btnEvent(scope.row,item.event) :type=item.type
                                        v-if="!([].concat(scope.row.hiddenEvent).includes(item.event))">
                                        {{item.label}}
                                    </el-button>
                                </span>
                            </span>
                        </span>
                        <template v-else>
                            <span v-for="(item, index) in tableConfig.action" :key="index">
                                <span v-for="(child,i) in item" :key="i">
                                    <span v-if="item.ifHas" v-has="item.ifHas">
                                        <el-button size="mini" @click.stop=btnEvent(scope.row,child.event) :type=child.type
                                            v-if="child.displayCode===scope.row[tableConfig.btnDisplayCredentials[index]]">
                                            {{child.label}}
                                        </el-button>
                                    </span>
                                    <template v-else>
                                        <el-button size="mini" @click.stop=btnEvent(scope.row,child.event) :type=child.type
                                            v-if="child.displayCode===scope.row[tableConfig.btnDisplayCredentials[index]]">
                                            {{child.label}}
                                        </el-button>
                                    </template>
                                </span>
                            </span>
                        </template>
                        <el-dropdown v-if="tableConfig.hasMoreAction">
                            <span class="el-dropdown-link mainColor">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item, index) in tableConfig.MoreAction" :key="index" v-show="!!isShow(index, scope.row.showIndex)">
                                    <span v-if="item.ifHas" v-has="item.ifHas">
                                        <el-button size="mini" @click='moreEvent(scope.row,index)' :type=item.type>{{item.label}}</el-button>
                                    </span>
                                    <template v-else>
                                        <el-button size="mini" @click='moreEvent(scope.row,index)' :type=item.type>{{item.label}}</el-button>
                                    </template>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import _ from '@/components/lots/utils';
import { dict } from '../api';
import mNewTable from '../mNewTable';

export default {
    components: { mNewTable },
    name: 'mTable',
    data() {
        return {
            columnsList: [],
            ruleForm: {},
            initTableColumns: this.tableConfig.columns,
            expandsRowkeys: [],
            selectedRowsData: [],
            tableData2: []
        };
    },
    props: {
        tableConfig: Object,
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
        tableRowClassName({ row }) {
            if (this.selectedRowsData && this.selectedRowsData.map(item => item.id).includes(row.id)) {
                return 'highlight-row';
            }
        },
        addRow() {
            // 新增一行，并进入行内编辑模式
            this.$refs.mNewTable.addRow();
        },
        getRowKeys(row) {
            if (!row.expandsRandomKey) row.expandsRandomKey = row.id + Math.random().toString().substr(-10);
            return row.expandsRandomKey;
        },
        handleSelectionChange(selection) {
            this.selectedRowsData = selection;
            this.$emit('onSelectionChange', selection);
        },
        rowDBclick(row) {
            this.$emit('row-db-click', row);
        },
        _toFirstCharUpper(str) {
            return _.isString(str) ? str[0].toUpperCase() + str.substr(1) : '';
        },
        btnEvent(selection, event) {
            this.$emit(`btn${this._toFirstCharUpper(event)}`, selection);
            this.$emit('btnEvent', event, selection);
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
            rows.checked = !rows.checked;
            this.$refs.moduleTable.toggleRowSelection(rows, rows.checked);
        },
        // 下拉框字典查询
        getOptionList(columnsList) {
            const optionList = [];
            const numList = [];
            columnsList.map((columns, index) => {
                if (columns.optionNum) {
                    optionList.push(columns.optionNum);
                    numList.push(index);
                }
            });
            if (optionList.length !== 0) {
                const params = {
                    dictCodes: optionList.join(','),
                    tenantCode: this.currentTenant.tenantCode
                };
                dict(this.popPrefix, params).then(list => {
                    const optiondata = optionList.map(num => {
                        const option = [];
                        for (const key in list.data[num]) {
                            if (list.data[num].hasOwnProperty(key)) {
                                option.push({ 'value': key, 'label': _.get(list, `data.${num}.${key}`, '') });
                            }
                        }
                        return option;
                    });
                    numList.map((data, index) => {
                        columnsList[data].options = optiondata[index];
                    });
                });
            }
            this.tableData2 = [];
            this.columnsList = columnsList;
            this.dataInit();
        },
        dataInit(list) {
            if (list) {
                this.tempTableData = _.clone(list);
            }
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$nextTick(() => {
                    this.tableData2 = this.tempTableData;
                });
            }, 50);
        },
        selectToNormal(col, row) {
            // 为空，为0，为空数组时返回''
            if ((!row[col.prop] && row[col.prop] !== 0) || (_.isArray(row[col.prop]) && row[col.prop].length === 0)) {
                return '';
            }
            // 下拉框变为正常时显示值的改变
            let result = null;
            if (col.type === 'select') {
                if (_.isArray(row[col.prop])) {
                    result = row[col.prop].map(val => {
                        const options = _.get(col, 'options', []);
                        return _.get(options.find(item => item.value === val || item.label === val), 'label', '');
                    }).join(',');
                } else {
                    const options = _.get(col, 'options', []);
                    result = _.get(options.find(item => item.value === row[col.prop] || item.label === row[col.prop]), 'label', '');
                }
            } else if (col.type === 'addressSelect') {
                result = row[col.labelCn];
            } else {
                result = row[col.prop];
            }
            return result || '';
        },
        handleExpandChange(row, expandedRows) {
            var that = this;
            that.expandsRowkeys = [];
            if (row && expandedRows.length) {
                that.expandsRowkeys.push(row.expandsRandomKey);
            }
        },
        handleCellDblclick(row, column, cell, event) {
            this.$emit('onCellDblclick', row, column, cell, event);
        }
    },
    watch: {
        tableData: function(list) {
            this.dataInit(list);
        },
        tableList: function (list) {
            const datas = list.split(',');
            const columnsList = [];
            const initTableColumnsMap = _.clone(this.initTableColumns).reduce((result, o) => {
                result[o.label] = o;
                return result;
            }, {});
            datas.forEach(o => {
                if (initTableColumnsMap[o]) {
                    columnsList.push(initTableColumnsMap[o]);
                }
            });
            this.getOptionList(columnsList);
        }
    },
    computed: {
        ...mapGetters(['currentTenant'])
    }
};
</script>
<style lang="less">
    .otp-table {
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
        .el-table__body tr.highlight-row {
            background: #e6f8f9;
        }
        .error-active input{
            border-color: red;
        }
        th .cell .el-input {
            display: block;
            line-height: 28px;
            padding: 0;
            margin-top: 6px;
        }
        th .cell .filter-input{
            line-height: 24px;
            .el-input__inner{
                height: 24px;
                line-height: 24px;
            }
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
            .pad{
                padding:0 8px;
            }
        }
    }
</style>
