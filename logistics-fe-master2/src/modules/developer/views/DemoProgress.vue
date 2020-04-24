<template>
    <Paper class='demo-progress'>
        <el-card class='box-card'>
            <div slot='header' class='clearfix'>
                <h1>demo</h1>
            </div>
            <el-button id='download' :disabled='download'>下载</el-button>
            <el-progress
                :percentage='progressPer'
                :text-inside='true'
                :stroke-width='18'
                status='success'
            ></el-progress>
        </el-card>
        <el-card class='box-card'>
            <div slot='header' class='clearfix'>
                <h1>code</h1>
            </div>
            <pre>
                &lt;el-button id='download' :disabled='download'&gt;下载&lt;/el-button&gt;
                &lt;el-progress
                    :percentage='progressPer'
                    :text-inside='true'
                    :stroke-width='18'
                    status='success'
                &gt;&lt;/el-progress&gt;
                &lt;script&gt;
                export default {
                    data() {
                        return {
                            progressPer: 0,
                            download: false
                        };
                    },
                    mounted() {
                        const that = this;
                        document.querySelector('#download').onclick = function() {
                            that.fetchProgress();
                        };
                    },
                    methods: {
                        fetchProgress() {
                            const that = this;
                            var url =
                                'http://lgsit.midea.com:8080/upload/wechat_web_devtools_0.7.0_x64.exe';
                            that.download = true;
                            var req = new XMLHttpRequest();
                            req.responseType = 'blob';
                            req.open('get', url, true);
                            req.addEventListener(
                                'progress',
                                function(evt) {
                                    if (evt.lengthComputable) {
                                        var percentComplete = evt.loaded / evt.total;
                                        that.progressPer = Math.ceil(percentComplete * 100);
                                    }
                                },
                                false
                            );
                            req.onreadystatechange = function() {
                                if (req.readyState === 4 && req.status === 200) {
                                    var filename = 'filename.exe';
                                    if (typeof window.chrome !== 'undefined') {
                                        // Chrome version
                                        var link = document.createElement('a');
                                        link.href = window.URL.createObjectURL(req.response);
                                        link.download = filename;
                                        link.click();
                                    } else if (
                                        typeof window.navigator.msSaveBlob !== 'undefined'
                                    ) {
                                        // IE version
                                        var blob = new Blob([req.response], {
                                            type: 'application/force-download'
                                        });
                                        window.navigator.msSaveBlob(blob, filename);
                                    } else {
                                        // Firefox version
                                        var file = new File([req.response], filename, {
                                            type: 'application/force-download'
                                        });
                                        window.open(URL.createObjectURL(file));
                                    }
                                    that.download = false;
                                }
                            };
                            req.send();
                        }
                    }
                };
                &lt;/script&gt;
            </pre>
        </el-card>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
export default {
    data() {
        return {
            progressPer: 0,
            download: false
        };
    },
    mounted() {
        const that = this;
        document.querySelector('#download').onclick = function() {
            that.fetchProgress();
        };
    },
    methods: {
        fetchProgress() {
            const that = this;
            var url =
                'http://lgsit.midea.com:8080/upload/wechat_web_devtools_0.7.0_x64.exe';
            that.download = true;
            var req = new XMLHttpRequest();
            req.responseType = 'blob';
            req.open('get', url, true);
            req.addEventListener(
                'progress',
                function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        that.progressPer = Math.ceil(percentComplete * 100);
                    }
                },
                false
            );
            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    var filename = 'filename.exe';
                    if (typeof window.chrome !== 'undefined') {
                        // Chrome version
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(req.response);
                        link.download = filename;
                        link.click();
                    } else if (
                        typeof window.navigator.msSaveBlob !== 'undefined'
                    ) {
                        // IE version
                        var blob = new Blob([req.response], {
                            type: 'application/force-download'
                        });
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        // Firefox version
                        var file = new File([req.response], filename, {
                            type: 'application/force-download'
                        });
                        window.open(URL.createObjectURL(file));
                    }
                    that.download = false;
                }
            };
            req.send();
        }
    },
    components: { Paper }
};
</script>
<style lang='less'>
.demo-progress {
    overflow: auto;
    .el-progress {
        display: inline-block;
        width: 200px;
    }
    .el-upload__input {
        display: none;
    }
    h1{
        font-size: 1.5em
    }
}
</style>