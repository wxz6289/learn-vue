import { createApp, inject } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';
import './style.css'
// import App from './components/Test.vue';
import App from './App.vue'
import LogPlugin from './plugins/log'

const app = createApp(App)
app.provide('id', 0);

console.log(app, 'app');

const injected = app.runWithContext(() => inject('id'))

console.log("injected:", injected)

console.log('app.config:', app.config);
app.config.errorHandler = (err, instance, info) => {
  console.log('errorHandler: ', err, instance, info);
}

const pinia = createPinia();

function SecretPiniaPlugin(ctx) {
  console.log('ctx: ', ctx);
  return { secret: 'king' }
}

pinia.use(SecretPiniaPlugin);

pinia.use(() => ({hello: 'hello world'}))


app.use(LogPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
});

app.use(router);
app.use(pinia);
const app2 = app.mount('#app');
app.config.errorHandler = (e) => {
  console.error(e.message);
}

/*
const { createApp } = Vue;

const app = createApp({
  data() {
    return { count: 0 }
  }
});
app.mount('#app');
*/


