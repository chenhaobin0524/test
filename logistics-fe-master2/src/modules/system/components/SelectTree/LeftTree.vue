<template>
    <div class="system-list">
        <el-menu :default-active="getFirstSystems" class="system-menu" @select="handleSelect">
            <el-menu-item class="system-menu-item"
                        v-for="item in systems"
                        :index="item.applicationCode"
                        :key="item.applicationCode">
            {{item.applicationName}}
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    props: {
        systems: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        handleSelect(key) {
            let temp;
            if (this.systems.length) {
                temp = this.systems.find(item => item.applicationCode === key);
            }
            this.$emit('handleSelect', temp);
        }
    },
    computed: {
        getFirstSystems() {
            if (this.systems.length) {
                this.$emit('handleSelect', this.systems[0]);
            }
            return this.systems.length ? this.systems[0].applicationCode : '';
        }
    }
};
</script>
<style lang="less">
.system-list {
    flex: 1;
    overflow-y: auto;
    .system-menu {
        &-item {
            width: auto;
            height: 40px;
            line-height: 40px;
        }
        .is-active {
            background-color: #e6f8f9;
        }
    }
}
</style>
