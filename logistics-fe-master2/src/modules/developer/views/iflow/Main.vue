<template>
    <Paper>
        <div class="inbound-manage">
            <div>
                <!-- <el-button @click="handleButtonClick" >保存</el-button> -->
                <!-- <el-button type="primary" >创建审批</el-button> -->

                <iflow-button-group
                    :fdId="fdId"
                    :validates="validates"
                    :extraParams="extraParams"
                    fdTemplateId="supplierTransRate"
                    formInstanceId="12345"
                    subject="物流云测试031130730900196683776"
                />
            </div>

            <collapse-infos :infos="infos" :formData="otherData"></collapse-infos>

            <div class="tabs-table">
                <el-tabs v-model="activeName" class="detail-tab">
                    <el-tab-pane label="流程表格" name="processInfo">
                        <iflow-content
                            :fdId="fdId"
                            fdTemplateId="supplierTransRate"
                        />
                    </el-tab-pane>
                    <el-tab-pane label="费率明细" name="transRateInfo">
                        <detail-table :infoConfig="transRateInfo"
                                      :tableData="transRateList.totalData"
                                      :pageTotal="transRateList.pageTotal"
                                      :checkedNum="comCheckedNum"
                                      :isShowPagination="true"
                                      @selectChange="comSelectChange"
                                      @pageChange="pageChange"
                                      @sizeChange="sizeChange"
                                      ref="tablePage">
                            <div slot="page-module-btn">
                                <el-button type="primary" @click="addDetail">新 增</el-button>
                                <el-button type="primary">删 除</el-button>
                                <el-button type="primary">复 制</el-button>
                                <el-button type="primary" @click="changeExpirationDate">改 期</el-button>
                                <el-button type="primary">停 用</el-button>
                                <el-button type="primary">导 入</el-button>
                            </div>
                        </detail-table>
                    </el-tab-pane>
                    <el-tab-pane label="变更内容" name="changeInfo">
                        <detail-table :infoConfig="changeInfo" :tableData="changeInfoList" @selectChange="comSelectChange" :checkedNum="comCheckedNum" :isShowPagination="true">
                        </detail-table>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <el-dialog title="改期" :visible.sync="visiable" width="20%">
                <el-form :model="input" :rules="rules" ref="input">
                    <el-form-item label="失效日期" prop="expirationDate">
                        <el-date-picker v-model="input.expirationDate" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <span slot='footer' class='dialog-footer'>
                    <el-button @click="visiable = false">取 消</el-button>
                    <el-button type='primary' @click="confirmSave('input')">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </Paper>
</template>

<script>
import Paper from '@/components/core/paper/Paper';
import DetailTable from './components/detailTable/Main';
import CollapseInfos from './components/collapseInfos/Main.vue';
import { infos } from './infos.js';
import infoConfig1 from './transRateInfo.json';
import infoConfig3 from './changeInfo.json';
import infoConfig5 from './processApproveLogInfo.json';
import supplierTransAPI from '../../api/iflow-supplierTrans.js';

import IflowButtonGroup from '@/components/lots/iflow/iflowButtonGroup';
import IflowContent from '@/components/lots/iflow/iflowContent';

export default {
    components: { Paper,
        DetailTable,
        CollapseInfos,

        IflowButtonGroup,
        IflowContent
    },
    data() {
        return {
            fdId: '', // 本次费率ID，router提供

            approvalRecords: true,
            flag: '',

            changeNodeHandler: [], // 提交流程接口参数
            NnHandlerIds: {},

            processApproveLogInfo: infoConfig5, // 流转日志表格配置
            newProcessList: { // ????
                totalData: []
            },
            buttonList: [], // ???

            formInfo: {}, // 整个明细界面信息数据
            infos: infos, // 本页需用的明细界面信息健值
            otherData: {}, // 本页需用的明细界面信息数据

            activeName: 'processInfo', // tabs选中健值

            transRateInfo: infoConfig1, // 费率明细表格配置
            changeInfo: infoConfig3, // 变更内容表格配置
            warehouseRateList: [], // ???
            transRateList: { // 费率明细表格数据
                checkedData: [],
                totalData: [],
                pageNo: 1,
                pageSize: 10,
                pageTotal: 0
            },
            changeInfoList: [], // 变更内容表格数据

            comCheckedNum: 0,
            activeCode: {}, // ???
            rules: {
                expirationDate: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ]
            },
            input: {
                'expirationDate': ''
            },

            selected: [],
            visiable: false,
            expirationDate: '',

            extraParams: { // 状态按钮额外请求参数
                fdUrl: ''
            },
            validates: [{
                name: '提交',
                before: () => { window.console.log('提交 before'); },
                after: () => { window.console.log('提交 after'); }
            }, {
                name: '通过',
                before: () => { window.console.log('通过 before'); },
                after: () => { window.console.log('通过 after'); }
            }, {
                name: '撤回',
                before: () => { window.console.log('撤回 before'); },
                after: () => { window.console.log('撤回 after'); }
            }, {
                name: '驳回',
                before: () => { window.console.log('驳回 before'); },
                after: () => { window.console.log('驳回 after'); }
            }, {
                name: '废弃',
                before: () => { window.console.log('废弃 before'); },
                after: () => { window.console.log('废弃 after'); }
            }]
        };
    },
    methods: {
        comSelectChange(data) {
            this.selected = [].concat(data);
            this.comCheckedNum = this.selected.length;
        },
        pageChange(data) {
            this.transRateList.pageNo = data;
            this.loadDetails();
        },
        sizeChange(data) {
            this.transRateList.pageSize = data;
            this.loadDetails();
        },
        /* 刷新明细信息 */
        loadDetails() {
            if ((this.formInfo.id !== null &&
                this.formInfo.id !== undefined && this.formInfo.id !== '') &&
                (this.otherData.rateCode !== null &&
                    this.otherData.rateCode !== undefined && this.otherData.rateCode !== '')) {
                // 查询明细信息
                const params = {};
                params.transRateMipId = this.formInfo.id;
                params.rateCode = this.otherData.rateCode;
                params.pageNo = this.transRateList.pageNo;
                params.pageSize = this.transRateList.pageSize;
                supplierTransAPI.loadingDetails(params).then(res => {
                    if (res && res.data) {
                        const data = res.data;
                        this.transRateList.totalData = data.list;
                        this.transRateList.pageTotal = data.totalCount;
                    }
                }).catch(res => {
                    this.$message.error('数据加载失败');
                });
            }
        },
        /* 新增保存 */
        handleSave() {
            this.otherData.clearingObjectType = '2'; // 结算对象类型：2-供应商
            supplierTransAPI.transRateMipCreat(this.otherData).then(res => {
                if (res && res.data) {
                    const data = res.data;
                    const formDataObj = {};
                    this.formInfo = data;
                    this.infos[0].contents.map((info, index) => {
                        for (const form in data) {
                            if (info.prop === form) {
                                formDataObj[form] = data[form];
                            }
                        }
                    });
                    this.otherData = Object.assign({}, this.otherData, formDataObj);
                }
            }).catch(res => {
                this.$message.error('数据加载失败');
            });
        },
        /* 变更保存 */
        handleUpdate() {
            this.otherData.id = this.formInfo.id;
            supplierTransAPI.transRateMipUpdate(this.otherData).then(res => {
                if (res && res.data) {
                    const data = res.data;
                    const formDataObj = {};
                    this.formInfo = data;
                    this.infos[0].contents.map((info, index) => {
                        for (const form in data) {
                            if (info.prop === form) {
                                formDataObj[form] = data[form];
                            }
                        }
                    });
                    this.otherData = Object.assign({}, this.otherData, formDataObj);
                }
            }).catch(res => {
                this.$message.error('数据加载失败');
            });
        },
        /* 加载整个明细界面信息 */
        getDetail() {
            const id = this.$route.query.id;
            const obj = this.$route.query.obj;
            // 新增
            if ((id === null || id === undefined || id === '') &&
                (obj === null || obj === undefined || obj === '')) {

            }
            // 复制
            if ((id === null || id === undefined || id === '') &&
                (obj !== null && obj !== undefined && obj !== '') &&
                (obj.rateCode !== null && obj.rateCode !== undefined && obj.rateCode !== '')) {
                const formDataObj = {};
                this.infos[0].contents.map((info, index) => {
                    for (const form in obj) {
                        if (info.prop === form) {
                            formDataObj[info.prop] = obj[form];
                        }
                    }
                });
                formDataObj.rateCode = '';
                formDataObj.enabledFlag = '新增';
                this.otherData = Object.assign({}, this.otherData, formDataObj);
            }
            // 费率变更
            if ((id !== null && id !== undefined && id !== '') &&
                (obj === null || obj === undefined || obj === '')) {
                // 后台查询
                supplierTransAPI.transRateUpdate(id).then(res => {
                    if (res && res.data) {
                        const data = res.data;
                        const formDataObj = {};
                        this.formInfo = data;
                        this.infos[0].contents.map((info, index) => {
                            for (const form in data) {
                                if (info.prop === form) {
                                    formDataObj[form] = data[form];
                                }
                            }
                        });
                        this.otherData = Object.assign({}, this.otherData, formDataObj);
                        this.transRateList.totalData = [].concat(data.transRateItemMipPageResponse.list);
                        this.transRateList.pageTotal = data.transRateItemMipPageResponse.totalCount;
                    }
                }).catch(res => {
                    this.$message.error('数据加载失败');
                });
            }
        },
        /* 新增明细 */
        addDetail() {
            this.$refs.tablePage.$refs.table.addData();
        },
        /* 改期 */
        changeExpirationDate() {
            this.visiable = true;
        },
        confirmSave(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                } else {

                }
            });
        },

        handleButtonClick() {
            this.$route.query.id ? this.handleUpdate() : this.handleSave();
        }
    },
    created() {
        const id = this.$route.query.id;
        if (id === null || id === undefined || id === '') { // 新增
            this.infos[0].contents[12].editAble = true; // 备注
            this.infos[0].contents[13].editAble = false; // 变更原因
            this.otherData.changeReason = '新增';
        } else { // 费率变更
            this.infos[0].contents[12].editAble = false; // 备注
            this.infos[0].contents[13].editAble = true; // 变更原因
            this.otherData.changeReason = '';
        }
    },
    mounted() {
        const fdId = this.$route.query.fdId;
        this.fdId = fdId;
        this.extraParams = {
            fdUrl: window.location.href
        };
    }
};
</script>

<style scoped>

</style>
