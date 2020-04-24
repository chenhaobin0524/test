<template>
    <div class="report">
        <iframe class="report-frame" :src="target"></iframe>
    </div>
</template>

<script>
export default {
    data () {
        return {
            target: ''
        };
    },
    mounted () {
        let url = this.$route.query.url;
        for (const k in this.$route.query) {
            if (k !== 'uid') url += `&${k}=${this.$route.query[k]}`;
        }
        this.target = url;
    }
};
</script>
<style lang='less'>
.report {
    height: calc(100% - 50px);
    width: 100%;
    .report-frame {
        height: calc(100% - 7px);
        width: 100%;
    }
}
</style>
