<template>
    <el-cascader :props="props"
                 v-model='currentValue'
                 ref="cascader"
                 :placeholder="this.placeholder"
                 clearable
                 @change="handleChange">
    </el-cascader>
</template>

<script>
import { organizations } from '../../api/Organization';
export default {
    data() {
        return {
            currentValue: '',
            currentCheckedNodes: {},
            props: {
                lazy: true,
                checkStrictly: true,
                label: 'name',
                value: this.value,
                lazyLoad (node, resolve) {
                    if (node.level === 0) {
                        organizations().then(res => {
                            if (res && +res.code === 0 && res.data) {
                                return resolve(res.data);
                            }
                        });
                        return false;
                    }
                    organizations({ parentCode: node.data.code }).then(res => {
                        if (res && +res.code === 0 && res.data) {
                            return resolve(res.data);
                        } else {
                            return resolve([]);
                        }
                    });
                }
            }
        };
    },
    props: {
        value: {
            type: String,
            default: 'id'
        },
        placeholder: {
            type: String,
            default: '请选择'
        }
    },
    methods: {
        handleChange(val) {
            this.$emit('change', val, this.$refs.cascader.getCheckedNodes());
        }
    }
};
</script>

<style lang="less">

</style>