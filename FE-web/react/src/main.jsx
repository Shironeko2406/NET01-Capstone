import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { MessageProvider } from './Context/MessageContext';
import { LoadingProvider } from './Context/LoadingContext';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';

createRoot(document.getElementById('root')).render(
    <MessageProvider>
        <LoadingProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </LoadingProvider>
    </MessageProvider>
);
