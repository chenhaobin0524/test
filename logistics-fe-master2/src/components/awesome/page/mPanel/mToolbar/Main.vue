<template>
    <div id="mToolbar">
        <el-row type="flex" justify="end">
            <el-col :span="showSearch ? 8 : 24">
            <el-button v-for="item in config.buttons" :key="'toolbar_button_'+item.event" style="margin-right: 10px;" type="primary" :icon="item.icon" @click="handleClick(item.event)">{{item.label}}
            </el-button>
            </el-col>
            <el-col :span="16" v-if="showSearch">
            <el-form v-if="!config.miniSearch.richInput" style="float: right;" ref="formData" :label-position="config.labelAlign || 'right'" :model="config" inline>
                <template v-if="!item.hide">
                    <el-form-item :label-width="item.labelWidth" :label="item.label"
                            v-for="(item,index) in config.miniSearch.items" :required="(item.validators&&item.validators.length>0)?true:false"
                            :rules="item.validators" :prop="'miniSearch.items.' + index + '.value'" :key="'form_item_'+item.field">
                        <el-input v-if="item.type === 'Input'" v-model="item.value" :readonly="item.readonly"
                                :disabled="item.disabled" :placeholder="item.placeholder" :style="{width: item.width}"
                                @on-enter="handleInputEvent(item, 'on-'+item.field+'-enter')"
                                @on-click="handleInputEvent(item, 'on-'+item.field+'-click')"
                                @on-change="handleInputEvent(item, 'on-'+item.field+'-change', $event)"
                                @on-focus="handleInputEvent(item, 'on-'+item.field+'-focus')"
                                @on-blur="handleInputEvent(item, 'on-'+item.field+'-blur')"
                                @on-keyup="handleInputEvent(item, 'on-'+item.field+'-keyup', $event)"
                                @on-keydown="handleInputEvent(item, 'on-'+item.field+'-keydown', $event)"
                                @on-keypress="handleInputEvent(item, 'on-'+item.field+'-keypress', $event)" />
                        <el-input-number v-else-if="item.type === 'InputNumber'" v-model="item.value" :readonly="item.readonly"
                                :max="item.max ? Infinity : item.max" :min="item.min ? -Infinity : item.min" :step="item.step"
                                :style="{width: item.width}" :editable="item.editable" :disabled="item.disabled"
                                @on-change="handleInputNumberEvent(item, 'on-'+item.field+'-change', $event)"
                                @on-focus="handleInputNumberEvent(item, 'on-'+item.field+'-focus', $event)"
                                @on-blur="handleInputNumberEvent(item, 'on-'+item.field+'-blur')" />
                        <el-radio-group v-else-if="item.type === 'RadioGroup'" v-model="item.value" :vertical="item.vertical"
                                @on-change="handleRadioGroupEvent(item, 'on-'+item.field+'-change', $event)">
                            <el-radio v-for="radio in item.options" :label="radio.value" :key="radio.label+'_'+radio.value"
                                    :disabled="radio.disabled">
                                <i v-if="radio.icon" :type="radio.icon"></i>
                                <span>{{radio.label}}</span>
                            </el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-else-if="item.type === 'CheckboxGroup'" v-model="item.value"
                                @on-change="handleCheckboxGroupEvent(item, 'on-'+item.field+'-change', $event)">
                            <el-checkbox v-for="checkbox in item.options" :label="checkbox.value"
                                    :key="checkbox.label+'_'+checkbox.value" :disabled="checkbox.disabled">
                                <i v-if="checkbox.icon" :type="checkbox.icon"></i>
                                <span>{{checkbox.label}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                        <DatePicker v-else-if="item.type ==='DatePicker'" :type="item.pickerType" v-model="item.value"
                                :disabled="item.disabled" :format="item.format" :placeholder="item.placeholder"
                                :style="{width: item.width}"
                                @on-change="handleDatePickerEvent(item, 'on-'+item.field+'-change', $event, $event)"
                                @on-open-change="handleDatePickerEvent(item, 'on-'+item.field+'-open-change', $event)"
                                @on-ok="handleDatePickerEvent(item, 'on-'+item.field+'-ok')"
                                @on-clear="handleDatePickerEvent(item, 'on-'+item.field+'-clear')" />
                        <TimePicker v-else-if="item.type==='TimePicker'" :type="item.pickerType" v-model="item.value"
                                :disabled="item.disabled" :format="item.format" :placeholder="item.placeholder"
                                :style="{width: item.width}"
                                @on-change="handleTimePickerEvent(item, 'on-'+item.field+'-change', $event)"
                                @on-open-change="handleTimePickerEvent(item, 'on-'+item.field+'-open-change', $event)"
                                @on-ok="handleTimePickerEvent(item, 'on-'+item.field+'-ok')"
                                @on-clear="handleTimePickerEvent(item, 'on-'+item.field+'-clear')" />
                        <el-select v-else-if="item.type === 'Select'" :multiple="item.multiple" :disabled="item.disabled"
                                v-model="item.value" :style="{width: item.width}" :placeholder="item.placeholder"
                                @on-change="handleSelectEvent(item, 'on-'+item.field+'-change', $event)"
                                @on-query-change="handleSelectEvent(item, 'on-'+item.field+'-query-change', $event)"
                                @on-clear="handleSelectEvent(item, 'on-'+item.field+'-clear')"
                                @on-open-change="handleSelectEvent(item, 'on-'+item.field+'-open-change', $event)">
                            <template v-if="item.groups">
                                <el-option-group v-for="(group,i) in item.groups" :label="group.label"
                                        :key="'group_'+i+'_'+group.value">
                                    <el-option v-for="opt in group.options" :key="opt.label+'_'+opt.value" :value="opt.value">{{opt.label}}
                                    </el-option>
                                </el-option-group>
                            </template>
                            <template v-if="item.options">
                                <el-option v-for="option in item.options" :value="option.value"
                                        :label="option.label" :disabled="option.disabled" :key="option.label+'_'+option.value" />
                            </template>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="handleSubmit">{{(config.submitText) || '查询'}}</el-button>
                </el-form-item>
            </el-form>
            <el-input v-else v-model="richInputValue" :style="{width: config.miniSearch.richInput.width, float: 'right'}">
            <el-select v-model="richInputKey" slot="prepend" :style="{width: config.miniSearch.richInput.options.width}">
                <el-option v-for="(option,i) in config.miniSearch.richInput.options.items" :value="option.value"
                        :key="'option_'+i+'_'+option.value">{{option.label}}
                </el-option>
            </el-select>
            <el-button slot="append" icon="ios-search" @click="handleSearch"></el-button>
            </el-input>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { parseTime } from '../../../../../utils/index.js';

export default {
    name: 'mToolbar',
    data() {
        return {
            richInputValue: '',
            richInputKey: ''
        };
    },
    props: {
        config: Object,
        showSearch: {
            type: Boolean,
            default: false
        },
        showCustomSearch: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick(event) {
            this.$emit('on-button-click', event);
        },
        handleInputEvent(item, event, param) {
            if (event) {
                this.$emit('input-event-bus', event, item, param);
            } else {
                this.$emit('input-event-bus', event, item);
            }
        },
        handleInputNumberEvent(item, event, param) {
            if (param) {
                this.$emit('input-number-event-bus', event, item, param);
            } else {
                this.$emit('input-number-event-bus', event, item);
            }
        },
        handleRadioGroupEvent(item, event, param) {
            this.$emit('radio-group-event-bus', event, item, param);
        },
        handleCheckboxGroupEvent(item, event, param) {
            this.$emit('checkbox-group-event-bus', event, item, param);
        },
        handleDatePickerEvent(item, event, param1, param2) {
            if (param1) {
                if (param2) {
                    this.$emit('date-picker-event-bus', event, item, param1, param2);
                } else {
                    this.$emit('date-picker-event-bus', event, item, param1);
                }
            } else {
                this.$emit('date-picker-event-bus', event, item);
            }
        },
        handleTimePickerEvent(item, event, param) {
            if (param) {
                this.$emit('time-picker-event-bus', event, item, param);
            } else {
                this.$emit('time-picker-event-bus', event, item);
            }
        },
        handleSelectEvent(item, event, param) {
            if (param) {
                this.$emit('select-event-bus', event, item, param);
            } else {
                this.$emit('select-event-bus', event, item);
            }
        },
        getCondition(config) {
            let arr = '{';
            config.miniSearch.items.map(item => {
                if (item.value && (item.value !== '' || item.value.length !== 0)) {
                    if (item.type === 'DatePicker' || item.type === 'TimePicker') {
                        if (item.pickerType === 'daterange' || item.pickerType === 'datetimerange') {
                            item.value[0] = item.value[0] ? parseTime(item.value[0], item.format) : '';
                            item.value[1] = item.value[1] ? parseTime(item.value[1], item.format) : '';
                        } else {
                            item.value = item.value ? parseTime(item.value, item.format) : '';
                        }
                    }
                    arr += '"' + item.field + '":"' + item.value + '",';
                }
            });
            if (arr === '{') return {};
            arr = arr.substring(0, arr.lastIndexOf(',')) + '}';
            return JSON.parse(arr);
        },
        handleSubmit() {
            let validate = !this.needValidation;
            if (this.needValidation) {
                this.$refs['formData'].validate(valid => {
                    if (valid) {
                        validate = valid;
                    }
                });
            }
            if (validate) {
                this.$emit('on-submit', this.getCondition(this.config));
            }
        },
        handleSearch() {
            this.$emit('on-submit', JSON.parse(`{"${this.richInputKey}":"${this.richInputValue}"}`));
        }
    }
};
</script>
<style lang="less">
#mToolbar {
    .m-form-item {
        margin-bottom: 0;
    }

    .m-form-inline .m-form-item {
        margin-right: 0;
    }
}
</style>