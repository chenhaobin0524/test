<template>
    <el-button class="collapse-button" icon="navicon-round" shape="circle" :class="rotateIcon" @click="handleToggleClick" />
</template>
<script>
export default {
    name: 'CollapseButton',
    computed: {
        // 折叠左侧菜单
        rotateIcon() {
            return ['menu-icon', this.collapse ? 'rotate-icon' : ''];
        }
    },
    methods: {
        handleToggleClick() {
            this.$emit('on-toggle-click');
        }
    }
};
</script>
<style lang="less" scoped>
.collapse-button {
    width: 46px;
    height: 46px;
    margin: 6px 0 6px 30px;
    border: 0;
    background-color: #fff;
    box-shadow: 0px 0px 6px #999;
}

.collapse-button:hover {
    box-shadow: 0px 0px 32px #999;
}
</style>
