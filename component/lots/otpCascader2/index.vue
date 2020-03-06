<template>
    <div class="m-otp-cascader-content">
        <div class="i-cascader-component">
            <el-cascader
                :placeholder="placeholder"
                :options="addressOptions"
                :props="propsConfig"
                :disabled="disabled"
                ref="cascader"
                v-model="addressArr"
                @input="change"
                @visible-change="visibleChange"
                :clearable="clearable"
            ></el-cascader>
        </div>
    </div>
</template>

<script>
import _ from '@/components/lots/utils';
import { getAreaApi } from '../api.js';
export default {
    props: {
        value: {
            type: [Array, String],
            defalut() {
                return [];
            }
        },
        basicProps: {
            type: Object,
            default() {
                return {};
            }
        },
        minLayers: {
            type: Number,
            default() {
                return 0;
            }
        },
        placeholder: String,
        disabled: {
            type: Boolean,
            default() {
                return false;
            }
        },
        clearable: {
            type: Boolean,
            default() {
                return true;
            }
        }
    },
    data() {
        const _this = this;
        return {
            LEAF_INDEX: 4,
            AREA_TYPE: ['PLACE_PROVINCE', 'PLACE_CITY', 'PLACE_DISTRICT', 'PLACE_STREET'],
            addressArr: [],
            addressOptions: [],
            AREA_MAP: new Map(),
            extendProps: {
                lazy: true,
                lazyLoad (node, resolve) {
                    const level = node.level;
                    const params = {
                        ebplType: _this.AREA_TYPE[level]
                    };
                    if (level === 0) {
                        params.ebplParentPmCode = '100000';
                    } else {
                        params.ebplParentPmCode = node.value;
                    }
                    getAreaApi(params).then(res => {
                        const nodes = res.data.map(item => {
                            // 将查询之后的区域对象放到一个map中，给地址code解析地址名称用
                            _this.AREA_MAP.set(item.ebplCode, item.ebplNameCn);
                            return _this.optionsFormat(item, level + 1 >= _this.leafIndex);
                        });
                        resolve(nodes);
                        // 除了有默认的时候不会调用lazyLoad，其他数据变化都会执行，所以在这里进行单选框的隐藏判断
                        if (level < _this.minLayers - 1) {
                            _this.disabledRadio(level);
                        }
                    });
                }
            }
        };
    },
    methods: {
        optionsFormat(item, isLeaf) {
            return {
                label: item.ebplNameCn,
                value: item.ebplCode,
                leaf: isLeaf
            };
        },
        disabledRadio(level) {
            // 只有选择任意级的时候才需要对radio禁用
            if (this.basicProps.checkStrictly) {
                this.$nextTick(() => {
                    if (this.$refs.cascader.panel.$el.getElementsByClassName('el-cascader-menu__list')[level]) {
                        const menuListDom = this.$refs.cascader.panel.$el.getElementsByClassName('el-cascader-menu__list')[level];
                        menuListDom.className = menuListDom.className.replace(' disable-radio', '') + ' disable-radio';
                    }
                });
            }
        },
        // 下拉框监听事件
        visibleChange(val) {
            if (val) {
                if (!this.value) {
                    // 每次打开下拉框的时候重新从一级选起
                    this.addressOptions = this.addressOptions || this.addressOptions.map(item => {
                        Reflect.deleteProperty(item, 'children');
                        return item;
                    });
                } else {
                    // 传入的地址数组长度和可选级数的限制（minLayers）进行比较，取长度较短者
                    const length = this.value.length > this.minLayers - 1 ? this.minLayers - 1 : this.value.length;
                    // 有默认值的时候进行单选框的显示或隐藏判断
                    for (let i = 0; i < length; i++) {
                        this.disabledRadio(i);
                    }
                }
            }
        },
        async init(value) {
            // 判断传进来的v-model的值是数组或者字符串
            if (_.isString(value)) {
                // 对传入的字符串进行是省市区哪个级别的处理
                this.addressArr = [3, 5, 7, 10].map(item => {
                    return value.length >= item ? value.substr(0, item) : '';
                }).filter(item => item);
            } else if (_.isArray(value)) {
                this.addressArr = value;
            }
            // 递归获取默认值options
            this.addressOptions = await this.getArea(100000, this.addressArr, 0);
        },
        // 获取地址列表
        async getArea(ebplParentPmCode, addressArr, level) {
            // 根据地址的层级获取数据
            if (!addressArr[level]) return [];
            const res = await getAreaApi({
                ebplParentPmCode,
                ebplType: this.AREA_TYPE[level]
            });
            if (res && res.code === '0') {
                const nodes = res.data.map(item => {
                    this.AREA_MAP.set(item.ebplCode, item.ebplNameCn);
                    return this.optionsFormat(item, level + 1 >= this.leafIndex);
                });
                // 获取当前选中的项被获取子地址列表
                const nextNode = nodes.find(item => item.value === addressArr[level]);
                if (nextNode) {
                    nextNode.children = await this.getArea(nextNode.value, addressArr, ++level);
                }
                return nodes;
            }
        },
        // 输入框变化监听事件
        change(val) {
            this.$emit('input', val);
            this.$emit('getAddress', this.addressFormat(val));
            if (this.basicProps.checkStrictly) {
                this.$refs.cascader.toggleDropDownVisible(false);
            }
        },
        // 提供给外部的解析地址code的函数，入参：['code1', 'code2',...], 出参：['name1','name2',...]
        addressFormat(arr) {
            let result = [];
            if (_.isArray(arr)) {
                result = arr.map(item => this.AREA_MAP.get(item));
            }
            return result;
        }
    },
    computed: {
        propsConfig() {
            return { ...this.basicProps, ...this.extendProps };
        },
        leafIndex() {
            return this.propsConfig.checkStrictly ? this.LEAF_INDEX : this.minLayers;
        }
    },
    watch: {
        value: {
            handler(val) {
                if (val) {
                    this.init(val);
                } else {
                    this.addressArr = [];
                }
            },
            immediate: true
        }
    }
};
</script>
<style lang="less">
    .m-otp-cascader-content{
        width:100%;
        .i-cascader-component{
            width:100%;
            .el-cascader{
                width:100%;
            }
        }
    }
    .disable-radio {
        .el-radio{
            display: none;
        }
    }
</style>