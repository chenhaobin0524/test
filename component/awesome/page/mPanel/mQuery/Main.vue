<template>
    <div id="mQuery">
        <el-form :style="{maxHeight: collapse[collapseType].maxHeight, overflow: collapse[collapseType].overflow}"
                class="collapse-form" ref="formData" :label-width="config && config.labelWidth || '80'"
                :label-position="config && config.labelAlign || 'right'" :model="config">
            <el-row v-for="(rowIndex, i) in config.rows" :key="'row_'+i">
                <template  v-for="(item,index) in config.items">
                    <el-col :key="'col_'+index" v-if="item.layout.row===rowIndex" :span="item.layout.span">
                        <el-form-item v-if="!item.hide" :label-width="item.labelWidth || '100px'" :label="item.label"
                                :required="(item.validators&&item.validators.length>0)?true:false" :rules="item.validators"
                                :prop="'items.' + index + '.value'">
                            <el-input size="small" v-if="item.type==='Input'" v-model="item.value" :readonly="item.readonly"
                                    :icon="item.icon" :type="item.rows===1?'text':'textarea'" :rows="item.rows" :disabled="item.disabled"
                                    :placeholder="item.placeholder" :style="{width: item.layout.width}"
                                    @on-enter="handleInputEvent(item, 'on-'+item.field+'-enter')"
                                    @on-click="handleInputEvent(item, 'on-'+item.field+'-click')"
                                    @on-change="handleInputEvent(item, 'on-'+item.field+'-change', $event)"
                                    @on-focus="handleInputEvent(item, 'on-'+item.field+'-focus')"
                                    @on-blur="handleInputEvent(item, 'on-'+item.field+'-blur')"
                                    @on-keyup="handleInputEvent(item, 'on-'+item.field+'-keyup', $event)"
                                    @on-keydown="handleInputEvent(item, 'on-'+item.field+'-keydown', $event)"
                                    @on-keypress="handleInputEvent(item, 'on-'+item.field+'-keypress', $event)" />
                            <el-input-number size="small" v-else-if="item.type==='InputNumber'" v-model="item.value"
                                    :readonly="item.readonly" :max="item.max ? Infinity : item.max"
                                    :min="item.min ? -Infinity : item.min" :step="item.step" :style="{width: item.layout.width}"
                                    :editable="item.editable" :disabled="item.disabled"
                                    @on-change="handleInputNumberEvent(item, 'on-'+item.field+'-change', $event)"
                                    @on-focus="handleInputNumberEvent(item, 'on-'+item.field+'-focus', $event)"
                                    @on-blur="handleInputNumberEvent(item, 'on-'+item.field+'-blur')" />
                            <el-radio-group size="small" v-else-if="item.type==='RadioGroup'" v-model="item.value"
                                    :vertical="item.vertical"
                                    @on-change="handleRadioGroupEvent(item, 'on-'+item.field+'-change', $event)">
                                <el-radio size="small" v-for="radio in item.options" :label="radio.value"
                                        :key="radio.label+'_'+radio.value" :disabled="radio.disabled">
                                    <i v-if="radio.icon" :type="radio.icon"></i>
                                    <span>{{radio.label}}</span>
                                </el-radio>
                            </el-radio-group>
                            <el-checkbox-group size="small" v-else-if="item.type==='CheckboxGroup'" v-model="item.value"
                                    @on-change="handleCheckboxGroupEvent(item, 'on-'+item.field+'-change', $event)">
                                <el-checkbox size="small" v-for="checkbox in item.options" :label="checkbox.value"
                                        :key="checkbox.label+'_'+checkbox.value" :disabled="checkbox.disabled">
                                    <i v-if="checkbox.icon" :type="checkbox.icon"></i>
                                    <span>{{checkbox.label}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-date-picker size="small" v-else-if="item.type ==='DatePicker'" :type="item.pickerType"
                                    v-model="item.value" :disabled="item.disabled" :format="item.format" :placeholder="item.placeholder"
                                    :style="{width: item.layout.width}"
                                    @on-change="handleDatePickerEvent(item, 'on-'+item.field+'-change', $event, $event)"
                                    @on-open-change="handleDatePickerEvent(item, 'on-'+item.field+'-open-change', $event)"
                                    @on-ok="handleDatePickerEvent(item, 'on-'+item.field+'-ok')"
                                    @on-clear="handleDatePickerEvent(item, 'on-'+item.field+'-clear')" />
                            <el-time-picker size="small" v-else-if="item.type==='TimePicker'" :type="item.pickerType"
                                    v-model="item.value" :disabled="item.disabled" :format="item.format" :placeholder="item.placeholder"
                                    :style="{width: item.layout.width}"
                                    @on-change="handleTimePickerEvent(item, 'on-'+item.field+'-change', $event)"
                                    @on-open-change="handleTimePickerEvent(item, 'on-'+item.field+'-open-change', $event)"
                                    @on-ok="handleTimePickerEvent(item, 'on-'+item.field+'-ok')"
                                    @on-clear="handleTimePickerEvent(item, 'on-'+item.field+'-clear')" />
                            <el-select size="small" v-else-if="item.type==='Select'" :multiple="item.multiple" :disabled="item.disabled"
                                    v-model="item.value" :style="{width: item.layout.width}"
                                    @on-change="handleSelectEvent(item, 'on-'+item.field+'-change', $event)"
                                    @on-query-change="handleSelectEvent(item, 'on-'+item.field+'-query-change', $event)"
                                    @on-clear="handleSelectEvent(item, 'on-'+item.field+'-clear')"
                                    @on-open-change="handleSelectEvent(item, 'on-'+item.field+'-open-change', $event)">
                                <el-option v-for="option in item.options" :value="option.value" :label="option.label" :disabled="option.disabled" :key="option.label+'_'+option.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
        </el-form>
        <el-row>
            <el-col :span="8">
                <a class="btn-collapse" href="javascript: void(0)" @click="handleCollapse">
                    <el-row>
                        <el-col :span="16" style="text-align: center">{{collapse[collapseType].text}}</el-col>
                        <el-col :span="8">
                          <i :type="collapse[collapseType].icon"></i>
                        </el-col>
                    </el-row>
                </a>
            </el-col>
            <el-col :span="16">
                <el-button size="small" type="primary" @click="handleSubmit">{{(config.buttons&&config.buttons.submitText) || '查询'}}
                </el-button>
                <el-popover placement="bottom-end" title="该操作会清空当前查询条件，确定继续吗？" width="200" confirm @on-ok="handleReset">
                    <el-button size="small" type="ghost">{{(config.buttons&&config.buttons.resetText) || '重置'}}</el-button>
                </el-popover>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { parseTime } from '../../../../../utils/index.js';

export default {
    name: 'mQuery',
    data() {
        return {
            collapse: {
                up: {
                    text: '收起',
                    icon: 'chevron-up',
                    maxHeight: '200px',
                    overflow: 'visible'
                },
                down: {
                    text: '展开',
                    icon: 'chevron-down',
                    maxHeight: '42px',
                    overflow: 'hidden'
                }
            },
            collapseType: 'up'
        };
    },
    props: {
        config: Object
    },
    methods: {
        getCondition(config) {
            let arr = '{';
            config.items.map(item => {
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
        handleReset() {
            this.$refs['formData'].resetFields();
        },
        handleCollapse() {
            if (this.collapseType === 'up') {
                this.collapseType = 'down';
            } else {
                this.collapseType = 'up';
            }
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
        }
    }
};

</script>
<style lang="less">
#mQuery {
    .collapse-form {
        transition: max-height .5s;
        -moz-transition: max-height .5s;
        /* Firefox 4 */
        -webkit-transition: max-height .5s;
        /* Safari 和 Chrome */
        -o-transition: max-height .5s;
        /* Opera */
    }

    .btn-collapse {
        display: block;
        margin-left: 20px;
        margin-top: 3px;
    }

    .m-form-item {
        margin-bottom: 12px;
    }
}

</style>
