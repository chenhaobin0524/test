<template>
    <paper id="transferConfirm">
        <m-pane
            ref='tablePage'
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :searchTotalTitle="searchTotalTitle"
            :loading="loading"
            :currentPage='currentPage'
            searchId="transfer_confirm_search"
            pageID="transfer_confirm"
            @row-db-click="rowDBclick"
            @photos-btn="photosBtn"
            @upload-btn="uploadBtn"
            @check-btn="checkBtn"
            @edit-btn="editBtn"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange">
        </m-pane>
        <!-- 附件 图片预览 -->
        <photos-dialog :attachmentShow.sync='attachmentShow' :rowData='rowData' v-if='attachmentShow'></photos-dialog>
        <!-- 接收与详情 -->
        <receive-and-detailDialog :searchObj='searchObj' @refreshList='getList' :titleName='titleName' :rowData='rowData' :cellShaow.sync='cellShaow' v-if='cellShaow'></receive-and-detailDialog>
        <!-- 上传按钮使用的组件 -->
        <upload @callback='uploadResponse' style="display: none;" :loading.sync='loading'>
            <i ref='upload'></i>
        </upload>
    </paper>
</template>
<script>
import mPane from '@/components/otpPanel';
import config from './config.js';
import paper from '@/components/core/paper/Paper';
import photosDialog from './photosDialog';
import receiveAndDetailDialog from './receiveAndDetailDialog';
import { getTransferConfirmList, uploadTransfer } from '../../../api/transferConfirm.js';
import upload from '../../../views/distributeManage/receiptSign/upload.vue';
import { mapState } from 'vuex';
import configs from '@/config/user.env';

export default {
    name: 'transferConfirm',
    components: { mPane, paper, photosDialog, receiveAndDetailDialog, upload },
    data() {
        return {
            rowData: {},
            currentPage: 1,
            attachmentShow: false,
            titleName: '',
            cellShaow: false,
            config: config,
            loading: false,
            totalData: [],
            pageTotal: 0,
            // 高级搜索配置项
            searchTotalTitle: [
                {
                    name: '客户',
                    value: 'customerName',
                    type: 'advance',
                    advanceConfig: [
                        { prop: 'ebcuNameCn', value: '名称' },
                        { prop: 'pmCode', value: '编码' }
                    ],
                    tableConfig: [
                        { prop: 'pmCode', value: '客户编码' },
                        { prop: 'ebcuNameCn', value: '客户名称' }
                    ],
                    advanceUrl: '/ebCustomer/searchByEbCustomer',
                    cbParams: ['pmCode#customerCode', 'ebcuNameCn#customerName']
                },
                {
                    name: '接收人',
                    value: 'receiptPersonName',
                    type: 'advanceUser',
                    cbParams: ['userCode#receiptPersonCode', 'userName#receiptPersonName']
                },
                {
                    name: '客户订单号',
                    value: 'custOrderNo',
                    type: 'input'
                },
                {
                    name: '运输单号',
                    value: 'taskNo',
                    type: 'input'
                },
                {
                    name: '移交类型',
                    value: 'transType',
                    type: 'select',
                    optionNum: 'SYS_TMS_TANSFER_WAY'
                }
            ],
            searchObj: {
                taskNo: '',
                transferNo: '',
                transferStatus: '',
                customerCode: '',
                receiptPersonCode: '',
                custOrderNo: '',
                beginDate: '',
                endDate: '',
                pageNo: 1,
                pageSize: 10
            }
        };
    },
    methods: {
        uploadResponse(response) {
            const params = {
                createUserName: this.user.userName,
                createUserCode: this.user.userCode,
                transferNo: this.rowData.transferNo
            };
            params.fileUrls = response.map(item => item.data.downUrl);
            uploadTransfer(params).then(res => {
                this.loading = false;
                if (res) {
                    this.getList(this.searchObj);
                    this.$message.success('上传成功');
                }
            }).catch(() => {
                this.loading = false;
                this.$message.error('上传失败');
            });
        },
        // 表格内双击事件
        rowDBclick(row) {
            this.rowData = row;
            this.titleName = '详情';
            this.cellShaow = true;
        },
        // 接收
        checkBtn(data) {
            this.rowData = data;
            this.titleName = '接收';
            this.cellShaow = true;
        },
        // 打印
        editBtn(data) {
            window.open(`${configs.apiUrl}/api-otp/receipt/printtransfer/${data.transferNo}`);
        },
        selectChange(data) {
            // 表格内选择变化
        },
        // 查询
        searchChange(data) {
            this.searchObj = { ...this.searchObj, ...data };

            this.searchObj.beginDate = data.startTime;
            this.searchObj.endDate = data.endTime;
            this.searchObj.pageNo = 1;
            this.getList(this.searchObj);
        },
        // 页面改变
        pageChange(data) {
            this.searchObj.pageNo = data;
            this.getList(this.searchObj);
        },
        // 页容量改变
        sizeChange(data) {
            this.searchObj.pageNo = 1;
            this.searchObj.pageSize = data;
            this.getList(this.searchObj);
        },
        photosBtn(data) {
            this.rowData = data;
            this.attachmentShow = true;
        },
        uploadBtn(data) {
            this.rowData = data;
            this.$refs.upload.click();
        },
        // 获取首页列表数据
        // eslint-disable-next-line
        getList({ taskNo, transferNo, transferStatus, customerCode, receiptPersonCode, custOrderNo, beginDate, endDate, transType, pageNo, pageSize } = { pageNo: 1, pageSize: 10 }) {
            const params = { taskNo, transferNo, transferStatus, customerCode, receiptPersonCode, custOrderNo, beginDate, endDate, transType, pageNo, pageSize };
            this.searchObj = params;
            this.currentPage = pageNo;
            this.loading = true;
            getTransferConfirmList(params).then(res => {
                if (res) {
                    const SYS_TMS_TANSFER_WAY = sessionStorage.SYS_TMS_TANSFER_WAY ? JSON.parse(sessionStorage.SYS_TMS_TANSFER_WAY) : {};
                    res.data.list.forEach(item => {
                        if (item.transferStatus === '1') {
                            item.transferStatusText = '完成';
                            item.hiddenEvent = ['view'];
                        } else {
                            item.transferStatusText = '待接收确认';
                        }
                        item.transTypeText = SYS_TMS_TANSFER_WAY[item.transType];
                        if (item.fileList.length > 0) {
                            item.showPhotos = true;
                        }
                    });
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    mounted () {
        // 获取首页列表数据 手动触发搜索，取默认值进行搜索
        // this.$refs.tablePage.$refs.searchList.onSearchChange();
    },
    computed: {
        ...mapState({ user: state => state.user })
    }
};
</script>

<style lang="less">
#transferConfirm {
    .el-button--text {
        padding: 0;
    }

    .el-col-8 {
        line-height: 30px;
    }

    .label {
        color: #999;
    }

}

.transAttaChment {
        .attachmentTitle {
            margin: 10px 0;
        }
        .attachmentLeft {
            border-radius: 4px;
            .receiveImgs {
                width: 100%;
                height: 100%;
            }
        }
        .uploaders {
            display: flex;
            height: 30px;
            line-height: 30px;

            .avatarUploader {
                text-align: center;
                margin: auto 90px;
                border: 1px dashed;
                width: 25px;
                height: 25px;
                line-height: 25px;
                border-radius: 4px;
                color: #333;
            }

            .deleteImgs {
                flex: 1;
                width: 25px;
                height: 25px;
                .cutoffImg {
                    cursor: pointer;
                }
            }
            .downloadImgs {
                flex: 1;
                width: 25px;
                height: 25px;

                .downloadImages {
                    width: 25px;
                    height: 25px;
                    cursor: pointer;
                }
            }
        }
    }
.text-color {
    display: inline-block;
    width: 50px;
    text-align: center;
}
</style>