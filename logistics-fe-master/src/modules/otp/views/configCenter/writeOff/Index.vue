<template>
    <paper class="write-off">
        <div class="search-row">
            <el-row class="search-list">
                <el-col :span="4" class="search">
                    <selects
                        clearable
                        placeholder="来源系统"
                        :optionNum="'ORDER_STATUS'"
                        :prop="'orderStatus'"
                        @getSelectValue="getOrderStatus"
                    ></selects>
                </el-col>
                <el-col :span="4" class="search">
                    <selects
                        clearable
                        placeholder="订单类型"
                        :mValue="searchData.sourceSystem"
                        :optionNum="'SOURCE_SYSTEM'"
                        :prop="'sourceSystem'"
                        @getSelectValue="getSourceSystem"
                    ></selects>
                </el-col>
                <el-col :span="2" class="search">
                    <el-button type='primary' @click="onSearchData">查 询</el-button>
                </el-col>
            </el-row>
            <div class="btn-list">
                <el-tooltip effect="dark" content="新增" placement="bottom">
                    <el-button icon='el-icon-plus' size="mini" @click="addBtn"></el-button>
                </el-tooltip>
            </div>
        </div>
        <div class="table-list">
            <el-table ref="moduleTable"
            border
            tooltip-effect='dark'
            v-loading="loading"
            :height="400"
            :data="tableData"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            @row-click='rowClick'
            @row-dblclick="rowDBclick">
                <el-table-column
                    type="selection" width="40" fixed>
                </el-table-column>
                <el-table-column prop="businessMode" label="业务模式">
                    <template slot-scope="scope">
                        <div style="display: flex;" v-if="scope.row.edit !== EDIT_TYPE.CANCEL">
                            <el-select
                                v-model="scope.row.businessMode"
                                :class="{'error-active': _.get(errorList, `[${scope.$index}][${0}]`)}"
                                :clearable="true"
                                placeholder="业务模式"
                                @change="(val) => elementChange('businessMode', val, scope.row, scope.$index)">
                                <el-option
                                    v-for="(val, index) in businessModeOptions"
                                    :key=index
                                    :label="val.label"
                                    :value="val.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <template v-else>{{scope.row.businessMode}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="sourceSystem" label="来源系统">
                    <template slot-scope="scope">
                        <div style="display: flex;" v-if="scope.row.edit !== EDIT_TYPE.CANCEL">
                            <el-select
                                v-model="scope.row.sourceSystem"
                                :class="{'error-active': _.get(errorList, `[${scope.$index}][${1}]`)}"
                                :clearable="true"
                                placeholder="来源系统"
                                @change="(val) => elementChange('sourceSystem', val, scope.row, scope.$index)">
                                <el-option
                                    v-for="(val, index) in sourceSystemOptions"
                                    :key=index
                                    :label="val.label"
                                    :value="val.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <template v-else>{{scope.row.sourceSystem}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="orderSourcePlatform" label="订单来源">
                    <template slot-scope="scope">
                        <div style="display: flex;" v-if="scope.row.edit !== EDIT_TYPE.CANCEL">
                            <el-select
                                v-model="scope.row.orderSourcePlatform"
                                :class="{'error-active': _.get(errorList, `[${scope.$index}][${2}]`)}"
                                :clearable="true"
                                placeholder="订单来源"
                                @change="(val) => elementChange('orderSourcePlatform', val, scope.row, scope.$index)">
                                <el-option
                                    v-for="(val, index) in orderSourcePlatformOptions"
                                    :key=index
                                    :label="val.label"
                                    :value="val.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <template v-else>{{scope.row.orderSourcePlatform}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="orderType" label="订单类型">
                    <template slot-scope="scope">
                        <div style="display: flex;" v-if="scope.row.edit !== EDIT_TYPE.CANCEL">
                            <el-select
                                v-model="scope.row.orderType"
                                :class="{'error-active': _.get(errorList, `[${scope.$index}][${3}]`)}"
                                :clearable="true"
                                placeholder="订单类型"
                                @change="(val) => elementChange('orderType', val, scope.row, scope.$index)">
                                <el-option
                                    v-for="(val, index) in orderTypeOptions"
                                    :key=index
                                    :label="val.label"
                                    :value="val.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <template v-else>{{scope.row.orderType}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="limit" label="原出库单限制">
                    <template slot-scope="scope">
                        <div style="display: flex;">
                            <el-switch
                                v-model="scope.row.limit"
                                @change="switchChange(scope.row)">
                            </el-switch>
                            <template v-if="scope.row.limit"><el-button type="text">详情</el-button></template>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="upDateTime" label="修改时间"></el-table-column>
                <el-table-column prop="upDateUser" label="修改人"></el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                @click.stop="btnEvent(scope.row)">
                                {{scope.row.edit !== EDIT_TYPE.CANCEL? '取消' : '编辑'}}
                            </el-button>
                        </template>
                        </el-table-column>
            </el-table>
        </div>
        <div class="footer-list">
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="12" class="page-text">
                    <div>
                        已选<span class="text-color">{{checkedNum}}</span>项
                    </div>
                    <div class="footer-btn-list">
                        <span><el-button type="primary" @click="deleteClick">删 除</el-button></span>
                        <span style="margin-left: 10px;"><el-button type="primary" @click="saveClick">保 存</el-button></span>
                    </div>
                    <!-- <slot name="page-module-btn"></slot> -->
                </el-col>
                <el-col :span="12">
                    <m-page ref="page" :current-page="currentPage" :pageData="pageData" :total="pageTotal" @on-page-change="pageChange" @on-size-change="sizeChange"></m-page>
                </el-col>
            </el-row>
        </div>
        <limit-dialog v-if="limitDialog" :visiableDialog.sync="limitDialog"
        @confirmOk="confirmOk" @handleClose="handleClose"></limit-dialog>
    </paper>
</template>
<script>
import paper from '@/components/core/paper/Paper';
import selects from './Select';
import mPage from '@/components/otpPanel/mPage';
import limitDialog from './LimitDialog';
import _ from '@/components/lots/utils';
import { getDictList, getList } from '../../../api/writeOff';
export default {
    name: 'writeOff',
    components: { paper, selects, mPage, limitDialog },
    props: {
        tableConfig: Object,
        loading: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data() {
        return {
            searchData: {
                pageSize: 10,
                pageNo: 1,
                orderStatus: '',
                sourceSystem: ''
            },
            tableData: [],
            selectedRowsData: [],
            optionNum: 'SOURCE_SYSTEM,BUSINESS_MODE,SOURCE_PLATFORM,ORDER_TYPE',
            businessModeOptions: [],
            sourceSystemOptions: [],
            orderSourcePlatformOptions: [],
            orderTypeOptions: [],
            EDIT_TYPE: { EDIT: 2, CANCEL: -3 },
            errorList: [],
            columnsList: ['businessMode', 'sourceSystem', 'orderSourcePlatform', 'orderType'],
            columnsRequireList: ['businessMode', 'sourceSystem', 'orderSourcePlatform'],
            keyMap: {},
            checkedNum: 0,
            currentPage: 1,
            pageTotal: 0,
            pageData: {
                'layout': 'total, sizes, prev, pager, next, jumper',
                'pageSize': 10,
                'pageSizes': [10, 20, 50, 100]
            },
            limitDialog: false
        };
    },
    methods: {
        getLists() {
            getList(this.searchData).then(res => {
                if (res) {
                    this.tableData = res.data.list.map(item => {
                        this.columnsList.map(column => {
                            if (!item[column]) item[column] = '';
                        });
                        return item;
                    });
                    this.pageTotal = res.data.totalCount;
                }
            });
        },
        getOrderStatus(data) {
            this.searchData.orderStatus = data.orderStatus;
        },
        getSourceSystem(data) {
            this.searchData.sourceSystem = data.sourceSystem;
        },
        onSearchData(data) {
            this.searchData = { ...this.searchData, pageNo: 1 };
            this.getLists();
        },
        pageChange(page) {
            this.searchData.pageNo = page;
            this.getLists();
        },
        sizeChange(size) {
            this.searchData.pageSize = size;
            this.getLists();
        },
        addBtn() {
            const obj = {};
            this.columnsList.forEach(item => {
                obj[item.prop] = '';
            });
            obj.edit = this.EDIT_TYPE.EDIT;
            this.tableData.unshift(obj);
            // 新增默认勾选
            this.$refs.moduleTable.toggleRowSelection(obj, true);
        },
        tableRowClassName({ row }) {
            if (this.selectedRowsData && this.selectedRowsData.map(item => item.id).includes(row.id)) {
                return 'highlight-row';
            }
        },
        handleSelectionChange(selection) {
            this.selectedRowsData = selection;
            this.checkedNum = selection.length;
        },
        rowClick(rows) {
            if (rows.edit === this.EDIT_TYPE.EDIT) {
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
        rowDBclick(rows) {},
        getDictList() {
            this.businessModeOptions = [];
            this.sourceSystemOptions = [];
            this.orderSourcePlatformOptions = [];
            getDictList({ 'dictCodes': this.optionNum }).then(res => {
                if (res) {
                    const dictObj = res.data;
                    this.dictListOptions(dictObj.BUSINESS_MODE, this.businessModeOptions);
                    this.dictListOptions(dictObj.SOURCE_SYSTEM, this.sourceSystemOptions);
                    this.dictListOptions(dictObj.SOURCE_PLATFORM, this.orderSourcePlatformOptions);
                    this.dictListOptions(dictObj.ORDER_TYPE, this.orderTypeOptions);
                }
            });
        },
        dictListOptions(dictKey, options) {
            Object.keys(dictKey).forEach(key => {
                options.push({ 'value': key, 'label': dictKey[key] });
            });
        },
        elementChange(prop, val, row, index) {},
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
        btnEvent(selection) {
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
        },
        switchChange(val) {
            if (val.limit) {
                this.limitDialog = true;
            }
        },
        deleteClick() {
            if (this.selectedRowsData.length < 1) return this.$message.warning('至少勾选一条数据进行操作');
        },
        saveClick() {
            const ModifyData = this.selectedRowsData.map(item => {
                delete item.backup;
                delete item.edit;
                return item;
            });
            if (!this.tableExamine(ModifyData)) {
                return false;
            }
        },
        tableExamine(data) {
            let errorHint = false;
            let errorMsg = '';
            // 重置错误提醒对象
            this.errorList = this.tableData.map(item => {
                return Array(Object.keys(item).length).fill(false);
            });
            data.forEach(data => {
                this.columnsRequireList.forEach((column, index) => {
                    if (data[column]) {
                        if (_.isArray(data[column]) && data[column].length === 0) {
                            this.errorList[data.serialNum][index] = errorHint = true;
                            errorMsg = '必填项不能为空';
                        }
                    } else {
                        this.errorList[data.serialNum][index] = errorHint = true;
                        errorMsg = '必填项不能为空';
                    }
                });
            });
            if (errorHint) {
                this.$message.warning(errorMsg);
            } else {
            }
            return !errorHint;
        },
        handleClose() {
            this.limitDialog = false;
        },
        confirmOk(data) {
            this.limitDialog = false;
        }
    },
    created() {
        this.getDictList();
        this.getLists();
    },
    watch: {
        tableData: function (val) {
            this.dataInit(val);
        }
    },
    computed: {
        _() {
            return _;
        }
    }
};
</script>
<style lang="less">
    .write-off {
        .search-row {
            display: flex;
            .search-list {
                flex: 1;
                .search {
                    margin: 0 8px 10px 0;
                }
            }
            .btn-list {
                width: 100px;
            }
        }
        .error-active input {
            border-color: red;
        }

        .error-active .otpAllAddressSelect .el-cascader .el-input {
            border-color: red;
        }
        .footer-list {
            .row-bg{
                margin-top: 10px;
            }
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
                    display: inline-block;
                    width: 30px;
                    text-align: center;
                }
            }
        }
    }
</style>