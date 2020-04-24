<template>
    <footer>
        <section class="page-main">
            <span>
        <span class="pagedetail">{{$t('page.pagination.pThe')}}
            <span class="bg" v-if="!total">0</span>
            <span class="bg" v-else>{{startPage}}-{{endPage}}</span>&nbsp;{{$t('page.pagination.pOf')}}
            <span class="bg">{{total}}</span>&nbsp;{{$t('page.pagination.pRecord')}}</span>
            </span>
            <span class="page-right">
                <el-pagination @on-change="onCurrentPageChange" @on-page-size-change="onPageSizeChange" :page-size="pageSize"
                    :currentPage="currentPage" :page-size-opts="pageSizeOpts" :total="total" :show-elevator="showElevator"
                    :show-sizer="showSizer" placement="top">
                </el-pagination>
            </span>
        </section>
    </footer>
</template>
<style lang="less" scoped>
.page-main {
    padding: 12px 20px 16px 20px;
    min-width: 400px;

    .pagedetail {
        font: 400 14px/26px "微软雅黑";
    }

    .page-right {
        float: right;
        padding-right: 0;
    }

    .go {
        height: 28px;
        margin-left: 12px;
        text-align: center;
        margin-top: 2px;
    }

    .el-button--small {
        padding: 7px 4px;
    }
}

</style>
<script>
export default {
    name: 'mPagination',
    data() {
        return {
            currentPage: 1
        };
    },
    props: {
        showElevator: {
            type: Boolean,
            default: true
        },
        showSizer: {
            type: Boolean,
            default: true
        },
        pageSize: {
            type: Number,
            default: 10
        },
        total: {
            type: Number,
            default: 0
        },
        pageSizeOpts: {
            type: Array,
            default () {
                return [10, 30, 50, 80];
            }
        }
    },
    computed: {
        startPage() {
            return this.pageSize * (this.currentPage - 1) + 1;
        },
        endPage() {
            /* 总页数小于每页大小或者 当前页数加上每页大小大于总页数 */
            if ((this.pageSize * (this.currentPage - 1) + 1 + this.pageSize) > this.total || this.pageSize > this.total) {
                return this.total;
            }
            return this.pageSize * (this.currentPage - 1) + this.pageSize;
        }
    },
    methods: {
        onCurrentPageChange(page) {
            this.currentPage = page;
            this.$emit('on-current-page-change', page);
        },
        onPageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.$emit('on-page-size-change', pageSize);
        }
    }
};

</script>
