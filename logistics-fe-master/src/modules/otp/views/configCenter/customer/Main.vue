<template>
    <paper>
        <m-pane ref="tablePage"
                :config="config"
                :totalData="totalData"
                :pageTotal="pageTotal"
                :optionNum="optionNum"
                :loading="loading"
                :searchTotalTitle="searchTotalTitle"
                @saveData="saveData"
                @row-db-click="rowDBclick"
                @getTableConfigList="getTableConfigList"
                @check-btn="checkBtn"
                @edit-btn="editBtn"
                @del-btn="delBtn"
                @switch-change="switchChange"
                @selectChange="selectChange"
                @searchChange="searchChange"
                @pageChange="pageChange"
                @sizeChange="sizeChange"
                @element-change="elementChange"
                searchId="test"
                pageID="test">
            <div slot="table-module-btn">
                <el-tooltip class="item"
                            effect="dark"
                            content="新增"
                            placement="bottom">
                    <el-button size="mini"
                               icon='el-icon-plus'
                               @click="addData"></el-button>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'05010001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05010002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { customerList, customerAdd, customerDelete } from '../../../api/configCenter';
import { messageBox } from '../../../utils/messageBox';

export default {
    name: 'customer',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            selectRow: [],
            columns: config.table.columns,
            rowData: {
                orderSystem: '',
                businessMode: '',
                orderType: '',
                siteName: '',
                siteCode: '',
                whName: '',
                whCode: '',
                customerName: '',
                customerCode: ''
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        async getList() {
            const res = await customerList(this.searchParams);
            if (res) {
                // 当前页码大于数据总页数的时候，取最大页数并重新获取数据
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.getList();
                } else {
                    res.data.list = res.data.list.map(item => {
                        return { ...this.rowData, ...item };
                    });
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.totalData = [];
            }
        },
        // 校验属性禁用规则
        validatePropsIsDisabled(row) {
            if (!row['orderSystem']) {
                [row.businessMode, row.orderType, row.siteName, row.siteCode, row.whName, row.whCode, row.customerName, row.customerCode] = [null, null, '', null, '', null, '', null];
                row.disableProps = ['businessMode', 'orderType', 'siteName', 'whName', 'customerName'];
            } else if (!row['businessMode']) {
                [row.orderType, row.siteName, row.siteCode, row.whName, row.whCode, row.customerName, row.customerCode] = [null, '', null, '', null, '', null];
                row.disableProps = ['orderType', 'siteName', 'whName', 'customerName'];
            } else if (!row['orderType']) {
                [row.siteName, row.siteCode, row.whName, row.whCode, row.customerName, row.customerCode] = ['', null, '', null, '', null];
                row.disableProps = ['siteName', 'whName', 'customerName'];
            } else if (!row['siteName']) {
                [row.whName, row.whCode, row.customerName, row.customerCode] = ['', null, '', null];
                row.disableProps = ['whName', 'customerName'];
            } else if (!row['customerName']) {
                [row.customerName, row.customerCode] = ['', null];
                row.disableProps = ['whName'];
            } else {
                row.disableProps = [];
            }
        },
        elementChange(data) {
            if (data.row) {
                this.validatePropsIsDisabled(data.row);
            } else {
                this.validatePropsIsDisabled(data.val);
            }
        },
        rowDBclick(row) {
            // 表格内双击事件
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
        },
        editBtn(data) {
            // 表格内按钮修改事件;
        },
        delBtn(data) {
            // 表格内按钮删除事件;
        },
        selectChange(data) {
            // 表格内选择变化
            data.map(item => {
                this.validatePropsIsDisabled(item);
            });
            this.selectRow = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
            this.getList();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.getList();
        },
        addData() {
            // 表格新增方法
            const row = this.columns.reduce((result, col) => {
                result[col.prop] = col.defaultValue || '';
                return result;
            }, {});
            row.edit = 2;
            this.validatePropsIsDisabled(row);
            this.totalData.unshift(row);
            this.$refs.tablePage.$refs.table.$refs.mNewTable.$refs.moduleTable.toggleRowSelection(row, true);
        },
        saveData(data) {
            // 表格新增修改后返回数据
            const value = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (!value.length && value !== false) {
                this.$message.warning('请先勾选数据');
                return;
            }
            if (!value) {
                return;
            }
            const selectData = value.map(item => {
                const obj = item.id ? { id: item.id } : {};
                const { version, orderSystem, businessMode, orderType, customerCode, customerName, siteCode, siteName,
                    whCode, whName, adjustMipFlag, apartFlag, compartFlag } = item;
                return {
                    version,
                    orderSystem,
                    businessMode,
                    orderType,
                    customerCode,
                    customerName,
                    siteCode,
                    siteName,
                    whCode,
                    whName,
                    adjustMipFlag,
                    apartFlag,
                    compartFlag,
                    ...obj
                };
            });
            customerAdd(selectData).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.getList();
                }
            });
        },
        redomet(data) {
            // 这是删除方法
            const value = this.selectRow;
            if (!value.length) {
                this.$message.warning('请先勾选数据');
                return;
            }
            const idList = [];
            value.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (!idList.length) {
                this.getList();
                return;
            };
            messageBox(this).then(() => {
                customerDelete(idList).then(res => {
                    if (res.code === '0') {
                        this.$message.success('删除成功');
                        this.getList();
                    }
                });
            });
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        }
    }
};
</script>
