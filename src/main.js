import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Mount the Vue application and load the local stylesheet.
createApp(App).mount('#app')

// Cache the application shell so saved content can be opened offline.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
