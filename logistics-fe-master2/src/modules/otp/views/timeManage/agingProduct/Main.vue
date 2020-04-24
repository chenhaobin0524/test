<template>
    <paper id="agingProduct">
        <m-pane
            ref="tablePage"
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
            @switch-change="switchChange"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            searchId="test"
            pageID="test"
        >
            <div slot="table-module-btn">
                <el-tooltip class="item" effect="dark" content="新增" placement="bottom">
                    <el-button size="mini" icon="el-icon-plus" @click="addData"></el-button>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'06010001'"><el-button type="primary" @click="redomet">删 除</el-button></span>
                <span style="margin-left: 15px;" v-has="'06010002'"><el-button type="primary" @click="saveData">保 存</el-button></span>
            </div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { getAgingProduct, agingProductAdd, agingProductDelete } from '../../../api/timeManage';

export default {
    name: 'agingProduct',
    components: { mPane, paper },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            totalData: [],
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            visible: false,
            dialog: config.dialog,
            tabList: [{ label: '节点时效配置' }],
            current: 0,
            tableData: [],
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            selectRow: [],
            mustFillParams: {
                agingProductCode: '',
                agingProductType: '',
                agingProductHour: '',
                longDay: ''

            }
        };
    },
    methods: {
        getAgingProduct() {
            const that = this;
            getAgingProduct(this.searchParams).then(res => {
                if (res.code === '0') {
                    that.totalData = res.data.list.map(item => { return { ...that.mustFillParams, ...item }; });
                    this.pageTotal = res.data.totalCount;
                }
            });
        },
        rowDBclick(row) {
            // 表格内双击事件
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
            this.visible = true;
        },
        editBtn(data) {
            // 表格内按钮修改事件;
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
            this.searchParams = { ...this.searchParams, ...data };
            this.getAgingProduct();
        },
        pageChange(data) {
            // 分页器页数变化
            this.searchParams.pageNo = data;
            this.getAgingProduct();
        },
        sizeChange(data) {
            // 分页器页数大小变化
            this.searchParams.pageSize = data;
            this.getAgingProduct();
        },
        addData() {
            // 表格新增方法
            this.$refs.tablePage.$refs.table.addRow();
        },
        saveData(data) {
            // 表格新增修改后返回数据
            const params = this.$refs.tablePage.$refs.table.$refs.mNewTable.saveData();
            if (params.length === 0) {
                this.$message.warning('请至少选择一条数据');
                return;
            }
            if (!params) {
                this.$message.error('必填项不能为空');
                return;
            }
            agingProductAdd(params).then(res => {
                if (res.code === '0') {
                    this.$message.success('操作成功');
                    this.getAgingProduct();
                }
            });
        },
        redomet(data) {
            // 这是删除方法
            const params = this.selectRow;
            if (params.length === 0) {
                this.$message.warning('请至少选择一条数据');
                return;
            }
            const idList = [];
            params.map(item => { if (item.id) { idList.push(item.id); } });
            if (!idList.length) { this.getAgingProduct(); }
            agingProductDelete(idList).then(res => {
                if (res.code === '0') {
                    this.$message.success('删除成功');
                    this.getAgingProduct();
                }
            });
        },
        getTableConfigList(data) {},
        refresh() {
            // 表格内刷新按钮
        },
        orderImportC() {
            this.$refs.Import.orderImportC();
        },
        addDetail() {
            this.$refs.transTable.showDialog();
        },
        changeActive(index) {
            this.current = index;
        }
    },
    mounted() {
        this.getAgingProduct();
    }
};
</script>
<style lang="less">
#agingProduct {
    .tableHeader {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        .tagList {
            flex: 1;
            display: flex;
            .active {
                color: #00bcbf;
                border-bottom: 2px solid #00bcbf;
                box-sizing: border-box;
            }
            .tag {
                text-align: center;
                font-size: 13px;
                width: 120px;
                height: 100%;
                p {
                    line-height: 40px;
                    margin: 0;
                }
            }
        }
    }
}
</style>
