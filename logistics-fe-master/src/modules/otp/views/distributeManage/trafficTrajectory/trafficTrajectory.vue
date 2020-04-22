<template>
    <Paper class="trafficTrajectory">
        <div class="trajectoryHead">
            <m-search-list
                ref="search"
                :searchId="searchId"
                :list="config.searchList"
                :searchTotalTitle="searchTotalTitle"
                :searchSetTitle="searchSetTitle"
                @onSearchChange="searchChange">
            </m-search-list>
        </div>
        <el-main v-loading="mianLoading">
            <div class="trajectoryContent">
                <div class="contenLeft">
                    <div class="contentTitle">
                        <div class="content"
                            :class="{ 'activeClass': currentIdx == 1}"
                            @click="contentTitleClick(1)">
                            <div class="lable">在途</div>
                            <span class="value">{{ontheway}}</span>
                        </div>
                        <div class="content"
                            :class="{ 'activeClass': currentIdx == 2}"
                            @click="contentTitleClick(2)">
                            <div class="lable">逾期</div>
                            <span class="value">{{overdue}}</span>
                        </div>
                    </div>
                    <div class="total" @scroll="handleScroll($event)">
                        <el-scrollbar>
                            <div
                                class="contentBottom"
                                :class="{'active':index===current,'notActive':!(index===current)}"
                                v-for="(item, index) in tabItems"
                                :key="index"
                                @click="tabClick(item, index)">
                                <div class="particulars">
                                    <div class="particularsLeft">
                                        <div class="licensePlate">
                                            <img class="licensePlateImg" :src="item.icon">
                                            <span class="licensePlateNum">{{item.vehicleCard}}</span>
                                        </div>
                                        <div class="percentage" :class="item.className">{{item.efficiency}}</div>
                                        <div class="loadingRate">{{item.rate}}</div>
                                    </div>
                                    <div class="particularsRight">
                                        <div class="leftLable">
                                            <span>起始地：</span>
                                            <span :title='item.senderDetailAddr' class="leftValue leftCont">{{item.senderDetailAddr}}</span>
                                        </div>
                                        <div class="leftLable">
                                        <span>目的地：</span>
                                            <span :title='item.receiverDetailAddr' class="leftValue leftCont">{{item.receiverDetailAddr}}</span>
                                        </div>
                                        <div class="leftLable">
                                            <span>单量：</span>
                                            <span class="leftValue">{{item.transportCount}}</span>
                                        </div>
                                        <div class="leftLable">
                                            <span>预计里程：</span>
                                            <span class="leftValue">{{item.totalMileage}}</span>
                                        </div>
                                        <div class="leftLable">
                                            <span>发车单号：</span>
                                            <span class="leftValue">{{item.dispatchNo}}</span>
                                        </div>
                                        <div class="leftLable">
                                            <span>发车时间：</span>
                                            <span class="leftValue">{{item.dispatchTime}}</span>
                                        </div>
                                        <div class="leftLable">
                                            <span>预计到达时间：</span>
                                            <span class="leftValue">{{item.expectEndTime}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>

                <div class="contenRight" v-if="isHide">
                    <div class="contentImg">
                        <div class="backdrop">
                            <img src="@/assets/Group_2.png" alt="">
                        </div>
                        <span class="contentSpan">不好意思，暂无行车轨迹的信息</span>
                    </div>
                </div>
                <div id="contenRight" v-if="isShow">
                    <baidu-map
                        ref="baiduMap"
                        class="bm-view"
                        :center="center"
                        :zoom="zoom"
                        :scroll-wheel-zoom="true"
                        @ready="handleReady">
                        <bm-marker v-for="marker in points" :key="marker.id" :icon="marker.icon ? {url: marker.icon,  size: {width: 28, height: 50}} : ''"
                            :position="{lng: marker.geo.lng, lat: marker.geo.lat}"
                            @mouseover="markerDetail(marker, $event)" @mouseout="markerInfoHidden($event)" @click="ponitClickLine(marker)">
                        </bm-marker>
                        <bm-marker v-for="marker in morePoints" :key="marker.id" :icon="marker.icon ? {url: marker.icon,  size: {width: 28, height: 50}} : ''"
                            :position="{lng: marker.geo.lng, lat: marker.geo.lat}"
                            @mouseover="markerDetail(marker, $event)" @mouseout="markerInfoHidden($event)" @click="ponitClickLine(marker)">
                        </bm-marker>
                        <bm-polyline :path="polylinePath" stroke-color="#18a45b" :stroke-opacity="0.8" :stroke-weight="6"></bm-polyline>
                        <bm-polyline :path="morePointsPath" stroke-color="#18a45b" :stroke-opacity="0.8" :stroke-weight="6"></bm-polyline>
                        <bm-polyline :path="clickPointArrPath" stroke-color="#f4b0ba" :stroke-opacity="0.8" :stroke-weight="6"></bm-polyline>
                        <bm-geolocation
                            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
                            :showAddressBar="true"
                            :autoLocation="true"
                        ></bm-geolocation>
                        <!-- 街，市，省，国 -->
                        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                        <bm-info-window :position="pointInfoPosition" title="站点信息" :show="infoShow"
                            :offset="{width: 14, height: -12}">
                            <div v-html="ponitInfoContent"></div>
                        </bm-info-window>
                        <bm-overlay ref="distance" :class="{sample: true, distance}" pane="labelPane" v-if="distanceShow" @draw="draw">
                            <div>{{distance}}km</div>
                        </bm-overlay>
                    </baidu-map>
                </div>
            </div>
        </el-main>
    </Paper>
</template>

<script>
import Paper from '@/components/core/paper/Paper';
import mSearchList from '@/components/otpPanel/mSearchList';
import config from './trafficTrajectory.json';
import { getTrafficLists, getTrajectoryLists } from '../../../api/trafficTrajectory';
import formatTime from '@/utils/common.js';
export default {
    name: 'trafficTrajectory',
    components: { Paper, mSearchList },
    data() {
        return {
            polylinePath: [],
            currentIdx: 0,
            show: false,
            isHide: true,
            isShow: false,
            searchId: 'search_table1_query',
            searchList: config.searchList,
            config: config,
            searchTotalTitle: config.searchTotalTitle,
            searchSetTitle: config.searchTotalTitle,
            center: { lng: 105.000, lat: 38.000 },
            zoom: 12,
            current: 'aa',
            currentIndex: 'aaa',
            tabItems: [],
            // 途径点
            points: [],
            tabOneArrs: [],
            tabTwoArrs: [],
            ontheway: 0,
            overdue: 0,
            trafficListsPage: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            morePoints: [],
            morePointsPath: [],
            polylinePoint: [],
            mianLoading: false,
            infoShow: false,
            pointInfoPosition: {},
            ponitInfoContent: '',
            clickPointArr: [],
            clickPointArrPath: [],
            distanceShow: false,
            distance: '',
            pointsPlayback: [],
            polylinePlayback: []
        };
    },
    methods: {
        load(val, type) {
            this.$refs.search.changeLoading(true);
            this.mianLoading = true;
            if (!type) this.trafficListsPage.pageNo = 1;
            this.currentIdx = 0;
            this.current = '';
            this.isHide = true;
            this.isShow = false;
            const searchData = this.$refs.search.searchData;
            const params = {
                dispatchNo: searchData.dispatchNo,
                vehicleCard: searchData.vehicleCard,
                // dispatchStatus: 40,
                beginDate: searchData.dispatchTime ? formatTime.formatDateTime(searchData.dispatchTime[0]) : '', // 开始时间
                endDate: searchData.dispatchTime ? formatTime.formatDateTime(searchData.dispatchTime[1]) : '', // 结束时间
                orderBy: 'dispatchTime',
                ...val,
                ...this.trafficListsPage
            };
            getTrafficLists(params).then(res => {
                this.$refs.search.changeLoading(false);
                this.mianLoading = false;
                if (res && res.data) {
                    this.tabOneArrs = [];
                    this.tabTwoArrs = [];
                    var scrollArr = [];
                    const data = res.data;
                    this.trafficListsPage.total = data.pagingData.totalCount;
                    this.ontheway = data.ontheway;
                    this.overdue = data.overdue;
                    scrollArr = data.pagingData.list.map((item, index) => {
                        item.icon = require('@/assets/cheliang.png');
                        item.rate = '装载率';
                        item.vehicleCard = data.pagingData.list[index].vehicleCard; // 车牌号
                        item.className = (data.pagingData.list[index].loadRate * 100) >= 80 ? 'fontGreenColor' : 'fontRedColor';
                        item.efficiency = `${(data.pagingData.list[index].loadRate * 100).toFixed(2)}` + '%'; // 百分比
                        if (item.typeFlag === '1') {
                            this.tabOneArrs.push(item);
                        } else if (item.typeFlag === '2') {
                            this.tabTwoArrs.push(item);
                        } else if (item.typeFlag === '1,2') {
                            this.tabOneArrs.push(item);
                            this.tabTwoArrs.push(item);
                        }
                        return item;
                    });
                    if (type) {
                        this.tabItems.push.apply(this.tabItems, scrollArr);
                    } else {
                        this.tabItems = scrollArr;
                    }
                }
            }).catch(() => {
                this.$refs.search.changeLoading(false);
                this.mianLoading = false;
            });
        },
        // 查询行车轨迹(地图)
        loadGetSearchChange (item) {
            this.mianLoading = true;
            this.morePoints = [];
            this.morePointsPath = [];
            let transportStartPointsByTime = [];
            let transportEndPointsByTime = [];
            const transportEndPointsNoTime = [];
            const transportStartPointsNoTime = [];
            this.polylinePath = [];
            this.clickPointArr = [];
            this.clickPointArrPath = [];
            this.distanceShow = false;
            // this.pointsPlayback = [];
            // this.polylinePlayback = [];
            const params = {
                dispatchNo: this.$route.params.dispatchNo ? this.$route.params.dispatchNo : item.dispatchNo,
                task: '',
                type: '20'
            };
            getTrajectoryLists(params).then(res => {
                this.mianLoading = false;
                res.data.transportList.map(item => {
                    if (item.actualArriveDate) {
                        transportStartPointsByTime.push({
                            id: item.id + '装',
                            time: item.actualArriveDate,
                            icon: require('@/assets/gj_zhuang.png'),
                            geo: { lng: item.startLng, lat: item.startLat }
                        });
                    } else if (item.loadDate) {
                        transportStartPointsByTime.push({
                            id: item.id + '装',
                            time: item.loadDate,
                            icon: require('@/assets/gj_zhuang.png'),
                            geo: { lng: item.startLng, lat: item.startLat }
                        });
                    } else {
                        transportStartPointsNoTime.push({
                            id: item.id + '装',
                            icon: require('@/assets/gj_zhuang.png'),
                            geo: { lng: item.startLng, lat: item.startLat }
                        });
                    }
                    if (item.arrivalTime) {
                        transportEndPointsByTime.push({
                            id: item.id + '卸',
                            time: item.arrivalTime,
                            icon: require('@/assets/gj_xie.png'),
                            geo: { lng: item.endLng, lat: item.endLat }
                        });
                    } else if (item.electronicTime) {
                        transportEndPointsByTime.push({
                            id: item.id + '卸',
                            time: item.electronicTime,
                            icon: require('@/assets/gj_xie.png'),
                            geo: { lng: item.endLng, lat: item.endLat }
                        });
                    } else {
                        transportEndPointsNoTime.push({
                            id: item.id + '卸',
                            icon: require('@/assets/gj_xie.png'),
                            geo: { lng: item.endLng, lat: item.endLat }
                        });
                    }
                });
                res.data.pointList.map(item => {
                    if (+item.trackingSource === 1) {
                        this.morePoints.push({
                            id: item.id + '直',
                            icon: require('@/assets/gj_ztbao.png'),
                            geo: { lng: item.longitude, lat: item.latitude }
                        });
                    } else if (+item.trackingSource === 2) {
                        this.morePoints.push({
                            id: item.id + '微',
                            icon: require('@/assets/gj_wechat.png'),
                            geo: { lng: item.longitude, lat: item.latitude }
                        });
                    } else if (+item.trackingSource === 3) {
                        this.morePoints.push({
                            id: item.id + '卡',
                            icon: require('@/assets/gj_xhka.png'),
                            geo: { lng: item.longitude, lat: item.latitude }
                        });
                    }
                });
                this.morePoints.forEach(item => {
                    this.morePointsPath.push(item.geo);
                });
                transportStartPointsByTime = transportStartPointsByTime.sort(function(a, b) {
                    return a.time > b.time ? 1 : -1;
                });
                transportEndPointsByTime = transportEndPointsByTime.sort(function(a, b) {
                    return a.time > b.time ? 1 : -1;
                });
                this.points = transportStartPointsByTime.concat(transportStartPointsNoTime).concat(transportEndPointsByTime).concat(transportEndPointsNoTime);
                if (this.points.length > 0) {
                    this.center.lng = this.points[0].geo.lng;
                    this.center.lat = this.points[0].geo.lat;
                } else {
                    this.center.lng = 113.216596;
                    this.center.lat = 22.913121;
                }
                this.polylinePoint = transportStartPointsByTime.concat(transportEndPointsByTime);
                this.polylinePoint.forEach(item => {
                    this.polylinePath.push(item.geo);
                });

                // 装卸货点轨迹回放
                // var pointsI = 0;
                // var polylineI = 0;
                // var pointsTimer = setInterval(() => {
                //     this.center.lng = this.points[pointsI].geo.lng;
                //     this.center.lat = this.points[pointsI].geo.lat;
                //     this.pointsPlayback.push(this.points[pointsI]);
                //     pointsI++;
                //     if (pointsI > this.points.length - 1) {
                //         clearInterval(pointsTimer);
                //     }
                // }, 1000);
                // var polylineTimer = setInterval(() => {
                //     this.polylinePlayback.push(this.polylinePath[polylineI]);
                //     polylineI++;
                //     if (polylineI > this.polylinePath.length - 1) {
                //         clearInterval(polylineTimer);
                //     }
                // }, 1000);
            }).catch(() => {
                this.mianLoading = false;
            });
        },
        // 查询
        searchChange(data) {
            if (data.dispatchTime !== null && data.dispatchTime !== '') {
                data.beginDate = formatTime.formatDateTime(data.dispatchTime[0]); // 发车时间
                data.endDate = formatTime.formatDateTime(data.dispatchTime[1]);
            } else {
                data.beginDate = ''; // 开始时间
                data.endDate = ''; // 结束时间
            }
            // data.dispatchStatus = 40;
            this.current = '';
            this.isHide = true;
            this.isShow = false;
            this.load(data);
        },
        // 点击左边每一项查询地图站点信息
        tabClick(item, index) {
            this.current = index;
            this.isShow = true;
            this.isHide = false;
            this.loadGetSearchChange(item);
        },
        // 在途 逾期
        contentTitleClick(indexValue) {
            this.current = '';
            this.isHide = true;
            this.isShow = false;
            this.currentIdx = indexValue;
            this.tabItems = indexValue === 1 ? this.tabOneArrs : this.tabTwoArrs;
        },
        // 地图加载
        handleReady({ BMap, map }) {
            this.BMap = BMap;
            this.map = map;
        },
        markerDetail(point, e) {
            this.infoShow = true;
            this.pointInfoPosition = { lng: point.geo.lng, lat: point.geo.lat };
            this.ponitInfoContent = `<div>经度：${point.geo.lng};</div><div>维度：${point.geo.lat};</div>`;
        },
        markerInfoHidden(e) {
            this.infoShow = false;
        },
        ponitClickLine(point) {
            this.clickPointArrPath = [];
            this.clickPointArr.push(point);
            if (this.clickPointArr.length > 2) {
                this.clickPointArr.shift();
            }
            this.clickPointArr.forEach(item => {
                this.clickPointArrPath.push(item.geo);
            });
            if (this.clickPointArrPath.length >= 2) {
                const pointA = new this.BMap.Point(this.clickPointArrPath[0].lng, this.clickPointArrPath[0].lat);
                const pointB = new this.BMap.Point(this.clickPointArrPath[1].lng, this.clickPointArrPath[1].lat);
                this.distance = (this.map.getDistance(pointA, pointB) / 1000).toFixed(2);
                this.distanceShow = true;
                this.$nextTick(() => {
                    this.drawPosition(document.querySelector('.distance'));
                });
            }
        },
        draw({ el }) {
            this.drawPosition(el);
        },
        drawPosition(el) {
            const lng = (+this.clickPointArrPath[0].lng + (+this.clickPointArrPath[1].lng)) / 2;
            const lat = (+this.clickPointArrPath[0].lat + (+this.clickPointArrPath[1].lat)) / 2;
            const pixel = this.map.pointToOverlayPixel(new this.BMap.Point(lng, lat));
            el.style.left = pixel.x - 60 + 'px';
            el.style.top = pixel.y - 20 + 'px';
        },
        handleScroll(event) {
            // let target = event.target;
            // if (target.scrollTop && (Math.ceil(target.scrollTop) + target.clientHeight) >= target.scrollHeight) {
            //     if (this.tabItems.length < this.trafficListsPage.total) {
            //         this.trafficListsPage.pageNo++;
            //         this.load({}, true);
            //     }
            // }
        }
    },
    mounted() {
        this.$refs.search.searchData.dispatchNo = this.$route.params.dispatchNo;
        // this.load();
    },
    beforeRouteEnter (to, from, next) {
        if (from.path === '/dispatch-order' || from.path === '/order-manage/task-detail' || from.path === '/dispatch-order/dispatch-order-detail' ||
            from.path === '/distribute/vehicle-management') {
            next(vm => {
                if (vm.$route.params.dispatchNo) {
                    vm.$refs.search.searchData.dispatchNo = vm.$route.params.dispatchNo;
                    vm.$refs.search.searchData.dispatchTime = '';
                    vm.load();
                }
            });
        } else {
            next();
        }
    }
};
</script>
<style lang='less'>
@import "./trafficTrajectory.less";
</style>