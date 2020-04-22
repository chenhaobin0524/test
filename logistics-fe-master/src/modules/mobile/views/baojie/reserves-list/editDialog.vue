<template>
    <!-- 编辑弹框 -->
    <el-dialog
        class='reservesListeditDialog'
        :closeOnClickModal='false'
        :before-close="beforeClose"
        title="编辑"
        :visible.sync="visible"
        width="70%">
        <el-row>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">车牌号：</span>
                    {{currentRow.vehicleNo}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">预约类型：</span>
                    {{currentRow.bookingTypeText}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">运输商：</span>
                    {{currentRow.carrierName}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">预约时间：</span>
                    {{currentRow.bookingTime}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">确认时间：</span>
                    {{currentRow.confirmTime}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">ST号：</span>
                    {{currentRow.crenelName123}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">发货方：</span>
                    {{currentRow.sendSite}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">收货DC：</span>
                    {{currentRow.receiveSite}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">收货客户：</span>
                    {{currentRow.customerSite}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">总体积m³：</span>
                    {{currentRow.totalVolume}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">总重量kg：</span>
                    {{currentRow.totalWeight}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">总数量：</span>
                    {{currentRow.numberOfUnits}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">预约ID：</span>
                    {{currentRow.bookingId}}
                </div>
            </el-col>
            <el-col :span='8'>
                <div class="labelContent">
                    <span class="label">分配垛口：</span>
                    <el-select v-model="currentRow.crenelCode" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in crenelOptions"
                            :key="index"
                            :label="item.crenelName"
                            :value="item.crenelCode">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="beforeClose">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import api from '@/modules/mobile/api/njdc/njdc.js';

export default {
    props: {
        getDataList: {
            type: Function,
            default: () => {
                return () => {};
            }
        },
        searchObj: {
            type: Object,
            default: () => {
                return {};
            }
        },
        currentRow: {
            type: Object,
            default: () => {
                return {};
            }
        },
        visible: {
            type: Boolean,
            default: () => {
                return false;
            }
        }
    },
    data() {
        return {
            dialogLoading: {}, // 弹框loading实例
            crenelOptions: []
        };
    },
    methods: {
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.reservesListeditDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        beforeClose() {
            this.$confirm('你确定要取消编辑吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('update:visible', false);
            }).catch(() => {
            });
        },
        confirm() {
            const params = {
                id: this.currentRow.id,
                version: this.currentRow.version,
                crenelCode: this.currentRow.crenelCode
            };
            this.crenelOptions.find(item => {
                if (params.crenelCode === item.crenelCode) {
                    params.crenelName = item.crenelName;
                    return true;
                }
            });
            api.crenelBookings(params).then(res => {
                if (res) {
                    this.$message.success('修改成功');
                    this.$emit('update:visible', false);
                    this.getDataList(this.searchObj);
                }
            }).catch(() => {
            });
        },
        // 获取垛口
        getCrenel() {
            this.loading();
            api.crenels({ pageSize: 10000, pageNo: 1, method: 'get' }).then(res => {
                this.loading(false);
                if (!res) {
                    this.$emit('update:visible', false);
                    return false;
                }
                this.crenelOptions = res.data.list.map(item => {
                    return {
                        crenelName: item.crenelName,
                        crenelCode: item.crenelCode
                    };
                });
            }).catch(() => {
                this.$emit('update:visible', false);
                this.loading(false);
            });
        }
    },
    mounted () {
        // 获取垛口
        this.getCrenel();
    }
};
</script>

<style lang="less">

</style>