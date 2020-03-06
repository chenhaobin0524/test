<template>
    <div class="otp-inline-table">
        <el-table
            ref="moduleTable"
            border
            tooltip-effect='dark'
            v-loading="loading"
            :height="tableConfig.height"
            :data="tableData"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            @row-click='rowClick'
            @row-dblclick="rowDBclick">
            <el-table-column
                v-if="tableConfig.selectBtn"
                type="selection"
                width="40"
                fixed></el-table-column>
            <el-table-column
                v-for="(item, index) in columnsList"
                :key="index"
                :label="item.label"
                :sortable="item.sort"
                :min-width="_.get(item, 'width', '')">
                <template slot-scope="scope">
                    <div style="display: flex;" v-if="scope.row.edit !== EDIT_TYPE.CANCEL && item.require">
                        <el-select
                            v-if="item.type === 'select'"
                            v-model="scope.row[item.prop]"
                            :class="{'error-active': _.get(errorList, `[${scope.$index}][${index}]`)}"
                            :clearable="_.get(item, 'clearable',true)"
                            :filterable="item.filterable"
                            :disabled="_columnIfDisabled(scope.row, item)"
                            :multiple="_.get(item, 'multiple', false)"
                            :placeholder="item.name"
                            @change="(val) => elementChange(item.prop, val, scope.row, scope.$index)">
                            <el-option
                                v-for="(val, index) in _.get(scope.row, `${item.prop}Options`, item.options)"
                                :key=index
                                :label="val.label"
                                :value="val.value"
                            ></el-option>
                        </el-select>
                        <addressSelect
                            v-else-if="item.type === 'addressSelect'"
                            v-model="scope.row[item.prop]"
                            :class="{'error-active': _.get(errorList, `[${scope.$index}][${index}]`)}"
                            :minLayers="_.get(scope.row, `${item.prop}Layers`,item.minLayers)"
                            :disabled="_columnIfDisabled(scope.row, item)"
                            :basicProps="item.config"
                            @getAddress="labels => getAddress(scope.row, item, labels)"
                            @input="val => elementChange(item.prop, val, scope.row, scope.$index)"
                        ></addressSelect>
                        <el-switch
                            class="demo"
                            v-else-if="item.type === 'switch'"
                            v-model="scope.row[item.prop]"
                            :disabled="_columnIfDisabled(scope.row, item)"
                            :active-value="_.get(item, 'activeValue', 'Y')"
                            :inactive-value="_.get(item, 'inactiveValue', 'N')"
                            :active-text="tableConfig.statesY"
                            :inactive-text="tableConfig.statesN"
                            @change="(val) => elementChange(item.prop, val, scope.row, scope.$index)"
                        ></el-switch>
                        <el-input
                            readonly
                            v-else-if="item.type === 'advance'"
                            v-model="scope.row[item.prop]"
                            :class="{'error-active': _.get(errorList, `[${scope.$index}][${index}]`)}"
                            :disabled="_columnIfDisabled(scope.row, item)"
                            @keyup.113.native="detailSearch(scope.$index, item.prop, item, 2, scope.row[item.prop])"
                            @keyup.enter.native="detailSearch(scope.$index, item.prop, item, 2, scope.row[item.prop])">
                            <el-button
                                slot="append"
                                icon="el-icon-search"
                                :disabled="_columnIfDisabled(scope.row, item)"
                                @click="detailSearch(scope.$index, item.prop, item, 2, scope.row[item.prop])"
                            ></el-button>
                            <i
                                slot="suffix"
                                class="el-input__icon el-icon-circle-close"
                                v-if="scope.row[item.prop]"
                                @click="resetAdvanceParams(item.prop, scope.row)"
                            ></i>
                        </el-input>
                        <el-input
                            :clearable="_.get(item, 'clearable',true)"
                            v-else
                            v-model="scope.row[item.prop]"
                            :class="{'error-active': _.get(errorList, `[${scope.$index}][${index}]`)}"
                        ></el-input>
                    </div>
                    <template v-else>
                        <div v-if="item.type === 'switch'" @click="stopClick">
                            <el-switch
                                class="demo" v-model="scope.row[item.prop]"
                                disabled
                                :active-value="_.get(item, 'activeValue', 'Y')"
                                :inactive-value="_.get(item, 'inactiveValue', 'N')"
                                :active-text="tableConfig.statesY"
                                :inactive-text="tableConfig.statesN"
                            ></el-switch>
                        </div>
                        <template v-else>
                            {{item|initShow(scope.row)}}
                        </template>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                v-if="tableConfig.leftOperation"
                :width="_.get(tableConfig, 'leftWidth', '')">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        :key="index"
                        :type=item.type
                        v-for="(item, index) in tableConfig.action"
                        @click.stop=btnEvent(scope.row,item.event)>
                        {{item.event !== 'edit' ? item.label : (scope.row.edit !== EDIT_TYPE.CANCEL? '取消' : item.label)}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <advance-dialog ref="advanceDialog"></advance-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import _ from '@/components/lots/utils';
import { dict } from '../api';
import addressSelect from '@/components/lots/otpCascader2';
import advanceDialog from '@/components/lots/otpAdvanceDialog';

export default {
    name: 'mNewTable',
    data() {
        return {
            EDIT_TYPE: { EDIT: 2, CANCEL: -3 },
            selectedRowsData: [],
            errorList: [],
            columnsList: [],
            keyMap: {}
        };
    },
    props: {
        tableConfig: Object,
        tableData: {
            type: Array
        },
        loading: {
            type: Boolean,
            default() {
                return true;
            }
        },
        tableList: {
            type: String,
            default() {
                return '';
            }
        },
        popPrefix: String,
        filterable: Boolean
    },
    components: { addressSelect, advanceDialog },
    filters: {
        that: this,
        initShow(col, row) {
            // 为空，为0，为空数组时返回''
            if ((!row[col.prop] && row[col.prop] !== 0) || (_.isArray(row[col.prop]) && row[col.prop].length === 0)) {
                return '';
            }
            // 下拉框变为正常时显示值的改变
            let result = null;
            if (col.type === 'select') {
                if (_.isArray(row[col.prop])) {
                    result = row[col.prop].map(val => {
                        return _.get(col.options.find(item => item.value === val || item.label === val), 'label', '');
                    }).join(',');
                } else {
                    result = _.get(col.options.find(item => item.value === row[col.prop] || item.label === row[col.prop]), 'label', '');
                }
            } else if (col.type === 'addressSelect') {
                result = row[col.labelCn];
            } else {
                result = row[col.prop];
            }
            return result || '';
        }
    },
    methods: {
        tableRowClassName({ row }) {
            if (this.selectedRowsData && this.selectedRowsData.map(item => item.id).includes(row.id)) {
                return 'highlight-row';
            }
        },
        _columnIfDisabled(row, col) {
            return _.isArray(row.disableProps) ? row.disableProps.includes(col.prop) : col.disabled;
        },
        addRow() {
            // 新增一行，并进入行内编辑模式
            const obj = {};
            this.columnsList.forEach(item => {
                obj[item.prop] = item.defaultValue || '';
            });
            obj.edit = this.EDIT_TYPE.EDIT;
            this.tableData.unshift(obj);
            // 新增默认勾选
            this.$refs.moduleTable.toggleRowSelection(obj, true);
        },
        elementChange(prop, val, row, index) {
            this.$emit('element-change', {
                prop,
                val,
                row,
                index
            });
        },
        stopClick() {
            event.stopPropagation();
        },
        handleSelectionChange(selection) {
            this.selectedRowsData = selection;
            this.$emit('onSelectionChange', selection);
        },
        rowDBclick(row) {
            if (this.tableConfig.clickModify === true) {
                return;
            }
            this.$emit('row-db-click', row);
        },
        btnEvent(selection, event) {
            if (event === 'edit') {
                // 状态取反
                selection.edit = ~selection.edit;
                if (selection.edit === this.EDIT_TYPE.CANCEL) {
                    if (!selection.id) {
                        this.tableData.splice(selection.serialNum, 1);
                    } else if (selection.backup) {
                        this.$set(this.tableData, selection.serialNum, selection.backup);
                    }
                } else {
                    selection.backup = _.clone(selection);
                    this.$refs.moduleTable.toggleRowSelection(selection, true);
                }
            }
            this.$emit('btn-event', selection, event);
        },
        rowClick(rows) {
            if (!this.tableConfig.clickModify || rows.edit === this.EDIT_TYPE.EDIT) {
                return;
            }
            this.tableData.forEach(item => {
                item.edit = this.EDIT_TYPE.CANCEL;
            });
            this.tableData[rows.serialNum].edit = this.EDIT_TYPE.EDIT;
            rows.backup = _.clone(rows);
            if (rows) {
                this.initRowBg(rows.serialNum);
                this.$refs.moduleTable.toggleRowSelection(rows, true);
            }
        },
        // 提供给外部使用，验证表单字段
        saveData() {
            let ModifyData = this.selectedRowsData.map(item => {
                delete item.backup;
                delete item.edit;
                return item;
            });
            if (!this.tableExamine(ModifyData)) {
                ModifyData = false;
            }
            return ModifyData;
        },
        // 表格提交验证
        tableExamine(data) {
            let errorHint = false;
            let errorMsg = '';
            // 重置错误提醒对象
            this.errorList = this.tableData.map(item => {
                return Array(Object.keys(item).length).fill(false);
            });
            data.forEach(data => {
                this.columnsList.forEach((column, index) => {
                    const propIsNecessary = data.notNecessaryProps ? !data.notNecessaryProps.includes(column.prop) : column.mustFill;
                    if (propIsNecessary) {
                        if (data[column.prop]) {
                            if (_.isArray(data[column.prop]) && data[column.prop].length === 0) {
                                this.errorList[data.serialNum][index] = errorHint = true;
                                errorMsg = '必填项不能为空';
                            } else if (column.verify && !RegExp(column.verify).test(data[column.prop])) {
                                this.errorList[data.serialNum][index] = errorHint = true;
                                errorMsg = '部分选项格式不正确';
                            }
                        } else {
                            this.errorList[data.serialNum][index] = errorHint = true;
                            errorMsg = '必填项不能为空';
                        }
                    }
                });
            });
            if (errorHint) {
                this.$message.error(errorMsg);
            } else {
            }
            return !errorHint;
        },
        // 下拉框字典查询
        getOptionList(columnsList) {
            const optionList = [];
            const numList = [];
            columnsList.forEach((columns, index) => {
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
            this.columnsList = columnsList;
        },
        detailSearch(row, data, item, type, searchData) {
            if (!searchData) {
                searchData = '';
            }
            //  当前操作的行
            const currentOperateRow = this.tableData[row];
            const advanceCascade = {};
            // 高级搜索级联操作，current.advanceCascade为需要级联的参数的key的集合，例如advanceCascade: key1,key2,key3
            if (item && _.isString(item.advanceCascade)) {
                let advanceArray = [];
                advanceArray = item.advanceCascade.split(',');
                advanceArray.map((item) => {
                    let { 0: sourceProp, 1: destProp } = item.split('#');
                    destProp = destProp || sourceProp;
                    advanceCascade[destProp] = this.tableData[row][sourceProp];
                });
            }
            this.$refs.advanceDialog.show(true, item, advanceCascade);
            this.$refs.advanceDialog.$once('confirm', (result) => {
                // 将返回数据添加到map里，用于高级搜索清空时，顺带清空其他关联属性
                const keyArr = Object.keys(result);
                if (keyArr.length > 0) {
                    keyArr.forEach(key => {
                        this.keyMap[key] = keyArr;
                    });
                }
                Object.assign(currentOperateRow, result);
                this.$emit('element-change', { val: _.clone(result), type: 'advance', row: currentOperateRow });
            });
        },
        dataInit(tableData) {
            const list = tableData || this.tableData;
            list.map((item, index) => {
                item.serialNum = index;
                if (item.id) {
                    this.$set(this.tableData[index], 'edit', this.EDIT_TYPE.CANCEL);
                }
                const errList = [];
                for (let i = 0; i < Object.keys(item).length; i++) {
                    errList.push(false);
                }
                this.$set(this.errorList, index, errList);
            });
            // 初始化keyMap
            this.columnsList.forEach(data => {
                if (data.type === 'advance' && _.isArray(data.cbParams)) {
                    const keys = data.cbParams.map(item => {
                        const arr = item.split('#');
                        return arr[1] || arr[0];
                    });
                    keys.forEach(key => {
                        this.keyMap[key] = keys;
                    });
                }
            });
            this.initRowBg();
        },
        // 初始化行背景，并高亮指定行
        initRowBg(rowIndex = null) {
            const arr = document.getElementsByClassName('el-table__row');
            for (let i = 0; i < arr.length; i++) {
                arr[i].style.background = '';
            }
            if (rowIndex) {
                arr[rowIndex].style.background = '#F1F8FA';
            }
            return arr;
        },
        // 转化中文地址数组成连续字符串
        getAddress(row, item, labels) {
            row[item.labelCn] = labels.join(' / ');
        },
        // 高级输入框的关闭按钮点击
        resetAdvanceParams(prop, row) {
            const keyArr = this.keyMap[prop];
            // 把属性相关联的字段置空
            _.isArray(keyArr) && keyArr.forEach(key => {
                row[key] = '';
            });
        }
    },
    watch: {
        tableData: function (val) {
            this.dataInit(val);
        },
        tableList: function (list) {
            const datas = list.split(',');
            const columnsList = [];
            datas.forEach(title => {
                this.tableConfig.columns.forEach(data => {
                    if (data.label === title) {
                        columnsList.push(data);
                    }
                });
            });
            this.getOptionList(columnsList);
        }
    },
    computed: {
        ...mapGetters(['currentTenant']),
        _() {
            return _;
        }
    }
};
</script>
<style lang="less">
.otp-inline-table {
    .module-table {
        margin: 12px 0;
    }

    .el-table__body tr.selected-row > td {
        background: #F1F8FA !important;
    }
    .el-table__body tr.highlight-row {
        background: #e6f8f9;
    }

    .error-active input {
        border-color: red;
    }

    .error-active .otpAllAddressSelect .el-cascader .el-input {
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

    .el-button--text {
        padding: 7px 0;
    }
}
</style>
