<template>
    <div>
        <el-dialog
            :title="title"
            id="orderCenter"
            style="margin-top: -12vh;"
            :visible.sync="dialogFormVisible"
            @close="closeAdd"
        >
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <table style="margin-bottom: 15px;">
                    <tr>
                        <td class="interval">
                            <span class="lable">订单号</span>
                            <div class="disabled">
                                <el-input
                                    placeholder="订单号"
                                    :disabled="true"
                                    v-model="ruleForm.orderNo"
                                ></el-input>
                            </div>
                        </td>
                        <td class="interval">
                            <span class="md-validate lable">
                                    <span>客户订单号</span>
                            </span>
                            <div class="disabled">
                                <el-input
                                    onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
                                    placeholder="必填"
                                    :disabled="title==='修改' || index ===1"
                                    v-model="ruleForm.customerOrderNo"
                                    οnkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
                                    maxlength="32"
                                    onKeypress="javascript:if(event.keyCode === 32) event.returnValue = false;"
                                ></el-input>
                            </div>
                        </td>
                        <td class="interval">
                            <span class="md-validate lable">
                                    <span>客户</span>
                            </span>
                            <div class="inline_block textAlign">
                                <otpAdvance
                                    @getAdvanceValue="getAdvanceValue"
                                    :mValue="ruleForm.customerName"
                                    :params="basicData.customerOrderNoCode"
                                ></otpAdvance>
                            </div>
                        </td>
                        <td class="interval">
                            <span class="md-validate lable">
                                    <span>平台</span>
                            </span>
                            <div class="inline_block textAlign">
                                <otpAdvance
                                    @getAdvanceValue="getAdvanceValue"
                                    :mValue="ruleForm.siteName"
                                    :params="basicData.serviceTypeCode"
                                ></otpAdvance>
                            </div>
                        </td>
                    </tr>
                    <tr>
                         <td class="interval">
                            <span class="lable">仓库</span>
                            <div class="inline_block textAlign">
                                <otpAdvance
                                    @getAdvanceValue="getAdvanceValue"
                                    :mValue="ruleForm.whName"
                                    :params="basicData.customerWhCode"
                                    :formData="formData"
                                ></otpAdvance>
                            </div>
                        </td>
                        <td class="interval">
                            <span class="lable">订单类型</span>
                            <div class="inline_block">
                                <otpSelect
                                    :optionNum="'ORDER_TYPE'"
                                    :filterable="true"
                                    :mValue="ruleForm.orderType"
                                    @getSelectValue="getSelectValue"
                                    :prop="'orderType'"
                                ></otpSelect>
                            </div>
                        </td>
                        <td class="interval">
                            <span class="lable">业务模式</span>
                            <div class="inline_block">
                                <otpSelect
                                    :optionNum="'BUSINESS_MODE'"
                                    @getSelectValue="getSelectBusinessModes"
                                    :mValue="ruleForm.businessMode"
                                    :prop="'businessMode'"
                                ></otpSelect>
                            </div>
                        </td>
                        <td class="interval">
                            <span class="lable">是否自提</span>
                            <div class="inline_block_two" style="text-align: center;">
                                <el-switch
                                    v-model="ruleForm.selfMention"
                                    class="demo"
                                    :active-value="'1'"
                                    :inactive-value="'0'"
                                    :disabled="orderTypeTo"
                                    @change="selfMentionChange"
                                    active-text="是"
                                    inactive-text="否"
                                ></el-switch>
                            </div>
                            <span class="lable">紧急程度</span>
                            <div class="inline_block_two" style="text-align: center;">
                                <el-switch
                                    v-model="ruleForm.emergenceFlag"
                                    class="demo"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="emergenceFlagChange"
                                    active-text="是"
                                    inactive-text="否"
                                ></el-switch>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="interval">
                            <span class="lable">要求发货时间</span>
                            <el-date-picker
                                v-model="ruleForm.expectOutTime"
                                type="datetime"
                                placeholder="发货时间"
                                default-time="23:59:59"
                            ></el-date-picker>
                        </td>
                        <td class="interval">
                            <span class="lable">要求到达时间</span>
                            <el-date-picker
                                v-model="ruleForm.expectArriveStartTime"
                                type="datetime"
                                placeholder="要求到达时间"
                                default-time="23:59:59"
                            ></el-date-picker>
                        </td>
                        <td class="interval">
                            <span class="lable">原单号</span>
                            <input
                                type="text"
                                class="input"
                                placeholder="原单号"
                                v-model="ruleForm.originOrderNo"
                            />
                        </td>
                        <td class="interval">
                            <span class="lable">配送方式</span>
                            <div class="inline_block">
                                <otpSelect
                                    :optionNum="deliveryTypes"
                                    @getSelectValue="getSelectBusinessMode"
                                    :mValue="ruleForm.deliveryType"
                                    :disabled="ruleForm.selfMention === '1'"
                                    :prop="'deliveryType'"
                                ></otpSelect>
                            </div>
                        </td>
                    </tr>
                    <tr>
                         <td class="interval">
                            <span class="lable">货值</span>
                            <input
                                type="text"
                                class="input"
                                onkeyup="this.value=this.value.replace(/[^0-9\.]/g,'')"
                                v-model="ruleForm.orderValue"
                                placeholder="货值"
                                maxlength="18"
                            />
                        </td>
                        <td class="interval">
                            <span class="lable">上撤样</span>
                            <div class="inline_block">
                                <otpSelect
                                    :optionNum="'UPSTREAM_SPECIMEN_TYPE'"
                                    @getSelectValue="getSelectBusinessMode"
                                    :mValue="ruleForm.specimenType"
                                    :prop="'specimenType'"
                                ></otpSelect>
                            </div>
                        </td>
                        <td class="interval">
                            <span class="lable">是否商超</span>
                            <div class="inline_block">
                                <otpSelect
                                    :optionNum="'YES_OR_NO'"
                                    @getSelectValue="getSelectBusinessMode"
                                    :mValue="ruleForm.scPosFlag"
                                    :prop="'scPosFlag'"
                                ></otpSelect>
                            </div>
                        </td>
                        <td class="interval">
                            <span class="lable">是否零担</span>
                            <div class="inline_block">
                                <otpSelect
                                    :optionNum="'LOAD_TYPE'"
                                    @getSelectValue="getSelectBusinessMode"
                                    :mValue="ruleForm.loadType"
                                    :prop="'loadType'"
                                ></otpSelect>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="interval" colspan="3">
                            <span class="lable">备注</span>
                            <input
                                type="text"
                                placeholder="备注"
                                v-model="ruleForm.remark"
                                class="input textarea_row"
                            />
                        </td>
                        <td class="interval">
                            <span class="lable">计费标准</span>
                            <div class="inline_block">
                                <otpSelect
                                    :optionNum="'SYS_OTP_FREIGHT_BASIS'"
                                    @getSelectValue="getSelectBusinessMode"
                                    :mValue="ruleForm.freightBasis"
                                    :prop="'freightBasis'"
                                ></otpSelect>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="interval">
                            <span class="lable" :class="{'md-validate': showValidate}">
                                    <span>发货联系人</span>
                            </span>
                            <input
                                type="text"
                                class="input"
                                v-model="indexAddress.senderName"
                                :placeholder="placeholderDic.senderName"
                            />
                        </td>
                        <!-- <td class="interval">
                            <span class="lable">电话</span>
                            <input
                                type="text"
                                class="input"
                                v-model="indexAddress.senderTel"
                                placeholder="电话"
                                maxlength="12"
                            />
                        </td> -->
                        <td class="interval">
                             <span class="lable" :class="{'md-validate': showValidate}">
                                    <span>手机号</span>
                            </span>
                            <input
                                type="text"
                                class="input"
                                onkeyup="this.value=this.value.replace(/\D/g,'')"
                                onafterpaste="this.value=this.value.replace(/\D/g,'')"
                                v-model="indexAddress.senderMobile"
                                :placeholder="placeholderDic.senderMobile"
                            />
                        </td>
                        <td class="interval">
                             <span class="lable">
                                    <span>发货单位</span>
                            </span>
                            <input
                                type="text"
                                class="input"
                                v-model="ruleForm.upperSenderName"
                                :placeholder="placeholderDic.upperSenderName"
                            />
                        </td>
                        <td class="interval" v-if="notAnUser">
                            <span class="lable">来源平台</span>
                            <div class="inline_block">
                                <otpSelect
                                    :optionNum="'SOURCE_SYSTEM'"
                                    :filterable="true"
                                    :mValue="ruleForm.sourceSystem"
                                    @getSelectValue="getSelectValue"
                                    :prop="'sourceSystem'"
                                ></otpSelect>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="interval" colspan="7">
                            <span class="lable" :class="{'md-validate': showValidate}">
                                    <span>发货地址</span>
                            </span>
                            <div class="clearable">
                                <otpAllAddressSelect
                                    :minLayers="4"
                                    v-model="addressCode.shippingAddress"
                                    :placeholder="placeholderDic.shippingAddress"
                                ></otpAllAddressSelect>
                            </div>----
                            <div class="clearable_d">
                                <el-input
                                    type="text"
                                    :placeholder="placeholderDic.senderDetailAddr"
                                    v-model="indexAddress.senderDetailAddr"
                                ></el-input>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="interval">
                            <span class="lable" :class="{'md-validate': showValidate}">
                                    <span>收货联系人</span>
                            </span>
                            <input
                                type="text"
                                class="input"
                                v-model="indexAddress.receiverName"
                                :placeholder="placeholderDic.receiverName"
                            />
                        </td>
                        <!-- <td class="interval">
                            <span class="lable">电话</span>
                            <input
                                type="text"
                                class="input"
                                v-model="indexAddress.receiverTel"
                                placeholder="电话"
                                maxlength="12"
                            />
                        </td> -->
                        <td class="interval">
                            <span class="lable" :class="{'md-validate': showValidate}">
                                    <span>手机号</span>
                            </span>
                            <input
                                type="text"
                                class="input"
                                onkeyup="this.value=this.value.replace(/\D/g,'')"
                                onafterpaste="this.value=this.value.replace(/\D/g,'')"
                                v-model="indexAddress.receiverMobile"
                               :placeholder="placeholderDic.receiverMobile"
                            />
                        </td>
                        <td class="interval">
                             <span class="lable">
                                    <span>收货单位</span>
                            </span>
                            <input
                                type="text"
                                class="input"
                                v-model="ruleForm.upperReceiverName"
                                :placeholder="placeholderDic.upperReceiverName"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="interval" colspan="7">
                            <span class="lable" :class="{'md-validate': showValidate}">
                                    <span>收货地址</span>
                            </span>
                            <div class="clearable">
                                <otpAllAddressSelect
                                    :minLayers="4"
                                    v-model="addressCode.receivingAddress"
                                    :placeholder="placeholderDic.receivingAddress"
                                ></otpAllAddressSelect>
                            </div>----
                            <div class="clearable_d">
                                <el-input
                                    type="text"
                                    autosize
                                    v-model="indexAddress.receiverDetailAddr"
                                    :placeholder="placeholderDic.receiverDetailAddr"
                                ></el-input>
                            </div>
                        </td>
                    </tr>
                </table>
            </el-form>
            <div class="detailed">
                <el-button type="text" size="small" @click="addDetai">+&nbsp;&nbsp;&nbsp;&nbsp;添加明细</el-button>
            </div>
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;"
                @select="handleSelectionChange"
                @select-all="selectAll"
                height="150"
                min-height="130"
            >
                <el-table-column type="selection" fixed="left" width="55"></el-table-column>
                <el-table-column prop="itemCode" label="商品编码" width="130"></el-table-column>
                <el-table-column prop="planQty" label="商品数量" width="150">
                    <template slot-scope="scope">
                        <input type="text" class="amout"
                            v-model="scope.row.planQty"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            onafterpaste="this.value=this.value.replace(/\D/g,'')"
                            >
                    </template>
                </el-table-column>
                <el-table-column prop="itemStatus" show-overflow-tooltip label="状态" width="160">
                    <template slot-scope="scope" prop="itemStatus">
                        <div class="table_block">
                            <otpSelect :optionNum="'O_ITEM_STATUS'"
                                    @getSelectValue="getItemsSelectValue"
                                    @change="changer(scope.row)"
                                    :filterable="true"
                                    :mValue="scope.row.itemStatus"
                                    :prop="'itemStatus'">
                            </otpSelect>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="showTargetStatus" prop="itemStatusTo" show-overflow-tooltip label="目标状态" width="160">
                    <template slot-scope="scope" prop="itemStatusTo">
                        <div class="table_block">
                            <otpSelect :optionNum="'O_ITEM_STATUS'"
                                    @getSelectValue="getSelectTargetValue"
                                    @change="changer2(scope.row)"
                                    :filterable="true"
                                    :mValue="scope.row.itemStatusTo"
                                    :prop="'itemStatusTo'">
                            </otpSelect>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="customerItemCode" label="客户商品编码" width="140"></el-table-column>
                <el-table-column prop="itemName" label="商品名称" show-overflow-tooltip width="160"></el-table-column>
                <el-table-column prop="itemSuiteCode" label="套机编码" show-overflow-tooltip width="200">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.itemSuiteCode" style="vertical-align: middle;"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="销售价" width="150">
                    <template slot-scope="scope">
                        <input type="text" class="amout"
                            v-model="scope.row.price"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            onafterpaste="this.value=this.value.replace(/\D/g,'')"
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="unit" label="包装单位" width="100"></el-table-column>
                <el-table-column prop="volume" label="体积" width="100"></el-table-column>
                <el-table-column prop="grossWeight" label="重量" width="100"></el-table-column>
                <el-table-column prop="itemSize" label="件型" width="120"></el-table-column>
                <el-table-column prop="materialGroup5" label="计费组5" width="140"></el-table-column>
                <el-table-column prop="createUserCode" label="创建人" width="140"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="tableDelete">删除商品</el-button>
                <el-button type="primary" @click="saveData" v-loading="saveBtn">保 存</el-button>
                <el-button type="primary" @click="verify" v-loading="verifyBtn" v-if="orderStatus !== 150">审 核</el-button>
            </div>
        </el-dialog>
        <order-transfer ref="orderTransfer" @rightList="changet"></order-transfer>
    </div>
</template>
<script src="./orderJavaScript/addOrder.js"></script>
<style lang="less">
@import "../orderClass/addOrder.less";
</style>
