/**
* Created by CHENRC2 on 2017-9-23.
*/
<template>
    <div class="layout-content">
        <slot></slot>
    </div>
</template>
<style lang="less">
.layout-content {
    margin: 10px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 5px #f2f2f2;
    min-width: 1000px;
    box-sizing: border-box;
    padding: 16px;
    flex: 1 auto;
}
</style>
<script>
export default {
    data() {
        return {
            screenHeight: document.body.clientHeight
        };
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                window.screenHeight = document.body.clientHeight;
                that.screenHeight = window.screenHeight;
            })();
        };
    },
    watch: {
        screenHeight(val) {
            if (!this.timer) {
                this.screenHeight = val;
                this.timer = true;
                const that = this;
                setTimeout(function() {
                    that.timer = false;
                }, 400);
            }
        }
    }
};
</script>
