<template>
    <el-menu class='level1-menu' :name='currentMenuItem' :collapse='isCollapse' background-color="#262a2f">
        <template v-for='(item,i) in menus'>
            <el-menu-item :index="'index' + i" class="level1-item" :key="i">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.applicationName}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>
<script>
import resource from '../../../../../modules/system/api/ResourceAPI';
import request from '@/utils/http';
export default {
    name: 'Level1Menus',
    data() {
        return {
            isCollapse: true,
            currentMenuItem: [],
            menus: [],
            codeList: [],
            menuNum: 0
        };
    },
    mounted() {
        this.getMenuData();
    },
    methods: {
        handleItemClick(name) {
            this.currentMenuItem = name;
        },
        getMenuData() {
            const self = this;
            return request({
                url: '/api/appInfos',
                method: 'get',
                params: {
                    pageSize: 100,
                    pageNo: 1
                }
            }).then(res => {
                self.menus = res.data.list;
                self.currentMenuItem = self.menus.length > 0 ? self.menus[0].id : '';
                if (self.menus.length > 0) {
                    self.menus.map(data => {
                        self.codeList.push(data.applicationCode);
                    });
                }
                this.getMenuList();
            });
        },
        getMenuList() {
            const self = this;
            resource.getResources(self.codeList[self.menuNum]).then(res => {
                if (self.codeList.length > self.menuNum) {
                    self.menuNum++;
                    self.getMenuList();
                } else {
                    self.menuNum = 0;
                }
            });
        }
    }
};
</script>
<style lang='less'>
@fontColor: #818386;

.level1-menu {
    min-height: ~'calc(100vh - 51px)';
    font-size: 16px;
    border-top: 1px solid #494c50;
    padding-inline-start: 0;
    .level1-item {
        text-decoration: none;
        list-style: none;
        width: auto;
    }
}
</style>
