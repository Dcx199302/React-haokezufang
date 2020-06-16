// 解构创建仓库的方法
import { createStore } from 'redux';

// 导入仓库管理员
import reducer from './reducer';

// 创建仓库并传入管理员
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
