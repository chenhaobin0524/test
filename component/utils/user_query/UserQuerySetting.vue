<template>
    <div class="user-query">
        <el-dialog :visible.sync="visible" title="列配置" width="800" @close="handleModalCancel" @on-ok="handleModalOk" @on-cancel="handleModalCancel">
            <el-card>
                <h4> 选择要显示的列</h4>
                <div class="spaceline"></div>
                <div>
                    <ul id="sort-items" class="sort-items clearfix">
                        <li :class="itemsClass.li[item.key]?itemsClass.li[item.key]:'func-add'" v-for="item in value" @click="handleItemSelect(item.key)" :key='item.key'>
                            <div class="func-box">
                                <span class="fbox-label">{{item.title}}</span>
                                <i :class="itemsClass.icon[item.key]?itemsClass.icon[item.key]:'el-icon-circle-plus'" class="fbox-icon"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-card><br/>
            <el-card>
                <h4>已选中的列(可拖拽排序)</h4>
                <div class="spaceline"></div>
                <ul id="sort-selected-items" class="sort-items clearfix">
                    <li class="func-normal" v-for="item in selectedColumns" :key='item.key'>
                        <div class="func-box">
                            <span class="fbox-label">{{item.title}}</span>
                            <i class="el-icon-circle-close fbox-icon" @click.native="handleItemClose(item.key)"></i>
                        </div>
                    </li>
                </ul>
            </el-card>
            <div class="btns">
              <el-button @click="handleModalCancel" size="small">取 消</el-button>
              <el-button type="primary" @click="handleModalOk" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Sortable from 'sortablejs';
export default {
    name: 'UserQuerySetting',
    data() {
        return {
            visible: true,
            itemsClass: { li: {}, icon: {} },
            selectedColumns: [],
            newColumn: {
                key: '',
                title: ''
            }
        };
    },
    props: {
        showModal: {
            type: Boolean,
            default () {
                return false;
            }
        },
        value: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    mounted() {
        this.visible = this.showModal;
        let el = document.getElementById('sort-items');
        if (el) {
            Sortable.create(el);
        }
        el = document.getElementById('sort-selected-items');
        if (el) {
            Sortable.create(el, {
                onEnd: (evt) => {
                    this.sortColumns(this.selectedColumns, evt);
                }
            });
        }
    },
    methods: {
        sortColumns(items, evt) {
            const dragItem = items[evt.oldIndex];
            if (evt.oldIndex < evt.newIndex) {
                for (let i = evt.oldIndex; i < evt.newIndex; i++) {
                    items[i] = items[i + 1];
                }
            } else {
                for (let i = evt.oldIndex; i > evt.newIndex; i--) {
                    items[i] = items[i - 1];
                }
            }
            items[evt.newIndex] = dragItem;
        },
        handleModalOk() {
            this.visible = false;
            this.$emit('on-ok', this.selectedColumns);
        },
        handleModalCancel() {
            this.visible = false;
            this.$emit('on-cancel');
        },
        handleItemSelect(key) {
            if (this.selectedColumns.filter(item => item.key === key).length === 0) {
                let index = -1;
                this.value.forEach((item, i) => {
                    if (item.key === key) index = i;
                });
                if (index > -1) {
                    this.selectedColumns.push(this.value[index]);
                    this.itemsClass.li[key] = 'func-selected';
                    this.itemsClass.icon[key] = 'el-icon-circle-check';
                }
            }
        },
        handleItemClose(key) {
            let index = -1;
            this.selectedColumns.forEach((item, i) => {
                if (item.key === key) index = i;
            });
            if (index > -1) {
                this.selectedColumns.splice(index, 1);
                this.itemsClass.li[key] = 'func-add';
                this.itemsClass.icon[key] = 'el-icon-circle-plus';
            }
        }
    },
    watch: {
        showModal(val) {
            if (!val) {
                this.selectedColumns = [];
                this.itemsClass = { li: {}, icon: {} };
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/vars.less';

.btns {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}
.spaceline{
            height: 1px;
            background-color: #f1f1f1;
            margin-bottom: 10px;
        }
.sort-items {
    margin: 15px 0px;
    list-style: none;
    li {
        float: left;
        cursor: pointer;
        margin-right: 10px;
        height: 30px;
        border: 1px solid #e1e1e1;
        line-height: 30px;
        position: relative;

        .func-box {
            width: 80px;
            height: 25px;
            text-align: center;
            display: inline-block;

            .fbox-icon {
                position: absolute;
                right: -4px;
                top: -5px;
                font-size: 14px;
            }
        }

        &.func-normal {
            .fbox-icon {
                color: @color-danger;

                &:hover {
                    font-size: 16px;
                    transform: scale(1.02);
                }
            }
        }

        &.func-selected {
            background: #e1e1e1;
            cursor: auto;

            .fbox-icon {
                color: @color-muted
            }
        }

        &.func-add {
            .fbox-icon {
                color: @color-primary
            }

            &:hover {
                border: 1px solid @color-primary;
                transform: scale(1.02);
            }
        }
    }
}
</style>