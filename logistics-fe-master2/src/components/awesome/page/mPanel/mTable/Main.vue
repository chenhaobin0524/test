<template>
    <el-table stripe :data="data" :loading="loading" @on-select="handleSelect" @on-selection-change="handleSelectionChange" @on-select-all="handleSelectAll" @on-current-change="handleCurrentChange">
        <template v-for="(item,key) in columns">
            <el-table-column :key="key" :prop="item.key" :label="item.title"></el-table-column>
        </template>
    </el-table>
</template>
<script>
export default {
    name: 'mTable',
    data() {
        return {};
    },
    props: {
        showSelection: {
            type: Boolean,
            default: false
        },
        showIndex: {
            type: Boolean,
            default: false
        },
        action: Array,
        columns: Array,
        data: Array,
        loading: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.renderColumns();
    },
    methods: {
        renderColumns() {
            if (this.columns[0].key) {
                if (this.showIndex) {
                    this.columns.unshift({
                        title: '序号',
                        width: 80,
                        align: 'center',
                        type: 'index'
                    });
                }
                if (this.showSelection) {
                    this.columns.unshift({
                        width: 60,
                        align: 'center',
                        type: 'selection'
                    });
                }
            }
            if (!this.columns[this.columns.length - 1].key) {
                this.columns.pop();
            }
            if (this.action && this.action.length > 0) {
                const buttonType = this.action[0].type;
                this.columns.push({
                    title: '操作',
                    width: this.action.length * 46,
                    align: 'center',
                    render: (h, params) => {
                        return this.action.map((button) => {
                            const tooltip = [h('Tooltip', {
                                props: {
                                    content: button.tip,
                                    placement: 'top'
                                }
                            }, [h('Button', {
                                props: {
                                    icon: button.icon,
                                    type: button.type || 'default',
                                    size: button.size || 'default',
                                    shape: button.shape
                                },
                                on: {
                                    click: () => {
                                        this.$emit('on-opr-click', button.event, params);
                                    }
                                },
                                style: {
                                    margin: '0 2px',
                                    padding: '4px 0 4px 4px'
                                }
                            }, buttonType === 'text' ? '' : button.label)])];
                            // if (i < this.action.length - 1) {
                            //   tooltip.push(h('span', '|'));
                            // }
                            return tooltip;
                        });
                    }
                });
            }
        },
        handleSelect(selection, row) {
            this.$emit('on-select', selection, row);
        },
        handleSelectionChange(selection) {
            this.$emit('on-selection-change', selection);
        },
        handleSelectAll(selection) {
            this.$emit('on-select-all', selection);
        },
        handleCurrentChange(currentRow, oldCurrentRow) {
            this.$emit('on-current-change', currentRow, oldCurrentRow);
        }
    }
};
</script>
<style lang="less">
</style>
