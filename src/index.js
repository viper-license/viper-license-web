import React from "react";
import ReactDOM from "react-dom/client";
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
  if (!ret) {
    console.log(`version updated v-${latest}`);
    CacheManager.saveVersion(latest);
  }
  return ret;
}

global.isVersionUpdated = isVersionUpdated();

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
