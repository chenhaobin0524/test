<template>
    <div class="item-body">
        <div class="body-head">
            <div>{{item.label}}</div>
            <el-popover placement="bottom" trigger="hover">
                <div class="popover-css"  @click="sendFunc">发送系统消息</div>
                <div
                    class="popover-css"
                    :data-name="item.label"
                    @click="tomoreFn($event)">
                    更多
                </div>
                <div class="popover-css" @click="closeUp(item.prop)">关闭</div>
                <i slot="reference" class="el-icon-more i-style"></i>
            </el-popover>
        </div>
        <div class="item-content">
            <div class="message-list" v-for="(item, index) in meslist" :key="index" @click="tomesDetial(item)">
                <div class="msg-list">
                    <span class="redcolor" :style="{color: false ? '#999' : +item.noticeType === 2 ? '#F96C5' : '#00BCBF'}">
                        {{+item.noticeType === 2 ? '【预警】' : +item.noticeType === 1 ? '【公告】'  : +item.noticeType === 4 ? '【更新】' : '【维护】'}}
                    </span>
                    <span class="msg-text">{{item.title}}</span>
                </div>
                <div style="flex-shrink: 0;"><i class="el-icon-time time-icon-style"></i> {{item.updateTime}}</div>
            </div>
        </div>
        <sentMsgDialog ref="sentMsgDialog"></sentMsgDialog>
        <MsgDialog ref="msgdialog" :data="msgItem"></MsgDialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
// import moment from 'moment';
import { MessageLIST } from '../../../api/manaDesk.js';
import sentMsgDialog from '@/components/lots/sentMsgDialog/sentMsgDialog.vue';
import MsgDialog from '@/components/core/messageBox/MsgDialog.vue';
export default {
    props: {
        item: {
            type: Object
        }
    },
    data() {
        return {
            meslist: [],
            msgItem: null
        };
    },
    computed: {
        ...mapGetters(['applicationCode'])
    },
    mounted() {
        this.messagelistFn(); // 消息列表
    },
    components: { sentMsgDialog, MsgDialog },
    methods: {
        tomoreFn(e) {
            window.open(window.location.origin + '/mdm.html#/message-center?tab=message', '_blank');
        },
        closeUp(e) {
            this.$emit('closeUp', e);
        },
        sendFunc() {
            this.$refs.sentMsgDialog.handleVisible(true);
        },
        tomesDetial(item) {
            this.$refs.msgdialog.handleVisible(true);
            this.msgItem = item;
        },
        messagelistFn() {
            // const startlt = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');
            // const endgt = moment().format('YYYY-MM-DD HH:mm:ss');
            MessageLIST({
                noticeStatus: 1, // 0草稿,1发布
                pageNo: 1,
                pageSize: 6,
                applicationCode: this.applicationCode
            }).then(res => {
                if (+res.code === 0) {
                    this.meslist = res.data.list.slice(0, 6);
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        }
    }
};
</script>
<style lang="less">
.item-body {
    width: 100%;
    background:#fff;
    height: 100%;
    border-radius: 2px;
    display: flex;
    flex-flow: column;
    .body-head {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #F2F2F2;
        padding: 0 12px;
        font-size: 14px;
        color: #333;
        flex-shrink: 0;
    }
    .item-content{
        width: 100%;
        height: 100%;
        padding: 12px;
        box-sizing: border-box;
    }
}
.completion-quantity {
    height: 70px;
    width: 100%;
    background: #F9F9F9;
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    box-sizing: border-box;
    font-size: 12px;
    color: #333;
    margin-bottom: 12px;
    .completion-quantity-img {
        width: 38px;
        height: 38px;
        margin-right: 12px;
    }
    .completion-quantity-left {
        display:flex;
        align-items: center;
    }
    .completion-quantity-right{
        color: #474747;
        font-size: 20px;
    }
}
.message-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    font-size: 12px;
    cursor: pointer;
    &:hover {
        background: #ebfafa;
    }
    .msg-list {
        display:flex;
        align-items: center;
        width: 68%;
    }
    .msg-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .greencolor {
        color: #00BCBF;
        flex-shrink: 0;
    }
    .redcolor {
        color: #F96C5F;
        flex-shrink: 0;
    }
    .graycolor {
        color: #999;
        flex-shrink: 0;
    }
    .time-icon-style {
        margin-right: 2px;
        flex-shrink: 0;
    }
}
.el-popover {
    min-width: inherit;
    padding: 6px 0;
}
.popover-css {
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    min-width: inherit;
    width: 80px;
    text-align: center;
    cursor: pointer;
    &:hover {
        background: #ebfafa;
    }
}
.el-popper .popper__arrow {
    display: block;
}
.i-style {
    color: #D8D8D8;
}
</style>