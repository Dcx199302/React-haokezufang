// imr 生成
import React from 'react';

// 联系代理商的方法 connect
import { connect } from 'react-redux';

import { request } from '../../utils/request';

import { NavBar, Icon, Toast } from 'antd-mobile';

import { List } from 'react-virtualized';

import css from './index.module.scss';

/* 
  长列表：
    知乎，微博，朋友圈，8小时，上千万条。
      上千万条全部都渲染到页面中会怎样？
      
      卡顿，内存不够，DOM 节点太多了。
    真实的现象：用户其实屏幕就只能看到 10 个列表内容左右，其他的列表内容可以不渲染成DOM节点。

  长列表优势：
    DOM 只在可视区域内 渲染。
 
  bug1复现：
    1. 刷新页面
    2. 点击可视区之外的字母索引
    3. 高亮字母 和 列表 的对齐就不准确了
  bug1原因：
    这个插件有点懒，并不会精确进行计算每行的真实高度，只是估算一个大概的高度(官方说的)。
  bug1解决方案：
    调用 List 组件的 measureAllRows 方法，主动计算每行的真实高度。
  
  bug2复现：
    1. 左侧列表 缓慢滚动
    2. 左侧列表有时候会突然跳转到某个错误的位置(不好复现)

  bug2原因：
    左侧滚动的时候影响到 currentIndex，currentIndex 值改变又倒过来影响左侧列表的滚动。
    使用组件 scrollToIndex 属性不够安全。
  
  bug2解决方案：
    注释掉 scrollToIndex={currentIndex} 属性代码。
    使用更安全的 scrollToRow 组件方法实现左列表的滚动。

  
  如果没有出现以上bug，说明使用插件姿势正确。
  
*/

/* 
  后端接口说明：
    只有热门城市是有房源的，其他城市没有房源。
    所以我们测试的时候，只能测试几个热门城市的数据。

  点击城市的时候三件事
    1. 获取当前城市
        非热门城市没有房源 - 提示用户没有房源 - Toast提示组件
        热门城市 - 进行后续操作
    2. 修改 redux 数据
    3. 返回上一页
*/

// cc 生成
class CitySelect extends React.Component {
    constructor() {
        super();
        this.ListRef = React.createRef();
    }
    state = {
        // 城市总列表
        finallList: [],
        // 字母列表
        letterList: [],
        // 选中分租的索引
        currentIndex: 0,
    };
    async componentDidMount() {
        // 自己最终构建的列表数据 - 用于视图渲染的
        let finallList = [];

        // 数据1： 当前城市
        const cityName = this.props.cityName;
        finallList.push({
            title: '当前城市',
            children: [{ city: cityName }],
        });

        // 通过 Promise.all() 优化请求
        const res = await Promise.all([
            request.get('/area/hot'),
            request.get('/area/city?level=1'),
        ]);

        // 数据2：热门城市
        const cityHot = res[0].data.body;
        const cityList = res[1].data.body;

        finallList.push({
            title: '热门城市',
            children: cityHot.map(v => ({ city: v.label })),
        });

        // 数据3：城市列表 - 难点
        // 城市排序 - 按缩写排序
        cityList.sort((a, b) => (a.short > b.short ? 1 : -1));

        // 1. 先拿到首字母 - 遍历
        cityList.forEach(item => {
            const firstLetter = item.short.charAt(0).toUpperCase();
            // 2. 判断首字母是否有编组，
            const index = finallList.findIndex(item => item.title === firstLetter);
            //   2.1 如果没有编组，就创建新的编组       -1
            if (index === -1) {
                // 按照首字母创建新的编组，追加到 finallList 中
                finallList.push({
                    title: firstLetter,
                    children: [{ city: item.label }],
                });
            } else {
                //   2.2 首字母已有编组，就把城市添加到 children 子数组中
                finallList[index].children.push({ city: item.label });
            }
        });

        // 右侧字母列表
        const letterList = finallList.map(v => v.title);
        // .splice(开始索引值, 删除个数, 添加的数据1, 添加的数据1)
        letterList.splice(0, 2, '#', '热');

        // 更新 state 状态，finallList 和 letterList 用于页面渲染
        this.setState({ finallList, letterList });

        // 测量所有行的精确高度
        this.ListRef.current.measureAllRows();

        console.log(this.props);
    }
    // 改变选中索引值
    changeIndex = currentIndex => {
        // 更新视图
        this.setState({ currentIndex });
        // 好像有问题。
        this.ListRef.current.scrollToRow(currentIndex);
    };
    // 计算一大行高度的函数 =>  孩子长度 * 孩子高 + 标题高
    rowHeight = ({ index }) => {
        const { finallList } = this.state;
        return finallList[index].children.length * 40 + 40;
    };
    // 获取当前城市的事件
    getCurrentCity = currentCity => {
        const { finallList } = this.state;

        const hotCity = finallList[1].children;

        const index = hotCity.findIndex(item => item.city === currentCity);

        // 非热门城市没有房源，给用户一个提示
        if (index === -1) {
            Toast.info('该城市没有房源信息', 1);
        } else {
            // 修改仓库数据
            this.props.changeStoreCity(currentCity);
            // 返回上一页
            this.props.history.goBack();
        }
    };
    // 行渲染函数 - 被 List 组件重复调用 - 负责渲染一行
    rowRenderer = ({ key, index, style }) => {
        const { finallList } = this.state;
        // 返回值类似于之前列表渲染的 map 返回的 JSX
        return (
            <div className={css.city_group} key={key} style={style}>
                {/* finallList[index] 相当于之前 map 时候的 item */}
                <div className={css.city_group_title}>{finallList[index].title}</div>
                {finallList[index].children.map(item => (
                    <div
                        key={item.city}
                        className={css.city_group_item}
                        // 给城市绑定点击事件
                        onClick={() => this.getCurrentCity(item.city)}
                    >
                        {item.city}
                    </div>
                ))}
            </div>
        );
    };

    // 当行渲染时候的回调函数
    onRowsRendered = ({ startIndex }) => {
        // 如果当前索引和行渲染后的开始索引相同，就没必要触发 setState
        if (this.state.currentIndex === startIndex) return;
        this.setState({ currentIndex: startIndex });
    };
    render() {
        // 解构 state 的数据
        const { finallList, letterList, currentIndex } = this.state;
        return (
            <div className={css.city_select}>
                {/* 1.0 antd-mobile 的 NavBar 组件 开始 */}
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    城市选择
                </NavBar>
                {/* 1.0 antd-mobile 的 NavBar 组件 结束 */}
                {/* 2.0 城市列表渲染 开始 */}
                <div className={css.city_all}>
                    {
                        // 核心组件
                        <List
                            // 给组件起个名字
                            ref={this.ListRef}
                            // 宽度 - Number
                            width={window.screen.width}
                            // 高度 - Number
                            height={window.screen.height - 45}
                            // 行数 - Number
                            rowCount={finallList.length}
                            // 行高度  - Function
                            rowHeight={this.rowHeight}
                            // 行渲染 - Function - 负责呈现一行
                            rowRenderer={this.rowRenderer}
                            // 滚动对齐
                            scrollToAlignment="start"
                            // 滚动到哪个索引
                            // scrollToIndex={currentIndex}
                            // 行渲染时的回调函数
                            onRowsRendered={this.onRowsRendered}
                        />
                    }
                </div>
                {/* 2.0 城市列表渲染 结束 */}
                {/* 3.0 右侧字母列表 开始 */}
                <div className={css.letter}>
                    {letterList.map((item, index) => (
                        <div
                            onClick={() => this.changeIndex(index)}
                            key={item}
                            className={css.letter_item}
                        >
                            <span className={currentIndex === index ? css.active : ''}>{item}</span>
                        </div>
                    ))}
                </div>
                {/* 3.0 右侧字母列表 结束 */}
            </div>
        );
    }
}

// 获取：把仓库 state 映射到组件的 props 上的函数
const mapStateToProps = state => ({
    cityName: state.address.city,
});

// 修改：把仓库 dispatch 映射到组件的 props 上的函数
const mapDispatchToProps = dispatch => ({
    changeStoreCity: currentCity => {
        // 准备个 action
        const action = {
            type: 'change_city',
            value: {
                city: currentCity,
            },
        };
        // dispatch 发送 action 实现修改
        dispatch(action);
    },
});

// connect 联系 react-redux 代理商，
// 把仓库的 state 映射到 CitySelect 组件的 props 上
export default connect(mapStateToProps, mapDispatchToProps)(CitySelect);
