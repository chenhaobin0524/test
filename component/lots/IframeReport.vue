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
        this.setUrl();
    },
    methods: {
        setUrl() {
            let url = this.$route.query.url;
            for (const k in this.$route.query) {
                if (k !== 'uid') url += `&${k}=${this.$route.query[k]}`;
            }
            this.target = url;
        }
    },
    watch: {
        '$route.fullPath': function (from, to) {
            if (from !== to) {
                this.setUrl();
            }
        }
    }
};
</script>
<style lang='less'>
.report {
    height: calc(100vh - 80px);
    width: 100%;
    .report-frame {
        height: 100%;
        width: 100%;
        border: none;
    }
}
</style>
