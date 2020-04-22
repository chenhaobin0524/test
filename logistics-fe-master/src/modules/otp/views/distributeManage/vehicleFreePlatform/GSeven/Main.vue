<template>
    <div class='g-seven-list'>
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :loading="loading"
            :currentPage="currentPage"
            searchId="GSevenQuery"
            pageID="GSeven"
            @edit-btn="editBtn"
            @del-btn="delBtn"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange">
            <div slot="table-module-btn">
                <el-button type="primary" @click="againClick">重新推送</el-button>
                <el-tooltip effect="dark" content="导出" placement="bottom">
                    <span class="mgl-10">
                    <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
                    </span>
                </el-tooltip>
            </div>
        </m-pane>
        <!-- <push-log-dialog
            v-if="visiableDialog"
            :label-position="labelPosition"
            :visiableDialog.sync="visiableDialog"
            @handleClose="handleClose"
            :dataLists='dataObj'
            @addOk="addOk"
        ></push-log-dialog> -->
        <edit-dialog
            v-if="visiableDialog"
            :label-position="labelPosition"
            :visiableDialog.sync="visiableDialog"
            :data="dataObj"
            @handleClose="handleClose"
            @saveOk="saveOk">

        </edit-dialog>
    </div>
</template>

<script>
import mPane from '@/components/otpPanel';
import config from './config.js';
import EditDialog from './Edit';
import { getLists, getAgainLists, deleteList, noCarPushLogExport } from '../../../../api/vehicleFreePlatform';
import formatTime from '@/utils/common.js';
export default {
    components: { mPane, EditDialog },
    data() {
        return {
            selected: [],
            searchDataLists: {
                pageNo: 1,
                pageSize: 10,
                noCarCarrierType: '20'
            },
            dataObj: {},
            currentPage: 1,
            selectData: [],
            pageTotal: 0,
            totalData: [],
            loading: false,
            config,
            labelPosition: 'right',
            visiableDialog: false,
            activeName: 'first'
        };
    },
    methods: {
        load() {
            this.loading = true;
            // const params = {
            //     pageNo: this.searchObj.pageNo,
            //     pageSize: this.searchObj.pageSize,
            //     dispatchNo: this.searchDataLists.dispatchNo ? this.searchDataLists.dispatchNo : '',
            //     status: this.searchDataLists.status,
            //     beginDate: this.searchDataLists.createTime ? formatTime.formatDateTime(this.searchDataLists.createTime[0]) : '',
            //     endDate: this.searchDataLists.createTime ? formatTime.formatDateTime(this.searchDataLists.createTime[1]) : '',
            //     siteCode: this.searchDataLists.siteCode ? this.searchDataLists.siteCode : '',
            //     ...val,
            //     noCarCarrierType: '20'
            // };
            this.currentPage = this.searchDataLists.pageNo;
            getLists(this.searchDataLists).then(res => {
                if (res) {
                    this.pageTotal = res.data.totalCount;
                    this.loading = false;
                    this.totalData = res.data.list || [];
                    this.totalData.map(item => {
                        item.statusText = window.sessionStorage.S_F_FLAG ? JSON.parse(window.sessionStorage.S_F_FLAG)[item.status] : item.status;
                        if (item.status === 'SUCCESS') {
                            item.hiddenEvent = [ 'edit' ];
                        } else {
                            item.hiddenEvent = [ 'delete' ];
                        }
                    });
                }
            }).catch(() => {
                this.loading = false;
            });
        },
        againClick() {
            if (this.selected.length === 0) {
                this.$message.warning('至少选择一条数据');
                return;
            } else if (this.selected.length > 20) {
                this.$message.warning('最多只能选择20条数据');
                return;
            }
            for (let index = 0; index < this.selected.length; index++) {
                if (this.selected[index].status === 'SUCCESS') {
                    this.$message.warning('成功状态下不能再次推送');
                    return;
                }
            }
            const arr = [];
            this.selected.forEach(item => {
                arr.push({ dispatchNo: item.dispatchNo, status: item.status });
            });
            getAgainLists(arr).then(res => {
                if (res.code === '0') {
                    this.$message.success('重新推送成功');
                }
                this.load();
            });
        },
        editBtn(data) {
            this.dataObj = data;
            this.dispatchNo = data.dispatchNo;
            this.visiableDialog = true;
        },
        handleClose() {
            this.visiableDialog = false;
        },
        pageChange(data) {
            this.searchDataLists.pageNo = data;
            this.load();
        },
        sizeChange(data) {
            this.searchDataLists.pageSize = data;
            this.searchDataLists.pageNo = 1;
            this.load();
        },
        searchChange(data) {
            if (data.createTime !== null && data.createTime !== '') {
                data.beginDate = formatTime.formatDateTime(data.createTime[0]);
                data.endDate = formatTime.formatDateTime(data.createTime[1]);
            } else {
                data.beginDate = '';
                data.endDate = '';
            };
            this.dispatchNo = data.dispatchNo;
            this.status = data.status;
            this.siteCode = data.siteCode;
            delete data.createTime;
            this.searchDataLists = {
                ...this.searchDataLists,
                ...data,
                pageNo: 1
            };
            this.load();
        },
        selectChange(data) {
            data.forEach(item => {
                this.dispatchNo = item.dispatchNo;
            });
            this.selected = [].concat(data);
        },
        delBtn(data) {
            this.$confirm('确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteList(data.dispatchNo).then(res => {
                    if (res && res.code === '0') {
                        this.$message.success('删除成功');
                        this.load();
                    }
                });
            }).catch(() => {});
        },
        saveOk(data) {
            if (data) {
                this.visiableDialog = false;
                this.load();
            }
        },
        exportFile() {
            const params = {
                ...this.searchDataLists,
                flag: 2
            };
            Reflect.deleteProperty(params, 'pageNo');
            Reflect.deleteProperty(params, 'pageSize');
            noCarPushLogExport(params).then(res => {
                if (res) {
                    this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
                }
            });
        }
    },
    mounted() {
        // setTimeout(() => {
        //     this.load();
        // }, 50);
    }
};
</script>

<style lang="less">
.g-seven-list {
    #mPane3 {
        .el-table {
            min-height: calc(100vh - 208px);
            max-height: calc(100vh - 208px);
        }
    }
    .text-color {
        text-align: center;
        width: 50px;
        display: inline-block;
    }
    .el-tabs__item {
        height: 28px !important;
        line-height: 28px !important;
    }
    .el-tabs__header {
        margin: 0 0 10px;
    }
}
</style>
