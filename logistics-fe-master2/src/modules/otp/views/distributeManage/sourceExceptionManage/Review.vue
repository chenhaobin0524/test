<template>
    <div class="source-exception-review">
        <el-dialog
            class="source-exception-review-dialog"
            title="审核"
            :close-on-click-modal="false"
            width="32%"
            :visible.sync="visiableDialog"
            :before-close="handleClose">
            <el-form
                ref="formDialog"
                :model="formData"
                :rules="rules"
                label-width="100px"
                :inline="false">
                <el-form-item label="异常类型：">
                    <span>{{formData.distributionOrCliamName}}</span>
                </el-form-item>
                <el-form-item label="审核单号：">
                    <span class="line-height">{{formData.reviewNos}}</span>
                </el-form-item>
                <el-form-item label="一级异常类型：" v-if="+checkLists[0].distributionOrCliam === 10 && checkLists.length === 1">
                    <span>{{formData.tmsExceptionTypeName1}}</span>
                </el-form-item>
                <el-form-item label="二级异常类型：" v-if="+checkLists[0].distributionOrCliam === 10 && checkLists.length === 1">
                    <span>{{formData.tmsExceptionTypeName2}}</span>
                </el-form-item>
                <el-form-item label="异常原因：" v-if="+checkLists[0].distributionOrCliam === 10">
                    <el-input type="text" clearable maxlength="200" show-word-limit
                        v-model.trim="formData.reason" size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item label="改善措施：" v-if="+checkLists[0].distributionOrCliam === 10">
                    <el-input type="text" clearable maxlength="200" show-word-limit
                        v-model.trim="formData.measure" size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item label="处理结果：" v-if="+checkLists[0].distributionOrCliam === 10">
                    <el-input type="text" clearable
                        v-model.trim="formData.processResult" size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item label="责任承运商：" prop="carrier" v-if="+checkLists[0].distributionOrCliam === 10">
                    <el-input type="text" clearable
                        v-model.trim="formData.carrier" size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item label="承运商：" v-if="+checkLists[0].distributionOrCliam === 20">
                    <span>{{formData.carrierName}}</span>
                </el-form-item>
                <el-form-item label="司机：" v-if="+checkLists[0].distributionOrCliam === 20">
                    <span>{{formData.primaryDriver}}</span>
                </el-form-item>
                <el-form-item label="索赔类型：" v-if="+checkLists[0].distributionOrCliam === 20">
                    <span>{{formData.claimTypeName}}</span>
                </el-form-item>
                <el-form-item label="索赔原因：" v-if="+checkLists[0].distributionOrCliam === 20">
                    <span>{{formData.reasonForClaim}}</span>
                </el-form-item>
                <el-form-item label="索赔金额：" v-if="+checkLists[0].distributionOrCliam === 20">
                    <span>{{formData.claimAmount}}</span>
                </el-form-item>
                <!-- <el-form-item label="索赔凭证：" v-if="+checkLists[0].distributionOrCliam === 20">
                    <upload  @callback='uploadResponse' :showFileList="true"
                        listType="text" :fileList="fileList">
                        <el-button slot='batch' size="small" type="primary">点击上传</el-button>
                    </upload>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="dialog-btn" @click="handleClose" v-if="+checkLists[0].distributionOrCliam === 10">取 消</el-button>
                <el-button class="dialog-cel" type="primary" @click="saveOk" v-if="+checkLists[0].distributionOrCliam === 10" :loading="saveLoading">保 存</el-button>
                <el-button class="dialog-btn" type="primary" @click="handleAgree" v-if="+checkLists[0].distributionOrCliam === 20" :loading="agreeLoading">同 意</el-button>
                <el-button class="dialog-cel" type="primary" @click="handleTurnDown" v-if="+checkLists[0].distributionOrCliam === 20" :loading="turnDownLoading">驳 回</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { examine, cliamExamine } from '../../../api/sourceExceptionManage';
import { mapState } from 'vuex';
export default {
    props: {
        visiableDialog: {
            type: Boolean,
            default: false
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        data: {
            type: Object,
            default() {
                return {};
            }
        },
        checkLists: {
            type: Array,
            default() {
                return [];
            }
        },
        certification: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            formData: {
                distributionOrCliamName: '',
                reviewNos: '',
                cvteExceptionTypeName1: '',
                cvteExceptionTypeName2: '',
                status: '',
                processResult: '',
                carrier: '',
                carrierName: '',
                primaryDriver: '',
                claimType: '',
                reasonForClaim: '',
                claimAmount: '',
                reason: '',
                measure: ''
            },
            rules: {
                carrier: [
                    { required: true, message: '请输入责任承运商', trigger: 'blur' }
                ]
            },
            dataList: this.checkLists,
            fileUrls: [],
            fileList: [],
            saveLoading: false,
            agreeLoading: false,
            turnDownLoading: false
        };
    },
    methods: {
        handleClose() {
            this.$emit('handleClose', '');
        },
        saveOk() {
            this.$refs.formDialog.validate((valid) => {
                if (valid) {
                    const abnormalSingleNumbers = this.checkLists.map(el => el.abnormalSingleNumber);
                    const params = {
                        abnormalSingleNumbers: abnormalSingleNumbers,
                        processResult: this.formData.processResult,
                        reason: this.formData.reason,
                        measure: this.formData.measure,
                        handler: this.user.userName,
                        carrier: this.formData.carrier
                    };
                    this.saveLoading = true;
                    examine(params).then(res => {
                        this.saveLoading = false;
                        if (res && res.code === '0') {
                            this.$message.success('审核成功');
                            this.$emit('saveOk');
                        }
                    }).catch(() => {
                        this.saveLoading = false;
                    });
                }
            });
        },
        uploadResponse(response) {
            this.fileUrls = response.map(item => item.data.downUrl);
        },
        handleAgree() {
            const abnormalSingleNumbers = this.checkLists[0].abnormalSingleNumber;
            const params = {
                abnormalSingleNumber: abnormalSingleNumbers,
                status: '10',
                handler: this.user.userName
            };
            this.agreeLoading = true;
            cliamExamine(params).then(res => {
                this.agreeLoading = false;
                if (res && res.code === '0') {
                    this.$message.success('已同意');
                    this.$emit('saveOk');
                }
            }).catch(() => {
                this.agreeLoading = false;
            });
        },
        handleTurnDown() {
            const abnormalSingleNumbers = this.checkLists[0].abnormalSingleNumber;
            const params = {
                abnormalSingleNumber: abnormalSingleNumbers,
                status: '20',
                handler: this.user.userName
            };
            this.turnDownLoading = true;
            cliamExamine(params).then(res => {
                this.turnDownLoading = false;
                if (res && res.code === '0') {
                    this.$message.success('已驳回');
                    this.$emit('saveOk');
                }
            }).catch(() => {
                this.turnDownLoading = false;
            });
        }
    },
    mounted() {
        // this.fileList = [];
        this.formData.distributionOrCliamName = +this.checkLists[0].distributionOrCliam === 10 ? '配送' : '索赔';
        this.formData.tmsExceptionTypeName1 = this.checkLists[0].tmsExceptionTypeName1;
        this.formData.tmsExceptionTypeName2 = this.checkLists[0].tmsExceptionTypeName2;
        this.formData.claimTypeName = this.checkLists[0].claimTypeName;
        this.formData.carrier = this.checkLists[0].carrier;
        this.formData.primaryDriver = this.checkLists[0].primaryDriver;
        this.formData.reasonForClaim = this.checkLists[0].reasonForClaim;
        this.formData.claimAmount = this.checkLists[0].claimAmount;
        const taskNos = [];
        this.checkLists.map(el => {
            if (el.taskNo) taskNos.push(el.taskNo);
        });
        this.formData.reviewNos = (taskNos && taskNos.length > 0) ? taskNos.join(',') : '';
        // this.checkLists[0].files.map(item => {
        //     this.fileList.push({
        //         name: item.fileName,
        //         url: item.filePath,
        //         certification: this.certification
        //     });
        // });
    },
    computed: {
        ...mapState({ user: state => state.user })
    }
};
</script>

<style lang="less">
    .source-exception-review {
        .line-height {
            display: inline-block;
            line-height: 24px;
        }
        .source-exception-review-dialog {
            .el-form-item {
                margin-bottom: 10px;
            }
        }
    }
</style>
