<template>
    <div>
        <span @click="handleChangeTenant" class="tenant-cut">
            租户：{{this.currentTenant.tenantName}}
        </span>
        <el-dialog
            title="切换租户"
            :visible.sync="TenantVisible"
            width="500px"
            top="10px"
            class="tenant-dialog"
            @close="closeDialog">
            <div>
                <div class="tenant-top">
                    <span>当前：{{this.currentTenant.tenantName}}</span>
                    <div>
                        <el-input placeholder="搜索租户编码/名称" v-model="searchTenant" class="search-tenant-input"></el-input>
                        <el-button type="primary" @click="_getList">查询</el-button>
                    </div>
                </div>
                <div class="tenant-list">
                    <div v-for="(item, index) in tenantsList"
                        :key="index"
                        class="tenant-item"
                        @click="() => { handleActive(item) }">
                        <span>{{`${item.tenantName} | ${item.tenantCode}`}}</span>
                        <div v-if="item.tenantCode === currentTenant.tenantCode" class="active-item"></div>
                    </div>
                </div>
            </div>
            <el-pagination
                class="text-right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50, 100]"
                layout='total, sizes, prev, pager, next, jumper'
                :total="total">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { getUserAllTenants, setTenant } from '@/modules/index/api/user';
export default {
    mounted() {
        // 多租户在 bms 与供应链间切换
        if (/^bms.*$/i.test(location.host) && document.referrer &&
                (/^lmes.*$/i.test(document.referrer.split('://')[1]) || document.referrer.indexOf('gwms.html') >= 0) &&
                this.tenantInfo.list && this.tenantInfo.list.length > 1) {
            this.handleChangeTenant();
        }
    },
    data() {
        return {
            TenantVisible: false,
            searchTenant: '',
            currentPage: 1,
            total: 0,
            pageSize: 10,
            tenantsList: []
        };
    },
    computed: {
        ...mapGetters(['currentTenant'])
    },
    methods: {
        // 获取租户列表
        _getList() {
            getUserAllTenants({
                tenantCodeOrName: this.searchTenant,
                listFlag: 1,
                pageNo: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                if (res && res.data && res.data.tenants && res.data.tenants.list) {
                    this.tenantsList = res.data.tenants.list;
                    this.total = res.data.tenants.totalCount;
                }
            });
        },
        // 设置租户
        _setTenant(data) {
            setTenant(data).then(res => {
                if (res && res.data) {
                    this.updateCurrenTenant(res.data);
                    this.$router.go(0);
                }
            });
        },
        // 打开租户列表弹窗
        handleChangeTenant() {
            this._getList();
            this.TenantVisible = true;
        },
        // 关闭租户弹窗
        closeDialog() {
            this.TenantVisible = false;
            this.searchTenant = '';
            this.currentPage = 1;
            this.total = 0;
            this.pageSize = 10;
            this.tenantsList = [];
        },
        // 切换租户
        handleActive(item) {
            this._setTenant(item);
        },
        // 切换每页数量
        handleSizeChange(val) {
            this.pageSize = val;
            this._getList();
        },
        // 切换页面
        handleCurrentChange(val) {
            this.currentPage = val;
            this._getList();
        },
        ...mapMutations({
            updateCurrenTenant: 'updateCurrenTenant'
        })
    }
};
</script>
<style lang="less">
.tenant-cut{
    cursor: pointer;
    color: #000;
    padding: 6px 10px;
    background-color: #FFEBE0;
    font-size: 12px;
    border-radius: 5px;
    height: 12px;
    line-height: 12px;
    margin-right: 20px;
}
.tenant-dialog{
    text-align: left;
    .tenant-top{
        display: flex;
        justify-content: space-between;
    }
    .search-tenant-input{
        width: 160px;
        margin-right: 10px;
    }
    .tenant-list{
        height: 300px;
        overflow-y: auto;
        border: 1px solid rgba(233, 233, 233, 1);
        margin-top: 10px;
    }
    .tenant-item{
        padding: 0 10px;
        line-height: 40px;
        border-bottom: 1px solid rgba(233, 233, 233, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .active-item{
        width: 5px;
        height: 10px;
        border-bottom: 2px solid #00BCBF;
        border-right: 2px solid #00BCBF;
        transform: rotate(45deg);
        margin: 5px 10px 10px 0;
    }
    .text-right{
        margin-top: 10px;
        text-align: right;
    }
}
</style>