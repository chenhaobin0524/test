<template>
    <div id="dateDialog">
        <slot name="myHeader"></slot>
        <el-row
            :class="{rowMar:type=='normal'}"
            :inline="dialogForm.inline"
            :model="formValue"
            :rules="rules"
            :gutter="gutter"
        >
            <el-col
                v-for="(item,index) in dialogForm.inputList"
                :key="index"
                :prop="item.value"
                :span="item.span"
            >
                <el-col
                    :span="item.labelWidth || dialogForm.labelWidth"
                    :class="{rowMar:type=='date','txtRgt':dialogForm.labelEnd}"
                >
                    <span class="label" :class="{mustFillLabel:item.mustFill}">{{item.label}}</span>
                </el-col>
                <el-col :span="item.inputWidth || dialogForm.inputWidth" :class="{rowMar:type=='date'}">
                    <el-input
                        :placeholder="item.placeholder?item.placeholder:'请输入'+item.label"
                        v-model="formValue[item.value]"
                        v-if="item.type==='text'"
                        :readonly="item.readOnly"
                        :disabled="item.disabled"
                        :class="{mustFill:item.mustFill&&!formValue[item.value]&&showMustFill}"
                        @input="dialogCheck(formValue[item.value],item)"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            v-if="item.endIcon"
                            @click="search"
                        ></el-button>
                    </el-input>
                    <el-select
                        :placeholder="item.placeholder?item.placeholder:'请选择'+item.label"
                        :class="{mustFill:item.mustFill&&!formValue[item.value]&&showMustFill}"
                        v-else-if="item.type==='select'"
                        v-model="formValue[item.value]"
                        style="width:100%;"
                        :disabled="item.readOnly"
                        :clearable="true"
                        @change="dialogCheck(formValue[item.value],item)"
                    >
                        <el-option
                            v-for="(option,index) in item.options"
                            :key="index"
                            :label="option.label"
                            :value="option.value"
                        ></el-option>
                    </el-select>
                    <el-switch
                        v-else-if="item.type==='switch'"
                        v-model="formValue[item.value]"
                        :disabled="item.change"
                        @change="switchChange($event, item.value)"></el-switch>
                    <el-date-picker
                        v-else-if="item.type==='datePicker'"
                        :type="item.key"
                        :disabled="item.readOnly"
                        :placeholder="item.label"
                        :start-placeholder="item.startPlaceholder"
                        :class="{mustFill:item.mustFill&&!formValue[item.value]&&showMustFill}"
                        :end-placeholder="item.endPlaceholder"
                        v-model="formValue[item.value]"
                        @change="dialogCheck(formValue[item.value],item)"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                    <el-cascader
                        v-else-if="item.type==='cascader'"
                        :options="item.options"
                        :disabled="item.readOnly"
                        :class="{mustFill:item.mustFill&&!formValue[item.value]&&showMustFill}"
                        v-model="formValue[item.value]"
                        @change="dialogCheck(formValue[item.value],item)"
                        :placeholder="item.label"
                    ></el-cascader>
                    <otpAdvance
                        v-else-if="item.type==='advance'"
                        :params="item"
                        :disabled="item.readOnly"
                        @getAdvanceValue="getAdvanceValue"
                        :mValue="formValue[item.value]"
                        :formData="formValue"
                        :class="{mustFill:item.mustFill&&!formValue[item.value]&&showMustFill}"
                    ></otpAdvance>
                    <otpSelect
                        v-else-if="item.type==='dictionary'"
                        :disabled="item.readOnly"
                        :mValue="formValue[item.value]"
                        :optionNum="item.optionNum"
                        :optionArr="item.options"
                        :class="{mustFill:item.mustFill&&!formValue[item.value]&&showMustFill}"
                        :prop="item.value"
                        @change="dialogCheck(formValue[item.value],item)"
                        @getSelectValue="getSelectValue"
                    ></otpSelect>
                    <!-- <otpAllAddressSelect
                        :disabled="item.readOnly"
                        v-else-if="item.type==='addressSelect'"
                        :class="{mustFill:item.mustFill&&!formValue[item.value]&&showMustFill}"
                        :mValue="formValue[item.value]"
                        :prop="item.value"
                        :minLayers="item.minLayers"
                        :labelName="item.labelCn"
                        @getAddress="getAddress"
                    ></otpAllAddressSelect> -->
                    <otpAllAddressSelect
                        :disabled="item.readOnly"
                        v-else-if="item.type==='addressSelect'"
                        :class="{mustFill:item.mustFill&&!(formValue[item.value]&&formValue[item.value].length)&&showMustFill}"
                        v-model="formValue[item.value]"
                        :basicProps="item.config"
                        :minLayers="item.minLayers"
                        @getAddress="getAddress"
                    ></otpAllAddressSelect>
                    <el-radio-group v-model="formValue[item.value]" v-else-if="item.type==='radio'" @change="dialogCheck(formValue[item.value],item)">
                        <el-radio v-for="(item,index) in item.options" :key="index" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                    <el-time-picker
                        v-else-if="item.type==='timePicker'"
                        :disabled="item.disabled"
                        v-model="formValue[item.value]"
                        :class="{mustFill:item.mustFill&&!formValue[item.value]&&showMustFill}"
                        :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                        @change="dialogCheck(formValue[item.value],item)"
                        :placeholder="item.placeholder?item.placeholder:'请选择'+item.label">
                    </el-time-picker>
                </el-col>
            </el-col>
            <el-col class="btnList" :span="dialogForm.btnSpan">
                <el-button
                    v-for="item in dialogForm.actBtn"
                    :key="item"
                    type="primary"
                    @click="dialogCheck(formValue[item.value],item)"
                >{{item}}</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import otpSelect from '@/components/lots/otpSelect';
import otpAdvance from '@/components/lots/otpAdvance';
// import otpAllAddressSelect from '@/components/lots/otpAllAddressSelect';
import otpAllAddressSelect from '@/components/lots/otpCascader2';
export default {
    data() {
        return {
            formValue: {},
            rules: {},
            showMustFill: false
        };
    },
    created() {
        this.formValue = { ...this.formValue, ...this.mFormValue };
        this.rulesInit();
    },
    props: {
        dialogForm: Object,
        gutter: [Number, String],
        type: String,
        mFormValue: Object
    },
    watch: {
        mFormValue() {
            this.formValue = this.mFormValue;
        }
    },
    components: { otpSelect, otpAdvance, otpAllAddressSelect },
    methods: {
        search() {
            this.$emit('search', 123);
        },
        classification(item, statusKey, status, key, arr, logic) {
            const flagArr = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].indexOf('!=') !== -1) {
                    const val = arr[i].split('!=')[1];
                    if (!logic || logic !== '&&') {
                        if (val !== this.formValue[key]) {
                            item[status] = true;
                            return item;
                        }
                    } else {
                        if (val === this.formValue[key]) {
                            flagArr.push(false);
                        } else {
                            flagArr.push(true);
                        }
                    }
                } else {
                    if (!logic || logic !== '&&') {
                        if (arr[i] === this.formValue[key]) {
                            item[status] = true;
                            return item;
                        }
                    } else {
                        if (arr[i] !== this.formValue[key]) {
                            flagArr.push(false);
                        } else {
                            flagArr.push(true);
                        }
                    }
                }
            }
            let flag = false;
            flagArr.map((item, index) => {
                if (index === 0) {
                    flag = item;
                } else {
                    flag = flag || item;
                }
            });
            item[status] = flag;
            return item;
        },
        mulcon(item, statusKey, status, key, logic) {
            if (item[statusKey][key].indexOf('|') !== -1) {
                const arr = item[statusKey][key].split('|');
                item = this.classification(item, statusKey, status, key, arr, logic);
                if (logic && logic === '&&') {
                    if (!item[status]) {
                        return item;
                    }
                } else {
                    if (item[status]) {
                        return item;
                    }
                }
            } else {
                item = this.classification(item, statusKey, status, key, [item[statusKey][key]], logic);
                if (logic && logic === '&&') {
                    if (!item[status]) {
                        return item;
                    }
                } else {
                    if (item[status]) {
                        return item;
                    }
                }
            }
            return item;
        },
        changeState(item, statusKey, status) {
            const flagArr = [];
            if (item[statusKey]) {
                for (const key in item[statusKey]) {
                    if (item[statusKey].hasOwnProperty(key)) {
                        if (key !== 'logic') {
                            item = this.mulcon(item, statusKey, status, key, item[statusKey].logic);
                            if (item[statusKey].logic && item[statusKey].logic === '&&') {
                                if (!item[status]) {
                                    flagArr.push(false);
                                } else {
                                    flagArr.push(true);
                                }
                            } else {
                                if (item[status]) {
                                    return item;
                                }
                            }
                        }
                    }
                }
            }
            if (item[statusKey] && item[statusKey].logic && item[statusKey].logic === '&&') {
                let flag = false;
                if (flagArr.length) {
                    flagArr.map((item, index) => {
                        if (index === 0) {
                            flag = item;
                        } else {
                            flag = flag && item;
                        }
                    });
                }
                item[status] = flag;
                return item;
            }
            return item;
        },
        changeShowMustFill() {
            let flag = false;
            this.dialogForm.inputList.map(item => {
                item = this.changeState(item, 'mustFillRelyOn', 'mustFill');
                if (item.mustFill) {
                    if (!this.formValue[item.value] || (!this.formValue[item.value].length && Object.prototype.toString.call(this.formValue[item.value]) !== '[object Date]')) {
                        flag = true;
                    }
                }
                item = this.changeState(item, 'disabledRelyOn', 'readOnly');
                if (item.valueDependentOnDisabled && item.valueDependentOnDisabled.val && item.readOnly) {
                    this.formValue[item.value] = item.valueDependentOnDisabled.setValue;
                }
            });
            return flag;
        },
        GetDateT(d) {
            var s;
            s = d.getYear() + 1900 + '-';
            s = s + (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-';
            s += d.getDate() < 10 ? '0' + d.getDate() : d.getDate() + '';
            return s;
        },
        dialogCheck(val, col) {
            // 返回form的值
            if (col && col.relyOn) {
                col.relyOn.map(item => {
                    if (item.value === 'now') {
                        this.formValue[item.field] = new Date();
                    } else {
                        if (item.value === 'date') {
                            this.formValue[item.field] = this.GetDateT(new Date());
                        } else {
                            this.formValue[item.field] = item.value;
                        }
                    }
                });
            }
            if (col && col.relyOnVlaue) {
                col.relyOnVlaue.map(item => {
                    if (val === item.value && this.formValue[item.field] === item.targetValue) {
                        this.formValue[item.field] = item.setValue;
                    }
                });
            }
            if (col && col.changeInputType) {
                col.changeInputType.map(item => {
                    this.dialogForm.inputList.map(son => {
                        if (son.value === item.field) {
                            for (const key in item.type) {
                                if (item.type.hasOwnProperty(key) && val === item.type[key]) {
                                    son.type = key;
                                }
                            }
                        }
                    });
                });
            }
            this.changeShowMustFill();
            this.$emit('dialogCheck', this.formValue, col);
        },
        rulesInit() {
            this.dialogForm.inputList.map((item, index) => {
                if (item.rules && item.rules.required) {
                    this.rules[item.value] = [];
                    this.rules[item.value].push(item.rules);
                }
            });
        },
        getSelectValue(data, label) {
            this.formValue = { ...this.formValue, ...data };
        },
        getAdvanceValue(data) {
            this.formValue = { ...this.formValue, ...data };
            this.dialogCheck();
        },
        getAddress(labels) {
            this.dialogCheck();
            if (labels) {
                this.$emit('getAddressLabels', labels);
            }
        },
        switchChange(value, prop) {
            this.$set(this.mFormValue, prop, value);
        }
    }
};
</script>

<style lang="less">
#dateDialog {
    padding: 0 16px;
    .mustFill{
        .el-input__inner{
            border:1px solid red;
        }
    }
    .mustFillLabel{
        &:before{
            content:'* ';
            color:red;
        }
    }
    .el-row {
        padding: 0 0 10px;
        .el-col {
            display: flex;
            align-items: center;
            margin-bottom: 10px !important;
            .el-icon-date,
            .el-range-separator,
            .el-range__close-icon {
                display: flex;
                align-items: center;
            }
            .el-col {
                padding: 0 !important;
                margin-top: 0 !important;
            }
        }
        .btnList {
            display: flex;
            justify-content: flex-end;
            .el-button {
                margin-left: 10px;
            }
        }
        .rowMar {
            margin-bottom: 16px;
        }
        .rowPad {
            padding: 0 20px 10px;
        }
    }
    .txtRgt {
        display: flex;
        justify-content: flex-end;
        span {
            padding-right: 10px;
        }
    }
}
</style>
