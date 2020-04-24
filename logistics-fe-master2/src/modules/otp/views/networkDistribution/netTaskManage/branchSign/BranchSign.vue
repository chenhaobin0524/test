<template>
  <el-dialog :closeOnClickModal='closeOnClickModal' class='sign-confirm-dialog receiptSignSignInDialog'
    :title="titleName" :visible="true" :before-close="beforeClose" width="95%">
    <div class="signContent">
      <div class="receiveLeft">
        <div style="height: 300px;">
          <ul id='viewers' style="display: none;">
            <li v-for='(item, index) in imgArr' :key='index'>
              <img :src="item.url + '?certification=' + certification">
            </li>
          </ul>
        </div>
        <div class="uploader">
          <upload ref="signUpload" :dialogLoading='fullLoading' @callback='uploadResponse' :onBeforeUpload="onBeforeUpload" :limit=3>
            <i class="el-icon-plus pictures"></i>
          </upload>
          <i class="el-icon-delete" @click="deleteImg"></i>
          <i class="el-icon-download" @click="downloadImg"></i>
        </div>
      </div>
      <div class="receiveRight">
        <el-form :inline="true" :model="totalForm" :rules="rules" ref="formInfo">
            <el-row>
                <el-col :span="8"><el-form-item label="客户订单号：">{{totalForm.customerOrderNo}}</el-form-item></el-col>
                <el-col :span="8"><el-form-item label="订单号：">{{totalForm.orderNo}}</el-form-item></el-col>
                <el-col :span="8">
                    <el-form-item v-if="type === '1'" label="运单号：">{{totalForm.waybillNo}}</el-form-item>
                    <el-form-item v-else-if="type === '2'" label="汇总：">实发 {{totalForm.finalNetReceiveCount}} / 实收 {{finalReceiveCount}} / 异常 {{finalAbnormalCount}}
                    </el-form-item>
                    <el-form-item v-else-if="type === '3'" label="入库时间：">{{totalForm.netInTime}}</el-form-item>
                    <el-form-item v-else-if="type === '4'" label="出库时间：">{{totalForm.netOutTime}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item v-if="type === '1'" label="汇总：">实收 {{netReceiveCount}} / 异常 {{netAbnormalCount}}</el-form-item>
                    <el-form-item v-else-if="type === '2'" label="签收人：" prop="finalReceiptName">
                        <el-input v-model="totalForm.finalReceiptName" clearable class="receipt-name"></el-input>
                    </el-form-item>
                    <el-form-item v-else-if="type === '3'" label="网点入库备注：">
                        <el-input v-model="totalForm.netInRemark" clearable class="receipt-name"></el-input>
                    </el-form-item>
                    <el-form-item v-else-if="type === '4'" label="网点出库备注：">
                        <el-input v-model="totalForm.netOutRemark" clearable class="receipt-name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item v-if="type === '1'" label="签收人：" prop="networkReceiptName">
                        <el-input v-model="totalForm.networkReceiptName" class="receipt-name" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-else-if="type === '2'" label="增值服务类型：" prop="addedServiceType">
                        <selects :mValue="totalForm.addedServiceType" :optionNum="'ADDED_SERVICE'"
                        prop="addedServiceType" @getSelectValue="getSelectValue"></selects>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="tableData" border tooltip-effect="dark" height="260">
          <el-table-column show-overflow-tooltip prop="itemCode" label="商品编码" width='120' align='center'>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="itemName" label="商品名称" align='center'></el-table-column>
          <el-table-column v-if="type === '1' || type === '2'" show-overflow-tooltip label="正品" width='70'
            align='center'>
            <template slot-scope="scope">
              <div style="position: relative;">
                <div style='position: absolute; height: 100%; width: 100%'></div>
                <template v-if="type === '1'">
                  <el-tooltip :tabindex="-1" v-model='scope.row.netRealReceive.showToptip' effect="dark"
                    content="正品不能为负数 请仔细核对" placement="bottom">
                    <!-- 下边的margin是为了解决。。两个完全重合的div，会触发下边元素的mouseenter，可能重合有误差，渲染问题 -->
                    <div :class="{red: scope.row.netRealReceive.showToptip}" style="margin: 0 5px">
                      {{netRealReceive(scope.$index)}}</div>
                  </el-tooltip>
                </template>
                <template v-else-if="type === '2'">
                  <el-tooltip :tabindex="-1" v-model='scope.row.finalRealReceive.showToptip' effect="dark"
                    content="正品不能为负数 请仔细核对" placement="bottom">
                    <div :class="{red: scope.row.finalRealReceive.showToptip}" style="margin: 0 5px">
                      {{finalRealReceive(scope.$index)}}</div>
                  </el-tooltip>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="type === '2'  && rowData.projectClassify !=='WP'" show-overflow-tooltip label="污染" width='100' align='center'>
            <template slot-scope="scope">
              <div>
                <el-input-number @change='resetToptip' v-if="scope.row.finalMildewPollute.show"
                  v-model="scope.row.finalMildewPollute.value" size="mini" controls-position='right' :min="0"
                  :precision='0'>
                </el-input-number>
                <div v-else @click='edit(scope.row.finalMildewPollute, "finalMildewPollute")'>
                  {{scope.row.finalMildewPollute.value}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="type === '2' && rowData.projectClassify !=='WP'" show-overflow-tooltip label="破损" width='100' align='center'>
            <template slot-scope="scope">
              <div>
                <el-input-number @change='resetToptip' v-if="scope.row.finalPackageDamaged.show"
                  v-model="scope.row.finalPackageDamaged.value" size="mini" controls-position='right' :min="0"
                  :precision='0'>
                </el-input-number>
                <div v-else @click='edit(scope.row.finalPackageDamaged, "finalPackageDamaged")'>
                  {{scope.row.finalPackageDamaged.value}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="type === '1' || type === '2'" show-overflow-tooltip label="短少" width='100'
            align='center'>
            <template slot-scope="scope">
              <div v-if="type === '1'">
                <el-input-number @change='resetToptip' v-if="scope.row.netStockoutCount.show"
                  v-model="scope.row.netStockoutCount.value" size="mini" controls-position='right' :min="0"
                  :precision='0'>
                </el-input-number>
                <div v-else @click='edit(scope.row.netStockoutCount, "netStockoutCount")'>
                  {{scope.row.netStockoutCount.value}}</div>
              </div>
              <div v-else-if="type === '2'">
                <el-input-number @change='resetToptip' v-if="scope.row.finalStockoutCount.show"
                  v-model="scope.row.finalStockoutCount.value" size="mini" controls-position='right' :min="0"
                  :precision='0'>
                </el-input-number>
                <div v-else @click='edit(scope.row.finalStockoutCount, "finalStockoutCount")'>
                  {{scope.row.finalStockoutCount.value}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="type === '2'" show-overflow-tooltip label="拒收" width='100'
            align='center'>
            <template slot-scope="scope">
              <div v-if="type === '1'">
                <el-input-number @change='resetToptip' v-if="scope.row.netRejectQty.show"
                  v-model="scope.row.netRejectQty.value" size="mini" controls-position='right' :min="0" :precision='0'>
                </el-input-number>
                <div v-else @click='edit(scope.row.netRejectQty, "netRejectQty")'>{{scope.row.netRejectQty.value}}</div>
              </div>
              <div v-else-if="type === '2'">
                <el-input-number @change='resetToptip' v-if="scope.row.finalRejectQty.show"
                  v-model="scope.row.finalRejectQty.value" size="mini" controls-position='right' :min="0"
                  :precision='0'>
                </el-input-number>
                <div v-else @click='edit(scope.row.finalRejectQty, "finalRejectQty")'>{{scope.row.finalRejectQty.value}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="type === '1' || type === '2'" show-overflow-tooltip label="备注" width='150'
            align='center'>
            <template slot-scope="scope">
              <div>
                <el-input v-if="type === '1'" v-model.trim="scope.row.networkSignRemark" style="width: 100%" clearable>
                </el-input>
                <el-input v-else-if="type === '2'" v-model.trim="scope.row.finalSignRemark" style="width: 100%"
                  clearable></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="type === '3' && rowData.orderType === 'PO'" prop="netRejectQty" show-overflow-tooltip label="网点拒收数量" width='150'
            align='center'>
          </el-table-column>
          <el-table-column v-if="type === '3' && rowData.orderType === 'PO'" prop="finalRejectQty" show-overflow-tooltip label="终端拒收数量" width='150'
            align='center'>
          </el-table-column>
          <el-table-column v-if="type === '3' && rowData.orderType === 'RI'" prop="planQty" show-overflow-tooltip label="订单计划数量" width='150'
            align='center'>
          </el-table-column>
          <el-table-column v-if="type === '3'" show-overflow-tooltip label="网点入库总数" width='150' align='center'>
            <template slot-scope="scope">
              <div v-if="scope.row.netStorageCount.show"><el-input-number
                v-model="scope.row.netStorageCount.value" size="mini" controls-position='right' :min="0" :precision='0'>
              </el-input-number></div>
              <div v-else @click='edit(scope.row.netStorageCount, "netStorageCount")'>
                {{scope.row.netStorageCount.value}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="type === '4'" prop="netStorageCount" show-overflow-tooltip label="网点入库数量" width='150'
            align='center'>
          </el-table-column>
          <el-table-column v-if="type === '4'" prop="netOutletsCount" show-overflow-tooltip label="网点出库数量" width='150'
            align='center'>
            <template slot-scope="scope">
              <div v-if="scope.row.netOutletsCount.show"><el-input-number
                v-model="scope.row.netOutletsCount.value" size="mini" controls-position='right' :min="0" :precision='0'>
              </el-input-number></div>
              <div v-else @click='edit(scope.row.netOutletsCount, "netOutletsCount")'>
                {{scope.row.netOutletsCount.value}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" @click="handleNetConfirm" v-if="type === '1'">确 认</el-button>
      <el-button type="primary" @click="handleFinalConfirm" v-else-if="type === '2'">确 认</el-button>
      <el-button type="primary" @click="handleInboundConfirm" v-else-if="type === '3'">确 认</el-button>
      <el-button type="primary" @click="handleOutboundConfirm" v-else-if="type === '4'">确 认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import Upload from '../../../../components/upload/Upload';
import { mapState } from 'vuex';
import { netTaskLists, networkSign, finalSign, netInfoIn, netInfoOut, delImages } from '../../../../api/netTaskManage';
import _ from '@/components/lots/utils';
import data from './data';
import selects from '@/components/lots/otpSelect';

export default {
    components: { Upload, selects },
    props: {
        signInShow: {
            type: Boolean,
            default: false
        },
        titleName: {
            type: String,
            default: ''
        },
        rowData: {
            type: Object,
            default () {
                return {};
            }
        },
        certification: {
            type: String,
            default: ''
        },
        onBeforeUpload: {
            type: Function
        },
        type: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            viewer: {},
            closeOnClickModal: false,
            dialogLoading: {}, // 弹框loading实例
            updateTime: '',
            updateUserName: '',
            totalForm: {
                customerOrderNo: '',
                orderNo: '',
                waybillNo: '',
                networkReceiptName: '',
                networkSignTime: '',
                finalNetReceiveCount: 0,
                finalSignTime: '',
                finalReceiptName: '',
                addedServiceType: '',
                netInTime: '',
                netInRemark: '',
                netOutTime: '',
                netOutRemark: ''
            },
            rules: {
                addedServiceType: [{ required: true, message: '请选择增值服务类型', trigger: 'change' }],
                networkReceiptName: [{ required: true, message: '请输入签收人', trigger: 'blur' }],
                finalReceiptName: [{ required: true, message: '请输入签收人', trigger: 'blur' }]
            },
            tableData: [],
            imgArr: [],
            carouselIndex: 0, // 轮播图当前的索引
            formConfig: []
        };
    },
    methods: {
        fullLoading (status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.receiptSignSignInDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        resetToptip () {
            this.tableData.find(item => {
                if (this.type === '1' && item.netRealReceive.showToptip === true) {
                    item.netRealReceive.showToptip = false;
                    return true;
                } else if (this.type === '2' && item.finalRealReceive.showToptip === true) {
                    item.finalRealReceive.showToptip = false;
                    return true;
                }
            });
        },
        downloadImg () {
            window.location = this.imgArr[this.carouselIndex].url + '?certification=' + this.certification;
        },
        deleteImg () {
            if (this.imgArr.length === 1) return this.$message.warning('最后一张不允许删除');
            const imageId = this.imgArr[this.carouselIndex].id;
            delImages(imageId).then(res => {
                if (res) {
                    this.imgArr.splice(this.carouselIndex, 1);
                    this.$message.success('删除成功');
                    this.updateViewer();
                }
            }).catch(() => {
                this.$message.error('删除失败');
            });
        },
        uploadResponse (response) {
            this.$emit('branchSignUploadResponse', response);
        },
        updateViewer () {
            this.carouselIndex = 0;
            this.viewer.destroy();
            setTimeout(() => {
                this.initViewer();
            });
        },
        edit (obj, property) {
            obj.show = true;
        },
        initViewer () {
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
        getListParams () {
            this.fullLoading();
            this.closeOnClickModal = true;
            this.tableData = [];
            this.imgArr = [];
            Object.keys(this.totalForm).forEach(key => {
                this.totalForm[key] = '';
            });
            const params = {
                orderNo: this.rowData.orderNo,
                type: this.type
            };
            return params;
        },
        updateImgList () {
            if (this.viewer.images) this.viewer.destroy();
            this.getUpdateImgList();
        },
        async getUpdateImgList () { // 图片上传成功只处理刷新图片部分
            this.fullLoading();
            this.closeOnClickModal = true;
            this.imgArr = [];
            const params = {
                orderNo: this.rowData.orderNo,
                type: this.type
            };
            await netTaskLists(params).then(res => {
                this.fullLoading(false);
                if (res) {
                    this.closeOnClickModal = false;
                    res.data.images.forEach(item => {
                        this.imgArr.unshift(item);
                    });
                }
            }).catch(() => {
                this.fullLoading(false);
            });
            this.$nextTick(() => {
                this.initViewer();
            });
        },
        async netSignList () {
            const params = this.getListParams();
            await netTaskLists(params).then(res => {
                if (res) {
                    const data = res.data;
                    this.totalForm = data;
                    const netTaskItemsList = data.netTaskItems || [];
                    netTaskItemsList.forEach(item => {
                        if (item.planQty === undefined) item.planQty = 0;
                        this.tableData.push({
                            itemCode: item.itemCode,
                            itemName: item.itemName,
                            planQty: item.planQty,
                            netRealReceive: { show: false, value: item.planQty, showToptip: false },
                            netStockoutCount: { show: true, value: 0 },
                            netRejectQty: { show: true, value: 0 },
                            networkSignRemark: item.networkSignRemark || '',
                            itemLineNo: item.itemLineNo,
                            version: item.version,
                            orderNo: item.orderNo
                        });
                    });
                    this.closeOnClickModal = false;
                    // 获取图片
                    data.images.forEach(item => {
                        this.imgArr.unshift(item);
                    });
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
            this.$nextTick(() => {
                this.initViewer();
            });
        },
        getSelectValue (data) {
            this.totalForm.addedServiceType = data.addedServiceType;
        },
        async finalSignList () {
            const params = this.getListParams();
            await netTaskLists(params).then(res => {
                if (res) {
                    const data = res.data;
                    this.totalForm = data;
                    let finalNetReceiveCountNum = 0;
                    const finalList = data.netTaskItems || [];
                    finalList.forEach(item => {
                        finalNetReceiveCountNum += item.netRealReceive;
                        if (item.netRealReceive === undefined) item.netRealReceive = 0;
                        this.tableData.push({
                            itemCode: item.itemCode,
                            itemName: item.itemName,
                            netRealReceive: item.netRealReceive,
                            finalRealReceive: { show: false, value: item.netRealReceive, showToptip: false },
                            finalStockoutCount: { show: true, value: 0 },
                            finalRejectQty: { show: true, value: 0 },
                            finalPackageDamaged: { show: true, value: 0 },
                            finalMildewPollute: { show: true, value: 0 },
                            itemLineNo: item.itemLineNo,
                            version: item.version,
                            orderNo: item.orderNo
                        });
                    });
                    this.totalForm.finalNetReceiveCount = finalNetReceiveCountNum;
                    this.closeOnClickModal = false;
                    data.images.forEach(item => {
                        this.imgArr.unshift(item);
                    });
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
            this.$nextTick(() => {
                this.initViewer();
            });
        },
        async inboundList () {
            const params = this.getListParams();
            await netTaskLists(params).then(res => {
                if (res) {
                    const data = res.data;
                    this.totalForm = data;
                    const inboundList = data.netTaskItems || [];
                    if (this.rowData.orderType === 'PO') {
                        inboundList.map(item => {
                            if (!item.netRejectQty) item.netRejectQty = 0;
                            if (!item.finalRejectQty) item.finalRejectQty = 0;
                            item.netStorageCount = { show: true, value: +item.netRejectQty + (+item.finalRejectQty) };
                        });
                    } else if (this.rowData.orderType === 'RI') {
                        inboundList.map(item => {
                            if (!item.planQty) item.planQty = 0;
                            item.netStorageCount = { show: true, value: +item.planQty };
                        });
                    }
                    this.tableData = [].concat(inboundList);
                    this.closeOnClickModal = false;
                    data.images.forEach(item => {
                        this.imgArr.unshift(item);
                    });
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
            this.$nextTick(() => {
                this.initViewer();
            });
        },
        async outboundList () {
            const params = this.getListParams();
            await netTaskLists(params).then(res => {
                if (res) {
                    const data = res.data;
                    this.totalForm = data;
                    const outboundList = data.netTaskItems || [];
                    outboundList.map(item => {
                        if (!item.netStorageCount) item.netStorageCount = 0;
                        item.netOutletsCount = { show: true, value: item.netStorageCount };
                    });
                    this.tableData = [].concat(outboundList);
                    this.closeOnClickModal = false;
                    data.images.forEach(item => {
                        this.imgArr.unshift(item);
                    });
                }
                this.fullLoading(false);
            }).catch(() => {
                this.fullLoading(false);
            });
            this.$nextTick(() => {
                this.initViewer();
            });
        },
        handleNetConfirm () {
            let flag = false;
            this.tableData.find(item => {
                if (item.netRealReceive.value < 0) {
                    item.netRealReceive.showToptip = true;
                    flag = true;
                    return true;
                }
            });
            if (flag) return false;
            const netTaskItemData = _.clone(this.tableData);
            netTaskItemData.map(item => {
                item.netRealReceive = item.netRealReceive.value;
                item.netStockoutCount = item.netStockoutCount.value;
                item.netRejectQty = item.netRejectQty.value;
            });
            const params = {
                netTaskItem: netTaskItemData,
                networkReceiptName: this.totalForm.networkReceiptName,
                netReceiveCount: this.netReceiveCount,
                netAbnormalCount: this.netAbnormalCount
            };
            this.$refs.formInfo.validate((valid) => {
                if (valid) {
                    this.fullLoading();
                    networkSign(params).then(res => {
                        this.fullLoading(false);
                        if (res && +res.code === 0) {
                            this.$message.success('网点签收确认成功');
                            this.$emit('saveOk');
                        }
                    }).catch(() => {
                        this.fullLoading(false);
                    });
                }
            });
        },
        handleFinalConfirm () {
            let flag = false;
            this.tableData.find(item => {
                if (item.finalRealReceive.value < 0) {
                    item.finalRealReceive.showToptip = true;
                    flag = true;
                    return true;
                }
            });
            if (flag) return false;
            const finalItemData = _.clone(this.tableData);
            finalItemData.map(item => {
                item.finalRealReceive = item.finalRealReceive.value;
                item.finalStockoutCount = item.finalStockoutCount.value;
                item.finalRejectQty = item.finalRejectQty.value;
                item.finalPackageDamaged = item.finalPackageDamaged.value;
                item.finalMildewPollute = item.finalMildewPollute.value;
            });
            const params = {
                netTaskItem: finalItemData,
                finalReceiptName: this.totalForm.finalReceiptName,
                finalReceiveCount: this.finalReceiveCount,
                finalAbnormalCount: this.finalAbnormalCount,
                addedServiceType: this.totalForm.addedServiceType
            };
            this.$refs.formInfo.validate((valid) => {
                if (valid) {
                    this.fullLoading();
                    finalSign(params).then(res => {
                        this.fullLoading(false);
                        if (res && +res.code === 0) {
                            this.$message.success('终端签收确认成功');
                            this.$emit('saveOk');
                        }
                    }).catch(() => {
                        this.fullLoading(false);
                    });
                }
            });
        },
        handleInboundConfirm () {
            let count = 0;
            const inboundItemData = _.clone(this.tableData);
            inboundItemData.map(item => {
                item.netStorageCount = item.netStorageCount.value;
                if (this.rowData.orderType === 'PO') {
                    if (item.netStorageCount > (item.finalRejectQty + item.netRejectQty)) {
                        count++;
                    }
                } else {
                    if (item.netStorageCount > item.planQty) {
                        count++;
                    }
                }
            });
            const params = {
                netTaskItem: inboundItemData,
                netInRemark: this.totalForm.netInRemark
            };
            if (count === 0) {
                this.fullLoading();
                netInfoIn(params).then(res => {
                    this.fullLoading(false);
                    if (res && +res.code === 0) {
                        this.$message.success('网点入库确认成功');
                        this.$emit('saveOk');
                    }
                }).catch(() => {
                    this.fullLoading(false);
                });
            } else {
                this.$message.warning('入库数量不能大于拒收数量');
            }
        },
        handleOutboundConfirm () {
            const outboundItemData = _.clone(this.tableData);
            outboundItemData.map(item => {
                item.netOutletsCount = item.netOutletsCount.value;
            });
            const params = {
                netTaskItem: outboundItemData,
                netOutRemark: this.totalForm.netOutRemark
            };
            this.fullLoading();
            netInfoOut(params).then(res => {
                this.fullLoading(false);
                if (res && +res.code === 0) {
                    this.$message.success('网点出库确认成功');
                    this.$emit('saveOk');
                }
            }).catch(() => {
                this.fullLoading(false);
            });
        },
        beforeClose () {
            this.$emit('update:signInShow', false);
        }
    },
    mounted () {
        this[data.typeAction[this.type]]();
    },
    computed: {
        ...mapState({ user: state => state.user }),
        // 网点签收正品(单行)
        netRealReceive (index) {
            return (index) => { // 正品=订单数量(单行)-短少-拒收
                var item = this.tableData[index];
                if (item.netStockoutCount.value === undefined) item.netStockoutCount.value = 0;
                if (item.netRejectQty.value === undefined) item.netRejectQty.value = 0;
                item.netRealReceive.value = item.planQty - item.netStockoutCount.value - item.netRejectQty.value;
                return item.netRealReceive.value;
            };
        },
        // 终端签收正品(单行)
        finalRealReceive (index) {
            return (index) => { // 正品=网点签收正品数量(单行)-（短少-拒收-污染-破损）(终端)
                var item = this.tableData[index];
                if (item.finalStockoutCount.value === undefined) item.finalStockoutCount.value = 0;
                if (item.finalRejectQty.value === undefined) item.finalRejectQty.value = 0;
                if (item.finalMildewPollute.value === undefined) item.finalMildewPollute.value = 0;
                if (item.finalPackageDamaged.value === undefined) item.finalPackageDamaged.value = 0;
                if (item.netRealReceive === undefined) item.netRealReceive = 0;
                item.finalRealReceive.value = item.netRealReceive - item.finalStockoutCount.value - item.finalRejectQty.value - item.finalMildewPollute.value - item.finalPackageDamaged.value;
                return item.finalRealReceive.value;
            };
        },
        // 网点签收实收(汇总)
        netReceiveCount () {
            let total = 0;
            this.tableData.forEach(item => { // 实收数量=正品
                var lineTotal = 0;
                lineTotal += Number(item.netRealReceive.value);
                item.netReceiveCount = lineTotal; // 单行实收
                total += lineTotal;
            });
            return total;
        },
        // 网点签收异常(汇总)
        netAbnormalCount () {
            let total = 0;
            this.tableData.forEach(item => { // 异常=拒收+短少
                var lineTotal = 0;
                lineTotal += Number(item.netRejectQty.value);
                lineTotal += Number(item.netStockoutCount.value);
                item.netAbnormalCount = lineTotal; // 单行异常
                total += lineTotal;
            });
            return total;
        },
        // 终端签收实收(汇总)
        finalReceiveCount () {
            let total = 0;
            this.tableData.forEach(item => { // 实收数量=正品+污染+破损
                var lineTotal = 0;
                lineTotal += Number(item.finalRealReceive.value);
                lineTotal += Number(item.finalMildewPollute.value);
                lineTotal += Number(item.finalPackageDamaged.value);
                item.finalReceiveCount = lineTotal; // 单行实收
                total += lineTotal;
            });
            return total;
        },
        // 终端签收异常(汇总)
        finalAbnormalCount () {
            let total = 0;
            this.tableData.forEach(item => { // 异常=拒收+短少+污染+破损
                var lineTotal = 0;
                lineTotal += Number(item.finalRejectQty.value);
                lineTotal += Number(item.finalStockoutCount.value);
                lineTotal += Number(item.finalMildewPollute.value);
                lineTotal += Number(item.finalPackageDamaged.value);
                item.finalAbnormalCount = lineTotal; // 单行异常
                total += lineTotal;
            });
            return total;
        }
    },
    beforeDestroy () {
    // this.viewer.destroy();
    }
};
</script>
<style lang="less">
@import "./branchSign.less";
</style>