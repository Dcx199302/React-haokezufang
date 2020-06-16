import React from 'react';

import ReactDOM from 'react-dom';
import App from './App';
// 导入代理商简化 redux 使用
import { Provider } from 'react-redux';
// 导入仓库
import store from './store/index';

ReactDOM.render(
    // 由代理商管理所有仓库数据
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
