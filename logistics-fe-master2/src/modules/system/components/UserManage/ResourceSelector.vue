<template>
    <div class="resource-selector">
        <el-row class="row-cell">
            <el-col :span="8" class="col-cell col-cell-right" v-loading="leftLoading">
                <el-input
                        size="mini"
                        placeholder="搜索应用"
                        v-model="keyword"
                        @keyup.enter.native="() => {$emit('selectLeft', keyword)}"
                        class="search">
                </el-input>
                <LeftTree :systems="systems" @handleSelect="handleSelectLeft"/>
            </el-col>
            <el-col :span="16" class="col-cell" v-loading="rightLoading">
                <RightTree @save="save"
                           :treeData="treeData"
                           @closeDialog="closeDialog"
                           @checks="checks"
                           @rightChecks="rightChecks"
                           :hasSelect="hasSelect"
                           :hasRightSelect="hasRightSelect"
                           :defaultProps="defaultProps"/>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import LeftTree from '../SelectTree/LeftTree';
import RightTree from '../SelectTree/RightTree';
export default {
    data() {
        return {
            keyword: ''
        };
    },
    props: {
        defaultProps: {
            type: Object,
            default: () => {
                return {
                    children: 'subResources',
                    label: 'resourceCode'
                };
            }
        },
        userData: {
            type: Object,
            default: () => {
                return {};
            }
        },
        systems: {
            type: Array,
            default: () => {
                return [];
            }
        },
        treeData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        leftLoading: {
            type: Boolean,
            default: false
        },
        rightLoading: {
            type: Boolean,
            default: false
        },
        hasSelect: {
            type: Array,
            default: () => {
                return [];
            }
        },
        hasRightSelect: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        save() {
            this.$emit('save', this.userData);
        },
        handleSelectLeft(key) {
            this.$emit('handleSelectLeft', key);
        },
        closeDialog() {
            this.$emit('closeDialog');
        },
        checks(val) {
            this.$emit('checks', val);
        },
        rightChecks(val) {
            this.$emit('rightChecks', val);
        }
    },
    components: {
        LeftTree,
        RightTree
    }
};
</script>
<style lang="less">
.resource-selector {
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    .row-cell{
        flex: 1 1 auto;
        height: 100%;
        .col-cell{
            height: 100%;
            display: flex;
            flex-direction: column;
            &-right{
                padding-right: 15px;
            }
            .title-row {
                margin-bottom: 10px;
                font-size: 12px;
            }
            .search{
                margin-bottom: 10px;
                font-size: 12px;
            }
        }
    }
}
</style>
