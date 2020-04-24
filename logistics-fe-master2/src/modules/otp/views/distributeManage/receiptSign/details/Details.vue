<template>
    <el-dialog
        title="详情"
        :visible.sync="detailsShow"
        width="76%"
        class="sign-detail"
        :before-close="handleClose">
        <div slot="title">
            <div class="header-title">
                <span @click="handleChangeView('sign')" :class="currentView === 'sign' ? 'activeClass' : ''">{{titleName}}</span>
                <span  v-if="rowData.distributionLastFlag === 'Y' && rowData.deliveryType === 'NET' && rowData.orderType === 'PO'"
                 @click="handleChangeView('delivery')" :class="currentView === 'delivery' ? 'activeClass' : ''">网点配送详情</span>
            </div>
        </div>
        <div>
            <delivery-details v-show="currentView === 'delivery'" :rowData="rowData" :certification="certification"
                @handleClose="handleClose" @detailsClose="detailsClose" @refreshList="refreshList"></delivery-details>
            <sign-in-details v-show="currentView === 'sign'" :rowData="rowData" :certification="certification"
                :searchObj="searchObj" @handleClose="handleClose" @refreshList="refreshList"></sign-in-details>
        </div>
        <span slot="footer">
            <slot name="footer-btn"></slot>
        </span>
    </el-dialog>
</template>
<script>
import DeliveryDetails from './DeliveryDetails';
import SignInDetails from './SignInDetails';
export default {
    components: { DeliveryDetails, SignInDetails },
    props: {
        detailsShow: {
            type: Boolean,
            default: false
        },
        certification: {
            type: String,
            default: ''
        },
        searchObj: {
            type: Object,
            default() {
                return {};
            }
        },
        rowData: {
            type: Object,
            default() {
                return {};
            }
        },
        titleName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            currentView: 'sign'
        };
    },
    methods: {
        handleClose() {
            this.$emit('detailsClose');
        },
        detailsClose() {
            this.$emit('detailsClose');
        },
        handleChangeView(component) {
            this.currentView = component;
        },
        refreshList(searchObj) {
            this.$emit('refreshList', searchObj);
        }
    }
};
</script>
<style lang="less">
    .sign-detail {
        top: -50px;
        .el-dialog__header {
            border-bottom: 1px solid #e6e6e6;
            padding-bottom: 0;
        }
        .el-dialog__footer {
            padding: 0;
        }
        .el-dialog__body {
            .footer-btn {
                margin-top: 15px;
                text-align: right;
            }
        }
        .header-title {
            margin-bottom: 10px;
            span {
                cursor: pointer;
                padding-bottom: 10px;
            }
            span:nth-child(2) {
                margin: 0 15px;
            }
        }
        .form-info {
            .el-row {
                margin: 0 0 15px 0;
            }
        }
        .activeClass {
            color: #00bcbf;
            border-bottom: 2px solid #00bcbf;
        }
    }
</style>