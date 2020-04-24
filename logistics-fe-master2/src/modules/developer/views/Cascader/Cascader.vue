<template>
  <div class="i-cascader-component">
    <el-cascader :props="props"
                 v-model='currentValue'
                 ref="cascader"
                 @change="handleChange">
    </el-cascader>
  </div>
</template>

<script>
import { city } from './api.js';
export default {
    data() {
        return {
            currentValue: '',
            currentCheckedNodes: {},
            props: {
                lazy: true,
                label: 'ebplNameCn',
                value: 'ebplCode',
                lazyLoad (node, resolve) {
                    const { level } = node;
                    if (+level === 0) {
                        city({
                            ebplType: 'PLACE_PROVINCE',
                            ebplParentPmCode: '100000'
                        }).then(res => {
                            if (+res.code === 0) {
                                resolve(res.data);
                            } else {
                                resolve([]);
                            }
                        });
                    } else {
                        city({
                            ebplType: +level === 1 ? 'PLACE_CITY' : (+level === 2 ? 'PLACE_DISTRICT' : 'PLACE_STREET'),
                            ebplParentPmCode: node.value
                        }).then(res => {
                            if (+res.code === 0) {
                                resolve(res.data);
                            } else {
                                resolve([]);
                            }
                        });
                    }
                }
            }
        };
    },
    methods: {
        handleChange() {
            this.currentCheckedNodes = this.$refs.cascader.getCheckedNodes().length ? this.$refs.cascader.getCheckedNodes()[0] : {};
        }
    }
};
</script>

<style lang="less" scoped>

</style>