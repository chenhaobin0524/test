<template>
    <el-dialog
        class="msg-dialog"
        title="详情"
        :visible.sync="visible"
        :append-to-body="true"
    >
        <div v-if="data">
            <div v-if="data.messageType !== undefined">
                <div class="content">
                    <div v-html="data.content"></div>
                    <a v-if="data.url" href="javascript:;" class="checkbtn" @click="handleDownload">查看附件</a>
                </div>
            </div>
            <div v-else>
                <!-- <h1 class="title">【更新】6月11日、6月13日.shop注册局系统维护通知</h1>
                <div class="time">OMS  2019-11-01  09:09:23</div>
                <div class="content">
                    维护内容：接到注册局的通知，注册局将于上述时间对后台系统进行维护升级。
                    维护影响：届时.cc/.tv/.name域名的注册、续费、信息修改和查询域名注册信息等操作，将会无法使用，在此期间会对您造成的影响如下：
                    1、您提交的注册（购买）、续费、转入、赎回、一口价域名业务在支付费用后状态为“处理中”，待维护结束后将变为正常的“成功”状态；
                    2、维护过程中您无法对域名注册信息进行修改，将提示修改失败。
                    如果您需要注册或管理以上业务操作，建议您避开该时间段，以免给您的业务造成影响。
                    由此给您带来的不便，我们表示歉意，敬请谅解。
                </div> -->
                <h1 class="title">{{ data.title }}</h1>
                <div class="time">{{ data.applicationName }}  {{ data.createTime }}</div>
                <div class="content" v-html="data.content"></div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        data: {
            default() {
                return {};
            }
        }
    },
    data: function() {
        return {
            visible: false
        };
    },
    methods: {
        handleVisible(flag = false) {
            this.visible = flag;
        },
        handleDownload() {
            window.open(this.data.url);
        }
    }
};
</script>
<style lang="less">
    .msg-dialog {
        line-height: initial;
        .el-dialog {
            min-height: 435px;
        }
        i.el-icon-close {
            width: auto;
            height: auto;
            line-height: initial;
            border-radius: 0;
            &:hover {
                background-color: transparent;
                color: #898C8C;
            }
            &:before {
                display: initial;
                text-align: center;
                font-size: initial;
            }
        }
        .el-dialog__body {
            padding: 20px;
            min-height: 380px;
            max-height: 480px;
            overflow-y: auto;
            box-sizing: border-box;
            .title {
                font-size: 16px;
                color: #252626;
                margin-top: 0;
                margin-bottom: 11px;
            }
            .time {
                font-size: 12px;
                color: #898C8C;
                margin-bottom: 20px;
            }
            .content {
                font-size: 12px;
                line-height: 26px;
            }
            .checkbtn {
                color: #00BCBF;
            }
        }
    }
</style>
