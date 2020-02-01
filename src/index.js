import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { ConfirmationDialogProvider } from './component/dialog'

import * as serviceWorker from './serviceWorker';
import store from "./core"

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider>
            <ConfirmationDialogProvider>
                <App />
            </ConfirmationDialogProvider>
        </SnackbarProvider>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
