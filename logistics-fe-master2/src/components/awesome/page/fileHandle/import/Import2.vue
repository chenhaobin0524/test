<template>
   <div class="demo-import2">
        <div v-has='resourceId||""'>
            <el-button :type="type==='text'?'text':(disabled?'defult':'primary')" :disabled="disabled" :icon="icon?icon:''" @click="dialogVisible = true"><slot name="button-name"></slot></el-button>
        </div>
        <el-dialog
        title="导入"
        :visible.sync="dialogVisible"
        width="50%"
        @close='beforeColse'>
           <el-row>
               <el-col :span="20">
                    <el-button type="pirmary" @click="TemplateDownload">下载模板</el-button>
                    <el-upload
                        class='upload-demo'
                        ref="upload"
                        action=''
                        :on-remove='handleRemove'
                        :on-change='onchange'
                        :limit='1'
                        :on-exceed='handleExceed'
                        :file-list='fileList'
                        :show-file-list='true'
                        :auto-upload='false'
                        :http-request="addAttachment"
                        >
                        <el-button type='primary'>选择文件</el-button>
                    </el-upload>
                </el-col>
                <el-col :span="4">
                    <el-button type='primary' @click="submitUpload" :loading='loading'>导 入</el-button>
                </el-col>
           </el-row>
        </el-dialog>
    </div>
</template>
<script>
import request from '@/utils/http';
export default {
    name: 'mImport',
    data() {
        return {
            fileList: [],
            dialogVisible: false,
            loading: false
        };
    },
    props: {
        templateName: String,
        templateUrl: String,
        uploadUrl: String,
        disabled: Boolean,
        type: String,
        icon: String,
        params: Object,
        tempparams: Object,
        resourceId: String
    },
    computed: {
        myHeader() {
            return {
                'Content-Type': 'multipart/form-data'
            };
        }
    },
    methods: {
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        handleRemove(row) {
            this.fileList.splice(row, 1);
        },
        onchange(file, fileList) {
            this.fileList = fileList;
        },
        TemplateDownload() {
            return request({
                url: this.templateUrl,
                method: 'post',
                data: {
                    ...this.tempparams
                },
                responseType: 'arraybuffer'
            }).then(res => {
                const blob = new Blob([res], {
                    type: 'application/x-excel;charset=UTF-8'
                });
                const objectUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = objectUrl;
                a.download = this.templateName;
                a.click();
                this.$message.success('下载成功');
            });
        },
        addAttachment(file) {
            this.loading = true;
            const param = new FormData();
            param.append('file', file.file);
            for (var i in this.params) {
                if (this.params.hasOwnProperty(i)) {
                    if (typeof (this.params[i]) === 'string') {
                        param.append(i, this.params[i]);
                    } else {
                        param.append(i, JSON.stringify(this.params[i]));
                    }
                }
            }
            return request({
                url: this.uploadUrl,
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: param
            }).then(res => {
                if (res) {
                    this.$message.success('文件导入成功！');
                    this.$emit('import-callback', true);
                    this.dialogVisible = false;
                } else {
                    this.$emit('import-callback', false);
                }
                this.loading = false;
            }).catch(res => {
                this.loading = false;
            });
        },
        beforeColse() {
            this.fileList = [];
        }
    },
    mounted() {
    },
    components: {}
};
</script>
<style lang='less'>
    .demo-import2 {
        display: inline-block;
        .upload-demo {
            margin-bottom: 10px;
            display: inline-block;
            margin-right: 10px;
        }
        .el-progress {
            display: inline-block;
            width: 200px;
        }
        .el-upload__input {
            display: none;
        }
        h1 {
            font-size: 1.5em
        }
        .el-table th, .el-table td {
            text-align: center
        }
        .el-table {
            min-height: 200px !important;
            max-height: 200px !important;
        }
        .el-upload-list {
            display: inline-block;
        }
        .el-button--primary {
            margin: 0 10px;
        }
        .el-upload-list__item {
            line-height: 1;
            margin-top: 0;
        }
        .el-upload-list__item .el-icon-close {
            top: 0;
        }
    }
    .demo-import2 + .el-button {
        margin-left: 10px;
    }
    .el-button + .demo-import2 {
        margin-left: 10px;
    }
</style>