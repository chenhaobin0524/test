<template>
    <el-dialog class="mip-iflow-cont" title="MIP库存调账流程" :visible.sync="mipVisible" width="90%" :before-close="handleMipClose">
        <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
            <el-row>
                <el-col>
                    <el-form-item label="标题">
                        <span>{{formData.title}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="内容">
                        <editor :content="formData.content" :editable="false"></editor>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                     <el-form-item label="附件">
                         <el-button v-if="fileList.length > 0" type="text" @click.native="AllFilesDownLoad">全部下载</el-button>
                        <ul>
                            <li v-for="(file, index) in fileList" :key="index">
                                <span>{{file.name}}<span class="file-size">{{file.size}}</span>
                                <el-button type="text" @click.native="filePriview(file)">预览</el-button>
                                <el-button type="text" @click.native="fileDownLoad(file)">下载</el-button>
                            </span>
                            </li>
                        </ul>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="业务类型" prop="input">
                        <el-radio-group disabled v-model="formData.input">
                            <el-radio label="A">基地业务，配送中心业务</el-radio>
                            <el-radio label="B">电商中心、服务中心业务</el-radio>
                            <el-radio label="C">托盘业务</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template>
            <iframe :src="extFrameUrl" style="width:100%;height:500px;"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleMipClose">取 消</el-button>
                <el-button v-if="!(mipFdStatus === '20' || mipFdStatus === '40')"  type="primary" @click="handleMipSubmit" :loading="loading">MIP提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import editor from './WangEditor';
import { mapState } from 'vuex';
import configs from '@/config/user.env';
import { getCertBySDK } from '@/components/lots/OSS/api.js';
import { filePreview } from './preview.js';
import { createProcess, mipIflowCreateDraft, getMipForm } from '../../../../api/orderCenter';
export default {
    components: { editor },
    props: {
        mipVisible: {
            type: Boolean,
            dafault: false
        },
        orderNo: {
            type: String,
            dafault: ''
        },
        appCode: {
            type: String,
            dafault: ''
        },
        moduleName: {
            type: String,
            dafault: ''
        },
        reqInput: {
            type: String,
            dafault: ''
        }
    },
    data() {
        return {
            loading: false,
            formData: {
                content: '',
                input: '',
                title: ''
            },
            mipUpload: ' ',
            rules: {
                input: [
                    { required: true, message: '请选择业务类型', trigger: 'change' }
                ]
            },
            extFrameUrl: '',
            mipFdStatus: '',
            mipFdId: '',
            fileList: [],
            timeNum: '',
            certification: ''
        };
    },
    methods: {
        handleMipSubmit() {
            window.frames[0].postMessage('mbpm_getApprovalData', '*');
        },
        handleMipClose() {
            this.$emit('handleMipClose');
        },
        messageFunc() {
            this.messageCallBack(event);
        },
        messageCallBack(event) {
            if (event.data.success) {
                const params = event.data.data;
                params.formInstanceId = this.orderNo;
                params.tenantCode = this.currentTenant.tenantCode;
                params.currentApplicationCode = this.appCode;
                params.formParam.formData = null;
                this.loading = true;
                createProcess(params).then(res => {
                    this.loading = false;
                    if (res) {
                        this.$message.success('提交成功！');
                        this.$emit('handleMipOk');
                    }
                }).catch(() => {
                    this.loading = false;
                });
            }
        },
        mipIflowCreateDrafts(label) {
            const strUrl = `${window.location.origin}${location.pathname}#/order-manage/order-detail?orderNo=${this.orderNo}`;
            const params = {
                appCode: this.appCode,
                loginName: this.user.userCode,
                tenantCode: this.currentTenant.tenantCode,
                fdTemplateCode: 'otp_inventory_account_adjustment',
                method: 'edit',
                formParam: {
                    subject: this.orderNo + '_' + this.moduleName + '_' + this.user.userName,
                    formInstanceId: this.orderNo,
                    fdUrl: strUrl,
                    formData: { 'input': label }
                }
            };
            mipIflowCreateDraft(params).then(res => {
                if (res) {
                    this.extFrameUrl = res.data.extFrameUrl;
                    this.mipFdId = res.data.fdId;
                    this.mipFdStatus = res.data.fdStatus;
                }
            });
        },
        async getMipForm() {
            this.fileList = [];
            const res = await getMipForm({ orderNo: this.orderNo });
            if (res) {
                const data = res.data;
                this.formData.content = data.content;
                this.formData.title = data.title;
                this.formData.input = data.input;
                if (data.files && data.files.length > 0) {
                    data.files.forEach(item => {
                        this.fileList.push(
                            {
                                name: item.fileName,
                                url: item.filePath,
                                id: item.id
                            }
                        );
                    });
                }
                this.mipIflowCreateDrafts(data.input);
            }
        },
        getCertification () {
            clearTimeout(this.timeNum);
            getCertBySDK({ appid: configs.uploadAppId }, (c) => { this.cancelRequest = c; }).then(res => {
                if (res) {
                    this.certification = res.data.certification;
                    this.timeNum = setTimeout(() => {
                        this.getCertification();
                    }, 1000 * 60 * 25);
                }
            }).catch(() => {
            });
        },
        getFileExt (fileName) {
            return fileName && fileName.replace(/^.*\./, '').toLowerCase();
        },
        downLoads(url) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.height = 0;
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() => {
                iframe.remove();
            }, 2 * 60 * 1000);
        },
        AllFilesDownLoad() {
            for (let i = 0; i < this.fileList.length; i++) {
                this.downLoads(this.fileList[i].url + '?certification=' + this.certification);
            }
        },
        fileDownLoad(file) {
            window.location = file.url + '?certification=' + this.certification;
        },
        filePriview(file) {
            filePreview(file);
        }
    },
    mounted() {
        this.getCertification();
        this.getMipForm();
        window.addEventListener('message', this.messageFunc, false);
    },
    destroyed() {
        window.removeEventListener('message', this.messageFunc, false);
    },
    computed: {
        ...mapState(
            {
                user: state => state.user,
                currentTenant: state => state.currentTenant
            }
        )
    }
};
</script>
<style lang="less">
.mip-order-center {
    width: 100%;
    .dialog-footer {
        text-align: right;
        margin-right: 15px;
    }
}
.mip-iflow-cont {
    .el-form-item {
        margin-bottom: 0px;
    }
    .file-size {
        margin: 0 20px;
    }
}
.mip-upload {
    margin-top: -40px;
    .el-upload-list__item {
        .el-icon-close,.el-icon-close-tip {
            display: none;
        }
    }
}
</style>