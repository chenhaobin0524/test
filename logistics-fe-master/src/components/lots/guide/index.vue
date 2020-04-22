<template>
    <div class="guide-wrapper" v-if="flag">
        <div class="frist-one" v-if="current === 1">
            <img src="../../../assets/frist-one.png" alt="">
            <div class="next" @click="next_click"></div>
            <div class="close" @click="close"></div>
        </div>
        <div class="second" v-if="current === 2">
            <img src="../../../assets/second.png" alt="">
            <div class="next" @click="close"></div>
        </div>
    </div>
</template>
<script>
const version = 1;
export default {
    data() {
        return {
            flag: false,
            current: 1
        };
    },
    methods: {
        next_click() {
            this.current = 2;
        },
        close() {
            this.current = 1;
            this.flag = false;
        }
    },
    watch: {
        $route(to, from) {
            if (to.matched.length) {
                const step = localStorage.step ? JSON.parse(localStorage.step) : null;
                if (!step || step.version < version) {
                    this.$nextTick(() => {
                        this.flag = true;
                    });
                    localStorage.step = JSON.stringify({ version: version });
                }
            }
        }
    }
};
</script>
<style lang="less">
.guide-wrapper{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 9999;
    background: rgba(0,0,0,0.5);
    .frist-one{
        position: absolute;
        top: 0;
        right: 330px;
        z-index: 10000;
        .next{
            position: absolute;
            right: 0;
            bottom: 3px;
            width: 106px;
            height: 41px;
            cursor: pointer;
            z-index: 10000;
        }
        .close{
            position: absolute;
            right: 126px;
            bottom: 3px;
            width: 106px;
            height: 41px;
            cursor: pointer;
            z-index: 10000;
        }
    }
    .second{
        position: absolute;
        top: 0;
        right: 330px;
        z-index: 10000;
        .next{
            position: absolute;
            right: 0;
            bottom: 3px;
            width: 106px;
            height: 41px;
            cursor: pointer;
            z-index: 10000;
        }
        .close{
            position: absolute;
            right: 126px;
            bottom: 3px;
            width: 106px;
            height: 41px;
            cursor: pointer;
            z-index: 10000;
        }
    }
}
</style>
