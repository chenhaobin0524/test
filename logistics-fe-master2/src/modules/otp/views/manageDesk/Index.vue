<template>
    <div class="manage-desk">
        <ul class="list-box" v-if="loadoutflag">
            <li class="list-item" :style="{display: elementlist.length > 0 ? 'inherit' : 'none'}" v-for="(item, index) in elementlist" :key="index" v-has="item.prop">
                <operatingCompletion :item="item" :sitecodestr="sitecodestr" :isalluserData="isalluserData" @closeUp="closeUp" v-if="item.prop === '01000001'"></operatingCompletion>
                <orderTrend :item="item" :sitecodestr="sitecodestr" :isalluserData="isalluserData" @closeUp="closeUp" v-if="item.prop === '01000002'"></orderTrend>
                <message :item="item" @closeUp="closeUp" v-if="item.prop === '01000003'"></message>
                <warning
                    :refresh="refresh"
                    :item="item"
                    :sitecodestr="sitecodestr"
                    :isalluserData="isalluserData"
                    @closeUp="closeUp"
                    v-if="item.prop === '01000004' || item.prop === '01000005' || item.prop === '01000006'">
                </warning>
                <indicators
                    :refresh="refresh"
                    :item="item"
                    :sitecodestr="sitecodestr"
                    :isalluserData="isalluserData"
                    @closeUp="closeUp"
                    v-if="item.prop === '01000007' || item.prop === '01000008' || item.prop === '01000009'">
                </indicators>
            </li>
            <li class="list-item">
                <div class="item-body add-module" @click="addmoduleFn">+添加模块</div>
            </li>
        </ul>
        <el-dialog :visible.sync="showModal" title="选择显示模块" @close="showModal=false">
            <configuration :checkedList="checkedList" :selectAllColumns="modulecolumns" ref="showmodule" @getTableConfigList="getTableConfigList" @tableConfigClose="tableConfigClose"></configuration>
        </el-dialog>
    </div>
</template>
<script>
import operatingCompletion from './components/operatingCompletion.vue';
import orderTrend from './components/orderTrend.vue';
import message from './components/message.vue';
import warning from './components/warning.vue';
import indicators from './components/indicators.vue';
import configuration from '@/components/awesome/page/mPanel3/configuration-list';
import { mapGetters } from 'vuex';
import {
    userdataAuth, getList
} from './../../api/manaDesk.js';
export default {
    name: 'personManage',
    data() {
        return {
            refresh: false,
            changeWarningStatus: 'EA',
            meslist: [],
            msgItem: {},
            loadoutflag: false,
            sitecodestr: '',
            isalluserData: false,
            resourceCode: '',
            showModal: false,
            modulecolumns: [],
            colors: [
                { color: '#00BCBF', percentage: 50 },
                { color: '#F96C5F', percentage: 100 }
            ],
            elementlist: [],
            defalutPerm: ['01000001', '01000002', '01000003', '01000004', '01000005', '01000006', '01000007', '01000008', '01000009'],
            checkedList: '运配订单完成量,近30天运配订单趋势,消息,接单量预警（EA）,发货预警（m³）,签收预警（EA）,仓储指标,运配指标（2B）,运配指标（2C）'
        };
    },
    components: { configuration, operatingCompletion, orderTrend, message, warning, indicators },
    mounted() {
        this.elJurisdiction();
        userdataAuth(this.$store.getters.user.userCode).then((res) => {
            if (+res.code === 0) {
                let codelist = null;
                if (res.data === null || (Object.prototype.toString.call(res.data).slice(8, -1) === 'Array' && res.data.length === 0)) {
                    this.isalluserData = false;
                    codelist = JSON.stringify(['ALL']);
                } else {
                    const f = res.data.find(el => {
                        return el.dataCode === 'D20190621009';
                    });
                    if (!f) {
                        this.isalluserData = false;
                        codelist = JSON.stringify(['ALL']);
                    } else {
                        if (f.userDataAuths.length === 0) {
                            codelist = JSON.stringify(['ALL']);
                        } else {
                            const all = f.userDataAuths.find(el => {
                                return el.authCode === 'ALL';
                            });
                            if (all) {
                                this.isalluserData = true;
                            } else {
                                codelist = f.userDataAuths.map(el => {
                                    return el.authCode;
                                });
                            }
                        }
                    }
                }
                this.sitecodestr = Object.prototype.toString.call(codelist, this).slice(8, -1) === 'Array' ? JSON.stringify(codelist) : codelist;
            }
        });
    },
    methods: {
        makeData() {
            const btnPermissionsArr = this.$store.getters.btnPermissions;
            const listItem = [];
            this.ellist = [];
            if (btnPermissionsArr === undefined || btnPermissionsArr === null) {
                return false;
            }
            if (Object.prototype.toString.call(btnPermissionsArr).slice(8, -1) === 'Array' && btnPermissionsArr.length > 0) {
                btnPermissionsArr.forEach((item) => {
                    listItem.push(this.defalutPerm.find((el) => {
                        return el === item;
                    }));
                });
            }
            listItem.forEach((el) => {
                if (el === '01000001') {
                    this.ellist.push({
                        disabled: false,
                        prop: '01000001',
                        label: '运配订单完成量'
                    });
                } else if (el === '01000002') {
                    this.ellist.push({
                        disabled: false,
                        prop: '01000002',
                        label: '近30天运配订单趋势'
                    });
                } else if (el === '01000003') {
                    this.ellist.push({
                        disabled: false,
                        prop: '01000003',
                        label: '消息'
                    });
                } else if (el === '01000004') {
                    this.ellist.push({
                        disabled: false,
                        prop: '01000004',
                        label: '接单量预警（EA）'
                    });
                } else if (el === '01000005') {
                    this.ellist.push({
                        disabled: false,
                        prop: '01000005',
                        label: '发货预警（EA）'
                    });
                } else if (el === '01000006') {
                    this.ellist.push({
                        disabled: false,
                        prop: '01000006',
                        label: '签收预警（EA）'
                    });
                } else if (el === '01000007') {
                    this.ellist.push({
                        disabled: false,
                        prop: '01000007',
                        label: '仓储指标'
                    });
                } else if (el === '01000008') {
                    this.ellist.push({
                        disabled: false,
                        prop: '01000008',
                        label: '运配指标（2B）'
                    });
                } else if (el === '01000009') {
                    this.ellist.push({
                        disabled: true,
                        prop: '01000009',
                        label: '运配指标（2C）'
                    });
                }
            });
        },
        elJurisdiction() {
            this.makeData();
            this.modulecolumns = this.ellist;
            const menu = { subResources: JSON.parse(JSON.stringify(this.menus)) };
            this.deepMenu(menu);
            const tabelConfigName = [];
            const tabelConfigList = [];
            this.ellist.map((el) => {
                tabelConfigName.push(el.prop);
                tabelConfigList.push(el.label);
            });
            const pramas = {
                'configName': tabelConfigName.join(','),
                'configNameCn': tabelConfigList.join(','),
                'subjectType': 'person_work_otp',
                'moduleCode': this.resourceCode
            };
            getList.get(pramas).then(res => {
                if (+res.code === 0) {
                    if (res.data === null || res.data.configName === null || res.data.configName === undefined) {
                        this.elementlist = this.ellist;
                    } else {
                        const cgn = res.data.configName.split(',');
                        const cgnCn = res.data.configNameCn.split(',');
                        const arr = [];
                        for (let i = 0; i < cgn.length; i++) {
                            arr.push({
                                disabled: false,
                                label: cgn[i],
                                prop: cgnCn[i]
                            });
                        }
                        const newsortlist = [];
                        arr.forEach(el => {
                            newsortlist.push(this.ellist.find((ele) => {
                                return el.prop === ele.prop || el.label === ele.prop;
                            }));
                        });
                        const sortlist = [];
                        newsortlist.forEach((el, i) => {
                            if (el !== undefined) {
                                sortlist.push(el);
                            }
                        });
                        let finarr = [];
                        let checkedListName = '';
                        let modulecolumns = [];
                        if (sortlist.length === this.ellist.length) {
                            finarr = sortlist;
                            modulecolumns = sortlist;
                            finarr.forEach(el => {
                                checkedListName += el.label + ',';
                            });
                        } else {
                            const nolist = [];
                            this.ellist.forEach((el, i) => {
                                if (!(sortlist.indexOf(el) > -1)) {
                                    nolist.push(el);
                                }
                            });
                            finarr = [...sortlist, ...nolist];
                            modulecolumns = sortlist;
                            sortlist.forEach(el => {
                                checkedListName += el.label + ',';
                            });
                        }
                        checkedListName.substring(0, checkedListName.length - 1);
                        this.elementlist = modulecolumns;
                        this.modulecolumns = finarr;
                        this.checkedList = checkedListName;
                    }
                    setTimeout(() => {
                        this.loadoutflag = true;
                    }, 500);
                }
            });
        },
        deepMenu(node) {
            const nodes = [];
            if (node) {
                nodes.push(node);
                const childrens = node.subResources;
                if (childrens) {
                    for (let i = 0; i < childrens.length; i++) {
                        if (childrens[i].frontUrl === this.$route.path || (childrens[i].frontUrl === '/index' && this.$route.path === '/')) {
                            this.resourceCode = childrens[i].resourceCode;
                        } else {
                            this.deepMenu(childrens[i]);
                        }
                    }
                }
            }
        },
        getTableConfigList(e, j) {
            this.showModal = false;
            this.elementlist = [];
            const cgn = e.split(',') || [];
            const cgnCn = j.split(',') || [];
            const arr = [];
            for (let i = 0; i < cgn.length; i++) {
                if (cgn[0] === '') break;
                arr.push({
                    label: cgn[i],
                    prop: cgnCn[i],
                    disabled: false
                });
            }
            this.elementlist = arr;
            this.checkedList = e;
            const pramas = {
                'configName': e,
                'configNameCn': j,
                'subjectType': 'person_work_otp',
                'moduleCode': this.resourceCode
            };
            getList.post(pramas).then(() => {});
            this.refresh = true;
            setTimeout(() => {
                this.refresh = false;
            }, 500);
        },
        closeUp(code) {
            const proparr = this.elementlist.map(el => {
                return el.prop;
            });
            const prop = [];
            const label = [];
            const ellist = [...this.elementlist];
            ellist.splice(proparr.indexOf(code), 1);
            ellist.forEach((el) => {
                prop.push(el.prop);
                label.push(el.label);
            });
            const labelstr = label.join(',');
            const propstr = prop.join(',');
            this.getTableConfigList(labelstr, propstr);
        },
        tableConfigClose() {
            this.showModal = false;
        },
        addmoduleFn() {
            this.showModal = true;
        },
        updataShowBtn() {
            this.showDialog = false;
            window.open('https://kunp.midea.com/kunp2/', '_blank');
        }
    },
    computed: {
        ...mapGetters(['user', 'currentTenant', 'menus'])
    }
};
</script>

<style lang="less">
@import './styles/index.less';
</style>