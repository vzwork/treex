import { initializeApp } from "firebase/app";
const { initializeAppCheck, ReCaptchaEnterpriseProvider } = require("firebase/app-check");

// vvv app setup vvv
const firebaseConfig = {
  apiKey: "AIzaSyB4_4075Md9QlnKfrfRe8Uvb31ZWY5D8os",
  authDomain: "tree-x.firebaseapp.com",
  databaseURL: "https://tree-x-default-rtdb.firebaseio.com",
  projectId: "tree-x",
  storageBucket: "tree-x.appspot.com",
  messagingSenderId: "913227203137",
  appId: "1:913227203137:web:06e2301224b551bc75bcc0",
  measurementId: "G-2BMT70LMDD"
};
const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LeX4AAhAAAAAEEsPhPOZ5p39Vbk7GBhTDYGFxoW'),
  isTokenAutoRefreshEnabled: true
})
// ^^^ app setup ^^^

export default app;