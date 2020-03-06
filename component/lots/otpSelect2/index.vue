<template>
    <div class="otp-select">
        <el-select v-model="cValue" @input="sendSelectValue" @clear="clear(cValue)" :multiple="multiple" :filterable="filterable" :disabled="disabled" :placeholder="placeholder" clearable>
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
            cValue: ''
        };
    },
    props: {
        optionArr: Array,
        optionNum: String,
        placeholder: String,
        multiple: Boolean,
        disabled: {
            type: Boolean,
            default: false
        },
        filterable: Boolean,
        value: {
            type: [String, Number, Array]
        }
    },
    watch: {
        value(val) {
            this.cValue = val;
        },
        optionNum(val) {
            this.getDictionary();
        }
    },
    methods: {
        getDictionary() {
            if (this.optionNum) {
                dictWithUrl(this.optionNum).then(res => {
                    if (res.code === '0') {
                        const arr = [];
                        for (const key in res.data[this.optionNum]) {
                            if (res.data[this.optionNum].hasOwnProperty(key)) {
                                arr.push({
                                    value: key,
                                    label: res.data[this.optionNum][key]
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
        sendSelectValue(val) {
            let label = '';
            this.options.map(item => {
                if (item.value === this.cValue) {
                    label = item.label;
                }
            });
            this.$emit('input', val);
            this.$emit('getSelectLabel', label);
            setTimeout(() => {
                this.$emit('change');
            }, 50);
        },
        clear(value) {
            this.$emit('clear', this.cValue);
        }
    },
    created() {
        this.getDictionary();
        this.cValue = this.value;
    }
};
</script>

<style lang="less">
    .otp-select{
        width:100%;
        .el-select{
            width:100%;
        }
    }
</style>
