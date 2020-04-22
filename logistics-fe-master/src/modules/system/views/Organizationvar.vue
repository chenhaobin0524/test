<template>
    <Paper class="organizationvar">
        <BasicsInfo class="wrapper-content"/>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import BasicsInfo from '../components/organization/basicsInfo/Index';
export default {
    name: 'organizationvar',
    components: {
        Paper,
        BasicsInfo
    },
    data() {
        return {
            radio: '基础信息'
        };
    }
};
</script>
<style lang="less">
.organizationvar{
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0;
    .wrapper-content{
        flex: 1;
    }
}
</style>
