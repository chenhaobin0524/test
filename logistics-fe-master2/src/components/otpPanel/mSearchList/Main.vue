<template>
    <el-row type="flex" class="model-table-search btn-bg">
        <el-col :span="21">
            <el-row class="search-box" v-for="(data,indexs) in searchList" :key="indexs">
                <el-col v-for="(item,index) in data" :key="index" :span="item.span"
                        v-show="indexs==='unfoldList'||unfoldState" :class="{ 'is-fussy': item.isFussy }">
                    <div class="search">
                        <el-input
                                v-if="item.type === 'advance'"
                                :placeholder=item.name
                                readonly
                                v-model="searchData[item.value]"
                                @keydown.113.native="detaliSearch(index, item, 1, searchData[item.value],indexs)"
                                @keyup.enter.native="detaliSearch(index, item, 1, searchData[item.value],indexs)"
                                @blur="detaliSearchBlur(index, item, 1, searchData[item.value],indexs)"
                                @clear="advanceCodeChange(indexs,index)"
                                @input="advanceCodeChange(indexs,index)">
                            <el-button slot="append"
                                @click="detaliSearch(index, item, 1, searchData[item.value],indexs)"
                                icon="el-icon-search"></el-button>
                            <i slot="suffix" @click="resetAdvanceParams(item.value)"
                               class="el-input__icon el-icon-circle-close" v-if="searchData[item.value]"></i>
                        </el-input>
                        <el-input v-if="item.type === 'input'" :placeholder="item.name"
                            :clearable="_.get(item, 'clearable', true)"
                            v-model="searchData[item.value]" @keyup.enter.native="onSearchChange()"></el-input>
                        <el-select
                                v-else-if="item.type === 'autocomplete'"
                                v-model="searchData[item.passValue?item.passValue:item.value]"
                                :clearable="_.get(item, 'clearable', true)"
                                :filterable="item.filterable"
                                remote
                                :multiple="item.multiple?item.multiple:false"
                                reserve-keyword
                                :placeholder=item.name
                                :remote-method="remoteMethod"
                                collapse-tags
                                @change="autocompleteSure(item)"
                                @clear="autocompleteSure(item)"
                                @focus="searchDataChange(item)"
                                @keyup.enter.native="onSearchChange()"
                                :loading="searchLoading">
                            <el-option
                                    v-for="(item, index) in options"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select
                                :clearable="_.get(item, 'clearable', true)"
                                :filterable="item.filterable"
                                v-model="searchData[item.value]"
                                v-if="item.type === 'select'"
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
                        <el-cascader
                                v-model="searchData[item.value]"
                                v-if="item.type === 'cascader'"
                                :options="item.options"
                                collapse-tags
                                :filterable="item.filterable"
                                :change-on-select="item.changeOnSelect"
                                :placeholder="item.name">
                        </el-cascader>
                        <addressSelect
                                v-if="item.type === 'addressSelect'"
                                v-model="searchData[item.value]"
                                :minLayers="item.minLayers"
                                :placeholder="item.name"
                                :basicProps="item.config"
                        ></addressSelect>
                        <el-date-picker
                                class='text-box'
                                v-if="item.type === 'time'"
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
                    </div>
                    <span class="input-append-fussy" v-if="item.isFussy">
                        <el-checkbox v-model="searchData[item.value + 'Fussy']">模糊</el-checkbox>
                    </span>
                </el-col>
                <el-col v-if="indexs==='unfoldList'" class="select-btn-box">
                    <el-button type="primary" @click="onSearchChange()" :loading="loading">查 询</el-button>
                    <el-button type="text" v-if="list.unfoldState" @click="unloadChange">{{btnTxt}}</el-button>
                    <search-set v-if="list.advancedBtn" class="advanced-btn" :searchId="searchId"
                        :initSearchInfo="initSearchInfo"
                        :searchInitList="list.searchTxt" @init-search="dataInit"
                        :longPrefix="longPrefix" :configurationUrl="configurationUrl"
                        :advancePrefix="advancePrefix"
                        :popPrefix="popPrefix" :setSearchData="searchData" :searchTotalTitle="searchTotalTitle"
                        @search="onSearchChange"></search-set>
                </el-col>
            </el-row>
            <advance-dialog ref="advanceDialog" @confirm="detaliSearchSure"></advance-dialog>
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
import searchSet from '../searchSet';
import { dict, longRange } from '../api';
import formatTime from '@/utils/common.js';
import _ from '@/components/lots/utils.js';
import addressSelect from '@/components/lots/otpCascader2';
import advanceDialog from '@/components/lots/otpAdvanceDialog';
export default {
    components: { searchSet, addressSelect, advanceDialog },
    props: {
        searchId: String,
        popPrefix: {
            type: String,
            default() {
                return '/api-mdm/dictionaryDetail/dict';
            }
        },
        advancePrefix: {
            type: String,
            default() {
                return '/api-mdm';
            }
        },
        longPrefix: {
            type: String,
            default() {
                return '/api-gwms/es/comboBox';
            }
        },
        configurationUrl: String,
        list: {
            type: Object,
            default() {
                return {};
            }
        },
        searchTotalTitle: {
            type: Array,
            default() {
                return [];
            }
        },
        filterable: Boolean,
        initSearchInfo: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            btnTxt: '展开',
            searchChange: [],
            searchData: {},
            restaurantsList: [],
            searchList: {
                unfoldList: []
            },
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
                // }, {
                //     text: '最近三个月',
                //     onClick(picker) {
                //         const start = moment().startOf('day').subtract(3, 'M').toDate();
                //         const end = moment().endOf('day').toDate();
                //         picker.$emit('pick', [start, end]);
                //     }
                }]
            },
            unfoldState: false,
            optionList: [],
            advanced: false,
            searchNum: 0,
            searchTypeNum: '',
            selectItem: [],
            advanceUrl: '',
            advanceLabel: '',
            advanceCode: '',
            searchValue: '',
            options: [],
            searchLoading: false,
            loading: false,
            keyMap: {}
        };
    },
    methods: {
        unloadChange() {
            this.unfoldState = !this.unfoldState;
            if (this.btnTxt === '展开') {
                this.btnTxt = '收起';
                this.unfoldState = true;
            } else {
                this.btnTxt = '展开';
                this.unfoldState = false;
            }
        },
        detaliSearchBlur(index, current, type, searchData, num) {
            searchData = searchData.replace(/\s*/g, '');
            if (searchData !== '') {
                setTimeout(this.detaliSearch(index, current, type, searchData, num), 500);
            }
        },
        detaliSearch(index, current, type, searchData, num) {
            // const value = this.searchData[current.value];
            // const code = this.searchData[current.advanceCode];
            // this.advanceUrl = current.advanceUrl;
            // this.advanceLabel = current.label ? current.label : current.name;
            // this.searchTypeNum = num;
            // this.searchNum = index;
            // this.advanceCode = current.advanceCode;
            // this.$refs.detaliTable.showState = true;
            // 高级搜索级联操作，current.advanceCascade为需要级联的参数的key的集合，例如advanceCascade: key1,key2,key3
            const advanceCascade = {};
            if (current.advanceCascade && Object.prototype.toString.call(current.advanceCascade) === '[object String]') {
                let advanceArray = [];
                advanceArray = current.advanceCascade.split(',');
                advanceArray.map((item) => {
                    let { 0: sourceProp, 1: destProp } = item.split('#');
                    destProp = destProp || sourceProp;
                    advanceCascade[destProp] = this.searchData[sourceProp];
                });
            }
            // this.$refs.detaliTable.inquire(this.advanceUrl, value, current, true, code, advanceCascade);
            this.$refs.advanceDialog.show(true, current, advanceCascade);
        },
        detaliSearchSure(data) {
            // 将返回数据添加到map里，用于高级搜索清空时，顺带清空其他关联属性
            const keyArr = Object.keys(data);
            if (keyArr.length > 0) {
                keyArr.forEach(key => {
                    this.keyMap[key] = keyArr;
                });
            }
            Object.assign(this.searchData, data);
        },
        onSearchChange(data, isExport) {
            // this.searchData = { ...this.searchData, ...data };
            // let searchData = JSON.stringify(this.searchData);
            // searchData = JSON.parse(searchData);
            const searchDataCopy = JSON.parse(JSON.stringify(this.searchData));
            const searchData = data ? { ...searchDataCopy, ...data } : searchDataCopy;
            for (const key in searchData) {
                if (typeof (searchData[key]) === 'string') {
                    searchData[key] = searchData[key].replace(/\s*/g, '');
                }
            }
            if (data && !data.isTrusted) {
                for (const key in data) {
                    if (typeof (data[key]) === 'string') {
                        searchData[key] = data[key].replace(/\s*/g, '');
                    }
                }
            }
            if (searchData.searchTime) {
                const startDate = searchData.searchTime[0];
                const endDate = searchData.searchTime[1];
                if (typeof (startDate) === 'object') {
                    const startTime = this.formatTime(startDate);
                    const endTime = this.formatTime(endDate);
                    searchData.startTime = startTime + ' 00:00:00';
                    searchData.endTime = endTime + ' 23:59:59';
                } else {
                    searchData.startTime = formatTime.formatDateTime(startDate);
                    searchData.endTime = formatTime.formatDateTime(endDate);
                }
            }
            if (this.searchChange.length !== 0) {
                this.searchChange.map(item => {
                    if (item.value !== item.startValue && item.value) {
                        delete searchData[item.endValue];
                    }
                });
            }
            if (isExport) {
                return searchData;
            } else {
                this.$emit('onSearchChange', searchData);
            }
        },
        formatTime(time) {
            const year = time.getFullYear();
            const mouth = this.disposeTime(time.getMonth() + 1);
            const day = this.disposeTime(time.getDate());
            return year + '-' + mouth + '-' + day;
        },
        disposeTime(time) {
            if (time < 10) {
                return '0' + time;
            } else {
                return time;
            }
        },
        getOptionList() {
            const optionNums = this.list.searchTxt.length > 0 ? this.list.searchTxt.filter(item => item.optionNum).map(item => item.optionNum).join(',') : '';
            if (optionNums) {
                const params = {
                    dictCodes: optionNums,
                    tenantCode: this.currentTenant.tenantCode
                };
                dict(this.popPrefix, params).then(data => {
                    if (data.code === '0') {
                        this.list.searchTxt.forEach(item => {
                            if (item.optionNum) {
                                item.options = Object.entries(data.data[item.optionNum]).map(item => {
                                    return {
                                        value: item[0],
                                        label: item[1]
                                    };
                                });
                            }
                        });
                    }
                });
            }
        },
        dataInit(val, reset = false) {
            const searchData = {};
            const initSearchInfo = val || this.initSearchInfo;
            this.searchChange = [];
            this.searchList.unfoldList = [];
            this.list.searchTxt.forEach((data) => {
                if (reset || !initSearchInfo[data.value]) {
                    if (data.type === 'time' && data.timeNum) {
                        const start = moment().startOf('day').subtract(data.timeNum, 'd').toDate();
                        const end = moment().endOf('day').toDate();
                        searchData[data.value] = [start, end];
                    } else if (data.type === 'advance') {
                        if (this.keyMap[data.value]) {
                            this.keyMap[data.value].forEach(key => { searchData[key] = ''; });
                        } else {
                            searchData[data.value] = '';
                        }
                    } else {
                        let item = '';
                        if (data.data) {
                            item = data.data;
                        } else if ((data.multiple && data.multiple === true) || data.type === 'cascader' || data.type === 'addressSelect') {
                            item = [];
                        }
                        if (data.passValue) {
                            this.searchChange.push({
                                startValue: data.ganged,
                                endValue: data.value,
                                value: data.passValue
                            });
                        }
                        searchData[data.value] = item;
                    }
                } else {
                    searchData[data.value] = initSearchInfo[data.value];
                }
                if (data.unfold === true) {
                    this.searchList.unfoldList.push(data);
                }
            });
            this.searchData = searchData;
        },
        // 远程搜索
        remoteMethod(query) {
            this.options = [];
            let searchData;
            if (query) {
                searchData = query.replace(/\s*/g, '');
            } else {
                searchData = '';
            }
            const params = {
                [this.selectItem.tableName]: {
                    [this.selectItem.value]: searchData,
                    [this.selectItem.ganged]: searchData
                }
            };
            if (this.selectItem.relevanceOne) {
                params[this.selectItem.tableName][this.selectItem.relevanceOne] = this.searchData[this.selectItem.relevanceOne];
            }
            if (this.selectItem.relevanceTwo) {
                params[this.selectItem.tableName][this.selectItem.relevanceTwo] = this.searchData[this.selectItem.relevanceTwo];
            }
            longRange(this.longPrefix, params).then(data => {
                const restaurants = [];
                if (data.data[this.selectItem.tableName]) {
                    data.data[this.selectItem.tableName].map(search => {
                        restaurants.push({
                            'value': search[this.selectItem.ganged],
                            'label': search[this.selectItem.value]
                        });
                    });
                }
                this.searchLoading = true;
                setTimeout(() => {
                    this.searchLoading = false;
                    this.options = restaurants.filter(item => {
                        return item.label.toLowerCase()
                            .indexOf(searchData.toLowerCase()) > -1;
                    });
                }, 20);
            });
        },
        autocompleteSure(item) {
            if (item.relevanceClear) {
                item.relevanceClear.map(item => {
                    if (this.searchData[item]) {
                        this.searchData[item] = '';
                    }
                });
            }
        },
        searchDataChange(item) {
            this.selectItem = item;
            this.remoteMethod();
        },
        advanceCodeChange(num, index) {
            this.searchData[this.searchList[num][index].advanceCode] = '';
        },
        changeLoading(status) {
            this.loading = status;
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
    watch: {
        tableData: function () {
            this.dataInit();
        },
        list: {
            handler: function(newList) {
                if (newList.searchTxt) {
                    newList.searchTxt.forEach(item => {
                        if (item.defaultValue) {
                            // this.searchData[item.value] = item.defaultValue;
                            ((item2) => {
                                this.$nextTick(() => {
                                    this.$set(this.searchData, item2.value, item2.defaultValue);
                                });
                            })(item);
                        }
                    });
                }
            }
        },
        initSearchInfo: {
            handler(val) {
                this.dataInit(val);
            }
        }
    },
    created() {
        this.dataInit();
        this.getOptionList();
        this.$eventBus.$on(this.$route.name, () => this.dataInit());
    },
    computed: {
        ...mapGetters(['currentTenant']),
        _() {
            return _;
        }
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

    .el-autocomplete, .el-select {
        width: 100%
    }
}
</style>
