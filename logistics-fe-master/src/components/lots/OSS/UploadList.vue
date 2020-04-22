<template>
    <el-dropdown-menu slot="dropdown" class="user-file-list">
        <el-button class="refresh" @click="refresh">刷 新</el-button>
        <el-tabs>
            <el-tab-pane label="用户文件列表">
                <div class="user-list">
                    <ul class='list'>
                        <li class="list-item">
                            <span class="file-name">文件名</span>
                            <span class="date">更新日期</span>
                        </li>
                    </ul>
                    <ul class="list-wrap" v-infinite-scroll="_getUserList" infinite-scroll-disabled="disabled" infinite-scroll-immediate="false">
                        <li v-for="item in filesList" :key="item.id" class="list-item">
                            <span class="file-name">
                                <el-tooltip effect="dark" :content=item.localFileName placement="top">
                                    <a :href="item.downUrl" class="down-btn" target="_blank">{{item.localFileName}}</a>
                                </el-tooltip>
                            </span>
                            <span class="update">{{item.createTime}}</span>
                        </li>
                        <p v-if="!filesList.length" class="load">暂无数据</p>
                        <template v-else>
                            <p v-if="loading" class="load">加载中...</p>
                            <p v-if="noMore" class="load">没有更多了</p>
                        </template>
                    </ul>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dropdown-menu>
</template>
<script>
import { getUserFileList } from './api';
export default {
    components: {
    },
    data() {
        return {
            visible: false,
            searchQuery: {
                pageSize: 10,
                pageNo: 0,
                asc: 'desc',
                orderBy: 'createTime'
            },
            filesList: [],
            totalPage: 0,
            loading: false,
            noMore: false
        };
    },
    mounted() {
        this._getUserList();
    },
    computed: {
        disabled () {
            return this.noMore;
        }
    },
    methods: {
        _getUserList() {
            this.loading = true;
            this.searchQuery.pageNo += 1;
            getUserFileList(this.searchQuery).then(res => {
                if (res.code === '0' && res.data && res.data.list) {
                    this.filesList = this.filesList.concat(res.data.list);
                    this.totalPage = res.data.totalPage;
                    if (this.searchQuery.pageNo >= this.totalPage) {
                        this.loading = false;
                        this.noMore = true;
                    }
                }
            });
        },
        refresh() {
            this.noMore = false;
            this.filesList = [];
            this.searchQuery.pageNo = 0;
            this._getUserList();
        }
    }
};
</script>
<style lang="less">
.user-file-list {
    position: relative;
    .el-tabs__header{
        margin: 0;
    }
    .user-list {
        text-align: center;
        font-size: 14px;
    }
    .list-item {
        height: 30px;
        padding-top: 10px;
        &:hover {
            background: rgba(75,194,197,0.2);
        }
    }
    .list {
        background: rgba(0,0,0,0.1);
    }
    .file-name,
    .down-btn {
        width: 300px;
        float: left;
        color: #666;
        margin-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .update,
    .date {
        min-width: 150px;
        float: right;
    }
    .update {
        font-size: 12px;
        color: #999;
        padding-top: 5px;
    }
    .date {
        color: #666;
    }
    .list-wrap {
        height: 200px;
        overflow-y: auto;
        .file-name {
            text-align: left;
        }
    }
    .down-btn {
        color: #666;
    }
    .el-tabs__nav {
        margin-left: 20px;
    }
    .refresh {
       position: absolute;
       right: 10px;
       margin-top: 5px;
       z-index: 2;
    }
}
</style>