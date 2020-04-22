import Vue from 'vue';
import VueI18n from 'vue-i18n';
// mui
import zhLocale from 'element-ui/src/locale/lang/zh-CN';
import enLocale from 'element-ui/src/locale/lang/en';
import jpLocale from 'element-ui/src/locale/lang/ja';
// 自定义
import indexLang from './modules/index/index';
import devLang from './modules/developer/index';
import systemLang from './modules/system/index';
import componentsLang from './components/index';
import otpLang from './modules/otp/index';
import gisLang from './modules/gis/index';
import bmsLang from './modules/bms/index';

export default {
    initLanguage(userLang) {
        // 用户设置的语言>浏览器的语言>默认语言
        const navLang = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
        const localLang = (navLang === 'zh-CN' || navLang === 'en-US' || navLang === 'ja-JP') ? navLang : false;
        const lang = userLang || localLang || 'zh-CN';
        Vue.use(VueI18n);
        return new VueI18n({
            locale: lang,
            messages: {
                'zh-CN': Object.assign({}, { siteIndex: indexLang.zh }, { developer: devLang.zh },
                    { system: systemLang.zh }, { components: componentsLang.zh }, zhLocale,
                    { otp: otpLang.zh }, { gis: gisLang.zh }, { bms: bmsLang.zh }),
                'en-US': Object.assign({}, { siteIndex: indexLang.en }, { developer: devLang.en },
                    { system: systemLang.en }, { components: componentsLang.en }, enLocale,
                    { otp: otpLang.en }, { gis: gisLang.zh }, { bms: bmsLang.zh }),
                'ja-JP': Object.assign({}, { siteIndex: indexLang.ja }, { developer: devLang.ja },
                    { system: systemLang.ja }, { components: componentsLang.ja }, jpLocale,
                    { otp: otpLang.js }, { gis: gisLang.zh }, { bms: bmsLang.zh })
            }
        });
    }
};
