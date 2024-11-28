import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { UserProfileProvider } from './context/UserProfileContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    </BrowserRouter>
  </StrictMode>,
)