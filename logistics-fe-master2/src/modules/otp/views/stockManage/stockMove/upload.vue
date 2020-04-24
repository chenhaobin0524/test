<template>
    <el-dialog
        id="fileImport"
        title="导入"
        :visible="true"
        width="60%"
        :before-close='closeDialog'
        :closeOnClickModal='false'>
        <el-upload
            :with-credentials='true'
            ref='upload'
            action='upload'
            :headers="{'Certification': certification}"
            :http-request="submitUpload"
            :multiple='false'
            :limit='1'
            :on-exceed='onExceed'
            :on-error='onError'
            :before-upload="beforeUpload"
            :file-list="fileList"
            :show-file-list='true'
            :auto-upload="false">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">上传要求：只能上传Excel文件，且不超过500KB</span>
        </el-upload>

        <el-collapse>
            <el-collapse-item title="模板">
                <div class="template_flex" v-for="(item,index) in ImportContent" :key="index">
                    <div class="template_left">
                        <img src="@/assets/template.png"/>
                        <div class="template">
                            <div>{{item.fileName}}</div>
                            <div>{{item.fileSize}}</div>
                        </div>
                    </div>
                    <div class="template_float">
                        <el-tooltip class="item" effect="dark" content="下载" placement="bottom" v-has='"05140001"'>
                            <el-button type='text' icon="el-icon-download" @click='handleDownload(item)'></el-button>
                        </el-tooltip>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getCertBySDK, upload, saveUserUpload } from '../../../api/stockMove';
import request from '@/utils/http';
// import { getModifyTime } from '../../../api/stockMove';
import { mapState } from 'vuex';
import config from '@/config/user.env';

export default {
    props: {
        text: String,
        uploadShow: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data() {
        return {
            action: `${config.apiUrl}/api-otp/area/excelImport`,
            modelType: 0,
            fileList: [],
            ImportContent: [], // 模板相关信息
            uploadInput: {}, // 一个上不了页面的input标签
            certification: '',
            contentLength: 0,
            uploadName: '',
            bucket: 'lcloud',
            appid: config.uploadAppId,
            appkey: '0uvCj75cHhLqLf3v4oJf0mjpdVH4extvQDVRm7QF'
        };
    },
    methods: {
        onSuccess(res) {
            if (res.code === '0') {
                this.$message.success('上传成功');
                this.closeDialog();
                this.$emit('load');
            } else {
                this.$refs.upload.clearFiles();
                this.$message.error(res.msg);
            }
        },
        onError() {
            this.$message.error('上传失败');
        },
        beforeUpload(file) {
            var fileNameArr = file.name.split('.');
            var fileType = fileNameArr[fileNameArr.length - 1];
            const index = file.name.lastIndexOf('.');
            const originName = file.name.substring(0, index);
            const originNameType = file.name.substring(index, file.length);
            this.uploadName = originName + '_' + new Date().getTime() + originNameType;
            this.contentLength = file.size;

            const Excel = fileType === 'xls' || fileType === 'xlsx';
            const isLt500KB = file.size / 1024 <= 500;

            if (!Excel) {
                this.$message.error('上传失败，文件格式只能为 xlsx 或 xls');
            } else if (!isLt500KB) {
                this.$message.error('上传文件大小不能超过 500KB');
            }
            return Excel && isLt500KB;
        },
        onExceed() {
            this.$message.error('一次只能上传一个文件');
        },
        closeDialog() {
            this.$emit('update:uploadShow', false);
        },

        confirm(uploadData) {
            if (this.$refs.upload.uploadFiles.length === 0) {
                this.$message.error('请先上传文件');
                return false;
            }
            this.$refs.upload.submit();
        },
        // 创建导入功能使用的Input标签并添加监听
        createInput() {
            // 创建input标签并添加监听
            this.uploadInput = document.createElement('input');
            this.uploadInput.type = 'file';
            this.uploadInput.addEventListener('change', (event) => {
                const fileExt = event.path[0].files[0].name.replace(/^.*\./, '').toLowerCase();
                const extArr = ['xls', 'xlsx'];
                if (!extArr.includes(fileExt)) {
                    this.$message({
                        type: 'error',
                        message: '上传失败，文件格式只能为 xlsx 或 xls'
                    });
                    event.path[0].value = null;
                    return false;
                }

                var file = event.path[0].files[0];
                var formData = new FormData();
                formData.append('file', file);
                const bucket = 'lc_sit';
                request({
                    url: `/api-file/mdmFileStorage/upload/${bucket}`,
                    method: 'post',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData
                }).then(res => {
                    if (res) {
                        const params = {
                            filePath: res.data.downUrl,
                            createUserCode: this.user.userCode,
                            createUserName: this.user.userName,
                            fileSize: file.size + '',
                            modelType: this.modelType
                        };
                        request({
                            url: '/api-otp/area/saveFileInformation',
                            method: 'post',
                            data: params
                        }).then(res => {
                            if (res) {
                                this.$message.success('上传成功');
                                this.getModel();
                            }
                        }).catch(() => {
                        });
                    }
                }).catch(() => {
                });
                event.path[0].value = null;
            });
        },
        submitUpload(uploadData) {
            this.simpleUpload(uploadData);
        },
        async simpleUpload(uploadData) {
            if (!this.certification) {
                this.certification = await this.getCertification();
            }
            const file = new File([uploadData.file], this.uploadName, {
                type: uploadData.file.type
            });
            upload(file, {
                appid: this.appid,
                bucket: this.bucket,
                object: this.uploadName,
                certification: this.certification,
                callback: null
            }).then(() => {
                saveUserUpload({
                    fileName: this.uploadName,
                    fileUrl: this.uploadName
                    // ossBucket: this.bucket,
                    // ossObject: this.uploadName,
                    // localFileName: this.uploadName,
                    // fileSize: this.contentLength + ''
                }).then((res) => {
                    this.onSuccess(res);
                    // this.$emit('callback');
                });
            });
        },
        async getCertification() {
            const res = await getCertBySDK({ appid: this.appid });
            if (res.data && res.data.certification) {
                return res.data.certification;
            }
        },
        // 上传模板
        // handleUpload(index) {
        //     this.modelType = index ? 0 : 1;
        //     this.uploadInput.click();
        // },
        // 下载模板
        handleDownload(item) {
            window.location = item.filePath;
        },
        // 获取模板信息
        getModel() {
            let apiUrl = '';
            if (window.location.origin !== 'http://localhost.midea.com:8082') {
                apiUrl = config.apiUrl;
            }
            var data = [{
                'fileName': 'inbound_order_template',
                'filePath': apiUrl + '/api-otp/ttx/downloadInboundOrderTemplate',
                'fileSize': '8KB'
            }];
            this.ImportContent = data;
        }
    },
    created() {
        // 获取模板信息
        this.getModel();
        // 创建导入功能使用的Input标签并添加监听
        this.createInput();
    },
    computed: {
        ...mapState({ user: state => state.user })
    }
};
</script>

<style lang="less">
  #fileImport {
    .upload-demo {
      margin-top: 20px;
    }
    .el-upload__tip {
      margin-left: 20px;
      color: #999999;
    }

    .el-upload-list {
      padding: 0 10px;
      max-height: 60px;
      overflow-y: auto;
      margin-top: 15px;
    }

    .el-collapse-item__header {
      font-size: 14px;
      background-color: #F2F2F2;
      padding-left: 10px;
      color: #A3A3A3;
      margin-top: 10px;
      height: 40px;
      line-height: 40px;

      .el-icon-document:before {
        content: "\E614";
      }
    }

    .el-collapse {
      border: none;
    }

    .el-collapse-item__content {
      padding-bottom: 10px;
      max-height: 140px;
      overflow-y: auto;
    }

    .el-dialog__body {
      padding: 10px 10px;
    }

    .template_flex {
      display: flex;
      position: relative;
      margin-top: 10px;
      padding: 10px;
      border-bottom: 1px solid #F2F2F2;
    }

    .template_left {
      display: flex;
    }

    .template_left img {
      width: 30px;
      height: 40px;
    }

    .template {
      margin-left: 15px;
      font-size: 12px;
    }

    .template_float {
      font-size: 14px;
      letter-spacing: 10px;
      color: #00BCBF;
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }

    .el-collapse-item__wrap {
      border-bottom: none;
    }
  }
</style>
