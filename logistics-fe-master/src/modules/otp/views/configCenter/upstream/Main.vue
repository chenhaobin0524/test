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
            @selectChange="selectChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            searchId="test"
            pageID="test">
            <div slot="table-module-btn">
                <el-tooltip class="item" effect="dark" content="新增" placement="bottom">
                    <el-button size="mini" icon='el-icon-plus' @click="addData"></el-button>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'05090001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 10px;" v-has="'05090002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { messageBox } from '../../../utils/messageBox';
import { getCustomerConfirmRules, batchUpdateCustomerConfirmRules, batchDeleteCustomerConfirmRules } from '../../../api/configCenter';

export default {
    name: 'upstream',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            // 选中的行数
            selectData: [],
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            }
        };
    },
    methods: {
        async fetchData() {
            const res = await getCustomerConfirmRules(this.searchParams);
            if (res) {
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    res.data.list.forEach(element => {
                        element.partFlag = element.partFlag === 1 ? 'Y' : 'N';
                        element.batchFlag = element.batchFlag === 1 ? 'Y' : 'N';
                        element.confirmFlag = element.confirmFlag === 1 ? 'Y' : 'N';
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
            this.fetchData();
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
                const { sourceSystem, orderType, version, customerCode, customerName } = item;
                let { partFlag, batchFlag, confirmFlag } = item;
                partFlag = partFlag === 'Y' ? 1 : 0;
                batchFlag = batchFlag === 'Y' ? 1 : 0;
                confirmFlag = confirmFlag === 'Y' ? 1 : 0;
                return { sourceSystem, orderType, partFlag, batchFlag, confirmFlag, version, customerCode, customerName, ...obj };
            });
            const res = await batchUpdateCustomerConfirmRules(selectData);
            if (res) {
                this.$message.success('保存成功');
                this.fetchData();
            }
        },
        async redomet() {
            // 这是删除方法
            if (this.selectData.length < 1) {
                this.$message.warning('至少勾选一条数据进行操作');
                return;
            }
            // 表格删除后返回数据
            const selectData = this.selectData.filter(item => item.id).map(item => item.id);
            if (selectData.length > 0) {
                messageBox(this).then(async () => {
                    const res = await batchDeleteCustomerConfirmRules(selectData);
                    if (res) {
                        this.$message.success('删除成功');
                    }
                    this.fetchData();
                });
            }
        },
        getTableConfigList(data) {
        },
        refresh() {
            // 表格内刷新按钮
        }
    },
    mounted() {
        this.fetchData();
    }
};
</script>
