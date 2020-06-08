// 引入rudex创建方法
import { createStore } from 'redux';

// 引入reducer创建管理员
import reducer from './reducer';

const store = createStore(reducer);

export default store;
