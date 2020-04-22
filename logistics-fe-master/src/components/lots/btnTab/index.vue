<template>
    <div class="tab-btn-chenjk">
        <span
            class="tab-btn-item"
            :class="{ active: current === index}"
            v-for='(item, index) in tabList' :key='index'
            @click='click(index)'
            >
            {{ item.label }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        tabList: {
            type: Array,
            default() {
                return [];
            }
        },
        active: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            current: 0
        };
    },
    methods: {
        click(index) {
            this.current = index;
            this.$emit('btn-click', this.tabList[index]);
        }
    },
    created() {
        this.current = this.active;
    }
};
</script>

<style lang="less">
.tab-btn-chenjk {
    margin-bottom: 25px;
    padding-top: 13px;

    .tab-btn-item {
        font-size: 13px;
        padding: 7px 18px;
        background-color: #e2e2e2;
        border-radius: 16px;
        color: #666;
        margin-left: 12px;
        display: inline-block;
        cursor: pointer;
        margin-top: 12px;
    }
    .tab-btn-item.active,
    .tab-btn-item:hover {
        background-color: #00bcbf;
        color: #fff;
    }
}
</style>