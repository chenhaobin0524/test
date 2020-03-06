<template>
    <div>
        <el-form id="queryMain" ref="formData" :label-width="data.labelWidth" :label-position="data.labelPosition" :model="formData">
            <el-row v-for="(rowIndex, i) in formData.row" :key="'row_'+i">
                <el-col v-for="(item,index) in formData.items" :key="'col'+index"
                        :span="item.layout.span" :offset="item.layout.offset" :pull="item.layout.pull" :push="item.layout.push">
                    <template v-if="item.layout.row===rowIndex">
                        <el-form-item :label="$t(item.title)"
                                :required="(item.validators&&item.validators.required)?item.validators.required.required:false"
                                :rules="setRules(item.validators)" :prop="'items.' + index + '.value'">
                            <el-input v-if="item.type === 'Input'" v-model="item.value" :readonly="item.readonly"
                                    :type="item.options.rows===1?'text':'textarea'" :rows="item.options.rows"
                                    :disabled="item.disabled" :placeholder="$t(item.placeholder)" :style="item.style" />
                            <el-input-number v-else-if="item.type === 'InputNumber'" v-model="item.value" :readonly="item.readonly"
                                    :max="item.options.max === null ? Infinity : item.options.max"
                                    :min="item.options.min === null ? -Infinity : item.options.min"
                                    :step="item.options.step" :editable="item.options.editable"
                                    :disabled="item.disabled" :style="item.style" />
                            <el-radio-group v-else-if="item.type === 'Radio'" v-model="item.value" :vertical="item.options.vertical"
                                    :style="item.style">
                                <el-radio v-for="c in item.options.values" :label="c.value" :key="'radio_'+c.value"
                                        :disabled="c.disabled" :style="item.options.style">
                                    <i v-if="c.icon" :type="c.icon"></i>
                                    <span v-if="c.label">{{$t(c.label)}}</span>
                                </el-radio>
                            </el-radio-group>
                            <el-checkbox-group v-else-if="item.type === 'Checkbox'" v-model="item.value" :style="item.style">
                                <el-checkbox v-for="c in item.options.values" :label="c.value" :key="c.value"
                                        :disabled="item.disabled || c.disabled" :style="item.options.style">
                                    <i v-if="c.icon" :type="c.icon"></i>
                                    <span v-if="c.label">{{$t(c.label)}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-date-picker v-else-if="item.type ==='DatePicker'" :type="item.options.type" v-model="item.value"
                                    :disabled="item.disabled" :format="item.options.format" :placeholder="$t(item.placeholder)"
                                    :style="item.style" />
                            <el-date-picker v-else-if="item.type==='TimePicker'" :type="item.options.type" v-model="item.value"
                                    :disabled="item.disabled" :format="item.options.format" :placeholder="$t(item.placeholder)"
                                    :style="item.style" />
                            <el-select v-else-if="item.type === 'Select'" :multiple="item.options.multiple"
                                    :disabled="item.disabled || !item.options.values.length" v-model="item.value" :style="item.style">
                                <el-option v-for="c in item.options.values" :value="c.value" :disabled="c.disabled" :key="c.value">{{$t(c.label)}}</el-option>
                            </el-select>
                            <el-switch v-model="item.value" v-else-if="item.type==='Switch'" :disabled="item.disabled" :style="item.style">
                                <i type="android-done" slot="open"></i>
                                <i type="android-close" slot="close"></i>
                            </el-switch>
                            <AutoComplete v-model="item.value" v-else-if="item.type==='AutoComplete'" :data="item.data"
                                    :placeholder="$t(item.placeholder)" :style="item.style" @on-select="item.events.onSelect" />
                            <Slider v-model="item.value" v-else-if="item.type==='Slider'" :show-input="item.showInput"
                                    :disabled="item.disabled" :min="item.min" :max="item.max" :step="item.step" :range="item.range"
                                    :show-stops="item.showStops" :tip-format="item.tipFormat" :style="item.style" />
                            <Cascader v-else-if="item.type==='Cascader'" :data="item.data" v-model="item.value" :disabled="item.disabled"
                                    :placeholder="$t(item.placeholder)" :style="item.style" />
                            <Rate v-else-if="item.type==='Rate'" v-model="item.value" :count="item.count" :allow-half="item.allowHalf"
                                    :disabled="item.disabled" :show-text="item.showText" />
                        </el-form-item>
                    </template>
                </el-col>
            </el-row>
            <el-row v-if="formData.buttons">
                <el-col :span="formData.buttons.layout?formData.buttons.layout.span:0"
                        :push="formData.buttons.layout?formData.buttons.layout.push:0"
                        :pull="formData.buttons.layout?formData.buttons.layout.pull:0">
                    <el-form-item>
                        <el-button v-if="formData.buttons.submit&&(formData.buttons.submit.visible===undefined||formData.buttons.submit.visible===true)"
                                type="primary"
                                :icon="formData.buttons.submit.icon" @click="handleSubmit('formData')">
                            {{$t(formData.buttons.submit.label?formData.buttons.submit.label:'page.query.submit')}}</el-button>
                        <el-button v-if="formData.buttons.reset&&(formData.buttons.reset.visible===undefined||formData.buttons.reset.visible===true)"
                                type="ghost" :icon="formData.buttons.reset.icon" @click="handleConfirmReset">
                            {{$t(formData.buttons.reset.label?formData.buttons.reset.label:'page.query.reset')}}</el-button>
                        <el-button v-for="(button,i) in formData.buttons.custom" :key="'custom_btn_'+i" :icon="button.icon"
                            @click="button.click">{{$t(button.label)}}</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog v-model="showModel" :title="$t('page.query.resetForm')" @on-ok="handleOk" @on-cancel="handleCancel">
            <p>{{$t('page.query.confirmReset')}}</p>
        </el-dialog>
    </div>
</template>
<script>
import { formRender as config } from './config.js';
import { formatDateTime } from '../../../../utils/datetime-format.js';
export default {
    name: 'pageForm',
    data() {
        return {
            showModel: false,
            data: Object.assign({}, this.formData, config.base)
        };
    },
    watch: {
        formData() {
            this.data = Object.assign({}, this.formData, config.base);
        }
    },
    props: {
        condition: {
            type: Array,
            default () {
                return [];
            }
        },
        formData: {
            type: Object,
            default () {
                return {
                    items: [],
                    row: 0
                };
            }
        },
        needValidation: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleOk() {
            this.handleReset('formData');
            this.showModel = false;
        },
        handleCancel() {
            this.showModel = false;
        },
        handleSubmit(name) {
            let validate = !this.needValidation;
            if (this.needValidation) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        validate = valid;
                    }
                });
            }
            if (validate) {
                // 组装查询条件
                const condition = this.getCondition();
                // 把查询条件广播出去
                this.$emit('onSubmit', condition);
            }
        },
        handleConfirmReset() {
            this.showModel = true;
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        setRules(validators, ignores = []) {
            const rules = [];
            for (const key in validators) {
                if (!ignores.includes(key) && validators.hasOwnProperty(key)) {
                    rules.push(validators[key]);
                }
            }
            return rules;
        },
        getCondition() {
            let arr = '{';
            this.formData.items.map(item => {
                if (item.value && (item.value !== '' || item.value.length !== 0)) {
                    // 日期时间格式化
                    if (item.type === 'datePicker' || item.type === 'timePicker') {
                        if (item.options.type === 'daterange' || item.options.type === 'datetimerange') {
                            item.value[0] = item.value[0] ? formatDateTime(new Date(item.value[0]), item.options.format) : '';
                            item.value[1] = item.value[1] ? formatDateTime(new Date(item.value[1]), item.options.format) : '';
                        } else {
                            item.value = item.value ? formatDateTime(new Date(item.value), item.options.format) : '';
                        }
                    }
                    arr += '"' + item.field + '":"' + item.value + '",';
                }
            });
            if (arr === '{') return {};
            arr = arr.substring(0, arr.lastIndexOf(',')) + '}';
            return JSON.parse(arr);
        }
    }
};
</script>
<style>
</style>