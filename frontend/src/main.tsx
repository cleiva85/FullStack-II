import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilos.css';
import App from './App.tsx';
import { SesionProvider } from './context/SesionContext.tsx';
import { CarritoProvider } from './context/CarritoContext.tsx';
import { AvisoProvider } from './context/AvisoContext.tsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SesionProvider>
        <CarritoProvider>
          <AvisoProvider>
            <App />
          </AvisoProvider>
        </CarritoProvider>
      </SesionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
