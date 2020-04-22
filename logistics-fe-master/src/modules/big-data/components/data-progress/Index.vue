<template>
    <div class="data-progress">
        <div class="progress-title">
            <span>作</span><br>
            <span>业</span><br>
            <span>进</span><br>
            <span>度</span>
        </div>
        <div class="data-pie">
            <el-progress type="circle" :percentage="rate" :width="widthHeight" :height="widthHeight"
                :stroke-width="6">
            </el-progress>
        </div>
    </div>
</template>

<script>
const htmlwidth = document.documentElement.clientWidth || document.body.clientWidth;
export default {
    props: ['rate'],
    mounted() {
        this.widthHeight = Math.floor(htmlwidth / 1920) <= 1 ? 60 : 60 * (Math.floor(htmlwidth / 1920));
    },
    data() {
        return {
            widthHeight: 60
        };
    }
};
</script>

<style lang="less">
@import "./style/style.less";
</style>
