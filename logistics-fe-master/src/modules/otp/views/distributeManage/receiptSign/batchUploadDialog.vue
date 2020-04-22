<template>
    <!-- 列配置按钮左边那个批量上传弹框 -->
    <el-dialog
        v-dialogDrag
        class="receipt receiptSignBatchUpload"
        :closeOnClickModal='false'
        :title="batchUploadTitle"
        :visible="true"
        :before-close="beforeClose"
        width="50%">
        <upload showFileList ref='upload' :batchFlag='batchFlag' :dialogLoading='loading'>
            <div slot='batch'>
                <i class="el-icon-plus sign-for"></i>
                <span>上传回单</span>
            </div>
        </upload>
        <div slot="footer" class="dialog-footer">
            <el-button @click="beforeClose">取消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
import upload from './upload.vue';
import { receiptUpload } from '../../../api/receiptSign';
import { mapState } from 'vuex';
export default {
    components: {
        upload
    },
    props: {
        batchUploadShow: {
            type: Boolean,
            default() {
                return false;
            }
        },
        batchUploadTitle: {
            type: String,
            default() {
                return '';
            }
        },
        batchFlag: {
            type: String,
            default() {
                return '';
            }
        },
        selectData: {
            type: Array,
            default() {
                return [];
            }
        },
        searchObj: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            dialogLoading: {} // 弹框loading实例
        };
    },
    methods: {
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.receiptSignBatchUpload > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        beforeClose() {
            this.$confirm('您确定要取消上传吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('update:batchUploadShow', false);
            }).catch(() => {
            });
        },
        submit() {
            const fileArr = this.$refs.upload.getData().filter(item => item.response);
            if (fileArr.length === 0) {
                this.$message.warning('请上传回单');
                return false;
            }
            const params = {
                createUserName: this.user.userName,
                createUserCode: this.user.userCode,
                signFileUpload: 'N',
                receiptSource: '10'
            };
            params.fileUrls = fileArr.map(item => {
                return item.response.data.downUrl;
            });
            if (this.batchFlag === '') {
                params.taskNoList = this.selectData.map(item => {
                    return item.taskNo;
                });
            } else {
                params.batchFlag = this.batchFlag;
            }
            this.loading();
            receiptUpload(params).then(res => {
                if (res) {
                    if (res.data.length > 0) {
                        let message = '';
                        res.data.forEach(item => {
                            message += `<div style='line-height: 30px;'>
                                        <span style='color: #909399;'>图片</span>
                                        <span style='color: #F56C6C;'>${item.pictureName}</span>
                                        <span style='color: #409EFF;'>${item.message}</span>
                                    <div>`;
                        });
                        const duration = 5000 + res.data.length * 1500;
                        this.$message({
                            type: 'warning',
                            duration,
                            dangerouslyUseHTMLString: true,
                            message,
                            showClose: true
                        });
                    } else {
                        this.$message.success('上传成功');
                        this.$emit('update:batchUploadShow', false);
                        this.$emit('refreshList', this.searchObj); // 更新首页列表数据
                    }
                }
                this.loading(false);
            }).catch(() => {
                this.loading(false);
                this.$message.error('上传失败');
            });
        }
    },
    computed: {
        ...mapState({ user: state => state.user })
    }
};
</script>

<style lang="less">
.receiptTile {
    .receipt {
        .form {
            .el-button--text {
                padding: 0 !important;
            }
        }

        .label {
            color: #999;
        }
        .el-upload--picture-card {
            line-height: 0 !important;
            height: 80px;
            width: 80px;
        }
        .uploads{
            height:200px;
            overflow:auto;
        }
    }
    .sign-for {
        display: block;
        margin: 16px 0 10px 0
    }
}
</style>
