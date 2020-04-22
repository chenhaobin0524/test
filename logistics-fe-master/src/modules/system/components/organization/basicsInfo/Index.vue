<template>
    <el-row class="org-row">
        <el-col :span="6" class="org-col border-col">
            <LeftTree @nodeClick="nodeClick" ref="leftTree"/>
        </el-col>
        <el-col :span="18" class="org-col over-col">
            <RightTb :currentNode="currentNode" @updateNode="updateLeftNode" @parentNodeUpdate="parentNodeUpdate"/>
        </el-col>
    </el-row>
</template>
<script>
import LeftTree from './LeftTree';
import RightTb from './RightTb';

export default {
    components: {
        LeftTree,
        RightTb
    },
    data() {
        return {
            currentNode: {}
        };
    },
    methods: {
        nodeClick(data) {
            this.currentNode = data;
        },
        updateLeftNode() {
            this.$refs.leftTree.currentNodeUpdate();
        },
        parentNodeUpdate() {
            this.$refs.leftTree.parentNodeUpdate();
        }
    }
};
</script>
<style lang="less">
.org-row{
    height: 100%;
    display: flex;
    align-items: stretch;
}
.org-col{
}
.border-col{
    border-right: 1px solid #e6e6e6;
    padding: 16px;
}
.over-col{
    padding: 16px;
    overflow: auto;
}
</style>
