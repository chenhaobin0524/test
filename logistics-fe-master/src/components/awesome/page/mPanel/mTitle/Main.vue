<template>
    <p>
        <span class="title" :style="{color: config.title.fontColor, fontWeight: config.title.fontWeight, fontSize: config.title.fontSize, marginRight: config.gap}">{{title}}</span>
        <span :style="{color: config.tips.fontColor, fontWeight: config.tips.fontWeight, fontSize: config.tips.fontSize}">{{tips}}</span>
    </p>
</template>
<script>
import config from './config';
export default {
    name: 'mTitle',
    data() {
        return {
            config: config
        };
    },
    props: {
        title: String,
        tips: String
    }
};
</script>
<style scoped>
.title {
    margin-right: 30px;
}
</style>