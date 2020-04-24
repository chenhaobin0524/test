<template>
    <div class="path">
        <el-dialog ref="dialog" class="form-dialog path-dialog" title="行车路径调整" :visible.sync="isDetailShow" :before-close="isDetailShowClose" :close-on-click-modal="false" width="80%">
            <div class="driving-path">
                <div class="path-leff">
                    <el-card class="box-card">
                        <div class="box-card-title" >
                            <div class="box-card-left">
                                <span>
                                    &nbsp;&nbsp;总里程：{{totalMileage}}Km（ 装货补贴里程：{{loadSubsidyMileage}}Km&nbsp;&nbsp;/&nbsp;&nbsp;
                                    卸货补贴里程：{{unloadSubsidyMileage}}Km&nbsp;&nbsp;/&nbsp;&nbsp; 卸货里程：{{subsidyMileage}}Km ）
                                </span>
                            </div>
                        </div>
                        <template class="table-head">
                            <el-table :data="tableDataLists" height="200" border row-key="senderDetailAddr" label="Drag" ref="dragTable" v-loading="loading">
                                <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                                <el-table-column show-overflow-tooltip :prop="item.prop" :label="item.label" align="center" v-for="(item, index) in tableDataItems" :key="index">
                                </el-table-column>
                            </el-table>
                        </template>
                        <template class="table-food">
                            <el-table :data="tableLitsDatas" height="200" border row-key="receiverDetailAddr" label="Drag" ref="dragTableTitle" v-loading="loading">
                                <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                                <el-table-column show-overflow-tooltip :prop="item.prop" :label="item.label" align="center" v-for="(item, index) in tableListsDataItems" :key="index">
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-card>
                </div>
                <!-- 地图 -->
                <div class="pathRight" :id="mapId"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="isLoading" @click="bestPath">最优路径计算</el-button>
                <el-button type="primary" :loading="isShowLoading" @click="detailShowOk">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import loadBMap from './detailMap/loadBMap';
import { getPathAdjustment, getOptimalPathComputation, getOptimizationDialogLists } from '../../api/dispatchOrderDetail';
import data from '../dialog/dispatchOrderDetail/data.js';
import Sortable from 'sortablejs';
export default {
    props: {
        isDetailShow: {
            type: Boolean,
            default: false
        },
        dispatchNo: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            polylinePath: [],
            totalMileage: '',
            loadSubsidyMileage: '',
            unloadSubsidyMileage: '',
            subsidyMileage: '',
            arrAyLists: [],
            arrAy: [],
            tableDataLists: [],
            tableDataItems: [],
            tableLitsDatas: [],
            tableListsDataItems: [],
            points: [],
            endGeos: [],
            startGeos: [],
            mapId: 'BMap-' + parseInt(Date.now() + Math.random()),
            myMap: null,
            loading: false,
            startList: [],
            endList: [],
            unload: [],
            pretend: [],
            pretendArr: [],
            newArr: [],
            unloadLists: [],
            isLoading: false,
            isShowLoading: false,
            isMap: true,
            sysFlag: 0
        };
    },
    mounted() {
        this.rowDrop();
        this.rowButtonDrop();
        this.loadDialog();
    },
    methods: {
        initMap() {
            loadBMap('uXRnW5KnsRHsIseRVNRrAvtnBWd2sVHR').then(BMap => {
                this.myMap = new BMap.Map(this.mapId);
                this.myMap.centerAndZoom(new BMap.Point(113.216596, 22.913121), 15);
                this.myMap.enableScrollWheelZoom(true);
                var navigationControl = new BMap.NavigationControl({
                    anchor: 'BMAP_ANCHOR_TOP_LEFT',
                    type: 'BMAP_NAVIGATION_CONTROL_LARGE'
                });
                this.myMap.addControl(navigationControl);
                const first = this.points.shift();
                const last = this.points.pop();
                var start = new BMap.Point(first.lng, first.lat);
                var end = new BMap.Point(last.lng, last.lat);
                this.points = this.points.map((item, index) => {
                    return new BMap.Point(item.lng, item.lat);
                });
                var driving = new BMap.DrivingRoute(this.myMap, { renderOptions: { map: this.myMap, autoViewport: true } });
                var startIco = new BMap.Icon(require('@/assets/gj_start.png'), new BMap.Size(26, 35)); // 起
                var endIco = new BMap.Icon(require('@/assets/gj_end.png'), new BMap.Size(26, 35)); // 终
                var pretendIco = new BMap.Icon(require('@/assets/gj_zhuang.png'), new BMap.Size(26, 35)); // 装
                var dischargeIco = new BMap.Icon(require('@/assets/gj_xie.png'), new BMap.Size(26, 35)); // 卸
                const _this = this;
                driving.setMarkersSetCallback((routes) => {
                    // 删除图标
                    // this.myMap.removeOverlay(routes[0].marker);
                    // this.myMap.removeOverlay(routes[routes.length - 1].marker);
                    for (var m = 1; m < routes.length - 1; m++) {
                        var mm = routes[m].Nm;
                        this.myMap.removeOverlay(mm);
                    }
                    // 修改图标
                    routes.forEach((item, index) => {
                        if (index === 0) {
                            item.marker.setIcon(startIco);
                        } else if (index === routes.length - 1) {
                            item.marker.setIcon(endIco);
                        } else if (index > 0 && index <= (routes.length - 1 - this.endGeos.length)) { // 装
                            this.pretend.push(item);
                            this.$nextTick(() => { // 去除数组的undenfind
                                this.pretend.forEach(item => {
                                    if (item) {
                                        this.pretendArr.push(item);
                                    }
                                });
                            });
                            _this.pretendArr = _this.pretendArr.filter(item => item.point).map(item => new BMap.Point(item.point.lng, item.point.lat));
                            this.myMap.addOverlay(new BMap.Marker(new BMap.Point(item.point.lng, item.point.lat), { icon: pretendIco }));
                        } else if ((index >= this.startGeos.length) && (index < routes.length - 1)) { // 卸
                            this.unload.push(item);
                            this.$nextTick(() => { // 去除数组的undenfind
                                this.unload.forEach(item => {
                                    if (item) {
                                        this.newArr.push(item);
                                    }
                                });
                            });
                            _this.newArr = _this.newArr.filter(item => item.point).map(item => new BMap.Point(item.point.lng, item.point.lat));
                            this.myMap.addOverlay(new BMap.Marker(new BMap.Point(item.point.lng, item.point.lat), { icon: dischargeIco }));
                        }
                    });
                });
                driving.search(start, end, { waypoints: this.points });
            }).catch(() => {
                this.$message.error('地图数据加载失败');
            });
        },
        rowDrop() {
            this.$nextTick(() => {
                const dispatchNo = this.dispatchNo;
                const tbody = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper >table > tbody')[0];
                const _this = this;
                Sortable.create(tbody, {
                    animation: 150,
                    onEnd: ({ newIndex, oldIndex }) => {
                        const currRow = _this.tableDataLists.splice(oldIndex, 1)[0];
                        _this.tableDataLists.splice(newIndex, 0, currRow);
                        _this.tableDataLists.map((item, index) => {
                            const tableObj = { senderDetailAddr: item.senderDetailAddr ? item.senderDetailAddr : '', dispatchNo: dispatchNo };
                            this.arrAy.push(tableObj);
                        });
                    }
                    // onUpdate: ({ newIndex, oldIndex }) => {
                    //     this.sysFlag = 0;
                    // }
                });
            });
        },
        rowButtonDrop() {
            this.$nextTick(() => {
                const dispatchNo = this.dispatchNo;
                const tbody = this.$refs.dragTableTitle.$el.querySelectorAll('.el-table__body-wrapper >table > tbody')[0];
                const _this = this;
                Sortable.create(tbody, {
                    onEnd: ({ newIndex, oldIndex }) => {
                        const currRow = _this.tableLitsDatas.splice(oldIndex, 1)[0];
                        _this.tableLitsDatas.splice(newIndex, 0, currRow);
                        _this.tableLitsDatas.map((item, index) => {
                            const tableListsObj = {
                                receiverDetailAddr: item.receiverDetailAddr ? item.receiverDetailAddr : '',
                                dispatchNo: dispatchNo
                            };
                            this.arrAyLists.push(tableListsObj);
                        });
                    }
                    // onUpdate: ({ newIndex, oldIndex }) => {
                    //     this.sysFlag = 0;
                    // }
                });
            });
        },
        detailShowOk() {
            this.isShowLoading = true;
            var params = { loadList: this.tableDataLists, unLoadList: this.tableLitsDatas, dispatchNo: this.dispatchNo, sysFlag: this.sysFlag };
            getPathAdjustment(params).then(res => {
                if (res.code === '0') {
                    this.isShowLoading = false;
                    this.$message.success('保存成功');
                } else {
                    this.isShowLoading = false;
                }
                this.$emit('detailShowOk', { code: res.code });
            }).catch(() => {
                this.isShowLoading = false;
                this.$message.warning('保存失败');
            });
        },
        // 页面加载接口优化
        loadDialog() {
            getOptimizationDialogLists(this.dispatchNo).then(res => {
                this.totalMileage = res.data.totalMileage;
                this.loadSubsidyMileage = res.data.loadSubsidyMileage;
                this.unloadSubsidyMileage = res.data.unloadSubsidyMileage;
                this.subsidyMileage = res.data.subsidyMileage;
                const arrivalModeSetMap = new Map();
                const arriveTypeSetMap = new Map();
                arrivalModeSetMap.set('', '').set('01', '手动到车').set('02', '直通宝到车');
                arriveTypeSetMap.set('', '').set('01', '手动抵达').set('02', '直通宝抵达').set('03', '自动抵达');
                if (res && res.code === '0') {
                    this.tableDataLists = res.data.loadList.map(item => { // 装
                        this.startGeos.push({ lng: item.startLng, lat: item.startLat, state: 'state' });
                        item.arriveTypeText = arrivalModeSetMap.get(item.arriveType);
                        return item;
                    });
                    this.tableLitsDatas = res.data.unloadList.map(item => { // 卸
                        this.endGeos.push({ lng: item.endLng, lat: item.endLat });
                        item.arrivalWayText = arriveTypeSetMap.get(item.arrivalWay);
                        return item;
                    });
                    this.points = this.points.concat(this.startGeos, this.endGeos);
                    this.initMap();
                    if (res.msg !== 'Success') {
                        this.$message.error(res.msg);
                    }
                }
            }).catch(() => {});
        },
        // 最优路径计算
        bestPath() {
            this.isLoading = true;
            getOptimalPathComputation(this.dispatchNo).then(res => {
                if (res && res.code === '0') {
                    this.totalMileage = res.data.totalMileage;
                    this.loadSubsidyMileage = res.data.loadSubsidyMileage;
                    this.unloadSubsidyMileage = res.data.unloadSubsidyMileage;
                    this.subsidyMileage = res.data.subsidyMileage;
                    const arrivalModeSetMap = new Map();
                    const arriveTypeSetMap = new Map();
                    arrivalModeSetMap.set('', '').set('01', '手动到车').set('02', '直通宝到车');
                    arriveTypeSetMap.set('', '').set('01', '手动抵达').set('02', '直通宝抵达').set('03', '自动抵达');
                    this.startGeos = [];
                    this.tableDataLists = res.data.loadList.map((item, index) => { // 装
                        this.startGeos.push({ lng: item.startLng, lat: item.startLat, state: 'state' });
                        item.arriveTypeText = arrivalModeSetMap.get(item.arriveType);
                        return item;
                    });
                    this.endGeos = [];
                    this.tableLitsDatas = res.data.unloadList.map((item, index) => { // 卸
                        this.endGeos.push({ lng: item.endLng, lat: item.endLat });
                        item.arrivalWayText = arriveTypeSetMap.get(item.arrivalWay);
                        return item;
                    });
                    this.points = [];
                    this.points = this.points.concat(this.startGeos, this.endGeos);
                    this.initMap();
                    this.sysFlag = 1;
                    this.$message.success('计算成功');
                    this.isLoading = false;
                } else {
                    this.isLoading = false;
                }
            }).catch(() => {
                this.isLoading = false;
            });
        },
        isDetailShowClose() {
            this.$emit('isDetailShowClose', '');
        }
    },
    created() {
        this.tableDataItems = data.tableDataItems;
        this.tableListsDataItems = data.tableListsDataItems;
    }
};
</script>

<style lang="less">
.path{
    .driving-path{
        display: flex;
        height: 442px;
        .path-leff{
            flex: 1;
            margin-right: 10px;
        }
        .pathRight{
            flex: 1;
            width: 100%;
            height: 442px;
            border: 1px solid #ccc;
            .path-right{
                width: 100%;
                height: 442px;
            }
        }
    }
    .BMap_cpyCtrl {
        display: none;
    }
    .anchorBL {
        display: none;
    }
}
</style>