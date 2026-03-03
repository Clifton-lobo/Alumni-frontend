import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { registerSW } from 'virtual:pwa-register'

import './index.css'
import App from './App.jsx'
import store from './store/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster richColors />
    </Provider>
  </BrowserRouter>,
)

registerSW({
  onNeedRefresh() {
    console.log('New version available.')
  },
  onOfflineReady() {
    console.log('App ready for offline use.')
  }
})