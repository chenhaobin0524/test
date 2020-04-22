<template>
    <div>
        <!-- 查看弹框 -->
        <el-dialog
            title="详情"
            :before-close='closeModel'
            :visible="true"
            width="60%"
            class='dialog areaRulesdetailDialog'>
            <!-- 顶部信息 -->
            <el-row style='margin: 10px 0 15px'>
                <el-col :span='6'>
                    <span style="color: #aaa">片区名称：</span>
                    <span>{{dataRow.areaName}}</span>
                </el-col>
                <el-col :span='6'>
                    <span style="color: #aaa">服务平台：</span>
                    <span>{{dataRow.siteName}}</span>
                </el-col>
                <el-col :span='6'>
                    <span style="color: #aaa">片区状态：</span>
                    <span>启用</span>
                </el-col>
            </el-row>
            <div class="table-content">
                <!-- 上表格 -->
                <el-table ref="moduleTable" style='margin-bottom: 40px;'
                    border
                    :data="areacharge"
                    tooltip-effect='dark'>

                    <el-table-column v-for="(item, index) in areachargeColumns"
                                    :key='index' :prop='item.prop' :label='item.label'
                                    :min-width="item.minWidth ? item.minWidth : ''" :show-overflow-tooltip="true">

                        <template slot-scope="scope">
                            <div>{{scope.row[item.prop]}}</div>
                        </template>

                    </el-table-column>

                </el-table>
            </div>
            <div class="table-content">
                <!-- 下表格 -->
                <el-table ref="moduleTable" style='margin-bottom: 30px;'
                    border
                    :data="areadestination"
                    tooltip-effect='dark'>

                    <el-table-column v-for="(item, index) in areadestinationColumns"
                                    :key='index' :prop='item.prop' :label='item.label'
                                    :min-width="item.minWidth ? item.minWidth : ''" :show-overflow-tooltip="true">

                        <template slot-scope="scope">
                            <div>{{scope.row[item.prop]}}</div>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeModel">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { areacharge, areadestination } from '../../../api/areaRules';
export default {
    props: {
        detailDialogVisible: {
            type: Boolean,
            default() {
                return false;
            }
        },
        dataRow: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            getDataIntercept: [], // 获取数据的loading关闭时机的拦截判断
            dialogLoading: {}, // 弹框loading实例
            areacharge: [],
            areachargeColumns: [
                {
                    prop: 'chargeName',
                    label: '责任人',
                    minWidth: ''
                },
                {
                    prop: 'chargeCode',
                    label: '登录名',
                    minWidth: ''
                },
                {
                    prop: 'updateUserName',
                    label: '修改人',
                    minWidth: ''
                },
                {
                    prop: 'updateTime',
                    label: '修改时间',
                    minWidth: ''
                }
            ],
            areadestination: [],
            areadestinationColumns: [
                {
                    prop: 'destinationName',
                    label: '目的区县',
                    minWidth: ''
                },
                {
                    prop: 'destinationCode',
                    label: '目的区县编码',
                    minWidth: ''
                },
                {
                    prop: 'updateUserName',
                    label: '修改人',
                    minWidth: ''
                },
                {
                    prop: 'updateTime',
                    label: '修改时间',
                    minWidth: ''
                }
            ]
        };
    },
    methods: {
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.areaRulesdetailDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        closeModel() {
            this.$emit('update:detailDialogVisible', false);
        },
        detailData() {
            this.loading();
            // 上表格数据
            areacharge(this.dataRow.areaCode).then(res => {
                if (res) {
                    this.areacharge = res.data.list || [];
                    this.getDataIntercept.push(true);
                }
            });
            // 下表格数据
            areadestination(this.dataRow.areaCode).then(res => {
                if (res) {
                    this.areadestination = res.data.list || [];
                    this.getDataIntercept.push(true);
                }
            });
        }
    },
    mounted () {
        this.detailData();
    },
    watch: {
        getDataIntercept(newVal) {
            if (newVal.length === 2) {
                this.loading(false);
            }
        }
    }
};
</script>
