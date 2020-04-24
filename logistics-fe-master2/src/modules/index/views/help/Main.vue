<template>
    <mpanel :config="config">
        <div class="module">
            <h2>一、MUI</h2>
            <ol>
                <li>
                    MUI是基于UED标准打造的一套基于VUE的前端组件库，已内置于框架中，具体的组件使用说明请参考<a href="http://npm.midea.com:8888" target="_blank">MUI组件使用说明</a>
                </li>
            </ol>
        </div>
        <div class="module">
            <h2>二、业务组件</h2>
            <ol>
                <li><h3>1. mpanel（通用面板）</h3>
                </li>
                <li>
                    <p>mpanel是为了让业务系统有统一的视觉效果而开发的，只需要配置JSON文件就可以自动生成一个通用的视觉统一的页面，还支持按钮权限的配置，非常利于业务系统的快速开发。</p>
                </li>
                <li>
                    <p>示例：<a href="/#/components/mpanel" target="_blank">mpanel示例</a>（具体实现请参考框架内置代码：src/views/index/components/mpanel）</p>
                </li>
                <li></li>
                <li>
                    <h4>- mpanel props</h4>
                </li>
                <li>
                    <Table stripe :columns="mpanelData.props.columns" :data="mpanelData.props.data"></Table>
                </li>
                <li>
                    <hr />
                </li>
                <li></li>
                <li>
                    <h4>- mpanel events</h4>
                </li>
                <li>
                    <Table stripe :columns="mpanelData.events.columns" :data="mpanelData.events.data"></Table>
                </li>
                <li>
                    <hr />
                </li>
                <li></li>
                <li>
                    <h4>- mpanel slot</h4>
                </li>
                <li>
                    <Table stripe :columns="mpanelData.slot.columns" :data="mpanelData.slot.data"></Table>
                </li>
                <li>
                    <hr />
                </li>
                <li></li>
                <li>
                    <h4>- mpanel config</h4>
                </li>
                <li>
                    <pre v-html="mpanelconfigData">
          </pre>
                </li>
            </ol>
            <ol>
                <li><h3>2. table_selector（表格下拉选择）</h3>
                </li>
                <li>
                    <p>有些业务需求可能会涉及到这样的场景：需要从下拉框中选择1个或多个选项，但是选项值数据量太大，后端只能返回分页数据，而且需要展示更多的信息给用户做选择的参考，这样的场景普通的下拉列表已经无法满足需求，所以开发了这个组件。</p>
                </li>
                <li>
                    <p>示例：<a href="/#/components/table-selector" target="_blank">table_selector示例</a>（具体实现请参考框架内置代码：src/views/index/components/TableSelector.vue）</p>
                </li>
                <li></li>
                <li>
                    <h4>- table_selector props</h4>
                </li>
                <li>
                    <Table stripe :columns="tableSelectorData.props.columns" :data="tableSelectorData.props.data"></Table>
                </li>
                <li>
                    <hr />
                </li>
                <li></li>
                <li>
                    <h4>- table_selector events</h4>
                </li>
                <li>
                    <Table stripe :columns="tableSelectorData.events.columns" :data="tableSelectorData.events.data"></Table>
                </li>
            </ol>
        </div>
    </mpanel>
</template>
<script>
import mpanel from '@/components/awesome/page/mPanel';
import _config from './config.json';
import mpanelData from './data/mpanel.json';
import tableSelectorData from './data/table_selector.json';
import _mpanelconfigData from '../components/mpanel/config.json';

export default {
    name: 'help',
    components: {
        mpanel
    },
    data() {
        return {
            config: _config,
            mpanelData,
            tableSelectorData,
            mpanelconfigData: _mpanelconfigData
        };
    }
};

</script>
<style lang="less" scoped>
.module {
    padding-bottom: 12px;

    ol {
        padding-left: 32px;

        li {
            padding-top: 12px;
        }
    }

    p {
        text-indent: 2em;
    }
}

</style>
