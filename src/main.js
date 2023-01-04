import { createApp } from 'vue'
import App from './App.vue'
import router from "./Router/index";
import { createPinia } from "pinia";
import Antd from 'ant-design-vue';

import 'ant-design-vue/dist/antd.css';
import 'ant-design-vue/es/message/style/css';
import './style.css'

createApp(App).use(router).use(createPinia()).use(Antd).mount('#app')
