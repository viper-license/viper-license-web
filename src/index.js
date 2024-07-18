import React from "react";
import ReactDOM from "react-dom/client";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";
import CacheManager from "./CacheManager";

Sentry.init({
  dsn: "https://078f30d77333f13ca5076e7739039327@o4505562117439488.ingest.us.sentry.io/4507257796362240",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/viper-license\.github\.io\/viper-license-web/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

function isVersionUpdated() {
  const cached = CacheManager.readVersion();
  const latest = process.env.REACT_APP_BUILD_TIMESTAMP;
  if (!cached || !latest) {
    //本地无缓存版本号或者本地无构建号，认为是更新
    CacheManager.saveVersion(latest);
    console.log(`version updated v-${latest}`);
    return true;
  }
  console.log(`release v-${latest}`);
  let ret = cached !== latest;
  if (ret) {
    console.log(`version updated v-${latest}`);
    CacheManager.saveVersion(latest);
  }
  return ret;
}

global.isVersionUpdated = isVersionUpdated();

// i18n 国际化
i18next.use(LanguageDetector).init({
  supportedLngs: ["zh", "en"],
  resources: {
    en: {
      translation: {
        click_to_download_license_file: "click to download",
        copy_to_copyboard: "Copy Text",
        title: "OpenSource License Generator",
        label_year: "Year",
        label_author: "Author",
        label_license: "License",
      },
    },
    zh: {
      translation: {
        click_to_download_license_file: "点击下载协议文件",
        copy_to_copyboard: "拷贝到剪贴板",
        title: "开源协议生成器",
        label_year: "年份",
        label_author: "版权人",
        label_license: "协议",
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
