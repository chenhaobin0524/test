<template>
    <div class='vehicleFreePlatformList'>
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :currentPage="currentPage"
            :loading="loading"
            searchId="vehicleFreePlatformQuery"
            pageID="vehicleFreePlatform"
            @edit-btn="editBtn"
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
        <push-log-dialog
            v-if="visiableDialog"
            :label-position="labelPosition"
            :visiableDialog.sync="visiableDialog"
            @handleClose="handleClose"
            :dataLists='dataObj'
            @addOk="addOk"
        ></push-log-dialog>
    </div>
</template>

<script>
import mPane from '@/components/otpPanel';
import config from './config.js';
import pushLogDialog from '../../../../components/dialog/pushLogDialog';
import { getLists, getAgainLists, getUpdateLists, noCarPushLogExport } from '../../../../api/vehicleFreePlatform';
import formatTime from '@/utils/common.js';
export default {
    components: { mPane, pushLogDialog },
    data() {
        return {
            selected: [],
            searchDataLists: {
                pageNo: 1,
                pageSize: 10,
                noCarCarrierType: '10'
            },
            dataObj: {},
            selectData: [],
            currentPage: 1,
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
            this.currentPage = this.searchDataLists.pageNo;
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
            //     noCarCarrierType: '10'
            // };
            // const statusMap = new Map();
            const resultMap = new Map();
            // statusMap.set('SUCCESS', '成功').set('FAIL', '失败');
            resultMap.set('0', '成功').set('1', '失败');
            getLists(this.searchDataLists).then(res => {
                this.totalData = res.data.list.map(item => {
                    // item.statusText = statusMap.get(item.status);
                    item.statusText = window.sessionStorage.S_F_FLAG ? JSON.parse(window.sessionStorage.S_F_FLAG)[item.status] : item.status;
                    item.resultText = resultMap.get(item.result);
                    return item;
                });
                this.totalData.forEach((item, index) => {
                    switch (item.status) {
                    case 'SUCCESS':
                        item.hiddenEvent = [ 'edit' ];
                        break;
                    }
                });
                this.pageTotal = res.data.totalCount;
                this.loading = false;
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
        addOk(formName) {
            const dispatchNo = this.dispatchNo;
            formName.data['dispatchNo'] = dispatchNo;
            if (formName.state === true) {
                getUpdateLists(formName.data, this.dispatchNo).then(res => {
                    if (res && res.code === '0') {
                        this.$message.success('编辑成功');
                        this.load();
                    }
                });
            } else {
                return false;
            }
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
        exportFile() {
            const params = {
                ...this.searchDataLists,
                flag: 1
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
.vehicleFreePlatformList {
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