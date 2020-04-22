<template>
    <paper class="dot-coverage">
        <m-pane
            ref="tablePage"
            :config="config"
            :pageTotal="pageTotal"
            :loading="loading"
            :totalData="totalData"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            @check-btn="checkBtn">
            <div slot="table-module-btn">
                <el-tooltip effect="dark" content="导出" placement="bottom">
                    <span v-has="'10010001'" class="mgl-10">
                    <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
                    </span>
                </el-tooltip>
            </div>
        </m-pane>
    </paper>
</template>

<script>
import mPane from '@/components/otpPanel';
import paper from '@/components/core/paper/Paper';
import config from './config.js';
import { getLists, exportNetInfos } from '../../../api/netInfos';
export default {
    components: { paper, mPane },
    data() {
        return {
            config,
            pageTotal: 0,
            loading: false,
            totalData: [],
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            addDataObj: {},
            viewVisiableDialog: false,
            viewDataObj: {}
        };
    },
    methods: {
        getList() {
            this.loading = true;
            getLists(this.searchParams).then(res => {
                this.loading = false;
                if (res && +res.code === 0) {
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
            }).catch(() => {
                this.loading = false;
            });
        },
        load() {
            this.getList();
        },
        searchChange(data) {
            this.searchParams = {
                ...this.searchParams,
                ...data
            };
            this.getList();
        },
        pageChange(data) {
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange(data) {
            this.searchParams.pageSize = data;
            this.getList();
        },
        exportFile() {
            // pageSize设置很大，因为后端有默认值
            const params = { ...this.searchParams, pageSize: 1000000000 };
            exportNetInfos(params).then(res => {
                if (res && +res.code === 0) this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
            });
        },
        checkBtn() {
            this.viewVisiableDialog = true;
        },
        viewHandleClose() {
            this.viewVisiableDialog = false;
        },
        viewSaveOk() {}
    },
    mounted() {
        this.load();
    }
};
</script>
<style lang="less">
    .dot-coverage {
        .page-module-btn {
            margin-left: 10px;
        }
    }
</style>