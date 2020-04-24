<template>
    <div class="vehicle-detail">
        <div class="queuing-form">
            <el-form :inline="true" :model="currentItem" class="demo-form-inline" disabled label-width='60px'>
                <h3 class="info-title">排队信息</h3>
                <el-form-item label="排队类型">
                    <el-input v-model="currentItem.queueTypeName"></el-input>
                </el-form-item>
                <el-form-item label="排队状态">
                    <el-input v-model="currentItem.queueStatusName"></el-input>
                </el-form-item>
                <el-form-item label="排队车牌">
                    <el-input v-model="currentItem.carNo"></el-input>
                </el-form-item>
                <el-form-item label="系统车牌">
                    <el-input v-model="currentItem.planCarNo"></el-input>
                </el-form-item>
                <el-form-item label="发车单号">
                    <el-input v-model="currentItem.dispatchNo"></el-input>
                </el-form-item>
                <el-form-item label="司机电话">
                    <el-input v-model="currentItem.driverMobile"></el-input>
                </el-form-item>
                <el-form-item label="排队时间">
                    <el-input v-model="currentItem.createTime"></el-input>
                </el-form-item>
                <h3 class="info-title">组织信息</h3>
                <el-form-item label="分公司">
                    <el-input v-model="currentItem.companyName"></el-input>
                </el-form-item>
                <el-form-item label="服务平台">
                    <el-input v-model="currentItem.siteName"></el-input>
                </el-form-item>
                <el-form-item label="仓库编码">
                    <el-input v-model="currentItem.whCode"></el-input>
                </el-form-item>
                <el-form-item label="仓库名称">
                    <el-input v-model="currentItem.whName"></el-input>
                </el-form-item>
            </el-form>
            <div class="option-record">
                <h3 class="info-title">操作记录</h3>
                <p class="info-content-empty" v-if="recordList.length === 0">暂无操作记录</p>
                <div class="option-record-item" v-for="(record,id) in recordList" :key="id">
                    <div class="item-info">
                        <div class='option-record-icon'><i class="el-icon-user"></i></div>
                        <span class="item-name">{{record.updateUserCode}}</span>
                        <span>类型 {{record.flag === 1 ? '【优先】' : (record.flag === 0 ? '【完成】' : '【过号】')}}</span>
                        <span class="item-time">{{record.createTime}}</span>
                    </div>
                    <span class="item-remark">备注 {{record.content}}</span>
                </div>
            </div>
        </div>
        <div class="button-list">
            <el-button class="you" :disabled="currentItem.queueStatus === api.QUEUE_STATUS_FINISH" type="primary" @click="dialogSet('prior')">优 先</el-button>
            <el-button class="guo" :disabled="currentItem.queueStatus === api.QUEUE_STATUS_FINISH" type="primary" @click="dialogSet('over')">过 号</el-button>
            <el-button class="abnormal" :disabled="currentItem.queueStatus === api.QUEUE_STATUS_FINISH" type="primary" @click="dialogSet('error')">异常排队</el-button>
        </div>
        <el-dialog
            :title="dialogContent.title"
            :visible.sync="dialogVisible"
            width="30%">
            <span>{{dialogContent.label}}</span>
            <el-input type="textarea" v-model="dialogContent.value" rows="5"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="dataSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import api from '../../../api/ztb/arrive.js';

export default {
    data() {
        return {
            dialogVisible: false,
            dialogContent: {
                title: '优先',
                label: '优先原因',
                prop: 'remark',
                value: ''
            },
            api: api
        };
    },
    props: {
        currentItem: {
            type: Object,
            default () {
                return {};
            }
        },
        recordList: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    methods: {
        dialogSet(name) {
            this.dialogVisible = true;
            if (name === 'over') {
                this.dialogContent.title = '过号';
                this.dialogContent.label = '过号原因';
            } else if (name === 'error') {
                this.dialogContent.title = '完成';
                this.dialogContent.label = '完成原因';
            } else {
                this.dialogContent.title = '优先';
                this.dialogContent.label = '优先原因';
            }
        },
        dataSure() {
            this.dialogVisible = false;
            const params = {
                whCode: this.currentItem.whCode,
                code: this.currentItem.code,
                id: this.currentItem.id,
                remark: this.dialogContent.value,
                queueType: this.currentItem.queueType
            };
            if (this.dialogContent.title === '优先') {
                params.flag = '1';
            } else if (this.dialogContent.title === '过号') {
                params.flag = '-1';
            } else {
                params.flag = '0';
                params.finish = 'Y';
                params.artificialFinish = 1;
            }
            api.driverQueue(params).then(res => {
                if (res) {
                    this.$message.success('操作成功');
                    this.$emit('refresh');
                    this.dialogContent.value = '';
                }
            });
        },
        closeDialog() {
            this.dialogVisible = false;
            this.dialogContent.value = '';
        }
    }
};
</script>
<style lang='less'>
.vehicle-detail {
    padding: 0 10px;
    .info-title {
        font-size: 14px;
        font-weight: normal;
    }
    .el-form-item {
        margin-bottom: 0;
    }
    .queuing-form {
        overflow-y: auto;
        height: calc(~ '100vh - 165px');
    }
    .button-list {
        height: 48px;
        float: right;
        .el-button {
            margin-top: 10px;
        }
        .you {
            background-color: #00C0C1;
        }
        .guo {
            background-color: #FF8800;
            border-color: #FF8800;
        }
        .abnormal {
            background-color: #FF3300;
            border-color: #FF3300;
        }
    }
    .el-input.is-disabled .el-input__inner {
        color: rgba(0, 0, 0, 0.65);
    }
    .el-button--primary.is-disabled {
        color: #C3C7C7;
        cursor: not-allowed;
        background-image: none;
        background-color: #FFFFFF;
        border-color: #EBEEF5;
    }
    .option-record-item {
        border: 1px solid #f0f0f0;
        padding: 20px 20px 16px;
        border-radius: 3px;
        margin-bottom: 10px;
        font-size: 14px;
        color: rgba(0,0,0,.65);
        .item-remark {
            word-wrap: break-word;
        }
    }
    .option-record-icon {
        display: inline-block;
        height: 32px;
        width: 32px;
        background: #ccc;
        border-radius: 50%;
        text-align: center;
        color: #fff;
        font-size: 22px;
        margin-right: 10px;
        i {
            vertical-align: middle;
        }
    }
    .item-info {
        margin-bottom: 10px;
    }
    .item-time {
        float: right;
        line-height: 32px;
    }
    .item-name {
        margin-right: 10px;
    }
    .info-content-empty {
        font-size: 12px;
        color: #999;
        text-align: center;
    }
}
</style>
