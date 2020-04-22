<template>
    <Paper class="example">
        <div class="departure">
            <div class="content">
               <speed :process='process'></speed>
            </div>
            <Vehicle :infoData="infoData" @operation="operation" @openMapClick="openMapClick"></Vehicle>
            <div class="tabHead">
                <el-button v-if="isShipment" v-has="'04040014'" class="shipment" type="primary" @click="shipmentShowOk">装货确认</el-button>
                <template>
                    <el-table :data="tableDatas" border @cell-dblclick="celldblclick" class="tabContentList" max-height="250">
                        <el-table-column prop="custOrderNo" label="客户订单号" width="120" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="taskNo" label="运输单号" width="160" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="contractNo" label="合同号" :show-overflow-tooltip="true" width="160"></el-table-column>
                        <el-table-column prop="whName" label="仓库" :show-overflow-tooltip="true" width="120"></el-table-column>
                        <el-table-column prop="customerName" label="客户" :show-overflow-tooltip="true" width="180"></el-table-column>
                        <el-table-column prop="itemName" label="商品名称" width="320" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="customerItemCode" label="客户商品编码" width="100" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="itemCode" label="商品编码" width="100" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="planQty" label="数量" width="80"></el-table-column>
                        <el-table-column prop="actQty" label="实发数量">
                            <template slot-scope="scope">
                                <div v-if="scope.row.editing !== 'save'">
                                    <span>{{scope.row.actQty}}</span>
                                </div>
                                <div v-else class='textInput'>
                                    <el-input v-model.trim="scope.row.actQty"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="volume" label="方量(m³)" width="80">
                            <template slot-scope="scope">
                                {{scope.row.planQty*scope.row.volume ? Math.round(scope.row.planQty*scope.row.volume * 1000000) / 1000000 : 0}}
                                </template>
                        </el-table-column>
                        <el-table-column prop="actQty" label="实发方量(m³)" width="100">
                            <template slot-scope="scope">{{scope.row.actQty*scope.row.volume? Math.round(scope.row.actQty*scope.row.volume * 1000000) / 1000000 : 0}}</template>
                        </el-table-column>
                        <el-table-column prop="grossWeight" label="重量(Kg)" width="80">
                            <template slot-scope="scope">{{scope.row.planQty*scope.row.grossWeight?scope.row.planQty*scope.row.grossWeight:0}}</template>
                        </el-table-column>
                        <el-table-column prop="actQty" label="实发重量(Kg)" width="100">
                            <template slot-scope="scope">{{scope.row.actQty*scope.row.grossWeight?scope.row.actQty*scope.row.grossWeight: 0}}</template>
                        </el-table-column>
                        <el-table-column prop="senderDetailAddr" label="发货地址" width="80" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="receiverName" label="收货人" width="80"></el-table-column>
                        <el-table-column prop="receiverDetailAddr" label="收货地址" width="80" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="taskStatus" label="运输单状态" width="100">
                            <template slot-scope="scope"><span :class="scope.row.statusActive ? 'status-active' : ''">{{scope.row.taskStatus}}</span></template>
                        </el-table-column>
                        <el-table-column prop="businessType" label="计费业务类型" :show-overflow-tooltip="true"  width="100"></el-table-column>
                        <el-table-column prop="distributionFlag" label="是否分拨" :show-overflow-tooltip="true"  width="100"></el-table-column>
                        <el-table-column prop="distributionWhName" label="分拨仓库" :show-overflow-tooltip="true"  width="100"></el-table-column>
                        <el-table-column prop="actualArriveDate" label="到车时间" :show-overflow-tooltip="true"  width="100"></el-table-column>
                        <el-table-column prop="arrivalTime" label="抵达时间" :show-overflow-tooltip="true"  width="100"></el-table-column>
                        <el-table-column prop="queueCode" label="排队编码" :show-overflow-tooltip="true"  width="160"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="100" align="center" v-if="isOperation">
                            <template slot-scope="scope" >
                                <span v-has="'04040011'" v-if="scope.row.editing === 'edit'" @click="handleEdit(scope.$index, scope.row)" class="table-btn">编辑</span>
                                <span v-has="'04040012'" v-else-if="scope.row.editing === 'save'" class="table-btn" @click="handleSave(scope.$index, scope.row)">保存</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
            <el-card class="box-card">
                <div class="box-card-title" >
                    <div class="box-card-left">
                        <span>
                            &nbsp;&nbsp;总里程：{{totalMileage}}Km（ 装货补贴里程：{{loadSubsidyMileage}}Km&nbsp;&nbsp;/&nbsp;&nbsp;
                            卸货补贴里程：{{unloadSubsidyMileage}}Km&nbsp;&nbsp;/&nbsp;&nbsp; 串点里程：{{subsidyMileage}}Km ）（ 配送导航里程：{{subsidyMileage + unloadSubsidyMileage}}Km &nbsp;&nbsp;/&nbsp;&nbsp;
                            提货补贴里程：{{loadSubsidyMileage}}Km ）
                        </span>
                    </div>
                    <div class="box-card-right">
                        <el-button v-if="isHandleTableLists" type="primary" @click="handleTableLists" v-has="'04040010'">调 整</el-button>
                        <!-- <el-button v-if="!isPreservation" type="primary" @click="handleTableLists" v-has="'04040013'">保 存</el-button> -->
                    </div>
                </div>
                <template class="table-head">
                    <el-table :data="tableDataLists" border height="200" row-key="senderDetailAddr" label="Drag" ref="dragTable">
                        <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                        <el-table-column show-overflow-tooltip :prop="item.prop" :label="item.label" v-for="(item, index) in tableDataItems" :key="index">
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100" align="center" v-if="isTableDataLists">
                            <template slot-scope="scope" v-if="isAsternCell">
                                <span v-has="'04040008'" v-if="scope.row.editing === 'Astern'" @click="handleAstern(scope.$index, scope.row)" class="table-btn">到车</span>
                                <span v-has="'04040009'" v-else-if="scope.row.editing === 'AsternCell'" class="table-btn" @click="handleAsternCell(scope.$index, scope.row)">
                                    <span v-if="isCellCar">取消到车</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <template class="table-food">
                    <el-table :data="tableLitsDatas" border height="200" row-key="receiverDetailAddr" label="Drag" ref="dragTableTitle">
                        <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                        <el-table-column show-overflow-tooltip :prop="item.prop" :label="item.label" v-for="(item, index) in tableListsDataItems" :key="index">
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100" align="center" v-if="isOperationLits">
                            <template slot-scope="scope" v-if="scope.row.isOperationLits">
                                <span v-has="'04040007'" v-if="scope.row.editing === 'arrive'" @click="handleDisburdenArrive(scope.$index, scope.row)" class="table-btn">
                                    <span v-if="isReach">抵达</span>
                                </span>
                                <span v-else-if="scope.row.editing === 'arriveCell'" class="table-btn" @click="handleDisburdenArriveCell(scope.$index, scope.row)" v-has="'04040001'">
                                    <span v-if="isReachCell">取消抵达</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-card>
            <Main :visible.sync="visible" :tableData="tableData" :items="tabItems" :title="title" @handleClose="handleClose"></Main>
            <astern-dialog v-if='visiable' :visiable.sync="visiable" :label-position="labelPosition" @handleClose="handListsleClose" @addOk="addOk" :dataVisiableLists="dataAddObj"></astern-dialog>
            <detail-dialog ref="detailDialog" v-if='isDetailShow' :isDetailShow.sync="isDetailShow"
            :label-position="labelPosition" :dispatchNo="$route.query.dispatchNo" @isDetailShowClose="isDetailShowClose" @detailShowOk="detailShowOk"></detail-dialog>
        </div>
    </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import speed from '../../../components/speed/speed';
import Vehicle from '../../../components/speed/Vehicle';
import asternDialog from '../../../components/dialog/asternDialog';
import detailDialog from '../../../components/dialog/detailDialog';
import Main from '../../../components/dispatchPopup/dispatchList/Main';
import data from './data.js';
import { getDispatchLists, getSearchdetails, getHandLoadings, getOperationLog, getStepLists, getArriveLists,
    getArriveCellLists, getDispathOrderRegister, getCancelarrivesite, getoptimizationLists,
    getConfirmations, dispatchStatusLists, isYN } from '../../../api/dispatchOrderDetail';
export default {
    name: 'dispatchOrderDetail',
    data() {
        return {
            isDetailShow: false,
            labelPosition: 'right',
            dataAddObj: {},
            process: {},
            infoData: [],
            data: data,
            totalMileage: '',
            loadSubsidyMileage: '',
            unloadSubsidyMileage: '',
            subsidyMileage: '',
            isCellCar: true,
            visiable: false,
            isReach: true,
            isReachCell: true,
            isOperationLits: true,
            isTableDataLists: true,
            isHandleTableLists: false,
            isAsternCell: true,
            tableDatas: [ { editing: 'edit' } ],
            tableDataItems: [],
            tableListsDataItems: [],
            title: '操作日志',
            tableData: [],
            tableDataLists: [ { editing: 'Astern' } ],
            tableLitsDatas: [ { editing: 'arrive' } ],
            tabItems: [],
            visible: false,
            isOperation: false,
            vehicleCardNumber: '',
            driverName: '',
            driverContactWayNum: '',
            isShipment: false,
            dispatchOrderDetailTime: ''
        };
    },
    mounted() {
        this.load();
        this.dispatchStatus();
        this.isYNList();
        document.querySelector('.departure .numbers').addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.copyText();
        });
    },
    methods: {
        isDetailShowClose() { this.isDetailShow = false; },
        detailShowOk(code) {
            if (code.code === '0') {
                this.isDetailShow = false;
                this.$nextTick(() => {
                    this.load();
                });
            }
        },
        celldblclick(row, column, cell, event) {
            if (row[column.property] === undefined) return;
            var clickTabContent = row[column.property];
            const inputEle = document.createElement('input');
            document.body.appendChild(inputEle);
            inputEle.setAttribute('value', clickTabContent);
            inputEle.setAttribute('readonly', 'readonly');
            inputEle.select();
            document.execCommand('copy');
            document.body.removeChild(inputEle);
            this.$message.success(`‘${inputEle.value}’ 复制成功`);
        },
        async load() {
            this.loadSpteLists();
            this.loadOptimizationLists();
            await this.loadDetails();
            this.loadOpionsList();
        },
        loadOpionsList() {
            this.isShipment = false;
            this.isOperation = false;
            let isShipmentCount = 0;
            let isOperationCount = 0;
            const stateListMap = new Map();
            const stateListFlag = new Map();
            stateListMap.set('10', '宅配').set('5', '快递').set('4', '配送').set('3', '运输').set('2', '装卸').set('1', '仓储');
            stateListFlag.set('Y', '是').set('N', '否');
            getSearchdetails(this.$route.query.dispatchNo).then(res => {
                if (res) {
                    this.tableDatas = res.data.list.map(item => {
                        item.distributionFlag = stateListFlag.get(item.distributionFlag);
                        item.businessType = stateListMap.get(item.businessType);
                        item.editing = 'edit';
                        if (item.taskStatus === 0) {
                            item.taskStatus = '待调度';
                            item.editing = '';
                        } else if (item.taskStatus === 10) {
                            item.taskStatus = '待到车';
                            item.statusActive = true;
                            item.editing = '';
                        } else if (item.taskStatus === 20) {
                            item.taskStatus = '待装车';
                            if (((item.inOutType === 'OUT' && item.logisticMode && item.logisticMode === 'WT') || item.inOutType === 'YS')) {
                                this.isOperation = true;
                                ++isOperationCount;
                                item.editing = 'edit';
                            } else {
                                item.editing = '';
                            }
                        } else if (item.taskStatus === 30) {
                            item.taskStatus = '待发车';
                            item.editing = '';
                        } else if (item.taskStatus === 40) {
                            item.taskStatus = '在途';
                            item.editing = '';
                        } else if (item.taskStatus === 50) {
                            item.taskStatus = '抵达';
                            item.editing = '';
                            this.isOperationLits = true;
                            this.isReachCell = true;
                        } else if (item.taskStatus === 60) {
                            item.taskStatus = '待签收';
                            item.editing = '';
                        } else if (item.taskStatus === 70) {
                            item.taskStatus = '待移交';
                            item.editing = '';
                        } else if (item.taskStatus === 100) {
                            item.taskStatus = '完成';
                            item.editing = '';
                        } else if (item.taskStatus === 200) {
                            item.taskStatus = '已拒收';
                            item.editing = '';
                        } else if (item.taskStatus === 999) {
                            item.taskStatus = '取消';
                            item.editing = '';
                        }
                        if (this.process.title === '待装车') {
                            if ((item.inOutType === 'OUT' && item.logisticMode && item.logisticMode === 'WT') || item.inOutType === 'YS') {
                                ++isShipmentCount;
                            }
                        }
                        return item;
                    });
                    this.isOperation = isOperationCount;
                    this.isShipment = isShipmentCount;
                }
            });
        },
        loadOptimizationLists() {
            this.tableDataLists = [];
            this.tableLitsDatas = [];
            getoptimizationLists(this.$route.query.dispatchNo).then(res => {
                this.totalMileage = res.data.totalMileage;
                this.loadSubsidyMileage = res.data.loadSubsidyMileage;
                this.unloadSubsidyMileage = res.data.unloadSubsidyMileage;
                this.subsidyMileage = res.data.subsidyMileage;
                const setTaskStatus = new Map();
                const arrivalModeSetMap = new Map();
                const arriveTypeSetMap = new Map();
                const arriveTypeTaskStatusMap = new Map();
                setTaskStatus.set(10, 'Astern').set(20, 'AsternCell');
                arrivalModeSetMap.set('', '').set('01', '手动到车').set('02', '直通宝到车');
                arriveTypeTaskStatusMap.set(40, 'arrive').set(50, 'arriveCell');
                arriveTypeSetMap.set('', '').set('01', '手动抵达').set('02', '直通宝抵达').set('03', '自动抵达');
                if (res && res.code === '0') {
                    let isOperationLits = false;
                    this.tableDataLists = res.data.loadList.map(item => {
                        item.editing = setTaskStatus.get(item.taskStatus);
                        item.arriveTypeText = arrivalModeSetMap.get(item.arriveType);
                        return item;
                    });
                    this.tableLitsDatas = res.data.unloadList.map(item => {
                        item.arrivalWayText = arriveTypeSetMap.get(item.arrivalWay);
                        item.editing = arriveTypeTaskStatusMap.get(item.taskStatus);
                        if (item.taskStatus === 40 || item.taskStatus === 50) {
                            item.isOperationLits = true;
                        } else {
                            item.isOperationLits = false;
                        }
                        isOperationLits = isOperationLits || item.isOperationLits;
                        return item;
                    });
                    this.isOperationLits = isOperationLits;
                }
            }).catch(() => {});
        },
        handleDisburdenArrive($index, row) {
            var time = new Date();
            var postDepartureTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
            var timeDifference = String(parseInt(new Date(this.dispatchOrderDetailTime) - new Date(postDepartureTime)) / 1000 / 60).replace(/-/g, '');
            if (timeDifference < 30) {
                this.$message.warning('发车后30分钟内，不支持手工抵达');
                return this.load();
            }
            this.tableLitsDatas[$index].editing = 'arriveCell';
            const params = { dispatchNo: this.process.orderNo, receiverDetailAddr: row.receiverDetailAddr };
            getArriveLists(params).then(res => {
                if (res.code === '0') {
                    this.$message.success('抵达成功');
                    this.load();
                }
            });
        },
        handleDisburdenArriveCell($index, row) {
            this.tableLitsDatas[$index].editing = 'arrive';
            const params = { dispatchNo: this.process.orderNo, receiverDetailAddr: row.receiverDetailAddr };
            getArriveCellLists(params).then(res => {
                if (res.code === '0') {
                    this.$message.success('取消抵达成功');
                    this.load();
                }
            });
        },
        handleAstern ($index, row) {
            this.tableDataLists[$index].editing = 'AsternCell';
            this.dispatchNo = this.process.orderNo;
            this.senderDetailAddrName = row.senderDetailAddr;
            this.visiable = true;
            const dataObj = { vehicleCard: this.vehicleCardNumber, driver: this.driverName, driverContactWay: this.driverContactWayNum };
            this.dataAddObj = dataObj;
        },
        handListsleClose() {
            this.visiable = false;
            this.load();
        },
        addOk(formName) {
            const senderDetailAddrName = this.senderDetailAddrName;
            const dispatchNo = this.dispatchNo;
            formName.data['dispatchNo'] = dispatchNo;
            formName.data['senderDetailAddr'] = senderDetailAddrName;
            if (formName.state === true) {
                getDispathOrderRegister(formName.data, this.dispatchNo, this.senderDetailAddrName).then(res => {
                    if (res && res.code === '0') {
                        this.$message.success('保存成功');
                        this.load();
                    }
                }).catch(() => {
                    this.load();
                });
            } else {
                return false;
            }
        },
        handleAsternCell ($index, row) {
            this.tableDataLists[$index].editing = 'Astern';
            const params = { dispatchNo: this.process.orderNo, senderDetailAddr: row.senderDetailAddr };
            getCancelarrivesite(params).then(res => {
                if (res.code === '0') {
                    this.$message.success('取消到车成功');
                    this.load();
                } else {
                    this.load();
                }
            });
        },
        handleTableLists() {
            this.isDetailShow = true;
        },
        loadSpteLists() {
            getStepLists(this.$route.query.dispatchNo).then(res => {
                if (res && res.code === '0') {
                    res.data.list.forEach((item, index) => {
                        this.process.step[index].id = String(item.isShow);
                        this.process.step[index].carName = item.dispatchStatusName;
                        this.process.step[index].carTimes = item.createTime;
                    });
                }
            });
        },
        handleEdit($index, row) { this.tableDatas[$index].editing = 'save'; },
        handleSave($index, row) {
            this.paramsId = row;
            if (this.tableDatas[$index].actQty === '') {
                this.$message.warning('实发数量不能为空');
                return false;
            }
            const reg = /^[0-9]*$/;
            if (reg.test(this.tableDatas[$index].actQty) === false) {
                this.tableDatas[$index].actQty = '';
                this.$message.warning('只能输入数字且不能为小数');
                return false;
            }
            if (this.tableDatas[$index].actQty > this.tableDatas[$index].planQty) {
                this.$message.warning('实发数量不能大于总数量');
                this.tableDatas[$index].actQty = '';
                document.querySelector('.textInput input').style.border = '1px solid red';
                return false;
            }
            const params = {
                dispatchNo: this.$route.query.dispatchNo,
                taskNo: this.tableDatas[$index].taskNo,
                id: this.paramsId.id,
                actQty: this.tableDatas[$index].actQty,
                version: this.paramsId.version
            };
            getHandLoadings(params).then(res => {
                if (res.code === '0') {
                    this.$message.success('保存成功');
                }
                this.load();
            });
            document.querySelector('.textInput input').style = '';
            this.tableDatas[$index].editing = '';
        },
        operation() {
            var params = { dispatchNo: this.$route.query.dispatchNo, type: '10' };
            getOperationLog(params).then(res => {
                if (res && res.code === '0') {
                    this.tableData = res.data.map((item, index) => {
                        item.type = item.dispatchStatusName;
                        return item;
                    });
                }
            });
            this.visible = true;
        },
        openMapClick() {
            this.$router.push({
                name: 'trafficTrajectory',
                params: { name: '/distribute/traffic-trajectory', dispatchNo: this.$route.query.dispatchNo }
            });
        },
        handleClose() { this.visible = false; },
        async loadDetails() {
            const stateMap = new Map();
            stateMap.set('00', '公路运输').set('10', '海路运输').set('20', '铁路运输').set('30', '航空运输').set('40', '内河运输');
            await getDispatchLists(this.$route.query.dispatchNo).then(res => {
                if (res && res.code === '0') {
                    this.dispatchOrderDetailTime = res.data.dispatchTime;
                    if (res.data.procurementChannel === '190' && res.data.dispatchStatus <= 30) {
                        this.isHandleTableLists = true;
                    } else { this.isHandleTableLists = false; }
                    Number(res.data.dispatchStatus) === 10 ? this.isTableDataLists = true : this.isTableDataLists = false;
                    if (Number(res.data.dispatchStatus) === 20) {
                        this.isTableDataLists = true;
                        this.isCellCar = true;
                    }
                    res.data.inOutType === 'YS' ? this.isTableDataLists = true : this.isTableDataLists = false;
                    var arr = [];
                    arr.push({
                        title: '车辆信息',
                        subItems: [
                            {
                                label: '车牌',
                                value: res.data.vehicleCard,
                                images: {
                                    value: '定位',
                                    url: require('@/assets/position.png')
                                }
                            },
                            {
                                label: '司机',
                                message: [
                                    { icon: require('@/assets/touxiang.png'), value: res.data.driver },
                                    { icon: require('@/assets/dianhua.png'), value: res.data.driverContactWay }
                                ]
                            },
                            {
                                label: '承运商',
                                value: res.data.driverContactWay
                            },
                            {
                                label: '发车单平台',
                                value: res.data.siteName
                            },
                            {
                                label: '运输类型',
                                value: res.data.transportType
                            }
                        ]
                    },
                    {
                        title: '费用信息',
                        subItems: [
                            {
                                label: '运输成本',
                                value: res.data.transportationCost
                            },
                            {
                                label: '预付金额',
                                value: res.data.prepaidAmount
                            },
                            {
                                label: '预付方式',
                                value: res.data.payMethod
                            }
                        ]
                    },
                    {
                        title: '其他信息',
                        subItems: [
                            {
                                label: '是否顺路带回',
                                value: res.data.conveniently
                            },
                            {
                                label: '信息费用',
                                value: res.data.infoFee
                            },
                            {
                                label: '税率',
                                value: res.data.taxRate
                            },
                            {
                                label: '备注',
                                value: res.data.remark
                            }
                        ]
                    });
                    this.vehicleCardNumber = res.data.vehicleCard;
                    this.driverName = res.data.driver;
                    this.driverContactWayNum = res.data.driverContactWay;
                    this.infoData[0].subItems[0].value = this.vehicleCardNumber;
                    this.infoData[0].subItems[1].message[0].value = this.driverName;
                    this.infoData[0].subItems[1].message[1].value = this.driverContactWayNum;
                    this.infoData[0].subItems[2].value = res.data.carrierName;
                    this.infoData[0].subItems[3].value = res.data.siteName;
                    this.infoData[0].subItems[4].value = res.data.transportType;
                    this.infoData[0].subItems[4].value = stateMap.get(res.data.transportType);
                    this.infoData[1].subItems[0].value = res.data.transportationCost ? res.data.transportationCost + '元' : '';
                    if (res.data.prepaidAmount === undefined) {
                        res.data.prepaidAmount = '';
                    }
                    this.infoData[1].subItems[1].value = String(res.data.prepaidAmount) ? String(res.data.prepaidAmount) + '元' : '';
                    this.infoData[1].subItems[2].value = res.data.payMethod ? res.data.payMethod : '';
                    this.infoData[2].subItems[0].value = res.data.conveniently;
                    if (res.data.infoFee === undefined) res.data.infoFee = '';
                    this.infoData[2].subItems[1].value = String(res.data.infoFee) ? String(res.data.infoFee) + '元' : '';
                    // if (res.data.taxRate === undefined) {
                    //     this.infoData[2].subItems[2].value = '';
                    // } else {
                    //     this.infoData[2].subItems[2].value = String(res.data.taxRate) ? String(res.data.taxRate) + '%' : '';
                    // }
                    this.infoData[2].subItems[2].value = (res.data.taxRate === undefined) ? '' : (String(res.data.taxRate) ? String(res.data.taxRate) + '%' : '');
                    this.infoData[2].subItems[3].value = res.data.remark;
                    this.process.orderNo = res.data.dispatchNo;
                    this.process.title = res.data.dispatchStatus;
                    this.infoData[2].subItems[0].value = window.sessionStorage.YES_OR_NO
                        ? JSON.parse(window.sessionStorage.YES_OR_NO)[this.infoData[2].subItems[0].value] : this.infoData[2].subItems[0].value;
                    const payMethodIndex = new Map();
                    payMethodIndex.set('0', '网银转账').set('1', '油卡支付');
                    this.infoData[1].subItems[2].value = payMethodIndex.get(this.infoData[1].subItems[2].value);
                    this.process.title = window.sessionStorage.DISPATCH_STATUS ? JSON.parse(window.sessionStorage.DISPATCH_STATUS)[this.process.title] : this.process.title;
                }
            });
        },
        copyText() {
            var clickContent = document.querySelector('.departure .numbers').innerText;
            var input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', clickContent);
            input.setAttribute('readonly', 'readonly');
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            this.$message.success(`‘${input.value}’复制成功`);
        },
        shipmentShowOk() {
            const params = { dispatchNo: this.process.orderNo };
            getConfirmations(params).then(res => {
                if (res && res.code === '0') {
                    this.$message.success('装货确认成功');
                    this.load();
                }
            }).catch(() => {});
        },
        dispatchStatus() {
            dispatchStatusLists().then(res => {
                const taskObj = {};
                for (let index = 0; index < res.data.list.length; index++) {
                    taskObj[res.data.list[index].code] = res.data.list[index].name;
                }
                sessionStorage.setItem('DISPATCH_STATUS', JSON.stringify(taskObj));
            });
        },
        isYNList() {
            isYN().then(res => {
                const taskObj = {};
                for (let index = 0; index < res.data.list.length; index++) {
                    taskObj[res.data.list[index].code] = res.data.list[index].name;
                }
                sessionStorage.setItem('YES_OR_NO', JSON.stringify(taskObj));
            });
        }
    },
    activated() { this.load(); },
    components: { Paper, speed, Vehicle, Main, asternDialog, detailDialog },
    created() {
        this.process = data.process;
        this.infoData = data.infoData;
        this.tableDataItems = data.tableDataItems;
        this.tableListsDataItems = data.tableListsDataItems;
        this.tabItems = data.tabItems;
    }
};
</script>
<style lang='less'>
@import "../styles/common.less";
@import "./dispatchOrderDetail.less";
</style>