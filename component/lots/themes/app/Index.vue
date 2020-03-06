<template>
    <el-dropdown class="service">
        <div class="dropdown-title">
            <i class="auth-icon-swich-system dropdown-img"></i>
            <span>{{this.text}}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
            <a target="_blank"
                v-for="item in appList"
                :href="`${item.customDomain ? (item.customDomain.indexOf('//') > -1 ? `${item.customDomain}` : `//${item.customDomain}`) : ''}${item.applicationDomain}`"
                :key="item.applicationCode">
                <el-dropdown-item name="system">{{item.applicationName}}</el-dropdown-item>
            </a>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    computed: {
        text() {
            const currentPath = this.appList.find(item => {
                if (item.applicationDomain) {
                    return item.applicationDomain.indexOf(window.location.pathname) >= 0;
                }
                return false;
            });
            if (currentPath && currentPath.applicationName) {
                return currentPath.applicationName;
            } else {
                return '';
            }
        },
        ...mapGetters(['appList', 'authority'])
    }
};
</script>
<style lang="less">
    .service{
        cursor: pointer;
        margin-right: 20px;
        .dropdown-title{
            .dropdown-img{
                font-size: 20px;
                margin-right: 8px;
                vertical-align: middle;
            }
        }
    }
</style>