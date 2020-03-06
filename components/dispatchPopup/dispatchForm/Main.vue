<template>
    <Paper>
        <el-dialog
            class="form-dialog"
            :title="title"
            :visible.sync="dialogShow"
            :before-close="handleClose"
            width="60%"
        >
            <el-form
                :label-position="labelPosition"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                ref="ruleForm"
                class="row-box"
            >
                <el-form-item prop="name" class="label-form">
                    <el-input
                        clearable
                        v-model.trim="ruleForm.name"
                        size="medium"
                        placeholder="请输入内容"
                        @blur="detaliSearchBlur"
                        @keyup.enter.native="detaliSearch"
                        @change="advanceCodeChange"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="region" class="label-form">
                    <el-select v-model="ruleForm.region" @change="autocompleteSure" @focus="searchDateChange" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="search" class="label-form" clearable>
                    <el-input
                        placeholder="请输入内容"
                        suffix-icon="el-icon-search"
                        v-model="ruleForm.search"
                        @blur="detaliSearchBlur"
                        @keyup.enter.native="detaliSearch"
                        @change="advanceCodeChange"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="format" class="label-form" clearable>
                    <el-date-picker size="medium" v-model="ruleForm.format" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addOk('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </Paper>
</template>

<script>
import Paper from '@/components/core/paper/Paper';
export default {
    components: {
        Paper
    },
    props: {
        visible: {
            type: Boolean
        }
    },
    data() {
        return {
            labelPosition: 'right',
            title: '操作',
            options: [
                {
                    value: '选项1',
                    label: '黄金糕'
                },
                {
                    value: '选项2',
                    label: '双皮奶'
                },
                {
                    value: '选项3',
                    label: '蚵仔煎'
                },
                {
                    value: '选项4',
                    label: '龙须面'
                },
                {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
            ruleForm: {
                format: '',
                search: '',
                label: '',
                value: '',
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ],
                region: [
                    {
                        required: true,
                        message: '请选择活动区域',
                        trigger: 'blur'
                    }
                ],
                search: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ],
                format: [
                    {
                        required: true,
                        message: '请选择日期',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        addOk(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$refs.ruleForm.resetFields();
                    this.$emit('addOk');
                } else {
                    return false;
                }
            });
        },
        detaliSearchBlur() {
            this.$emit('detaliSearchBlur');
        },
        detaliSearch() {
            this.$emit('detaliSearch');
        },
        advanceCodeChange() {
            this.$emit('advanceCodeChange');
        },
        searchDateChange() {
            this.$emit('searchDateChange');
        },
        autocompleteSure() {
            this.$emit('autocompleteSure');
        },
        cancel() {
            this.$emit('cancel', '');
            this.$refs.ruleForm.resetFields();
        },
        handleClose() {
            this.$emit('handleClose', '');
            this.$refs.ruleForm.resetFields();
        }
    },
    computed: {
        dialogShow: {
            set(val) {
                this.$emit('cancel', false);
            },
            get() {
                // console.log(this.visible);
                return this.visible;
            }
        }
    }
};
</script>

<style lang="less">
.row-box {
    margin: 12px 10px;
    display: flex;
    flex-wrap: wrap;
    .label-form {
        margin-right: 5px;
    }
}
.form-dialog .el-dialog__body {
    padding: 0 0 !important;
}
.el-form-item__label {
    // width:auto !important;
}
.el-form-item__content {
    margin-left: 10px !important;
}
.form-dialog .el-input__inner {
    height: 32px;
    line-height: 32px;
}
.form-dialog  .el-date-editor.el-input{
    width:180px;
}
</style>