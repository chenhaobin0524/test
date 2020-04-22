<template>
    <el-dialog
        title="行车路径调整"
        class="adjust"
        :visible.sync="showAdjust"
        width="80%"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <el-main class="content" v-loading="tableLoading">
            <el-card class="box-card">
                <div class="box-card-title">
                    <span>
                        &nbsp;&nbsp;总里程：{{totalMileage}}Km（ 装货补贴里程：{{loadSubsidyMileage}}Km&nbsp;&nbsp;/&nbsp;&nbsp;
                        卸货补贴里程：{{unloadSubsidyMileage}}Km&nbsp;&nbsp;/&nbsp;&nbsp; 串点里程：{{subsidyMileage}}Km ）
                    </span>
                </div>
                <el-table :data="dispatchItemsData" height="200" border row-key="receiverDetailAddr" label="Drag" ref="loadTable">
                    <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip :prop="item.prop" :label="item.label" align="center" v-for="(item, index) in data.dispatchItems.columns" :key="index">
                    </el-table-column>
                </el-table>
                <el-table :data="dispatchListsItemsData" height="200" border row-key="receiverDetailAddr" label="Drag" ref="unLoadTable">
                    <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip :prop="item.prop" :label="item.label" align="center" v-for="(item, index) in data.dispatchListsItems.columns" :key="index">
                    </el-table-column>
                </el-table>
            </el-card>
            <div class="path-map" :id="pathMap"></div>
        </el-main>
        <span slot="footer" class="dialog-footer">
            <!-- <el-button type="primary" @click="handleBestPath">最优路径计算</el-button> -->
            <el-button type="primary" @click="saveOk" :loading="saveLoading">保 存</el-button>
        </span>
    </el-dialog>
</template>
<script>
import data from './data.js';
import { getOptimizationLists, mileageUpdate } from '../../../../api/netDeparture';
import loadBMap from '../../../../components/dialog/detailMap/loadBMap';
import Sortable from 'sortablejs';
export default {
    props: {
        showAdjust: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            data,
            tableLoading: false,
            dispatchItemsData: [],
            dispatchListsItemsData: [],
            pathMap: 'BMap-' + parseInt(Date.now() + Math.random()),
            myMap: null,
            totalMileage: '',
            loadSubsidyMileage: '',
            unloadSubsidyMileage: '',
            subsidyMileage: '',
            points: [],
            startGeos: [],
            endGeos: [],
            pretend: [],
            pretendArr: [],
            unload: [],
            newArr: [],
            saveLoading: false
        };
    },
    methods: {
        initMap() {
            loadBMap('uXRnW5KnsRHsIseRVNRrAvtnBWd2sVHR').then(BMap => {
                this.myMap = new BMap.Map(this.pathMap);
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
        getTableList() {
            this.startGeos = [];
            this.endGeos = [];
            this.points = [];
            this.tableLoading = true;
            getOptimizationLists(this.$route.query.dispatchInventedNo).then(res => {
                this.tableLoading = false;
                if (res) {
                    const data = res.data;
                    this.dispatchItemsData = data.loadList || [];
                    this.dispatchListsItemsData = data.unloadList || [];
                    this.totalMileage = data.totalMileage;
                    this.loadSubsidyMileage = data.loadSubsidyMileage;
                    this.unloadSubsidyMileage = data.unloadSubsidyMileage;
                    this.subsidyMileage = data.subsidyMileage;
                    this.dispatchItemsData.forEach(item => {
                        this.startGeos.push({ lng: item.startLng, lat: item.startLat, state: 'state' });
                    });
                    this.dispatchListsItemsData.forEach(item => {
                        this.endGeos.push({ lng: item.endLng, lat: item.endLat });
                    });
                    this.points = this.points.concat(this.startGeos, this.endGeos);
                    this.initMap();
                }
            }).catch(() => {
                this.tableLoading = false;
            });
        },
        rowDrop() {
            const loadTbody = this.$refs.loadTable.$el.querySelectorAll('.el-table__body-wrapper >table > tbody')[0];
            const unLoadTbody = this.$refs.unLoadTable.$el.querySelectorAll('.el-table__body-wrapper >table > tbody')[0];
            const _this = this;
            Sortable.create(loadTbody, {
                onEnd({ newIndex, oldIndex }) {
                    const currRow = _this.dispatchItemsData.splice(oldIndex, 1)[0];
                    _this.dispatchItemsData.splice(newIndex, 0, currRow);
                }
            });
            Sortable.create(unLoadTbody, {
                onEnd({ newIndex, oldIndex }) {
                    const currRow = _this.dispatchListsItemsData.splice(oldIndex, 1)[0];
                    _this.dispatchListsItemsData.splice(newIndex, 0, currRow);
                }
            });
        },
        handleBestPath() {},
        saveOk() {
            this.saveLoading = true;
            const params = {
                dispatchInventedNo: this.$route.query.dispatchInventedNo
            };
            mileageUpdate(params).then(res => {
                this.saveLoading = false;
                if (res) {
                    this.$message.success('保存成功');
                    this.$emit('adjustClose');
                }
            }).catch(() => {
                this.saveLoading = false;
            });
        },
        handleClose() {
            this.$emit('adjustClose');
        }
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.rowDrop();
        // });
    },
    created() {
        this.getTableList();
        this.data.dispatchItems.isHasIndex = true;
        this.data.dispatchListsItems.isHasIndex = true;
    }
};
</script>
<style lang="less">
    .adjust {
        .content {
            width: 100%;
        }
        .box-card {
            display: inline-block;
            width: 48%;
            .el-card__body {
                padding: 0;
            }
            .box-card-title {
                height: 40px;
                line-height: 40px;
            }
        }
        .path-map {
            display: inline-block;
            width: 50%;
            height: 440px;
            margin-left: 1%;
            border: 1px solid #ccc;
        }
        .BMap_cpyCtrl {
            display:none;
        }
        .anchorBL{
             display:none;
        }
    }
</style>