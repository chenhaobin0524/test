<template>
  <Paper class="role-manager-authority">
    <div>
        <el-button size="mini" icon="el-icon-arrow-left" @click="handleBack" class="back-btn">返 回</el-button>
        <el-radio-group v-model="tapValue" size="mini" class="padding-left">
            <el-radio-button label="1">给角色绑定资源</el-radio-button>
            <el-radio-button label="2" :disabled="!laseholderDisable">将角色授权给租户</el-radio-button>
            <el-radio-button label="3" :disabled="laseholderDisable">给用户授权角色</el-radio-button>
        </el-radio-group>
    </div>
    <RoleResouce :user="role" class="role-manager-content" v-if="tapValue === '1'" ref="resource" />
    <RoleManageAuthority :user="role" class="role-manager-content" v-if="tapValue === '2'" ref="user" />
    <RoleManageLaseholder :user="role" class="role-manager-content" v-if="tapValue === '3'" ref="laseholder" />
  </Paper>
</template>

<script>
import Paper from '@/components/core/paper/Paper';
import RoleResouce from '../components/roleAuthority/RoleResouce';
import RoleManageAuthority from '../components/roleAuthority/RoleManageAuthority';
import RoleManageLaseholder from '../components/roleAuthority/RoleManageLaseholder';

export default {
    name: 'roleAuthority',
    components: { Paper, RoleResouce, RoleManageAuthority, RoleManageLaseholder },
    data() {
        return {
            tapValue: '1',
            laseholderDisable: false
        };
    },
    props: {
        role: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        handleBack() {
            this.$emit('goback');
        },
        handleSave() {
            if (this.tapValue === '1') {
                this.$refs.resource.sureAction();
            } else if (this.tapValue === '2') {
                this.$refs.user.handleAuthority();
            } else if (this.tapValue === '3') {
                this.$refs.laseholder.handleAuthority();
            }
        }
    },
    mounted() {
        this.laseholderDisable = this.role.roleType === 4;
    }
};
</script>
<style lang="less">
.role-manager-authority {
    display: flex;
    flex-direction: column;
    .role-manager-content {
        padding: 10px 0 0 0;
        overflow: hidden;
        height: 100%;
    }
    .back-btn {
        margin-right: 10px;
    }
}
</style>