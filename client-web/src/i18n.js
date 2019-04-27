import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import resources from './locale';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources,
    fallbackLng: {
      'en-US': ['en'],
      'vi-VN': ['vi'],
      default: ['en'],
      },
    debug: false,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: ".", // we use "." for separate between nested key

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
