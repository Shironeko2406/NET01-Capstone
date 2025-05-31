import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './Redux/Store.jsx';
import { MessageProvider } from './Context/MessageContext.jsx';
import { LoadingProvider } from './Context/LoadingContext.jsx';

createRoot(document.getElementById('root')).render(
    <MessageProvider>
        <LoadingProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </LoadingProvider>
    </MessageProvider>
);
