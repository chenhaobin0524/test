export default {
    route: {
        'index_page': '首页',
        help: '帮组',
        mpanel: '常用面板',
        table_selector: '表格选择',
        button_authority: '认证按钮',
        multi_language: '多语言',
        not_found: '404页面'
    },
    multiLanguage: {
        desc: `<p>Midea-admin supports the internationalization of Chinese, English and Japanese in two parts：</p>
                <br>
                <h3>1、Multilingualism in backend configuration</h3>
                <br>
                <p>The main use scenario is the multi-language configuration of menus. When adding menus, the menu name can be input into Chinese,
                English and Japanese. When the language is switched after configuration, the menu will automatically change into the language you set up.</p>
                <br>
                <h3>2、Multilingualism in frontend configuration</h3>
                <br>
                <p>The frontend multi-language configuration is in the scr/lang directory of the project root directory.
                The components folder configures the multi-language information of the common components,
                while the modules configure the multi-language information of the modules.
                The specific configuration can refer to the multi-language configuration already existing in the framework.</p>
                <br>
                <h4>Note: This framework only configures menus, public components and this page internationally, while other pages are not internationalized.</h4>`
    }
};
