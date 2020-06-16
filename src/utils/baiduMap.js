// 百度地图 map.js
/* 
  封装的百度地图定位。
*/
const getBaiduCity = () => {
    // 通过 Promise 方式封装百度地图定位获取
    return new Promise((resolve, reject) => {
        // 调用百度地图浏览器定位接口
        // 注意事项：全局变量需要添加 window.
        const geolocation = new window.BMap.Geolocation();
        geolocation.getCurrentPosition(function (res) {
            if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
                // 成功失败调用 resolve 给 then 的形参传递数据
                resolve(res.address);
            } else {
                // 失败调用 reject
                reject(res);
            }
        });
    });
};

export default getBaiduCity;
