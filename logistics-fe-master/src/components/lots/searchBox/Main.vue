<template>
    <el-row type="flex" class="model-table-search btn-bg">
        <el-col :span="21">
            <el-row class="search-box">
                <el-col v-for="(item,index) in fixedList" :key="index" :span="item.span" :class="{ 'is-fussy': item.isFussy }">
                    <div class="search">
                        <el-input v-if="item.type === 'input'"
                            :placeholder="item.name"
                            :clearable="_.get(item, 'clearable', true)"
                            v-model="searchData[item.value]" @keyup.enter.native="onSearchChange()">
                        </el-input>
                        <el-select v-else-if="item.type === 'select'"
                            :clearable="_.get(item, 'clearable', true)"
                            :filterable="item.filterable"
                            v-model="searchData[item.value]"
                            :multiple="item.multiple?item.multiple:false"
                            :placeholder="item.name"
                            collapse-tags
                            @keyup.enter.native="onSearchChange()">
                            <el-option
                                v-for="(val, index) in item.options"
                                :key=index
                                :label="val.label"
                                :value="val.value">
                            </el-option>
                        </el-select>
                        <el-cascader v-else-if="item.type === 'cascader'"
                            v-model="searchData[item.value]"
                            :options="item.options"
                            collapse-tags
                            :filterable="item.filterable"
                            :change-on-select="item.changeOnSelect"
                            :placeholder="item.name">
                        </el-cascader>
                        <el-date-picker v-else-if="item.type === 'time'"
                            class='text-box'
                            v-model="searchData[item.value]"
                            size="mini"
                            :clearable="_.get(item, 'clearable', true)"
                            format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                            :type="item.time?'daterange':'datetimerange'"
                            unlink-panels
                            range-separator="至"
                            :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '开始日期'"
                            :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '结束日期'"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                        <el-input v-else-if="item.type === 'advance'"
                            :placeholder="item.name"
                            readonly
                            v-model="searchData[item.value]">
                            <el-button slot="append"
                                @click="detailSearch(index, item, 1, searchData[item.value])"
                                icon="el-icon-search"></el-button>
                            <i slot="suffix" @click="resetAdvanceParams(item.value)"
                               class="el-input__icon el-icon-circle-close" v-if="searchData[item.value]"></i>
                        </el-input>
                        <addressSelect v-else-if="item.type === 'addressSelect'"
                            v-model="searchData[item.value]"
                            :minLayers="item.minLayers"
                            :placeholder="item.name"
                            :basicProps="item.config">
                        </addressSelect>
                    </div>
                    <span class="input-append-fussy" v-if="item.isFussy">
                        <el-checkbox v-model="searchData[item.value + 'Fussy']">模糊</el-checkbox>
                    </span>
                </el-col>
                <el-col class="select-btn-box">
                    <el-button type="primary" @click="onSearchChange()" :loading="loading">查 询</el-button>
                    <advance class="advanced-btn" v-if="showAdvanceBtn" :search-key="searchKey"
                        :initialVal="searchData" :fields="fields"
                        @search="onSearchChange"></advance>
                </el-col>
            </el-row>
            <advance-dialog ref="advanceDialog" @confirm="detailSearchSure"></advance-dialog>
        </el-col>
        <el-col :span="3">
            <el-row>
                <el-col>
                    <slot name="table-module-btn"></slot>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import Advance from './Advance';
import { dictWithUrl } from '../api';
import _ from '@/components/lots/utils.js';
import addressSelect from '@/components/lots/otpCascader2';
import advanceDialog from '@/components/lots/otpAdvanceDialog';
export default {
    components: { Advance, addressSelect, advanceDialog },
    props: {
        searchKey: String,
        fields: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            searchData: {},
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const start = moment().startOf('day').subtract(6, 'd').toDate();
                        const end = moment().endOf('day').toDate();
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const start = moment().startOf('day').subtract(1, 'M').toDate();
                        const end = moment().endOf('day').toDate();
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            loading: false,
            keyMap: {}
        };
    },
    computed: {
        ...mapGetters(['currentTenant']),
        _() {
            return _;
        },
        fixedList() {
            // 默认查询的列表
            return this.fields.filter(o => o.isFixed);
        },
        showAdvanceBtn() {
            // 如果固定的搜索项小于全部的搜索项，则显示高级按钮
            return this.fixedList.length < this.fields.length;
        }
    },
    methods: {
        // 设置默认查询参数
        setQueryParams(initialVal) {
            this.searchData = Object.assign({}, this.searchData, _.clone(initialVal));
        },
        submitSearch(isExport = false) {
            return this.onSearchChange(null, isExport);
        },
        detailSearch(index, current, type, searchData) {
            // 高级搜索级联操作，current.advanceCascade为需要级联的参数的key的集合，例如advanceCascade: key1,key2,key3
            const advanceCascade = {};
            if (_.isString(current.advanceCascade)) {
                let advanceArray = [];
                advanceArray = current.advanceCascade.split(',');
                advanceArray.map((item) => {
                    let { 0: sourceProp, 1: destProp } = item.split('#');
                    destProp = destProp || sourceProp;
                    advanceCascade[destProp] = this.searchData[sourceProp];
                });
            }
            this.$refs.advanceDialog.show(true, current, advanceCascade);
        },
        detailSearchSure(data) {
            // 将返回数据添加到map里，用于高级搜索清空时，顺带清空其他关联属性
            const keyArr = Object.keys(data);
            if (keyArr.length > 0) {
                keyArr.forEach(key => {
                    this.keyMap[key] = keyArr;
                });
            }
            this.searchData = { ...this.searchData, ...data };
        },
        onSearchChange(data, isExport = false) {
            const searchDataCopy = _.clone(this.searchData);
            const searchData = data ? _.clone(data) : searchDataCopy;
            for (const key in searchData) {
                const temp = searchData[key];
                if (_.isString(temp)) {
                    searchData[key] = temp.replace(/\s*/g, '');
                }
            }
            if (isExport) {
                return searchData;
            } else {
                this.$emit('search-change', searchData);
            }
        },
        getOptionList() {
            const optionNums = this.fields.length > 0 ? this.fields.map(item => item.optionNum).filter(i => i).join(',') : '';
            if (!optionNums) return;
            const params = {
                dictCodes: optionNums,
                tenantCode: this.currentTenant.tenantCode
            };
            dictWithUrl(params).then(res => {
                if (res.code === '0') {
                    this.fields.forEach(item => {
                        if (item.optionNum) {
                            item.options = Object.entries(res.data[item.optionNum]).map(arr => {
                                return {
                                    value: arr[0],
                                    label: arr[1]
                                };
                            });
                        }
                    });
                }
            });
        },
        // 高级输入框的关闭按钮点击
        resetAdvanceParams(prop) {
            const keyArr = this.keyMap[prop];
            // 把属性相关联的字段置空
            keyArr.forEach(key => {
                this.searchData[key] = '';
            });
        }
    },
    created() {
        this.getOptionList();
    }
};
</script>
<style lang="less">
.model-table-search {
    .search-box {
        flex-wrap: wrap;
        .is-fussy {
            display: flex;
            .search {
                flex: auto;
            }
            .input-append-fussy {
                flex: none;
                flex-basis: 65px;
                align-self: baseline;
                margin-top: 4px;
                .el-checkbox__label {
                    padding-left: 4px;
                }
            }
        }
        .search {
            margin: 0 8px 10px 0;
        }

        .advanced-btn {
            margin-left: 10px;
        }
    }
    .text-box {
        position: relative;
        font-size: 12px;
        width: 100%;
    }
    .select-btn-box {
        width: 14%;
    }
}
</style>
