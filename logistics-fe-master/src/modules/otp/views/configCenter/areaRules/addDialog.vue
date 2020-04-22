<template>
    <div>
        <approver-dialog ref='approverDialog' @saveClick='saveClick'></approver-dialog>
        <!-- 新增弹框 -->
        <el-dialog
            :closeOnClickModal='false'
            :before-close='dialogCancelBtn'
            title="新增"
            :visible="true"
            width="60%"
            class='dialog areaRulesAddDialog'>
            <!-- 顶部信息 -->
            <el-form ref='editDialogTopForm' label-width='auto'>
                <el-row style='margin: 10px 0 15px'>
                    <el-col :span='6' style="margin-right: 30px;">
                        <el-form-item label='片区名称：'>
                            <div style="position: relative; padding-top: 6px;">
                                <el-input style='position: absolute; top: 0px' placeholder="请输入片区名称" @input='showTipReset' v-model.trim="area.areaName" clearable></el-input>
                                <el-tooltip class="item" v-model='area.areaNameShowTip' effect="dark" content="请输入片区名称" placement="top" :tabindex="-1">
                                    <div style="height: 28px;">.</div>
                                </el-tooltip>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='服务平台：'>
                            <div style="position: relative; padding-top: 6px;">
                                <otp-advance
                                    style='position: absolute; top: 6px;'
                                    :params='params'
                                    @getAdvanceValue='getAdvanceValue'></otp-advance>
                                <el-tooltip class="item" v-model='area.siteNameShowTip' effect="dark" content="请选择服务平台" placement="top" :tabindex="-1">
                                    <div style="height: 28px;">.</div>
                                </el-tooltip>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='状态：'>
                            <div style='font-size: 12px;'>启用</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 上表格 -->
            <div class="table-content">
                <el-table ref="moduleTable"
                    border
                    :data="areaCharge">

                    <el-table-column v-for="(item, index) in areaChargeColumns"
                                    :key='index' :prop='item.prop' :label='item.label'
                                    :min-width="item.minWidth ? item.minWidth : ''">

                        <template slot-scope="scope">
                            <div v-if="item.prop === 'chargeName'" style="position: relative;">
                                <el-input
                                    @focus='$event.target.blur()'
                                    style='position: absolute; top: 0px'
                                    @input='areaChargeInput($event, scope.row)'
                                    :value="scope.row['chargeName']"
                                    placeholder='请选择'
                                    clearable>
                                    <el-button slot="append" @click='showDialog(scope.row)' icon="el-icon-search"></el-button>
                                </el-input>

                                <el-tooltip class="item" v-model='scope.row.showTip' effect="dark" content="请选择责任人" placement="top" :tabindex="-1">
                                    <div style="height: 28px;">.</div>
                                </el-tooltip>
                            </div>
                            <div v-else>{{ scope.row[item.prop] }}</div>
                        </template>

                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column fixed="right" label="操作" :width='100'>
                        <template slot-scope="scope">
                            <el-button @click.stop='dialogDelete(scope.$index, "areaCharge")' type='text' v-if='areaCharge.length > 1'>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="addGroup">
                    <el-button type="text" icon="el-icon-plus" @click='dialogTopAdd'>添加明细</el-button>
                </div>
            </div>

            <div class="table-content">
                <!-- 下表格 -->
                <el-table ref="moduleTable"
                    border
                    :data="areaDestination">

                    <el-table-column v-for="(item, index) in areaDestinationColumns"
                                    :key='index' :prop='item.prop' :label='item.label'
                                    :min-width="item.minWidth ? item.minWidth : ''">

                        <template slot-scope="scope">
                            <div v-if="item.prop === 'destinationName'" style="position: relative;">
                                <!-- <otp-all-address-select style='position: absolute;' @getAddress='getAddress' prop='destinationCode' :index='scope.$index'></otp-all-address-select> -->
                                <otp-all-address-select
                                    :disabled='false'
                                    style='position: absolute;'
                                    v-model="scope.row.destinationCodes"
                                    @getAddress='(labelName) => {getAddress(labelName, scope.$index)}'
                                    :minLayers='3'
                                    :basicProps='{ checkStrictly: true}'
                                    >
                                </otp-all-address-select>
                                <el-tooltip class="item" v-model='scope.row.showTip' effect="dark" content="请选择目的区县" placement="top" :tabindex="-1">
                                    <div style="height: 28px;">.</div>
                                </el-tooltip>
                            </div>
                            <div v-else>{{ scope.row[item.prop] }}</div>
                        </template>

                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column fixed="right" label="操作" :width='100'>
                        <template slot-scope="scope">
                            <el-button @click.stop='dialogDelete(scope.$index, "areaDestination")' type='text' v-if='areaDestination.length > 1'>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="addGroup">
                    <el-button type="text" icon="el-icon-plus" @click='dialogBottomAdd'>添加明细</el-button>
                </div>
            </div>

            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="text" @click="dialogCancelBtn">取 消</el-button>
                <el-button type="primary" @click="dialogSave">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { areaSave } from '../../../api/areaRules';
import { mapState } from 'vuex';
import approverDialog from '../../../components/approverDialog';
import otpAdvance from '@/components/lots/otpAdvance';
// import otpAllAddressSelect from '@/components/lots/otpCascader/cascader';
import otpAllAddressSelect from '@/components/lots/otpCascader2';

export default {
    components: { approverDialog, otpAdvance, otpAllAddressSelect },
    props: {
        addDialogVisible: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data () {
        return {
            params: {
                name: '请选择',
                value: 'siteName',
                advanceLabel: '选择平台',
                advanceConfig: [
                    { prop: 'escoCompanyNameCn', 'value': '平台' },
                    { prop: 'escoCompanyNo', 'value': '编码' }
                ],
                tableConfig: [
                    { prop: 'escoCompanyNameCn', 'value': '平台名称' },
                    { prop: 'escoCompanyNo', 'value': '平台编码' }
                ],
                advanceUrl: '/searchPlatform',
                cbParams: [
                    'escoCompanyNo#siteCode',
                    'escoCompanyNameCn#siteName'
                ]
            },
            dialogLoading: {}, // 弹框loading实例
            area: {
                areaName: '',
                siteName: ''
            },
            areaCharge: [
                {
                    chargeName: '',
                    chargeCode: '',
                    updateUserName: '',
                    userCode: ''
                }
            ],
            areaChargeColumns: [
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
                }
            ],
            areaDestinationColumns: [
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
                }
            ],
            areaDestination: [
                {
                    destinationName: '',
                    destinationCode: '',
                    destinationCodes: [],
                    updateUserName: ''
                }
            ]
        };
    },
    methods: {
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.areaRulesAddDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        // 地址组件变化触发
        // getAddress(codeObj, nameObj, index) {
        getAddress(labelName, index) {
            this.areaDestination[index].updateUserName = this.user.userName;
            this.areaDestination[index].userCode = this.user.userCode;

            // this.areaDestination[index].destinationCode = codeObj.destinationCode.join('-'); // codeObj.destinationCode = ["111", "11101", "1110101", "1110101001"]
            // this.areaDestination[index].destinationName = nameObj.labelName; // '北京市 / 北京市辖区 / 东城区 / 东华门街道'
            this.areaDestination[index].destinationCode = this.areaDestination[index].destinationCodes.join('-');
            this.areaDestination[index].destinationName = labelName.join(' / ');
            this.showTipReset();
        },
        getAdvanceValue(data) {
            this.area.siteName = data.siteName;
            this.area.siteCode = data.siteCode;
            this.showTipReset();
        },
        // chargeName 变化触发
        areaChargeInput(value, row) {
            row.chargeName = '';
            row.chargeCode = '';
            delete row.selectList;
            this.showTipReset();
        },
        saveClick(data, row) {
            if (data[0]) {
                row.selectList = data;
                row.chargeName = data[0].userName;
                row.chargeCode = data[0].userCode;
            } else {
                delete row.selectList;
                row.chargeName = '';
                row.chargeCode = '';
            }
            row.updateUserName = this.user.userName;
            row.userCode = this.user.userCode;
            this.showTipReset();
        },
        showDialog(row) {
            this.$refs.approverDialog.showDialog(row);
        },
        // 保存按钮
        dialogSave() {
            if (this.area.areaName === '') {
                this.area.areaNameShowTip = true;
                return false;
            }
            if (this.area.siteName === '') {
                this.area.siteNameShowTip = true;
                return false;
            }
            const areaCharge = this.areaCharge;
            const areaDestination = this.areaDestination;
            for (var i = 0; i < areaCharge.length; i++) {
                if (areaCharge[i].chargeCode === '') {
                    areaCharge[i].showTip = true;
                    return false;
                }
            }
            for (var j = 0; j < areaDestination.length; j++) {
                if (areaDestination[j].destinationCode === '') {
                    areaDestination[j].showTip = true;
                    return false;
                }
            }
            // 为不影响交互  克隆一份 删除提示标记
            const area2 = Object.assign({}, this.area);
            const areaCharge2 = [].concat(this.areaCharge);
            const areaDestination2 = [].concat(this.areaDestination);

            delete area2.areaNameShowTip;
            delete area2.siteNameShowTip;
            areaCharge2.forEach(item => {
                delete item.showTip;
                delete item.selectList;
            });
            areaDestination2.forEach(item => {
                delete item.destinationCodes;
                delete item.showTip;
            });

            const params = { area: area2, areaCharge: areaCharge2, areaDestination: areaDestination2 };
            this.loading();
            areaSave(params).then(res => {
                if (res) {
                    this.$emit('update:addDialogVisible', false);
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    this.$emit('getTableDataList');
                }
                this.loading(false);
            }).catch(() => {
                this.loading(false);
            });
        },
        // 删除按钮
        dialogDelete(index, table) {
            this.showTipReset();
            this[table].splice(index, 1);
        },
        showTipReset() {
            this.area.areaNameShowTip = false;
            this.area.siteNameShowTip = false;
            this.areaCharge.forEach(item => {
                item.showTip = false;
            });
            this.areaDestination.forEach(item => {
                item.showTip = false;
            });
        },
        // 弹框关闭前的提示 验证 与  X 按钮 事件
        dialogCancelBtn() {
            this.$confirm('你确定要取消新增吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('update:addDialogVisible', false);
            }).catch(() => {
            });
        },
        // 顶部表格 添加
        dialogTopAdd() {
            this.areaCharge.push(
                {
                    chargeName: '',
                    chargeCode: '',
                    updateUserName: '',
                    userCode: ''
                }
            );
            this.showTipReset();
        },
        // 底部表格 添加
        dialogBottomAdd() {
            this.areaDestination.push(
                {
                    destinationName: '',
                    destinationCode: '',
                    destinationCodes: [],
                    updateUserName: '',
                    userCode: ''
                }
            );
            this.showTipReset();
        }
    },
    computed: {
        ...mapState({ user: state => state.user })
    }
};
</script>
