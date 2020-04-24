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
                <span v-has="'05130001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05130002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { messageBox } from '../../../utils/messageBox';
import { thirdPartyList, thirdPartyAdd, thirdPartyDel } from '../../../api/configCenter';

export default {
    name: 'thirdParty',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            searchParams: { pageNo: 1, pageSize: 10 },
            selectRow: [],
            mustFillParams: {
                whName: '',
                customerName: '',
                mideaFlag: '',
                thirdPart: ''
            }
        };
    },
    methods: {
        getList() {
            thirdPartyList(this.searchParams).then(res => {
                if (res) {
                // 当前页码大于数据总页数的时候，取最大页数并重新获取数据
                    if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                        this.searchParams.pageNo = res.data.totalPage;
                        this.getList();
                    } else {
                        res.data.list.map(item => {
                            item.mideaFlag = item.mideaFlag + '' === '1' ? 'Y' : 'N';
                            item.thirdPart = item.thirdPart + '' === '1' ? 'Y' : 'N';
                        });
                        this.totalData = res.data.list.map(item => {
                            return { ...this.mustFillParams, ...item };
                        });
                        this.pageTotal = res.data.totalCount;
                    }
                } else {
                    this.totalData = [];
                }
            });
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
            this.$refs.tablePage.$refs.table.addRow();
        },
        saveData() {
            // 表格新增修改后返回数据
            const row = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (!row) {
                return;
            }
            if (!row.length) {
                this.$message.warning('请勾选数据');
                return;
            }
            row.map(item => {
                item.mideaFlag = item.mideaFlag === 'Y' ? 1 : 0;
                item.thirdPart = item.thirdPart === 'Y' ? 1 : 0;
                if (item.backup) {
                    delete item.backup;
                }
                if (item.serialNum) {
                    delete item.serialNum;
                }
            });
            thirdPartyAdd(row).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.getList();
                }
            });
        },
        redomet(data) {
            // 这是删除方法
            if (!this.selectRow.length) {
                this.$message.warning('请勾选要删除的数据');
                return;
            }
            const idList = [];
            this.selectRow.map(item => {
                if (item.id) {
                    idList.push(item.id);
                }
            });
            if (!idList.length) {
                this.getList();
                return;
            }
            messageBox(this).then(() => {
                thirdPartyDel(idList).then(res => {
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
    },
    mounted() {
        this.getList();
    }
};
</script>
