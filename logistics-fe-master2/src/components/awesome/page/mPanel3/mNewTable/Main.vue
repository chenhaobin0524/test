<template>
    <div id="module-table">
        <el-table ref="moduleTable"
                  border
                  :height="totalDate.height"
                  :data="tableData"
                  tooltip-effect='dark'
                  v-loading="loading"
                  @selection-change="handleSelectionChange"
                  @row-click='rowClick'
                  @row-dblclick="rowDBclick">
            <el-table-column type="selection" width="40" fixed v-if="totalDate.selectBtn"></el-table-column>
            <el-table-column v-for="(item, index) in columnsList"
                             :key=index :prop=item.prop :label=item.label :sortable="item.sort"
                             :min-width="item.width?item.width : ''" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <div v-if="(scope.row.edit !== 0 || scope.row.editRow) && item.require">
                        <el-select :clearable="clearable" v-model="scope.row[item.prop]" v-if="item.type === 'select'"
                                   :class="{'error-active':errorList[scope.$index][index]}"
                                   :multiple="item.multiple?item.multiple:false" :placeholder=item.name>
                            <el-option v-for="(val, index) in item.options" :key=index :label="val.label"
                                       :value="val.value"></el-option>
                        </el-select>
                        <el-select
                                v-else-if="item.type === 'autocomplete'"
                                v-model="scope.row[item.prop]"
                                filterable
                                remote
                                :multiple="item.multiple?item.multiple:false"
                                reserve-keyword
                                :class="{'error-active':errorList[scope.$index][index]}"
                                :placeholder=item.name
                                :remote-method="remoteMethod"
                                @change="autocompleteSure"
                                @focus="searchDateChange(scope.$index, item)"
                                :loading="searchLoading">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-cascader
                                v-else-if="item.type === 'cascader'"
                                v-model="scope.row[item.prop]"
                                :options="item.options"
                                :class="{'error-active':errorList[scope.$index][index]}"
                                :clearable="clearable"
                                :filterable="item.filterable"
                                :change-on-select="item.changeOnSelect"
                                :placeholder=item.name>
                        </el-cascader>
                        <el-switch v-else-if="item.type === 'switch'" v-model="scope.row[item.prop]" class="demo"
                                   :disabled="!item.require" active-value="Y" inactive-value="N"
                                   :active-text="totalDate.statesY" :inactive-text="totalDate.statesN">
                        </el-switch>
                        <el-input v-model="scope.row[item.prop]" clearable
                                  @keyup.113.native="detaliSearch(scope.$index, item.prop, item, 2, scope.row)"
                                  @keyup.enter.native="detaliSearch(scope.$index, item.prop, item, 2, scope.row[item.prop])"
                                  @blur="detaliSearchBlur(scope.$index, item.prop, item, 2, scope.row[item.prop])"
                                  @input="advanceCodeChange(scope.$index,item)"
                                  @clear="advanceCodeChange(scope.$index,item)"
                                  :class="{'error-active':errorList[scope.$index][index]}"
                                  v-else-if="item.type === 'advance'">
                            <el-button slot="append"
                                       @click="detaliSearch(scope.$index, item.prop, item, 2, scope.row[item.prop])"
                                       icon="el-icon-search"></el-button>
                        </el-input>
                        <el-input :class="{'error-active':errorList[scope.$index][index]}" v-else
                                  v-model="scope.row[item.prop]" clearable></el-input>
                    </div>
                    <div v-else>
                        <div v-if="item.type === 'switch'" @click="stopClick">
                            <el-switch class="demo" v-model="scope.row[item.prop]" :disabled="!item.require || changeIf"
                                       @change="switchChange(scope.row,item, scope.$index)"
                                       active-value="Y" inactive-value="N" :active-text="totalDate.statesY"
                                       :inactive-text="totalDate.statesN"></el-switch>
                        </div>
                        <div v-else>{{item.type!=='select'&&item.type!=='cascader'?scope.row[item.prop]:selectToNormal(scope.row[item.prop],item.options,item.type)}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :width="totalDate.leftWidth?totalDate.leftWidth : ''" v-if="totalDate.leftOperation"
                             fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button v-for="(item, index) in totalDate.action" :key="index"
                               @click.stop=btnEvent(scope.row,item.event) :type=item.type>
                        {{item.event!=="edit"?item.label:(scope.row.edit!==0?"取消":item.label)}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { dict, longRange } from '../mSearchList/api';
import { mapGetters } from 'vuex';

export default {
    name: 'mTable',
    data() {
        return {
            editState: 'show',
            selectedRows: [],
            selectedRowsData: [],
            addIf: false,
            changeIf: false,
            errorList: [],
            columnsList: [],
            //  远程搜索
            line: [],
            clearable: true,
            selectItem: [],
            options: [],
            searchLoading: false
        };
    },
    props: {
        totalDate: Object,
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
        popPrefix: String
    },
    methods: {
        switchChange(data, item, num) {
            if (item.require === false) {
                return;
            }
            if (this.totalDate.switchType) {
                this.$emit('switch-change', data);
            } else {
                if (data.status === 'Y') {
                    this.$confirm('是否启用?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '启用成功!'
                        });
                        this.$emit('switch-change', data);
                    }).catch(() => {
                        this.tableData[num][item.prop] = 'N';
                    });
                } else {
                    this.$confirm('是否停用?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '停用成功!'
                        });
                        this.$emit('switch-change', data);
                    }).catch(() => {
                        this.tableData[num][item.prop] = 'Y';
                    });
                }
            }
        },
        stopClick() {
            event.stopPropagation();
        },
        handleSelectionChange(selection) {
            this.selectedRowsData = selection;
            this.$emit('onSelectionChange', selection);
        },
        rowDBclick(row) {
            if (this.totalDate.clickModify === true) {
                return;
            }
            this.$emit('row-db-click', row);
        },
        btnEvent(selection, event) {
            if (event === 'edit' && selection.edit === 2) {
                this.tableData[selection.serialNum].edit = 0;
            } else {
                this.tableData[selection.serialNum].edit = 2;
            }
            this.$emit('btn-event', selection, event);
        },
        rowClick(rows) {
            const self = this;
            if (self.totalDate.clickModify === false) {
                return;
            }
            if (self.totalDate.name === 'stockInvTasks' && rows.status === '10') {
                return;
            }
            if (rows.edit === 0) {
                self.tableData.map(item => {
                    item.edit = 0;
                    if (item.editRow) {
                        delete item.editRow;
                    }
                });
                self.tableData[rows.serialNum].edit = 2;
            }
            const arr = document.getElementsByClassName('el-table__row');
            if (rows) {
                if (arr[rows.serialNum].style.background === '') {
                    arr[rows.serialNum].style.background = '#F1F8FA';
                    if (arr[rows.serialNum + self.tableData.length]) {
                        arr[rows.serialNum + self.tableData.length].style.background = '#F1F8FA';
                    }
                    this.selectedRows.push(rows.serialNum);
                }
            }
            if (rows) {
                rows = [rows];
                rows.forEach(row => {
                    this.$refs.moduleTable.toggleRowSelection(row, true);
                });
            }
            this.$forceUpdate();
            this.changeIf = true;
            this.$emit('return-change-if', this.changeIf);
        },
        addData(newData) {
            const searchData = { edit: 1 };
            const errList = [];
            this.columnsList.map(data => {
                if (data.multiple) {
                    this.$set(searchData, data.prop, []);
                } else if (data.type === 'switch') {
                    this.$set(searchData, data.prop, 'Y');
                } else {
                    if (newData) {
                        this.$set(searchData, data.prop, newData[data.prop]);
                    } else {
                        this.$set(searchData, data.prop, '');
                    }
                }
                errList.push(false);
            });
            this.$set(this.errorList, this.errorList.length, errList);
            this.tableData.unshift(searchData);
            this.addIf = true;
            this.tableData.map((item, index) => {
                item.serialNum = index;
            });
            this.addIf = true;
            this.changeIf = true;
            this.$emit('return-change-if', this.changeIf);
            const self = this;
            this.$nextTick().then(function () {
                // DOM 更新了
                const arr = document.getElementsByClassName('el-table__row');
                for (let i = 0; i < arr.length; i++) {
                    arr[i].style.background = '';
                }
                arr[0].style.background = '#F1F8FA';
                if (arr[self.tableData.length]) {
                    arr[self.tableData.length].style.background = '#F1F8FA';
                }
                const bgList = [0];
                self.selectedRows.map(data => {
                    bgList.push(data + 1);
                    arr[data + 1].style.background = '#F1F8FA';
                    if (arr[self.tableData.length]) {
                        arr[data + 1 + self.tableData.length].style.background = '#F1F8FA';
                    }
                });
                self.selectedRows = bgList;
            });
        },
        saveData() {
            let ModifyData = [];
            this.tableData.map((item, index) => {
                this.selectedRowsData.map((data) => {
                    if (item.serialNum === data.serialNum) {
                        ModifyData.push(this.tableData[index]);
                        delete ModifyData[ModifyData.length - 1].edit;
                        if (ModifyData[ModifyData.length - 1].eidtRow) {
                            delete ModifyData[ModifyData.length - 1].eidtRow;
                        }
                    }
                });
            });
            this.$emit('return-change-if', this.changeIf);
            if (!this.tableExamine(ModifyData)) {
                ModifyData = false;
            }
            return ModifyData;
        },
        // 表格提交验证
        tableExamine(data) {
            const self = this;
            let emptyHint = false;
            let errorHint = false;
            self.tableData.map((item, index) => {
                const errList = [];
                for (let i = 0; i < Object.keys(item).length; i++) {
                    errList[i] = false;
                }
                self.$set(self.errorList, index, errList);
            });
            data.map(data => {
                self.columnsList.map((column, index) => {
                    if (data[column.prop]) {
                        if (column.mustFill === true && data[column.prop].length === 0) {
                            emptyHint = true;
                            self.errorList[data.serialNum][index] = true;
                        }
                    } else {
                        if (column.mustFill === true) {
                            emptyHint = true;
                            self.errorList[data.serialNum][index] = true;
                        }
                    }
                });
            });
            if (emptyHint) {
                self.$message.error('必填项不能为空');
                return false;
            }
            data.map(data => {
                self.columnsList.map((column, index) => {
                    if (data[column.prop] && column.verify) {
                        if (!RegExp(column.verify).test(data[column.prop])) {
                            errorHint = true;
                            self.errorList[data.serialNum][index] = true;
                        }
                    }
                });
            });
            if (errorHint) {
                self.$message.error('部分选项格式不正确');
                return false;
            } else {
                return true;
            }
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
                name: searchData,
                table: this.selectItem.tableName
            };
            if (this.selectItem.relevanceOne) {
                params.relevanceOne = this.tableData[this.line][this.selectItem.relevanceOne];
            }
            if (this.selectItem.relevanceTwo) {
                params.relevanceTwo = this.tableData[this.line][this.selectItem.relevanceTwo];
            }
            longRange(params).then(data => {
                const restaurants = [];
                data.data.map((search, index) => {
                    restaurants[index] = { 'label': search.name, 'value': search.id, 'key': search.code };
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
        searchDateChange(row, item) {
            this.line = row;
            this.selectItem = item;
            this.remoteMethod();
        },
        autocompleteSure(data) {
            let selectName = '';
            let selectCode = '';
            const nameList = [];
            const codeList = [];
            this.tableData[this.line][this.selectItem.subordinateOne] = '';
            this.tableData[this.line][this.selectItem.subordinateTwo] = '';
            if (typeof (data) === 'string') {
                this.options.map(item => {
                    if (item.value === data) {
                        selectName = item.label;
                        selectCode = item.key;
                    }
                });
            } else {
                this.options.map(item => {
                    data.map(selectList => {
                        if (item.value === selectList) {
                            nameList.push(item.label);
                            codeList.push(item.key);
                        }
                    });
                });
                selectName = nameList.join(',');
                selectCode = codeList.join(',');
            }
            this.tableData[this.line][this.selectItem.ganged] = selectCode;
            this.tableData[this.line][this.selectItem.prop] = selectName;
        },
        // 下拉框字典查询
        getOptionList() {
            const optionList = [];
            const optiondata = [];
            let optionString = '';
            const numList = [];
            this.columnsList.map((columns, index) => {
                if (columns.optionNum) {
                    optionList.push(columns.optionNum);
                    numList.push(index);
                }
            });
            if (optionList.length !== 0) {
                optionString = optionList.join(',');
                const params = {
                    dictCodes: optionString,
                    tenantCode: this.currentTenant.tenantCode
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
                        this.columnsList[data].options = optiondata[index];
                    });
                }).then(() => {
                    this.dataInit();
                });
            }
        },
        // 高级搜索
        advanceCodeChange(num, index) {
            this.tableData[num][index.advanceCode] = '';
        },
        detaliSearchBlur(row, data, item, type, searchData) {
            const detaliData = this.tableData[row][data].replace(/\s*/g, '');
            if (detaliData !== '') {
                this.detaliSearch(row, data, item, type, searchData);
            }
        },
        detaliSearch(row, data, item, type, searchData) {
            if (!searchData) {
                searchData = '';
            }
            this.$emit('tab-advanced-search', row, data, item, type, searchData);
        },
        dataInit() {
            this.tableData.map((item, index) => {
                this.$set(this.tableData[index], 'edit', 0);
                const errList = [];
                for (let i = 0; i < Object.keys(item).length; i++) {
                    errList.push(false);
                }
                this.$set(this.errorList, index, errList);
                item.serialNum = index;
                // this.columnsList.map(columns => {
                //     if (columns.options) {
                //         columns.options.map(option => {
                //             if (option.value === item[columns.prop]) {
                //                 item[columns.prop] = option.label;
                //             }
                //         });
                //     }
                // });
            });
            const arr = document.getElementsByClassName('el-table__row');
            for (let i = 0; i < arr.length; i++) {
                arr[i].style.background = '';
            }
            this.changeIf = false;
        },
        selectToNormal(value, arr, type) {
            if ((!value && value !== 0) || (Array.isArray(value) && !value.length)) {
                return '';
            }
            // 下拉框变为正常时显示值的改变
            let v = null;
            let i = 0;
            const newArr = [];
            // 级联递归
            const getValue = function(arr, len, maxLen) {
                if (len < maxLen) {
                    let mArr = [];
                    arr.map(item => {
                        if (item.value === value[len]) {
                            newArr[len] = item.label;
                            mArr = item.children;
                        }
                    });
                    len++;
                    getValue(mArr, len, maxLen);
                }
            };
            // 判断级联框
            if (type === 'cascader') {
                getValue(arr, 0, value.length);
                v = newArr.join('');
            } else {
                arr.map((item) => {
                    // 判断下拉多选情况
                    if (Array.isArray(value)) {
                        value.map((val, index) => {
                            if (val === item.value) {
                                i++;
                                newArr.push(item.label);
                            }
                        });
                    } else {
                        if (item.value === value || item.label === value) {
                            v = item.label;
                        }
                    }
                });
                if (i === value.length) {
                    v = newArr.join(',');
                }
            }
            v = !v ? (value && value.length ? value : '') : v;
            return v;
        }
    },
    created() {
        if (this.tableData) {
            this.dataInit();
        }
    },
    watch: {
        tableData: function () {
            if (this.addIf === true) {
                this.addIf = false;
            } else {
                this.dataInit();
            }
        },
        tableList: function () {
            const datas = this.tableList.split(',');
            this.columnsList = [];
            datas.map(title => {
                this.totalDate.columns.map(data => {
                    if (data.label === title) {
                        this.columnsList.push(data);
                    }
                });
            });
            this.getOptionList();
        }
    },
    computed: {
        ...mapGetters(['currentTenant'])
    }
};
</script>
<style lang="less">
    #module-table {
        .module-table {
            margin: 12px 0;
        }

        .el-table__body tr.selected-row > td {
            background: #F1F8FA !important;
        }

        .error-active input {
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
        .el-button--text{
            padding: 7px 0;
        }
    }
</style>
