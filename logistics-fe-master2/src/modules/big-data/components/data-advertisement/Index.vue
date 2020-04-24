<template>
    <div ref="advertise" class="advertise">
        <div class="ad-content" ref="adcontent">{{content}}</div>
    </div>
</template>

<script>
export default {
    props: ['content'],
    mounted() {
        const adNews = this.$refs.advertise;
        const adNewsWidth = adNews.offsetWidth;
        const adcontent = this.$refs.adcontent;
        const adWidth = adcontent.offsetWidth;
        const totalWidth = adWidth + (adNewsWidth * 2);
        let moveLeft = adWidth;
        adcontent.style = 'transform: translateX(+' + totalWidth + 'px)';
        setInterval(() => {
            moveLeft--;
            if (moveLeft <= -totalWidth) {
                moveLeft = adWidth;
                adcontent.style = 'transform: translateX(' + totalWidth + 'px)';
            }
            adcontent.style = 'transform: translateX(' + moveLeft + 'px)';
        }, 36);
    }
};
</script>

<style lang="less">
@import "./style/style.less";
</style>