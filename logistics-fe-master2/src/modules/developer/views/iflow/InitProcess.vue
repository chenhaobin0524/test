<template>
    <Paper>
        <el-button @click="handleClick('supplierTransRate')" >创建流程</el-button>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import { initProcess } from '../../api/process.js';

export default {
    components: {
        Paper
    },
    computed: {
        // 当前用户usercode
        loginName() {
            return this.$store.state.user.userCode;
        }
    },
    methods: {
        handleClick(fdTemplateId) {
            initProcess({
                loginName: this.loginName,
                fdTemplateId
            }).then(res => {
                if (res.code === '0') {
                    const fdId = res.data;
                    // this.$router.push({
                    //     name: 'iflow',
                    //     params: {
                    //         fdId,
                    //         id
                    //     }
                    // });
                    this.$router.push(`/iflow?fdId=${fdId}`);
                }
            });
        }
    }
};
</script>
<style>

</style>
