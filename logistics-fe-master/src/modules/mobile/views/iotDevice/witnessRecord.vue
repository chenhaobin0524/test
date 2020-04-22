<template>
    <div class="witnessRecord tabContent">
        <el-row>
            <el-col :span='21'>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.userCode' placeholder='账号' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.userName' placeholder='姓名' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.userIdNo' placeholder='身份证' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <div class="searchItem">
                        <el-input v-model.trim='searchData.userPhone' placeholder='手机号' clearable></el-input>
                    </div>
                </el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click='queryBtn'>查 询</el-button>
                </el-col>
            </el-col>
            <el-col :span='3' style="text-align: right;">
                <el-button @click='showSyncData'>同步数据</el-button>
            </el-col>
        </el-row>
        <div class="table-content" style="margin-top: 10px;">
            <el-table
                :data="tableData"
                style="width: 100%"
                border
                v-loading='loading'
                >
                <el-table-column prop="userCode" label="账号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userName" label="姓名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userIdNo" label="身份证" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userGenderText" label="性别" show-overflow-tooltip></el-table-column>
                <el-table-column label="相片">
                    <template slot-scope="{row}">
                        <div class="img-content" v-if='row.imgArr.length > 0'>
                            <img :src="row.imgArr[0]" width='100' style='vertical-align: middle;'>
                            <div class="img-shade">
                                <div class='img-zoom el-icon-zoom-in' @click="viewClick(row)"></div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="birth" label="生日" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userStatusText" label="用户状态" show-overflow-tooltip></el-table-column>
                <el-table-column prop="updateTime" label="同步时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userPhone" label="手机号" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="table-pagination">
            <el-pagination
                class="is-background"
                :pager-count="5"
                :layout="pageOptions.layout"
                :total="pageOptions.total"
                :current-page="pageOptions.currentPage"
                :page-sizes="pageOptions.pageSizes"
                :page-size="pageOptions.pageSize"
                @size-change='sizeChange'
                @current-change='pageChange'>
            </el-pagination>
        </div>

        <el-dialog
            :title="userName"
            v-if='visible'
            :visible.sync="visible"
            width='40%'
            :before-close='beforeClose'
            >
            <div style='height: 300px;'>
                <ul id='viewImg' style="display: none;">
                    <li v-for='(item, index) in imgArr' :key='index'>
                        <img :src="item">
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="beforeClose">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog
            :before-close='syncDataBeforeClose'
            :closeOnClickModal='false'
            title="同步数据"
            :visible.sync="syncDataVisible"
            class="iotDeviceWitnessRecordSyncDataDialog"
            width="40%">
            <el-date-picker
                v-model="startTime"
                value-format="yyyy-MM-dd"
                type="date"
                :picker-options="syncPickerOptions"
                placeholder="同步起始日期">
            </el-date-picker>
            <el-button type='primary' @click='syncMdmUser' :disabled="syncMdmUserDisabled">同步访问记录</el-button>
            <el-button type='primary' @click='syncMdmUserRecord' :disabled='syncMdmUserRecordDisabled'>同步员工记录</el-button>
            <span slot="footer" class="dialog-footer">
                <el-button @click="syncDataBeforeClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import api from '@/modules/mobile/api/iotDevice/iotDevice.js';

export default {
    data() {
        return {
            userName: '',
            disabledTime: 1000 * 60 * 5,
            syncMdmUserDisabled: false,
            syncMdmUserRecordDisabled: false,
            dialogLoading: {},
            startTime: '',
            syncDataVisible: false,
            viewer: {},
            imgArr: [],
            visible: false,
            searchData: {
                userCode: '',
                userName: '',
                userIdNo: '',
                userPhone: ''
            },
            syncPickerOptions: {
                disabledDate(date) {
                    return date > new Date();
                }
            },
            tableData: [],
            loading: false,
            pageOptions: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSize: 10,
                pageSizes: [10, 20, 50, 100],
                total: 0,
                currentPage: 1
            },
            searchParams: {}
        };
    },
    methods: {
        loadingDialog(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.iotDeviceWitnessRecordSyncDataDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        syncMdmUser() {
            this.sendRequest('syncMdmUserDisabled', 'iotDeviceWitnessRecordSyncMdmUserDisabled', 'syncMdmUserTimeout', 'syncMdmUser');
        },
        sendRequest(disabled, local, timeOut, apis) {
            if (!this.startTime) {
                this.$message.warning('请选择同步起始日期');
                return false;
            }
            this.loadingDialog();
            api[apis]({ startTime: this.startTime + ' 00:00:01' }).then(res => {
                if (res) {
                    this.$message({
                        type: 'success',
                        message: '数据同步中，请稍后刷新页面',
                        showClose: true,
                        duration: 8000
                    });
                    this[disabled] = true;
                    localStorage.setItem(local, new Date().getTime());
                    this[timeOut] = setTimeout(() => {
                        this[disabled] = false;
                        localStorage.removeItem(local);
                    }, this.disabledTime);
                }
                this.loadingDialog(false);
            }).catch(() => {
                this.loadingDialog(false);
            });
        },
        syncMdmUserRecord() {
            this.sendRequest('syncMdmUserRecordDisabled', 'iotDeviceWitnessRecordSyncMdmUserRecordDisabled', 'syncMdmUserRecordTimeout', 'syncMdmUserRecord');
        },
        showSyncData() {
            this.syncDataVisible = true;
        },
        syncDataBeforeClose() {
            this.syncDataVisible = false;
        },
        beforeClose() {
            this.visible = false;
            this.viewer.destroy();
        },
        viewClick(row) {
            this.visible = true;
            this.userName = row.userName;
            this.imgArr = row.imgArr;
            this.$nextTick(() => {
                const barOptions = { show: true, size: 'small' };
                const options = {
                    inline: true,
                    title: false,
                    navbar: false,
                    button: false,
                    toolbar: {
                        zoomIn: barOptions,
                        zoomOut: barOptions,
                        prev: barOptions,
                        reset: barOptions,
                        next: barOptions,
                        rotateLeft: barOptions,
                        rotateRight: barOptions
                    }
                };
                if (row.imgArr.length < 2) {
                    delete options.toolbar.prev;
                    delete options.toolbar.next;
                }
                this.viewer = new Viewer(document.getElementById('viewImg'), options);
            });
        },
        queryBtn() {
            this.searchParams.pageNo = 1;
            this.searchParams = { ...this.searchParams, ...this.searchData };
            this.getDataList(this.searchParams);
        },
        sizeChange(data) {
            this.searchParams.pageSize = data;
            this.searchParams.pageNo = 1;
            this.getDataList(this.searchParams);
        },
        pageChange(data) {
            this.searchParams.pageNo = data;
            this.getDataList(this.searchParams);
        },
        // 获取列表数据
        getDataList({ userCode, userName, userIdNo, userPhone, pageSize, pageNo } = { pageSize: 10, pageNo: 1 }) {
            const params = { userCode, userName, userIdNo, userPhone, pageSize, pageNo };
            this.searchParams = params;
            this.pageOptions.currentPage = pageNo;
            this.loading = true;
            api.mdmUsers(params).then(res => {
                if (res) {
                    res.data.list.forEach(item => {
                        item.userGenderText = item.userGender === 0 ? '男' : '女';
                        item.userStatusText = item.userStatus === 0 ? '正常' : '禁用';
                        item.imgArr = [];
                        if (item.identifyImage !== undefined && item.identifyImage.length > 0) item.imgArr.push('https://kunp.midea.com/kpfile/mobile/idcar/' + item.identifyImage);
                        if (item.baseImage !== undefined && item.baseImage.length > 0) item.imgArr.push('https://kunp.midea.com/kpfile/mobile/idcar/' + item.baseImage);
                    });
                    this.tableData = res.data.list;
                    this.pageOptions.total = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        initDisabled() {
            const handle = (local, disabled, timeout) => {
                const exist = localStorage.getItem(local);
                if (exist && (+exist + this.disabledTime > new Date().getTime())) {
                    this[disabled] = true;
                    this[timeout] = setTimeout(() => {
                        this[disabled] = false;
                        localStorage.removeItem(local);
                    }, this.disabledTime - (new Date().getTime() - exist));
                }
            };
            handle('iotDeviceWitnessRecordSyncMdmUserDisabled', 'syncMdmUserDisabled', 'initSyncMdmUserTimeout');
            handle('iotDeviceWitnessRecordSyncMdmUserRecordDisabled', 'syncMdmUserRecordDisabled', 'initSyncMdmUserRecordTimeout');
        }
    },
    created() {
        // 获取列表数据
        this.getDataList();
        this.initDisabled();
    },
    beforeDestroy () {
        clearTimeout(this.syncMdmUserTimeout);
        clearTimeout(this.initSyncMdmUserTimeout);
        clearTimeout(this.syncMdmUserRecordTimeout);
        clearTimeout(this.initSyncMdmUserRecordTimeout);
    }
};
</script>

<style lang="less">
.witnessRecord {

    .table-content {
        height: calc(100vh - 201px);
        overflow-y: auto;
    }
    .img-content {
        display: inline-block;
        position: relative;

        &:hover .img-shade {
            display: flex;
        }
    }
    .img-shade {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .7);
        top: 0;
        color: #fff;
        font-size: 25px;
        display: none;
        justify-content: center;
        align-items: center;
    }
    .img-zoom:hover {
        font-size: 30px;
        cursor: pointer;
    }
    .viewer-toolbar > ul > .viewer-small {
        margin: 3px;
    }
    .viewer-backdrop {
        background-color: #fff;
    }
    .el-dialog__wrapper {
        .el-button {
            margin-left: 10px;
        }
        .el-dialog__body {
            text-align: center;
        }
    }
}
</style>
