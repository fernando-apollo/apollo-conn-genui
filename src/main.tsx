import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from '@/components/ui/provider';
import './index.css';
import './fonts.css';
import App from './App.tsx';
import { AppStateProvider } from '@/provider/appStateProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </Provider>
  </StrictMode>
);
