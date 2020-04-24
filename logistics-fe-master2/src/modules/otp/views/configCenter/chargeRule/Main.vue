<template>
    <paper>
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :optionNum="optionNum"
            :loading="loading"
            @saveData="saveData"
            @edit-btn="editBtn"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            @selectChange="selectChange"
            searchId="test"
            pageID="test">
            <div slot="table-module-btn">
                <el-tooltip class="item" effect="dark" content="新增" placement="bottom">
                    <el-button size="mini" icon='el-icon-plus' @click="addData"></el-button>
                </el-tooltip>
                <el-tooltip effect='dark'
                    content='导入'
                    placement='bottom'>
                    <span v-has="'05030003'" class="mgl-10">
                        <el-button icon='el-icon-upload2'
                            size='mini' @click="showImport"></el-button>
                    </span>
                </el-tooltip>
                <el-tooltip effect='dark'
                    content='导出'
                    placement='bottom'>
                    <span v-has="'05030004'" class="mgl-10">
                        <el-button icon='el-icon-download'
                            size='mini' @click="exportEvent"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'05030001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05030002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
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
import { charRulesList, charRulesEdit, charRulesDelete } from '../../../api/configCenter';
import { feeRuleExcelExport } from '../../../api/export';
export default {
    name: 'charge',
    components: { mPane, paper, Import },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            selectRow: [],
            mustFillParams: {
                customerName: '',
                customerCode: '',
                orderType: '',
                siteName: '',
                siteCode: '',
                whName: '',
                whCode: '',
                pickFlag: '',
                feeType: ''
            },
            exportType: false
        };
    },
    methods: {
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
            this.selectRow = data;
        },
        switchChange(data) {
            // 表格内switch切换事件
        },
        searchChange(data) {
            // 提交搜索框
            this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
            if (this.exportType) {
                feeRuleExcelExport(this.searchParams).then(res => {
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
        addData() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addRow();
        },
        showImport() {
            this.$refs.Import.orderImportC();
        },
        saveData(data) {
            // 表格新增修改后返回数据
            const mData = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (mData.length <= 0 && mData !== false) {
                this.$message.warning('请至少选择一项');
                return;
            }
            if (!mData) {
                this.$message.error('必填项不能为空');
                return;
            }
            charRulesEdit(mData).then((res) => {
                if (res && res.code === '0') {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.fetchData();
                }
            });
        },
        redomet() {
            // 这是删除方法
            const data = this.selectRow;
            if (!data.length) {
                this.$message.warning('请至少选择一项');
                return;
            }
            const idList = [];
            data.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (idList.length === 0) {
                this.fetchData();
                return;
            }
            const id = idList.join(',');
            messageBox(this).then(() => {
                charRulesDelete({}, id).then(res => {
                    if (res.code === '0') {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.fetchData();
                    }
                });
            });
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        },
        async fetchData() {
            const res = await charRulesList(this.searchParams);
            if (res) {
                // 当前页码大于数据总页数的时候，取最大页数并重新获取数据
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    this.totalData = res.data.list.map(item => {
                        return { ...this.mustFillParams, ...item };
                    });
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.totalData = [];
            }
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
    created() {
        this.fetchData();
    }
};
</script>
