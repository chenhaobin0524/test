export default {
    route: {
        index_page: '首页',
        help: '帮组',
        mpanel: '常用面板',
        table_selector: '表格选择',
        button_authority: '认证按钮',
        multi_language: '多语言',
        not_found: '404页面'
    },
    multiLanguage: {
        desc: `<p>Midea-admin支持中文、英文、日语三种语言的国际化，分为两部分：</p>
                <br>
                <h3>1、后端配置的多语言</h3>
                <br>
                <p>主要使用场景是菜单多语言的配置，添加菜单的时候菜单名称可以输入中文、英文和日语，配置好后切换语言的时候，菜单就会自动变为你设置的语种。</p>
                <br>
                <h3>2、前端配置的多语言</h3>
                <br>
                <p>前端多语言的配置在项目根目录的scr/lang目录下，components文件夹配置的是公用组件的多语言信息，modules配置的是模块下的多语言信息，
                具体配置可参考框架内已有的多语言配置。</p>
                <br>
                <h4>备注：本框架只对菜单、公用组件以及本页面进行了国际化配置，其他页面没有做国际化。</h4>`
    }
};
