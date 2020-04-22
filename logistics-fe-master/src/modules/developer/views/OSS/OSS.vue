<template>
    <Paper>
        <el-table v-show="!detailFlag" :data="bucketList">
            <el-table-column
                prop="bucket"
                label="Bucket">
            </el-table-column>
            <el-table-column
                prop="regionid"
                label="Region"
                width="180">
            </el-table-column>
            <el-table-column
                prop="acl"
                label="ACL">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="{ row }">
                    <el-button @click="showDetail(row)">查看文件</el-button>
                </template>
            </el-table-column>
        </el-table>
        <section v-show="detailFlag">
            <el-button @click="detailFlag = false">返回</el-button>
            <el-button type="primary" @click="openUploadDialog">新增</el-button>
            <el-button type="primary" @click="openMultiUploadDialog">大文件上传</el-button>
            <el-table :data="fileList">
                <el-table-column
                    prop="name"
                    label="名字"></el-table-column>
                <el-table-column
                    prop="size"
                    label="大小"
                    width="180"
                ></el-table-column>
                <el-table-column
                    prop="createtime"
                    label="创建时间"
                    width="180"
                ></el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="{ row }">
                        <el-button @click="download(row)">下载文件</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <el-dialog title="上传" :visible.sync="uploadVisible">
            <el-upload
                class="upload-demo"
                action="upload"
                :headers="{'Certification': certification, 'Content-Length': contentLength}"
                :file-list="uploadList"
                :before-upload="getUploadInfo"
                :http-request="submitUpload"
                :on-change="fileChange"
                >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="uploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="大文件上传" :visible.sync="multiUploadVisible">
            <el-upload
                class="upload-demo"
                action="upload"
                :headers="{'Certification': certification, 'Content-Length': contentLength}"
                :file-list="uploadList"
                :before-upload="getUploadInfo"
                :http-request="initMultiUpload"
                :on-change="fileChange"
                >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="multiUploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="multiUploadVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </Paper>
</template>
<style lang='less'>
</style>
<script>
import Paper from '@/components/core/paper/Paper';
import { getLists, getFiles, getCert, upload, getUploadId, multiUpload, getMultiUploadList, completeMultiUpload } from '../../api/oss';
import md5 from 'js-md5';
import vueConfig from '@/config/user.env';
const BYTES_PER_CHUNK = 4 * 1024 * 1024; // 每个文件切片大小定为4MB .
export default {
    components: { Paper },
    data() {
        return {
            detailFlag: false,
            uploadVisible: false,
            multiUploadVisible: false,
            bucketList: [],
            activeBucket: {},
            fileList: [],
            uploadList: [],
            appid: vueConfig.uploadAppId,
            appkey: vueConfig.uploadAppKey,
            certification: '',
            actionUrl: '/oss/v1/oss/object/upload/',
            uploadName: '',
            contentLength: 0
        };
    },
    methods: {
        load() {
            const ts = (new Date()).getTime().toString();
            getLists({
                appid: this.appid,
                ts,
                signature: md5(this.appid + ts + this.appkey)
            }).then(res => {
                this.bucketList = res.data.buckets;
            });
        },
        showDetail(item) {
            this.detailFlag = true;
            this.activeBucket = item;
            const ts = (new Date()).getTime().toString();
            getCert({
                appid: this.appid,
                ts,
                signature: md5(this.appid + ts + this.appkey),
                Int: 18000
            }).then(res => {
                this.certification = res.data.certification;
                getFiles({
                    appid: this.appid,
                    bucket: this.activeBucket.bucket,
                    pageindex: '1',
                    pagesize: '10',
                    certification: this.certification
                }).then(fileRes => {
                    this.fileList = fileRes.data.objects;
                });
            });
        },
        download(item) {
            window.location.href = `/oss-download/userDownload/${this.appid}/${this.activeBucket.bucket}/${item.name}?certification=${this.certification}`;
        },
        openUploadDialog() {
            this.uploadVisible = true;
        },
        openMultiUploadDialog() {
            this.multiUploadVisible = true;
        },
        getUploadInfo(file) {
            this.uploadName = file.name;
            this.contentLength = file.size;
        },
        initMultiUpload(uploadData) {
            const ts = (new Date()).getTime().toString();
            getCert({
                appid: this.appid,
                ts,
                signature: md5(this.appid + ts + this.appkey),
                Int: 18000
            }).then(res => {
                this.certification = res.data.certification;
                getUploadId({
                    appid: this.appid,
                    bucket: this.activeBucket.bucket,
                    object: this.uploadName,
                    certification: this.certification
                }).then(uploadRes => {
                    this.createSlices(uploadData, uploadRes.data.uploadid);
                });
            });
        },
        async getEtag(chunk) {
            const a = await this.getFileMd5(chunk);
            return a;
        },
        getFileMd5(chunk) {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(chunk);
            return new Promise(function(resolve) {
                fileReader.onload = function (e) {
                    resolve(md5(e.target.result));
                };
            });
        },
        async createSlices(uploadData, id) {
            const blob = uploadData.file;
            let start = 0;
            let end;
            let index = 0;
            const prm = [];
            const parts = [];
            while (start < blob.size) {
                end = start + BYTES_PER_CHUNK;
                if (end > blob.size) {
                    end = blob.size;
                }
                const chunk = blob.slice(start, end);
                const etag = await this.getEtag(chunk);
                parts.push({
                    partid: (index + 1) + '',
                    size: end - start,
                    etag: '\"' + etag + '\"'
                });
                prm.push(multiUpload(chunk, {
                    appid: this.appid,
                    bucket: this.activeBucket.bucket,
                    object: this.uploadName,
                    certification: this.certification,
                    index: index + 1,
                    uploadid: id,
                    size: end - start
                }));
                start = end;
                index++;
            }
            Promise.all(prm).then(() => {
                getMultiUploadList({
                    appid: this.appid,
                    bucket: this.activeBucket.bucket,
                    object: this.uploadName,
                    certification: this.certification,
                    uploadid: id
                });
                completeMultiUpload({
                    appid: this.appid,
                    bucket: this.activeBucket.bucket,
                    object: this.uploadName,
                    certification: this.certification,
                    uploadid: id,
                    parts: parts
                });
            });
        },
        submitUpload(uploadData) {
            const ts = (new Date()).getTime().toString();
            getCert({
                appid: this.appid,
                ts,
                signature: md5(this.appid + ts + this.appkey),
                Int: 18000
            }).then(res => {
                this.certification = res.data.certification;
                upload(uploadData.file, {
                    appid: this.appid,
                    bucket: this.activeBucket.bucket,
                    object: this.uploadName,
                    certification: this.certification,
                    contentLength: this.contentLength
                });
            });
        },
        fileChange() {

        }
    },
    mounted() {
        this.load();
    }
};

</script>
