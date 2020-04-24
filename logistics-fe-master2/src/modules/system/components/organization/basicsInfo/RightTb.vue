<template>
    <div class="wrapper-right-tb">
        <el-radio-group v-model="radio" size="mini" class="top-radio" @change="handleChangeRadio">
            <el-radio-button label="基础信息"></el-radio-button>
            <el-radio-button label="关联租户"></el-radio-button>
        </el-radio-group>
        <div class="wrapper-content">
            <Info v-if="radio === '基础信息'" ref="info" :currentNode="currentNode" @updateNode="updateNode" @parentNodeUpdate="parentNodeUpdate"/>
            <RelevandeTenant ref="relevandeTenant" v-if="radio === '关联租户'" :currentNode="currentNode" />
        </div>
    </div>
</template>
<script>
import RelevandeTenant from '../relevanceTennat/Index';
import Info from './Info';

export default {
    components: {
        RelevandeTenant,
        Info
    },
    props: {
        currentNode: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            radio: '基础信息'
        };
    },
    methods: {
        handleChangeRadio(val) {
            const { code } = this.currentNode;
            if (!code) {
                return false;
            }
            if (val === '关联租户') {
                this.$refs.relevandeTenant._queryTenantsFromOrg();
            }
            if (val === '基础信息') {
                this.$refs.info.renderForm(this.currentNode);
                this.$refs.info._getUserInfos();
            }
        },
        updateNode() {
            this.$emit('updateNode');
        },
        parentNodeUpdate() {
            this.$emit('parentNodeUpdate');
        }
    }
};
</script>
<style lang="less">
.wrapper-right-tb{
    display: flex;
    flex-direction: column;
    height: 100%;
    .wrapper-content{
        margin-top: 10px;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
}
</style>
