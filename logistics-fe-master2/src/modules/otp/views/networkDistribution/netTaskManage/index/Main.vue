<template>
  <paper class="net-task">
    <m-pane ref="tablePage" :config="config" :pageTotal="pageTotal" :loading="loading" :totalData="totalData"
      :searchTotalTitle="config.searchTotalTitle" searchId="netTaskManageQuery" pageID="netTaskManage"
      @selectChange="selectChange" @searchChange="searchChange" @pageChange="pageChange" @sizeChange="sizeChange"
      @check-btn="checkBtn" @branchSign-btn="branchSignBtn" @terminalSign-btn="terminalSignBtn"
      @netInbound-btn="netInboundBtn" @netOutbound-btn="netOutboundBtn" @photos-btn="photosBtn"
      @row-db-click="rowDBclick"  @print-btn="printBtn">
      <div slot="table-module-btn">
        <el-tooltip effect="dark" content="导出" placement="bottom" v-has="'10030001'">
          <span class="mgl-10">
            <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
          </span>
        </el-tooltip>
      </div>
      <div slot="page-module-btn">
        <span>
          <el-button type="primary" @click="handleAppointNote" v-has="'10030003'">预约备注</el-button>
        </span>
        <span class="page-module-btn">
          <el-button type="primary" @click="handleNetDispatch" v-has="'10030004'">网点派工</el-button>
        </span>
        <span class="page-module-btn">
          <el-button type="primary" @click="mulAllTypeUpload" v-has="'10030005'">附件上传</el-button>
        </span>
      </div>
    </m-pane>
    <branch-sign ref='branchSign' v-if="branchSignShow" :signInShow.sync='branchSignShow' :type="type"
        :titleName="titleName" :rowData="rowData" :certification='certification'
        @branchSignUploadResponse="branchSignUploadResponse" :onBeforeUpload="beforeUpload" @saveOk="signSaveOk">
    </branch-sign>
    <appoint-note v-if="appointNoteDialogVisible" :dialogVisible.sync="appointNoteDialogVisible"
        :data="appointNoteDataObj" :selected="selected" @handleClose="appointNoteHandleClose" @saveOk="appointNoteSaveOk">
    </appoint-note>
    <net-dispatch v-if="netDispatchDialogVisible" :dialogVisible.sync="netDispatchDialogVisible"
        :selected="selected" @handleClose="netDispatchHandleClose" @saveOk="netDispatchSaveOk">
    </net-dispatch>
    <!-- 批量操作签收附件按钮使用的组件 -->
    <upload @callback='mulAllTypeUploadResponse' ref="mulAllTypeUploadCom" :loading.sync='loading' v-if="mulAllTypeUploadShow" :onBeforeUpload="beforeUpload"
      :limit=3>
      <i ref='mulAllTypeUpload'></i>
    </upload>
    <attachment-view ref='attachmentView' :certification='certification' v-if='netAttachmentShow'
      @typeChange="viewTypeChange" :attachmentShow.sync='netAttachmentShow' @attachUploadResponse="attachUploadResponse"
      :rowData='rowData' :onBeforeUpload="beforeUpload"></attachment-view>
  </paper>
</template>

<script>
import mPane from '@/components/otpPanel';
import paper from '@/components/core/paper/Paper';
import BranchSign from '../branchSign/BranchSign';
import AppointNote from './AppointNote';
import NetDispatch from './NetDispatch';
import Upload from '../../../../components/upload/Upload';
import AttachmentView from './AttachmentView';
import config from './config.js';
import { getLists, netUpload, netTaskExport, orderPrint } from '../../../../api/netTaskManage.js';
import { mapState } from 'vuex';
import configs from '@/config/user.env';
import { getCertBySDK } from '@/components/lots/OSS/api.js';
import formatTime from '@/utils/common.js';
export default {
    name: 'netTaskManage',
    components: { paper, mPane, BranchSign, AppointNote, NetDispatch, Upload, AttachmentView },
    data () {
        return {
            config,
            pageTotal: 0,
            loading: false,
            selected: [],
            totalData: [],
            searchParams: {
                pageSize: 10,
                pageNo: 1
            },
            type: '1',
            mulUploadType: '',
            branchSignShow: false,
            titleName: '',
            appointNoteDataObj: {},
            appointNoteDialogVisible: false,
            netDispatchDialogVisible: false,
            rowData: {},
            netAttachmentShow: false,
            certification: '', // 鉴权信息
            mulAllTypeUploadShow: false
        };
    },
    methods: {
    // 获取鉴权信息
        getCertification () {
            clearTimeout(this.timeNum);
            getCertBySDK({ appid: configs.uploadAppId }, (c) => { this.cancelRequest = c; }).then(res => {
                if (res) {
                    this.certification = res.data.certification;
                    this.timeNum = setTimeout(() => {
                        this.getCertification();
                    }, 1000 * 60 * 25);
                }
            }).catch(() => {
            });
        },
        load () {
            this.getList();
        },
        searchChange (data) {
            if (data.createTime && data.createTime.length > 0) {
                data.beginDate = formatTime.formatDateTime(data.createTime[0]);
                data.endDate = formatTime.formatDateTime(data.createTime[1]);
            } else if (!data.createTime) {
                data.beginDate = '';
                data.endDate = '';
            }
            if (data.appointmentStartTime && data.appointmentStartTime.length > 0) {
                data.appointmentStartBegin = data.appointmentStartTime[0];
                data.appointmentStartEnd = data.appointmentStartTime[1];
            } else if (!data.appointmentStartTime) {
                data.appointmentStartBegin = '';
                data.appointmentStartEnd = '';
            }
            if (data.appointmentEndTime && data.appointmentEndTime.length > 0) {
                data.appointmentEndBegin = data.appointmentEndTime[0];
                data.appointmentEndEnd = data.appointmentEndTime[1];
            } else if (!data.appointmentEndTime) {
                data.appointmentEndBegin = '';
                data.appointmentEndEnd = '';
            }
            if (data.requiredPickTime && data.requiredPickTime.length > 0) {
                data.requiredPickTimeBegin = data.requiredPickTime[0];
                data.requiredPickTimeEnd = data.requiredPickTime[1];
            } else if (!data.appointmentEndTime) {
                data.requiredPickTimeBegin = '';
                data.requiredPickTimeEnd = '';
            }
            delete data.createTime;
            delete data.appointmentStartTime;
            delete data.appointmentEndTime;
            delete data.requiredPickTime;
            this.searchParams = {
                ...this.searchParams,
                ...data,
                pageNo: 1
            };
            if (!this.searchParams.orderNo && !this.searchParams.beginDate) return this.$message.warning('订单号 或 时间必须选一个进行查询！');
            this.getList();
        },
        getList () {
            this.loading = true;
            getLists(this.searchParams).then(res => {
                this.loading = false;
                if (res && +res.code === 0) {
                    this.totalData = res.data.list || [];
                    this.totalData.map(item => {
                        item.networkReceiptStatusName = item.networkReceiptStatus === 'Y' ? '是' : '否';
                        item.finalReceiptStatusName = item.finalReceiptStatus === 'Y' ? '是' : '否';
                        item.finalSignFullName = item.finalSignFull === 'Y' ? '是' : '否';
                        item.showPhotos = true;
                        item.hiddenEvent = [];
                        const orderTypeActions = {
                            PO: {
                                0: ['terminalSign', 'netInbound', 'netOutbound', 'print'],
                                10: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound', 'print'],
                                20: ['branchSign', 'netInbound', 'netOutbound', 'print'],
                                30: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound', 'print'],
                                50: ['branchSign', 'terminalSign', 'netOutbound', 'print'],
                                60: ['branchSign', 'terminalSign', 'netInbound', 'print'],
                                40: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound', 'print'],
                                70: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound', 'print']
                            },
                            RI: {
                                0: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound'],
                                50: ['branchSign', 'terminalSign', 'netOutbound'],
                                60: ['branchSign', 'terminalSign', 'netInbound'],
                                40: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound'],
                                10: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound'],
                                20: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound'],
                                30: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound'],
                                70: ['branchSign', 'terminalSign', 'netInbound', 'netOutbound']
                            }
                        };
                        item.hiddenEvent = orderTypeActions[item.orderType][item.orderStatus];
                    });
                    this.pageTotal = res.data.totalCount;
                }
            }).catch(() => {
                this.loading = false;
            });
        },
        pageChange (data) {
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange (data) {
            this.searchParams.pageSize = data;
            this.getList();
        },
        selectChange (data) {
            this.selected = data;
        },
        exportFile () {
            const params = { ...this.searchParams };
            Reflect.deleteProperty(params, 'pageNo');
            Reflect.deleteProperty(params, 'pageSize');
            netTaskExport(params).then(res => {
                if (res) this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
            });
        },
        handleAppointNote () {
            if (this.selected.length === 0) return this.$message.warning('请至少选择一条数据');
            let count = 0;
            this.selected.forEach(item => {
                if (item.orderType === 'PO') {
                    if (!(+item.orderStatus === 10 || +item.orderStatus === 20))++count;
                } else if (item.orderType === 'RI') {
                    if (!(+item.orderStatus === 0 || +item.orderStatus === 50))++count;
                }
            });
            if (count > 0) return this.$message.warning('存在不允许网点预约操作的订单！');
            this.appointNoteDialogVisible = true;
        },
        handleNetDispatch () {
            if (this.selected.length === 0) return this.$message.warning('请至少选择一条数据');
            let count = 0;
            const oneNetworkCode = this.selected[0].networkCode;
            let networkCodeCount = 0;
            this.selected.forEach(item => {
                if ((!(+item.orderStatus === 10 && item.orderType === 'PO')) && (!(+item.orderStatus === 0 && item.orderType === 'RI')) &&
                !(+item.orderStatus === 20) && (!(+item.orderStatus === 50 && item.orderType === 'RI'))) ++count;
                if (item.networkCode !== oneNetworkCode) ++networkCodeCount;
            });
            if (count > 0) return this.$message.warning('存在不能网点派工的单！');
            if (networkCodeCount > 0) return this.$message.warning('存在不同网点的订单');
            this.netDispatchDialogVisible = true;
        },
        checkBtn () {
            this.viewVisiableDialog = true;
        },
        branchSignBtn (data) {
            this.titleName = '网点签收';
            this.branchSignShow = true;
            this.rowData = data;
            this.type = '1';
        },
        terminalSignBtn (data) {
            this.titleName = '终端签收';
            this.branchSignShow = true;
            this.rowData = data;
            this.type = '2';
        },
        netInboundBtn (data) {
            this.titleName = '网点入库';
            this.branchSignShow = true;
            this.rowData = data;
            this.type = '3';
        },
        netOutboundBtn (data) {
            this.titleName = '网点出库';
            this.branchSignShow = true;
            this.rowData = data;
            this.type = '4';
        },
        printBtn (data) {
            const api = `${configs.apiUrl}/api-otp/netTask/printf?customerOrderNo=${data.customerOrderNo}`;
            const params = { customerOrderNo: data.customerOrderNo };
            orderPrint(params).then(res => {
                if (res) {
                    window.open(api);
                }
            });
        },
        appointNoteHandleClose () {
            this.appointNoteDialogVisible = false;
        },
        appointNoteSaveOk () {
            this.appointNoteDialogVisible = false;
            this.getList();
        },
        netDispatchHandleClose () {
            this.netDispatchDialogVisible = false;
        },
        netDispatchSaveOk () {
            this.netDispatchDialogVisible = false;
            this.getList();
        },
        signSaveOk () {
            this.branchSignShow = false;
            this.getList();
        },
        photosBtn (data) {
            if (!(+data.orderStatus === 70)) {
                this.rowData = data;
                this.netAttachmentShow = true;
            } else {
                this.$message.warning('取消订单不允许附件上传！');
            }
        },
        beforeUpload (file) {
            var extArr = ['jpg', 'jpeg', 'png', 'tif', 'bmp'];
            if (!extArr.includes(this.getFileExt(file.name))) {
                this.$message({
                    type: 'warning',
                    message: '文件格式只能为 JPG / JPEG / PNG / TIF / BMP',
                    duration: 5000,
                    showClose: true
                });
                return false;
            }
            return file;
        },
        attachUploadResponse (response) { // 附件查看的上传成功
            const params = {
                orders: [this.rowData.orderNo],
                type: this.type
            };
            params.images = response.map(item => item.data.downUrl);
            netUpload(params).then(res => {
                this.$refs.attachmentView.$refs.attachmentUpload.$refs.noShowListUpload.clearFiles();
                this.loading = false;
                if (res && +res.code === 0) {
                    this.$message.success('上传成功');
                    this.$refs.attachmentView.updateImgList();
                }
            }).catch(() => {
                this.loading = false;
                this.$refs.attachmentView.$refs.attachmentUpload.$refs.noShowListUpload.clearFiles();
            });
        },
        branchSignUploadResponse (response) { // 弹框的上传
            const params = {
                orders: [this.rowData.orderNo],
                type: this.type
            };
            params.images = response.map(item => item.data.downUrl);
            netUpload(params).then(res => {
                this.loading = false;
                this.$refs.branchSign.$refs.signUpload.$refs.noShowListUpload.clearFiles();
                if (res && +res.code === 0) {
                    this.$message.success('上传成功');
                    this.$refs.branchSign.updateImgList();
                }
            }).catch(() => {
                this.loading = false;
                this.$refs.branchSign.$refs.signUpload.$refs.noShowListUpload.clearFiles();
            });
        },
        mulAllTypeUploadResponse(response) {
            const orders = this.selected.map(item => item.orderNo);
            const params = {
                orders: orders,
                type: this.mulUploadType
            };
            params.images = response.map(item => item.data.downUrl);
            netUpload(params).then(res => {
                this.$refs.mulAllTypeUploadCom.$refs.noShowListUpload.clearFiles();
                this.loading = false;
                if (res && +res.code === 0) {
                    this.getList();
                    this.$message.success('批量上传成功');
                }
            }).catch(() => {
                this.$refs.mulAllTypeUploadCom.$refs.noShowListUpload.clearFiles();
                this.loading = false;
            });
        },
        getFileExt (fileName) {
            return fileName && fileName.replace(/^.*\./, '').toLowerCase();
        },
        viewTypeChange (type) {
            this.type = type;
        },
        rowDBclick (row) {
            this.$router.push({
                query: { orderNo: row.orderNo, orderType: row.orderType },
                path: '/net-task-details'
            });
        },
        mulAllTypeUpload() {
            if (this.selected.length < 1) return this.$message.warning('至少选择一条单操作');
            const oneOrderStatus = this.selected[0].orderStatus;
            let count = 0;
            let orderCount = 0;
            this.selected.forEach(item => {
                if (+oneOrderStatus !== +item.orderStatus) ++count;
                if (+item.orderStatus === 0 && item.orderType === 'RI') ++orderCount;
            });
            if (count > 0) return this.$message.warning('同种状态的单才能进行上传');
            if (orderCount > 0) return this.$message.warning('退货入库订单，网点接单状态不允许上传附件');
            if (+oneOrderStatus === 10 || +oneOrderStatus === 30 || +oneOrderStatus === 40 || +oneOrderStatus === 70) return this.$message.warning('该状态的单不能进行附件上传');
            const oneOrderStatusActions = {
                0: '1',
                20: '2',
                50: '3',
                60: '4'
            };
            this.mulUploadType = oneOrderStatusActions[oneOrderStatus];
            this.mulAllTypeUploadShow = true;
            this.$nextTick(() => {
                this.$refs.mulAllTypeUpload.click();
            });
        }
    },
    computed: {
        ...mapState({ user: state => state.user })
    },
    created () {
        this.getCertification();
    }
};
</script>
<style lang="less">
.net-task {
  .page-module-btn {
    margin-left: 10px;
  }
  .viewer-backdrop,
  .viewer-navbar {
    background-color: #fff;
  }
  .viewer-backdrop.viewer-fixed {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .viewer-backdrop {
    background-color: #fff;
  }
  .viewer-backdrop.viewer-fixed {
    background-color: rgba(0, 0, 0, 0.5);
    .viewer-navbar {
      height: auto;
    }
  }
  .viewer-navbar {
    height: 0;
  }
  .viewer-button {
    width: 60px;
    height: 60px;
    top: -30px;
    right: -30px;
  }
  .viewer-button::before {
    bottom: 10px;
    left: 10px;
  }
  .viewer-button.viewer-fullscreen-exit {
    width: 80px;
    height: 80px;
    top: -40px;
    right: -40px;
  }
  .viewer-button.viewer-fullscreen-exit::before {
    bottom: 15px;
    left: 15px;
  }
  .viewer-toolbar > ul > .viewer-small {
    margin: 3px;
  }
}
</style>