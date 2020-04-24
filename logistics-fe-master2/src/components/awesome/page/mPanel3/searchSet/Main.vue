<template>
    <el-popover placement="bottom" width="1032" popper-class="aaa" @show="initData" trigger="click" ref="popover" v-model='showPopover'>
        <div id="search-set">
            <ul class="search-list-box" id="panelList" ref="panelList">
                <li v-for="item in searchInitList" :key="item.name">
                    <span>{{item.name}}</span>
                    <div>
                        <el-input class='text-box' v-if="item.type === 'advance'" v-model="setSearchData[item.value]"
                                  clearable
                                  @keyup.113.native="detaliSearch(0,item)"
                                  @keyup.enter.native="detaliSearch(0,item)"
                                  @blur="detaliSearch(0,item)"
                                  @input="advanceCodeChange(0,item)"
                                  @clear="advanceCodeChange(0,item)"
                                  :disabled="showState">
                            <el-button slot="append" @click="detaliSearch(0,item)" icon="el-icon-search"></el-button>
                        </el-input>
                        <el-input class='text-box' v-if="item.type === 'input'" v-model="setSearchData[item.value]" :disabled="showState"></el-input>
                        <el-select class='text-box' v-model="setSearchData[item.passValue?item.passValue:item.value]"
                                   v-if="item.type === 'select'" :clearable="clearable"
                                   :multiple="item.multiple?item.multiple:false"
                                   collapse-tags
                                   :disabled="showState">
                            <el-option
                                v-for="(val, index) in item.options"
                                :key=index
                                :label="val.label"
                                :value="val.value">
                            </el-option>
                        </el-select>
                        <el-select
                            v-else-if="item.type === 'autocomplete'"
                            clearable
                            v-model="setSearchData[item.passValue?item.passValue:item.value]"
                            filterable
                            remote
                            :multiple="item.multiple?item.multiple:false"
                            size="mini"
                            reserve-keyword
                            :placeholder=item.name
                            :remote-method="remoteMethod"
                            @focus="searchDateChange(item)"
                            :loading="searchLoading"
                            collapse-tags
                            :disabled="showState">
                            <el-option
                                v-for="item in options"
                                :key="item.passValue ? item.value + '/' + item.passValue : item.value"
                                :label="item.label"
                                :value="item.passValue ? item.value + '/' + item.passValue : item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            class='text-box' v-if="item.type === 'time'"
                            v-model="setSearchData[item.value]"
                            :clearable="false"
                            size="mini"
                            :format="item.format||'yyyy-MM-dd HH:mm:ss'"
                            :value-format="item.format||'yyyy-MM-dd HH:mm:ss'"
                            :picker-options="item.pickerOptionsCustom?pickerOptionsCustom[item.pickerOptionsCustom-1]:(item.timeType?'':pickerOptions)"
                            :type="item.time?'daterange':(item.timeType||'datetimerange')"
                            unlink-panels
                            range-separator="至"
                            :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '开始日期'"
                            :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '结束日期'"
                            :default-time="item.timeType?'':['00:00:00', '23:59:59']"
                            :disabled="showState">
                        </el-date-picker>
                    </div>
                </li>
                <li v-for="(item,index) in searchSetList" :key="index">
                    <span>{{item.name}}</span>
                    <div>
                        <el-input class='text-box' v-if="item.type === 'advance'" v-model="searchData[item.value]"
                                  clearable
                                  @keyup.113.native="detaliSearch(1,item)"
                                  @keyup.enter.native="detaliSearch(1,item)"
                                  @blur="detaliSearch(1,item)"
                                  @input="advanceCodeChange(1,item)"
                                  @clear="advanceCodeChange(1,item)"
                                  :disabled="showState">
                            <el-button slot="append" @click="detaliSearch(1,item)" icon="el-icon-search"></el-button>
                        </el-input>
                        <el-input class='text-box' v-if="item.type === 'input'" v-model="searchData[item.value]" :disabled="showState"></el-input>
                        <el-select class='text-box' v-model="searchData[item.passValue?item.passValue:item.value]"
                                   v-if="item.type === 'select'" :clearable="clearable"
                                   :multiple="item.multiple?item.multiple:false"
                                   collapse-tags
                                   :disabled="showState">
                            <el-option
                                v-for="(val, index) in item.options"
                                :key=index
                                :label="val.label"
                                :value="val.value">
                            </el-option>
                        </el-select>
                        <el-select
                            v-else-if="item.type === 'autocomplete'"
                            v-model="searchData[item.passValue?item.passValue:item.value]"
                            filterable
                            clearable
                            remote
                            :multiple="item.multiple?item.multiple:false"
                            size="mini"
                            reserve-keyword
                            :placeholder=item.name
                            :remote-method="remoteMethod"
                            @focus="searchDateChange(item,true)"
                            :loading="searchLoading"
                            collapse-tags
                            :disabled="showState">
                            <el-option
                                v-for="item in options"
                                :key="item.passValue ? item.value + '/' + item.passValue : item.value"
                                :label="item.label"
                                :value="item.passValue ? item.value + '/' + item.passValue : item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            class='text-box' v-if="item.type === 'time'"
                            v-model="searchData[item.value]"
                            :clearable="false"
                            size="mini"
                            :format="item.format||'yyyy-MM-dd HH:mm:ss'"
                            :value-format="item.format||'yyyy-MM-dd HH:mm:ss'"
                            :picker-options="item.pickerOptionsCustom?pickerOptionsCustom[item.pickerOptionsCustom-1]:(item.timeType?'':pickerOptions)"
                            :type="item.time?'daterange':(item.timeType||'datetimerange')"
                            unlink-panels
                            range-separator="至"
                            :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '开始日期'"
                            :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '结束日期'"
                            :default-time="item.timeType?'':['00:00:00', '23:59:59']"
                            :disabled="showState">
                        </el-date-picker>
                    </div>
                </li>
                <div v-if="!showState" class="btn-box">
                    <div class="text-btn">
                        <el-button type="text" @click="showStateOpen">自定义搜索条件</el-button>
                    </div>
                    <div class="btn-btn">
                        <el-button type="text" @click="clear">重 置</el-button>
                        <el-button type="primary" @click="search">搜 索</el-button>
                    </div>
                </div>
            </ul>
            <div v-if="showState">
                <p class="line"></p>
                <p>选择添加搜索条件</p>
                <ul class="search-total-box">
                    <li v-for="(item,index) in searchTotalTitle" :key="index">
                        <el-button class="btn-width" plain :style="searchSelect[index]" @click="btnChange(index)">{{item.name}}</el-button>
                    </li>
                </ul>
                <div class="btn-box">
                    <el-button type="default" @click="cancelSearch">取 消</el-button>
                    <el-button type="primary" @click="saveSearch">保 存</el-button>
                </div>
            </div>
        </div>
        <m-advanced-search
        ref="detaliTable"
        :advancePrefix="advancePrefix"
        @detali-search-sure="detaliSearchSure"
        :advanceLabel="advanceLabel"
        :advanceCascade='advanceCascade'></m-advanced-search>
        <el-button slot="reference" id="advanced">高级</el-button>
    </el-popover>
</template>
<script>
import getList from '../api';
import { dict, longRange } from '../mSearchList/api';
import mAdvancedSearch from '@/components/awesome/page/mPanel3/mAdvancedSearch';
import { mapGetters } from 'vuex';

export default {
    components: { mAdvancedSearch },
    props: {
        popPrefix: String,
        advancePrefix: String,
        longPrefix: String,
        searchTotalTitle: {
            type: Array,
            default () {
                return [];
            }
        },
        searchInitList: {
            type: Array,
            default () {
                return [];
            }
        },
        setSearchData: {
            type: Object,
            default () {
                return {};
            }
        },
        pickerOptionsCustom: {
            type: Array,
            default() {
                return null;
            }
        },
        searchId: String,
        configurationUrl: String
    },
    data() {
        return {
            searchData: {},
            searchChange: [],
            searchSelect: [],
            searchSetList: [],
            selectNum: [],
            showState: false,
            advanceTpye: 0,
            advanceCode: '',
            advanceName: '',
            advanceLabel: '',
            clearable: true,
            searchSetTitle: [],
            options: [],
            searchLoading: false,
            selectItem: '',
            showPopover: false,
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
            resourceCode: '',
            advanceCascade: {}
        };
    },
    methods: {
        deepMenu(node) {
            const nodes = [];
            if (node) {
                nodes.push(node);
                const childrens = node.subResources;
                if (childrens) {
                    for (let i = 0; i < childrens.length; i++) {
                        if (childrens[i].frontUrl === this.$route.fullPath) {
                            this.resourceCode = childrens[i].resourceCode;
                            return childrens[i].resourceCode;
                        } else {
                            this.deepMenu(childrens[i]);
                        }
                    }
                }
            }
        },
        btnChange(index) {
            this.searchTotalTitle[index].select = !this.searchTotalTitle[index].select;
            this.searchSetList = [];
            this.selectedShow();
        },
        cancelSearch() {
            this.getSetList().then(() => {
                this.creatSearchList();
                this.selectedShow();
            });
            this.showState = false;
        },
        showStateOpen() {
            this.showState = true;
        },
        saveSearch() {
            this.showState = false;
            let searchTotalTitle = [];
            let searchTotalName = [];
            this.searchSetList.map(data => {
                searchTotalTitle.push(data.name);
                searchTotalName.push(data.value);
            });
            searchTotalTitle = searchTotalTitle.join(',');
            searchTotalName = searchTotalName.join(',');
            const pramas = {
                'configName': searchTotalName,
                'configNameCn': searchTotalTitle,
                'subjectType': this.searchId,
                'moduleCode': this.resourceCode
            };
            getList.post(this.configurationUrl, pramas).then(() => {
            }).catch(() => {});
        },
        clear() {
            this.searchInit();
            this.$emit('init-search');
        },
        search() {
            const searchData = JSON.parse(JSON.stringify(this.searchData));
            if (this.searchChange.length !== 0) {
                this.searchChange.map(item => {
                    if (item.value !== item.startValue && item.value) {
                        delete searchData[item.endValue];
                    }
                });
            }
            let setSearchData = JSON.stringify(this.setSearchData);
            setSearchData = JSON.parse(setSearchData);
            if (setSearchData.searchTime) {
                delete setSearchData.searchTime;
            }
            const data = Object.assign(searchData, setSearchData);
            this.$emit('search', data);
        },
        advanceCodeChange(num, current) {
            let advanceArray = [];
            if (current.advanceCascadeClear) {
                advanceArray = current.advanceCascadeClear.split(',');
            }
            if (num === 0) {
                this.setSearchData[current.advanceCode] = '';
                advanceArray.map(item => {
                    this.setSearchData[item] = '';
                });
            } else {
                this.searchData[current.advanceCode] = '';
                advanceArray.map(item => {
                    this.searchData[item] = '';
                });
            }
        },
        searchInit() {
            this.searchData = {};
            this.searchSetList.map(data => {
                if (data.type === 'time' && data.timeNum) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * (data.timeNum - 1));
                    this.$set(this.searchData, data.value, [start, end]);
                } else {
                    const item = '';
                    if (data.type === 'advance') {
                        this.$set(this.searchData, data.value, item);
                    }
                    if (data.passValue) {
                        this.searchChange.push({ startValue: data.ganged, endValue: data.value, value: data.passValue });
                        this.$set(this.searchData, data.passValue, item);
                    }
                }
            });
        },
        // 高级弹框
        detaliSearch(num, current) {
            let value = null;
            let code = null;
            const advanceCascade = {};
            const advanceUrl = current.advanceUrl;
            this.advanceType = num;
            this.advanceCode = current.advanceCode;
            this.advanceName = current.value;
            this.advanceLabel = current.label ? current.label : current.name;
            if (num === 0) {
                value = this.setSearchData[current.value];
                code = this.setSearchData[current.advanceCode];
            } else {
                value = this.searchData[current.value];
                code = this.searchData[current.advanceCode];
            }
            this.$refs.detaliTable.showState = true;
            if (current.advanceCascade) {
                const advanceArray = current.advanceCascade.split(',');
                advanceArray.map((item) => {
                    advanceCascade[item] = this.searchData[item];
                });
                if (current.advanceCascadeAlias) {
                    const searchObj = Object.assign(this.searchData, this.setSearchData);
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
                        advanceCascade[item] = searchObj[onekey];
                    });
                }
                this.advanceCascade = JSON.parse(JSON.stringify(advanceCascade));
            }
            this.$refs.detaliTable.inquire(advanceUrl, value, current, true, code, advanceCascade);
        },
        detaliSearchSure(data, code) {
            if (this.advanceType === 0) {
                this.setSearchData[this.advanceName] = data;
                this.setSearchData[this.advanceCode] = code;
            } else {
                this.searchData[this.advanceName] = data;
                this.searchData[this.advanceCode] = code;
            }
        },
        getSetList() {
            const menu = { subResources: JSON.parse(JSON.stringify(this.menus)) };
            this.deepMenu(menu);
            let checkedList = '';
            const pramas = {
                subjectType: this.searchId,
                moduleCode: this.resourceCode
            };
            return getList.get(this.configurationUrl, pramas).then(data => {
                if (data.data) {
                    checkedList = data.data.configNameCn;
                    this.searchSetTitle = checkedList.split(',');
                } else {
                    this.searchSetTitle = [];
                }
            }).catch(() => {
                this.searchSetTitle = [];
            });
        },
        creatSearchList() {
            const self = this;
            self.searchTotalTitle.map(data => {
                let add = 0;
                self.searchSetTitle.map(title => {
                    if (data.name === title) {
                        add += 1;
                    } else {
                        add += 0;
                    }
                });
                if (add === 1) {
                    self.searchSetList.push(data);
                    data.select = true;
                } else {
                    data.select = false;
                }
            });
        },
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
                data.data[this.selectItem.tableName].map(search => {
                    restaurants.push({ 'value': search[this.selectItem.ganged], 'label': search[this.selectItem.value], 'passValue': search[this.selectItem.autocompExtra] });
                });
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
        searchDateChange(item, more) {
            this.selectItem = item;
            this.remoteMethod();
            if (!more) {
                this.$emit('syncData', item);
            }
        },
        getOptionList() {
            this.searchTotalTitle.map(columns => {
                if (columns.optionNum) {
                    const params = {};
                    params.dictCodes = columns.optionNum;
                    if (window.location.pathname !== '/gwms.html') {
                        params.tenantCode = this.currentTenant.tenantCode;
                    };
                    dict(this.popPrefix, params).then(data => {
                        const option = [];
                        for (const key in data.data[columns.optionNum]) {
                            if (data.data[columns.optionNum].hasOwnProperty(key)) {
                                option.push({ 'value': key, 'label': data.data[columns.optionNum][key] });
                            }
                        }
                        columns.options = option;
                    });
                }
            });
        },
        initData() {
            this.getSetList().then(() => {
                this.creatSearchList();
                this.selectedShow();
                this.showState = false;
            });
        },
        selectedShow() {
            this.searchSetList = [];
            this.searchTotalTitle.map((data, index) => {
                if (data.select === true) {
                    this.searchSetList.push(data);
                }
                const style = {};
                if (data.select) {
                    style.color = '#00BCBF';
                    style.borderColor = '#00BCBF';
                } else {
                    style.color = '#252626';
                    style.borderColor = '#CECECE';
                }
                this.$set(this.searchSelect, index, style);
            });
            this.searchInit();
        }
    },
    created() {
        this.getOptionList();
        this.searchTotalTitle.map((data, index) => {
            this.$set(this.searchSelect, index, {});
        });
        this.$eventBus.$on(this.$route.name, () => {
            this.showPopover = false;
        });
    },
    computed: {
        ...mapGetters(['currentTenant', 'menus'])
    }
};

</script>
<style lang="less">
#search-set {
    ul {
        display: flex;
        flex-wrap: wrap;
    }

    .search-list-box {
        margin-top: 10px;

        >li {
            width: 344px;
            margin-bottom: 10px;
            display: flex;

            >span {
                display: inline-block;
                height: 28px;
                line-height: 28px;
                width: 104px;
                padding: 0 10px;
                text-align: right;
            }

            >div {
                width: 240px;
                >div{
                    width: 100%;
                }
            }

            .select-btn {
                color: #eee !important;
            }
        }
    }

    .line {
        height: 1px;
        width: 100%;
        background-color: #F2F2F2;
    }

    .search-total-box {
        max-height: 120px;
        overflow: auto;

        li {
            width: 162px;
            padding: 0 10px 10px 0;
        }
    }

    .btn-box {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .text-btn{
            width: 40%;
        }
        .btn-btn{
            width: 60%;
            display: flex;
            justify-content: flex-end;
        }
    }

    .btn-width {
        width: 162px;
    }

    .text-box{
      position: relative;
      font-size: 12px;
      width: 100%;
    }
    .v-modal{
        z-index: 2000!important;
    }
}

</style>
