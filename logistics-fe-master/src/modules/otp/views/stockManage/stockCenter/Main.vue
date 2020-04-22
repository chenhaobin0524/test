<template>
    <paper id="agingProduct">
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :loading="loading"
            :searchTotalTitle="searchTotalTitle"
            @saveData="saveData"
            @row-db-click="rowDBclick"
            @check-btn="checkBtn"
            @edit-btn="editBtn"
            @switch-change="switchChange"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            @btnClick="btnClick"
            searchId="test"
            pageID="test"
        >
        <div slot="table-module-btn">
            <el-tooltip effect="dark" content="导出" placement="bottom">
                <span class="mgl-10">
                <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
                </span>
            </el-tooltip>
        </div>
        </m-pane>
        <detail-dialog ref="DetailDialog"></detail-dialog>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import { getCenterInv, stockCenterExport } from '../../../api/stockManage';
import DetailDialog from './_detailDialog';
export default {
    components: { mPane, paper, DetailDialog },
    data() {
        return {
            config: config,
            totalData: [],
            loading: false,
            pageTotal: 10,
            searchTotalTitle: config.searchTotalTitle,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            }
        };
    },
    methods: {
        getList() {
            getCenterInv(this.searchParams).then(res => {
                this.loading = false;
                this.$refs.tablePage.changeLoading(false);
                if (res) {
                    if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                        this.searchParams.pageNo = res.data.totalPage;
                        this.getList();
                    } else {
                        this.totalData = res.data.list || [];
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
            this.visible = true;
        },
        editBtn(data) {
            // 表格内按钮修改事件;
        },
        btnClick(val, index, row) {
            this.$refs['DetailDialog'].show(true, row);
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
            this.loading = true;
            this.$refs.tablePage.changeLoading(true);
            // if (!data.invType) {
            //     data.invType = 'whInv';
            // }
            this.searchParams = { ...this.searchParams, ...data, pageNo: 1 };
            if (this.searchParams.itemCodes && this.searchParams.itemCode) delete this.searchParams.itemCodes;
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
        saveData(data) {
            // 表格新增修改后返回数据
        },
        redomet(data) {
            // 这是删除方法
        },
        refresh() {
            // 表格内刷新按钮
        },
        // 导出
        exportFile() {
            const params = { ...this.searchParams };
            Reflect.deleteProperty(params, 'pageNo');
            Reflect.deleteProperty(params, 'pageSize');
            stockCenterExport(params).then(res => {
                this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
            });
        }
    },
    beforeRouteEnter (to, from, next) {
        if (from.path === '/order-manage/order-center' || from.path === '/order-manage/order-detail') {
            next(vm => {
                if (vm.$route.params.invType) {
                    if (vm.$refs.tablePage.$refs.searchList.searchData.itemCode) {
                        delete vm.$refs.tablePage.$refs.searchList.searchData.itemCode;
                        delete vm.$refs.tablePage.$refs.searchList.searchData.itemName;
                    }
                    vm.$refs.tablePage.$refs.searchList.searchData = {
                        ...vm.$refs.tablePage.$refs.searchList.searchData,
                        ...vm.$route.params
                    };
                    vm.$refs.tablePage.$refs.searchList.onSearchChange();
                }
            });
        } else {
            next();
        }
    }
};
</script>
