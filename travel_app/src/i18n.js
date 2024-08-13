import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "searchPlaceholder": "Enter city or country",
        "searchButton": "Search",
        "title": "WANDERWAYS"
      }
    },
    zh: {
      translation: {
        "searchPlaceholder": "输入城市或国家",
        "searchButton": "搜索",
        "title": "WANDERWAYS"
      }
    },
    zh_TW: {
      translation: {
        "searchPlaceholder": "輸入城市或國家",
        "searchButton": "搜尋",
        "title": "WANDERWAYS"
      }
    },
    ja: {
      translation: {
        "searchPlaceholder": "都市や国を入力してください",
        "searchButton": "検索",
        "title": "WANDERWAYS"
      }
    },
    ko: {
      translation: {
        "searchPlaceholder": "도시 또는 국가를 입력하세요",
        "searchButton": "검색",
        "title": "WANDERWAYS"
      }
    },
    es: {
      translation: {
        "searchPlaceholder": "Ingresa ciudad o país",
        "searchButton": "Buscar",
        "title": "WANDERWAYS"
      }
    }
  },
  lng: 'zh', // 初始语言
  fallbackLng: 'en', // 回退语言
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
