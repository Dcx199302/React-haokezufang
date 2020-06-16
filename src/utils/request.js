/* 
  目标：封装 axios 库
*/
import axios from 'axios';
import { Toast } from 'antd-mobile';

/*
  优化方向：请求路径过于繁琐，每次都要 http://157.122.54.189:9060  +  /area/hot
  以前的写法设置统一请求基地址：
    axios.defaults.baseURL = 'http://157.122.54.189:9060';
*/

// 大项目场景：
//      50 个接口请求来自  http://www.baidu.com
//      60 个接口请求来自  http://www.qq.com
// 把默认路径设置成哪个都不太合适。
// 解决方案：创建多个 axios 对象，不同的请求对象的基地址不同。

// export const baseURL = 'http://157.122.54.189:9060';
export const baseURL = 'https://api-haoke-web.itheima.net';
export const request = axios.create({ baseURL });

// 请求计数器
let ajaxCount = 0;
// 添加请求拦截器 - 添加 loading
request.interceptors.request.use(
    function (config) {
        // 请求的时候计数器加1
        ajaxCount++;
        // Toast 提示组件通过 JS API 调用
        Toast.loading('疯狂加载中...', 0);
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 添加响应拦截器 - 隐藏 loading
request.interceptors.response.use(
    function (response) {
        // 请求完成后计数器就减1
        ajaxCount--;
        // 如果计数器减少为 0
        if (ajaxCount === 0) {
            // 所有请求都完成，就隐藏提示框
            Toast.hide();
        }
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);
