<template>
    <el-row type="flex" class="model-table-search btn-bg">
        <el-col id='search-input-guide' :span="21">
            <el-row class="search-box" v-for="(data,indexs) in searchList" :key="indexs">
                <el-col v-for="(item,index) in data" :key="index" :span="item.span" v-show="indexs==='unfoldList'||unfoldState">
                    <div class="search">
                        <el-input
                          v-if="item.type === 'advance'"
                          :placeholder=item.name
                          clearable
                          v-model="searchData[item.value]"
                          @keydown.113.native="detaliSearch(index, item, 1, searchData[item.value],indexs)"
                          @keyup.enter.native="detaliSearch(index, item, 1, searchData[item.value],indexs)"
                          @blur="detaliSearchBlur(index, item, 1, searchData[item.value],indexs)"
                          @clear="advanceCodeChange(indexs,index)"
                          @input="advanceCodeChange(indexs,index)">
                            <el-button slot="append" @click="detaliSearch(index, item, 1, searchData[item.value],indexs)"
                                       icon="el-icon-search"></el-button>
                        </el-input>
                        <el-select
                          v-else-if="item.type === 'autocomplete'"
                          v-model="searchData[item.passValue?item.passValue:item.value]"
                          filterable
                          clearable
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
                                  :value="item.passValue ? item.value + '/' + item.passValue : item.value">
                            </el-option>
                        </el-select>
                        <el-select
                            clearable
                            v-model="searchData[item.passValue?item.passValue:item.value]"
                            v-else-if="item.type === 'select'"
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
                                v-else-if="item.type === 'cascader'"
                                :options="item.options"
                                collapse-tags
                                clearable
                                :props="{ checkStrictly: item.checkStrictly, value:item.propValue, label: item.propLabel }"
                                :show-all-levels="item.showAllLevels"
                                :filterable="item.filterable"
                                :change-on-select="item.changeOnSelect"
                                :placeholder="item.name">
                        </el-cascader>
                        <el-date-picker
                          class='text-box'
                          v-else-if="item.type === 'time'"
                          v-model="searchData[item.value]"
                          size="mini"
                          :clearable="timeClearable"
                          :format="item.format||'yyyy-MM-dd HH:mm:ss'"
                          :value-format="item.format||'yyyy-MM-dd HH:mm:ss'"
                          :picker-options="item.pickerOptionsCustom?pickerOptionsCustom[item.pickerOptionsCustom-1]:(item.timeType?'':pickerOptions)"
                          :type="item.time?'daterange':(item.timeType||'datetimerange')"
                          unlink-panels
                          range-separator="至"
                          :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '开始日期'"
                          :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '结束日期'"
                          :default-time="item.timeType?'':['00:00:00', '23:59:59']">
                        </el-date-picker>
                        <el-input v-else :placeholder=item.name clearable v-model="searchData[item.value]" @keyup.enter.native="onSearchChange()"></el-input>
                    </div>
                </el-col>
                <el-col v-if="indexs==='unfoldList'" class="select-btn-box">
                    <el-button type="primary" @click="onSearchChange" :loading="loading||loadingIni" id="search">查 询</el-button>
                    <el-button type="text" v-if="list.unfoldState" @click="unloadChange">{{btnTxt}}</el-button>
                    <search-set ref='searchSet' v-if="list.advancedBtn" class="advanced-btn" :searchId="searchId" :searchInitList="list.searchTxt" @init-search="dataInit"
                        :longPrefix="longPrefix" :configurationUrl="configurationUrl" :advancePrefix="advancePrefix"
                        :popPrefix="popPrefix" :setSearchData="searchData" :searchTotalTitle="searchTotalTitle" @search="onSearchChange" @syncData="syncData"
                        :pickerOptionsCustom='pickerOptionsCustom'></search-set>
                </el-col>
            </el-row>
            <m-advanced-search ref="detaliTable"
              @detali-search-sure="detaliSearchSure"
              :advanceUrl="advanceUrl"
              :advancePrefix="advancePrefix"
              :advanceLabel="advanceLabel"
              :advanceCascade='advanceCascade'></m-advanced-search>
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
import searchSet from '../searchSet';
import mAdvancedSearch from '../mAdvancedSearch';
import { dict, longRange } from './api';
import formatTime from '@/utils/common.js';
import { mapGetters } from 'vuex';

export default {
    components: { searchSet, mAdvancedSearch },
    props: {
        optionNum: String,
        searchId: String,
        popPrefix: String,
        advancePrefix: String,
        longPrefix: String,
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
        pickerOptionsCustom: {
            type: Array,
            default() {
                return null;
            }
        },
        loading: {
            type: Boolean,
            default() {
                return null;
            }
        },
        autocomplete: {
            type: Boolean,
            default() {
                return true;
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
                unfoldList: [],
                initList: []
            },
            timeClearable: false,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const start = new Date();
                        start.setHours(0);
                        start.setMinutes(0);
                        start.setSeconds(0);
                        const end = new Date();
                        end.setHours(23);
                        end.setMinutes(59);
                        end.setSeconds(59);
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const start = new Date();
                        start.setHours(0);
                        start.setMinutes(0);
                        start.setSeconds(0);
                        const end = new Date();
                        end.setHours(23);
                        end.setMinutes(59);
                        end.setSeconds(59);
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const start = new Date();
                        start.setHours(0);
                        start.setMinutes(0);
                        start.setSeconds(0);
                        const end = new Date();
                        end.setHours(23);
                        end.setMinutes(59);
                        end.setSeconds(59);
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
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
            advanceType: true,
            advanceCode: '',
            searchValue: '',
            options: [],
            searchLoading: false,
            loadingIni: false,
            advanceCascade: {}
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
            if (!this.autocomplete) {
                searchData = '';
            }
            searchData = searchData.replace(/\s*/g, '');
            if (searchData !== '') {
                setTimeout(this.detaliSearch(index, current, type, searchData, num), 500);
            }
        },
        detaliSearch(index, current, type, searchData, num) {
            if (!this.autocomplete) { searchData = ''; }
            let value = null;
            let code = null;
            const advanceCascade = {};
            this.advanceUrl = current.advanceUrl;
            this.advanceLabel = current.label ? current.label : current.name;
            this.searchTypeNum = num;
            this.searchNum = index;
            this.advanceCode = current.advanceCode;
            if (type === 1) {
                this.advanceType = true;
                if (!this.autocomplete) {
                    value = null;
                } else {
                    value = this.searchData[this.searchList[this.searchTypeNum][this.searchNum].value];
                }
                if (this.searchData[this.searchList[this.searchTypeNum][this.searchNum].advanceCode]) {
                    code = this.searchData[this.searchList[this.searchTypeNum][this.searchNum].advanceCode];
                }
            } else {
                this.advanceType = false;
                value = searchData[index] || '';
                code = searchData[this.advanceCode];
            }
            if (current.advanceCascade) {
                const advanceArray = current.advanceCascade.split(',');
                advanceArray.map((item) => {
                    advanceCascade[item] = this.searchData[item];
                });
                if (current.advanceCascadeMastFill && current.advanceCascadeMessage) {
                    const advanceCascadeMastFill = current.advanceCascadeMastFill.split(',');
                    for (const key in advanceCascadeMastFill) {
                        if (!advanceCascade[advanceCascadeMastFill[key]]) {
                            this.$message.warning(current.advanceCascadeMessage[advanceCascadeMastFill[key]]);
                            return;
                        }
                    }
                }
                if (current.advanceCascadeAlias) {
                    const advanceCascadeArray = current.advanceCascadeAlias.split(',');
                    advanceCascadeArray.map((item) => {
                        let onekey = '';
                        for (const key in advanceCascade) {
                            if (advanceCascade.hasOwnProperty(key)) {
                                onekey = key;
                                break;
                            }
                        }
                        delete advanceCascade[onekey];
                        advanceCascade[item] = this.searchData[onekey];
                    });
                }
                this.advanceCascade = JSON.parse(JSON.stringify(advanceCascade));
            }
            this.$refs.detaliTable.showState = true;
            this.$refs.detaliTable.inquire(this.advanceUrl, value, current, true, code, advanceCascade);
        },
        detaliSearchSure(data, code) {
            if (this.advanceType) {
                this.searchData[this.searchList[this.searchTypeNum][this.searchNum].value] = data;
                this.searchData[this.searchList[this.searchTypeNum][this.searchNum].advanceCode] = code;
            } else {
                this.$emit('tableAdvance', this.searchNum, this.advanceCode, data, code);
            }
        },
        onSearchChange(data, isExport) {
            let searchData = JSON.stringify(this.searchData);
            searchData = JSON.parse(searchData);
            for (const key in searchData) {
                if (typeof (searchData[key]) === 'string') {
                    searchData[key] = searchData[key].replace(/\s*/g, '');
                }
            }
            if (data && !data.isTrusted) {
                for (const key in data) {
                    if (typeof (data[key]) === 'string') {
                        searchData[key] = data[key].replace(/\s*/g, '');
                    } else {
                        searchData[key] = data[key];
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
            if (searchData.searchTime) {
                delete searchData.searchTime;
            }
            for (const key in searchData) {
                if (searchData[key] === '' || searchData[key] === null || searchData[key].length === 0) {
                    delete searchData[key];
                }
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
            if (this.optionNum) {
                const params = {};
                params.dictCodes = this.optionNum;
                if (window.location.pathname !== '/gwms.html') {
                    params.tenantCode = this.currentTenant.tenantCode;
                };
                const list = this.optionNum.split(',');
                dict(this.popPrefix, params).then(data => {
                    list.map(num => {
                        const option = [];
                        for (const key in data.data[num]) {
                            if (data.data[num].hasOwnProperty(key)) {
                                option.push({ 'value': key, 'label': data.data[num][key] });
                            }
                        }
                        this.optionList.push(option);
                    });
                }).then(() => {
                    if (this.optionList.length > 0) {
                        this.optionListSort();
                    }
                });
            }
        },
        optionListSort() {
            let num = 0;
            this.searchList.unfoldList.map(data => {
                if (data.type === 'select') {
                    data.options = this.optionList[num];
                    this.$set(data, 'options', this.optionList[num]);
                    num += 1;
                }
            });
            this.searchList.initList.map(data => {
                if (data.type === 'select') {
                    data.options = this.optionList[num];
                    this.$set(data, 'options', this.optionList[num]);
                    num += 1;
                }
            });
            this.$forceUpdate();
        },
        dataInit() {
            this.searchData = {};
            this.searchChange = [];
            this.searchList.unfoldList = [];
            this.searchList.initList = [];
            this.list.searchTxt.map((data) => {
                if (data.type === 'time' && data.timeNum) {
                    const start = new Date();
                    start.setHours(0);
                    start.setMinutes(0);
                    start.setSeconds(0);
                    const end = new Date();
                    end.setHours(23);
                    end.setMinutes(59);
                    end.setSeconds(59);
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * (data.timeNum - 1));
                    this.$set(this.searchData, data.value, [start, end]);
                } else {
                    const item = '';
                    if (data.passValue) {
                        this.searchChange.push({ startValue: data.ganged, endValue: data.value, value: data.passValue });
                    }
                    if (data.type === 'advance') {
                        this.$set(this.searchData, data.value, item);
                    }
                }
                if (data.unfold === true) {
                    this.searchList.unfoldList.push(data);
                } else {
                    this.searchList.initList.push(data);
                }
            });
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
                        restaurants.push({ 'value': search[this.selectItem.ganged], 'label': search[this.selectItem.value], 'passValue': search[this.selectItem.autocompExtra] });
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
            if (this.$refs.searchSet) {
                this.$refs.searchSet[0].searchDateChange(item);
            }
        },
        advanceCodeChange(num, index) {
            if (this.searchList[num][index].advanceCascadeClear) {
                const advanceArray = this.searchList[num][index].advanceCascadeClear.split(',');
                advanceArray.map(item => {
                    this.searchData[item] = '';
                });
            }
            this.searchData[this.searchList[num][index].advanceCode] = '';
        },
        changeLoading(status) {
            this.loadingIni = status;
        },
        syncData(item) {
            this.selectItem = item;
            this.remoteMethod();
        }
    },
    watch: {
        tableData: function () {
            this.dataInit();
        }
    },
    created() {
        this.dataInit();
        this.getOptionList();
        this.$eventBus.$on(this.$route.name, () => this.dataInit());
    },
    computed: {
        ...mapGetters(['currentTenant'])
    }
};
</script>
<style lang="less">
  .model-table-search{
    .search-box{
      flex-wrap:wrap;
      .search{
        margin:0 8px 10px 0;
      }
      .advanced-btn{
        margin-left: 10px;
      }
    }
    .text-box{
      position: relative;
      font-size: 12px;
      width: 100%;
    }
    .select-btn-box{
      width: 14%;
    }
    .el-autocomplete, .el-select {
        width: 100%
    }
  }
</style>
