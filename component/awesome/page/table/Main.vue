<template>
    <section>
        <div v-if="tableButtons && (tableButtons.systemButtons || tableButtons.customButtons)">
            <m-buttons :custom-buttons="tableButtons.customButtons" :system-buttons="tableButtons.systemButtons" @onSystemBtnClick="onSystemBtnClick" @onCustomBtnClick="onCustomBtnClick"></m-buttons>
        </div>
        <el-table border :data="data" :loading="loading" @on-row-click="rowClick" @on-select="select" @on-selection-change="selectionChange" @on-select-all="selectAll">
            <template v-for="item in columns.columns">
                <el-table-column :prop="item.key" :label="item.title" :key='item.key'></el-table-column>
            </template>
        </el-table>
    </section>
</template>
<script>
import mButtons from '../buttons/index';
import { tableBtnNames } from '../buttons/config';
export default {
    name: 'mTable',
    components: { mButtons },
    data() {
        return {
            selection: [],
            checkboxColumn: {
                type: 'selection',
                width: 60,
                align: 'center'
            }, // 选择列定义
            buttonsColumn: {
                renderHeader: (h, params) => {
                    return h('span', this.$t('page.table.tOperation'));
                },
                key: 'action',
                width: this.columns.buttons ? this.columns.buttons.columnWidth : 0,
                align: 'center',
                render: (h, params) => {
                    return h('div', this.makeUpButtons(h, params));
                }
            } // 操作列定义（接收用户自定义的配置）
        };
    },
    props: {
        tableButtons: {
            type: Object,
            default () {
                return {};
            }
        }, // 表头按钮
        columns: {
            type: Object,
            default () {
                return {
                    showCheckbox: { type: Boolean, default: true },
                    columns: { type: Array, default () { return []; } },
                    buttons: {
                        type: Object,
                        default () {
                            return {
                                view: {
                                    type: Boolean,
                                    default: false
                                },
                                edit: {
                                    type: Boolean,
                                    default: false
                                },
                                delete: {
                                    type: Boolean,
                                    default: false
                                },
                                selfDef: {
                                    type: Array,
                                    default () {
                                        return [];
                                    }
                                }
                            };
                        }
                    }
                };
            }
        }, // 数据列定义
        data: {
            type: Array,
            default () {
                return [];
            }
        }, // 表格数据
        loading: {
            type: Boolean,
            default: false
        } // 是否显示正在加载
    },
    computed: {
        cTxtView() {
            return this.$t('page.table.tView');
        },
        cTxtEdit() {
            return this.$t('page.table.tEdit');
        },
        cTxtDelete() {
            return this.$t('page.table.tDelete');
        }
    },
    methods: {
        /**
         * 单击某一行时触发
         * @param row 当前行数据
         * @param index 当前行索引
         */
        rowClick(row, index) {
            this.$emit('rowClick', row, index);
        },
        /**
         * 在多选模式下有效，选中某一项时触发
         * @param selection 已选项数据
         * @param row 刚选择的项数据
         */
        select(selection, row) {
            this.$emit('select', selection, row);
        },
        selectionChange(selection) {
            this.selection = selection;
            this.$emit('onSelectionChange', selection);
        },
        /**
         * 在多选模式下有效，点击全选时触发
         * @param selection 已选项数据
         */
        selectAll(selection) {
            this.$emit('selectAll', selection);
        },
        /**
         * 组装操作列的按钮
         */
        makeUpButtons(h, params) {
            const res = [];
            if (this.columns.buttons) {
                if (this.columns.buttons.view) {
                    res.push(h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.$emit('onView', params.row, params.column, params.index);
                            }
                        }
                    }, this.cTxtView));
                }
                if (this.columns.buttons.edit) {
                    res.push(h('Button', {
                        props: {
                            type: 'warning',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.$emit('onEdit', params.row, params.column, params.index);
                            }
                        }
                    }, this.cTxtEdit));
                }
                if (this.columns.buttons.delete) {
                    res.push(h('Button', {
                        props: {
                            type: 'error',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.$emit('onDelete', params.row, params.column, params.index);
                            }
                        }
                    }, this.cTxtDelete));
                }
                if (this.columns.buttons.selfDef && this.columns.buttons.selfDef.length > 0) {
                    this.columns.buttons.selfDef.forEach((item, index) => {
                        res.push(h('Button', {
                            props: {
                                type: 'info',
                                size: 'small'
                            },
                            style: {
                                display: item.show === false ? 'none' : 'inline-block',
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    item.handler(params);
                                }
                            }
                        }, this.$t(item.label)));
                    });
                }
            }
            return res;
        },
        onSystemBtnClick(name) {
            switch (name) {
            case tableBtnNames.btnAdd:
                this.$emit('onSysAdd');
                break;
            case tableBtnNames.btnEdit:
                if (this.selection.length !== 1) {
                    this.$Message.warning(this.$t('page.assemblyTable.selectOne'));
                } else {
                    this.$emit('onSysEdit', this.selection);
                }
                break;
            case tableBtnNames.btnDel:
                if (this.selection.length === 0) {
                    this.$Message.warning(this.$t('page.assemblyTable.selectOneAtLeast'));
                } else {
                    this.$Modal.confirm({
                        title: this.$t('page.assemblyTable.confirmTitle'),
                        content: this.$t('page.assemblyTable.confirmDelete'),
                        onOk: () => {
                            this.$emit('onSysDelete', this.selection);
                        },
                        onCancel: () => {}
                    });
                }
                break;
            case tableBtnNames.btnImport:
                this.$emit('onSysImport');
                break;
            case tableBtnNames.btnExport:
                this.$emit('onSysExport');
                break;
            default:
                break;
            }
        },
        onCustomBtnClick(click) {
            click();
        }
    },
    created() {
        if (this.columns.showCheckbox) {
            this.columns.columns.unshift(this.checkboxColumn);
        }
        if (this.columns.buttons) {
            this.columns.columns.push(this.buttonsColumn);
        }
    }
};
</script>
<style>
.m-table-title {
    height: auto;
}
</style>