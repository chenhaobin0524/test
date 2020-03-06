<template>
    <div class="m-otp-cascader-content">
        <div class="i-cascader-component">
            <el-cascader
                :options="options"
                :props="propsConfig"
                ref="cascader"
                v-model="data"
                :disabled="disabled"
                :placeholder="placeholder"
                clearable
                @visible-change="closeGet"
                @change="cascaderChange"
            ></el-cascader>
        </div>
    </div>
</template>

<script>
import { getAreaApi } from '../api.js';
export default {
    props: {
        address: {
            type: [Array, String],
            default() {
                return [];
            }
        },
        config: {
            type: Object
        },
        prop: {
            type: String,
            default: 'addressCode'
        },
        labelName: {
            type: String,
            default: 'labelName'
        },
        index: {
            type: Number
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String
        },
        minLayers: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            vals: null,
            dataObj: {},
            options: [],
            isComputed: true,
            allAddress: [],
            addressCode: [],
            addressLabel: [],
            data: [],
            props: {
                self: this,
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level } = node;
                    const self = this.self;
                    if (+level === 0) {
                        getAreaApi({
                            ebplType: 'PLACE_PROVINCE',
                            ebplParentPmCode: '100000'
                        }).then(res => {
                            if (+res.code === 0) {
                                const nodes = res.data.map(item => {
                                    return {
                                        label: item.ebplNameCn,
                                        value: item.ebplCode
                                    };
                                });
                                resolve(nodes);
                                self.$set(
                                    self.dataObj,
                                    'PLACE_PROVINCE',
                                    res.data
                                );
                                self.options = nodes;
                                self.allAddress = JSON.parse(JSON.stringify(nodes));
                            } else {
                                resolve([]);
                            }
                        });
                    } else {
                        const type =
                            +level === 1
                                ? 'PLACE_CITY'
                                : +level === 2
                                    ? 'PLACE_DISTRICT'
                                    : 'PLACE_STREET';
                        getAreaApi({
                            ebplType:
                                +level === 1
                                    ? 'PLACE_CITY'
                                    : +level === 2
                                        ? 'PLACE_DISTRICT'
                                        : 'PLACE_STREET',
                            ebplParentPmCode: node.value
                        }).then(res => {
                            if (+res.code === 0) {
                                const nodes = res.data.map(item => {
                                    return {
                                        label: item.ebplNameCn,
                                        value: item.ebplCode,
                                        leaf: level > 2
                                    };
                                });
                                let flag = true;
                                self.allAddress.map(item => {
                                    if ((item.value) === nodes[0].value) {
                                        flag = false;
                                    }
                                });
                                if (flag) {
                                    self.allAddress = [...self.allAddress, ...JSON.parse(JSON.stringify(nodes))];
                                }
                                resolve(nodes);
                                self.$set(self.dataObj, type, res.data);
                                Object.assign({}, this.allAddress);
                            } else {
                                resolve([]);
                            }
                        });
                    }
                }
            }
        };
    },
    watch: {
        address(val) {
            if (this.isComputed) {
                if (typeof this.address === 'string') {
                    this.$emit('update:address', this.initAddress(this.address));
                }
                this.data = this.address;
                this.g();
            }
        }
    },
    methods: {
        getCascaderObj(val, opt) {
            return val.map(function(value, index, array) {
                for (var itm of opt) {
                    if (itm.value === value) {
                        opt = itm.children;
                        return itm;
                    }
                }
                return null;
            });
        },
        initAddress(start) {
            const arr = [];
            arr[0] = start.slice(0, 3);
            arr[1] = start.slice(3, 5);
            arr[2] = start.slice(5, 7);
            arr[3] = start.slice(7, 10);
            arr.map((item, index) => {
                if (!item) {
                    arr.length = index;
                } else {
                    if (index > 0) {
                        arr[index] = arr[index - 1] + item;
                    }
                }
            });
            return arr;
        },
        closeGet(flag) {
            if (flag) {
                this.isComputed = false;
            }
        },
        async g() {
            const typeList = [
                'PLACE_PROVINCE',
                'PLACE_CITY',
                'PLACE_DISTRICT',
                'PLACE_STREET'
            ];
            const province = await this.getData(typeList[0], '100000');
            const city = await this.getData(typeList[1], this.address[0]);
            const area = await this.getData(typeList[2], this.address[1]);
            const country = await this.getData(
                typeList[3],
                this.address[2],
                true
            );
            if (this.address.length <= 0) return;
            this.options = this.setOptions(province.data);
            if (this.address.length <= 1) return;
            const provinceIdx = this.findIndex(this.options, this.address[0]);
            this.options[provinceIdx].children = this.setOptions(city.data);
            if (this.address.length <= 2) return;
            const cityIdx = this.findIndex(
                this.options[provinceIdx].children,
                this.address[1]
            );
            this.options[provinceIdx].children[cityIdx].children = this.setOptions(area.data);
            if (this.address.length <= 3) return;
            const areaIdx = this.findIndex(
                this.options[provinceIdx].children[cityIdx].children,
                this.address[2]
            );
            this.options[provinceIdx].children[cityIdx].children[areaIdx].children = this.setOptions(country.data, true);
        },
        findIndex(data, code) {
            return data.findIndex(item => {
                return item.ebplCode === code;
            });
        },
        setOptions(data, leaf) {
            const self = this;
            return data.map(item => {
                item.label = item.ebplNameCn;
                item.value = item.ebplCode;
                item.children = [];
                item.leaf = leaf;
                self.allAddress.push({ label: item.ebplNameCn, value: item.ebplCode });
                return item;
            });
        },
        getData(type, code, idx) {
            return getAreaApi({
                ebplType: type,
                ebplParentPmCode: code
            });
        },
        // 选中地区时关闭弹框
        cascaderChange(val) {
            this.addressCode = [];
            this.addressLabel = [];
            val.map((item, index) => {
                this.allAddress.map(child => {
                    if (item === child.value) {
                        this.addressCode[index] = child.value;
                        this.addressLabel[index] = child.label;
                    }
                });
            });
            let labelName = {};
            labelName[this.labelName] = this.addressLabel.join(' / ');
            let addressCode = {};
            addressCode[this.prop] = this.addressCode;
            if (this.$refs.cascader.checkedValue.length < this.minLayers) {
                const arr = ['省级', '市级', '区县级', '乡镇/街道级'];
                this.$message.warning(`所选地址层级不得小于${arr[this.minLayers - 1]}`);
                this.$emit('update:address', '');
                addressCode = [];
                labelName = {};
            }
            this.$emit('getAddress', addressCode, labelName, this.index);
            this.isComputed = true;
            // 当类型是选任意级的时候，选中即隐藏弹框
            if (this.propsConfig.checkStrictly) {
                this.$refs.cascader && this.$refs.cascader.toggleDropDownVisible(false);
            }
        }
    },
    computed: {
        // data: {
        //     set(val) {
        //         this.$emit('update:address', val);
        //         this.$emit('site-data', this.dataObj);
        //     },
        //     get() {
        //         return this.address;
        //     }
        // },
        propsConfig() {
            return Object.assign({}, this.props, this.config);
        }
    },
    created() {
        if (this.address.length) {
            if (typeof this.address === 'string') {
                this.$emit('update:address', this.initAddress(this.address));
            }
            this.g();
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
</style>