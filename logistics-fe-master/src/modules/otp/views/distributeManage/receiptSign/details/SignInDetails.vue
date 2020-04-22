<template>
    <!-- 签收/拒收/详情 弹框 -->
    <!-- <el-dialog :closeOnClickModal='closeOnClickModal' class='signDialog receiptSignSignInDialog' :title="titleName" :visible="true" :before-close="beforeClose" width="90%"> -->
        <div class="sign-details signDialog receiptSignSignInDialog">
        <!-- 网批驳回 弹框 -->
        <reject-dialog v-if='rejectShow' :rejectShow.sync='rejectShow' :getParams='getParams' :closeDialogAndRefreshData='closeDialogAndRefreshData'></reject-dialog>
        <!-- B2C+直配 拒收 弹框 -->
        <b2c-reject-dialog v-if='b2cRejectShow' :b2cRejectShow.sync='b2cRejectShow' :getParams='getParams' :closeDialogAndRefreshData='closeDialogAndRefreshData'></b2c-reject-dialog>
            <div class="signContent">
                <div class="receiveLeft">
                    <div class="currentImgIndex" v-show="imgArr.length">{{ carouselIndex + 1 + ' / ' + imgArr.length}}</div>
                    <div style="height: 400px;" v-show="imgArr.length">
                        <ul id='viewers' style="display: none;">
                            <li v-for='(item, index) in imgArr' :key='index'>
                                <img :src="item.filePath + '?certification=' + certification">
                            </li>
                        </ul>
                    </div>
                    <!-- 左边图片底部 上传 删除 下载 -->
                    <div class="uploader" v-if="imgArr.length">
                        <upload @callback='uploadResponse' :dialogLoading='fullLoading' v-has='"04050004"'>
                            <i class="el-icon-plus pictures"></i>
                        </upload>
                        <i class="el-icon-delete" @click="deleteImg" v-has='"04050005"'></i>
                        <i class="el-icon-download" @click="downloadImg" v-has='"04050006"'></i>
                    </div>
                    <upload style="height: 300px;" v-else @callback='uploadResponse' :dialogLoading='fullLoading' v-has='"04050004"'>
                        <i class="el-icon-plus notImg"></i>
                    </upload>
                </div>
                <div class="receiveRight">
                    <el-row>
                        <el-col :span="8">
                            <div class="colItem">
                                <span class="label">运输单号：</span>
                                <span class="value">{{totalData.taskNo}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="colItem">
                                <span class="label">发车单号：</span>
                                <span class="value">{{totalData.dispatchNo}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="colItem">
                                <span class="label">客户订单号：</span>
                                <span class="value"> {{totalData.customerOrderNo}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="colItem">
                                <span class="label">汇总：</span>
                                <!-- <span class="value">实发 {{sendNum}} / 实收 {{receiveNum}} / 异常 {{abnormalNum}}</span> -->
                                <span class="value">实发 {{totalData.realDeliverCountAll}} / 实收 {{receiveNum}} / 异常 {{abnormalNum}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="colItem">
                                <span class="label">签收人：</span>
                                <span class="value">{{totalData.signContact}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="colItem">
                                <span class="label">签收时间：</span>
                                <span class="value">{{totalData.signTime}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8" v-if="rowData.projectClassify === 'WP'">
                            <div class="colItem">
                                <span class="label">网批签收完成时间：</span>
                                <span class="value">{{totalData.wpSignTime}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-table :data="tableData" border tooltip-effect="dark">
                        <el-table-column :show-overflow-tooltip='true' prop="itemCode.value" label="商品编码" align='center'></el-table-column>
                        <el-table-column :show-overflow-tooltip='true' prop="itemName.value" label="商品名称" align='center'></el-table-column>
                        <el-table-column :show-overflow-tooltip='true' prop="financeNo.value" label="财务单号" align='center' v-if='totalData.sourceSystem === "CIMS"'></el-table-column>
                        <el-table-column :show-overflow-tooltip='true' label="正品" width='100' align='center'>
                            <template slot-scope="scope">
                                <div style="position: relative;">
                                    <div style='position: absolute; height: 100%; width: 100%'></div>
                                    <el-tooltip :tabindex="-1" v-model='scope.row.realReceive.showToptip' effect="dark"
                                        content="正品不能为负数 污染-破损-短少-拒收 会影响正品数量,请仔细核对" placement="bottom">
                                        <!-- 下边的margin是为了解决。。两个完全重合的div，会触发下边元素的mouseenter，可能重合有误差，渲染问题 -->
                                        <div :class="{red: scope.row.realReceive.showToptip}" style="margin: 0 5px">{{realReceive(scope.$index)}}</div>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip='true' label="污染" width='100' align='center'>
                            <template slot-scope="scope">
                                <div>
                                    <el-input-number @change='resetToptip' v-if="scope.row.mildewPolluteCount.show" v-model="scope.row.mildewPolluteCount.value" size="mini" controls-position='right'
                                        :min="0"
                                        :precision='0'>
                                    </el-input-number>
                                    <div v-else @click='edit(scope.row.mildewPolluteCount, "mildewPolluteCount")'>{{scope.row.mildewPolluteCount.value}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip='true' label="破损" width='100' align='center'>
                            <template slot-scope="scope">
                                <div>
                                    <el-input-number @change='resetToptip' v-if="scope.row.packageDamagedCount.show" v-model="scope.row.packageDamagedCount.value" size="mini" controls-position='right'
                                        :min="0"
                                        :precision='0'>
                                    </el-input-number>
                                    <div v-else @click='edit(scope.row.packageDamagedCount, "packageDamagedCount")'>{{scope.row.packageDamagedCount.value}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip='true' label="短少" width='100' align='center'>
                            <template slot-scope="scope">
                                <div>
                                    <el-input-number @change='resetToptip' v-if="scope.row.stockoutCount.show" v-model="scope.row.stockoutCount.value" size="mini" controls-position='right'
                                        :min="0"
                                        :precision='0'>
                                    </el-input-number>
                                    <div v-else @click='edit(scope.row.stockoutCount, "stockoutCount")'>{{scope.row.stockoutCount.value}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip='true' label="拒收" width='100' align='center'>
                            <template slot-scope="scope">
                                <div>
                                    <el-input-number @change='resetToptip' v-if="scope.row.rejectQty.show" v-model="scope.row.rejectQty.value" size="mini" controls-position='right'
                                        :min="0"
                                        :precision='0'>
                                    </el-input-number>
                                    <div v-else @click='edit(scope.row.rejectQty, "rejectQty")'>{{scope.row.rejectQty.value}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip='true' prop="ccsQty.value" label="CCS签收量" v-if="rowData.projectClassify === 'WP'" align='center'></el-table-column>
                        <el-table-column :show-overflow-tooltip='true' prop="compareStatus.value" label="对比状态" v-if="rowData.projectClassify === 'WP'" align='center'></el-table-column>
                        <el-table-column :show-overflow-tooltip='true' label="备注" width='150' align='center'>
                            <template slot-scope="scope">
                                <div>
                                    <div v-if='rowData.clickBtn === "detail"'>{{scope.row.signRemark.value}}</div>
                                    <el-input v-else v-model.trim="scope.row.signRemark.value" style="width: 100%" clearable></el-input>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer-btn" class="footer-btn">
                <el-button @click="beforeClose">取 消</el-button>
                <el-button type="primary" @click="rejectBtn" v-if="rowData.projectClassify === 'WP' && rowData.clickBtn === 'sign' &&  rowData.distributionLastFlag !== 'N'">网批驳回</el-button>
                <el-button type="primary" @click="rejectConfirm" v-if='rowData.clickBtn === "reject"'>拒收确认</el-button>
                <el-button type="primary" @click="signConfirm" v-if='rowData.clickBtn === "sign"'>签收确认</el-button>
            </div>
        </div>
    <!-- </el-dialog> -->
</template>
<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import upload from '../upload.vue';
import rejectDialog from '../rejectDialog';
import b2cRejectDialog from '../b2cRejectDialog';
import common from '@/utils/common';
import { mapState } from 'vuex';
import { receiptDetail, receiptUpload, receiptDeleteReceiptpicture, receiptRejectsign, receiptSign } from '../../../../api/receiptSign';

export default {
    components: { upload, rejectDialog, b2cRejectDialog },
    props: {
        signInShow: {
            type: Boolean,
            default() {
                return false;
            }
        },
        titleName: {
            type: String,
            default() {
                return '';
            }
        },
        rowData: {
            type: Object,
            default() {
                return {};
            }
        },
        searchObj: {
            type: Object,
            default() {
                return {};
            }
        },
        certification: {
            type: String,
            default() {
                return '';
            }
        }
    },
    data() {
        return {
            viewer: {},
            closeOnClickModal: false,
            dialogLoading: {}, // 弹框loading实例
            updateTime: '',
            updateUserName: '',
            totalData: {},
            tableData: [],
            imgArr: [],
            rejectShow: false,
            b2cRejectShow: false,
            carouselIndex: 0 // 轮播图当前的索引
        };
    },
    methods: {
        fullLoading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.receiptSignSignInDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        resetToptip() {
            this.tableData.find(item => {
                if (item.realReceive.showToptip === true) {
                    item.realReceive.showToptip = false;
                    return true;
                }
            });
        },
        downloadImg() {
            window.location = this.imgArr[this.carouselIndex].filePath + '?certification=' + this.certification;
        },
        // 删除图片
        deleteImg() {
            const params = {
                taskNo: this.rowData.taskNo,
                filePath: this.imgArr[this.carouselIndex].filePath
            };
            receiptDeleteReceiptpicture(params).then(res => {
                if (res) {
                    this.imgArr.splice(this.carouselIndex, 1);
                    this.rowData.files.splice(-(this.carouselIndex + 1), 1);
                    this.$message.success('删除成功');

                    this.updateViewer();
                }
            }).catch(() => {
                this.$message.error('删除失败');
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
                        this.updateUserName = this.user.userName;
                        this.updateTime = common.formatDateTime(res.timestamp);
                        params.fileUrls.forEach(item => {
                            this.imgArr.unshift({ filePath: item, updateUserName: this.updateUserName, updateTime: this.updateTime });
                            this.rowData.files.push({ filePath: item, updateUserName: this.updateUserName, updateTime: this.updateTime });
                        });
                        this.$message.success('上传成功');
                        this.rowData.showPhotos = true; // 让首页表格对应数据显示图片查看按钮

                        this.updateViewer();
                    }
                }
            }).catch(() => {
                this.$message.error('上传失败');
            });
        },
        updateViewer() {
            this.carouselIndex = 0;
            // this.$nextTick(() => {
            //     this.viewer.update(); // update有bug，删除最后一张图片会报错，另辟蹊径
            // });
            this.viewer.destroy();
            setTimeout(() => {
                this.initViewer();
            });
        },
        edit(obj, property) {
            if (this.rowData.clickBtn === 'detail') {
                return false;
            }
            if (this.rowData.businessMode === 'B2C') {
                if (this.totalData.sourceSystem === 'CCS' || this.totalData.sourceSystem === 'CVTE') {
                    obj.show = true;
                }
            }
            if (+this.totalData.cnDispatch === 1) {
                obj.show = true;
            }
            if (this.rowData.projectClassify === 'WP') {
                // rejectQty=拒收  stockoutCount=短少
                if (property === 'rejectQty' || property === 'stockoutCount') {
                    obj.show = true;
                }
            } else {
                obj.show = true;
            }
        },
        initViewer() {
            const barOptions = { show: true, size: 'small' };
            this.viewer = new Viewer(document.getElementById('viewers'), {
                inline: true,
                title: false,
                navbar: true,
                button: true,
                toolbar: {
                    zoomIn: barOptions,
                    zoomOut: barOptions,
                    prev: {
                        show: true,
                        size: 'small',
                        click: () => {
                            if (this.carouselIndex === 0) {
                                this.carouselIndex = this.imgArr.length - 1;
                            } else {
                                this.carouselIndex -= 1;
                            }
                            this.viewer.prev(true);
                        }
                    },
                    reset: barOptions,
                    next: {
                        show: true,
                        size: 'small',
                        click: () => {
                            if (this.carouselIndex === this.imgArr.length - 1) {
                                this.carouselIndex = 0;
                            } else {
                                this.carouselIndex += 1;
                            }
                            this.viewer.next(true);
                        }
                    },
                    rotateLeft: barOptions,
                    rotateRight: barOptions
                }
            });
        },
        getReceiptDetail() {
            // 获取图片
            this.rowData.files.forEach(item => {
                this.imgArr.unshift(item);
            });

            this.$nextTick(() => {
                this.initViewer();
            });

            this.fullLoading();
            this.closeOnClickModal = true;
            receiptDetail(this.rowData.taskNo).then(res => {
                if (res) {
                    res.data.itemDetails.forEach(item => {
                        this.tableData.push({
                            lineNo: item.lineNo,
                            realDeliverCount: item.realDeliverCount,
                            realReceiveCount: item.realReceiveCount,
                            abnormalCount: item.abnormalCount,
                            polluteDamagedCount: item.polluteDamagedCount,
                            quantity: item.quantity,
                            version: item.version,
                            // 实发(单行)            正品                       破损                                 污染                              短少                        拒收
                            // sendNum: Number(item.realReceive) + Number(item.packageDamagedCount) + Number(item.mildewPolluteCount) + Number(item.stockoutCount) + Number(item.rejectQty),
                            itemCode: { show: false, value: item.itemCode }, // 商品编码
                            itemName: { show: false, value: item.itemName }, // 商品名称
                            financeNo: { show: false, value: item.financeNo }, // 财务单号
                            realReceive: { show: false, value: item.realReceive, showToptip: false }, // 正品
                            mildewPolluteCount: { show: false, value: item.mildewPolluteCount }, // 污染
                            packageDamagedCount: { show: false, value: item.packageDamagedCount }, // 破损
                            stockoutCount: { show: false, value: item.stockoutCount }, // 短少
                            rejectQty: { show: false, value: item.rejectQty }, // 拒收
                            ccsQty: { show: false, value: item.ccsQty }, // css签收量
                            compareStatus: { show: false, value: item.compareStatus }, // 对比状态
                            signRemark: { show: false, value: item.signRemark } // 备注
                        });
                    });
                    this.totalData = res.data;
                    this.closeOnClickModal = false;
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
        },
        getParams(operateType) {
            const params = [
                {
                    batchSignFlag: '1',
                    signContact: this.user.userName, // 签收人 暂时取登录人
                    signType: 'PC',
                    operateType, // 01网批驳回，02签收确认, 03拒收
                    rejectReason: '', // B2C+直配 拒收原因 (其他传空字符串)
                    signRemark: '', // B2C+直配 拒收备注 (其他传空字符串)
                    receiptResponse: {
                        version: this.totalData.version,
                        taskNo: this.rowData.taskNo,
                        projectClassify: this.rowData.projectClassify,
                        referenceId: this.rowData.referenceId,
                        customerOrderNo: this.rowData.customerOrderNo,
                        orderType: this.rowData.orderType,
                        upperCustomerCode: this.rowData.upperCustomerCode,
                        upperCustomerName: this.rowData.upperCustomerName,
                        whName: this.rowData.whName,
                        whCode: this.rowData.whCode,
                        orderNo: this.rowData.orderNo,
                        orderSource: this.rowData.orderSource,
                        contractNo: this.rowData.contractNo,
                        waybillNo: this.rowData.waybillNo,
                        entityId: this.rowData.entityId,
                        upperReferenceId: this.rowData.upperReferenceId,
                        signTime: this.rowData.signTime,
                        distributionLastFlag: this.rowData.distributionLastFlag,
                        distributionFlag: this.rowData.distributionFlag,
                        signStatus: this.rowData.signStatus,
                        businessMode: this.rowData.businessMode,
                        dispatchNo: this.rowData.dispatchNo,
                        id: this.rowData.id
                    },
                    receiptDetailResponse: {
                        taskNo: this.rowData.taskNo,
                        custOrderNo: this.rowData.custOrderNo,
                        signTime: this.rowData.signTime,
                        itemDetails: []
                    }
                }
            ];
            this.tableData.forEach(item => {
                params[0].receiptDetailResponse.itemDetails.push({
                    itemName: item.itemName.value,
                    itemCode: item.itemCode.value,
                    quantity: item.quantity,
                    abnormalCount: item.abnormalCount,
                    realDeliverCount: item.realDeliverCount,
                    realReceiveCount: item.realReceiveCount,
                    realReceive: item.realReceive.value,
                    polluteDamagedCount: item.polluteDamagedCount,
                    mildewPolluteCount: item.mildewPolluteCount.value,
                    packageDamagedCount: item.packageDamagedCount.value,
                    stockoutCount: item.stockoutCount.value,
                    rejectQty: item.rejectQty.value,
                    ccsQty: item.ccsQty.value,
                    compareStatus: item.compareStatus.value,
                    version: item.version,
                    signRemark: item.signRemark.value,
                    lineNo: item.lineNo,
                    financeNo: item.financeNo.value,
                    custItemCode: item.custItemCode,
                    itemSuiteCode: item.itemSuiteCode,
                    taskNo: item.taskNo
                });
            });
            return params;
        },
        // 关闭弹框并刷新首页列表数据
        closeDialogAndRefreshData() {
            this.$emit('handleClose');
            this.$emit('refreshList', this.searchObj);
        },
        // 拒收确认
        rejectConfirm() {
            // B2C + 直配
            if (this.rowData.businessMode === 'B2C' && this.rowData.deliveryType === 'WAREHOUSEMATCHING') {
                this.b2cRejectShow = true;
                return false;
            }
            this.fullLoading();
            const params = this.getParams('03')[0];
            receiptRejectsign(params).then(res => {
                if (res) {
                    this.$message({
                        type: 'success',
                        message: '拒收成功'
                    });
                    this.closeDialogAndRefreshData();
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
        },
        // 签收确认
        signConfirm() {
            if (+this.rowData.signStatus === 65) return this.$message.warning('安得已签收过，请到网点任务管理界面处理');
            let flag = false;
            this.tableData.find(item => {
                if (item.realReceive.value < 0) {
                    item.realReceive.showToptip = true;
                    flag = true;
                    return true;
                }
            });
            if (flag) return false;

            this.fullLoading();
            const params = this.getParams('02');
            receiptSign(params).then(res => {
                if (res) {
                    if (res.data.length > 0) {
                        this.$message({
                            type: 'warning',
                            message: res.data[0].message
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: '签收成功'
                        });
                        this.closeDialogAndRefreshData();
                    }
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
        },
        // 网批驳回
        rejectBtn() {
            this.rejectShow = true;
        },
        beforeClose() {
            this.$emit('handleClose');
        }
    },
    mounted () {
        this.getReceiptDetail();
    },
    computed: {
        ...mapState({ user: state => state.user }),
        // 正品(单行)
        realReceive(index) {
            return (index) => { // 正品=实发(单行)-污染-破损-短少-拒收
                var item = this.tableData[index];
                // item.realReceive.value = item.sendNum - item.mildewPolluteCount.value - item.packageDamagedCount.value - item.stockoutCount.value - item.rejectQty.value;
                item.realReceive.value = item.realDeliverCount - item.mildewPolluteCount.value - item.packageDamagedCount.value - item.stockoutCount.value - item.rejectQty.value;
                return item.realReceive.value;
            };
        },
        // 实收(汇总)
        receiveNum() {
            let total = 0;
            this.tableData.forEach(item => { // 实收数量=正品+破损+污染
                var lineTotal = 0;
                lineTotal += Number(item.realReceive.value);
                lineTotal += Number(item.packageDamagedCount.value);
                lineTotal += Number(item.mildewPolluteCount.value);
                item.realReceiveCount = lineTotal; // 单行实收
                total += lineTotal;
            });
            return total;
        },
        // 异常(汇总)
        abnormalNum() {
            let total = 0;
            this.tableData.forEach(item => { // 异常=拒收+短少+破损+污染
                var lineTotal = 0;
                lineTotal += Number(item.rejectQty.value);
                lineTotal += Number(item.stockoutCount.value);
                lineTotal += Number(item.packageDamagedCount.value);
                lineTotal += Number(item.mildewPolluteCount.value);
                item.abnormalCount = lineTotal; // 单行异常
                total += lineTotal;
            });
            return total;
        }
    },
    beforeDestroy() {
        this.viewer.destroy();
    }
};
</script>
<style lang='less'>
@import '../signInDialog.less';
</style>
