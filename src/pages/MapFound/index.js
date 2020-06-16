import React from 'react';

import { NavBar, Icon } from 'antd-mobile';

import { connect } from 'react-redux';

import css from './index.module.scss';

import { request } from '../../utils/request';

// 导入单个房源展示组件
import HouseItem from '../../components/HouseItem';

// 百度地图全局变量保存
const BMap = window.BMap;
// 地图实例为了方便在多个地方使用，声明变量在最外面，类组件内部进行赋值
let map;

/*
  封装代码：
    1. 请求数据
    2. 绘制覆盖物
    3. 给覆盖物绑定事件


  封装注意事项：
    1. id 要传递，
    2. map 地图要变成当前文件的全局变量
*/

/* 

  renderHouses 封装渲染房源信息的函数
    id    地区唯一标识，一级市，二级区，三级街道

  需要定义一个数据：
    记录每一级的 缩放级别 和 覆盖物类名
             定位中心点       |    缩放级别       |       覆盖物类名      
  一级市：   中文自动定位      |    自动缩放       |    .map_circle(圆形)
  二级区：   根据经纬度创建    |    临时设置13     |     .map_circle(圆形)
  三级街道： 根据经纬度创建    |    临时设置15     |     .map_rect(矩形)
*/

class MapFound extends React.Component {
    // 组件状态
    state = {
        // 显示房屋列表的变量
        showHouseList: false,
        // 房源列表
        houseList: [],
    };

    // 定义地图级别对应的信息
    mapLevel = [
        { level: 1, zoom: 10, className: 'map_circle' }, // 一级市
        { level: 2, zoom: 14, className: 'map_circle' }, // 一级市
        { level: 3, zoom: 15, className: 'map_rect' }, // 一级市
    ];
    // 用于访问地图信息的索引值
    mapIndex = 0;

    zIndex = 0;

    // 移动地图的
    moveMap = e => {
        // 通过解构获取到 用户按下位置的坐标
        const { clientX, clientY } = e.changedTouches[0];
        // 水平偏移值，屏幕一半减去 用户手指x坐标值
        const x = window.screen.width / 2 - clientX;
        // 垂直偏移值，屏幕一半的一半，再减去用户手指y坐标
        const y = window.screen.height / 2 / 2 - clientY;
        // 百度地图提供的移动地图的方法
        map.panBy(x, y);
    };

    // 根据 id 查询房屋列表的
    getHouseList = async id => {
        // 根据 id 查询房屋列表信息 - 新的API
        const houseList = (await request.get('/houses?cityId=' + id)).data.body.list;
        this.setState({ houseList });
    };

    // 封装一个渲染房源信息的函数
    //   参数1: 地区 id (用于查询房源)
    //   参数2：地区 坐标点 (用于设置地图中心)
    renderHouses = async (id, center) => {
        // 2.0 获取城市的房源数据
        const houses = (await request.get('/area/map?id=' + id)).data.body;
        // 获取用于设置当前地图级别信息
        const mapInfo = this.mapLevel[this.mapIndex];
        // centerAndZoom 如果传入的是 Point 类型数据，必须设置缩放级别
        map.centerAndZoom(center, mapInfo.zoom);

        // 3.0 把 房源数据 添加到地图中
        // map.clearOverlays();
        // 遍历所有 房源数据，绘制对应的 文本覆盖物
        houses.forEach(item => {
            // 创建一个百度坐标点实例
            const point = new BMap.Point(item.coord.longitude, item.coord.latitude);
            const opts = {
                // 指定文本标注所在的地理位置
                position: point,
                offset: new BMap.Size(-30, 0), //设置文本偏移量
            };
            // 文本覆盖物中添加一个自定义的 HTML 内容
            const label = new BMap.Label(
                `<div class="${mapInfo.className}"><span>${item.label}</span><span>${item.count}套</span></div>`,
                opts
            ); // 创建文本标注对象
            // label 标签有一些默认样式，需要去掉红色边框，把白色底色变成透明
            label.setStyle({
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0)',
            });
            // 把文本绘制到地图中
            map.addOverlay(label);

            // 添加个点击事件
            // 要获取用户按下的位置，需要通过事件对象捕获坐标
            label.addEventListener('click', e => {
                label.setZIndex(++this.zIndex);
                // 疑问:如何把当前覆盖物移动到最前面，在线版没有解决的，自己试一下
                // 获取到当前点击元素的 id 值
                const newId = item.value;
                // 把当前点击的元素的坐标点实例传递过去，用于渲染房源信息时设置地图中心点
                const center = point;
                // 如果当前是第三级的房源展示
                if (mapInfo.level === 3) {
                    // 如果是第三级的房源 -> 展示列表
                    this.setState({ showHouseList: true });
                    // 调用移动地图
                    this.moveMap(e);
                    // 调用请求房源列表
                    this.getHouseList(newId);
                } else {
                    // 当点击的时候，索引值要累加
                    this.mapIndex++;
                    // 清除之前绘制的覆盖物
                    // event-loop  定时器  promise
                    //  清除覆盖物的时候，百度内部还会继续运行一些内部方法，
                    //  由于直接清除对象，对象没了，百度内部代码无法继续往后执行，所以就报错了
                    //  解决方案：加个定时器
                    setTimeout(() => {
                        map.clearOverlays();
                    }, 10);
                    // 调用封装渲染房源的方法，
                    //   参数1: 地区 id (用于查询房源)
                    //   参数2：地区 坐标点 (用于设置地图中心)
                    this.renderHouses(newId, center);
                }
            });
        });
    };
    // 生命周期函数 - 组件挂载完成时
    async componentDidMount() {
        // 从 redux 仓库中获取当前定位城市。
        // PS：如果写代码的时候不在热门城市，会没有房源数据，可以先写死个字符串体验
        const cityName = this.props.cityName;
        // const cityName = '北京';
        // 创建地图
        map = new BMap.Map('map_container'); // 创建地图实例
        // 可以直接转入城市名称，cityName 通过 redux 仓库获取中获取的
        map.centerAndZoom(cityName); // 初始化地图，设置中心点坐标和地图级别

        // 添加控件
        map.addControl(new BMap.NavigationControl());
        // 添加个定时器，避免一开始比例尺过大的问题
        setTimeout(() => {
            // 添加比例尺控件
            map.addControl(new BMap.ScaleControl());
        }, 1000);

        // 当地图开始拖拽的时候隐藏列表
        map.addEventListener('dragstart', () => {
            this.setState({ showHouseList: false });
        });

        // 1.0 发送请求获取城市 id 值
        const id = (await request.get('/area/info?name=' + cityName)).data.body.value;

        // 把房源信息渲染到地图中
        this.renderHouses(id, cityName);
    }
    render() {
        // 解构
        const { showHouseList, houseList } = this.state;
        return (
            <div>
                {/* 1.0 导航栏 开始 */}
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >
                    地图找房
                </NavBar>
                {/* 1.0 导航栏 结束 */}
                {/* 2.0 地图容器 开始 */}
                <div className={css.map}>
                    <div className={css.map_container} id="map_container"></div>
                </div>
                {/* 2.0 地图容器 结束 */}
                {/* 3.0 房屋列表 开始 */}
                {
                    // 如果是 true 才显示房源列表，条件渲染不能做动画效果，所以把代码注释掉
                    // showHouseList &&
                    <div
                        className={[
                            css.house_list,
                            // 通过添加或移除类名方式实现动画效果
                            showHouseList ? css.show : '',
                        ].join(' ')}
                    >
                        {/* 房源列表头部 */}
                        <div className={css.house_list_head}>
                            <h3 className={css.house_list_head_title}>房屋列表</h3>
                            <div className={css.house_list_head_more}>更多房源</div>
                        </div>
                        {/* 房源列表主体 */}
                        <div className={css.house_list_body}>
                            {/* 每一项房源 */}
                            {houseList.map(item => (
                                // 调用封装的单个房源展示组件
                                <HouseItem key={item.houseCode} item={item}></HouseItem>
                            ))}
                        </div>
                    </div>
                }
                {/* 3.0 房屋列表 结束 */}
            </div>
        );
    }
}

// 获取：把仓库 state 映射到组件的 props 上的函数
const mapStateToProps = state => ({
    cityName: state.address.city,
});

// connect 增强当前组件
export default connect(mapStateToProps)(MapFound);
