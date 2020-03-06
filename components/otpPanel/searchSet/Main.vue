<template>
    <span>
        <el-popover placement="bottom" width="1240" @show="initData" trigger="manual" v-model='showPopover'>
        <div id="search-set">
            <ul class="search-list-box">
                <template v-for="(outer, pIndex) in searchList">
                <li v-for="item in outer.list" :key="item.name + pIndex" :class="{ 'is-fussy': item.isFussy }">
                    <span class="label">{{item.name}}</span>
                    <div class="form-item">
                        <el-input class='text-box' v-if="item.type === 'advanceUser'" v-model="outer.data[item.value]"
                                  readonly
                                  @keyup.113.native="userDetaliSearch(pIndex,item)"
                                  @keyup.enter.native="userDetaliSearch(pIndex,item)"
                                  @blur="userDetaliSearch(pIndex,item)"
                                  @input="advanceCodeChange(pIndex,item)"
                                  @clear="advanceCodeChange(pIndex,item)"
                                  :disabled="showState">
                            <el-button slot="append" :disabled="showState" @click="userDetaliSearch(pIndex,item)" icon="el-icon-search"></el-button>
                            <i slot="suffix" :disabled="showState" @click="resetAdvanceParams(item.value)" class="el-input__icon el-icon-circle-close" v-if="outer.data[item.value]"></i>
                        </el-input>
                        <el-input class='text-box' v-if="item.type === 'advance'" v-model="outer.data[item.value]"
                                  readonly
                                  @keyup.113.native="detaliSearch(pIndex,item)"
                                  @keyup.enter.native="detaliSearch(pIndex,item)"
                                  @blur="detaliSearch(pIndex,item)"
                                  @input="advanceCodeChange(pIndex,item)"
                                  @clear="advanceCodeChange(pIndex,item)"
                                  :disabled="showState">
                            <el-button slot="append" :disabled="showState" @click="detaliSearch(pIndex,item)" icon="el-icon-search"></el-button>
                            <i slot="suffix" :disabled="showState" @click="resetAdvanceParams(item.value)" class="el-input__icon el-icon-circle-close" v-if="outer.data[item.value]"></i>
                        </el-input>
                        <el-input class='text-box' :disabled="showState" v-if="item.type === 'input'" v-model="outer.data[item.value]"></el-input>
                        <el-select class='text-box' v-model="outer.data[item.value]"
                                   v-if="item.type === 'select'"
                                   :clearable="_.get(item, 'clearable', true)"
                                   :multiple="item.multiple?item.multiple:false"
                                   :filterable="item.filterable"
                                   :disabled="showState"
                                   collapse-tags>
                            <el-option
                                v-for="(val, index) in item.options"
                                :key=index
                                :label="val.label"
                                :value="val.value">
                            </el-option>
                        </el-select>
                        <el-select
                            v-else-if="item.type === 'autocomplete'"
                            :clearable="_.get(item, 'clearable', true)"
                            v-model="outer.data[item.passValue?item.passValue:item.value]"
                            filterable
                            remote
                            :multiple="item.multiple?item.multiple:false"
                            reserve-keyword
                            :placeholder=item.name
                            :remote-method="remoteMethod"
                            @focus="searchDateChange(item)"
                            :loading="searchLoading"
                            :disabled="showState"
                            collapse-tags>
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <addressSelect
                                class='text-box'
                                v-if="item.type === 'addressSelect'"
                                v-model="outer.data[item.value]"
                                :minLayers="item.minLayers"
                                :placeholder="item.name"
                                :basicProps="item.config"
                        ></addressSelect>
                        <el-date-picker
                            class='text-box' v-if="item.type === 'time'"
                            v-model="outer.data[item.value]"
                            :clearable="_.get(item, 'clearable', true)"
                            :disabled="showState"
                            size="mini"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :type="item.time?'daterange':'datetimerange'"
                            unlink-panels
                            range-separator="至"
                            :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '开始日期'"
                            :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '结束日期'"
                            :picker-options="pickerOptions"
                            :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </div>
                    <span class="input-append-fussy" v-if="item.isFussy">
                        <el-checkbox v-model="outer.data[item.value + 'Fussy']">模糊</el-checkbox>
                    </span>
                </li>
                </template>
            </ul>
            <div v-if="!showState" class="btn-box">
                <div class="text-btn">
                    <el-button type="text" @click="showStateOpen">自定义搜索条件</el-button>
                </div>
                <div class="btn-btn">
                    <el-button type="primary" @click="search">搜 索</el-button>
                    <el-button type="text" @click="clear">重 置</el-button>
                </div>
            </div>
            <div v-if="showState">
                <p class="line"></p>
                <p>选择添加搜索条件</p>
                <ul class="search-total-box">
                    <li v-for="(item,index) in searchTotalTitle" :key="index">
                        <el-button class="btn-width" plain :style="searchSelect[index]" @click="btnChange(index)">{{item.name}}</el-button>
                    </li>
                </ul>
                <div class="btn-box">
                    <el-button type="text" @click="cancelSearch">取消</el-button>
                    <el-button type="primary" @click="saveSearch">保存</el-button>
                </div>
            </div>
        </div>
        <advance-dialog ref="advanceDialog" @confirm="detaliSearchSure"></advance-dialog>
        <advance-user ref='advanceUser' @confirm="detaliSearchSure"></advance-user>
        <el-button slot="reference" @click="showPopover = !showPopover;">高级</el-button>
    </el-popover>
    <div class="search-set_back" v-show="showPopover" @click.self="showPopover = !showPopover;"></div>
    </span>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import _ from '@/components/lots/utils';
import { dict, longRange, getList } from '../api';
import advanceDialog from '@/components/lots/otpAdvanceDialog';
import advanceUser from '@/components/lots/otpAdvanceUser';
import addressSelect from '@/components/lots/otpCascader2';

export default {
    components: { advanceDialog, addressSelect, advanceUser },
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
        searchId: String,
        configurationUrl: String,
        filterable: Boolean,
        initSearchInfo: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    data() {
        return {
            searchData: {},
            searchChange: [],
            searchSelect: [],
            searchSetList: [],
            selectNum: [],
            showState: false,
            advanceType: 0,
            searchSetTitle: [],
            options: [],
            searchLoading: false,
            selectItem: '',
            showPopover: false,
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
            keyMap: {},
            resourceCode: ''
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
            this.searchSetList.forEach(data => {
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
            this.searchReset(null, true);
            this.$emit('init-search', null, true);
        },
        search() {
            const searchData = _.clone(this.searchData);
            if (this.searchChange.length !== 0) {
                this.searchChange.map(item => {
                    if (item.value !== item.startValue && item.value) {
                        delete searchData[item.endValue];
                    }
                });
            }
            const setSearchData = _.clone(this.setSearchData);
            const data = Object.assign({}, setSearchData, searchData);
            this.$emit('search', data);
            this.showPopover = false;
        },
        advanceCodeChange(num, current) {
            this.advanceType = num;
            this.currentSearchData[current.advanceCode] = '';
        },
        searchReset(searchDataIn = null, reset = false) {
            const searchData = searchDataIn || {};
            // 过滤有值的属性，只对未赋值的属性进行初始化
            this.searchSetList.filter(data => !searchData[data.value]).map(data => {
                if (reset || !this.initSearchInfo[data.value]) {
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
                        } else if (data.multiple) {
                            item = [];
                        }
                        let key = data.value;
                        if (data.passValue) {
                            this.searchChange.push({ startValue: data.ganged, endValue: data.value, value: data.passValue });
                            key = data.passValue;
                        }
                        searchData[key] = item;
                    }
                } else {
                    searchData[data.value] = this.initSearchInfo[data.value];
                }
            });
            this.searchData = searchData;
        },
        searchInit() {
            // 只保存弹窗上存在的元素的属性
            const searchData = this.searchSetList.map(data => {
                // 初始化keyMap
                if (data.type === 'advance' && _.isArray(data.cbParams)) {
                    const keys = data.cbParams.map(item => {
                        const arr = item.split('#');
                        return arr[1] || arr[0];
                    });
                    keys.forEach(key => {
                        this.keyMap[key] = keys;
                    });
                }
                return data.value;
            }).reduce((result, prop) => {
                if (this.keyMap[prop]) {
                    this.keyMap[prop].forEach(key => {
                        result[key] = this.searchData[key];
                    });
                } else {
                    result[prop] = this.searchData[prop];
                }
                return result;
            }, {});
            this.searchReset(searchData);
        },
        userDetaliSearch(num, current) {
            this.advanceType = num;
            this.$refs.advanceUser.show(current);
        },
        // 高级弹框
        detaliSearch(num, current) {
            this.advanceType = num;
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
        detaliSearchSure(data) {
            // 将返回数据添加到map里，用于高级搜索清空时，顺带清空其他关联属性
            const keyArr = Object.keys(data);
            if (keyArr.length > 0) {
                keyArr.forEach(key => {
                    this.keyMap[key] = keyArr;
                });
            }
            Object.assign(this.currentSearchData, data);
        },
        getSetList() {
            const menu = { subResources: _.clone(this.menus) };
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
            this.searchSetList = this.searchTotalTitle.map(item => {
                item.select = this.searchSetTitle.includes(item.name);
                return item;
            }).filter(item => item.select);
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
                    restaurants.push({ 'value': search[this.selectItem.ganged], 'label': search[this.selectItem.value] });
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
        searchDateChange(item) {
            this.selectItem = item;
            this.remoteMethod();
        },
        getOptionList() {
            this.searchTotalTitle.map(columns => {
                if (columns.optionNum) {
                    const params = {
                        dictCodes: columns.optionNum,
                        tenantCode: this.currentTenant.tenantCode
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
            const searchSetList = [];
            const searchSelect = [];
            this.searchTotalTitle.map((data, index) => {
                const style = {};
                if (data.select === true) {
                    style.color = '#00BCBF';
                    style.borderColor = '#00BCBF';

                    searchSetList.push(data);
                } else {
                    style.color = '#252626';
                    style.borderColor = '#CECECE';
                }
                searchSelect.push(style);
            });
            this.searchSetList = searchSetList;
            this.searchSelect = searchSelect;

            this.searchInit();
        },
        // 高级输入框的关闭按钮点击
        resetAdvanceParams(prop) {
            const keyArr = this.keyMap[prop];
            // 把属性相关联的字段置空
            keyArr.forEach(key => {
                this.currentSearchData[key] = '';
            });
        }
    },
    created() {
        this.getOptionList();
        this.searchSelect = Array(this.searchTotalTitle.length).fill({});
        this.$eventBus.$on(this.$route.name, () => {
            this.showPopover = false;
        });
    },
    watch: {
    },
    computed: {
        ...mapGetters(['currentTenant', 'menus']),
        _() {
            return _;
        },
        searchList() {
            return [
                {
                    list: this.searchInitList,
                    data: this.setSearchData
                },
                {
                    list: this.searchSetList,
                    data: this.searchData
                }];
        },
        currentSearchData() {
            return this.advanceType === 0 ? this.setSearchData : this.searchData;
        }
    }
};

</script>
<style lang="less">
#search-set {
    .el-input__inner {
        height: 28px !important;
        padding: 3px 10px;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
    }

    .search-list-box {
        margin-top: 10px;
        max-height: 42vh;
        overflow-y: scroll;

        >li {
            width: 410px;
            margin-bottom: 10px;
            display: flex;

            >.label {
                display: inline-block;
                height: 28px;
                line-height: 28px;
                width: 90px;
                padding: 0 10px 0 0;
                text-align: right;
            }

            >.form-item {
                width: 320px;
                >div{
                    width: 100%;
                }
            }

            .select-btn {
                color: #eee !important;
            }
            &.is-fussy {
                .form-item {
                    width: 260px;
                }
                .input-append-fussy {
                    width: 48px;
                    margin-top: 4px;
                    margin-left: 6px;
                    .el-checkbox__label {
                        padding-left: 4px;
                    }
                }
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
.search-set_back {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    // opacity: 0.5;
    // background: #000000;

}

</style>
