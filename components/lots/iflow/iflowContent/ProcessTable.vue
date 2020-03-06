<template>
    <div class="iflow-process-table">
        <div v-if="currentUserCode === N1UserCode">
            <div class="newProcess-head">
                <span class="newProcess-head-left">表格</span>
                <a
                    href="#"
                    class="newProcess-head-right"
                    v-if="!fdStatus || fdStatus === '草稿' || fdStatus === '驳回'"
                    @click.prevent="handlePreHandlers"
                >取上次审批人</a>
            </div>
            <el-table
                border
                :highlight-current-row="false"
                ref="processTable"
                :data="processListData"
                :row-class-name="tableRowClassName"
            >
                <el-table-column
                    prop="nodeId"
                    label="序号"
                    align="center"
                    width="150"
                ></el-table-column>
                <el-table-column
                    prop="nodeName"
                    label="节点"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="handlerIds"
                    label="处理人"
                    align="center"
                    width="500">
                    <template slot-scope="{row}">
                        <div
                            class="choce-approve"
                            v-if="row.nodeId !== 'N1' && row.nodeId !== 'N2' && (!fdStatus || fdStatus === '草稿' || fdStatus === '驳回')"
                        >
                            <div>
                                <span class="no-person" v-if="!handlerIds[row.nodeId]">请选择处理人</span>
                                <span class="handler-name" v-for="(item, index) in handlerIds[row.nodeId]"
                                        :key="index">{{item.userName}}
                                    <span class="handler-del" @click="delHandler(row, index)">x</span>
                                </span>
                            </div>
                            <i class="font_family icon-iflow-nanshi" @click="showDialog(row.nodeId)"></i>
                        </div>
                        <div v-else>{{ row.handlerNames }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="processType"
                    label="类型"
                    align="center"
                ></el-table-column>
            </el-table>
        </div>
        <div v-else >
            <div class="newProcess-head">
                <span class="newProcess-head-left">审批记录</span>
            </div>

            <el-steps :active="activeStep" process-status="process">
                <el-step
                    v-for="(aItem, index) in approvalRecords"
                    :key="index"
                    :title="`${aItem.nodeId}.${aItem.nodeName}[${aItem.processType}]`"
                    :description="aItem.handlerNames"
                    :icon="aItem.icon"
                    :status="aItem.status"
                    :class="aItem.icon === 'el-icon-delete-solid' ? 'delete-step' : ''"
                ></el-step>
            </el-steps>
        </div>

        <ApproverDialog ref='approverDialog' @saveClick="saveClick"></ApproverDialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getProcessList, getPrevProcessApprovers } from '../api';
import ApproverDialog from '@/components/lots/approverDialog/Index';

export default {
    components: { ApproverDialog },
    props: ['fdId', 'fdTemplateId'],
    data() {
        return {
            handlerIds: {}, // 已选处理人
            processListData: [], // 表格数据
            currentNodeId: '', // 流程当前节点
            N1UserCode: '', // 草稿人usercode
            activeStep: 0,
            approvalRecords: []
        };
    },
    computed: {
        ...mapState({
            fdStatus: state => state.fdStatus, // 当前流程状态
            fdStatusSetTime: state => state.fdStatusSetTime
        }),
        // 当前用户usercode
        currentUserCode() {
            return this.$store.state.user.userCode;
        }
    },
    methods: {
        delHandler(row, index) {
            this.currentNodeId = row.nodeId;
            this.handlerIds[this.currentNodeId].splice(index, 1);
            const nodeHandlers = this.translateIds(this.handlerIds);
            this.$store.commit('setNodeHandlers', nodeHandlers);
        },
        showDialog(nodeId) {
            this.currentNodeId = nodeId;
            this.$refs.approverDialog.showDialog(true);
        },
        saveClick(data) {
            if (this.currentNodeId !== '') {
                this.$set(this.handlerIds, this.currentNodeId, data);
                const nodeHandlers = this.translateIds(this.handlerIds);
                this.$store.commit('setNodeHandlers', nodeHandlers);
            }
        },
        translateIds(data) {
            return Object.keys(data).map(key => {
                const userCodes = [];
                data[key].forEach(item => {
                    userCodes.push(item.userCode);
                });
                return {
                    handlerIds: userCodes.join(';'),
                    nodeId: key
                };
            });
        },
        getProcessListData() {
            // 获取流程表格
            getProcessList({
                'loginName': this.currentUserCode,
                'fdId': this.fdId
            }).then(res => {
                if (res.code === '0') {
                    const mustSelectedNodeIds = [];
                    this.processListData = res.data.processNodes;
                    this.setApprovalRecords();

                    this.processListData.forEach(item => {
                        if (item.nodeId === 'N1') {
                            this.N1UserCode = item.handlerIds;
                        } else if (item.nodeId !== 'N1' && item.nodeId !== 'N2') {
                            if (item.handlerIds) {
                                const userCodeArr = item.handlerIds.split(';');
                                const userNameArr = item.handlerNames.split(';');
                                const handlerArr = userCodeArr.map((userCode, index) => {
                                    return {
                                        userCode,
                                        userName: userNameArr[index]
                                    };
                                });
                                this.$set(this.handlerIds, item.nodeId, handlerArr);
                            }
                        }

                        if (item.mustSelected) {
                            mustSelectedNodeIds.push(item.nodeId);
                        }
                    });
                    const nodeHandlers = this.translateIds(this.handlerIds);
                    this.$store.commit('setMustSelectedNodeIds', mustSelectedNodeIds);
                    this.$store.commit('setNodeHandlers', nodeHandlers);
                }
            });
        },
        // 判断正进行的流程高亮
        tableRowClassName({ row, index }) {
            if (row.currentNode) {
                return 'current-row';
            }
            return '';
        },
        handlePreHandlers() {
            getPrevProcessApprovers({
                fdTemplateId: this.fdTemplateId,
                loginName: this.currentUserCode
            }).then(res => {
                if (res.code === '0') {
                    if (res.data.nodeHandlersList && res.data.nodeHandlersList.length > 0) {
                        res.data.nodeHandlersList.forEach(li => {
                            let handlerArr = [];
                            const nodeId = li.nodeId;
                            if (li.handlerIds) {
                                const userCodeArr = li.handlerIds.split(';');
                                const userNameArr = li.handlerNames.split(';');
                                handlerArr = userCodeArr.map((userCode, index) => {
                                    return {
                                        userCode,
                                        userName: userNameArr[index]
                                    };
                                });
                            }
                            this.$set(this.handlerIds, nodeId, handlerArr);
                        });
                        const nodeHandlers = this.translateIds(this.handlerIds);
                        this.$store.commit('setNodeHandlers', nodeHandlers);
                    }
                }
            });
        },
        setApprovalRecords() {
            let hasPassFlag = false;
            const steps = this.processListData.map((item, index) => {
                const aItem = {
                    ...item
                };
                if (!aItem.currentNode && !aItem.abandon) {
                    if (hasPassFlag) {
                        aItem.icon = 'icon-iflow-weikaishijiedian1';
                    } else {
                        aItem.icon = 'el-icon-success';
                    }
                } else if (aItem.currentNode && !aItem.abandon) {
                    aItem.icon = 'el-icon-time';
                    this.activeStep = index;
                    hasPassFlag = true;
                } else if (!aItem.currentNode && aItem.abandon) {
                    aItem.icon = 'el-icon-delete-solid';
                    this.activeStep = index;
                    hasPassFlag = true;
                }
                return aItem;
            });

            if (!hasPassFlag) {
                this.activeStep = steps.length;
            }

            this.approvalRecords = steps;
        }
    },
    mounted() {
        if (this.fdId) {
            this.getProcessListData();
        }
    },
    watch: {
        fdId: function (val, oldVal) {
            if (val && val !== oldVal) {
                this.getProcessListData();
            }
        },
        fdStatusSetTime: function (val, oldVal) {
            if (val !== oldVal && this.fdId) {
                this.getProcessListData();
            }
        }
    }
};
</script>
<style lang="less">
.iflow-process-table {
    .newProcess-head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .newProcess-head-left {
            font-size: 15px;
            font-weight:bold;
        }
        .newProcess-head-right {
            font-size: 12px;
            color: #2d8cf0;
        }
    }
    .choce-approve {
        display: flex;
        justify-content: space-between;
            .handler-name {
                background: #EDFAFA;
                border: 1px solid #2D8CF0;
                font-size: 12px;
                padding: 4px;
                margin-right: 15px;
            }
            .handler-del {
                width: 14px;
                color: #ccc;
                padding-left: 10px;
                cursor: pointer;
            }
        .no-person{
            color: #999999;
        }
        i {
            line-height: 34px;
        }
    }
    .el-step__icon-inner.icon-iflow-weikaishijiedian1 {
        font-size: 25px;
    }
    .delete-step {
        .el-step__head.is-process, .el-step__title.is-process, .el-step__description.is-process {
            color: rgb(255, 99, 33);
        }
    }
}
</style>
