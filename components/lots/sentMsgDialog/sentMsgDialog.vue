<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="showEditor" @close="handleClose" width="60%">
            <el-form :model="editorInfo" :rules="editorRules" ref="editorInfo" label-width="88px">
                <el-form-item prop="title"  style="width:100%;" label="标题：">
                    <el-input v-model="editorInfo.title" placeholder="输入标题" :disabled="(currentData && currentData.noticeStatus) ? true : false" ></el-input>
                </el-form-item>
                <el-form-item prop="content" style="width:100%;" label="内容：" >
                    <div :class="{'border-red': (editorInfo.content === '' || editorInfo.content === '<p><br></p>') && selcflag}">
                        <editor :content="editorInfo.content" @changeContent="changeContent" :editable="(currentData && currentData.noticeStatus === 1) ? false : true"></editor>
                    </div>
                </el-form-item>
                <div style="display:flex;">
                    <el-form-item label="消息类型：" style="width:50%;"  prop="noticeType">
                        <el-select
                            v-model="editorInfo.noticeType"
                            :disabled="(currentData && currentData.noticeStatus) ? true : false"
                            placeholder="选择消息类型"
                            style="width:100%;">
                            <el-option label="公告" :value="1"></el-option>
                            <el-option label="预警" :value="2"></el-option>
                            <el-option label="维护" :value="3"></el-option>
                            <el-option label="更新" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发送范围：" style="width:50%;" prop="applicationCode">
                        <el-select
                            v-model="editorInfo.applicationCode"
                            :disabled="(currentData && currentData.noticeStatus) ? true : false"
                            placeholder="选择应用"
                            style="width:100%;">
                            <el-option :label="item.applicationName" :value="item.applicationCode" v-for="(item, index) in AppList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div style="display:flex;">
                    <el-form-item label="开始时间：" style="width:50%;" prop="noticeStartTime">
                        <el-date-picker
                            v-model="editorInfo.noticeStartTime"
                            :disabled="(currentData && currentData.noticeStatus) ? true : false"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间：" style="width:50%;" prop="noticeEndTime">
                        <el-date-picker
                            v-model="editorInfo.noticeEndTime"
                            :disabled="(currentData && currentData.noticeStatus) ? true : false"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="currentData && currentData.noticeStatus ? true : false" type="primary" @click="showEditorShowBtn(0, '撤回')">撤回</el-button>
                <el-button v-if="!currentData || (currentData && !currentData.noticeStatus) ? true : false" @click="showEditorShowBtn(0, '保存')">保存草稿</el-button>
                <el-button v-if="!currentData || (currentData && !currentData.noticeStatus) ? true : false" type="primary" @click="showEditorShowBtn(1, '发布')">发 布</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import editor from './richtext/rich.vue';
import { getTenantOwnApplications, sentmsg, savemsg } from './api/applications.js';
export default {
    props: {
        data: {
            type: Object
        }
    },
    data() {
        const checkcontent = (rule, value, callback) => {
            if (this.editorInfo.content === '' || this.editorInfo.content === '<p><br></p>') {
                this.selcflag = true;
                callback(new Error('请输入内容'));
            } else {
                callback();
            }
        };
        const validateTime = (rule, value, callback) => {
            if (value <= this.editorInfo.noticeStartTime) {
                callback(new Error('结束时间必须大于开始时间'));
            } else {
                callback();
            }
        };

        return {
            currentData: null,
            showEditor: false,
            selcflag: false,
            editorInfo: {
                title: '',
                content: '',
                noticeType: '',
                applicationCode: '',
                noticeStartTime: '',
                noticeEndTime: ''
            },
            AppList: [],
            editorRules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { max: 64, message: '不能超过64个字符', trigger: 'blur' }
                ],
                content: [
                    { required: true, validator: checkcontent, trigger: 'blur' }
                ],
                noticeType: [
                    { required: true, message: '请选择消息类型', trigger: 'blur' }
                ],
                applicationCode: [
                    { required: true, message: '请选择应用', trigger: 'blur' }
                ],
                noticeStartTime: [
                    { required: true, message: '请选择开始时间', trigger: 'blur' }
                ],
                noticeEndTime: [
                    { required: true, message: '请选择结束时间', trigger: 'blur' },
                    { validator: validateTime, trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        dialogTitle() {
            let title = '';
            if (!this.currentData) {
                title = '新增内容';
            } else if (this.currentData && this.currentData.noticeStatus) {
                title = '查看内容';
            } else if (this.currentData && !this.currentData.noticeStatus) {
                title = '编辑内容';
            }
            return title;
        }
    },
    components: { editor },
    methods: {
        handleVisible(flag = false) {
            this.showEditor = flag;
            this.appListFunc();
        },
        handleClose() {
            this.currentData = null;
            this.editorInfo = {
                title: '',
                content: '',
                noticeType: '',
                applicationCode: '',
                noticeStartTime: '',
                noticeEndTime: ''
            };
            this.$refs.editorInfo.clearValidate();
            this.showEditor = false;
        },
        changeContent(html) {
            this.editorInfo.content = html;
        },
        appListFunc() {
            getTenantOwnApplications().then(res => {
                if (+res.code === 0) {
                    this.AppList = res.data && res.data.map((el) => {
                        return {
                            applicationCode: el.applicationCode,
                            applicationName: el.applicationName
                        };
                    });
                } else {
                    this.$message.error(res.msg);
                }
            }).catch((res) => {
                this.$message.error(res.msg);
            });
        },
        showEditorShowBtn(type, operate) {
            this.$refs.editorInfo.validate((valid) => {
                if (valid) {
                    // this.editorInfo.noticeStartTime = this.formdata(this.editorInfo.noticeStartTime);
                    // this.editorInfo.noticeEndTime = this.formdata(this.editorInfo.noticeEndTime);
                    this.editorInfo.noticeStatus = +type;
                    let params = {};
                    let req = null;
                    if (this.currentData) {
                        params = { ...this.editorInfo, id: this.currentData.id };
                        req = savemsg;
                    } else {
                        params = { ...this.editorInfo };
                        req = sentmsg;
                    }
                    params.content.replace(/<table border="0"/g, `<table border="1px solid #ccc" style="border-collapse:collapse;"`);
                    req(params).then(res => {
                        if (+res.code === 0) {
                            this.editorInfo.title = '';
                            this.editorInfo.content = '';
                            this.editorInfo.noticeType = '';
                            this.editorInfo.applicationCode = '';
                            this.editorInfo.noticeStartTime = '';
                            this.editorInfo.noticeEndTime = '';
                            this.$refs.editorInfo.resetFields();
                            this.showEditor = false;
                            this.$message.success(`${operate}成功！`);
                            this.$emit('success');
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch((res) => {
                        this.$message.error(res.msg);
                    });
                }
            });
        },
        formdata(time) {
            const date = new Date(time);
            const value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            return value;
        }
    },
    watch: {
        data(val, oldVal) {
            if (val) {
                this.editorInfo = {
                    title: val.title,
                    content: val.content,
                    noticeType: val.noticeType,
                    applicationCode: val.applicationCode,
                    noticeStartTime: val.noticeStartTime,
                    noticeEndTime: val.noticeEndTime
                };
                this.currentData = val;
            } else {
                this.editorInfo = {
                    title: '',
                    content: '',
                    noticeType: '',
                    applicationCode: '',
                    noticeStartTime: '',
                    noticeEndTime: ''
                };
                this.currentData = null;
            }
        }
    }
};
</script>

<style lang="less">
.border-red {
    border: 1px solid red;
}
</style>