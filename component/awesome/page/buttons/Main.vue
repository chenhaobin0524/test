<template>
    <div>
        <el-button style="margin-left: 6px" v-for="(button,index) in systemButtons" :key="'system_'+index"
                :icon="getCurrentIcon(button.name)" :size="size"
                @click="onSystemBtnClick(button.name, button.url)">{{$t(button.label)}}</el-button>
        <el-button style="margin-left: 6px" v-for="(button,index) in customButtons" :key="'custom_'+index"
                :icon="button.icon?button.icon:'ionic'" :size="size"
                @click="onCustomBtnClick(button.click)">{{$t(button.label)}}</el-button>
    </div>
</template>
<script>
import { tableBtnNames, icons } from './config';
export default {
    name: 'mButtons',
    props: {
        size: {
            type: String,
            default: 'large'
        },
        customButtons: {
            type: Array,
            default () {
                return [];
            }
        },
        systemButtons: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    methods: {
        // 系统按钮点击事件
        onSystemBtnClick(name, url) {
            this.$emit('onSystemBtnClick', name, url);
        },
        // 自定义按钮点击事件
        onCustomBtnClick(click) {
            this.$emit('onCustomBtnClick', click);
        },
        // 表头系统按钮图标
        getCurrentIcon(btnName) {
            switch (btnName) {
            case tableBtnNames.btnAdd:
                return icons.add;
            case tableBtnNames.btnEdit:
                return icons.edit;
            case tableBtnNames.btnDel:
                return icons.del;
            case tableBtnNames.btnImport:
                return icons.import;
            case tableBtnNames.btnExport:
                return icons.export;
            default:
                return icons.default;
            }
        }
    }
};
</script>
<style scoped>
</style>