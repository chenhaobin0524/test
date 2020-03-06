/**
* Created by CHENRC2 on 2017-7-13.
*/
<template>
    <section class="container">
        <div class="error-bg">
            <p class="err-title">404</p>
            <p class="err-msg">对不起,&nbsp;&nbsp;&nbsp;您的页面出去旅行了~</p>
        </div>
    </section>
</template>
<style lang="less" scoped>
@import url('../../../styles/vars.less');

.container {
    min-width: 800px;
    min-height: 700px;
    color: @color-primary;

    .error-bg {
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;

        //background-image:url("/static/images/404error/404.png");
        .err-title {
            font-size: 120px;
            padding-top: 80px;
            text-align: center;
        }

        .err-msg {
            font-size: 26px;
            padding-top: 40px;
            padding-left: 20px;
            text-align: center;
        }
    }
}

</style>
<script>
export default {
    name: '404'
};

</script>
