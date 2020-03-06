<template>
    <div class="message-seletor-wrap">
        <el-dropdown @visible-change="handleDropdown" @command="handleMessage" class="message-seletor">
            <el-badge :value="messageCount" :hidden="messageCount <= 0">
                <i class="auth-icon-message dropdown-img"></i>
            </el-badge>
            <el-dropdown-menu slot="dropdown" class="message-dropdown-menu">
                <el-tabs>
                    <el-tab-pane label="预警">
                        <div
                            class="dropdown-items-wrapper"
                            v-infinite-scroll="_getWarningList"
                            :infinite-scroll-disabled="warningScrollDisabled">
                            <el-dropdown-item
                                v-for="(item, index) in warningList"
                                :command="item"
                                :key="index"
                            >
                                <div class="title">
                                    <span :class="'tag warning-tag-' + item.messageType">【{{ warningType[item.messageType] }}】</span>
                                    <span>{{ item.title }}</span>
                                </div>
                                <div class="time">{{ item.createTime }}</div>
                            </el-dropdown-item>
                            <el-dropdown-item class="message-more" command="warning-more" v-if="warningLoading">
                                <div class="more">加载中...</div>
                            </el-dropdown-item>
                            <el-dropdown-item class="message-more" command="warning-more" v-if="!warningHasMore">
                                <div class="more">没有更多了</div>
                            </el-dropdown-item>
                        </div>
                        <!-- <el-dropdown-item class="message-more" command="warning-more">
                            <div class="more">查看更多</div>
                        </el-dropdown-item> -->
                    </el-tab-pane>
                    <el-tab-pane label="公告">
                        <div
                            class="dropdown-items-wrapper"
                            v-infinite-scroll="_getNoticeList"
                            :infinite-scroll-disabled="noticeScrollDisabled">
                            <el-dropdown-item
                                v-for="(item, index) in noticeList"
                                :command="item"
                                :key="index"
                            >
                                <div class="title">
                                    <span :class="'tag message-tag-' + item.noticeType">【{{ noticeType[item.noticeType] }}】</span>
                                    <span>{{ item.title }}</span>
                                </div>
                                <div class="time">{{ item.createTime }}</div>
                            </el-dropdown-item>
                            <el-dropdown-item class="message-more" command="message-more" v-if="noticeLoading">
                                <div class="more">加载中...</div>
                            </el-dropdown-item>
                            <el-dropdown-item class="message-more" command="message-more" v-if="!noticeHasMore">
                                <div class="more">没有更多了</div>
                            </el-dropdown-item>
                        </div>
                        <!-- <el-dropdown-item class="message-more" command="message-more">
                            <div class="more">查看更多</div>
                        </el-dropdown-item> -->
                    </el-tab-pane>
                </el-tabs>
            </el-dropdown-menu>
        </el-dropdown>
        <msg-dialog
            ref="msgDialog"
            :data="msgDialogData"
        />
    </div>
</template>
<script>
import MsgDialog from './MsgDialog';
import moment from 'moment';
import { getSelectMessage, getNotices } from './api';
export default {
    components: {
        MsgDialog
    },
    data() {
        return {
            warningList: [], // 预警列表
            warningType: ['', '消息', '预警'], // 预警类型
            noticeList: [], // 信息列表
            noticeType: ['', '公告', '预警', '维护', '更新'], // 信息类型
            msgDialogData: {}, // 信息弹窗数据
            warningListPage: 0,
            noticeListPage: 0,
            listPageSize: 10,
            warningListTotal: 0,
            noticeListTotal: 0,
            warningHasMore: true,
            noticeHasMore: true,
            warningScrollDisabled: true,
            noticeScrollDisabled: true,
            warningLoading: false,
            noticeLoading: false
        };
    },
    computed: {
        messageCount() {
            return this.warningListTotal;
        }
    },
    mounted() {
        this._getWarningList();
        this._getNoticeList();
    },
    methods: {
        _getWarningList() {
            if (!this.warningHasMore) {
                return;
            }
            const startlt = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
            const endgt = moment().format('YYYY-MM-DD HH:mm:ss');
            this.warningLoading = true;
            this.warningListPage += 1;
            getSelectMessage({
                startlt,
                endgt,
                pageNo: this.warningListPage,
                pageSize: this.listPageSize
            }).then(res => {
                if (res && res.data && res.code === '0') {
                    this.warningList = this.warningList.concat(res.data.list);
                    this.warningListTotal = res.data.totalCount;
                    if (res.data.list.length < this.listPageSize) {
                        this.warningHasMore = false;
                        this.warningLoading = false;
                    }
                }
            });
        },
        _getNoticeList() {
            if (!this.noticeHasMore) {
                return;
            }
            const startlt = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
            const endgt = null;
            this.noticeLoading = true;
            this.noticeListPage += 1;
            getNotices({
                startlt,
                endgt,
                noticeStatus: 1, // 0草稿,1发布
                pageNo: this.noticeListPage,
                pageSize: this.listPageSize,
                applicationCode: this.applicationCode
            }).then(res => {
                if (res && res.data && res.code === '0') {
                    this.noticeList = this.noticeList.concat(res.data.list);
                    this.noticeListTotal = res.data.totalCount;
                    if (res.data.list.length < this.listPageSize) {
                        this.noticeHasMore = false;
                        this.noticeLoading = false;
                    }
                }
            });
        },
        handleDropdown(flag) {
            this.noticeScrollDisabled = !flag;
            this.warningScrollDisabled = !flag;
        },
        handleMessage(command) {
            // const { origin } = window.location;
            // const path = '/mdm.html#/message-center';
            if (command !== 'message-more' && command !== 'warning-more') {
                this.msgDialogData = command;
                this.$refs.msgDialog.handleVisible(true);
            }
        }
    }
};
</script>
<style lang="less">
.message-dropdown-menu {
    max-height: 400px;
    overflow: auto;
    padding: 0;
    width: 370px;
    .el-tabs__header {
        margin-bottom: 0px;
        .el-tabs__nav {
            margin-left: 20px;
        }
        .el-tabs__active-bar {
            width: 28px;
        }
    }
    .dropdown-items-wrapper {
        max-height: 296px;
        overflow-y: auto;
    }
    .el-dropdown-menu__item {
        padding: 15px 15px 15px 10px;
        font-size: 13px;
        line-height: 22px;
        &.message-more {
            padding: 12px 10px;
            text-align: center;
        }
        .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .tag {
            color: #00BCBF;
            &.warning-tag-2, &.message-tag-2 {
                color: #F96C5F;
            }
        }
        .time {
            font-size: 12px;
            color: #898C8C;
            padding-left: 5px;
        }
    }
}
.message-seletor-wrap {
    display: flex;
    .message-seletor {
        cursor: pointer;
        margin-right: 12px;
        display: flex;
        align-items: center;
        .dropdown-img{
            font-size: 20px;
            margin-right: 8px;
            &.auth-icon-message {
                display: block;
            }
        }
        .el-badge__content.is-fixed {
            right: 17px;
        }
    }
}
</style>