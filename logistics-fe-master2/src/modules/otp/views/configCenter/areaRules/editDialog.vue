<template>
    <div>
        <approver-dialog ref='approverDialog' @saveClick='saveClick'></approver-dialog>
        <!-- 编辑弹框 -->
        <el-dialog
            :closeOnClickModal='closeOnClickModal'
            :before-close='dialogCancelBtn'
            title="编辑"
            :visible="true"
            width="60%"
            class='dialog areaRulesEditDialog'>
            <!-- 顶部信息 -->
            <el-form ref='editDialogTopForm' label-width='auto'>
                <el-row style='margin: 10px 0 15px'>
                    <el-col :span='6' style="margin-right: 30px;">
                        <el-form-item label='片区名称：'>
                            <div style="position: relative; padding-top: 6px;">
                                <el-input style='position: absolute; top: 0px' @input='areaNameInput' v-model.trim="row.areaName" clearable></el-input>
                                <el-tooltip class="item" v-model='row.areaNameShowTip' effect="dark" content="请输入片区名称" placement="top" :tabindex="-1">
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
                                    :params='paramsObj'
                                    :mValue='mValue'
                                    @getAdvanceValue='getAdvanceValue'></otp-advance>
                                <el-tooltip class="item" v-model='row.siteNameShowTip' effect="dark" content="请选择服务平台" placement="top" :tabindex="-1">
                                    <div style="height: 28px;">.</div>
                                </el-tooltip>
                            </div>

                        </el-form-item>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label='状态：'>
                            <div style='font-size: 12px;'>停用</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div class="table-content">
                <!-- 上表格 -->
                <el-table ref="moduleTable"
                    border
                    :data="areaCharge"
                    tooltip-effect='dark'
                    @row-dblclick='topRowDblclick'>

                    <el-table-column v-for="(item, index) in dialogColumns"
                                    :key='index' :prop='item.prop' :label='item.label'
                                    :min-width="item.minWidth ? item.minWidth : ''">

                        <template slot-scope="scope">

                            <div v-if="item.prop === 'chargeName'" style="position: relative;">
                                <div v-if='scope.row.newData'>
                                    <div style="position: absolute; width: 100%;">
                                        <el-input
                                            @focus='$event.target.blur()'
                                            style='position: absolute; top: 0px'
                                            @input='areaChargeInput($event, scope.row)'
                                            :value="scope.row['chargeName']"
                                            placeholder='请选择'
                                            clearable>
                                            <el-button slot="append" @click='showDialog(scope.row)' icon="el-icon-search"></el-button>
                                        </el-input>
                                    </div>
                                    <el-tooltip class="item" v-model='scope.row.showTip' effect="dark" content="请选择责任人" placement="top" :tabindex="-1">
                                        <div style="height: 28px;">.</div>
                                    </el-tooltip>
                                </div>
                                <div v-else>{{scope.row['chargeName']}}</div>
                            </div>
                            <div v-else>{{scope.row[item.prop]}}</div>

                        </template>

                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column fixed="right" label="操作" :width='100'>
                        <template slot-scope="scope">
                            <el-button @click.stop='dialogDelete(scope.$index, scope.row, "areaCharge")' type='text' v-if='!scope.row.id || originAreaCharge.length > 1'>删除</el-button>
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
                    :data="areaDestination"
                    @row-dblclick='bottomRowDblclick'
                    tooltip-effect='dark'>

                    <el-table-column v-for="(item, index) in dialogColumns2"
                                    :key='index' :prop='item.prop' :label='item.label'
                                    :min-width="item.minWidth ? item.minWidth : ''">

                        <template slot-scope="scope">

                            <div v-if="item.prop === 'destinationName'" style="position: relative;">
                                <div v-if='scope.row.newData'>
                                    <!-- <otp-all-address-select
                                        style='position: absolute;'
                                        v-if='addressShow'
                                        :address.sync='scope.row.mValue'
                                        @getAddress='getAddress'
                                        prop='destinationCode'
                                        :index='scope.$index'>
                                    </otp-all-address-select> -->
                                    <otp-all-address-select
                                        :disabled='false'
                                        style='position: absolute;'
                                        v-if='addressShow'
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
                                <div v-else>{{scope.row['destinationName']}}</div>
                            </div>
                            <div v-else>{{scope.row[item.prop]}}</div>

                        </template>

                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column fixed="right" label="操作" :width='100'>
                        <template slot-scope="scope">
                            <el-button @click.stop='dialogDelete(scope.$index, scope.row, "areaDestination")' type='text' v-if='!scope.row.id || originAreaDestination.length > 1'>删除</el-button>
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
import { areacharge, areadestination, areaSave, areachargeDelete, areadestinationDelete, tenantUserInfos } from '../../../api/areaRules';
import { mapState } from 'vuex';
import otpAdvance from '@/components/lots/otpAdvance';
// import otpAllAddressSelect from '@/components/lots/otpCascader/cascader';
import otpAllAddressSelect from '@/components/lots/otpCascader2';
import approverDialog from '../../../components/approverDialog';

export default {
    components: {
        otpAdvance,
        approverDialog,
        otpAllAddressSelect
    },
    props: {
        editDialogVisible: {
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
            closeOnClickModal: false,
            dialogLoading: {}, // 弹框loading实例
            row: {},
            addressShow: false,
            originAreaCharge: [], // 后台返回的原始数据 上表格
            originAreaDestination: [], // 后台返回的原始数据 下表格
            mValue: '',
            paramsObj: {
                name: '服务平台',
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
            getDataIntercept: [], // 获取数据的loading关闭时机的拦截判断
            areaCharge: [],
            dialogColumns: [
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
            areaDestination: [],
            dialogColumns2: [
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
                    target: '.areaRulesEditDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        getAdvanceValue(data) {
            this.row.siteName = data.siteName;
            this.row.siteCode = data.siteCode;
            this.showTipReset();
        },
        areaNameInput() {
            this.showTipReset();
        },
        topRowDblclick(row, column, event) {
            this.$set(row, 'newData', true);
        },
        bottomRowDblclick(row, column, event) {
            this.$set(row, 'newData', true);
        },
        // chargeName 变化触发
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
            row.updateTime = '';
            this.showTipReset();
        },
        areaChargeInput(value, row) {
            row.chargeName = '';
            row.chargeCode = '';
            row.updateTime = '';
            delete row.selectList;
            this.showTipReset();
        },
        showDialog(row) {
            this.$refs.approverDialog.showDialog(row);
        },
        // 地址组件变化触发
        // getAddress(codeObj, nameObj, index) {
        getAddress(labelName, index) {
            this.areaDestination[index].updateUserName = this.user.userName;
            this.areaDestination[index].userCode = this.user.userCode;
            // this.areaDestination[index].destinationCode = codeObj.destinationCode.join('-');
            this.areaDestination[index].destinationCode = this.areaDestination[index].destinationCodes.join('-');
            // this.areaDestination[index].destinationName = nameObj.labelName;
            this.areaDestination[index].destinationName = labelName.join(' / ');
            this.areaDestination[index].updateTime = '';
            this.showTipReset();
        },
        // 顶部表格 添加
        dialogTopAdd() {
            this.areaCharge.push(
                {
                    chargeName: '',
                    chargeCode: '',
                    updateUserName: this.user.userName,
                    userCode: this.user.userCode,
                    newData: true
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
                    updateUserName: this.user.userName,
                    userCode: this.user.userCode,
                    newData: true
                }
            );
            this.showTipReset();
        },
        // 保存按钮
        dialogSave() {
            if (this.row.areaName === '') {
                this.row.areaNameShowTip = true;
                return false;
            }
            if (this.row.siteName === '') {
                this.row.siteNameShowTip = true;
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
            this.saveData();
        },
        saveData() {
            const params = {};
            const areaCode = this.row.areaCode;
            const siteCode = this.row.siteCode;
            params.area = {
                areaName: this.row.areaName,
                siteName: this.row.siteName,
                areaStatus: this.row.areaStatus ? 1 : 0,
                areaCode,
                siteCode,
                id: this.row.id,
                version: this.row.version
            };
            params.areaCharge = [];
            params.areaDestination = [];

            this.areaCharge.forEach(item => {
                params.areaCharge.push({
                    chargeName: item.chargeName,
                    chargeCode: item.chargeCode,
                    updateUserName: item.updateUserName,
                    areaCode,
                    // chargeInfor: item.selectList,
                    version: item.version,
                    id: item.id
                });
            });
            this.areaDestination.forEach(item => {
                params.areaDestination.push({
                    destinationName: item.destinationName,
                    destinationCode: item.destinationCode,
                    updateUserName: item.updateUserName,
                    areaCode,
                    version: item.version,
                    id: item.id
                });
            });

            this.loading();
            areaSave(params).then(res => {
                if (res) {
                    this.$message({
                        type: 'success',
                        message: res.msg
                    });
                    this.closeModel();
                    this.$emit('getTableDataList'); // 让主页面表格刷新数据
                }
                this.loading(false);
            }).catch(() => {
                this.loading(false);
            });
        },
        showTipReset() {
            this.row.areaNameShowTip = false;
            this.row.siteNameShowTip = false;
            this.areaCharge.forEach(item => {
                item.showTip = false;
            });
            this.areaDestination.forEach(item => {
                item.showTip = false;
            });
        },
        // 编辑弹框删除按钮
        dialogDelete(index, row, table) {
            this.$confirm('你确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.id !== undefined) {
                    if (table === 'areaCharge') {
                        this.loading();
                        areachargeDelete([row]).then(res => {
                            if (res) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                });
                                this.showTipReset();
                                this[table].splice(index, 1);
                                this.originAreaCharge.splice(index, 1);
                            }
                            this.loading(false);
                        }).catch(() => {
                            this.loading(false);
                        });
                    } else {
                        this.loading();
                        areadestinationDelete([row]).then(res => {
                            if (res) {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                });
                                this.showTipReset();
                                this[table].splice(index, 1);
                                this.originAreaDestination.splice(index, 1);
                            }
                            this.loading(false);
                        }).catch(() => {
                            this.loading(false);
                        });
                    }
                } else {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.showTipReset();
                    this[table].splice(index, 1);
                }
            }).catch(() => {
            });
        },
        // 编辑弹框 关闭前的提示 验证 与 X 按钮 事件
        dialogCancelBtn() {
            this.$confirm('你确定要取消编辑吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.closeModel();
            }).catch(() => {
            });
        },
        closeModel() {
            this.$emit('update:editDialogVisible', false);
        },
        searchData() {
            this.row = Object.assign({}, this.dataRow);

            this.mValue = this.row.siteName;
            this.loading();
            this.closeOnClickModal = true;
            areacharge(this.row.areaCode).then(res => {
                if (res) {
                    this.originAreaCharge = [].concat(res.data.list);
                    res.data.list.forEach(item => {
                        tenantUserInfos({ queryParam: item.chargeCode }).then(res => {
                            if (res) {
                                item.selectList = res.data.list || [];
                            }
                        }).catch(() => {
                        });
                    });
                    this.areaCharge = res.data.list || [];
                    this.getDataIntercept.push(true);
                } else {
                    this.closeModel();
                }
            }).catch(() => {
                this.closeModel();
            });
            // 下表格数据
            areadestination(this.row.areaCode).then(res => {
                if (res) {
                    this.originAreaDestination = JSON.parse(JSON.stringify(res.data.list));
                    res.data.list.forEach(item => {
                        item.destinationCodes = [];
                        const code = item.destinationCode;
                        switch (code.length) {
                        case 3:
                            item.destinationCodes.push(code);
                            break;
                        case 5:
                            item.destinationCodes.push(code.slice(0, 3), code);
                            break;
                        case 7:
                            item.destinationCodes.push(code.slice(0, 3), code.slice(0, 5), code);
                            break;
                        case 10:
                            item.destinationCodes.push(code.slice(0, 3), code.slice(0, 5), code.slice(0, 7), code);
                            break;
                        default:
                            item.destinationCodes.push(code);
                            break;
                        }
                    });
                    this.areaDestination = res.data.list || [];
                    this.addressShow = true;
                    this.getDataIntercept.push(true);
                } else {
                    this.closeModel();
                }
            }).catch(() => {
                this.closeModel();
            });
        }
    },
    mounted () {
        this.searchData();
    },
    computed: {
        ...mapState({ user: state => state.user })
    },
    watch: {
        getDataIntercept(newVal) {
            if (newVal.length === 2) {
                this.loading(false);
                this.closeOnClickModal = false;
            }
        }
    }
};
</script>
