<template>
    <div id="myLotsSelect">
        <el-select v-model="value" @clear="clear(value)" :multiple="multiple" :filterable="filterable" @change="sendSelectValue" :disabled="disabled" clearable>
            <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
    </div>
</template>

<script>
import { dictWithUrl } from '@/components/otpPanel/api';
export default {
    data() {
        return {
            options: [],
            value: ''
        };
    },
    props: {
        optionArr: Array,
        optionNum: String,
        prop: String,
        multiple: Boolean,
        mValue: [String, Number, Array],
        disabled: {
            type: Boolean,
            default: false
        },
        filterable: Boolean
    },
    watch: {
        optionArr(val) {
            this.options = val;
        },
        mValue(val) {
            this.value = val;
        },
        optionNum(val) {
            this.getDictionary(val);
        }
    },
    methods: {
        getDictionary(optionNum = null) {
            const params = optionNum || this.optionNum;
            if (params) {
                dictWithUrl(params).then(res => {
                    if (res.code === '0') {
                        const arr = [];
                        for (const key in res.data[params]) {
                            if (res.data[params].hasOwnProperty(key)) {
                                arr.push({
                                    value: key,
                                    label: res.data[params][key]
                                });
                            }
                        }
                        this.options = arr;
                    }
                });
            } else {
                this.options = this.optionArr;
            }
        },
        sendSelectValue() {
            const data = {};
            data[this.prop] = this.value;
            let label = '';
            this.options.map(item => {
                if (item.value === this.value) {
                    label = item.label;
                }
            });
            this.$emit('getSelectValue', data, label);
            setTimeout(() => {
                this.$emit('change');
            }, 50);
        },
        clear(value) {
            this.$emit('clear', this.value);
        }
    },
    created() {
        this.getDictionary();
        this.value = this.mValue;
    }
};
</script>

<style lang="less">
    #myLotsSelect{
        width:100%;
        .el-select{
            width:100%;
        }
    }
</style>
