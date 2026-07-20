import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

// The application is intentionally kept close to the existing library project:
// create one Vue application, load global styles, and mount it to the HTML root.
createApp(App).mount('#app')
