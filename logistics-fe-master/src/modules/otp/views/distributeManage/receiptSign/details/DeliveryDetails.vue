<template>
    <div class="delivery-details">
        <div class="form-info">
            <el-row v-for="(info, index) in config.delivery.formInfo" :key="index" :gutter="20">
                <el-col v-for="(item, i) in info.col" :key="i" :span="item.span">
                    <span class="label">{{item.label}}：</span><span class="value">{{totalInfo[item.prop]}}</span>
                </el-col>
            </el-row>
        </div>
        <div class="table-info">
            <el-table :data="tableData" border tooltip-effect="dark" height="260">
                <template v-for="(item, key) in config.delivery.columns">
                    <template v-if="item.prop !== 'finalMildewPollute' && item.prop !== 'finalPackageDamaged'">
                        <el-table-column :prop="item.prop" :label="item.label" align='center' :key="key"
                            show-overflow-tooltip></el-table-column>
                    </template>
                    <template v-else>
                        <el-table-column v-if="rowData.projectClassify !== 'WP'" :prop="item.prop" :label="item.label" align='center' :key="key"
                            show-overflow-tooltip></el-table-column>
                    </template>
                </template>
            </el-table>
        </div>
        <div slot="footer-btn" class="footer-btn">
            <el-button @click="beforeClose">取 消</el-button>
            <el-button type="primary" @click="deliveryFileView">附件查看</el-button>
            <el-button type="primary" @click="deliveryReject" :loading="rejectLoading">驳回</el-button>
            <el-button type="primary" @click="deliveryConfirm" :loading="confirmLoading">确认</el-button>
        </div>
        <attachment-view :certification='certification' v-if='attachmentShow' :attachmentShow.sync='attachmentShow' :rowData='rowData'></attachment-view>
    </div>
</template>
<script>
import AttachmentView from './AttachmentView';
import { deliveryDetailsList, deliveryConfirm, deliveryReject, getDictList } from '../../../../api/receiptSign';
import config from './config';
import { setSession } from '@/utils/storage';
export default {
    components: { AttachmentView },
    props: {
        rowData: {
            type: Object,
            default() {
                return {};
            }
        },
        certification: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            totalInfo: {
                orderNo: '',
                customerOrderNo: '',
                networkSignTime: '',
                finalSignTime: '',
                netName: '',
                networkContact: '',
                networkAddr: '',
                netMobileetMobile: '',
                finalName: '',
                finalMobile: '',
                finalDetailAddr: '',
                finalConfirmTime: '',
                addedServiceType: '',
                addedServiceTypeName: ''
            },
            tableData: [],
            config,
            attachmentShow: false,
            rejectLoading: false,
            confirmLoading: false,
            optionNum: 'ADDED_SERVICE'
        };
    },
    methods: {
        async getDictList() {
            await getDictList({ 'dictCodes': this.optionNum }).then(res => {
                if (res) {
                    const dictObj = res.data;
                    Object.keys(dictObj).forEach(key => {
                        setSession(key, dictObj[key]);
                    });
                }
            });
        },
        async getDetailList() {
            await this.getDictList();
            this.getDeliveryDetailsList();
        },
        getDeliveryDetailsList() {
            const params = {
                orderNo: this.rowData.orderNo,
                pageNo: 1,
                pageSize: 100000
            };
            deliveryDetailsList(params).then(res => {
                if (res && +res.code === 0) {
                    this.tableData = res.data.list || [];
                    if (this.tableData.length > 0) {
                        Object.keys(this.totalInfo).forEach(key => {
                            if (this.tableData[0].hasOwnProperty(key)) {
                                this.totalInfo[key] = this.tableData[0][key];
                            } else {
                                this.totalInfo[key] = '';
                            }
                        });
                        this.totalInfo.addedServiceTypeName = window.sessionStorage.ADDED_SERVICE
                            ? JSON.parse(window.sessionStorage.ADDED_SERVICE)[this.totalInfo.addedServiceType] : this.totalInfo.addedServiceType;
                    }
                }
            });
        },
        beforeClose() {
            this.$emit('handleClose');
        },
        closeDialogAndRefreshData() {
            this.$emit('handleClose');
            this.$emit('refreshList', this.searchObj);
        },
        deliveryFileView() {
            this.attachmentShow = true;
        },
        deliveryReject() {
            this.rejectLoading = true;
            const params = {
                orderNo: this.rowData.orderNo
            };
            deliveryReject(params).then(res => {
                this.rejectLoading = false;
                if (res && +res.code === 0) {
                    this.$message.success('驳回成功');
                    this.$emit('detailsClose');
                }
            }).catch(() => {
                this.rejectLoading = false;
            });
        },
        deliveryConfirm() {
            this.confirmLoading = true;
            const params = {
                orderNo: this.rowData.orderNo
            };
            deliveryConfirm(params).then(res => {
                this.confirmLoading = false;
                if (res && +res.code === 0) {
                    this.$message.success('确认成功');
                    this.$emit('detailsClose');
                }
            }).catch(() => {
                this.confirmLoading = false;
            });
        }
    },
    created() {
        this.getDetailList();
    }
};
</script>
<style lang="less">
    .sign-detail{
      .header-title{
        font-size: 14px;
        color: #666;
    }
    .delivery-details{
       .form-info{
            margin-left: 40px;
            font-size: 12px;
            .el-row{
                margin-bottom: 20px;
            }
        }
        }
    }

</style>