<template>
  <Paper>
    <el-input
        placeholder="请输入地址"
        prefix-icon="el-icon-search"
        v-model.trim="site"
        clearable
        id="suggestId"
        style="margin-right: 10px;width: 40%">
    </el-input>
    <el-button type="primary" @click="setSite" style="margin-left:10px;">定位</el-button>
    <div style="float:right;display: flex;align-items: center;">
        <el-checkbox v-model="checked" @change="isCheckedChang">是否显示区域</el-checkbox>
        <otpAllAddressSelect
            style="display: inline-block;width: 60%"
            :minLayers="3"
            v-model="addressSite"
            @getAddress="getAddressSite"
            v-show="true"
        ></otpAllAddressSelect>
    </div>
    <div class="map-wrapper">
        <m-map ref="map" style="height: 100%" :config="mapConfig" @ready="handleReady" @moveend="moveend" @zoomend="zoomend">
            <div v-show="showPolygon">
                <bm-polygon
                v-for="(path, index) of polygonObjs"
                :path="path.Polygon.coordinate"
                :key="'gon' + index"
                :fillColor="path.Polygon.fillColor"
                :stroke-opacity="0.6"
                :stroke-weight="2"
                strokeStyle="dashed"
                :massClear="true"
                :fillOpacity="0.1">
                </bm-polygon>
            </div>
        </m-map>
        <img src="./site.png" class="mapicon">
    </div>
    <otpAllAddressSelect
        class="address-content"
        :minLayers="4"
        v-model="address"
        @getAddress="getAddress"
        :disabled="true"
        ref="city"
    ></otpAllAddressSelect>
    <el-input class="w20" placeholder="longitude,latitude" v-model.trim="mapConfig.position">
        <template slot="prepend">当前坐标</template>
    </el-input>
    <el-button type="primary" style="margin-left:10px;" @click="updateCity" :disabled="closeState" :loading="updateLoading">坐标获取四级地址</el-button>
    <div style="overflow:hidden">
        <div style="float:left; margin-top: 10px;width: 80%">
            <div>
                <el-input
                class="w20"
                v-model="keywork"
                clearable
                style="margin-right:10px"
                placeholder="关键词条"
                @keyup.enter.native="addKeywork">
                <i class="el-icon-edit el-input__icon" slot="suffix"></i></el-input>
                <el-button @click="() => {keyworkList = []}" type="text" style="padding: 0">清空词条</el-button>
                <div class="role-box"
                    v-for="(item, keyIdx) in keyworkList"
                    :key="keyIdx">
                    <div class="role-item" :style="{ width: item.length * 15 + 'px'}">
                        <span class="content" v-text="item"></span>
                        <span class="close-button" @click="delKeywork(keyIdx)">×</span>
                    </div>
                </div>
            </div>
        </div>
        <div style="float:right">
            <el-button>取消</el-button>
            <el-button type="primary" @click="save" :disabled="closeState" :loading="loadingState">保存</el-button>
        </div>
    </div>
  </Paper>
</template>
<script>
import Paper from '@/components/core/paper/Paper';
import otpAllAddressSelect from '@/components/lots/otpCascader2';
import MMap from '@/components/gis/siteCorrection/mMap';
import { addSiteApi, correctionOrderApi, gisPolygonApi, getGisInfoApi } from './api';
export default {
    name: 'baseInfo',
    components: {
        Paper,
        MMap,
        otpAllAddressSelect
    },
    data() {
        return {
            site: '',
            addressSite: '',
            dragState: true,
            closeState: false,
            point: {
                lat: null,
                lng: null
            },
            address: [],
            orderNo: '',
            inOutType: '',
            customerAddress: {},
            mapConfig: {
                center: '',
                zoom: 15,
                target: {},
                position: '',
                currentPointInfo: {
                    surroundingPois: [{ title: '' }]
                }
            },
            keywork: '',
            keyworkList: [],
            addressList: {},
            map: null,
            BMap: null,
            checked: false,
            showPolygon: false,
            polygonObjs: [],
            loadingState: false,
            updateLoading: false
        };
    },
    methods: {
        handleReady({ BMap, map }) {
            const _this = this;
            this.BMap = BMap;
            this.map = map;
            if (this.site) {
                this.setSite();
            } else {
                const geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r) {
                    map.centerAndZoom(new BMap.Point(r.longitude, r.latitude), 15);
                    if (this.getStatus() === 0) {
                        _this.mapConfig.position = ``;
                    }
                }, { enableHighAccuracy: true });
            }
        },
        async setSite() {
            if (!this.site) return;
            this.mapConfig.position = '';
            const localResult = await this.$refs.map.analysisLocal(this.site.slice(0, 3), this.site);
            this.point = localResult || { lat: '', lng: '' };
            if (!localResult) {
                this.$message.warning('地址解析错误，请手动拖拽标准至准确的位置');
                return;
            }
            this.mapConfig.position = `${this.point.lng},${this.point.lat}`;
            this.$set(this.mapConfig, 'center', {
                lng: this.point.lng, lat: this.point.lat
            });
            this.map.centerAndZoom(this.point, 15);
            const addressResult = await gisPolygonApi({ region: `${this.point.lng} ${this.point.lat}` });
            if (!addressResult) return;
            this.address = this.initAddress(addressResult.data[0].code);
            await this.$refs.city.init(this.address);
            const jugeCityList = this.$refs.city.addressFormat(this.address);
            if (!jugeCityList[3]) {
                this.$message.warning('四级已停用');
            }
        },
        async save() {
            if (this.address.length !== 4) {
                this.$message.warning(`请补全四级地址`);
                return;
            }
            if (((+this.point.lng) !== (+this.mapCenter.lng) && (+this.point.lat) !== (+this.mapCenter.lat))) {
                this.$message.warning(`坐标地址已改变,请重新获取四级地址`);
                return;
            }
            this.loadingState = true;
            this.addressCn = this.$refs.city.addressFormat(this.address);
            const params = {
                lng: this.point.lng,
                lat: this.point.lat,
                keyWork: this.keyworkList.join(','),
                province: this.addressCn[0],
                city: this.addressCn[1],
                area: this.addressCn[2],
                country: this.addressCn[3],
                provinceCode: this.address[0],
                cityCode: this.address[1],
                areaCode: this.address[2],
                countryCode: this.address[3],
                address: this.site
            };
            // 走完gis请求再走纠错接口
            const result = await addSiteApi(params);
            if (result) {
                this.$message({
                    type: 'success',
                    message: '保存成功'
                });
            };
            this.loadingState = false;
            if (this.orderNo) {
                const addr = this.inOutType === 'IN' ? 'sendAddress' : 'receiveAddress';
                const param = {
                    orderNo: this.orderNo
                };
                param[addr] = this.address[this.address.length - 1];
                param[this.inOutType === 'IN' ? 'receiveAddress' : 'sendAddress'] = 'null';
                correctionOrderApi(param).then(res => {
                    if (res) {
                        this.$message.success('纠正成功');
                        this.$eventBus.$emit('closeTag', this.$route);
                        this.$router.push({ path: '/order-manage/order-center' });
                    }
                    this.loadingState = false;
                });
            }
        },
        isCheckedChang(val) {
            this.polygonObjs = [];
            this.map.clearOverlays();
            if (!val) return;
            if (this.addressSite.length !== 3) return;
            this.getPolygonList(val);
        },
        getSiteData(val) {
            this.addressList = Object.assign({}, val);
        },
        addKeywork() {
            if (this.keywork && this.keyworkList.length < 3) {
                this.keyworkList.push(this.keywork);
            } else {
                const msg = this.keywork ? (this.keyworkList.length >= 3 ? '关键词已超出限制' : '') : '关键词为空';
                this.$message.warning(`${msg}`);
            }
            this.keywork = '';
        },
        delKeywork(index) {
            this.keyworkList.splice(index, 1);
        },
        moveend({ type, target }) {
            this.mapCenter = this.$refs.map.map.getCenter();
            this.mapConfig.position = this.mapCenter.lng + ',' + this.mapCenter.lat;
        },
        zoomend({ type, target }) {
            this.mapCenter = this.$refs.map.map.getCenter();
            this.mapConfig.position = this.mapCenter.lng + ',' + this.mapCenter.lat;
        },
        updateCity() {
            this.updateLoading = true;
            this.mapConfig.position = this.mapConfig.position.replace(/，/g, ',');
            if (this.mapConfig.position.split(',').length !== 2) {
                this.$message.warning(`请输入正确的坐标格式：lng,lat`);
                this.updateLoading = false;
                return;
            }
            try {
                const [lng, lat] = this.mapConfig.position.split(',');
                this.point.lat = lat;
                this.point.lng = lng;
                gisPolygonApi({ region: `${lng} ${lat}` }).then(res => {
                    this.updateLoading = false;
                    this.address = [];
                    if (!res) return;
                    if (!res.data[0].code) {
                        this.$message.warning(`四级地址解析失败`);
                    };
                    this.address = this.initAddress(res.data[0].code);
                });
            } catch (error) {
                this.$message.warning(`当前坐标异常,请输入正确的坐标`);
                this.updateLoading = false;
            }
        },
        getAddress(val) {
            this.addressCn = val;
        },
        getAddressSite(val) {
            this.polygonObjs = [];
            this.map.clearOverlays();
            this.getPolygonList(this.checked);
        },
        initAddress(start) {
            const arr = [];
            arr[0] = start.slice(0, 3);
            arr[1] = start.slice(3, 5);
            arr[2] = start.slice(5, 7);
            arr[3] = start.slice(7, 10);
            arr.map((item, index) => {
                if (!item) {
                    arr.length = index;
                } else {
                    if (index > 0) {
                        arr[index] = arr[index - 1] + item;
                    }
                }
            });
            return arr;
        },
        coorList(list) {
            return list.map((el, i) => {
                const centerPoint = {
                    lng: el.centerPoint ? el.centerPoint.split(' ')[0] : null,
                    lat: el.centerPoint ? el.centerPoint.split(' ')[1] : null
                };
                const opts = {
                    position: centerPoint, // 指定文本标注所在的地理位置
                    offset: new this.BMap.Size(0, 0) // 设置文本偏移量
                };
                const label = new this.BMap.Label(el.name, opts);
                label.setStyle(this.labelstyleconfig);
                this.map.addOverlay(label);
                return {
                    label: label,
                    center: centerPoint,
                    content: el.name,
                    code: el.code,
                    version: el.version,
                    Polygon: {
                        coordinate: el.list,
                        fillColor: 'blue',
                        editing: false
                    },
                    id: el.id,
                    type: el.type,
                    source: el.source
                };
            });
        },
        getPolygonList(bool) {
            if (!bool) return;
            if (this.addressSite.length === 0) return;
            const params = {};
            params['provinceCode'] = this.addressSite[0] ? this.addressSite[0] : null;
            params['cityCode'] = this.addressSite[1] ? this.addressSite[1] : null;
            params['areaCode'] = this.addressSite[2] ? this.addressSite[2] : null;
            params['type'] = 'country';
            getGisInfoApi(params).then(res => {
                if (!res) return;
                this.showPolygon = true;
                this.polygonObjs = this.coorList(res.data.list);
            });
        }
    },
    mounted() {
        this.site = this.$route.params.address;
        this.orderNo = this.$route.params.orderNo;
        this.inOutType = this.$route.params.inOutType;
    },
    watch: {
        site: {
            handler(val) {
                this.closeState = !(val && val !== '');
            }
        }
    }
};
</script>
<style lang="less">
    .w20{
        width: 20%;
    }
    .el-cascader{
        width: 100%;
    }
    .role-box {
            display: inline-block;
            vertical-align: middle;
            position: relative;
            margin-left: 10px;
        .role-item {
            background-color: #F2F2F2;
            border: 1px solid #CCCCCC;
            border-radius: 4px;
            padding: 4px 10px;
            width: 50px;
            .content {
                height: 100%;
                width: 98px;
                font-size: 12px;
                color: #333333;
                text-align: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .close-button {
                    font-size: 12px;
                    width: 14px;
                    height: 14px;
                    color: #FEFEFE;
                    background-color: #C0C4CC;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 14px;
                    cursor: pointer;
                    position: absolute;
                    top: 8px;
                    right: 5px;
            }
        }
    }
    .address-content{
            display: inline-block;
            width:20%;
            margin-right: 10px;
    }
    .map-wrapper{
        position: relative;
        margin: 10px 0;
        height: calc(100vh - 210px);
        .mapicon{
            position: absolute;
            top: 45.5%;
            width: 30px;
            left: 49%;
        }
    }
</style>
