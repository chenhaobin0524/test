<template>
    <div>
        <div slot="header" v-if="showHeader" class="edit-table-header-btn">
            <slot name="header"></slot>
        </div><br/>
        <el-table ref="editTable" highlight-row class="edit-table" :loading="loading" :data="value" border
                @on-row-dblclick="handleRowDblClick" @on-selection-change="handleSelectionChange">
            <div v-for="(item, index) in columns" :key="'row_' + index">
                <el-table-column :prop="item.key" :label="item.title" />
            </div>
        </el-table>
        <div slot="footer" v-if="showFooter">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script>
import { componentType } from './config';
const cellInput = (h, currentRow, col) => {
    return h('Input', {
        props: {
            value: currentRow[col.key].value
        },
        on: {
            'on-blur'(event) {
                currentRow[col.key].value = event.target.value;
            }
        }
    });
}; // 单元格内的文本框控件
const cellDatePicker = (h, currentRow, col) => {
    return h('DatePicker', {
        props: {
            value: currentRow[col.key].value
        },
        on: {
            'on-change'(date) {
                currentRow[col.key].value = date;
            }
        }
    });
}; // 单元格内的日期选择器控件
const cellCheckbox = (h, currentRow, col) => {
    return h('Checkbox', {
        props: {
            value: currentRow[col.key].value
        },
        on: {
            'on-change'(checked) {
                currentRow[col.key].value = checked;
            }
        }
    }, currentRow[col.key].label);
}; // 单元格内的多选框控件
const cellCheckboxGroup = (h, currentRow, col) => {
    const checkboxOptions = [];
    if (col.options) {
        col.options.forEach(opt => {
            checkboxOptions.push(h('Checkbox', { props: { label: opt } }));
        });
    }
    return h('CheckboxGroup', {
        props: {
            value: currentRow[col.key].value
        },
        on: {
            'on-change'(selection) {
                currentRow[col.key].value = selection;
            }
        }
    }, checkboxOptions);
}; // 单元格内的多选框组控件
const cellSelect = (h, currentRow, col) => {
    const selectOptions = [];
    if (col.options) {
        col.options.forEach(opt => {
            selectOptions.push(h('Option', { props: { value: opt.value } }, opt.label));
        });
    }
    return h('Select', {
        props: {
            value: currentRow[col.key].value
        },
        on: {
            'on-change'(selection) {
                currentRow[col.key].value = selection;
            }
        }
    }, selectOptions);
}; // 单元格内的下拉框控件
const cellMagnifier = (h, currentRow, vm, index, col) => {
    return h('Input', {
        props: {
            icon: 'search',
            value: currentRow[col.key].value
        },
        on: {
            'on-click'() {
                vm.$emit('on-cell-magnifier', currentRow, index, col);
            },
            'on-blur'(event) {
                currentRow[col.key].value = event.target.value;
            }
        }
    });
}; // 单元格内的放大镜组件（只提供放大镜图标及其点击事件，需要自己在点击事件里实现放大镜功能）
const editButton = (h, currentRow, vm, index) => {
    const isEditing = vm.isRowEditing(currentRow);
    const button = h('Button', {
        props: {
            type: 'text',
            size: 'large',
            icon: isEditing ? 'checkmark' : 'edit'
        },
        on: {
            'click'() {
                vm.changeRowState(index, !isEditing);
                if (!isEditing) {
                    vm.$emit('on-row-edit', currentRow, index);
                }
            }
        }
    });
    return h('Tooltip', { props: { content: isEditing ? vm.$t('page.editTable.tSave') : vm.$t('page.editTable.tEdit'), placement: 'top' } }, [button]);
}; // 操作列编辑按钮
const viewButton = (h, currentRow, vm, index) => {
    const button = h('Button', {
        props: {
            type: 'text',
            size: 'large',
            icon: 'eye'
        },
        on: {
            'click'() {
                vm.$emit('on-row-view', currentRow, index);
            }
        }
    });
    return h('Tooltip', { props: { content: vm.$t('page.editTable.tView'), placement: 'top' } }, [button]);
}; // 操作列查看按钮
const deleteButton = (h, currentRow, vm, index) => {
    const button = h('Poptip', {
        props: {
            confirm: true,
            title: vm.$t('page.editTable.confirmDelete'),
            transfer: true
        },
        on: {
            'on-ok'() {
                vm.value.splice(index, 1);
                vm.$emit('on-row-delete-success', vm.value);
            }
        }
    }, [
        h('Button', {
            props: {
                type: 'text',
                placement: 'top',
                icon: 'trash-a',
                size: 'large'
            }
        })
    ]);
    return h('Tooltip', { props: { content: vm.$t('page.editTable.tDelete'), placement: 'top' } }, [button]);
}; // 操作列删除按钮
const customButton = (h, currentRow, vm, index, btn) => {
    const button = h('Button', {
        props: {
            type: 'text',
            size: 'large',
            icon: btn.icon
        },
        on: {
            'click'() {
                vm.$emit(btn.event, currentRow, index);
            }
        }
    });
    return h('Tooltip', { props: { content: btn.title, placement: 'top' } }, [button]);
}; // 操作列自定义按钮
export default {
    name: 'EditTable',
    data() {
        return {
            selection: []
        };
    },
    props: {
        uniqueKey: {
            type: String,
            default: ''
        },
        columns: {
            type: Array,
            default () {
                return [];
            }
        },
        value: {
            type: Array,
            default () {
                return [];
            }
        },
        editingAll: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: false
        },
        showFooter: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        } // 是否显示正在加载
    },
    created() {
        this.renderTable(this);
    },
    methods: {
        /**
         * 渲染表格
         **/
        renderTable(vm) {
            this.columns.forEach(col => {
                if (col.type !== 'selection' && col.type !== 'opr' && col.type !== 'index') {
                    if (!col.render) {
                        col.render = (h, param) => {
                            const currentRow = vm.value[param.index];
                            switch (col.editType) {
                            case componentType.Input:
                                if (currentRow[col.key].editable && currentRow[col.key].editing) {
                                    return cellInput(h, currentRow, col);
                                } else {
                                    return h('span', currentRow[col.key].value);
                                }
                            case componentType.DatePicker:
                                if (currentRow[col.key].editable && currentRow[col.key].editing) {
                                    return cellDatePicker(h, currentRow, col);
                                } else {
                                    return h('span', currentRow[col.key].value);
                                }
                            case componentType.Checkbox:
                                if (currentRow[col.key].editable && currentRow[col.key].editing) {
                                    return cellCheckbox(h, currentRow, col);
                                } else {
                                    if (currentRow[col.key].value === true) {
                                        return h('Icon', { props: { type: 'checkmark' } });
                                    } else {
                                        return h('');
                                    }
                                }
                            case componentType.CheckboxGroup:
                                if (currentRow[col.key].editable && currentRow[col.key].editing) {
                                    return cellCheckboxGroup(h, currentRow, col);
                                } else {
                                    return h('span', currentRow[col.key].value.join(','));
                                }
                            case componentType.Select:
                                if (currentRow[col.key].editable && currentRow[col.key].editing) {
                                    return cellSelect(h, currentRow, col);
                                } else {
                                    let label = '';
                                    if (col.options) {
                                        col.options.forEach(opt => {
                                            if (opt.value === currentRow[col.key].value) {
                                                label = opt.label;
                                            }
                                        });
                                    } else {
                                        label = currentRow[col.key].value;
                                    }
                                    return h('span', label);
                                }
                            case componentType.Magnifier:
                                if (currentRow[col.key].editable && currentRow[col.key].editing) {
                                    return cellMagnifier(h, currentRow, vm, param.index, col);
                                } else {
                                    return h('span', currentRow[col.key].value);
                                }
                            case undefined:
                            default:
                                return h('span', col.key && currentRow[col.key] ? currentRow[col.key].value : '');
                            }
                        };
                    }
                } else if (col.type === 'opr' && col.handle) {
                    if (!col.render) {
                        col.render = (h, param) => {
                            const currentRow = vm.value[param.index];
                            const buttons = [];
                            if (col.handle.system) {
                                col.handle.system.forEach(btn => {
                                    if (btn === 'edit') {
                                        buttons.push(editButton(h, currentRow, vm, param.index));
                                    } else if (btn === 'view') {
                                        buttons.push(viewButton(h, currentRow, vm, param.index));
                                    } else if (btn === 'delete') {
                                        buttons.push(deleteButton(h, currentRow, vm, param.index));
                                    }
                                });
                            }
                            if (col.handle.custom) {
                                col.handle.custom.forEach(btn => {
                                    buttons.push(customButton(h, currentRow, vm, param.index, btn));
                                });
                            }
                            return h('div', buttons);
                        };
                    }
                }
            });
        },
        /* ****************** 方法 start****************** */
        /**
         * 改变一行的可编辑状态
         * param @index
         * param @editing
         **/
        changeRowState(index, editing) {
            this.columns.forEach(col => {
                if (col.type !== 'selection' && col.type !== 'opr' && col.type !== 'index') {
                    if (col.key) {
                        this.value[index][col.key].editing = editing;
                    }
                } else if (col.type === 'selection' && this.uniqueKey !== '') {
                    for (let i = 0; i < this.value.length; i++) {
                        this.value[i]._checked = false;
                        this.selection.forEach(item => {
                            if (this.value[i][this.uniqueKey].value === item[this.uniqueKey]) {
                                this.value[i]._checked = true;
                            }
                        });
                    }
                }
            });
        },
        /**
         *  改变整个表格的可编辑状态
         * @param editing
         */
        changeTableState(editing) {
            this.columns.forEach(col => {
                if (col.type !== 'selection' && col.type !== 'opr' && col.type !== 'index') {
                    for (let i = 0; i < this.value.length; i++) {
                        if (col.key) {
                            this.value[i][col.key].editing = editing;
                        }
                    }
                } else if (col.type === 'selection' && this.uniqueKey !== '') {
                    for (let i = 0; i < this.value.length; i++) {
                        this.value[i]._checked = false;
                        this.selection.forEach(item => {
                            if (this.value[i][this.uniqueKey].value === item[this.uniqueKey]) {
                                this.value[i]._checked = true;
                            }
                        });
                    }
                }
            });
        },
        /**
         * 判断当前行是否处于可编辑状态
         * @param currentRow
         */
        isRowEditing(currentRow) {
            let isEditing = false;
            this.columns.forEach(col => {
                if (col.type !== 'selection' && col.type !== 'opr' && col.type !== 'index') {
                    if (col.key && currentRow[col.key] && currentRow[col.key].editing) {
                        isEditing = true;
                    }
                }
            });
            return isEditing;
        },
        /* ****************** 方法 end****************** */
        /* ****************** 事件 start****************** */
        /**
         * 表格行双击时触发
         * @param row
         * @param index
         */
        handleRowDblClick(row, index) {
            this.changeRowState(index, !this.isRowEditing(row));
        },
        /**
         * 选中项发生变化时触发
         * @param selection
         */
        handleSelectionChange(selection) {
            this.selection = [];
            selection.forEach(item => {
                const row = {};
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        row[key] = item[key].value;
                    }
                }
                this.selection.push(row);
            });
            this.$emit('on-selection-change', this.selection);
        }
        /* ****************** 事件 end****************** */
    },
    watch: {
        editingAll(val) {
            this.changeTableState(val);
        }
    }
};

</script>
<style lang="less">
.edit-table {
    .edit-table-header-btn {
        button {
            float: left;
            margin-left: 8px;
            margin-top: 8px;
        }
    }

    .m-tooltip {
        .m-tooltip-rel {
            .m-btn-large {
                padding: 6px;
            }
        }
    }
}

</style>
