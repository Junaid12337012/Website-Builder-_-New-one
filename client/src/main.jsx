import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

console.log('[main] starting app')
const rootEl = document.getElementById('root')
if (!rootEl) {
  console.error('[main] #root element not found in index.html')
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
