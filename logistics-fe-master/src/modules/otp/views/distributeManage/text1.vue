<template>
    <Paper>
        <div>
            <el-button @click="textData">查看</el-button>
        </div>
        <Main
        :visible.sync="visible"
        @handleClose='handleClose'
        @cancel='cancel'
        @addOk='addOkk'
        @detaliSearchBlur='detaliSearchBlur'
        @detaliSearch='detaliSearch'
        @advanceCodeChange='advanceCodeChange'
        @searchDateChange='searchDateChange'
        @autocompleteSure='autocompleteSure'
        ref='ruleForm'
        ></Main>
    </Paper>
</template>

<script>
import Paper from '@/components/core/paper/Paper';
import Main from '../../components/dispatchPopup/dispatchForm/Main';

export default {
    components: {
        Paper,
        Main
    },
    data() {
        return {
            visible: false
        };
    },
    methods: {
        hide() {
            this.visible = false;
        },
        textData() {
            this.visible = true;
        },
        handleClose() {
            this.visible = false;
        },
        cancel() {
            this.visible = false;
        },
        addOkk() {
            this.visible = false;
        },
        detaliSearchBlur() {
            // blur事件方法
        },
        detaliSearch() {
            // 回车事件
        },
        advanceCodeChange() {
            // change事件
        },
        searchDateChange() {
            // 获取焦点事件
        },
        autocompleteSure() {
            // 下拉框change选中事件
        }
    }
};
</script>

<style lang="less">

</style>