<template>
    <paper>
        <m-pane ref="tablePage"
                :config="config"
                :totalData="totalData"
                :pageTotal="pageTotal"
                :optionNum="optionNum"
                :loading="loading"
                :searchTotalTitle="config.searchTotalTitle"
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
                <el-tooltip effect='dark'
                    content='导入'
                    placement='bottom'>
                    <span v-has="'05100003'" class="mgl-10">
                        <el-button icon='el-icon-upload2'
                            size='mini' @click="showImport"></el-button>
                    </span>
                </el-tooltip>
                <el-tooltip effect='dark'
                    content='导出'
                    placement='bottom'>
                    <span v-has="'05100004'" class="mgl-10">
                        <el-button icon='el-icon-download'
                            size='mini' @click="exportEvent"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'05100001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05100002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
        <Import
            ref="Import"
            :ImportConfig="config.import.ImportConfig"
            :ImportContent="config.import.ImportContent"
            @getUploadResult="getUploadResult"
        ></Import>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import { messageBox } from '../../../utils/messageBox';
import Import from '../../../components/common/Import';
import { busTypeConfExport } from '../../../api/export';
import { getBusineesFeeConfigs, batchUpdateBusineesFeeConfigs, batchDeleteBusineesFeeConfigs } from '../../../api/configCenter';

export default {
    name: 'billingService',
    components: { mPane, paper, Import },
    data() {
        return {
            config: config,
            columns: config.table.columns,
            loading: false,
            optionNum: '',
            totalData: [],
            // 选中的行数
            selectData: [],
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            exportType: false
        };
    },
    methods: {
        async fetchData() {
            const res = await getBusineesFeeConfigs(this.searchParams);
            if (res) {
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    res.data.list.forEach(ele => {
                        this.validatePropsIsDisabled(ele);
                    });
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.totalData = [];
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
            this.selectData = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
            if (this.exportType) {
                busTypeConfExport(this.searchParams).then(res => {
                    this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
                });
                this.exportType = false;
            } else {
                this.fetchData();
            };
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.fetchData();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.fetchData();
        },
        elementChange(data) {
            this.validatePropsIsDisabled(data.row, data.prop);
        },
        // 校验属性禁用规则
        validatePropsIsDisabled(row, prop) {
            if (row.businessMode && prop === 'businessMode') {
                // if (row.businessMode === 'B2C') {
                //     // B2C时订单类型、客户、平台不可填且非必填
                //     row.disableProps = ['orderType', 'customerCode', 'customerName', 'siteCode', 'siteName'];
                //     row.notNecessaryProps = ['orderType', 'customerCode', 'customerName', 'siteCode', 'siteName'];

                //     row.disableProps.forEach(key => {
                //         row[key] = '';
                //     });
                // } else if (row.businessMode === 'B2B') {
                //     // B2B时配送方式、订单类型非必填
                //     row.disableProps = [];
                //     row.notNecessaryProps = ['deliveryType', 'orderType'];
                // } else {
                //     row.disableProps = [];
                //     row.notNecessaryProps = [];
                // }

                // B2B时,只显示配送和运输
                if (row.businessMode === 'B2B' && this.businessTypeColumn.options) {
                    row.businessTypeOptions = this.businessTypeColumn.options.filter(item => ['3', '4'].includes(item.value));
                } else {
                    row.businessTypeOptions = this.businessTypeColumn.options;
                }
                row.businessType = '';
            }
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
        async saveData() {
            if (!this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData()) {
                return;
            }
            if (this.selectData.length < 1) {
                this.$message.warning('至少勾选一条数据进行操作');
                return;
            }
            // 表格新增修改后返回数据
            const selectData = this.selectData.map(item => {
                const obj = item.id ? { id: item.id } : {};
                const { deliveryType, businessMode, orderType, businessType, customerCode, siteCode } = item;
                return { deliveryType, businessMode, orderType, businessType, customerCode, siteCode, ...obj };
            });
            const res = await batchUpdateBusineesFeeConfigs(selectData);
            if (res) {
                this.$message.success('保存成功');
            }
            this.fetchData();
        },
        async redomet() {
            // 这是删除方法
            if (this.selectData.length < 1) {
                this.$message.warning('至少勾选一条数据进行操作');
                return;
            }
            // 表格删除后返回数据
            const selectData = this.selectData.filter(item => item.id).map(item => item.id);
            messageBox(this).then(async () => {
                const res = await batchDeleteBusineesFeeConfigs(selectData);
                if (res) {
                    this.$message.success('删除成功');
                }
                this.fetchData();
            });
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        },
        showImport() {
            this.$refs.Import.orderImportC();
        },
        getUploadResult(flag) {
            if (flag) {
                this.fetchData();
            }
        },
        exportEvent() {
            this.exportType = true;
            this.$refs.tablePage.$refs.searchList.onSearchChange();
        }
    },
    mounted() {
        // 用来进行业务类型列的控制
        this.businessTypeColumn = this.columns.find(col => col.prop === 'businessType');
        this.fetchData();
    }
};
</script>
