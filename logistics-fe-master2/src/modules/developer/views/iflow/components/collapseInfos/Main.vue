<template>
    <div class="collapseInfos">
        <el-collapse class="detail-collapse work-info" v-model="collapseValue" v-if="isFold">
            <el-collapse-item v-for="(item, index) in infosarr" :key="index" :name="item.name" >
                <template slot="title">{{item.title}}</template>
                <template v-if="item.type === 'text'">
                    <el-row>
                        <el-col v-for="(information, index) in item.contents" :key="index" class="info" :span="information.span ? information.span : 6">
                            <span class="info-name">{{information.lable}}：</span>{{information.value}}
                        </el-col>
                    </el-row>
                </template>
                <template v-else-if="item.type === 'form'">
                    <el-form :inline="true" :model="formData" :rules="verification" ref="ruleForm" :label-position="item.labelPosition" class="query-left">
                        <el-col :span="item.span ? item.span : 6" v-for="(item, index) in item.contents" :key="index" :class="{ checkactive: infos[0].activerules ? true : false }">
                        <el-form-item  :label="item.type==='checkBox'?'':item.lable" :prop="item.prop" :class="{ 'form-class': item.type!=='checkBox' }">
                            <el-checkbox v-if="item.type==='checkBox'" :disabled="item.editAble===false ? true : false">{{item.lable}}</el-checkbox>
                            <div v-else-if="item.type==='searchInput'">
                                <el-input v-model="formData[item.prop]"
                                :disabled="item.editAble===false ? true : false"
                                    placeholder="" :style="{width: item.width}">
                                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                                </el-input>
                            </div>
                            <el-date-picker
                                    v-else-if="item.type === 'datetime'"
                                    v-model="formData[item.prop]"
                                    size="mini"
                                    :clearable="true"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    :disabled="item.editAble===false ? true : false"
                                    :placeholder="item.name">
                            </el-date-picker>
                            <el-date-picker
                             v-else-if="item.type === 'date'"
                                v-model="formData[item.prop]"
                                type="date"
                                :disabled="item.editAble===false ? true : false"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                             <el-date-picker
                             v-else-if="item.type === 'month'"
                                v-model="formData[item.prop]"
                                type="month"
                                :disabled="item.editAble===false ? true : false"
                                format="yyyy-MM"
                                value-format="yyyy-MM"
                                placeholder="选择日期">
                            </el-date-picker>
                                <template v-else-if="item.type==='select'">
                                    <el-select v-model="formData[item.prop]" placeholder="请选择"
                                    clearable
                                    @change="dropDownChange(item)"
                                        :disabled="item.editAble===false ? true : false">
                                        <el-option
                                            v-for="item in item.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                                <div class="el-input advanceActive" v-else-if="item.type === 'advance'">
                                <el-input
                                    :placeholder=item.name
                                    clearable
                                    v-model="formData[item.prop]"
                                    :disabled="item.editAble===false ? true : false"
                                    @keyup.113.native="detaliSearch(index,item)"
                                    @keyup.enter.native="detaliSearch(index,item)"
                                    @blur="detaliSearchBlur(index,item)"
                                    @clear="advanceCodeChange(index, item)"
                                    @input="advanceCodeChange(index, item)">
                                    >
                            <el-button slot="append" :disabled="item.editAble===false ? true : false" @click="detaliSearch(index,item)" icon="el-icon-search"></el-button>
                                </el-input>
                                </div>
                            <el-switch v-else-if="item.type === 'switch'" v-model="formData[item.prop]" class="demo"
                             :active-value="item.activeValue?item.activeValue:'Y'" :inactive-value="item.inactiveValue?item.inactiveValue:'N'">
                            </el-switch>
                            <div v-else-if="item.type==='textareaInput'">
                                <el-input v-model="formData[item.prop]" type="textarea"
                                :disabled="item.editAble===false ? true : false"
                                 placeholder="" :style="{width: item.width}">
                                </el-input>
                            </div>
                            <div v-else-if="item.type==='nullSpan'" style="height:31px;">
                            </div>
                            <el-input v-else :maxlength="item.maxlength ? item.maxlength : 10000" v-model="formData[item.prop]" :type="item.hidden ? 'hidden' : 'input'"
                                :disabled="item.editAble===false ? true : (item.showTime ? (formData[item.prop] ? true : false) : false)" @keyup.native="donput(item)"></el-input>
                        </el-form-item>
                        </el-col>
                    </el-form>
                </template>
            </el-collapse-item>
        </el-collapse>
        <div class="cllisFold detail-collapse work-info" style="overflow: hidden;" v-else>
            <div class="cllisfolelc" v-for="(item, index) in infosarr" :key="index" :name="item.name">
                <template v-if="item.type === 'text'">
                    <el-row>
                        <el-col v-for="(information, index) in item.contents" :key="index" class="info" :span="information.span ? information.span : 6">
                            <span class="info-name">{{information.lable}}：</span>{{information.value}}
                        </el-col>
                    </el-row>
                </template>
                <template v-else-if="item.type === 'form'">
                    <el-form :inline="true" :model="formData" :rules="verification" ref="ruleForm" :label-position="item.labelPosition" class="query-left">
                        <el-col :span="item.span ? item.span : 6" v-for="(item, index) in item.contents" :key="index" :class="{ checkactive: infos[0].activerules ? true : false }">
                        <el-form-item  :label="item.type==='checkBox'?'':item.lable" :prop="item.prop" :class="{ 'form-class': item.type!=='checkBox' }">
                            <el-checkbox v-if="item.type==='checkBox'" :disabled="item.editAble===false ? true : false">{{item.lable}}</el-checkbox>
                            <div v-else-if="item.type==='searchInput'">
                                <el-input v-model="formData[item.prop]"
                                :disabled="item.editAble===false ? true : false"
                                    placeholder="" :style="{width: item.width}">
                                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                                </el-input>
                            </div>
                            <el-date-picker
                                    v-else-if="item.type === 'datetime'"
                                    v-model="formData[item.prop]"
                                    size="mini"
                                    :clearable="true"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    :disabled="item.editAble===false ? true : false"
                                    :placeholder="item.name">
                            </el-date-picker>
                            <el-date-picker
                            v-else-if="item.type === 'date'"
                                v-model="formData[item.prop]"
                                type="date"
                                :disabled="item.editAble===false ? true : false"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                            <el-date-picker
                            v-else-if="item.type === 'month'"
                                v-model="formData[item.prop]"
                                type="month"
                                :disabled="item.editAble===false ? true : false"
                                format="yyyy-MM"
                                value-format="yyyy-MM"
                                placeholder="选择日期">
                            </el-date-picker>
                                <template v-else-if="item.type==='select'">
                                    <el-select v-model="formData[item.prop]" placeholder="请选择"
                                    clearable
                                    @change="dropDownChange(item)"
                                        :disabled="item.editAble===false ? true : false">
                                        <el-option
                                            v-for="item in item.options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                                <div class="el-input advanceActive" v-else-if="item.type === 'advance'">
                                <el-input
                                    :placeholder=item.name
                                    clearable
                                    v-model="formData[item.prop]"
                                    :disabled="item.editAble===false ? true : false"
                                    @keyup.113.native="detaliSearch(index,item)"
                                    @keyup.enter.native="detaliSearch(index,item)"
                                    @blur="detaliSearchBlur(index,item)"
                                    @clear="advanceCodeChange(index, item)"
                                    @input="advanceCodeChange(index, item)">
                                    >
                            <el-button slot="append" :disabled="item.editAble===false ? true : false" @click="detaliSearch(index,item)" icon="el-icon-search"></el-button>
                                </el-input>
                                </div>
                            <el-switch v-else-if="item.type === 'switch'" v-model="formData[item.prop]" class="demo"
                            :active-value="item.activeValue?item.activeValue:'Y'" :inactive-value="item.inactiveValue?item.inactiveValue:'N'">
                            </el-switch>
                            <div v-else-if="item.type==='textareaInput'">
                                <el-input v-model="formData[item.prop]" type="textarea"
                                :disabled="item.editAble===false ? true : false"
                                placeholder="" :style="{width: item.width}">
                                </el-input>
                            </div>
                            <div v-else-if="item.type==='nullSpan'" style="height:31px;">
                            </div>
                            <el-input v-else :maxlength="item.maxlength ? item.maxlength : 10000" v-model="formData[item.prop]" :type="item.hidden ? 'hidden' : 'input'"
                                :disabled="item.editAble===false ? true : (item.showTime ? (formData[item.prop] ? true : false) : false)" @keyup.native="donput(item)"></el-input>
                        </el-form-item>
                        </el-col>
                        <slot name="footer"></slot>
                    </el-form>
                </template>
        </div>
        </div>
        <m-advanced-search ref="detaliTable"
            @detali-search-sure="detaliSearchSure"
            @detali-search-cel="detaliSearchSel"
            :advancePrefix="advancePrefix"
            :advanceUrl="advanceUrl"
            :advanceLabel="advanceLabel"
            ></m-advanced-search>
    </div>
</template>
<script>
import mAdvancedSearch from '../mAdvancedSearch';
import { getDicts } from '../../../../api/iflow-common.js';
export default {
    components: { mAdvancedSearch },
    props: {
        infos: {
            type: Array,
            default() {
                return [];
            }
        },
        formData: {
            type: Object,
            default() {
                return {};
            }
        },
        listparams: {
            type: Object,
            default() {
                return {};
            }
        },
        optionNum: {
            type: String,
            default() {
                return '';
            }
        },
        advancePrefix: {
            type: String,
            default() {
                return 'api-mdm';
            }
        },

        isFold: {
            type: Boolean,
            default() {
                return true;
            }
        }
    },
    data() {
        return {
            collapseValue: [],
            addable: false,
            detaliTable: false,
            advanceUrl: '',
            advanceLabel: '',
            advanceCode: '',
            advanceProp: '',
            options: [],
            verification: {},
            infosarr: this.infos,
            ajaxType: '',
            acceptParams: {},
            executestatus: true
        };
    },
    methods: {
        donput(item) {
            this.$emit('inputChange', item);
        },
        detaliSearchSel() {
            // this.$emit('detali-search-cel');
            this.$refs.detaliTable.showState = false;
        },
        editStatus() {
            this.addable = true;
            this.infos[0].type = 'form';
        },
        showStatus() {
            this.addable = false;
            this.infos[0].type = 'text';
        },
        onsave() {
            const ruleForm = this.$refs.ruleForm;
            let count = 0;
            if (ruleForm.length > 1) {
                for (let i = 0; i < ruleForm.length; i++) {
                    ruleForm[i].validate((valid) => {
                        if (valid) {
                        } else {
                            count++;
                            return false;
                        }
                    });
                }
                if (count === 0) {
                    this.$emit('savedData', this.formData);
                }
            } else {
                ruleForm[0].validate((valid) => {
                    if (valid) {
                        this.$emit('savedData', this.formData);
                    } else {
                        return false;
                    }
                });
            }
        },
        dropDownChange(data) {
            const prop = data.prop;
            const code = this.formData[data.prop];
            this.$emit('dropDownChange', prop, code);
        },
        isEditAble(arr, status) {
            const optionProps = Array.isArray(arr) ? arr : [];
            for (let i = 0; i < optionProps.length; i++) {
                this.infosarr.map(item => {
                    item.contents.map(sitem => {
                        if (sitem.prop === optionProps[i]) {
                            if (status) {
                                sitem.editAble = true;
                            } else {
                                sitem.editAble = false;
                            }
                        }
                    });
                });
            }
        },
        advanceCodeChange(index, current) {
            this.$set(this.formData, current.advanceCode, '');
            this.$set(this.formData, current.advanceCode, '');
            // this.formData[current.advanceCode] = '';
        },
        detaliSearchSure(data, code, row) {
            if (this.advanceCode) {
                if (data !== '' && code !== '') {
                    this.$set(this.formData, this.advanceCode, code);
                    this.$set(this.formData, this.advanceProp, data);
                    this.$emit('onSetValue', row, this.advanceProp);
                }
            } else {
                this.formData[this.advanceProp] = data;
            }
        },
        detaliSearchBlur(index, current) {
            const searchData = this.formData[current.prop] ? this.formData[current.prop].replace(/\s*/g, '') : '';
            if (searchData !== '') {
                this.detaliSearch(index, current);
            }
        },
        getAcceptParams(data) {
            this.acceptParams = data;
        },
        detaliSearch(index, current, satusid) {
            this.acceptParams = {};
            if (current.preSetValue) {
                this.$emit('onBeforeOpen', current.prop);
            }
            let value = null;
            let code = null;
            this.advanceUrl = current.advanceUrl;
            this.ajaxType = current.ajaxType;
            // this.advancePrefix = current.advancePrefix;
            current.advancePrefix = current.advancePrefix === undefined ? 'api-mdm' : current.advancePrefix;
            this.advanceLabel = current.lable ? current.lable : current.name;
            this.advanceCode = current.advanceCode;
            this.advanceProp = current.prop;
            value = this.formData[current.prop];
            if (this.formData[current.advanceCode]) {
                code = this.formData[current.advanceCode];
            }
            if (satusid === 1) {
                this.$refs.detaliTable.showState = true;
                this.$refs.detaliTable.inquire(this.advanceUrl, value, current, true, code, this.ajaxType, this.acceptParams);
            } else {
                this.$refs.detaliTable.showState = true;
                this.$refs.detaliTable.inquire(this.advanceUrl, value, current, true, code, this.ajaxType, this.acceptParams);
            }
        },
        getDict(dictCode) {
            const params = {
                dictCodes: dictCode
            };
            getDicts(params).then(res => {
                if (res) {
                    this.infos.map(item => {
                        if (item.type === 'form') {
                            item.contents.map(sitem => {
                                if (sitem.type === 'select') {
                                    if (sitem.prop !== 'fetchAllotNo') {
                                        sitem.options = [];
                                        // for (const key in res.data[sitem.optionNum]) {
                                        Object.keys(res.data[sitem.optionNum]).forEach(key => {
                                            sitem.value = key;
                                            sitem.options.push({
                                                label: res.data[sitem.optionNum][key],
                                                value: key
                                            });
                                            this.$set(this.infos, sitem, sitem.options);
                                        });
                                    }
                                }
                            });
                        } else if (item.type === 'text') {
                            item.contents.map(sitem => {
                                if (sitem.type === 'select') {
                                    for (const key in res.data[sitem.optionNum]) {
                                        if (sitem.value === key) {
                                            sitem.value = res.data[sitem.optionNum][key];
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    watch: {
        formData: function() {
            if (this.optionNum !== '' && this.executestatus) {
                this.getDict(this.optionNum);
                this.executestatus = false;
            };
        }
    },
    created() {
        for (let i = 0; i < this.infos.length; i++) {
            if (!this.infos[i].noShowFold) {
                this.collapseValue.push(this.infos[i].name);
            }
        }
        const mustArray = [];
        this.infos.map(item => {
            item.contents.map(sitem => {
                if (sitem.mustFill) {
                    mustArray.push(sitem);
                }
            });
        });
        const rulesObject = this.verification;
        if (mustArray.length >= 0) {
            for (let i = 0; i < mustArray.length; i++) {
                const messageName = '请输入' + mustArray[i].lable;
                rulesObject[mustArray[i].prop] = { type: 'string', required: true, message: messageName, trigger: ['blur', 'change'] };
            }
        }
        if (this.optionNum !== '') {
            this.getDict(this.optionNum);
        };
    }
};
</script>
<style lang="less">
    @import './collapseInfos.less';
</style>
