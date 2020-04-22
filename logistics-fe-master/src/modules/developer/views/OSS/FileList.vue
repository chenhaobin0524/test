<template>
    <paper>
        <m-pane ref="tablePage" :config="config"
                :totalData="totalData"
                :pageTotal="pageTotal"
                :searchTotalTitle="searchTotalTitle"
                :loading="loading"
                searchId="test"
                pageID="test"
                @searchChange="searchChange"
                @check-btn="btnView"
                @pageChange="pageChange"
                @sizeChange="sizeChange">
            <div slot="table-module-btn">
                <upload-sdk-button
                        :bucket="bucket"
                        :text="'上传'"
                        @callback="getFileList" />
                <!-- <el-upload
                    class="upload-demo"
                    action="upload"
                    :headers="{'Certification': certification, 'Content-Length': contentLength}"
                    :before-upload="getUploadInfo"
                    :http-request="submitUpload"
                    >
                    <el-button size="small" type="primary">上传</el-button>
                </el-upload> -->
            </div>
            <div slot="page-module-btn"></div>
        </m-pane>
    </paper>
</template>
<script>
import mPane from '@/components/awesome/page/mPanel3';
import config from './FileList.json';
import paper from '@/components/core/paper/Paper';
import uploadSdkButton from '@/components/lots/OSS/UploadSDKBtn';
import { getCert, getUserFileList } from '../../api/oss';
import md5 from 'js-md5';
import vueConfig from '@/config/user.env';
// const BYTES_PER_CHUNK = 4 * 512 * 1024; // 每个文件切片大小定为4MB
export default {
    components: { mPane, paper, uploadSdkButton },
    data() {
        return {
            config: config,
            loading: false,
            totalData: [],
            pageTotal: 0,
            searchQuery: {
                pageSize: config.page.pageSize,
                pageNo: config.page.pageNo
            },
            searchTotalTitle: [{
                name: '订单号',
                value: 'orderNum',
                type: 'input'
            }],
            bucket: 'lc_sit',
            certification: '',
            uploadName: '',
            appid: vueConfig.uploadAppId,
            appkey: vueConfig.uploadAppKey,
            contentLength: 0
        };
    },
    methods: {
        btnView(data) {
            const ts = (new Date()).getTime().toString();
            getCert({
                appid: this.appid,
                ts,
                signature: md5(this.appid + ts + this.appkey),
                Int: 18000
            }).then(res => {
                this.certification = res.data.certification;
                window.location.href = `/oss-download/userDownload/${this.appid}/${data.ossBucket}/${data.ossObject}?certification=${this.certification}`;
            });
        },
        pageChange(num) {
            // 分页器页数变化
            this.searchQuery.pageNo = num;
            this.getFileList();
        },
        sizeChange(size) {
            this.searchQuery.pageSize = size;
            this.getFileList();
        },
        getFileList() {
            getUserFileList(this.searchQuery).then(res => {
                if (res.code === '0' && res.data && res.data.list) {
                    this.totalData = res.data.list;
                    this.pageTotal = res.data.totalCount;
                }
            });
        },
        searchChange(data) {
            Object.assign(this.searchQuery, data);
            this.getFileList();
        },
        getUploadInfo(file) { // 修改
            this.uploadName = file.name;
            this.contentLength = file.size;
        }
        // submitUpload(uploadData) {
        //     if (uploadData.file.size > BYTES_PER_CHUNK) {
        //         // this.getFileList();
        //         this.multipleUpload(uploadData);
        //     } else {
        //         // this.getFileList();
        //         this.simpleUpload(uploadData);
        //     }
        // },
        // multipleUpload(uploadData) {
        //     let ts = (new Date()).getTime().toString();
        //     getCert({
        //         appid: this.appid,
        //         ts,
        //         signature: md5(this.appid + ts + this.appkey),
        //         Int: 18000
        //     }).then(res => {
        //         this.certification = res.data.certification;
        //         getUploadId({
        //             appid: this.appid,
        //             bucket: this.bucket,
        //             object: this.uploadName,
        //             certification: this.certification
        //         }).then(uploadRes => {
        //             this.createSlices(uploadData, uploadRes.data.uploadid);
        //         });
        //     });
        // },
        // simpleUpload(uploadData) {
        //     let ts = (new Date()).getTime().toString();
        //     getCert({
        //         appid: this.appid,
        //         ts,
        //         signature: md5(this.appid + ts + this.appkey),
        //         Int: 18000
        //     }).then(res => {
        //         this.certification = res.data.certification;
        //         upload(uploadData.file, {
        //             appid: this.appid,
        //             bucket: this.bucket,
        //             object: this.uploadName,
        //             certification: this.certification,
        //             contentLength: this.contentLength,
        //             callback: null
        //         }).then(() => {
        //             saveUserUpload({
        //                 localFileName: this.uploadName,
        //                 ossUrl: '',
        //                 ossBucket: this.bucket,
        //                 ossObject: this.uploadName,
        //                 fileSize: this.contentLength,
        //                 appId: this.appid,
        //                 tenantCode: ''
        //             }).then(() => {
        //                 this.$emit('callback');
        //             });
        //         });
        //     });
        // }
    },
    mounted() {
        this.getFileList();
    }
};
</script>
