<template>
    <baidu-map
    :center="config.center"
    :zoom="config.zoom"
    :scroll-wheel-zoom="true"
    :dragging="config.dragging"
    @ready="handleReady"
    @load="handleLoad"
    @dragging="dragging"
    @dragend="dragend"
    @moveend="moveend"
    @moving="moving"
    @zoomend="zoomend"
    ref="baiduMap">
        <slot></slot>
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true" :address="address"></bm-geolocation>
    </baidu-map>
</template>
<script>
export default {
    props: {
        config: {
            type: Object,
            default() {
                return {
                    zoom: 15,
                    center: { lng: 113.216523, lat: 22.91303 }
                };
            }
        }
    },
    methods: {
        handleReady({ BMap, map }) {
            this.BMap = BMap;
            this.map = map;
            this.$emit('ready', { BMap: BMap, map: map });
        },
        handleLoad(val) {
            this.$emit('map-load', val);
        },
        dragging({ type, target, pixel, point }) {
            this.$emit('dragging', { type, target, pixel, point });
        },
        dragend({ type, target, pixel, point }) {
            this.$emit('dragend', { type, target, pixel, point });
        },
        moveend({ type, target, pixel, point }) {
            this.$emit('moveend', { type, target, pixel, point });
        },
        moving({ type, target, pixel, point }) {
            this.$emit('moving', { type, target, pixel, point });
        },
        zoomend({ type, target }) {
            this.$emit('zoomend', { type, target });
        },
        handleMarker(value) {
            this.analysisSite(value.point, (res) => {
            });
        },
        getCNSite(lng, lat) {},
        setPoi(Point, site) {
            const local = this.BMap.LocalSearch(Point, {
                renderOptions: { map: Point }
            });
            local.search(site);
        },
        analysisSite(point, cb) {
            const myGeo = new this.BMap.Geocoder();
            myGeo.getLocation(point, function(result) {
                if (result) {
                    cb(result);
                } else {
                    cb(null);
                }
            });
        },
        analysisLocal(city, site) {
            const myGeo = new this.BMap.Geocoder();
            return new Promise((resolve, reject) => {
                myGeo.getPoint(site, function(point) {
                    if (point) {
                        resolve(point);
                    } else {
                        resolve(null);
                    }
                }, city);
            });
        },
        addMarker(point) {
            const mk = new this.BMap.Marker(point);
            this.map.addOverlay(mk);
            this.map.panTo(point);
        },
        removeMarker() {
            this.map.clearOverlays();
        },
        markerClick(point) {
            const self = this;
            const marker = new this.BMap.Marker(point);
            this.removeMarker();
            this.map.addOverlay(marker);
            this.map.panTo(point);
            marker.addEventListener('click', function (e) {
                self.analysisSite(point, (val) => {
                    const content = `<table><tr><td> 地址：${val.address}</td></tr><tr><td> 坐标：${val.point.lng},${val.point.lat}</td></tr></table>`;
                    const infowindow = new self.BMap.InfoWindow(content);
                    this.openInfoWindow(infowindow);
                });
            });
        }
    },
    data () {
        return {
            nearby: {
                center: {
                    lng: 113.216596,
                    lat: 22.913121
                },
                radius: 500
            },
            marker: [],
            index: null
        };
    },
    computed: {
        address: {
            set(val) {
                const { city, district, province, street } = val.addressComponents;
                this.config.target = province + '/' + city + '/' + district;
                if (street) {
                    this.config.target += '/' + street;
                }
                this.config.currentPointInfo = Object.assign({}, val);
            },
            get() {
                return this.config.target;
            }
        }
    }
};
</script>
<style lang="less">
 .anchorBL {
     display: none;
 }
</style>