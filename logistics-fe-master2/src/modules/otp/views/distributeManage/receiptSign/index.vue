<template>
    <paper class="receiptTile">
        <m-pane :config="config" :initSearchInfo="initSearchInfo" :totalData="totalData" :pageTotal="pageTotal" :searchTotalTitle="searchTotalTitle" :loading="loading" :currentPage='currentPage'
            searchId="receipt_sign_search" pageID="receipt_sign" @row-db-click="rowDBclick" @detail-btn="detailBtn" @photos-btn="photosBtn"
            @upload-btn="uploadBtn" @check-btn="checkBtn" @edit-btn="editBtn" @selectChange="selectChange" @searchChange="searchChange" @pageChange="pageChange"
            @sizeChange="sizeChange">

            <div slot="table-module-btn" v-has="'04050001'">
                <el-tooltip effect="dark" content="批量上传" placement="top">
                    <el-dropdown>
                        <el-button icon="el-icon-upload2" size="mini"></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <div @click="checkClick('选择', '')">选择</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="checkClick('合同号', 'contractNo')">合同号</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="checkClick('客户订单号', 'custOrderNo')">客户订单号</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="checkClick('发车单号', 'dispatchNo')">发车单号</div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div @click="checkClick('集配单号', 'collectNo')">集配单号</div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-tooltip>
            </div>

            <div slot="page-module-btn">
                <el-button type="primary" @click="confirmation" v-has="'04050002'">批量签收</el-button>
                <el-button type="primary" @click="overdue" v-has='"04050003"'>逾 期</el-button>
            </div>
        </m-pane>

         <!-- 签收/拒收/详情 弹框 -->
        <sign-in-dialog :certification='certification' v-if='signInShow' :signInShow.sync='signInShow' :titleName='titleName' :rowData='rowData'
            :searchObj='searchObj' @refreshList='getDataList'>
        </sign-in-dialog>

        <!-- 逾期弹框 -->
        <overdue-dialog :searchObj='searchObj' :selectData='selectData' :overdueShaowDialog.sync='overdueShaowDialog' v-if='overdueShaowDialog' :overdueCauseTypeOptions='overdueCauseTypeOptions'
            :overdueTypeOptions='overdueTypeOptions' @refreshList='getDataList'>
        </overdue-dialog>

        <!-- 列配置按钮左边那个批量上传弹框 -->
        <batch-upload-dialog v-if='batchUploadShow' :batchFlag='batchFlag' :batchUploadShow.sync='batchUploadShow' :batchUploadTitle='batchUploadTitle'
            :selectData='selectData' :searchObj='searchObj' @refreshList='getDataList'>
        </batch-upload-dialog>

        <!-- 附件 弹框 -->
        <attachment-dialog :certification='certification' v-if='attachmentShow' :attachmentShow.sync='attachmentShow' :rowData='rowData'>
        </attachment-dialog>

        <!-- 列表 逾期明细弹框 -->
        <list-overdue-dialog v-if='listOverdueShow'
            :listOverdueShow.sync='listOverdueShow' :overdueTypeOptions='overdueTypeOptions' :rowData='rowData' :overdueCauseTypeOptions='overdueCauseTypeOptions'>
        </list-overdue-dialog>

        <!-- 上传按钮使用的组件 -->
        <upload class="avatar-uploader" @callback='uploadResponse' :loading.sync='loading'>
            <i ref='upload'></i>
        </upload>
        <!-- 最后一公里项目 新建详情页 -->
        <Details :certification='certification' v-if='detailsShow' :detailsShow.sync='detailsShow' :titleName='titleName' :rowData='rowData'
            :searchObj='searchObj' @detailsClose="detailsClose" @refreshList='getDataList'></Details>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import signInDialog from './signInDialog';
import overdueDialog from './overdueDialog';
import attachmentDialog from './attachmentDialog';
import batchUploadDialog from './batchUploadDialog';
import Details from './details/Details';
import configs from '@/config/user.env';
import { getCertBySDK } from '@/components/lots/OSS/api.js';
import { receiptList, receiptSign, receiptUpload, userdataAuth } from '../../../api/receiptSign';
import { getDictionaryDetailByCode } from '../../../api/common';
import { mapState } from 'vuex';
import upload from './upload.vue';
import listOverdueDialog from './listOverdueDialog.vue';
import common from '@/utils/common.js';
import 'viewerjs/dist/viewer.css';
import moment from 'moment';

export default {
    name: 'receiptSign',
    components: { mPane, paper, signInDialog, overdueDialog, batchUploadDialog, attachmentDialog, upload, listOverdueDialog, Details },
    data() {
        return {
            initSearchInfo: {},
            cancelRequest: () => {}, // 调用 取消未响应的鉴权请求
            certification: '', // 鉴权信息
            projectClassify: {}, // 项目分类
            siteCodeList: [], // 用户可展示平台数据控制
            listOverdueShow: false,
            batchFlag: '', // 批量上传标识符
            currentPage: 1,
            rowData: {}, // 签收 拒收 查看详情弹框数据
            batchUploadTitle: '',
            overdueCauseTypeOptions: {}, // 逾期原因
            overdueTypeOptions: [], // 逾期类型
            selectData: [], // 已选中数据
            overdueShaowDialog: false, // 拒收弹框 显隐
            attachmentShow: false, // 附件弹框 显隐
            searchObj: {
                pageNo: 1,
                pageSize: 10 }, // 首页数据查询的数据对象
            titleName: '',
            signInShow: false,
            isRejects: false,
            isReceive: true,
            isRejection: false,
            isCondition: false,
            textarea: '',
            imageUrl: '',
            batchUploadShow: false,
            times: '',
            inputName: '',
            imgArr: [],
            // 高级搜索配置项
            searchTotalTitle: config.searchTotalTitle,
            pageTotal: 0, // 数据总条数
            totalData: [], // 首页表格数据
            loading: false, // 加载中 动画
            config,
            timeNum: 0,
            detailsShow: false
        };
    },
    methods: {
        // 获取鉴权信息
        getCertification() {
            clearTimeout(this.timeNum);
            getCertBySDK({ appid: configs.uploadAppId }, (c) => { this.cancelRequest = c; }).then(res => {
                if (res) {
                    this.certification = res.data.certification;
                }
            }).finally(() => {
                this.timeNum = setTimeout(() => {
                    this.getCertification();
                }, 1000 * 60 * 25);
            });
        },
        uploadResponse(response) {
            const params = {
                createUserName: this.user.userName,
                createUserCode: this.user.userCode,
                signFileUpload: 'N',
                taskNoList: [this.rowData.taskNo],
                receiptSource: '10'
            };
            params.fileUrls = response.map(item => item.data.downUrl);
            receiptUpload(params).then(res => {
                this.loading = false;
                if (res) {
                    if (res.data.length > 0) {
                        let message = '';
                        res.data.forEach(item => {
                            message += `<div style='line-height: 30px;'>
                                        <span style='color: #909399;'>图片</span>
                                        <span style='color: #F56C6C;'>${item.pictureName}</span>
                                        <span style='color: #409EFF;'>${item.message}</span>
                                    <div>`;
                        });
                        const duration = 5000 + res.data.length * 1500;
                        this.$message({
                            type: 'warning',
                            duration,
                            dangerouslyUseHTMLString: true,
                            message,
                            showClose: true
                        });
                    } else {
                        this.getDataList(this.searchObj);
                        this.$message.success('上传成功');
                    }
                }
            }).catch(() => {
                this.loading = false;
                this.$message.error('上传失败');
            });
        },
        detailBtn(data) {
            this.rowData = data;
            this.listOverdueShow = true;
        },
        photosBtn(data) {
            this.rowData = data;
            this.attachmentShow = true;
        },
        uploadBtn(data) {
            this.rowData = data;
            this.$refs.upload.click();
        },
        // 拒收
        editBtn(data) {
            data.clickBtn = 'reject';
            this.rowData = data;
            this.titleName = '回单拒收';
            // this.signInShow = true;
            this.detailsShow = true;
        },
        // 签收
        checkBtn(data) {
            data.clickBtn = 'sign';
            this.rowData = data;
            this.titleName = '回单签收';
            // this.signInShow = true;
            this.detailsShow = true;
        },
        // 双击查看详情
        rowDBclick(data) {
            data.clickBtn = 'detail';
            this.rowData = data;
            this.titleName = '回单详情';
            // this.signInShow = true;
            this.detailsShow = true;
        },
        // 页码改变
        pageChange(data) {
            this.searchObj.pageNo = data;
            this.getDataList(this.searchObj);
        },
        // 页容量改变
        sizeChange(data) {
            this.searchObj.pageSize = data;
            this.searchObj.pageNo = 1;
            this.getDataList(this.searchObj);
        },
        // 查询
        searchChange(data) {
            this.searchObj = { ...this.searchObj, ...data };
            this.searchObj.signStatus = data.signStatus.join();
            this.searchObj.custOrderNo = data.customerOrderNo;
            this.searchObj.beginDate2 = data.searchTime && common.formatDateTime(data.searchTime[0]);
            this.searchObj.endDate2 = data.searchTime && common.formatDateTime(data.searchTime[1]);
            this.searchObj.beginDate3 = data.signTime && common.formatDateTime(data.signTime[0]);
            this.searchObj.endDate3 = data.signTime && common.formatDateTime(data.signTime[1]);
            this.searchObj.pageNo = 1;
            this.getDataList(this.searchObj);
        },
        selectChange(data) {
            this.selectData = data;
        },
        getProjectClassify() {
            return getDictionaryDetailByCode({ dictCodes: 'PROJECT_CLASSIFY' }).then(res => {
                if (res) {
                    this.projectClassify = res.data.PROJECT_CLASSIFY;
                }
            }).catch(() => {
            });
        },
        // 获取逾期原因
        getOverdueOptions() {
            let optionNums = '';
            optionNums += 'OVER_DUE_TYPE, '; // 逾期类型
            optionNums += 'OTP_CHANGE_DELIVERY_1, '; // 到货逾期一级原因
            optionNums += 'OTP_CHANGE_DELIVERY_2, '; // 到货逾期二级原因
            optionNums += 'OTP_CHANGE_RECEIPT_1, '; // 回单逾期一级原因
            optionNums += 'OTP_CHANGE_RECEIPT_2'; // 回单逾期二级原因
            return getDictionaryDetailByCode({ dictCodes: optionNums }).then(res => {
                if (res) {
                    const getOptions = (params) => {
                        return Object.entries(res.data[params]).map(item => ({ value: item[0], label: item[1] }));
                    };
                    this.overdueTypeOptions = getOptions('OVER_DUE_TYPE'); // 逾期类型
                    const OTP_CHANGE_DELIVERY_2 = getOptions('OTP_CHANGE_DELIVERY_2'); // 到货逾期二级原因
                    const OTP_CHANGE_RECEIPT_2 = getOptions('OTP_CHANGE_RECEIPT_2'); // 回单逾期二级原因
                    const overdueCauseTypeOptions = {};
                    overdueCauseTypeOptions['0'] = getOptions('OTP_CHANGE_DELIVERY_1');
                    overdueCauseTypeOptions['1'] = getOptions('OTP_CHANGE_RECEIPT_1');
                    const getOptionsLevel2 = (key, level2) => {
                        overdueCauseTypeOptions[key].forEach(item => {
                            item.children = level2.filter(item2 => {
                                if (item2.value.indexOf(item.value) === 0) {
                                    return true;
                                }
                            });
                        });
                    };
                    getOptionsLevel2('0', OTP_CHANGE_DELIVERY_2);
                    getOptionsLevel2('1', OTP_CHANGE_RECEIPT_2);
                    this.overdueCauseTypeOptions = overdueCauseTypeOptions;
                }
            }).catch(() => {
            });
        },
        // eslint-disable-next-line
        getDataList({ isNetCheck, custOrderNo, taskNo, signStatus, beginDate2, endDate2, beginDate3, endDate3, supplierCode, customerCode, siteCode, receiptSource, dispatchNo, receiptStatus, projectClassify, businessMode, contractNo, signIsFull, carrierCode, pageNo, pageSize, procurementChannel, orderNo, carrierVisibleFlag, upperReceiverName } = { pageNo: 1, pageSize: 10 }) {
            // eslint-disable-next-line
            const params = { isNetCheck, custOrderNo, taskNo, signStatus, beginDate2, endDate2, beginDate3, endDate3, supplierCode, customerCode, siteCode, receiptSource, dispatchNo, receiptStatus, projectClassify, businessMode, contractNo, signIsFull, carrierCode, pageNo, pageSize, procurementChannel, orderNo, carrierVisibleFlag, upperReceiverName };
            this.searchObj = params;
            this.currentPage = pageNo;
            this.loading = true;
            params.siteCodeList = this.siteCodeList.join(); // 用户可展示平台数据控制
            const procurementChannelObj = sessionStorage.OTP_TMS_PROCUREMENT_CHANNEL ? JSON.parse(sessionStorage.OTP_TMS_PROCUREMENT_CHANNEL) : {};
            return receiptList(params).then(res => {
                if (res) {
                    const receiptSource = {
                        '0': 'APP端',
                        '10': 'PC端',
                        '20': '微信'
                    };
                    res.data.list.forEach(item => {
                        item.carrierVisibleFlagName = item.carrierVisibleFlag === 'Y' ? '是' : '否';
                        item.signStatusText = window.sessionStorage.SIGN_STATUS ? (JSON.parse(window.sessionStorage.SIGN_STATUS))[item.signStatus] : item.signStatus;
                        item.procurementChannelText = procurementChannelObj[item.procurementChannel];
                        item.receiptSourceText = receiptSource[item.receiptSource];
                        item.projectClassifyText = this.projectClassify[item.projectClassify];
                        // B2B没有拒收 网批属于B2B             分拨第一阶段 且为 B2C 的单 没有拒收
                        if (item.businessMode === 'B2B' || (item.businessMode === 'B2C' && item.distributionFlag === 'Y' && item.distributionNum === 1)) {
                            item.hiddenEvent = ['edit'];
                        }
                        if (item.signStatus === '70') {
                            item.hiddenEvent = ['edit'];
                        } else if (item.signStatus === '100') {
                            item.hiddenEvent = ['view', 'edit'];
                        } else if (item.signStatus === '200') {
                            item.hiddenEvent = ['view', 'edit'];
                        }

                        item.showPhotos = item.files.length > 0;

                        if (item.signIsFull !== null) {
                            item.signIsFullText = item.signIsFull === 'Y' ? '是' : '否';
                        }
                        if (item.signStatus === '60') { // 待签收状态下，是否完好显示空值
                            item.signIsFullText = '';
                        }
                        item.receiptStatusText = item.receiptStatus === '0' ? '未上传' : '已上传';
                    });
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        confirmation() {
            if (this.loading) return false; // 如果表格loading中，不允许签收
            if (!this.selectData.length) {
                this.$message({
                    message: '请选择运输单',
                    type: 'warning'
                });
                return false;
            }
            const params = [];
            this.selectData.forEach(item => {
                params.push({
                    signContact: this.user.userName,
                    batchSignFlag: '0',
                    signType: 'PC',
                    receiptResponse: {
                        taskNo: item.taskNo,
                        custOrderNo: item.custOrderNo,
                        version: item.version
                    },
                    receiptDetailResponse: {}
                });
            });
            this.loading = true;
            receiptSign(params).then(res => {
                if (!res) {
                    this.loading = false;
                    return false;
                }
                this.getDataList(this.searchObj);
                if (!res.data.length) {
                    this.$message({
                        message: '签收成功',
                        type: 'success'
                    });
                    return false;
                }
                let message = '';
                res.data.forEach(item => {
                    message += `<div style='line-height: 30px;'>
                                        <span style='color: #909399;'>运输单号</span>
                                        <span style='color: #F56C6C;'>${item.taskNo}</span>
                                        <span style='color: #409EFF;'>${item.message}</span>
                                    <div>`;
                });
                const duration = 5000 + res.data.length * 1500;
                this.$message({
                    type: 'warning',
                    duration,
                    dangerouslyUseHTMLString: true,
                    message,
                    showClose: true
                });
            }).catch(() => {
                this.loading = false;
            });
        },
        overdue() {
            if (this.loading) return false; // 如果表格loading中，不允许逾期
            if (!this.selectData.length) {
                this.$message({
                    message: '请选择运单',
                    type: 'warning'
                });
                return false;
            }
            this.overdueShaowDialog = true;
        },
        checkClick(batchUploadTitle, batchFlag) {
            if (batchUploadTitle === '选择' && !this.selectData.length) {
                this.$message.warning('至少选择一条数据');
                return false;
            }
            this.batchUploadTitle = batchUploadTitle;
            this.batchFlag = batchFlag;
            this.batchUploadShow = true;
        },
        userAuthorization() {
            return userdataAuth(this.user.userCode).then(res => {
                if (res) {
                    const hasAuth = res.data.find(item => item.dataCode === 'D20190621009');
                    if (hasAuth) {
                        let authCodeArr = hasAuth.userDataAuths.map(item => item.authCode);
                        if (authCodeArr.find(item => item === 'ALL')) {
                            authCodeArr = [];
                        }
                        this.siteCodeList = authCodeArr;
                    }
                }
            });
        },
        initDate(timeNum) {
            const start = new Date();
            start.setHours(0);
            start.setMinutes(0);
            start.setSeconds(0);
            start.setMilliseconds(0);
            const end = new Date();
            end.setHours(23);
            end.setMinutes(59);
            end.setSeconds(59);
            end.setMilliseconds(0);
            start.setTime(start.getTime() - 3600 * 1000 * 24 * timeNum);
            return [start, end];
        },
        async initData() {
            const dateArr = this.initDate(this.config.searchList.searchTxt[1].timeNum);
            const query = this.$route.query;
            const params = {
                signStatus: '',
                beginDate3: '',
                endDate3: '',
                pageNo: 1,
                pageSize: 10
            };
            params.beginDate2 = moment(dateArr[0]).format('YYYY-MM-DD HH:mm:ss');
            params.endDate2 = moment(dateArr[1]).format('YYYY-MM-DD HH:mm:ss');
            const initSearchInfo = {};
            if (query.isRefresh) {
                params.signStatus = query.orderStatusList;
                params.beginDate3 = query.createStartTime && common.formatDateTime(query.createStartTime);
                params.endDate3 = query.createEndTime && common.formatDateTime(query.createEndTime);
                initSearchInfo.signTime = [params.beginDate3, params.endDate3];
                initSearchInfo.signStatus = params.signStatus.split(',');
                this.$router.replace({ name: 'receiptSign', query: {} });
            } else {
                initSearchInfo.signTime = [];
                initSearchInfo.signStatus = '';
            }
            this.initSearchInfo = initSearchInfo;
            // 获取权限列表
            await this.userAuthorization();
            // 获取项目分类
            await this.getProjectClassify();
            // 获取逾期原因
            await this.getOverdueOptions();
            // 获取列表数据
            await this.getDataList(params);
        },
        detailsClose() {
            this.detailsShow = false;
        }
    },
    activated () {
        if (this.$route.query.isRefresh) {
            this.initData();
        }
    },
    created () {
        // 获取鉴权信息
        this.getCertification();
    },
    mounted () {
        // this.initData();
        // 获取权限列表
        this.userAuthorization();
        // 获取项目分类
        this.getProjectClassify();
        // 获取逾期原因
        this.getOverdueOptions();
    },
    computed: {
        ...mapState({ user: state => state.user })
    },
    beforeRouteLeave(to, from, next) {
        this.cancelRequest(); // 取消未响应的鉴权请求
        clearTimeout(this.timeNum);
        next();
    }
};
</script>

<style lang="less">
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
.receiptTile {
    .el-dropdown-menu__item {
        width: 100px;
        text-align: center;
        padding: 0 !important;
    }
    .el-button--text {
        padding: 0;
    }
    .el-upload-list--picture-card .el-upload-list__item{
        height: 80px;
        width: 80px;
    }
    .el-upload-list__item-actions {
        height: 80px;
        width: 80px;
    }
}
</style>
