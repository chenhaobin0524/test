<template>
    <paper class="source-exception-manage">
        <m-pane
            ref="tablePage"
            :config="config"
            :pageTotal="pageTotal"
            :loading="loading"
            :totalData="totalData"
            :searchTotalTitle="config.searchTotalTitle"
            searchId="sourceExceptionManageQuery"
            pageID="sourceExceptionManage"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
            @photos-btn="photosBtn"
            @upload-btn="uploadBtn"
            @row-db-click="rowDBclick">
            <div slot="table-module-btn">
                <el-tooltip effect="dark" content="新增" placement="bottom">
                    <span class="mgl-10">
                    <el-button icon="el-icon-plus" size="mini" @click="handleAdd"></el-button>
                    </span>
                </el-tooltip>
            </div>
            <div slot="page-module-btn">
                <span v-has="'04090001'"><el-button type="primary" @click="handleSubmit">提 交</el-button></span>
                <span v-has="'04090002'" class="page-module-btn"><el-button type="primary" @click="handleReview">审 核</el-button></span>
            </div>
        </m-pane>
        <add
            v-if="addVisiableDialog"
            :visiableDialog.sync="addVisiableDialog"
            :titleName="titleName"
            :data="rowData"
            :type="type"
            @handleClose="addHandleClose"
            @saveOk="addSaveOk">
        </add>
        <review
            v-if="reviewVisiableDialog"
            :visiableDialog.sync="reviewVisiableDialog"
            :certification='certification'
            @handleClose="reviewHandleClose"
            @saveOk="reviewSaveOk"
            :checkLists="checkLists">
        </review>
        <upload @callback='uploadResponse' :loading.sync='loading'
            :onBeforeUpload="beforeUpload" :limit=9>
            <i ref='upload'></i>
        </upload>
        <attachment-view ref='attachmentView' @AttachUploadResponse="AttachUploadResponse"
        :certification='certification' v-if='attachmentShow' :attachmentShow.sync='attachmentShow' :rowData='rowData'
        :onBeforeUpload="beforeUpload" :limit=9></attachment-view>
    </paper>
</template>

<script>
import mPane from '@/components/otpPanel';
import paper from '@/components/core/paper/Paper';
import Add from './Add';
import Review from './Review';
import Upload from '../../../components/upload/Upload';
import AttachmentView from './AttachmentView';
import config from './config.js';
import { getLists, submit, upload } from '../../../api/sourceExceptionManage';
import formatTime from '@/utils/common.js';
import configs from '@/config/user.env';
import { getCertBySDK } from '@/components/lots/OSS/api.js';
import { mapState } from 'vuex';
export default {
    components: { paper, mPane, Add, Review, Upload, AttachmentView },
    data() {
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
            attachmentShow: false,
            addVisiableDialog: false,
            reviewVisiableDialog: false,
            checkLists: [],
            timeNum: 0,
            rowData: {},
            titleName: '',
            type: ''
        };
    },
    methods: {
        async getList() {
            await getLists(this.searchParams).then(res => {
                if (res) {
                    this.totalData = res.data.list || [];
                    this.totalData.map((item, key) => {
                        item.tmsExceptionTypeName1 = window.sessionStorage.tms_exception_type1
                            ? (JSON.parse(window.sessionStorage.tms_exception_type1))[item.tmsExceptionType1] : item.tmsExceptionType1;
                        item.tmsExceptionTypeName2 = window.sessionStorage.tms_exception_type2
                            ? (JSON.parse(window.sessionStorage.tms_exception_type2))[item.tmsExceptionType2] : item.tmsExceptionType2;
                        item.processingStatusName = window.sessionStorage.processing_status ? (JSON.parse(window.sessionStorage.processing_status))[item.processingStatus] : item.processingStatus;
                        item.indicationOfSourceName = window.sessionStorage.indication_of_source
                            ? (JSON.parse(window.sessionStorage.indication_of_source))[item.indicationOfSource] : item.indicationOfSource;
                        item.claimTypeName = window.sessionStorage.claim_type ? (JSON.parse(window.sessionStorage.claim_type))[item.claimType] : item.claimType;
                        item.costTypeName = window.sessionStorage.cost_type ? (JSON.parse(window.sessionStorage.cost_type))[item.costType] : item.costType;
                        item.statusName = window.sessionStorage.claim_status ? (JSON.parse(window.sessionStorage.claim_status))[item.status] : item.status;
                        item.showPhotos = item.files && item.files.length > 0;
                        // tms + 除待提交外 只能查看，控制没有上传按钮显示
                        if (+item.indicationOfSource === 10 && +item.processingStatus !== 10 && item.files.length === 0) item.noShowPhotos = true;
                        // 来源是cvte + 除待提交外 +索赔订单 ，来源是tms
                        if (!((+item.indicationOfSource === 20 && +item.processingStatus !== 10 && +item.distributionOrCliam === 20) ||
                        +item.indicationOfSource === 10)) {
                            item.noShowPhotos = true;
                            item.showPhotos = false;
                        }
                    });
                    this.pageTotal = res.data.totalCount;
                }
            });
        },
        searchChange(data) {
            if (data.createTime && data.createTime.length > 0) {
                data.startReportingTime = formatTime.formatDateTime(data.createTime[0]);
                data.endReportingTime = formatTime.formatDateTime(data.createTime[1]);
            } else if (!data.createTime) {
                data.startReportingTime = '';
                data.endReportingTime = '';
            }
            delete data.createTime;
            this.searchParams = {
                ...this.searchParams,
                ...data,
                pageNo: 1
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
        selectChange(data) {
            this.selected = data;
        },
        handleSubmit() {
            if (this.selected.length === 0) return this.$message.warning('请至少选择一条数据');
            let num = 0;
            const id = [];
            this.selected.forEach(item => {
                id.push(item.id);
                if (+item.processingStatus !== 10) ++num;
            });
            if (num > 0) return this.$message.warning('只有在待提交状态下，才可以提交');
            this.loading = true;
            submit(id).then(res => {
                this.loading = false;
                if (res && res.code === '0') {
                    this.$message.success('提交成功');
                    this.getList();
                }
            }).catch(() => {
                this.loading = false;
            });
        },
        handleReview() {
            let fromSysStatusNum = 0;
            let distributionOrCliamNum = 0;
            let claimTypeNum = 0;
            if (this.selected.length === 0) {
                return this.$message.warning('请至少选择一条数据');
            } else if (this.selected.length > 20) {
                return this.$message.warning('【配送】类型最多支持批量审核20条，【索赔】只支持单条审核');
            } else {
                this.selected.forEach(item => {
                    if (!(+item.indicationOfSource === 20 && +item.processingStatus === 20)) ++fromSysStatusNum;
                    if (+item.distributionOrCliamNum === 10) ++distributionOrCliamNum;
                    if (+item.distributionOrCliamNum === 20) ++claimTypeNum;
                });
                if (fromSysStatusNum > 0) return this.$message.warning('异常来源为CVTE且状态为处理中的异常单，才允许被审核');
                if (distributionOrCliamNum > 0 && distributionOrCliamNum < this.selected.length) return this.$message.warning('请分别审核两种异常！');
                if (claimTypeNum > 0 && claimTypeNum !== 1) return this.$message.warning('索赔只能单条审核');
                this.checkLists = this.selected;
                this.reviewVisiableDialog = true;
            }
        },
        handleAdd() {
            this.addVisiableDialog = true;
            this.titleName = '新增';
            this.rowData = {};
            this.type = 'add';
        },
        addHandleClose() {
            this.addVisiableDialog = false;
        },
        addSaveOk() {
            this.addVisiableDialog = false;
            this.getList();
        },
        reviewHandleClose() {
            this.reviewVisiableDialog = false;
        },
        reviewSaveOk() {
            this.reviewVisiableDialog = false;
            this.getList();
        },
        uploadBtn(data) {
            this.rowData = data;
            this.$refs.upload.click();
        },
        // 获取鉴权信息
        getCertification() {
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
        photosBtn(data) {
            this.rowData = data;
            this.attachmentShow = true;
        },
        uploadResponse(response) {
            const params = {
                uploadUserName: this.user.userName,
                uploadUserCode: this.user.userCode,
                abnormalSingleNumber: this.rowData.abnormalSingleNumber
            };
            params.url = response.map(item => item.data.downUrl);
            upload(params).then(res => {
                this.loading = false;
                if (res) {
                    this.getList();
                    this.$message.success('上传成功');
                }
            }).catch(() => {
                this.loading = false;
                this.$message.error('上传失败');
            });
        },
        async AttachUploadResponse(response) {
            const params = {
                uploadUserName: this.user.userName,
                uploadUserCode: this.user.userCode,
                abnormalSingleNumber: this.rowData.abnormalSingleNumber
            };
            params.url = response.map(item => item.data.downUrl);
            const res = await upload(params);
            this.loading = false;
            if (res) {
                this.$message.success('上传成功');
                await this.getList();
                this.rowData = this.totalData.filter(item => item.id === this.rowData.id)[0];
                this.$refs.attachmentView.updateImgList(this.rowData.files);
            } else {
                this.$message.error('上传失败');
            }
            this.$refs.attachmentView.$refs.attachmentUpload.$refs.noShowListUpload.clearFiles();
        },
        rowDBclick(row) {
            if (+row.processingStatus !== 10) return false;
            this.addVisiableDialog = true;
            this.titleName = '修改';
            this.rowData = row;
            this.type = 'edit';
        },
        beforeUpload(file) {
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
        getFileExt(fileName) {
            return fileName && fileName.replace(/^.*\./, '').toLowerCase();
        }
    },
    mounted() {
        // this.$refs.tablePage.$refs.searchList.onSearchChange();
    },
    created () {
        // 获取鉴权信息
        this.getCertification();
    },
    computed: {
        ...mapState({ user: state => state.user })
    }
};
</script>
<style lang="less">
    .source-exception-manage {
        .page-module-btn {
            margin-left: 10px;
        }
    }
</style>
