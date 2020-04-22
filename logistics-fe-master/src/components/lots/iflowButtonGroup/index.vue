<template>
    <div class="button-group">
        <el-button
            v-for="(item, index) in iFlow.buttons"
            :key="index"
            class="status-btn"
            type="primary"
            @click="handleDialogVisible(item)"
        >
            {{ item.name }}
        </el-button>

        <el-dialog
            :title="operationName"
            :visible.sync="approveDescDialog"
            width="300"
        >
            <el-form :model="approveForm" :rules="rules" ref="form" label-width="80px">
                <el-form-item label="处理意见" prop="approveDesc">
                    <el-input type="textarea" v-model="approveForm.approveDesc"
                                width="60%"></el-input>
                </el-form-item>
                <el-form-item label="驳回到" v-if="operationName === '驳回'">
                    <el-select v-model="currentNode" placeholder="请选择驳回节点">
                        <el-option v-for="(item, index) in approveForm.region"
                            :key="index"
                            :label="item.nodeName"
                            :value="item.nodeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="operationName === '驳回'">
                    <el-checkbox-group v-model="approveForm.type">
                        <el-checkbox label="重新提交后直接返回本节点"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="approveDescDialog = false">取 消</el-button>
                    <el-button type="primary" @click="approveDescSure">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getAvilableNodesAndOperation, createProcess,
    getProcessDetails, getProcessRefuseNode, getProcessStatus } from './api';

export default {
    props: {
        fdId: [String, Number],
        changeNodeHandler: {
            type: Array
        },
        fdTemplateId: {
            type: String
        },
        formInstanceId: {
            type: String
        },
        subject: {
            type: String
        },
        validates: {
            default() {
                return [];
            }
        }
    },
    data: function () {
        return {
            iFlow: { // 可操作的按钮
                fdId: '',
                fdTemplateId: '',
                fdStatus: '',
                fdTaskId: '',
                buttons: [],
                currentButton: {}
            },
            fdStatus: '', // 当前流程状态
            fdTaskId: '', // 当前状态按钮id
            operationType: '', // 当前状态按钮类型

            operationName: '', // 状态按钮弹出框标题
            approveDescDialog: false, // 状态按钮弹出框显示性
            approveForm: { // 状态按钮弹出框表单属性
                approveDesc: '', // 属性-处理意见
                region: [], // 属性-驳回选项
                type: true // 属性-是否返回本节点
            },
            currentNode: '', // 属性-驳回approveForm.region的已选项
            nodeInstanceId: '', // 状态是'驳回'时, getProcessRefuseNode接口参数
            rules: {
                approveDesc: [ // 处理意见校验
                    { required: true, message: '请输入处理意见', trigger: 'blur' },
                    { max: 256, message: '不能超过256个字符', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        ...mapState({
            nodeHandlers: state => state.nodeHandlers,
            mustSelectedNodeIds: state => state.mustSelectedNodeIds
        }),
        // 用户登录名
        loginName() {
            return this.$store.state.user.userCode;
        },
        customValidate() {
            return this.validates.filter(item => {
                return item.name === this.iFlow.currentButton.name;
            })[0];
        }
    },
    methods: {
        handleDialogVisible(button) {
            this.iFlow.currentButton = button;

            // 触发自定义的before函数
            if (this.customValidate) {
                if (typeof this.customValidate.before === 'function') {
                    if (this.customValidate.before() === false) {
                        return false;
                    }
                }
            }

            if (button.name === '撤回') {
                this.approveDescDialog = true;
                this.operationName = '撤回';
            } else if (button.name === '废弃') {
                this.approveDescDialog = true;
                this.operationName = '废弃';
            } else if (button.name === '驳回') {
                this.approveDescDialog = true;
                this.operationName = '驳回';
                getProcessDetails({
                    'fdId': this.fdId,
                    'loginName': this.loginName
                }).then(res => {
                    res.data.currNodes.forEach((item, index) => {
                        if (res.code === '0') {
                            this.nodeInstanceId = item.nodeInstanceId;
                            getProcessRefuseNode({
                                'fdId': this.fdId,
                                'loginName': this.loginName,
                                'nodeInstanceId': this.nodeInstanceId
                            }).then(res => {
                                this.approveForm.region = res.data;
                                if (res.data && res.data.length > 0) {
                                    this.currentNode = res.data[0].nodeId;
                                }
                            });
                        }
                    });
                });
            } else if (button.name === '通过') {
                this.approveDescDialog = true;
                this.operationName = '通过';
            } else if (button.name === '提交') {
                this.submitProcess();
            }
            this.operationType = button.operationType;
            this.fdTaskId = button.fdTaskId;
        },
        // 提交流程
        submitProcess() {
            const $msg = this.$message;
            const self = this;

            // 处理人校验
            let nodeHandlerFlag = true;
            if (this.mustSelectedNodeIds.length > 0) {
                if (this.nodeHandlers.length > 0) {
                    this.mustSelectedNodeIds.forEach(nodeId => {
                        const hasNodeIdArr = this.nodeHandlers.filter(item => {
                            return nodeId === item.nodeId;
                        });
                        if (hasNodeIdArr.length > 0) {
                            if (!hasNodeIdArr[0].handlerIds) {
                                nodeHandlerFlag = false;
                            }
                        } else {
                            nodeHandlerFlag = false;
                        }
                    });
                } else {
                    nodeHandlerFlag = false;
                }
            }
            if (!nodeHandlerFlag) {
                $msg.error(`请先选择处理人!`);
                return;
            }

            const params = {
                'loginName': this.loginName,
                'fdId': this.fdId,
                'fdTemplateId': this.fdTemplateId,
                'formParam': {
                    'formInstanceId': this.formInstanceId,
                    'subject': this.subject
                },
                'processParam': {
                    'activityType': 'startNode',
                    'changeNodeHandler': self.nodeHandlers,
                    'operationType': self.iFlow.currentButton.operationType,
                    'refusePassedToThisNode': false,
                    'taskId': self.iFlow.currentButton.fdTaskId
                }
            };

            createProcess(params).then(res => {
                if (res.code === '0') {
                    if (res.data && res.data.resultMsg) {
                        $msg.success(res.data.resultMsg);
                    }
                    this.iFlow.buttons = [];

                    // 请求成功后触发自定义after函数
                    if (this.customValidate) {
                        if (typeof this.customValidate.after === 'function') {
                            this.customValidate.after();
                        }
                    }
                    setTimeout(() => {
                        this.getAvilableNodesAndOperationData();
                        this.getProcessStatusData();
                    }, 3000);
                } else {
                    $msg.error('提交失败!');
                }
            });
        },
        approveDescSure() {
            const self = this;
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return false;
                }

                const params = {
                    'fdId': self.fdId,
                    'fdTemplateId': '1115883993821589504',
                    'processParam': {
                        'activityType': self.iFlow.currentButton.activityType,
                        'operationType': self.iFlow.currentButton.operationType,
                        'auditNote': self.approveForm.approveDesc,
                        'refusePassedToThisNode': true,
                        'taskId': self.iFlow.currentButton.fdTaskId
                    }
                };
                if (this.operationName === '驳回') {
                    const rejectParams = {
                        ...params.processParam,
                        'jumpToNodeId': self.currentNode,
                        'refusePassedToThisNode': self.approveForm.type
                    };
                    params.processParam = rejectParams;
                }
                createProcess(params).then(res => {
                    // 请求成功后触发自定义after函数
                    if (this.customValidate) {
                        if (typeof this.customValidate.after === 'function') {
                            this.customValidate.after();
                        }
                    }

                    if (res.code === '0' && res.data && res.data.resultMsg) {
                        this.$message.success(res.data.resultMsg);
                    }
                    setTimeout(() => {
                        this.getAvilableNodesAndOperationData();
                        this.getProcessStatusData();
                    }, 3000);
                });
                this.approveDescDialog = false;
            });
        },
        // 获取可用操作
        getAvilableNodesAndOperationData() {
            const self = this;
            getAvilableNodesAndOperation({
                'fdId': this.fdId,
                'loginName': this.loginName
            }).then(res => {
                self.iFlow.buttons = [];
                res.data.forEach((item1, index1) => {
                    item1.operationList.forEach((item2, index2) => {
                        const button = {};
                        button.operationType = item2.operationType;
                        button.name = item2.name;
                        button.fdTaskId = item1.fdTaskId;
                        button.activityType = item1.fdActivityType;
                        self.iFlow.buttons.push(button);
                    });
                });
            });
        },
        getProcessStatusData() {
            getProcessStatus({
                'fdId': this.fdId
            }).then(res => {
                let fdStatus;
                if (res.code === '0' && res.data === null) {
                    fdStatus = '';
                } else {
                    fdStatus = res.data.fdStatus;
                }
                this.$store.commit('setFdStatus', fdStatus);
            });
        },
        getOperationHooks(name) {
            return this.validates.filter(item => {
                return item.name === name;
            })[0];
        }
    },
    mounted() {
        if (this.fdId) {
            this.getAvilableNodesAndOperationData();
            this.getProcessStatusData();
        }
    },
    watch: {
        fdId: function (val, oldVal) {
            if (val && val !== oldVal) {
                this.getAvilableNodesAndOperationData();
                this.getProcessStatusData();
            }
        },
        approveDescDialog: function (val, oldVal) {
            if (val === false) {
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
            }
        }
    }
};
</script>
<style lang="less" scoped>
    .button-group {
        display: inline-block;
        .status-btn {
            margin-left: 5px;
        }
    }
</style>
