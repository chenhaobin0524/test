<template>
    <div>
        <el-input
            v-model="value"
            :placeholder="params.name"
            :disabled="disabled"
            @focus='$event.target.blur()'
            @clear="clear"
            clearable
            @input="input">
            <el-button
                slot="append"
                icon="el-icon-search"
                @click="show"
                :disabled="disabled"
            ></el-button>
        </el-input>
        <advance-dialog ref="advanceDialog" @confirm="detaliSearchSure"></advance-dialog>
    </div>
</template>

<script>
import advanceDialog from '@/components/lots/otpAdvanceDialog';
export default {
    components: { advanceDialog },
    props: {
        params: Object,
        mValue: [String, Number],
        disabled: {
            type: Boolean,
            default: false
        },
        formData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            value: ''
        };
    },
    created() {
        this.value = this.mValue;
    },
    watch: {
        mValue() {
            this.value = this.mValue;
        }
    },
    methods: {
        input() {
            const obj = {};
            this.params.cbParams.forEach(item => {
                var arr = item.split('#');
                obj[arr[arr.length - 1]] = '';
            });
            this.value = '';
            this.$emit('getAdvanceValue', obj);
        },
        show() {
            const current = this.params;
            const advanceCascade = {};
            if (current.advanceCascade && Object.prototype.toString.call(current.advanceCascade) === '[object String]') {
                let advanceArray = [];
                advanceArray = current.advanceCascade.split(',');
                advanceArray.map((item) => {
                    let { 0: sourceProp, 1: destProp } = item.split('#');
                    destProp = destProp || sourceProp;
                    advanceCascade[destProp] = this.formData[sourceProp];
                });
            }
            this.$refs.advanceDialog.show(true, current, advanceCascade);
        },
        detaliSearchSure(data) {
            this.value = data[this.params.value];
            this.$emit('getAdvanceValue', data);
        },
        clear() {
            this.$emit('clear', '');
        }
    }
};
</script>

<style>
</style>
