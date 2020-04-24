<template>
    <paper>
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="tableData"
            :pageTotal="pageTotal"
            :optionNum="optionNum"
            :loading="loading"
            :searchTotalTitle="searchTotalTitle"
            @saveData="saveData"
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
            pageID="test"
        >
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
        </m-pane>
        <add-exception-dialog ref="addDialog" @success="fetchData" :form="curRow"></add-exception-dialog>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.json';
import paper from '@/components/core/paper/Paper';
import AddExceptionDialog from './addException';
import { getExceptionList, delException, closeException } from '../../../api/omscExeptionApi';

export default {
    name: 'orderException',
    components: { mPane, paper, AddExceptionDialog },
    data() {
        return {
            config: config,
            loading: false,
            optionNum: '',
            tableData: [],
            curRow: {},
            pageTotal: 0,
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            searchTotalTitle: config.searchTotalTitle
        };
    },
    methods: {
        async fetchData() {
            this.loading = true;
            const res = await getExceptionList(this.searchParams);
            if (res && res.code === '0') {
                if (res.data.totalPage !== 0 && this.searchParams.pageNo > res.data.totalPage) {
                    this.searchParams.pageNo = res.data.totalPage;
                    this.fetchData();
                } else {
                    this.tableData = res.data.list || [];
                    this.tableData.forEach(item => {
                        if (item.checkStatus === 1) {
                            item.hiddenEvent = ['edit', 'check', 'del'];
                        }
                        item.checkStatus = item.checkStatus === 1 ? '已关闭' : '未关闭';
                    });
                    this.pageTotal = res.data.totalCount;
                }
            } else {
                this.tableData = [];
            }
            this.loading = false;
        },
        checkBtn(data) {
            // 表格内按钮查看事件;
            closeException({ id: data.id, version: data.version, checkStatus: 1 }).then(res => {
                if (res) {
                    this.$message.success('关闭成功!');
                    this.fetchData();
                }
            });
        },
        editBtn(data) {
            // 表格内按钮修改事件;
            this.$refs['addDialog'].show(true, false);
            data.checkStatus = data.checkStatus === '已关闭' ? 1 : 0;
            this.curRow = data;
        },
        delBtn(data) {
            // 表格内按钮删除事件;
            delException(data.id).then(res => {
                if (res) {
                    this.$message.success('删除成功!');
                    this.fetchData();
                }
            });
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

            this.searchParams = {
                ...this.searchParams,
                ...data,
                pageNo: 1
            };
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
            this.$refs['addDialog'].show();
        },
        saveData(data) {
            // 表格新增修改后返回数据
        },
        redomet(data) {
            // 这是删除方法
        },
        getTableConfigList(data) {},
        refresh() {
            // 表格内刷新按钮
        },
        // 关闭
        orderClose() {
        },
        // 计算时间差
        intervalTime(startTime, endTime) {
        },
        // 处理
        orderHandle() {

        }
    },
    mounted() {
        this.fetchData();
    }
};
</script>
