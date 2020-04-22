<template>
    <div class="order_list-fix_address">
        <el-dialog title="地址修改" :visible.sync="viewList" width="800px" @close="closeDialog" v-if="viewList">
            <div class="header">
                <h2>客户订单号：{{viewsListForm.customerOrderNo}}</h2>
                <el-row :gutter="5">
                    <el-col :span="12">
                        客户：<strong>{{viewsListForm.customerName}}</strong>
                    </el-col>
                    <el-col :span="12">
                        服务平台：<strong>{{viewsListForm.siteName}}</strong>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="12">
                        来源系统：<strong>{{viewsListForm.sourceSystemName}}</strong>
                    </el-col>
                    <el-col :span="12">
                        上游下单时间：<strong>{{viewsListForm.upperOrderTime}}</strong>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="24" v-if="showSendAddress">
                        上游发货地址：<strong>{{viewsListForm.senderDetaiAddr}}</strong>
                    </el-col>
                    <el-col :span="24" v-if="showReceiveAddress">
                        上游收货地址：<strong>{{viewsListForm.receiverDetailAddr}}</strong>
                    </el-col>
                </el-row>
            </div>
            <el-form :model="addressForm" :rules="rules" ref="addressForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="发货地址" v-if="showSendAddress">
                    <el-row :gutter="5">
                        <el-col :span="11">
                            <el-form-item prop="sendAddress">
                                <addressSelect
                                    v-model="addressForm.sendAddress"
                                    :minLayers="4"
                                    placeholder="省 / 市 / 区 / 街道"
                                    :basicProps="addressConfig"
                                ></addressSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item prop="sendAddressDetail">
                                <el-input placeholder="详细地址" v-model="addressForm.sendAddressDetail"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="收货地址" v-if="showReceiveAddress">
                    <el-row :gutter="5">
                        <el-col :span="11">
                            <el-form-item prop="receiveAddress">
                                <addressSelect
                                    v-model="addressForm.receiveAddress"
                                    :minLayers="4"
                                    placeholder="省 / 市 / 区 / 街道"
                                    :basicProps="addressConfig"
                                ></addressSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item prop="receiveAddressDetail">
                                <el-input placeholder="详细地址" v-model="addressForm.receiveAddressDetail"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewList = false">取消</el-button>
                <Throttle delay="500">
                    <el-button type="primary" @click="submit" v-loading="btnLoading">确定</el-button>
                </Throttle>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Throttle from '@/components/lots/debounce/Debounce';
import addressSelect from '@/components/lots/otpCascader2';
import { updateCustomerAddress } from '../../../../api/orderCenter';

export default {
    components: { Throttle, addressSelect },
    data() {
        return {
            viewList: false,
            btnLoading: false,
            showReceiveAddress: false,
            showSendAddress: false,
            // 视图建单
            viewsListForm: {},
            addressForm: {
                sendAddress: [],
                sendAddressDetail: '',
                receiveAddress: [],
                receiveAddressDetail: ''
            },
            addressConfig: {
                checkStrictly: false
            },
            rules: {
                sendAddress: [
                    { required: true, message: '请选择发货地址', trigger: 'change' }
                ],
                receiveAddress: [
                    { required: true, message: '请选择收货地址', trigger: 'change' }
                ]
            }
        };
    },
    methods: {
        show(status = true, order) {
            if (order) this.viewsListForm = { ...order };
            if (order.deliveryType === 'YS') {
                this.showSendAddress = true;
                this.showReceiveAddress = true;
            } else if (order.deliveryType !== 'ZT') {
                if (order.inOutType === 'IN') {
                    this.showSendAddress = true;
                } else if (order.inOutType === 'OUT') {
                    this.showReceiveAddress = true;
                }
            }
            this.viewList = status;
        },
        submit() {
            this.btnLoading = true;
            this.$refs['addressForm'].validate(async (valid) => {
                if (valid) {
                    const param = {
                        orderNo: this.viewsListForm.orderNo,
                        version: this.viewsListForm.version
                    };
                    if (this.showSendAddress) {
                        param.senderProvinceCode = this.addressForm.sendAddress[0];
                        param.senderCityCode = this.addressForm.sendAddress[1];
                        param.senderDistrictCode = this.addressForm.sendAddress[2];
                        param.senderTownCode = this.addressForm.sendAddress[3];
                        param.senderDetailAddr = this.addressForm.sendAddressDetail;
                    }

                    if (this.showReceiveAddress) {
                        param.receiverProvinceCode = this.addressForm.receiveAddress[0];
                        param.receiverCityCode = this.addressForm.receiveAddress[1];
                        param.receiverDistrictCode = this.addressForm.receiveAddress[2];
                        param.receiverTownCode = this.addressForm.receiveAddress[3];
                        param.receiverDetailAddr = this.addressForm.receiveAddressDetail;
                    }
                    const res = await updateCustomerAddress(param);
                    if (res && res.code === '0') {
                        this.$message.success('地址修改成功');
                        this.viewList = false;
                    }
                }
                this.btnLoading = false;
            });
        },
        closeDialog() {
            this.$refs['addressForm'].resetFields();
            this.showSendAddress = false;
            this.showReceiveAddress = false;
        }
    }
};
</script>

<style lang="less">
    .order_list-fix_address {
        .el-form-item__content {
            .el-input-group {
                vertical-align: middle;
            }
        }
        .header{
            margin: 0 40px 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ececec;
            height: auto;
            /deep/ .el-row {
                line-height: 2;
            }
        }
    }
</style>