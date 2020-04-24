<template>
    <span class="advanced-search-box">
        <el-popover placement="bottom" class="popover-padding" width="1240" @show="initData" trigger="manual" v-model='showPopover'>
            <el-button slot="reference" @click="showPopover = !showPopover;">高级</el-button>
            <div class="search-set">
                <ul class="search-list-box">
                    <template v-for="item in fields">
                        <li :key="item.name" v-if="item.isFixed || fieldsShowState[item.value]" :class="{ 'is-fussy': item.isFussy }">
                            <span class="label">{{item.name}}</span>
                            <div class="form-item">
                                <el-input v-if="item.type === 'input'"
                                    class='text-box'
                                    :disabled="showState"
                                    v-model="searchData[item.value]"></el-input>
                                <el-select v-else-if="item.type === 'select'"
                                    class='text-box'
                                    v-model="searchData[item.value]"
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
                                <el-date-picker v-else-if="item.type === 'time'"
                                    class='text-box'
                                    v-model="searchData[item.value]"
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
                                <el-input v-else-if="item.type === 'advanceUser'"
                                    class='text-box'
                                    v-model="searchData[item.value]"
                                    readonly
                                    :disabled="showState">
                                    <el-button slot="append" :disabled="showState" @click="userDetailSearch(item)" icon="el-icon-search"></el-button>
                                    <i slot="suffix" :disabled="showState" @click="resetAdvanceParams(item.value)" class="el-input__icon el-icon-circle-close" v-if="searchData[item.value]"></i>
                                </el-input>
                                <el-input v-else-if="item.type === 'advance'"
                                    class='text-box'
                                    v-model="searchData[item.value]"
                                    readonly
                                    :disabled="showState">
                                    <el-button slot="append" :disabled="showState" @click="detailSearch(item)" icon="el-icon-search"></el-button>
                                    <i slot="suffix" :disabled="showState" @click="resetAdvanceParams(item.value)" class="el-input__icon el-icon-circle-close" v-if="searchData[item.value]"></i>
                                </el-input>
                                <addressSelect v-else-if="item.type === 'addressSelect'"
                                    class='text-box'
                                    v-model="searchData[item.value]"
                                    :minLayers="item.minLayers"
                                    :placeholder="item.name"
                                    :basicProps="item.config">
                                </addressSelect>
                            </div>
                            <span class="input-append-fussy" v-if="item.isFussy">
                                <el-checkbox v-model="searchData[item.value + 'Fussy']">模糊</el-checkbox>
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
                        <li v-for="(item,index) in fields" :key="index">
                            <div class="search-total-box_label"
                                :class="{'search-total-box_label-active': fieldsShowState[item.value], 'search-total-box_label-disabled': item.isFixed}"
                                @click="btnChange(item.value, item.isFixed)">
                                {{item.name}}
                            </div>
                        </li>
                    </ul>
                    <div class="btn-box">
                        <el-button type="text" @click="cancelSearch">取消</el-button>
                        <el-button type="primary" @click="saveSearch">保存</el-button>
                    </div>
                </div>
            </div>
            <advance-dialog ref="advanceDialog" @confirm="detailSearchSure"></advance-dialog>
            <advance-user ref='advanceUser' @confirm="detailSearchSure"></advance-user>
        </el-popover>
        <!-- 透明背景，防止误点到弹框外其他内容 -->
        <div class="search-set_back" v-show="showPopover" @click.self="showPopover = !showPopover;"></div>
    </span>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import _ from '@/components/lots/utils';
import { fieldConfig } from '../api';
import advanceDialog from '@/components/lots/otpAdvanceDialog';
import advanceUser from '@/components/lots/otpAdvanceUser';
import addressSelect from '@/components/lots/otpCascader2';

export default {
    components: { advanceDialog, addressSelect, advanceUser },
    props: {
        searchKey: String,
        fields: {
            type: Array,
            default () {
                return [];
            }
        },
        initialVal: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    data() {
        return {
            id: 'searchBox',
            fieldsShowState: {},
            searchData: {},
            showState: false,
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
                }]
            },
            keyMap: {},
            resourceCode: 'RE201805060004'
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
        // 切换自定义搜索条件按钮，isFixed为默认查询项，不可操作
        btnChange(field, isFixed) {
            if (isFixed) return;
            this.$set(this.fieldsShowState, field, !this.fieldsShowState[field]);
        },
        cancelSearch() {
            this.getSetList();
            this.showState = false;
        },
        showStateOpen() {
            this.showState = true;
        },
        saveSearch() {
            this.showState = false;
            let configName = [];
            let configNameCn = [];
            this.fields.forEach(o => {
                if (this.fieldsShowState[o.value]) {
                    configName.push(o.value);
                    configNameCn.push(o.name);
                }
            });
            const params = {
                id: this.id,
                configName: configName.join(','),
                configNameCn: configNameCn.join(','),
                subjectType: this.searchKey,
                moduleCode: this.resourceCode
            };
            fieldConfig.set(params).then(() => {
            }).catch(() => {});
        },
        clear() {
            for (const key in this.searchData) {
                if (key.includes('Fussy')) {
                    this.searchData[key] = false;
                } else {
                    this.searchData[key] = null;
                }
            }
        },
        search() {
            const searchData = _.clone(this.searchData);
            this.$emit('search', searchData);
            this.showPopover = false;
        },
        userDetailSearch(current) {
            this.$refs.advanceUser.show(current);
        },
        // 高级弹框
        detailSearch(current) {
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
        // 获取搜索项配置
        async getSetList() {
            const menu = { subResources: _.clone(this.menus) };
            this.deepMenu(menu);
            let checkedList = null;
            let fieldsShowState = {};
            const params = {
                id: this.id,
                subjectType: this.searchKey,
                moduleCode: this.resourceCode
            };
            try {
                const res = await fieldConfig.get(params);
                if (res.data && res.data.configName) {
                    checkedList = res.data.configName;
                }
            } catch (error) {
            }
            this.fields.forEach(o => {
                fieldsShowState[o.value] = !checkedList ? true : checkedList.includes(o.value);
            });
            this.fieldsShowState = fieldsShowState;
        },
        // 页面初始化
        initData() {
            // 获取搜索项配置
            this.getSetList();
            this.showState = false;
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
        initialVal(val) {
            this.searchData = { ...this.searchData, ...val };
        }
    },
    computed: {
        ...mapGetters(['currentTenant', 'menus']),
        _() {
            return _;
        }
    }
};

</script>
<style lang="less">
.advanced-search-box{
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
}
.search-set {
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
            width: 144px;
            padding: 0 10px 10px 0;
        }
        .search-total-box_label {
            padding: 5px 10px;
            font-size: 12px;
            border-radius: 4px;
            border: 1px solid #cecece;
            text-align: center;
            cursor: pointer;
        }
        .search-total-box_label-active {
            color: #00bcbf;
            border-color: #00bcbf;
        }
        .search-total-box_label-disabled {
            cursor: not-allowed;
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
