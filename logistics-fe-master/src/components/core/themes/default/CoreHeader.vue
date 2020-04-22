<template>
    <section class='header'>
        <div class="layout-header-bar">
            <el-row :gutter="10">
                <el-col :span="6">
                    <a href="/" class="logo"><img src="../../../../assets/kj-logo.png"/></a>
                    <el-dropdown class="service">
                        <span>{{this.text}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <a href="/order.html">
                                <el-dropdown-item name="order">查单系统</el-dropdown-item>
                            </a>
                            <a href="/network.html">
                                <el-dropdown-item name="bms">鹊桥</el-dropdown-item>
                            </a>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>

                <el-col :span="18" class="tools-and-user">
                    <Tools />
                </el-col>
            </el-row>
        </div>
    </section>
</template>
<style lang="less">
@import '../../../../styles/vars.less';

@headerHeight: 64px;

.header {
    height: @headerHeight;

    .layout-header-bar {
        padding: 0;
        background: @color-dark;
        color: #fff;
        border-bottom: 1px solid #dddee1;

        .logo {
            height: 40px;
            cursor: pointer;
            display: inline-block;
            vertical-align: middle;
            img{
                height: 36px;
                margin-left: 7px;
                display: inline-block;
            }
        }
        .service{
            color: #fff;
            margin-left: 20px;
        }
        .title {
            color: #fff;
            display: inline-block;
            font-size: 14px;
            margin-left: 20px;
        }
        .tools-and-user {
            text-align: right;
        }
        .system {
            height: @headerHeight;
            line-height: @headerHeight;

            .menus {
                display: inline-block;
                height: @headerHeight;
                width: auto;
            }
        }
    }
}

</style>
<script>
import Tools from './components/Tools.vue';

export default {
    data() {
        return {
            accordionMode: false,
            isCollapsed: true,
            text: ''
        };
    },
    created() {
        switch (window.location.pathname) {
        case '/order.html':
            this.text = '查单系统';
            break;
        case '/network.html':
            this.text = '鹊桥';
            break;
        default:
            this.text = '';
        }
    },

    props: ['collapse'],
    methods: {
        handleToggleClick() {
            this.$emit('on-toggle-click', 'default');
        }
    },
    computed: {
        rotateIcon() {
            return ['menu-icon', this.collapse ? 'rotate-icon' : ''];
        }
    },
    components: {
        Tools
    }
};

</script>
